import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { NextResponse } from 'next/server';

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return fail('Image file is required.');
    }

    const extension = path.extname(file.name) || '.png';
    const safeBaseName = path
      .basename(file.name, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'product-image';
    const filename = `${Date.now()}-${safeBaseName}${extension.toLowerCase()}`;
    const relativeDir = path.join('uploads', 'products');
    const absoluteDir = path.join(process.cwd(), 'public', relativeDir);
    const absolutePath = path.join(absoluteDir, filename);

    await mkdir(absoluteDir, { recursive: true });
    await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({
      ok: true,
      data: {
        publicPath: `/${relativeDir.replace(/\\/g, '/')}/${filename}`,
      },
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Unable to upload image.', 500);
  }
}
