'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { createEpisode, getPodcast } from '@/lib/creatorService';
import { generateSlug } from '@/lib/creatorTypes';
import type { CreatorPodcast, EpisodeSection } from '@/lib/creatorTypes';
import EpisodeEditor from '@/components/creator/EpisodeEditor';

export default function NewEpisodePage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const podcastId = params.podcastId as string;

  const [podcast, setPodcast] = useState<CreatorPodcast | null>(null);
  const [step, setStep] = useState<'info' | 'editor'>('info');

  // Episode info
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [guest, setGuest] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Editor state
  const [sections, setSections] = useState<EpisodeSection[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!podcastId) return;
    getPodcast(podcastId).then(setPodcast);
  }, [podcastId]);

  const handleAddTag = () => {
    const t = tagInput.trim().toUpperCase();
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!user || !podcast) return;
    setIsSaving(true);
    try {
      await createEpisode({
        slug: generateSlug(title),
        podcastId,
        number,
        title: title.trim(),
        guest: guest.trim(),
        description: description.trim(),
        date,
        duration,
        tags,
        sections,
        status,
        creatorUid: user.uid,
      });
      router.push(`/creator/podcast/${podcastId}`);
    } catch (e) {
      console.error('Error saving episode:', e);
      alert('Failed to save. Please try again.');
      setIsSaving(false);
    }
  };

  if (!podcast) {
    return <div className="p-10"><span className="font-bold animate-pulse" style={{ color: 'var(--text-primary)' }}>Loading...</span></div>;
  }

  // Step 1: Episode info
  if (step === 'info') {
    return (
      <div className="p-6 md:p-10 max-w-3xl">
        <Link href={`/creator/podcast/${podcastId}`} className="text-xs font-bold uppercase tracking-widest mb-6 block opacity-60 hover:opacity-100 transition-all" style={{ color: 'var(--text-primary)' }}>← Back to {podcast.title}</Link>

        <div className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4" style={{ backgroundColor: podcast.accentColor, color: podcast.textOnAccent === 'white' ? '#fff' : '#000' }}>New Episode</div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-6" style={{ color: 'var(--text-primary)' }}>Episode Details</h1>

        {/* Annotation */}
        <div className="zine-border p-4 mb-8" style={{ backgroundColor: 'rgba(59,130,246,0.05)', borderColor: '#3B82F6' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#3B82F6' }}>📸 Where does this appear?</p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Title → episode hero heading. Guest → subtitle. Number/Duration/Date → stats bar. Description → episode cards.
          </p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>Episode Number *</label>
              <input type="text" value={number} onChange={e => setNumber(e.target.value)} placeholder="e.g. 01" className="w-full zine-border px-4 py-3 font-bold outline-none focus:shadow-[3px_3px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>Duration</label>
              <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 1hr 23min" className="w-full zine-border px-4 py-3 font-bold outline-none focus:shadow-[3px_3px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>Episode Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. The Future of AI" className="w-full zine-border px-4 py-3 font-bold outline-none focus:shadow-[3px_3px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>Guest Name</label>
              <input type="text" value={guest} onChange={e => setGuest(e.target.value)} placeholder="e.g. Sundar Pichai" className="w-full zine-border px-4 py-3 font-bold outline-none focus:shadow-[3px_3px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full zine-border px-4 py-3 font-bold outline-none focus:shadow-[3px_3px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="A short description of this episode..." rows={3} className="w-full zine-border px-4 py-3 font-bold outline-none resize-none focus:shadow-[3px_3px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }} />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>Tags</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTag()} placeholder="Add tag..." className="flex-1 zine-border px-3 py-2 font-bold text-sm outline-none" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }} />
              <button onClick={handleAddTag} className="zine-border px-4 py-2 font-black uppercase text-xs cursor-pointer" style={{ backgroundColor: podcast.accentColor, color: podcast.textOnAccent === 'white' ? '#fff' : '#000' }}>Add</button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-widest zine-border" style={{ backgroundColor: podcast.accentColor, color: podcast.textOnAccent === 'white' ? '#fff' : '#000' }}>
                    {t}
                    <button onClick={() => setTags(prev => prev.filter(x => x !== t))} className="opacity-70 hover:opacity-100 cursor-pointer">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t-2 border-dashed flex justify-end" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={() => setStep('editor')}
            disabled={!title.trim() || !number.trim()}
            className="zine-border px-8 py-3 font-black uppercase tracking-widest text-sm shadow-[3px_3px_0px_var(--border-color)] hover:-translate-y-0.5 transition-all disabled:opacity-40 cursor-pointer"
            style={{ backgroundColor: podcast.accentColor, color: podcast.textOnAccent === 'white' ? '#fff' : '#000' }}
          >
            Build Episode →
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Editor
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <button onClick={() => setStep('info')} className="text-xs font-bold uppercase tracking-widest mb-2 block opacity-60 hover:opacity-100 transition-all cursor-pointer" style={{ color: 'var(--text-primary)' }}>← Back to Details</button>
          <h1 className="text-2xl font-black uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            Editing: <span style={{ color: podcast.accentColor }}>{title}</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleSave('draft')} disabled={isSaving} className="zine-border px-5 py-2 font-black uppercase tracking-widest text-xs shadow-[3px_3px_0px_var(--border-color)] hover:-translate-y-0.5 transition-all disabled:opacity-40 cursor-pointer" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}>
            {isSaving ? '...' : '💾 Save Draft'}
          </button>
          <button onClick={() => handleSave('published')} disabled={isSaving} className="zine-border px-5 py-2 font-black uppercase tracking-widest text-xs shadow-[3px_3px_0px_var(--border-color)] hover:-translate-y-0.5 transition-all disabled:opacity-40 cursor-pointer" style={{ backgroundColor: podcast.accentColor, color: podcast.textOnAccent === 'white' ? '#fff' : '#000' }}>
            {isSaving ? '⏳' : '🚀 Publish'}
          </button>
        </div>
      </div>

      <EpisodeEditor
        sections={sections}
        onChange={setSections}
        accentColor={podcast.accentColor}
        textOnAccent={podcast.textOnAccent}
      />
    </div>
  );
}
