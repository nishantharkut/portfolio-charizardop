import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/admin-auth';

export function requireAdmin(request: NextRequest): NextResponse | null {
  const cookie = request.headers.get('cookie');
  if (!verifySession(cookie)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
