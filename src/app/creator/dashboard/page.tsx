'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { getCreatorPodcasts, getEpisodeCount } from '@/lib/creatorService';
import type { CreatorPodcast } from '@/lib/creatorTypes';

interface PodcastWithCount extends CreatorPodcast {
  episodeCount: number;
}

export default function CreatorDashboard() {
  const { user, userProfile } = useAuth();
  const [podcasts, setPodcasts] = useState<PodcastWithCount[]>([]);
  const [isLoadingPodcasts, setIsLoadingPodcasts] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadPodcasts() {
      try {
        const raw = await getCreatorPodcasts(user!.uid);
        const withCounts = await Promise.all(
          raw.map(async (p) => ({
            ...p,
            episodeCount: await getEpisodeCount(p.id),
          }))
        );
        setPodcasts(withCounts);
      } catch (e) {
        console.error('Error loading podcasts:', e);
      } finally {
        setIsLoadingPodcasts(false);
      }
    }

    loadPodcasts();
  }, [user]);

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--page-bg)' }}>
          Creator Studio
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-3" style={{ color: 'var(--text-primary)' }}>
          Welcome back, <span style={{ color: 'var(--color-wtf-orange)' }}>{userProfile?.displayName?.split(' ')[0] || 'Creator'}</span>.
        </h1>
        <p className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
          Manage your podcasts, create episodes, and track your audience.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="zine-border p-5 relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="absolute top-0 right-0 w-14 h-14 opacity-[0.06]" style={{ backgroundColor: '#FF6B00', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Podcasts</p>
          <p className="text-3xl font-black" style={{ color: 'var(--color-wtf-orange)' }}>{podcasts.length}</p>
        </div>
        <div className="zine-border p-5 relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="absolute top-0 right-0 w-14 h-14 opacity-[0.06]" style={{ backgroundColor: '#3B82F6', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Episodes</p>
          <p className="text-3xl font-black" style={{ color: '#3B82F6' }}>{podcasts.reduce((s, p) => s + p.episodeCount, 0)}</p>
        </div>
        <div className="zine-border p-5 relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="absolute top-0 right-0 w-14 h-14 opacity-[0.06]" style={{ backgroundColor: '#22C55E', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Status</p>
          <p className="text-3xl font-black" style={{ color: '#22C55E' }}>
            {podcasts.filter(p => p.status === 'published').length > 0 ? 'Live' : 'Draft'}
          </p>
        </div>
      </div>

      {/* Podcasts Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>Your Podcasts</h2>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {podcasts.length === 0 ? 'You haven\'t created any podcasts yet.' : `${podcasts.length} podcast${podcasts.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <Link
          href="/creator/new-podcast"
          className="inline-flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all cursor-pointer"
          style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}
        >
          <span className="text-lg">➕</span> New Podcast
        </Link>
      </div>

      {isLoadingPodcasts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="zine-border p-6 animate-pulse" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="h-6 rounded mb-4" style={{ backgroundColor: 'var(--border-subtle)', width: '60%' }}></div>
              <div className="h-4 rounded mb-2" style={{ backgroundColor: 'var(--border-subtle)', width: '80%' }}></div>
              <div className="h-4 rounded" style={{ backgroundColor: 'var(--border-subtle)', width: '40%' }}></div>
            </div>
          ))}
        </div>
      ) : podcasts.length === 0 ? (
        /* Empty State */
        <div className="zine-border p-12 text-center" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="text-6xl mb-4">🎙️</div>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            Create Your First Podcast
          </h3>
          <p className="font-medium mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Pick a name, choose your colors, and start building episodes with our drag-and-drop editor.
          </p>
          <Link
            href="/creator/new-podcast"
            className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase tracking-widest text-sm border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all cursor-pointer"
            style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}
          >
            🚀 Get Started
          </Link>
        </div>
      ) : (
        /* Podcast Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {podcasts.map(podcast => (
            <div key={podcast.id} className="zine-border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)' }}>
              {/* Color bar */}
              <div className="h-3" style={{ backgroundColor: podcast.accentColor }}></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-black uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {podcast.title}
                  </h3>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5"
                    style={{
                      backgroundColor: podcast.status === 'published' ? '#22C55E' : 'var(--text-muted)',
                      color: podcast.status === 'published' ? '#fff' : 'var(--page-bg)',
                    }}
                  >
                    {podcast.status}
                  </span>
                </div>
                <p className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: podcast.accentColor }}>
                  Hosted by {podcast.host}
                </p>
                <p className="text-sm font-medium mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {podcast.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {podcast.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2" style={{ borderColor: 'var(--border-subtle)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t-2 border-dashed pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    {podcast.episodeCount} Episode{podcast.episodeCount !== 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/creator/podcast/${podcast.id}`}
                      className="text-xs font-black uppercase tracking-widest px-3 py-1.5 zine-border shadow-[2px_2px_0px_var(--border-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)] transition-all"
                      style={{ backgroundColor: podcast.accentColor, color: podcast.textOnAccent === 'white' ? '#fff' : '#000' }}
                    >
                      Manage →
                    </Link>
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
