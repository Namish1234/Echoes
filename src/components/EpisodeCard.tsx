import Link from 'next/link';
import { Episode } from '@/lib/data';

export default function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="zine-border bg-wtf-white p-6 shadow-zine-lg flex flex-col justify-between hover:-translate-y-1 hover:shadow-[12px_12px_0px_#000] transition-all" data-purpose="episode-card">
      <div>
        <div className="border-b-2 border-wtf-black pb-4 mb-4">
          <div className="flex justify-between items-start gap-3 mb-3">
            <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight leading-tight">{episode.title}</h3>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {episode.isNew && <span className="bg-[#00D1FF] text-wtf-black text-[10px] font-bold px-2 py-0.5 uppercase">New</span>}
              <span className="bg-wtf-black text-wtf-white text-xs font-bold px-2 py-0.5">{episode.series ? `${episode.series} #${episode.number}` : `EP ${episode.number}`}</span>
            </div>
          </div>
          <span className="text-sm font-bold text-wtf-orange uppercase tracking-widest">with {episode.guest}</span>
        </div>
        <p className="text-xs font-bold opacity-60 mb-3 uppercase tracking-widest">
          {episode.date} • {episode.duration}
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">{episode.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest pt-4 border-t-2 border-dashed border-gray-300">
        {episode.tags.map(tag => (
          <span key={tag} className="border-2 border-wtf-black px-2 py-0.5">{tag}</span>
        ))}
        <span className="border-2 border-wtf-black px-2 py-0.5 bg-wtf-black text-wtf-white">{episode.duration}</span>
        <div className="flex-1"></div>
        <Link href={`/episode/${episode.id}#transcript`}>
          <button className="zine-border bg-wtf-white px-3 py-1 font-bold text-xs uppercase shadow-zine zine-button text-wtf-black">
            Transcript
          </button>
        </Link>
        <Link href={`/episode/${episode.id}#resources`}>
          <button className="zine-border bg-wtf-orange px-3 py-1 font-bold text-xs uppercase shadow-zine zine-button text-wtf-black">
            Resources
          </button>
        </Link>
      </div>
    </article>
  );
}
