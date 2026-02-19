'use client';

import { useEffect, useState } from 'react';
import type { ExperienceItem } from '@/data';

const defaultItem: Partial<ExperienceItem> = {
  position: '',
  company: '',
  year: '',
  duration: '',
  months: '',
  description: '',
  responsibilities: [],
  technologies: [],
  achievements: [],
  logo: '',
};

export default function AdminExperiencePage() {
  const [list, setList] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Partial<ExperienceItem>>(defaultItem);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch('/api/admin/data/experience', { credentials: 'include' })
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

  function openEdit(p: ExperienceItem) {
    setEditingId(p.id);
    setForm({ ...p });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const url = '/api/admin/experience';
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...form, id: editingId } : form;
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) })
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
    if (!confirm('Delete this experience?')) return;
    setSaving(true);
    fetch(`/api/admin/experience?id=${id}`, { method: 'DELETE', credentials: 'include' })
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
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Experience</h1>
      {error && <p style={{ color: 'crimson', marginBottom: 8 }}>{error}</p>}
      <button type="button" onClick={openAdd} style={{ marginBottom: 16, padding: '6px 12px' }}>Add experience</button>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 16, border: '1px solid #ccc', maxWidth: 500 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>{editingId ? 'Edit' : 'New'} experience</h2>
        <label style={label}>Position</label>
        <input style={ss} value={form.position ?? ''} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} required />
        <label style={label}>Company</label>
        <input style={ss} value={form.company ?? ''} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} required />
        <label style={label}>Year</label>
        <input style={ss} value={form.year ?? ''} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} />
        <label style={label}>Duration (e.g. Aug. 2025 - Present)</label>
        <input style={ss} value={form.duration ?? ''} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
        <label style={label}>Months (e.g. 6 months)</label>
        <input style={ss} value={form.months ?? ''} onChange={(e) => setForm((f) => ({ ...f, months: e.target.value }))} />
        <label style={label}>Description</label>
        <textarea style={{ ...ss, minHeight: 60 }} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        <label style={label}>Responsibilities (one per line)</label>
        <textarea style={{ ...ss, minHeight: 80 }} value={Array.isArray(form.responsibilities) ? form.responsibilities.join('\n') : ''} onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) }))} />
        <label style={label}>Technologies (comma-separated)</label>
        <input style={ss} value={Array.isArray(form.technologies) ? form.technologies.join(', ') : ''} onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) }))} />
        <label style={label}>Achievements (one per line)</label>
        <textarea style={{ ...ss, minHeight: 60 }} value={Array.isArray(form.achievements) ? form.achievements.join('\n') : ''} onChange={(e) => setForm((f) => ({ ...f, achievements: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) }))} />
        <label style={label}>Logo path</label>
        <input style={ss} value={form.logo ?? ''} onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))} placeholder="/logos/name.svg" />
        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={saving} style={{ padding: '6px 14px' }}>{saving ? '…' : editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" onClick={openAdd} style={{ marginLeft: 8, padding: '6px 14px' }}>Cancel</button>}
        </div>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {list.map((p) => (
          <li key={p.id} style={{ marginBottom: 12, padding: 8, border: '1px solid #eee' }}>
            <strong>{p.position}</strong> at {p.company} ({p.year})
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
