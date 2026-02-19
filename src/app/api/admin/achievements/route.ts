import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-require-auth';
import { getFile, updateFile } from '@/lib/github';
import type { Achievement } from '@/data';

const FILE_PATH = 'src/data/achievements.json';

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
    const data = JSON.parse(content) as { achievements: Achievement[]; certifications: unknown[]; awards: unknown[] };
    const achievements = data.achievements ?? [];
    const maxId = achievements.length ? Math.max(...achievements.map((a) => a.id)) : 0;
    const newItem: Achievement = {
      id: maxId + 1,
      title: String(body.title ?? ''),
      category: String(body.category ?? ''),
      description: String(body.description ?? ''),
      details: String(body.details ?? ''),
      date: String(body.date ?? ''),
      organization: body.organization ? String(body.organization) : undefined,
      link: body.link ? String(body.link) : undefined,
      image: String(body.image ?? ''),
      badge: body.badge ? String(body.badge) : undefined,
      impact: Array.isArray(body.impact) ? body.impact as string[] : parseArray(String(body.impact ?? '')),
      featured: Boolean(body.featured),
    };
    achievements.push(newItem);
    const newContent = JSON.stringify({ ...data, achievements }, null, 2);
    await updateFile(FILE_PATH, newContent, 'admin: add achievement', sha);
    return NextResponse.json(newItem);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update repo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  let body: Achievement;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (body.id == null) return NextResponse.json({ error: 'id required' }, { status: 400 });
  try {
    const { content, sha } = await getFile(FILE_PATH);
    const data = JSON.parse(content) as { achievements: Achievement[]; certifications: unknown[]; awards: unknown[] };
    const achievements = data.achievements ?? [];
    const idx = achievements.findIndex((a) => a.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    achievements[idx] = {
      ...body,
      impact: Array.isArray(body.impact) ? body.impact : parseArray(String(body.impact)),
    };
    const newContent = JSON.stringify({ ...data, achievements }, null, 2);
    await updateFile(FILE_PATH, newContent, 'admin: update achievement', sha);
    return NextResponse.json(achievements[idx]);
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
    const data = JSON.parse(content) as { achievements: Achievement[]; certifications: unknown[]; awards: unknown[] };
    const achievements = (data.achievements ?? []).filter((a) => a.id !== numId);
    if (achievements.length === (data.achievements ?? []).length) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }
    const newContent = JSON.stringify({ ...data, achievements }, null, 2);
    await updateFile(FILE_PATH, newContent, 'admin: delete achievement', sha);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update repo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
