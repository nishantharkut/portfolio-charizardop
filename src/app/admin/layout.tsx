'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (isLogin) {
      setChecked(true);
      setAuthed(false);
      return;
    }
    fetch('/api/admin/check', { credentials: 'include' })
      .then((r) => {
        setChecked(true);
        if (r.ok) setAuthed(true);
        else router.replace('/admin/login?from=' + encodeURIComponent(pathname));
      })
      .catch(() => {
        setChecked(true);
        router.replace('/admin/login');
      });
  }, [isLogin, pathname, router]);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    router.replace('/admin/login');
    router.refresh();
  }

  if (!isLogin && !checked) {
    return (
      <div style={{ padding: 32, fontFamily: 'system-ui' }}>Checking auth…</div>
    );
  }

  if (isLogin) return <>{children}</>;

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <nav style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Link href="/admin" style={{ fontWeight: 600 }}>Admin</Link>
        <Link href="/admin/projects">Projects</Link>
        <Link href="/admin/experience">Experience</Link>
        <Link href="/admin/achievements">Achievements</Link>
        <button type="button" onClick={logout} style={{ marginLeft: 'auto', padding: '4px 8px' }}>Logout</button>
      </nav>
      {children}
    </div>
  );
}
