import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-require-auth';
import { getFile, updateFile, createFile } from '@/lib/github';
import type { SiteConfig } from '@/data';

const FILE_PATH = 'src/data/site.json';

export async function PUT(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  let body: Partial<SiteConfig> & { faviconPath: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body?.faviconPath || typeof body.faviconPath !== 'string') {
    return NextResponse.json({ error: 'faviconPath is required' }, { status: 400 });
  }
  const payload: SiteConfig = {
    faviconPath: body.faviconPath,
    ogImagePath: body.ogImagePath ?? undefined,
    twitterImagePath: body.twitterImagePath ?? undefined,
  };
  try {
    const newContent = JSON.stringify(payload, null, 2);
    const contentBase64 = Buffer.from(newContent, 'utf8').toString('base64');
    try {
      const { sha } = await getFile(FILE_PATH);
      await updateFile(FILE_PATH, newContent, 'admin: update site config', sha);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('404') || msg.includes('not found')) {
        await createFile(FILE_PATH, contentBase64, 'admin: add site config');
      } else {
        throw e;
      }
    }
    return NextResponse.json(payload);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update repo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
