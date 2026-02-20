'use client';

import { useEffect, useState } from 'react';
import type { ExperienceItem } from '@/data';
import { ImageUpload } from '../components/ImageUpload';
import { DraggableList } from '../components/DraggableList';
import { adminFetch } from '../lib/api';

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
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...form, id: editingId } : form;
    adminFetch('/api/admin/experience', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(({ data }) => {
        if (editingId) setList((prev) => prev.map((p) => (p.id === editingId ? (data as ExperienceItem) : p)));
        else setList((prev) => [...prev, data as ExperienceItem]);
        setForm(defaultItem);
        setEditingId(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  }

  function remove(id: number) {
    if (!confirm('Delete this experience?')) return;
    setSaving(true);
    adminFetch(`/api/admin/experience?id=${id}`, { method: 'DELETE' })
      .then(() => setList((prev) => prev.filter((p) => p.id !== id)))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  }

  if (loading) return <div className="admin-loading">Loading…</div>;
  if (error && list.length === 0) return <div className="admin-error">{error}</div>;

  return (
    <div>
      <h1 className="admin-page-title">Experience</h1>
      {error && <div className="admin-error">{error}</div>}
      <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd} style={{ marginBottom: 16 }}>Add experience</button>

      <div className="admin-card">
        <h2>{editingId ? 'Edit' : 'New'} experience</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Position</label>
            <input className="admin-input" value={form.position ?? ''} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} required />
          </div>
          <div className="admin-form-group">
            <label>Company</label>
            <input className="admin-input" value={form.company ?? ''} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} required />
          </div>
          <div className="admin-form-group">
            <label>Year</label>
            <input className="admin-input" value={form.year ?? ''} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Duration (e.g. Aug. 2025 - Present)</label>
            <input className="admin-input" value={form.duration ?? ''} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Months (e.g. 6 months)</label>
            <input className="admin-input" value={form.months ?? ''} onChange={(e) => setForm((f) => ({ ...f, months: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Description</label>
            <textarea className="admin-input" style={{ minHeight: 80 }} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Responsibilities (one per line)</label>
            <textarea className="admin-input" style={{ minHeight: 100 }} value={Array.isArray(form.responsibilities) ? form.responsibilities.join('\n') : ''} onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) }))} />
          </div>
          <div className="admin-form-group">
            <label>Technologies (comma-separated)</label>
            <input className="admin-input" value={Array.isArray(form.technologies) ? form.technologies.join(', ') : ''} onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) }))} />
          </div>
          <div className="admin-form-group">
            <label>Achievements (one per line)</label>
            <textarea className="admin-input" style={{ minHeight: 80 }} value={Array.isArray(form.achievements) ? form.achievements.join('\n') : ''} onChange={(e) => setForm((f) => ({ ...f, achievements: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) }))} />
          </div>
          <ImageUpload folder="logos" label="Logo" value={form.logo ?? ''} onChange={(path) => setForm((f) => ({ ...f, logo: path }))} />
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? '…' : editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" className="admin-btn" onClick={openAdd}>Cancel</button>}
          </div>
        </form>
      </div>

      <p className="admin-hint">Drag items to reorder. Order is saved to the repo.</p>
      <DraggableList<ExperienceItem>
        items={list}
        onReorder={setList}
        onEdit={openEdit}
        onDelete={remove}
        saving={saving}
        orderEndpoint="/api/admin/experience/order"
        renderItem={(p) => <><strong>{p.position}</strong> at {p.company} ({p.year})</>}
      />
    </div>
  );
}
