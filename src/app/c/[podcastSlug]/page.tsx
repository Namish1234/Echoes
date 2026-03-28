'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPodcastBySlug, getCreatorEpisodes } from '@/lib/creatorService';
import type { CreatorPodcast, CreatorEpisode } from '@/lib/creatorTypes';

export default function PublicPodcastPage() {
  const params = useParams();
  const podcastSlug = params.podcastSlug as string;

  const [podcast, setPodcast] = useState<CreatorPodcast | null>(null);
  const [episodes, setEpisodes] = useState<CreatorEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getPodcastBySlug(podcastSlug);
      if (p) {
        setPodcast(p);
        const eps = await getCreatorEpisodes(p.id);
        setEpisodes(eps.filter(e => e.status === 'published'));
      }
      setLoading(false);
    }
    load();
  }, [podcastSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-bold uppercase tracking-widest animate-pulse" style={{ color: 'var(--text-primary)' }}>Loading...</span>
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-3xl font-black uppercase" style={{ color: 'var(--text-primary)' }}>Podcast Not Found</h2>
        <Link href="/" className="font-bold" style={{ color: 'var(--color-wtf-orange)' }}>← Back to Echoes</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32 border-b-4" style={{ borderColor: 'var(--border-color)' }}>
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, var(--border-color) 1px, transparent 1px), linear-gradient(to bottom, var(--border-color) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}></div>
        {/* Accent bar */}
        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: podcast.accentColor }}></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--page-bg)' }}>
            Community Podcast
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6" style={{ color: 'var(--text-primary)' }}>
            {podcast.title}<span style={{ color: podcast.accentColor }}>.</span>
          </h1>
          <p className="text-lg md:text-xl font-medium leading-relaxed max-w-3xl mb-6" style={{ color: 'var(--text-secondary)' }}>
            {podcast.description}
          </p>
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: podcast.accentColor }}>
            Hosted by {podcast.host}
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b-4 flex divide-x-0" style={{ borderColor: 'var(--border-color)' }}>
        {[
          { label: 'Host', value: podcast.host },
          { label: 'Episodes', value: episodes.length.toString() },
          { label: 'Tags', value: podcast.tags.slice(0, 3).join(', ') },
        ].map((stat) => (
          <div key={stat.label} className="flex-1 px-6 py-4 border-l-4" style={{ borderLeftColor: podcast.accentColor }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            <p className="font-black text-lg truncate" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Episodes */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8" style={{ color: 'var(--text-primary)' }}>
          Episodes<span style={{ color: podcast.accentColor }}>.</span>
        </h2>

        {episodes.length === 0 ? (
          <div className="zine-border p-12 text-center" style={{ backgroundColor: 'var(--surface)' }}>
            <p className="font-bold" style={{ color: 'var(--text-muted)' }}>No episodes published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {episodes.map((ep, i) => (
              <Link
                key={ep.id}
                href={`/c/${podcastSlug}/${ep.slug}`}
                className="block zine-border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--border-color)] group"
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <div className="flex">
                  <div className="w-20 shrink-0 flex items-center justify-center font-black text-2xl" style={{ backgroundColor: podcast.accentColor, color: podcast.textOnAccent === 'white' ? '#fff' : '#000' }}>
                    {ep.number || i + 1}
                  </div>
                  <div className="flex-1 p-5">
                    <h3 className="font-black text-xl uppercase tracking-tight mb-1 group-hover:underline decoration-4" style={{ color: 'var(--text-primary)', textDecorationColor: podcast.accentColor }}>
                      {ep.title}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                      {ep.guest && `${ep.guest} · `}{ep.date}{ep.duration && ` · ${ep.duration}`}
                    </p>
                    <p className="text-sm font-medium line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{ep.description}</p>
                    {ep.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {ep.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2" style={{ borderColor: 'var(--border-subtle)' }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="hidden md:flex items-center px-6 font-black uppercase tracking-widest text-sm opacity-0 group-hover:opacity-100 transition-all" style={{ color: podcast.accentColor }}>
                    Read →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
