'use client';

import { useRef, useState } from 'react';

type Folder = 'images' | 'awards' | 'logos';

export function ImageUpload({
  folder = 'images',
  value,
  onChange,
  label = 'Image',
}: {
  folder?: Folder;
  value: string;
  onChange: (path: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleUpload() {
    const input = inputRef.current;
    if (!input?.files?.length) {
      setUploadError('Choose a file first');
      return;
    }
    const file = input.files[0];
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('folder', folder);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.path);
      input.value = '';
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-form-group">
      <label>{label}</label>
      <input
        type="text"
        className="admin-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`/${folder}/filename.jpg`}
        style={{ marginBottom: 6 }}
      />
      <div className="admin-upload-row">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          aria-label={`Upload ${label}`}
        />
        <button
          type="button"
          className="admin-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
      </div>
      {uploadError && <p className="admin-error" style={{ marginTop: 6, marginBottom: 0 }}>{uploadError}</p>}
    </div>
  );
}
