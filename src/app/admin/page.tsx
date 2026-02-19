import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Admin</h1>
      <p style={{ marginBottom: 24, color: 'var(--color-text-muted, #666)' }}>
        Add or edit content. Changes are committed to the repo via GitHub API; the site updates after deploy.
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
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
