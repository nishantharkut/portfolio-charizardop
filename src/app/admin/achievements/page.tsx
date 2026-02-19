'use client';

import { useEffect, useState } from 'react';
import type { Achievement } from '@/data';

const defaultItem: Partial<Achievement> = {
  title: '',
  category: '',
  description: '',
  details: '',
  date: '',
  organization: '',
  link: '',
  image: '',
  badge: '',
  impact: [],
  featured: false,
};

export default function AdminAchievementsPage() {
  const [list, setList] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Partial<Achievement>>(defaultItem);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch('/api/admin/data/achievements', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Unauthorized'))))
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditingId(null);
    setForm(defaultItem);
  }

  function openEdit(p: Achievement) {
    setEditingId(p.id);
    setForm({ ...p });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...form, id: editingId } : form;
    fetch('/api/admin/achievements', { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) })
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'Failed');
        if (editingId) setList((prev) => prev.map((p) => (p.id === editingId ? data : p)));
        else setList((prev) => [...prev, data]);
        setForm(defaultItem);
        setEditingId(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  }

  function remove(id: number) {
    if (!confirm('Delete this achievement?')) return;
    setSaving(true);
    fetch(`/api/admin/achievements?id=${id}`, { method: 'DELETE', credentials: 'include' })
      .then((r) => (r.ok ? undefined : r.json().then((d) => Promise.reject(new Error(d.error)))))
      .then(() => setList((prev) => prev.filter((p) => p.id !== id)))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  }

  const ss = { marginBottom: 8, display: 'block', width: '100%', maxWidth: 400, padding: 6, boxSizing: 'border-box' as const };
  const label = { display: 'block', marginTop: 12, marginBottom: 2, fontSize: 14 };

  if (loading) return <p>Loading…</p>;
  if (error && list.length === 0) return <p style={{ color: 'crimson' }}>{error}</p>;

  return (
    <div>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Achievements</h1>
      {error && <p style={{ color: 'crimson', marginBottom: 8 }}>{error}</p>}
      <button type="button" onClick={openAdd} style={{ marginBottom: 16, padding: '6px 12px' }}>Add achievement</button>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 16, border: '1px solid #ccc', maxWidth: 500 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>{editingId ? 'Edit' : 'New'} achievement</h2>
        <label style={label}>Title</label>
        <input style={ss} value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
        <label style={label}>Category</label>
        <input style={ss} value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
        <label style={label}>Description</label>
        <textarea style={{ ...ss, minHeight: 50 }} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        <label style={label}>Details</label>
        <textarea style={{ ...ss, minHeight: 60 }} value={form.details ?? ''} onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))} />
        <label style={label}>Date</label>
        <input style={ss} value={form.date ?? ''} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
        <label style={label}>Organization</label>
        <input style={ss} value={form.organization ?? ''} onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))} />
        <label style={label}>Link</label>
        <input style={ss} value={form.link ?? ''} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
        <label style={label}>Image path</label>
        <input style={ss} value={form.image ?? ''} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="/awards/name.webp" />
        <label style={label}>Badge (emoji)</label>
        <input style={ss} value={form.badge ?? ''} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} placeholder="🏆" />
        <label style={label}>Impact (one per line)</label>
        <textarea style={{ ...ss, minHeight: 60 }} value={Array.isArray(form.impact) ? form.impact.join('\n') : ''} onChange={(e) => setForm((f) => ({ ...f, impact: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) }))} />
        <label style={{ ...label, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={form.featured ?? false} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
          Featured
        </label>
        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={saving} style={{ padding: '6px 14px' }}>{saving ? '…' : editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" onClick={openAdd} style={{ marginLeft: 8, padding: '6px 14px' }}>Cancel</button>}
        </div>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {list.map((p) => (
          <li key={p.id} style={{ marginBottom: 12, padding: 8, border: '1px solid #eee' }}>
            <strong>{p.title}</strong> — {p.category} ({p.date})
            <div style={{ marginTop: 4 }}>
              <button type="button" onClick={() => openEdit(p)} style={{ marginRight: 8, padding: '2px 8px', fontSize: 13 }}>Edit</button>
              <button type="button" onClick={() => remove(p.id)} style={{ padding: '2px 8px', fontSize: 13 }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
