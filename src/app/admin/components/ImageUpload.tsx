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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleUpload() {
    const file = selectedFile ?? inputRef.current?.files?.[0];
    if (!file) {
      setUploadError('Choose a file first');
      return;
    }
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
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = '';
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
          onChange={(e) => {
            const f = e.target.files?.[0];
            setSelectedFile(f ?? null);
            setUploadError('');
          }}
        />
        <button
          type="button"
          className="admin-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
        {selectedFile && (
          <span className="admin-hint" style={{ marginLeft: 8 }}>
            {selectedFile.name}
          </span>
        )}
      </div>
      <p className="admin-hint" style={{ marginTop: 4, marginBottom: 0 }}>Max 5MB. Uses GitHub repo; ensure GITHUB_TOKEN and GITHUB_REPO are set.</p>
      {uploadError && <p className="admin-error" style={{ marginTop: 6, marginBottom: 0 }}>{uploadError}</p>}
    </div>
  );
}
