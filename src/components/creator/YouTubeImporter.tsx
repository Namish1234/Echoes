'use client';

import { useState } from 'react';
import type { EpisodeSection } from '@/lib/creatorTypes';
import { generateSectionId } from '@/lib/creatorTypes';

interface GeneratedData {
  title: string;
  guest: string;
  description: string;
  summary: string;
  tags: string[];
  accentColorHex: string;
  backgroundTheme: string;
  centralTopic: string;
  sixtySecond: {
    heading: string;
    subheading: string;
    paragraphs: { text: string; imagePosition: 'left' | 'right' }[];
    takeaway: string;
  };
  keyLessons: { context: string; summary: string }[];
  mindmapNodes: { id: string; label: string; category: string; children: string[] }[];
  highlights: string[];
}

interface Props {
  podcastTitle?: string;
  onImport: (data: {
    title: string;
    guest: string;
    description: string;
    tags: string[];
    accentColorHex: string;
    backgroundTheme: string;
    sections: EpisodeSection[];
  }) => void;
}

const THEME_LABELS: Record<string, string> = {
  sports: '🏆 Sports',
  nature: '🌿 Nature',
  business: '💼 Business',
  tech: '⚡ Technology',
  philosophy: '🧠 Philosophy',
  politics: '🌍 Politics',
  health: '❤️ Health',
  art: '🎨 Art',
  global: '🌐 Global',
};

