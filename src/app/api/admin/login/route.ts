import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionToken, getSetCookieHeader } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 503 });
  }
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  if (body.password !== secret) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  const cookieHeader = getSetCookieHeader();
  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', cookieHeader);
  return res;
}
