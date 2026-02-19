import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const cookie = request.headers.get('cookie');
  if (!verifySession(cookie)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
