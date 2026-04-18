import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { getStorage } from 'firebase-admin/storage';
import { getFirebaseAdminApp, hasFirebaseAdminConfig } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function normalizeBucketName(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return '';
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
    try {
      firebaseUrl = await uploadImageToFirebase(file, `${objectDir}/${filename}`);
    } catch (error) {
      console.error('Firebase Storage upload failed:', error);

      // In production, do not attempt filesystem writes (serverless/readonly deployments).
      if (isProduction()) {
        return fail('Image upload failed. Check Firebase Storage configuration.', 200);
      }
    }

    if (firebaseUrl) {
      return NextResponse.json({
        ok: true,
        data: {
          publicPath: firebaseUrl,
        },
      });
    }

    if (isProduction()) {
      return fail(
        'Image uploads are not configured in this environment. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY (and optionally FIREBASE_STORAGE_BUCKET).',
        200
      );
    }

    const absoluteDir = path.join(process.cwd(), 'public', ...objectDir.split('/'));
    const absolutePath = path.join(absoluteDir, filename);

    await mkdir(absoluteDir, { recursive: true });
    await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));
    const relativePath = `/${objectDir}/${filename}`;
    const publicUrl = new URL(relativePath, request.url).toString();

    return NextResponse.json({
      ok: true,
      data: {
        publicPath: publicUrl,
      },
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    return fail(error instanceof Error ? error.message : 'Unable to upload image.', 500);
  }
}
