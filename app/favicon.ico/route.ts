import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  const iconPath = path.join(process.cwd(), 'public', 'veritra.png');
  const iconBuffer = await readFile(iconPath);

  return new Response(iconBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
