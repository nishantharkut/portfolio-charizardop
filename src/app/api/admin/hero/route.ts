import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-require-auth';
import { getFile, updateFile } from '@/lib/github';
import type { HeroData } from '@/data';

const FILE_PATH = 'src/data/hero.json';

export async function PUT(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  let body: HeroData;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  try {
    const { content: _content, sha } = await getFile(FILE_PATH);
    const newContent = JSON.stringify(body, null, 2);
    await updateFile(FILE_PATH, newContent, 'admin: update hero', sha);
    return NextResponse.json(body);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update repo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
