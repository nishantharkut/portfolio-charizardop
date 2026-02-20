'use client';

import { useEffect, useState } from 'react';
import type { HeroData, SiteConfig } from '@/data';
import { ImageUpload } from '../components/ImageUpload';
import { adminFetch } from '../lib/api';

const defaultHero: HeroData = {
  name: '',
  tagline: '',
  location: '',
  cta: { primary: { text: '', href: '' }, secondary: { text: '', href: '' } },
  announcement: { text: '', link: { text: '', href: '' } },
};

const defaultSite: SiteConfig = {
  faviconPath: '/nishantharkut-logo-lightbg.png',
  ogImagePath: '/og-image.png',
  twitterImagePath: '/og-image.jpg',
};

export default function AdminSitePage() {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [site, setSite] = useState<SiteConfig>(defaultSite);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function load() {
    setLoading(true);
    setError('');
    Promise.all([
      fetch('/api/admin/data/hero', { credentials: 'include' }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Unauthorized'))
      ),
      fetch('/api/admin/data/site', { credentials: 'include' }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Unauthorized'))
      ),
    ])
      .then(([heroData, siteData]) => {
        setHero(heroData as HeroData);
        setSite({ ...defaultSite, ...(siteData as Partial<SiteConfig>) });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function handleSaveHero(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);
    adminFetch('/api/admin/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hero),
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      })
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  }

  function handleSaveSite(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);
    adminFetch('/api/admin/site', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(site),
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      })
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  }

  if (loading) return <div className="admin-loading">Loading…</div>;

  return (
    <div>
      <h1 className="admin-page-title">Site settings</h1>
      <p className="admin-hint" style={{ marginBottom: 16 }}>
        Hero section (homepage) and favicon. Changes apply after the next deploy.
      </p>
      {error && <div className="admin-error" style={{ marginBottom: 16 }}>{error}</div>}
      {saved && <div style={{ marginBottom: 16, color: 'var(--color-success, green)' }}>Saved.</div>}

      <div className="admin-card" style={{ marginBottom: 24 }}>
        <h2>Hero section</h2>
        <form onSubmit={handleSaveHero}>
          <div className="admin-form-group">
            <label>Name</label>
            <input
              className="admin-input"
              value={hero.name}
              onChange={(e) => setHero((h) => ({ ...h, name: e.target.value }))}
            />
          </div>
          <div className="admin-form-group">
            <label>Tagline</label>
            <textarea
              className="admin-input"
              style={{ minHeight: 60 }}
              value={hero.tagline}
              onChange={(e) => setHero((h) => ({ ...h, tagline: e.target.value }))}
            />
          </div>
          <div className="admin-form-group">
            <label>Location</label>
            <input
              className="admin-input"
              value={hero.location}
              onChange={(e) => setHero((h) => ({ ...h, location: e.target.value }))}
            />
          </div>
          <div className="admin-form-group">
            <label>CTA primary text</label>
            <input
              className="admin-input"
              value={hero.cta?.primary?.text ?? ''}
              onChange={(e) =>
                setHero((h) => ({
                  ...h,
                  cta: { ...h.cta, primary: { ...h.cta.primary, text: e.target.value } },
                }))
              }
            />
          </div>
          <div className="admin-form-group">
            <label>CTA primary href</label>
            <input
              className="admin-input"
              value={hero.cta?.primary?.href ?? ''}
              onChange={(e) =>
                setHero((h) => ({
                  ...h,
                  cta: { ...h.cta, primary: { ...h.cta.primary, href: e.target.value } },
                }))
              }
            />
          </div>
          <div className="admin-form-group">
            <label>CTA secondary text</label>
            <input
              className="admin-input"
              value={hero.cta?.secondary?.text ?? ''}
              onChange={(e) =>
                setHero((h) => ({
                  ...h,
                  cta: { ...h.cta, secondary: { ...h.cta.secondary, text: e.target.value } },
                }))
              }
            />
          </div>
          <div className="admin-form-group">
            <label>CTA secondary href</label>
            <input
              className="admin-input"
              value={hero.cta?.secondary?.href ?? ''}
              onChange={(e) =>
                setHero((h) => ({
                  ...h,
                  cta: { ...h.cta, secondary: { ...h.cta.secondary, href: e.target.value } },
                }))
              }
            />
          </div>
          <div className="admin-form-group">
            <label>Announcement text</label>
            <input
              className="admin-input"
              value={hero.announcement?.text ?? ''}
              onChange={(e) =>
                setHero((h) => ({
                  ...h,
                  announcement: { ...h.announcement, text: e.target.value },
                }))
              }
            />
          </div>
          <div className="admin-form-group">
            <label>Announcement link text</label>
            <input
              className="admin-input"
              value={hero.announcement?.link?.text ?? ''}
              onChange={(e) =>
                setHero((h) => ({
                  ...h,
                  announcement: {
                    ...h.announcement,
                    link: { ...h.announcement.link, text: e.target.value },
                  },
                }))
              }
            />
          </div>
          <div className="admin-form-group">
            <label>Announcement link href</label>
            <input
              className="admin-input"
              value={hero.announcement?.link?.href ?? ''}
              onChange={(e) =>
                setHero((h) => ({
                  ...h,
                  announcement: {
                    ...h.announcement,
                    link: { ...h.announcement.link, href: e.target.value },
                  },
                }))
              }
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save hero'}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2>Favicon & app icon</h2>
        <p className="admin-hint" style={{ marginBottom: 12 }}>
          Browser tab and PWA icons. Upload to /logos/ or enter a path.
        </p>
        <form onSubmit={handleSaveSite}>
          <ImageUpload
            folder="logos"
            label="Favicon / app icon"
            value={site.faviconPath}
            onChange={(path) => setSite((s) => ({ ...s, faviconPath: path }))}
          />

          <h3 style={{ marginTop: 24, marginBottom: 8, fontSize: 16 }}>OG & Twitter images</h3>
          <p className="admin-hint" style={{ marginBottom: 12 }}>
            Used when the site is shared on socials. OG: main preview (e.g. 1200×630). Twitter falls back to OG if left empty.
          </p>
          <ImageUpload
            folder="images"
            label="OG image (Open Graph)"
            value={site.ogImagePath ?? ''}
            onChange={(path) => setSite((s) => ({ ...s, ogImagePath: path }))}
          />
          <ImageUpload
            folder="images"
            label="Twitter image (optional)"
            value={site.twitterImagePath ?? ''}
            onChange={(path) => setSite((s) => ({ ...s, twitterImagePath: path }))}
          />

          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving} style={{ marginTop: 8 }}>
            {saving ? 'Saving…' : 'Save site config'}
          </button>
        </form>
      </div>
    </div>
  );
}
