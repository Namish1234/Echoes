import Link from 'next/link';
import { episodes } from '@/lib/data';

export default function EpisodePage() {
  const episode = episodes.find(ep => ep.id === 'ep-special');

  if (!episode) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text-primary)' }}>
        <p className="text-xl font-bold">Episode not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="mb-6">
          <Link href="/wtf" className="text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all" style={{ color: 'var(--text-primary)' }}>
            ← Back to WTF Podcast
          </Link>
        </div>
        <div className="mb-4">
          <span className="text-xs font-bold tracking-widest uppercase px-3 py-1" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--page-bg)' }}>
            {episode.series || 'Episode'} {episode.number}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-6" style={{ color: 'var(--text-primary)' }}>
          {episode.title}
        </h1>
        <p className="text-lg font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-wtf-orange)' }}>
          with {episode.guest}
        </p>
        <div className="flex flex-wrap items-center gap-3 mb-8" style={{ color: 'var(--text-secondary)' }}>
          <span>{episode.date}</span>
          <span className="opacity-30">|</span>
          <span>{episode.duration}</span>
        </div>
        <p className="text-lg leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
          {episode.description}
        </p>
        <div className="p-8 text-center zine-border" style={{ backgroundColor: 'var(--surface)' }}>
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Full episode content coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
