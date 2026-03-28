'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { createPodcast, uploadImage } from '@/lib/creatorService';
import { generateSlug } from '@/lib/creatorTypes';
import ColorThemePicker from '@/components/creator/ColorThemePicker';

const AVAILABLE_TAGS = [
  'STARTUPS & VC', 'BUSINESS & ECONOMICS', 'TECHNOLOGY & AI', 'HEALTH & WELLNESS',
  'SOCIETY & GOVERNANCE', 'CREATORS & MEDIA', 'SPORTS', 'SCIENCE',
  'PSYCHOLOGY', 'LEADERSHIP', 'ENTERTAINMENT', 'GEOPOLITICS',
];

const STEPS = ['Basics', 'Color Palette', 'Tags', 'Cover Image', 'Review'];

export default function NewPodcastPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState('');
  const [host, setHost] = useState('');
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState('#FF6B00');
  const [textOnAccent, setTextOnAccent] = useState<'white' | 'black'>('black');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return title.trim() && host.trim() && description.trim();
      case 1: return !!accentColor;
      case 2: return tags.length > 0;
      case 3: return true; // Cover image is optional
      case 4: return true;
      default: return false;
    }
  };

  const handleTagToggle = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleAddCustomTag = () => {
    const t = customTag.trim().toUpperCase();
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t]);
      setCustomTag('');
    }
  };

  const handleCoverDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      let coverImageUrl = '';
      if (coverFile) {
        const result = await uploadImage(coverFile);
        coverImageUrl = result.url;
      }

      const slug = generateSlug(title);
      await createPodcast({
        slug,
        title: title.trim(),
        host: host.trim(),
        description: description.trim(),
        accentColor,
        textOnAccent,
        tags,
        coverImageUrl,
        creatorUid: user.uid,
        status,
      });

      router.push('/creator/dashboard');
    } catch (e) {
      console.error('Error creating podcast:', e);
      // Display the actual error message so it's easier to debug on Vercel
      alert(`Failed to create podcast: ${e instanceof Error ? e.message : String(e)}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4" style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}>
          New Podcast
        </div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-2" style={{ color: 'var(--text-primary)' }}>
          Create Your <span style={{ color: 'var(--color-wtf-orange)' }}>Podcast</span>
        </h1>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep]}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex gap-1 mb-10">
        {STEPS.map((step, i) => (
          <div key={step} className="flex-1 flex flex-col gap-1">
            <div
              className="h-2 transition-all duration-300"
              style={{
                backgroundColor: i <= currentStep ? accentColor : 'var(--border-subtle)',
              }}
            ></div>
            <span className="text-[9px] font-bold uppercase tracking-widest hidden sm:block" style={{ color: i <= currentStep ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {/* STEP 0 — Basics */}
        {currentStep === 0 && (
          <div className="space-y-6">
            {/* Screenshot annotation */}
            <div className="zine-border p-5 mb-6 relative overflow-hidden" style={{ backgroundColor: 'rgba(59,130,246,0.05)', borderColor: '#3B82F6' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#3B82F6' }}>📸 Where does this data go?</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                These details appear in your podcast&apos;s hero section — the big title at the top of the page, the host name in the stats bar, and the description below the title.
              </p>
              <div className="mt-4 zine-border p-4 text-xs" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF6B00' }}></span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Title</span>
                    <span style={{ color: 'var(--text-muted)' }}>→ Giant hero heading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B82F6' }}></span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Host</span>
                    <span style={{ color: 'var(--text-muted)' }}>→ Stats bar &amp; About section</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }}></span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Description</span>
                    <span style={{ color: 'var(--text-muted)' }}>→ Subtitle under title &amp; podcast cards</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>
                Podcast Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Builder's Log"
                className="w-full zine-border px-4 py-3 font-bold outline-none transition-all focus:shadow-[3px_3px_0px_var(--border-color)]"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
              />
              {title && (
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2" style={{ color: 'var(--text-muted)' }}>
                  URL: /c/{generateSlug(title)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>
                Host Name *
              </label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="e.g. Nikhil Kamath"
                className="w-full zine-border px-4 py-3 font-bold outline-none transition-all focus:shadow-[3px_3px_0px_var(--border-color)]"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A one-line description of what your podcast is about..."
                rows={3}
                className="w-full zine-border px-4 py-3 font-bold outline-none transition-all focus:shadow-[3px_3px_0px_var(--border-color)] resize-none"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        )}

        {/* STEP 1 — Color Palette */}
        {currentStep === 1 && (
          <ColorThemePicker
            selectedColor={accentColor}
            onSelect={(color, text) => {
              setAccentColor(color);
              setTextOnAccent(text);
            }}
          />
        )}

        {/* STEP 2 — Tags */}
        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
              Choose Categories
            </h3>
            <p className="text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>
              Select the topics your podcast covers. These help listeners discover your show.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              {AVAILABLE_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 font-bold uppercase tracking-widest text-xs zine-border transition-all cursor-pointer ${
                    tags.includes(tag)
                      ? 'shadow-[3px_3px_0px_var(--border-color)] -translate-y-0.5'
                      : 'hover:shadow-[2px_2px_0px_var(--border-color)] hover:-translate-y-0.5'
                  }`}
                  style={{
                    backgroundColor: tags.includes(tag) ? accentColor : 'var(--surface)',
                    color: tags.includes(tag) ? (textOnAccent === 'white' ? '#fff' : '#000') : 'var(--text-primary)',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Custom tag */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                placeholder="Add custom tag..."
                className="zine-border px-3 py-2 font-bold text-sm outline-none flex-1"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
              />
              <button
                onClick={handleAddCustomTag}
                disabled={!customTag.trim()}
                className="zine-border px-4 py-2 font-black uppercase text-xs shadow-[2px_2px_0px_var(--border-color)] hover:-translate-y-0.5 transition-all disabled:opacity-40 cursor-pointer"
                style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="mt-6 p-4 zine-border" style={{ backgroundColor: 'var(--surface)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Selected ({tags.length})</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-widest zine-border" style={{ backgroundColor: accentColor, color: textOnAccent === 'white' ? '#fff' : '#000' }}>
                      {tag}
                      <button onClick={() => handleTagToggle(tag)} className="ml-1 opacity-70 hover:opacity-100 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Cover Image */}
        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
              Cover Image <span className="text-xs font-medium normal-case" style={{ color: 'var(--text-muted)' }}>(optional)</span>
            </h3>
            <p className="text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>
              Drag &amp; drop an image or click to upload. This shows on your podcast card.
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleCoverDrop}
              className={`zine-border p-10 text-center transition-all cursor-pointer ${isDragging ? 'shadow-[6px_6px_0px_var(--border-color)] -translate-y-1' : ''}`}
              style={{
                backgroundColor: isDragging ? `${accentColor}10` : 'var(--surface)',
                borderColor: isDragging ? accentColor : 'var(--border-color)',
              }}
              onClick={() => document.getElementById('cover-input')?.click()}
            >
              <input
                id="cover-input"
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                className="hidden"
              />

              {coverPreview ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-40 h-40 object-cover zine-border"
                  />
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    Click or drag to replace
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-5xl mb-3 opacity-30">🖼️</div>
                  <p className="font-bold uppercase tracking-widest text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                    {isDragging ? 'Drop it!' : 'Drag & Drop'}
                  </p>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    or click to browse • PNG, JPG, WebP
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4 — Review */}
        {currentStep === 4 && (
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
              Review Your Podcast
            </h3>

            {/* Full Preview — simulates the podcast page hero */}
            <div className="zine-border overflow-hidden mb-8" style={{ backgroundColor: 'var(--surface)' }}>
              {/* Mini hero */}
              <div className="p-6 relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, var(--border-color) 1px, transparent 1px), linear-gradient(to bottom, var(--border-color) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="relative z-10">
                  <div className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase mb-3" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--page-bg)' }}>
                    Digital Archive Series
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-3" style={{ color: 'var(--text-primary)' }}>
                    {title || 'Untitled'}
                    <span style={{ color: accentColor }}>.</span>
                  </h2>
                  <p className="text-sm font-bold mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {description || 'Your description here.'} Hosted by <span className="font-black">{host || 'Host'}</span>.
                  </p>
                  <button className="zine-border px-5 py-2 font-bold uppercase tracking-widest text-xs shadow-zine" style={{ backgroundColor: accentColor, color: textOnAccent === 'white' ? '#fff' : '#000' }}>
                    Explore Episodes
                  </button>
                </div>
              </div>

              {/* Stats preview */}
              <div className="flex border-t-2" style={{ borderColor: 'var(--border-color)' }}>
                {[
                  { label: 'Host', val: host || 'Host' },
                  { label: 'Tags', val: tags.slice(0, 2).join(', ') || 'None' },
                  { label: 'Color', val: accentColor },
                ].map(s => (
                  <div key={s.label} className="flex-1 p-3 border-l-3" style={{ borderLeftColor: accentColor }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                    <p className="text-xs font-black truncate" style={{ color: 'var(--text-primary)' }}>{s.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Data summary */}
            <div className="zine-border p-5 mb-6" style={{ backgroundColor: 'var(--surface)' }}>
              <h4 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Summary</h4>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Title', value: title },
                  { label: 'Host', value: host },
                  { label: 'Description', value: description },
                  { label: 'Color', value: accentColor, isColor: true },
                  { label: 'Tags', value: tags.join(', ') },
                  { label: 'Cover', value: coverFile ? coverFile.name : 'None' },
                  { label: 'URL', value: `/c/${generateSlug(title)}` },
                ].map(item => (
                  <div key={item.label} className="flex gap-2">
                    <span className="font-bold uppercase tracking-widest text-xs w-24 shrink-0" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span className="font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      {'isColor' in item && item.isColor && (
                        <span className="w-4 h-4 inline-block zine-border" style={{ backgroundColor: item.value }}></span>
                      )}
                      {item.value || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t-2 border-dashed" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 0}
          className="font-bold uppercase tracking-widest text-sm disabled:opacity-30 hover:-translate-x-1 transition-all cursor-pointer disabled:cursor-default"
          style={{ color: 'var(--text-primary)' }}
        >
          ← Back
        </button>

        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
            className="zine-border px-8 py-3 font-black uppercase tracking-widest text-sm shadow-[3px_3px_0px_var(--border-color)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--border-color)] transition-all disabled:opacity-40 cursor-pointer disabled:cursor-default"
            style={{ backgroundColor: accentColor, color: textOnAccent === 'white' ? '#fff' : '#000' }}
          >
            Next →
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              className="zine-border px-6 py-3 font-black uppercase tracking-widest text-xs shadow-[3px_3px_0px_var(--border-color)] hover:-translate-y-0.5 transition-all disabled:opacity-40 cursor-pointer"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
            >
              {isSubmitting ? '...' : '💾 Save Draft'}
            </button>
            <button
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting}
              className="zine-border px-6 py-3 font-black uppercase tracking-widest text-xs shadow-[3px_3px_0px_var(--border-color)] hover:-translate-y-0.5 transition-all disabled:opacity-40 cursor-pointer"
              style={{ backgroundColor: accentColor, color: textOnAccent === 'white' ? '#fff' : '#000' }}
            >
              {isSubmitting ? '⏳ Publishing...' : '🚀 Publish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
