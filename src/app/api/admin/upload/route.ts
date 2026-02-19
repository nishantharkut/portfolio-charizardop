import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-require-auth';
import { createFile } from '@/lib/github';

const ALLOWED_FOLDERS = ['images', 'awards', 'logos'] as const;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function safeName(original: string): string {
  const ext = original.replace(/^.*\./, '').toLowerCase() || 'jpg';
  const base = original.replace(/\.[^.]*$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 30) || 'file';
  return `${base}-${Date.now()}.${ext}`;
}

export async function POST(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form' }, { status: 400 });
  }
  const file = formData.get('file');
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }
  const folder = (formData.get('folder') as string) || 'images';
  if (!ALLOWED_FOLDERS.includes(folder as (typeof ALLOWED_FOLDERS)[number])) {
    return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }
  const name = file.name || 'image';
  const fileName = safeName(name);
  const repoPath = `public/${folder}/${fileName}`;
  const publicPath = `/${folder}/${fileName}`;
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const contentBase64 = buf.toString('base64');
    await createFile(repoPath, contentBase64, `admin: add ${publicPath}`);
    return NextResponse.json({ path: publicPath });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
