'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { getEpisode, getPodcast, updateEpisode } from '@/lib/creatorService';
import type { CreatorPodcast, CreatorEpisode, EpisodeSection } from '@/lib/creatorTypes';
import EpisodeEditor from '@/components/creator/EpisodeEditor';

export default function EditEpisodePage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const podcastId = params.podcastId as string;
  const episodeId = params.episodeId as string;

  const [podcast, setPodcast] = useState<CreatorPodcast | null>(null);
  const [episode, setEpisode] = useState<CreatorEpisode | null>(null);
  const [sections, setSections] = useState<EpisodeSection[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!podcastId || !episodeId) return;
    async function load() {
      const [p, ep] = await Promise.all([
        getPodcast(podcastId),
        getEpisode(episodeId),
      ]);
      setPodcast(p);
      setEpisode(ep);
      if (ep) setSections(ep.sections || []);
      setLoading(false);
    }
    load();
  }, [podcastId, episodeId]);

  const handleSave = async (status?: 'draft' | 'published') => {
    if (!episode) return;
    setIsSaving(true);
    try {
      await updateEpisode(episodeId, {
        sections,
        ...(status ? { status } : {}),
      });
      router.push(`/creator/podcast/${podcastId}`);
    } catch (e) {
      console.error('Error saving:', e);
      alert('Failed to save.');
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10"><span className="font-bold animate-pulse" style={{ color: 'var(--text-primary)' }}>Loading...</span></div>;
  if (!podcast || !episode) return <div className="p-10 text-center"><h2 className="text-xl font-black uppercase" style={{ color: 'var(--text-primary)' }}>Not found</h2></div>;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <Link href={`/creator/podcast/${podcastId}`} className="text-xs font-bold uppercase tracking-widest mb-2 block opacity-60 hover:opacity-100 transition-all" style={{ color: 'var(--text-primary)' }}>
            ← {podcast.title}
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            Edit: <span style={{ color: podcast.accentColor }}>{episode.title}</span>
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
      <EpisodeEditor sections={sections} onChange={setSections} accentColor={podcast.accentColor} textOnAccent={podcast.textOnAccent} />
    </div>
  );
}
