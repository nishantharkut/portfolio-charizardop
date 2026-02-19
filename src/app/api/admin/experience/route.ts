import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-require-auth';
import { getFile, updateFile } from '@/lib/github';
import type { ExperienceItem } from '@/data';

const FILE_PATH = 'src/data/experience.json';

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
    const data = JSON.parse(content) as { experienceData: ExperienceItem[]; coreSkills: string[]; highlights: unknown[]; technologyEvolution: unknown[] };
    const experienceData = data.experienceData ?? [];
    const maxId = experienceData.length ? Math.max(...experienceData.map((e) => e.id)) : 0;
    const newItem: ExperienceItem = {
      id: maxId + 1,
      position: String(body.position ?? ''),
      company: String(body.company ?? ''),
      year: String(body.year ?? ''),
      duration: String(body.duration ?? ''),
      months: body.months ? String(body.months) : undefined,
      description: String(body.description ?? ''),
      responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities as string[] : parseArray(String(body.responsibilities ?? '')),
      technologies: Array.isArray(body.technologies) ? body.technologies as string[] : parseArray(String(body.technologies ?? '')),
      achievements: Array.isArray(body.achievements) ? body.achievements as string[] : parseArray(String(body.achievements ?? '')),
      logo: body.logo ? String(body.logo) : undefined,
    };
    experienceData.push(newItem);
    const newContent = JSON.stringify({ ...data, experienceData }, null, 2);
    await updateFile(FILE_PATH, newContent, 'admin: add experience', sha);
    return NextResponse.json(newItem);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update repo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  let body: ExperienceItem;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (body.id == null) return NextResponse.json({ error: 'id required' }, { status: 400 });
  try {
    const { content, sha } = await getFile(FILE_PATH);
    const data = JSON.parse(content) as { experienceData: ExperienceItem[]; coreSkills: string[]; highlights: unknown[]; technologyEvolution: unknown[] };
    const experienceData = data.experienceData ?? [];
    const idx = experienceData.findIndex((e) => e.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    experienceData[idx] = {
      ...body,
      responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : parseArray(String(body.responsibilities)),
      technologies: Array.isArray(body.technologies) ? body.technologies : parseArray(String(body.technologies)),
      achievements: Array.isArray(body.achievements) ? body.achievements : parseArray(String(body.achievements)),
    };
    const newContent = JSON.stringify({ ...data, experienceData }, null, 2);
    await updateFile(FILE_PATH, newContent, 'admin: update experience', sha);
    return NextResponse.json(experienceData[idx]);
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
    const data = JSON.parse(content) as { experienceData: ExperienceItem[]; coreSkills: string[]; highlights: unknown[]; technologyEvolution: unknown[] };
    const experienceData = (data.experienceData ?? []).filter((e) => e.id !== numId);
    if (experienceData.length === (data.experienceData ?? []).length) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    const newContent = JSON.stringify({ ...data, experienceData }, null, 2);
    await updateFile(FILE_PATH, newContent, 'admin: delete experience', sha);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update repo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
