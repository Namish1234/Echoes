'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllPublishedPodcasts } from '@/lib/creatorService';
import type { CreatorPodcast } from '@/lib/creatorTypes';

export default function CommunityPodcasts() {
  const [podcasts, setPodcasts] = useState<CreatorPodcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPublishedPodcasts().then(p => { setPodcasts(p); setLoading(false); });
  }, []);

  if (loading) return null; // Don't show skeleton — appears only after data loads
  if (podcasts.length === 0) return null; // Don't show section if no community podcasts

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 border-t-4 border-wtf-black">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-wtf-black whitespace-nowrap">
          🌐 Community Shows <span className="text-wtf-orange">({podcasts.length})</span>
        </h2>
        <div className="flex-1 h-1 bg-wtf-black"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {podcasts.map(p => (
          <Link
            key={p.id}
            href={`/c/${p.slug}`}
            className="group zine-border bg-wtf-white shadow-zine hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 transition-all overflow-hidden flex"
          >
            <div className="w-28 shrink-0 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: p.accentColor }}>
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(to right, rgba(0,0,0,.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.2) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}></div>
              <h3 className="relative z-10 text-3xl font-black uppercase tracking-tighter text-center break-words p-2" style={{ color: p.textOnAccent === 'white' ? '#fff' : '#000' }}>
                {p.title.split(' ').slice(0, 2).join('\n')}
              </h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="flex gap-2 mb-2 flex-wrap">
                {p.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">{tag}</span>
                ))}
              </div>
              <h4 className="text-xl font-black uppercase tracking-tight mb-1">{p.title}</h4>
              <p className="text-sm font-medium opacity-80 line-clamp-2 mb-3">{p.description}</p>
              <div className="flex justify-between items-center border-t-2 border-dashed border-wtf-black pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest">By {p.host}</span>
                <span className="font-black text-sm group-hover:text-wtf-black transition-colors" style={{ color: p.accentColor }}>EXPLORE →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/become-creator"
          className="inline-block zine-border bg-wtf-orange px-8 py-3 font-black uppercase tracking-widest text-sm text-wtf-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all"
        >
          🚀 Create Your Own Podcast
        </Link>
      </div>
    </section>
  );
}
