import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-require-auth';
import { getAchievements } from '@/data';

export async function GET(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  const achievements = getAchievements();
  return NextResponse.json(achievements);
}
