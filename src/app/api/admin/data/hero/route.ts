import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-require-auth';
import { getHeroData } from '@/data';

export async function GET(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;
  return NextResponse.json(getHeroData());
}
