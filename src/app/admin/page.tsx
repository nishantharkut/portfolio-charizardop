import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Admin</h1>
      <p style={{ marginBottom: 12, color: 'var(--color-text-muted, #666)' }}>
        Add or edit content. Changes are committed to the repo via GitHub API; the site updates after the next deploy.
      </p>
      <p style={{ marginBottom: 24, fontSize: 13, color: 'var(--color-text-muted, #888)' }}>
        Saves and image uploads require <strong>GITHUB_TOKEN</strong> and <strong>GITHUB_REPO</strong> in your deployment environment. If saves fail, check the red error message and set these in Vercel (or your host) project settings.
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: 12 }}>
          <Link href="/admin/site" style={{ textDecoration: 'underline' }}>Site settings (hero, favicon)</Link>
        </li>
        <li style={{ marginBottom: 12 }}>
          <Link href="/admin/projects" style={{ textDecoration: 'underline' }}>Manage projects</Link>
        </li>
        <li style={{ marginBottom: 12 }}>
          <Link href="/admin/experience" style={{ textDecoration: 'underline' }}>Manage experience</Link>
        </li>
        <li>
          <Link href="/admin/achievements" style={{ textDecoration: 'underline' }}>Manage achievements</Link>
        </li>
      </ul>
    </div>
  );
}
