'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './admin.css';

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
    return <div className="admin-wrap admin-loading">Checking auth…</div>;
  }

  if (isLogin) return <>{children}</>;

  return (
    <div className="admin-wrap">
      <nav className="admin-nav">
        <Link href="/admin" data-active={pathname === '/admin'}>Admin</Link>
        <Link href="/admin/projects" data-active={pathname === '/admin/projects'}>Projects</Link>
        <Link href="/admin/experience" data-active={pathname === '/admin/experience'}>Experience</Link>
        <Link href="/admin/achievements" data-active={pathname === '/admin/achievements'}>Achievements</Link>
        <button type="button" className="admin-logout" onClick={logout}>Logout</button>
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}
