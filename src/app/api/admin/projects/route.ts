import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-require-auth';
import { getFile, updateFile } from '@/lib/github';
import type { Project } from '@/data';

const FILE_PATH = 'src/data/projects.json';

function parseArray(s: string): string[] {
  if (!s || typeof s !== 'string') return [];
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

export async function POST(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  try {
    const { content, sha } = await getFile(FILE_PATH);
    const data = JSON.parse(content) as { projects: Project[] };
    const projects = data.projects ?? [];
    const maxId = projects.length ? Math.max(...projects.map((p) => p.id)) : 0;
    const newProject: Project = {
      id: maxId + 1,
      title: String(body.title ?? ''),
      category: String(body.category ?? ''),
      shortDescription: String(body.shortDescription ?? ''),
      fullDescription: String(body.fullDescription ?? ''),
      techStack: Array.isArray(body.techStack) ? body.techStack : parseArray(String(body.techStack ?? '')),
      implementation: Array.isArray(body.implementation) ? body.implementation : parseArray(String(body.implementation ?? '')),
      liveLink: body.liveLink ? String(body.liveLink) : undefined,
      githubLink: body.githubLink ? String(body.githubLink) : undefined,
      image: String(body.image ?? ''),
      featured: Boolean(body.featured),
    };
    projects.push(newProject);
    const newContent = JSON.stringify({ projects }, null, 2);
    await updateFile(FILE_PATH, newContent, 'admin: add project', sha);
    return NextResponse.json(newProject);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update repo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  let body: Project;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (body.id == null) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }
  try {
    const { content, sha } = await getFile(FILE_PATH);
    const data = JSON.parse(content) as { projects: Project[] };
    const projects = data.projects ?? [];
    const idx = projects.findIndex((p) => p.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    projects[idx] = {
      ...body,
      techStack: Array.isArray(body.techStack) ? body.techStack : parseArray(String(body.techStack)),
      implementation: Array.isArray(body.implementation) ? body.implementation : parseArray(String(body.implementation)),
    };
    const newContent = JSON.stringify({ projects }, null, 2);
    await updateFile(FILE_PATH, newContent, 'admin: update project', sha);
    return NextResponse.json(projects[idx]);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update repo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id == null) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    const { content, sha } = await getFile(FILE_PATH);
    const data = JSON.parse(content) as { projects: Project[] };
    const projects = (data.projects ?? []).filter((p) => p.id !== numId);
    if (projects.length === (data.projects ?? []).length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    const newContent = JSON.stringify({ projects }, null, 2);
    await updateFile(FILE_PATH, newContent, 'admin: delete project', sha);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update repo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
