import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-require-auth';
import { getProjects } from '@/data';

export async function GET(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  const projects = getProjects();
  return NextResponse.json(projects);
}
