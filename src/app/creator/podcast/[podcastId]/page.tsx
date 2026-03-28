'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { getPodcast, getCreatorEpisodes, deleteEpisode, deletePodcast } from '@/lib/creatorService';
import type { CreatorPodcast, CreatorEpisode } from '@/lib/creatorTypes';

export default function PodcastManagePage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const podcastId = params.podcastId as string;

  const [podcast, setPodcast] = useState<CreatorPodcast | null>(null);
  const [episodes, setEpisodes] = useState<CreatorEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !podcastId) return;
    async function load() {
      const [p, eps] = await Promise.all([
        getPodcast(podcastId),
        getCreatorEpisodes(podcastId),
      ]);
      setPodcast(p);
      setEpisodes(eps);
      setLoading(false);
    }
    load();
  }, [user, podcastId]);

  const handleDeleteEpisode = async (epId: string) => {
    if (!confirm('Delete this episode? This cannot be undone.')) return;
    setDeleting(epId);
    await deleteEpisode(epId);
    setEpisodes(prev => prev.filter(e => e.id !== epId));
    setDeleting(null);
  };

  const handleDeletePodcast = async () => {
    if (!confirm('Delete this entire podcast and all its episodes? This cannot be undone.')) return;
    await deletePodcast(podcastId);
    router.push('/creator/dashboard');
  };

  if (loading) {
    return (
      <div className="p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
          <div className="h-4 w-96 rounded" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
        </div>
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-black uppercase" style={{ color: 'var(--text-primary)' }}>Podcast not found</h2>
        <Link href="/creator/dashboard" className="mt-4 inline-block font-bold" style={{ color: 'var(--color-wtf-orange)' }}>← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <Link href="/creator/dashboard" className="text-xs font-bold uppercase tracking-widest mb-3 block opacity-60 hover:opacity-100 transition-all" style={{ color: 'var(--text-primary)' }}>← Dashboard</Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4" style={{ backgroundColor: podcast.accentColor }}></div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>{podcast.title}</h1>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Hosted by {podcast.host} · {episodes.length} episode{episodes.length !== 1 ? 's' : ''}
            <span className="ml-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5" style={{ backgroundColor: podcast.status === 'published' ? '#22C55E' : 'var(--text-muted)', color: '#fff' }}>{podcast.status}</span>
          </p>
        </div>
        <div className="flex gap-3 items-start">
          <Link
            href={`/creator/podcast/${podcastId}/new-episode`}
            className="inline-flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest text-sm zine-border shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all"
            style={{ backgroundColor: podcast.accentColor, color: podcast.textOnAccent === 'white' ? '#fff' : '#000' }}
          >
            ➕ New Episode
          </Link>
          <button
            onClick={handleDeletePodcast}
            className="px-4 py-3 font-black uppercase tracking-widest text-xs zine-border hover:-translate-y-0.5 transition-all cursor-pointer"
            style={{ backgroundColor: '#EF4444', color: '#fff' }}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Episode list */}
      {episodes.length === 0 ? (
        <div className="zine-border p-12 text-center" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="text-5xl mb-4">✍️</div>
          <h3 className="text-xl font-black uppercase tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>No Episodes Yet</h3>
          <p className="font-medium mb-6" style={{ color: 'var(--text-secondary)' }}>Create your first episode and start building your content.</p>
          <Link
            href={`/creator/podcast/${podcastId}/new-episode`}
            className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase tracking-widest text-sm zine-border shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all"
            style={{ backgroundColor: podcast.accentColor, color: podcast.textOnAccent === 'white' ? '#fff' : '#000' }}
          >
            🚀 Create First Episode
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {episodes.map((ep, idx) => (
            <div key={ep.id} className="zine-border overflow-hidden flex transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)' }}>
              {/* Number */}
              <div className="w-16 shrink-0 flex items-center justify-center font-black text-2xl" style={{ backgroundColor: podcast.accentColor, color: podcast.textOnAccent === 'white' ? '#fff' : '#000' }}>
                {ep.number || idx + 1}
              </div>
              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{ep.title}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      {ep.guest && `Guest: ${ep.guest} · `}{ep.date} · {ep.sections.length} section{ep.sections.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5" style={{ backgroundColor: ep.status === 'published' ? '#22C55E' : 'var(--text-muted)', color: '#fff' }}>{ep.status}</span>
                    <Link
                      href={`/creator/podcast/${podcastId}/episode/${ep.id}`}
                      className="text-xs font-black uppercase tracking-widest px-3 py-1.5 zine-border shadow-[2px_2px_0px_var(--border-color)] hover:-translate-y-0.5 transition-all"
                      style={{ backgroundColor: podcast.accentColor, color: podcast.textOnAccent === 'white' ? '#fff' : '#000' }}
                    >
                      Edit →
                    </Link>
                    <button
                      onClick={() => handleDeleteEpisode(ep.id)}
                      disabled={deleting === ep.id}
                      className="text-xs font-black uppercase px-2 py-1.5 zine-border hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-40"
                      style={{ backgroundColor: '#EF4444', color: '#fff' }}
                    >
                      {deleting === ep.id ? '...' : '×'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
