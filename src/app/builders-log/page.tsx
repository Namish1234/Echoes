'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { episodes } from '@/lib/data';

const ALL_CATEGORIES = ["ALL", "TECH & AI", "STARTUPS & VC", "CREATORS", "SOCIETY & LAW"];

export default function BuildersLogWrapper() {
  return (
    <Suspense fallback={null}>
      <BuildersLogPage />
    </Suspense>
  );
}

function BuildersLogPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const backHref = from === 'archives' ? '/archives' : '/podcasts';
  const backLabel = from === 'archives' ? '← Back to Archives' : '← Back to Podcasts';

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const observerTarget = useRef<HTMLDivElement>(null);

  const filteredEpisodes = episodes.filter((ep) => {
    if (ep.podcastId !== 'builders-log') return false;
    const matchCategory = activeCategory === "ALL" || ep.tags.includes(activeCategory);
    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      searchLower === "" ||
      ep.title.toLowerCase().includes(searchLower) ||
      ep.description.toLowerCase().includes(searchLower) ||
      ep.guest.toLowerCase().includes(searchLower);
    return matchCategory && matchSearch;
  });

  const visibleEpisodes = filteredEpisodes.slice(0, visibleCount);
  const hasMore = visibleEpisodes.length < filteredEpisodes.length;

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore) {
      setVisibleCount(prev => prev + 4);
    }
  }, [hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => { if (currentTarget) observer.unobserve(currentTarget); };
  }, [handleObserver]);

  return (
    <div className="w-full">
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="zine-border bg-wtf-white shadow-zine-lg p-8 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          <div className="absolute z-[5] w-3 h-3 bg-[#22C55E] border border-wtf-black top-12 right-[20%] rotate-[30deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          <div className="absolute z-[5] w-4 h-4 bg-wtf-orange border border-wtf-black bottom-20 left-[15%] rotate-[55deg] hidden md:block"></div>
          <div className="absolute z-[5] w-5 h-1 bg-wtf-black top-[35%] right-[10%] rotate-[45deg] hidden md:block"></div>
          <div className="absolute z-[5] w-3 h-3 bg-[#22C55E] border border-wtf-black bottom-[30%] right-[25%] rotate-[15deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-12 border-b-4 border-wtf-black pb-12 mb-12">
            <div className="flex flex-col items-start">
              <Link href={backHref} className="inline-block bg-wtf-orange text-wtf-black px-3 py-1 text-xs font-bold mb-4 tracking-widest uppercase border-2 border-wtf-black shadow-[2px_2px_0px_#000]">
                {backLabel}
              </Link>
              <div className="inline-block bg-wtf-black text-wtf-white px-3 py-1 text-xs font-bold mb-6 tracking-widest uppercase">
                Engineering Series
              </div>

              <h1 className="text-6xl md:text-[8rem] font-black leading-none uppercase tracking-tighter">
                The<br/><span className="text-[#22C55E]">Builder's Log.</span>
              </h1>
            </div>

            <div className="max-w-md">
              <p className="text-xl md:text-2xl font-bold mb-8 leading-snug">
                Raw technical dialogues dissecting application architecture, zero-to-one product building, and engineering culture.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="zine-border bg-[#22C55E] text-white px-8 py-4 font-bold uppercase tracking-widest shadow-zine zine-button text-sm">
                  Explore Episodes
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-8 font-bold uppercase tracking-widest text-sm">
            <div className="flex-1 border-l-4 border-[#22C55E] pl-4">
              <span className="opacity-50 block mb-1">Host</span>
              <span className="text-xl">Echoes Core</span>
            </div>
            <div className="flex-1 border-l-4 border-[#22C55E] pl-4">
              <span className="opacity-50 block mb-1">Episodes</span>
              <span className="text-xl">1</span>
            </div>
            <div className="flex-1 border-l-4 border-[#22C55E] pl-4">
              <span className="opacity-50 block mb-1">Focus</span>
              <span className="text-xl">Tech & AI</span>
            </div>
            <div className="flex-1 border-l-4 border-[#22C55E] pl-4">
              <span className="opacity-50 block mb-1">Reach</span>
              <span className="text-xl">50K+ / Month</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="flex flex-col border-b-4 border-wtf-black pb-4 gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Episodes ({filteredEpisodes.length})</h2>
              <div className="flex flex-wrap gap-3 mt-6">
                {ALL_CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => { setActiveCategory(category); setVisibleCount(4); }}
                    className={`zine-border px-6 py-1 font-bold rounded-full text-sm transition-colors ${
                      activeCategory === category
                        ? 'bg-[#22C55E] text-white border-[#22C55E]'
                        : 'bg-wtf-white text-wtf-black hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search episodes, guests..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(4); }}
                  className="zine-border pl-4 pr-10 py-2 w-full md:w-72 font-bold outline-none focus:ring-2 focus:ring-[#22C55E] bg-wtf-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {visibleEpisodes.length > 0 ? (
          visibleEpisodes.map(ep => (
            <Link href={`/episode/${ep.id}`} key={ep.id} className="zine-border bg-wtf-white shadow-zine p-6 flex flex-col hover:-translate-y-1 hover:shadow-zine-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#22C55E]">
              <div className="border-b-2 border-wtf-black pb-4 mb-4">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight leading-tight">{ep.title}</h3>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="bg-wtf-black text-white text-xs font-bold px-2 py-0.5">BL {ep.number}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#22C55E] uppercase tracking-widest">with {ep.guest}</span>
              </div>
              <p className="font-medium leading-relaxed mb-6 flex-1">{ep.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest">
                {ep.tags.map(tag => (
                  <span key={tag} className="border-2 border-wtf-black px-2 py-0.5">{tag}</span>
                ))}
                <span className="border-2 border-wtf-black px-2 py-0.5 bg-wtf-black text-white">{ep.duration}</span>
                <span className="border-2 border-wtf-black px-2 py-0.5 bg-wtf-cream">{ep.date}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-2xl font-black uppercase mb-2">No episodes found</h3>
            <p className="font-medium opacity-70">Try adjusting your filters or search query.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
              className="mt-6 zine-border bg-[#22C55E] text-white px-6 py-2 font-bold uppercase shadow-zine zine-button"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      <section className="bg-wtf-black text-wtf-white py-24 border-t-4 border-wtf-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-5xl font-black uppercase mb-8 leading-none tracking-tighter italic">
              About the <br /><span className="text-[#22C55E]">Host.</span>
            </h2>

            <p className="text-lg leading-relaxed mb-6 opacity-80">
              Echoes Core represents the collective intelligence of the platform's leading engineers.
            </p>
            <p className="text-lg leading-relaxed mb-6 opacity-80">
              The Builder's Log began as an internal knowledge-sharing initiative and evolved into a public archive of engineering excellence.
            </p>
            <p className="text-lg leading-relaxed mb-10 opacity-80">
              Our mission is to deconstruct complex technical architectures so the next generation of builders can compound their knowledge rapidly.
            </p>
          </div>

          <div className="flex-1 w-full">
            <div className="zine-border bg-[#22C55E] p-10 shadow-zine rotate-1 text-white">
              <h4 className="font-black text-2xl mb-4 uppercase">The Show Vision</h4>
              <ul className="space-y-4 font-bold">
                <li className="flex items-center gap-3">
                  <span className="bg-white text-[#22C55E] px-2 py-0.5">01</span> Document technical failure.
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-white text-[#22C55E] px-2 py-0.5">02</span> Study zero-to-one architecture.
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-white text-[#22C55E] px-2 py-0.5">03</span> Ignore hype, observe deployment.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
