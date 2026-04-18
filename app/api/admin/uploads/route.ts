import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { getStorage } from 'firebase-admin/storage';
import { getFirebaseAdminApp, hasFirebaseAdminConfig } from '@/lib/firebase/admin';
import { shopifyGraphQL } from '@/lib/shopify/client';

export const runtime = 'nodejs';

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024; // 6MB

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function isLikelyServerlessFilesystem() {
  return Boolean(
    process.env.VERCEL ||
      process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.FUNCTION_NAME
  );
}

function canAttemptFilesystemUpload() {
  if (!isProduction()) {
    return true;
  }

  const allowOverride = process.env.UPLOADS_ALLOW_FILESYSTEM?.trim().toLowerCase();
  if (allowOverride === 'true' || allowOverride === '1' || allowOverride === 'yes') {
    return true;
  }

  return !isLikelyServerlessFilesystem();
}

function normalizeBucketName(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return '';
  }

  if (/^gs:\/\//i.test(trimmed)) {
    return trimmed.replace(/^gs:\/\//i, '').split('/')[0] ?? '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).hostname;
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

function normalizeUpstreamErrorMessage(message: string) {
  const normalized = message.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 240) {
    return normalized;
  }

  return `${normalized.slice(0, 240)}…`;
}

function buildFirebaseUploadErrorMessage(error: unknown) {
  const candidates = getFirebaseStorageBucketCandidates();
  const candidateText = candidates.length ? ` Tried buckets: ${candidates.join(', ')}.` : '';
  const message = error instanceof Error ? error.message : String(error);
  const safeMessage = message ? normalizeUpstreamErrorMessage(message) : '';
  const codeRaw =
    error && typeof error === 'object' && 'code' in error
      ? (error as { code?: unknown }).code
      : undefined;
  const code = typeof codeRaw === 'number' ? codeRaw : Number.isFinite(Number(codeRaw)) ? Number(codeRaw) : null;

  if (!hasFirebaseAdminConfig()) {
    return (
      'Image uploads are not configured in this environment. ' +
      'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY (and optionally FIREBASE_STORAGE_BUCKET).'
    );
  }

  if (!candidates.length) {
    return (
      'Firebase Storage bucket is not configured. ' +
      'Set FIREBASE_STORAGE_BUCKET (or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) to your Firebase Storage bucket name.'
    );
  }

  const base = `Image upload failed.${candidateText}`;

  if (code === 404 || /not\s*found|no\s*such\s*bucket|unknown\s*bucket/i.test(safeMessage)) {
    return (
      `${base} Firebase Storage bucket was not found. ` +
      'Open Firebase Console → Storage to provision the bucket, then set FIREBASE_STORAGE_BUCKET to the bucket name (often <projectId>.appspot.com).'
    );
  }

  if (code === 403 || /permission|forbidden|insufficient\s*permissions/i.test(safeMessage)) {
    return (
      `${base} Firebase credentials do not have permission to write to this bucket. ` +
      'Grant the service account a Storage role (for example, Storage Object Admin) for the bucket in Google Cloud IAM.'
    );
  }

  if (code === 401 || /unauthorized|invalid\s*credential|invalid\s*jwt|invalid\s*grant/i.test(safeMessage)) {
    return (
      `${base} Firebase Admin credentials look invalid. ` +
      'Re-check FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY formatting (the private key must preserve newlines).'
    );
  }

  return safeMessage ? `${base} Upstream: ${safeMessage}` : base;
}

function getFirebaseStorageBucketCandidates() {
  const candidates = new Set<string>();

  const explicitBucket = normalizeBucketName(process.env.FIREBASE_STORAGE_BUCKET);
  if (explicitBucket) {
    candidates.add(explicitBucket);
  }

  const publicBucket = normalizeBucketName(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  if (publicBucket) {
    candidates.add(publicBucket);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  if (projectId) {
    // Historically the default bucket was <projectId>.appspot.com.
    // Keep this as a fallback because some projects still use it.
    candidates.add(`${projectId}.appspot.com`);
  }

  return [...candidates].filter(Boolean);
}

function buildFirebaseDownloadUrl(bucketName: string, objectPath: string, token: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    objectPath
  )}?alt=media&token=${token}`;
}

function formatShopifyUserErrors(userErrors?: Array<{ field?: string[] | null; message: string }>) {
  return userErrors?.map((entry) => entry.message).filter(Boolean).join('; ') ?? '';
}

async function uploadImageToShopify(file: File, filename: string) {
  const extension = path.extname(filename).toLowerCase();
  const contentType =
    file.type?.trim() || (extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : 'image/jpeg');
  const stagedUploadMutation = `
    mutation StagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const stagedUploadData = await shopifyGraphQL<{
    stagedUploadsCreate: {
      stagedTargets: Array<{
        url: string;
        resourceUrl: string;
        parameters: Array<{ name: string; value: string }>;
      }>;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(stagedUploadMutation, {
    input: [
      {
        filename,
        mimeType: contentType,
        httpMethod: 'POST',
        resource: 'IMAGE',
      },
    ],
  });

  const stagedUploadError = formatShopifyUserErrors(stagedUploadData.stagedUploadsCreate.userErrors);
  if (stagedUploadError) {
    throw new Error(stagedUploadError);
  }

  const stagedTarget = stagedUploadData.stagedUploadsCreate.stagedTargets[0];
  if (!stagedTarget) {
    throw new Error('Shopify did not return a staged upload target for the image.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const formData = new FormData();
  for (const parameter of stagedTarget.parameters) {
    formData.append(parameter.name, parameter.value);
  }

  formData.append('file', new Blob([buffer], { type: contentType }), filename);

  const uploadResponse = await fetch(stagedTarget.url, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    const body = await uploadResponse.text().catch(() => '');
    throw new Error(
      `Shopify image upload failed (${uploadResponse.status} ${uploadResponse.statusText}). ${normalizeUpstreamErrorMessage(body)}`.trim()
    );
  }

  const fileCreateMutation = `
    mutation FileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          __typename
          ... on MediaImage {
            id
            image {
              url
              altText
            }
            preview {
              image {
                url
              }
            }
          }
          ... on Video {
            id
          }
          ... on Model3d {
            id
          }
          ... on ExternalVideo {
            id
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const fileCreateData = await shopifyGraphQL<{
    fileCreate: {
      files: Array<{
        __typename?: string;
        id?: string;
        image?: { url?: string; altText?: string } | null;
        preview?: { image?: { url?: string } | null } | null;
      } | null>;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(fileCreateMutation, {
    files: [
      {
        originalSource: stagedTarget.resourceUrl,
      },
    ],
  });

  const fileCreateError = formatShopifyUserErrors(fileCreateData.fileCreate.userErrors);
  if (fileCreateError) {
    throw new Error(fileCreateError);
  }

  const createdFile = fileCreateData.fileCreate.files?.[0];
  if (!createdFile) {
    console.error('fileCreate response had no files:', JSON.stringify(fileCreateData, null, 2));
    throw new Error('Shopify fileCreate returned empty files array.');
  }

  // Try to get URL from image.url first, then fall back to preview.image.url
  let cdnUrl = createdFile?.image?.url?.trim() || createdFile?.preview?.image?.url?.trim();

  if (!cdnUrl) {
    console.error(
      'fileCreate returned file but no image URL in either image.url or preview.image.url:',
      JSON.stringify(
        {
          __typename: createdFile.__typename,
          id: createdFile.id,
          image: createdFile.image,
          preview: createdFile.preview,
        },
        null,
        2
      )
    );
    throw new Error(
      `Shopify fileCreate returned file but no image URL. Type: ${createdFile.__typename || 'unknown'}. Full response: ${JSON.stringify(createdFile)}`
    );
  }

  return cdnUrl;
}

async function uploadImageToFirebase(file: File, objectPath: string) {
  if (!hasFirebaseAdminConfig()) {
    return null;
  }

  const bucketCandidates = getFirebaseStorageBucketCandidates();
  if (!bucketCandidates.length) {
    return null;
  }

  const token = randomUUID();
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type?.trim() || 'application/octet-stream';

  const storage = getStorage(getFirebaseAdminApp());

  let lastError: unknown = null;
  for (const bucketName of bucketCandidates) {
    try {
      const bucket = storage.bucket(bucketName);
      const remoteFile = bucket.file(objectPath);

      await remoteFile.save(buffer, {
        resumable: false,
        metadata: {
          contentType,
          metadata: {
            firebaseStorageDownloadTokens: token,
          },
        },
      });

      return buildFirebaseDownloadUrl(bucket.name, objectPath, token);
    } catch (error) {
      lastError = error;
      console.error(`Firebase Storage upload failed for bucket '${bucketName}':`, error);
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return fail('Image file is required.');
    }

    if (typeof file.size === 'number' && file.size > MAX_UPLOAD_BYTES) {
      return fail('Image file must be 6MB or smaller.');
    }

    if (file.type && !file.type.startsWith('image/')) {
      return fail('Only image uploads are supported.');
    }

    const extension = path.extname(file.name) || '.png';
    const safeBaseName = path
      .basename(file.name, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'product-image';
    const filename = `${Date.now()}-${safeBaseName}${extension.toLowerCase()}`;
    const objectDir = 'uploads/products';

    let firebaseUrl: string | null = null;
    let firebaseError: unknown = null;
    try {
      firebaseUrl = await uploadImageToFirebase(file, `${objectDir}/${filename}`);
    } catch (error) {
      firebaseError = error;
      console.error('Firebase Storage upload failed:', error);
    }

    if (firebaseUrl) {
      return NextResponse.json({
        ok: true,
        data: {
          publicPath: firebaseUrl,
        },
      });
    }

    if (isProduction() && !canAttemptFilesystemUpload()) {
      try {
        const shopifyUrl = await uploadImageToShopify(file, filename);
        return NextResponse.json({
          ok: true,
          data: {
            publicPath: shopifyUrl,
          },
        });
      } catch (error) {
        console.error('Shopify upload fallback failed:', error);
        const firebaseMessage = firebaseError ? buildFirebaseUploadErrorMessage(firebaseError) : null;
        const shopifyMessage = error instanceof Error ? normalizeUpstreamErrorMessage(error.message) : String(error);

        return fail(
          [
            firebaseMessage ? firebaseMessage : 'Firebase Storage upload is unavailable.',
            'This deployment also appears to have a read-only filesystem, so local uploads are not available.',
            `Shopify upload fallback failed: ${shopifyMessage}`,
          ].join(' '),
          200
        );
      }
    }

    const absoluteDir = path.join(process.cwd(), 'public', ...objectDir.split('/'));
    const absolutePath = path.join(absoluteDir, filename);

    await mkdir(absoluteDir, { recursive: true });
    await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));
    const relativePath = `/${objectDir}/${filename}`;

    return NextResponse.json({
      ok: true,
      data: {
        // Keep this as a relative path so next/image treats it as a local asset.
        publicPath: relativePath,
      },
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    return fail(error instanceof Error ? error.message : 'Unable to upload image.', 500);
  }
}
