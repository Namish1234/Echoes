'use client';

import { useState } from 'react';
import { uploadImage } from '@/lib/creatorService';
import type { PolaroidImage } from '@/lib/creatorTypes';

interface Props {
  images: PolaroidImage[];
  onChange: (images: PolaroidImage[]) => void;
  accentColor: string;
}

const ROTATIONS = [
  'rotate(-7deg) translateY(12px)',
  'rotate(4deg) translateY(-6px)',
  'rotate(-3deg) translateY(8px)',
  'rotate(6deg) translateY(-10px)',
  'rotate(-5deg) translateY(5px)',
  'rotate(2deg) translateY(-3px)',
];

export default function PolaroidUploader({ images, onChange, accentColor }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    try {
      const newImages: PolaroidImage[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadImage(file);
        newImages.push({
          imageUrl: result.url,
          name: '',
          role: '',
          rotation: ROTATIONS[(images.length + newImages.length) % ROTATIONS.length],
        });
      }
      onChange([...images, ...newImages]);
    } catch (e) {
      console.error('Upload failed:', e);
      alert('Image upload failed. Please try again.');
    }
    setUploading(false);
  };

  const updateImage = (index: number, data: Partial<PolaroidImage>) => {
    const updated = [...images];
    updated[index] = { ...updated[index], ...data };
    onChange(updated);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
        Polaroid Images
      </label>

      {/* Upload area */}
      <div
        className="zine-border border-dashed p-8 text-center mb-4 cursor-pointer transition-all hover:shadow-[3px_3px_0px_var(--border-color)]"
        style={{ backgroundColor: 'var(--page-bg)' }}
        onClick={() => document.getElementById('polaroid-file-input')?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
      >
        <input
          id="polaroid-file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={e => handleUpload(e.target.files)}
          className="hidden"
        />
        {uploading ? (
          <p className="font-bold animate-pulse" style={{ color: accentColor }}>Uploading...</p>
        ) : (
          <>
            <div className="text-3xl mb-2 opacity-30">📷</div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Click or drag images here</p>
            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>They&apos;ll be converted to polaroid style</p>
          </>
        )}
      </div>

      {/* Image list */}
      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={i} className="flex gap-4 items-center zine-border p-3" style={{ backgroundColor: 'var(--page-bg)' }}>
              {/* Polaroid preview */}
              <div className="w-20 h-24 shrink-0 bg-white p-1 shadow-md relative" style={{ transform: img.rotation.split(' ')[0] }}>
                <img src={img.imageUrl} alt={img.name || 'Uploaded'} className="w-full h-16 object-cover" />
                <p className="text-[8px] text-center text-black font-bold mt-1 truncate">{img.name || '...'}</p>
              </div>
              {/* Fields */}
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={img.name}
                  onChange={e => updateImage(i, { name: e.target.value })}
                  placeholder="Name (e.g. Nikhil Kamath)"
                  className="w-full zine-border px-2 py-1 font-bold text-xs outline-none"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
                />
                <input
                  type="text"
                  value={img.role}
                  onChange={e => updateImage(i, { role: e.target.value })}
                  placeholder="Role (e.g. Co-founder, Zerodha)"
                  className="w-full zine-border px-2 py-1 font-bold text-xs outline-none"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
                />
              </div>
              <button onClick={() => removeImage(i)} className="text-sm cursor-pointer opacity-40 hover:opacity-100" style={{ color: '#EF4444' }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
