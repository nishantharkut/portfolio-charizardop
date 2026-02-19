'use client';

import { useEffect, useState } from 'react';
import type { Project } from '@/data';
import { ImageUpload } from '../components/ImageUpload';

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
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...form, id: editingId } : form;
    fetch('/api/admin/projects', {
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

  if (loading) return <div className="admin-loading">Loading…</div>;
  if (error && list.length === 0) return <div className="admin-error">{error}</div>;

  return (
    <div>
      <h1 className="admin-page-title">Projects</h1>
      {error && <div className="admin-error">{error}</div>}
      <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd} style={{ marginBottom: 16 }}>Add project</button>

      <div className="admin-card">
        <h2>{editingId ? 'Edit' : 'New'} project</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Title</label>
            <input className="admin-input" value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          </div>
          <div className="admin-form-group">
            <label>Category</label>
            <input className="admin-input" value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Short description</label>
            <textarea className="admin-input" style={{ minHeight: 80 }} value={form.shortDescription ?? ''} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Full description</label>
            <textarea className="admin-input" style={{ minHeight: 100 }} value={form.fullDescription ?? ''} onChange={(e) => setForm((f) => ({ ...f, fullDescription: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Tech stack (comma-separated)</label>
            <input className="admin-input" value={Array.isArray(form.techStack) ? form.techStack.join(', ') : ''} onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) }))} />
          </div>
          <div className="admin-form-group">
            <label>Implementation (one per line)</label>
            <textarea className="admin-input" style={{ minHeight: 100 }} value={Array.isArray(form.implementation) ? form.implementation.join('\n') : ''} onChange={(e) => setForm((f) => ({ ...f, implementation: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) }))} />
          </div>
          <div className="admin-form-group">
            <label>Live link</label>
            <input className="admin-input" type="url" value={form.liveLink ?? ''} onChange={(e) => setForm((f) => ({ ...f, liveLink: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>GitHub link</label>
            <input className="admin-input" type="url" value={form.githubLink ?? ''} onChange={(e) => setForm((f) => ({ ...f, githubLink: e.target.value }))} />
          </div>
          <ImageUpload folder="images" label="Image" value={form.image ?? ''} onChange={(path) => setForm((f) => ({ ...f, image: path }))} />
          <div className="admin-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.featured ?? false} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
              Featured
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? '…' : editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" className="admin-btn" onClick={openAdd}>Cancel</button>}
          </div>
        </form>
      </div>

      <ul className="admin-list">
        {list.map((p) => (
          <li key={p.id} className="admin-list-item">
            <strong>{p.title}</strong> — {p.category}
            <div className="admin-item-actions">
              <button type="button" onClick={() => openEdit(p)}>Edit</button>
              <button type="button" onClick={() => remove(p.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
