import { NextResponse } from 'next/server';
import { getClearCookieHeader } from '@/lib/admin-auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', getClearCookieHeader());
  return res;
}
