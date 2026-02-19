import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'admin_session';
const COOKIE_SALT = 'portfolio-admin';

export function getAdminSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return '';
  return createHmac('sha256', secret).update(COOKIE_SALT).digest('hex');
}

export function verifySession(cookieHeader: string | null): boolean {
  const token = getAdminSessionToken();
  if (!token) return false;
  if (!cookieHeader) return false;
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, v] = c.trim().split('=');
      return [k, v ?? ''];
    })
  );
  const session = cookies[COOKIE_NAME];
  if (!session || session.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(session), Buffer.from(token));
  } catch {
    return false;
  }
}

export function getSetCookieHeader(): string {
  const token = getAdminSessionToken();
  if (!token) return '';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`; // 24h
}

export function getClearCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