export default function YouTubeImporter({ podcastTitle, onImport }: Props) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<GeneratedData | null>(null);
  const [step, setStep] = useState<'idle' | 'loading' | 'review'>('idle');

  const handleGenerate = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setError('');
    setPreview(null);
    setStep('loading');

    try {
      const res = await fetch('/api/generate-episode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: url.trim(), podcastTitle }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Unknown error');
      }

      setPreview(json.data as GeneratedData);
      setStep('review');
    } catch (e) {
      setError(String(e));
      setStep('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!preview) return;

    // Build EpisodeSection[] from the generated data
    const sections: EpisodeSection[] = [];

    // 1. Summary section
    if (preview.summary) {
      sections.push({
        type: 'summary',
        id: generateSectionId(),
        content: preview.summary,
      });
    }

    // 2. Sixty-second section
    if (preview.sixtySecond) {
      sections.push({
        type: 'sixty-second',
        id: generateSectionId(),
        heading: preview.sixtySecond.heading || 'The 60-Second Breakdown',
        subheading: preview.sixtySecond.subheading || '',
        paragraphs: preview.sixtySecond.paragraphs.map(p => ({
          text: p.text,
          imageUrl: '',
          imageCaption: '',
          imagePosition: p.imagePosition || 'right',
        })),
        takeaway: preview.sixtySecond.takeaway || '',
      });
    }

    // 3. Key Lessons section
    if (preview.keyLessons?.length) {
      sections.push({
        type: 'key-lessons',
        id: generateSectionId(),
        heading: 'Key Lessons',
        subheading: `What ${preview.guest || 'they'} taught us`,
        lessons: preview.keyLessons.map(l => ({
          context: l.context,
          summary: l.summary,
          align: 'left' as const,
        })),
      });
    }

    // 4. Mindmap section
    if (preview.mindmapNodes?.length) {
      sections.push({
        type: 'mindmap',
        id: generateSectionId(),
        centralTopic: preview.centralTopic || preview.title,
        nodes: preview.mindmapNodes.map(n => ({
          id: n.id,
          label: n.label,
          category: (n.category as 'core' | 'tech' | 'phil' | 'biz' | 'example') || 'core',
          children: n.children || [],
        })),
      });
    }

    onImport({
      title: preview.title,
      guest: preview.guest,
      description: preview.description,
      tags: preview.tags,
      accentColorHex: preview.accentColorHex,
      backgroundTheme: preview.backgroundTheme,
      sections,
    });
  };

  if (step === 'idle' || step === 'loading') {
    return (
      <div className="zine-border p-5 relative overflow-hidden" style={{ backgroundColor: 'rgba(59,130,246,0.04)', borderColor: '#3B82F6' }}>
        {/* decorative corner */}
        <div className="absolute top-0 right-0 w-8 h-8" style={{ background: 'linear-gradient(135deg, transparent 50%, #3B82F610 50%)' }} />

        <div className="flex items-center gap-2 mb-3">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" style={{ color: '#FF0000' }}>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <div>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#3B82F6' }}>Auto-Generate from YouTube</p>
            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Paste any YouTube link — AI will write your episode for you</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="https://youtube.com/watch?v=..."
            disabled={isLoading}
            className="flex-1 zine-border px-3 py-2.5 font-bold text-sm outline-none disabled:opacity-50"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !url.trim()}
            className="zine-border px-5 py-2.5 font-black uppercase text-xs cursor-pointer disabled:opacity-40 transition-all hover:-translate-y-0.5 shrink-0"
            style={{ backgroundColor: '#3B82F6', color: '#fff' }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                </svg>
                Generating...
              </span>
            ) : '✨ Generate'}
          </button>
        </div>

        {isLoading && (
          <div className="mt-4 space-y-2">
            {['Fetching transcript...', 'Analysing content with AI...', 'Extracting key lessons...', 'Building mind map...'].map((t, i) => (
              <div key={i} className="flex items-center gap-2" style={{ opacity: 0.4 + i * 0.15 }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#3B82F6', animationDelay: `${i * 0.2}s` }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{t}</span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-3 px-3 py-2 text-xs font-bold rounded" style={{ backgroundColor: '#EF444415', color: '#EF4444', border: '1px solid #EF444430' }}>
            ⚠️ {error}
          </div>
        )}

        <p className="text-[10px] font-medium mt-3" style={{ color: 'var(--text-muted)' }}>
          Works with public YouTube videos that have captions. Powered by Gemini AI (free tier). You can edit everything after generation.
        </p>
      </div>
    );
  }

  // Review step
  if (step === 'review' && preview) {
    return (
      <div className="zine-border p-5 space-y-4" style={{ backgroundColor: 'var(--surface)', borderColor: '#22C55E' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#22C55E' }}>✅ Episode Generated</p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>Review the content below. Click &ldquo;Use This&rdquo; to populate all the fields or regenerate.</p>
          </div>
          <button
            onClick={() => setStep('idle')}
            className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 cursor-pointer transition-all"
            style={{ color: 'var(--text-primary)' }}
          >
            ← Try Again
          </button>
        </div>

        {/* Preview cards */}
        <div className="grid grid-cols-1 gap-3">
          {/* Title + Guest */}
          <div className="p-3 zine-border" style={{ backgroundColor: 'var(--page-bg)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Title & Guest</p>
            <p className="font-black text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>{preview.title}</p>
            <p className="text-xs font-bold mt-1" style={{ color: preview.accentColorHex }}>with {preview.guest}</p>
          </div>

          {/* Tags + Color + Theme */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {preview.tags.map(t => (
                <span key={t} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 zine-border" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="w-5 h-5 rounded-full border-2 zine-border" style={{ backgroundColor: preview.accentColorHex }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{THEME_LABELS[preview.backgroundTheme] || preview.backgroundTheme}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-3 zine-border" style={{ backgroundColor: 'var(--page-bg)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Description</p>
            <p className="text-xs font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{preview.description}</p>
          </div>

          {/* Key Lessons preview */}
          <div className="p-3 zine-border" style={{ backgroundColor: 'var(--page-bg)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Key Lessons ({preview.keyLessons.length})</p>
            <div className="space-y-1">
              {preview.keyLessons.slice(0, 3).map((l, i) => (
                <p key={i} className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  <span style={{ color: preview.accentColorHex }}>{i + 1}.</span> {l.context}
                </p>
              ))}
              {preview.keyLessons.length > 3 && (
                <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>+ {preview.keyLessons.length - 3} more</p>
              )}
            </div>
          </div>

          {/* Mindmap nodes preview */}
          <div className="p-3 zine-border" style={{ backgroundColor: 'var(--page-bg)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Mind Map ({preview.mindmapNodes.length} nodes) — Central: {preview.centralTopic}</p>
            <div className="flex flex-wrap gap-1">
              {preview.mindmapNodes.map(n => (
                <span key={n.id} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                  backgroundColor: n.category === 'core' ? '#FF6B0020' : n.category === 'tech' ? '#3B82F620' : n.category === 'phil' ? '#8B5CF620' : n.category === 'biz' ? '#22C55E20' : '#6B728020',
                  color: n.category === 'core' ? '#FF6B00' : n.category === 'tech' ? '#3B82F6' : n.category === 'phil' ? '#8B5CF6' : n.category === 'biz' ? '#22C55E' : '#6B7280',
                }}>
                  {n.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2 border-t-2 border-dashed" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={() => setStep('idle')}
            className="flex-1 zine-border px-4 py-3 font-black uppercase text-xs cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
          >
            ↺ Regenerate
          </button>
          <button
            onClick={handleConfirm}
            className="flex-2 zine-border px-6 py-3 font-black uppercase text-xs cursor-pointer transition-all hover:-translate-y-0.5 shadow-[3px_3px_0px_var(--border-color)]"
            style={{ backgroundColor: '#22C55E', color: '#fff' }}
          >
            ✓ Use This Episode →
          </button>
        </div>
      </div>
    );
  }

  return null;
}
