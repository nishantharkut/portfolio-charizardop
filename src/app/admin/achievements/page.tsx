'use client';

import { useEffect, useState } from 'react';
import type { Achievement } from '@/data';
import { ImageUpload } from '../components/ImageUpload';
import { DraggableList } from '../components/DraggableList';
import { adminFetch } from '../lib/api';

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
    adminFetch('/api/admin/achievements', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(({ data }) => {
        if (editingId) setList((prev) => prev.map((p) => (p.id === editingId ? (data as Achievement) : p)));
        else setList((prev) => [...prev, data as Achievement]);
        setForm(defaultItem);
        setEditingId(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  }

  function remove(id: number) {
    if (!confirm('Delete this achievement?')) return;
    setSaving(true);
    adminFetch(`/api/admin/achievements?id=${id}`, { method: 'DELETE' })
      .then(() => setList((prev) => prev.filter((p) => p.id !== id)))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  }

  if (loading) return <div className="admin-loading">Loading…</div>;
  if (error && list.length === 0) return <div className="admin-error">{error}</div>;

  return (
    <div>
      <h1 className="admin-page-title">Achievements</h1>
      {error && <div className="admin-error">{error}</div>}
      <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd} style={{ marginBottom: 16 }}>Add achievement</button>

      <div className="admin-card">
        <h2>{editingId ? 'Edit' : 'New'} achievement</h2>
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
            <label>Description</label>
            <textarea className="admin-input" style={{ minHeight: 60 }} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Details</label>
            <textarea className="admin-input" style={{ minHeight: 80 }} value={form.details ?? ''} onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Date</label>
            <input className="admin-input" value={form.date ?? ''} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Organization</label>
            <input className="admin-input" value={form.organization ?? ''} onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Link</label>
            <input className="admin-input" type="url" value={form.link ?? ''} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
          </div>
          <ImageUpload folder="awards" label="Image" value={form.image ?? ''} onChange={(path) => setForm((f) => ({ ...f, image: path }))} />
          <div className="admin-form-group">
            <label>Badge (emoji)</label>
            <input className="admin-input" value={form.badge ?? ''} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} placeholder="🏆" />
          </div>
          <div className="admin-form-group">
            <label>Impact (one per line)</label>
            <textarea className="admin-input" style={{ minHeight: 80 }} value={Array.isArray(form.impact) ? form.impact.join('\n') : ''} onChange={(e) => setForm((f) => ({ ...f, impact: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) }))} />
          </div>
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

      <p className="admin-hint">Drag items to reorder. Order is saved to the repo.</p>
      <DraggableList<Achievement>
        items={list}
        onReorder={setList}
        onEdit={openEdit}
        onDelete={remove}
        saving={saving}
        orderEndpoint="/api/admin/achievements/order"
        renderItem={(p) => <><strong>{p.title}</strong> — {p.category} ({p.date})</>}
      />
    </div>
  );
}
