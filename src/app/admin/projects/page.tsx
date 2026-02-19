'use client';

import { useEffect, useState } from 'react';
import type { Project } from '@/data';

const defaultProject: Partial<Project> = {
  title: '',
  category: '',
  shortDescription: '',
  fullDescription: '',
  techStack: [],
  implementation: [],
  liveLink: '',
  githubLink: '',
  image: '',
  featured: false,
};

export default function AdminProjectsPage() {
  const [list, setList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Partial<Project>>(defaultProject);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch('/api/admin/data/projects', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Unauthorized'))))
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditingId(null);
    setForm(defaultProject);
  }

  function openEdit(p: Project) {
    setEditingId(p.id);
    setForm({ ...p });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const url = editingId ? '/api/admin/projects' : '/api/admin/projects';
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...form, id: editingId } : form;
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'Failed');
        if (editingId) setList((prev) => prev.map((p) => (p.id === editingId ? data : p)));
        else setList((prev) => [...prev, data]);
        setForm(defaultProject);
        setEditingId(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  }

  function remove(id: number) {
    if (!confirm('Delete this project?')) return;
    setSaving(true);
    fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE', credentials: 'include' })
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
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Projects</h1>
      {error && <p style={{ color: 'crimson', marginBottom: 8 }}>{error}</p>}
      <button type="button" onClick={openAdd} style={{ marginBottom: 16, padding: '6px 12px' }}>Add project</button>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 16, border: '1px solid #ccc', maxWidth: 500 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>{editingId ? 'Edit' : 'New'} project</h2>
        <label style={label}>Title</label>
        <input style={ss} value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
        <label style={label}>Category</label>
        <input style={ss} value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
        <label style={label}>Short description</label>
        <textarea style={{ ...ss, minHeight: 60 }} value={form.shortDescription ?? ''} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} />
        <label style={label}>Full description</label>
        <textarea style={{ ...ss, minHeight: 80 }} value={form.fullDescription ?? ''} onChange={(e) => setForm((f) => ({ ...f, fullDescription: e.target.value }))} />
        <label style={label}>Tech stack (comma-separated)</label>
        <input style={ss} value={Array.isArray(form.techStack) ? form.techStack.join(', ') : ''} onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) }))} />
        <label style={label}>Implementation (one per line)</label>
        <textarea style={{ ...ss, minHeight: 80 }} value={Array.isArray(form.implementation) ? form.implementation.join('\n') : ''} onChange={(e) => setForm((f) => ({ ...f, implementation: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) }))} />
        <label style={label}>Live link</label>
        <input style={ss} value={form.liveLink ?? ''} onChange={(e) => setForm((f) => ({ ...f, liveLink: e.target.value }))} />
        <label style={label}>GitHub link</label>
        <input style={ss} value={form.githubLink ?? ''} onChange={(e) => setForm((f) => ({ ...f, githubLink: e.target.value }))} />
        <label style={label}>Image path</label>
        <input style={ss} value={form.image ?? ''} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="/images/name.jpg" />
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
            <strong>{p.title}</strong> — {p.category}
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
