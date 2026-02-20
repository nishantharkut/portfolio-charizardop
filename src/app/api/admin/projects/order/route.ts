import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-require-auth';
import { getFile, updateFile } from '@/lib/github';
import type { Project } from '@/data';

const FILE_PATH = 'src/data/projects.json';

export async function PUT(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  let body: { ids?: number[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const ids = body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids array required' }, { status: 400 });
  }
  try {
    const { content, sha } = await getFile(FILE_PATH);
    const data = JSON.parse(content) as { projects: Project[] };
    const projects = data.projects ?? [];
    const byId = new Map(projects.map((p) => [p.id, p]));
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean) as Project[];
    if (ordered.length !== ids.length) {
      return NextResponse.json({ error: 'Some ids not found' }, { status: 400 });
    }
    const newContent = JSON.stringify({ projects: ordered }, null, 2);
    await updateFile(FILE_PATH, newContent, 'admin: reorder projects', sha);
    return NextResponse.json({ ok: true, order: ordered.map((p) => p.id) });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update repo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
