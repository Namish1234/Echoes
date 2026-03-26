'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { theOpponentsEpisodes } from '@/lib/data';

const ALL_CATEGORIES = ["ALL", "SPORTS", "HEALTH & MIND", "RESILIENCE"];

export default function TheOpponentsPageWrapper() {
  return (
    <Suspense fallback={null}>
      <TheOpponentsPage />
    </Suspense>
  );
}

function TheOpponentsPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const backHref = from === 'archives' ? '/archives' : '/podcasts';
  const backLabel = from === 'archives' ? '← Back to Archives' : '← Back to Podcasts';

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const observerTarget = useRef<HTMLDivElement>(null);

  const filteredEpisodes = theOpponentsEpisodes.filter((ep) => {
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
          {/* Decorative Grid Pattern layered behind */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          {/* Dynamic Sports/Math Symbols */}
          <div className="absolute z-[5] text-[#00E5FF] top-12 right-[20%] text-4xl font-black opacity-40 rotate-[15deg] hidden md:block select-none">Δ</div>
          <div className="absolute z-[5] text-[#00E5FF] bottom-20 left-[15%] text-5xl font-black opacity-30 rotate-[-10deg] hidden md:block select-none">Σ</div>
          <div className="absolute z-[5] text-wtf-black top-[35%] right-[10%] opacity-20 hidden md:block select-none">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </div>
          <div className="absolute z-[5] text-[#00E5FF] bottom-[30%] right-[25%] opacity-40 hidden md:block select-none" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', width: '24px', height: '24px', backgroundColor: '#00E5FF' }}></div>
          <div className="absolute z-[5] w-8 h-8 rounded-full border-4 border-[#00E5FF] top-[15%] left-[40%] opacity-30 hidden md:block select-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-12 border-b-4 border-wtf-black pb-12 mb-12">
            <div className="flex flex-col items-start">
              <Link href={backHref} className="inline-block bg-[#00E5FF] text-black px-3 py-1 text-xs font-bold mb-4 tracking-widest uppercase border-2 border-wtf-black shadow-[2px_2px_0px_#000] hover:-translate-y-1 transition-transform">
                {backLabel}
              </Link>
              <div className="inline-block bg-wtf-black dark:bg-wtf-white text-wtf-white dark:text-wtf-black px-3 py-1 text-xs font-bold mb-6 tracking-widest uppercase">
                Digital Archive Series
              </div>
              <h1 className="text-6xl md:text-[8rem] font-black leading-none uppercase tracking-tighter text-wtf-black">
                The <br/><span className="text-[#00E5FF]">Opponents.</span>
              </h1>
            </div>

            <div className="max-w-md">
              <p className="text-xl md:text-2xl font-bold mb-8 leading-snug text-wtf-black">
                Inspiring comeback stories, sports resilience, and examining the ultimate competitive mindset.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="zine-border bg-[#00E5FF] text-black px-8 py-4 font-black uppercase tracking-widest shadow-zine zine-button text-sm flex items-center gap-2">
                  <span>Start Training</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-8 font-black uppercase tracking-widest text-sm text-wtf-black">
            <div className="flex-1 border-l-4 border-[#00E5FF] pl-4">
              <span className="opacity-50 block mb-1">Theme</span>
              <span className="text-xl">Resilience</span>
            </div>
            <div className="flex-1 border-l-4 border-[#00E5FF] pl-4">
              <span className="opacity-50 block mb-1">Episodes</span>
              <span className="text-xl">1+ Active</span>
            </div>
            <div className="flex-1 border-l-4 border-[#00E5FF] pl-4">
              <span className="opacity-50 block mb-1">Focus</span>
              <span className="text-xl">Sports & Mind</span>
            </div>
            <div className="flex-1 border-l-4 border-[#00E5FF] pl-4">
              <span className="opacity-50 block mb-1">Equation</span>
              <span className="text-xl">Effort = Result</span>
            </div>
          </div>
        </div>
      </section>

      {/* Episode Explorer */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="flex flex-col border-b-4 border-wtf-black pb-4 gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-wtf-black">Sessions ({filteredEpisodes.length})</h2>
              <div className="flex flex-wrap gap-3 mt-6">
                {ALL_CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => { setActiveCategory(category); setVisibleCount(4); }}
                    className={`zine-border px-6 py-1 font-bold rounded-full text-sm transition-colors ${
                      activeCategory === category
                        ? 'bg-wtf-black text-wtf-white border-wtf-black'
                        : 'bg-wtf-white text-wtf-black hover:bg-gray-100 border-wtf-black'
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
                  placeholder="Search athletes, sports..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(4); }}
                  className="zine-border pl-4 pr-10 py-2 w-full md:w-72 font-bold outline-none focus:ring-4 focus:ring-[#00E5FF] bg-wtf-white text-wtf-black border-wtf-black transition-all shadow-[4px_4px_0px_#00E5FF]"
                />
                <svg className="absolute right-3 top-3 h-5 w-5 text-wtf-black opacity-50 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episode Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {visibleEpisodes.length > 0 ? (
          visibleEpisodes.map(ep => (
            <Link href={`/episode/${ep.id}`} key={ep.id} className="zine-border bg-wtf-white shadow-[4px_4px_0px_#111] hover:shadow-[12px_12px_0px_#00E5FF] p-6 flex flex-col hover:-translate-y-2 transition-all block text-wtf-black">
              <div className="border-b-2 border-wtf-black pb-4 mb-4">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight leading-tight">{ep.title}</h3>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {ep.isNew && <span className="bg-[#00E5FF] text-black text-[10px] font-bold px-2 py-0.5 uppercase">New Content</span>}
                    <span className="bg-wtf-black text-wtf-white text-xs font-black px-2 py-0.5">OP {ep.number}</span>
                  </div>
                </div>
                <span className="text-sm font-black text-[#00E5FF] drop-shadow-sm uppercase tracking-widest">with {ep.guest}</span>
              </div>
              <p className="font-medium leading-relaxed mb-6 flex-1 line-clamp-3 opacity-90">{ep.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest">
                {ep.tags.map(tag => (
                  <span key={tag} className="border-2 border-wtf-black px-2 py-0.5">{tag}</span>
                ))}
                <span className="border-2 border-wtf-black px-2 py-0.5 bg-wtf-black text-wtf-white">{ep.duration}</span>
                <span className="border-2 border-[#00E5FF] px-2 py-0.5 text-[#00E5FF]">{ep.date}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-wtf-black">
            <h3 className="text-2xl font-black uppercase mb-2">No opponents found</h3>
            <p className="font-medium opacity-70">Try adjusting your filters or search query.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
              className="mt-6 zine-border bg-[#00E5FF] text-black px-6 py-2 font-black uppercase shadow-zine transition-transform hover:scale-105"
            >
              Reset Track
            </button>
          </div>
        )}
      </section>

      <div ref={observerTarget} className="w-full h-20 -mt-10 mb-20 flex items-center justify-center">
        {hasMore && (
           <span className="font-black text-wtf-black uppercase tracking-widest animate-pulse zine-border px-8 py-3 bg-wtf-white shadow-zine inline-block border-wtf-black">
             Pacing the track...
           </span>
        )}
      </div>

      {/* About Section */}
      <section className="bg-wtf-black text-wtf-white py-24 border-t-4 border-wtf-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-5xl font-black uppercase mb-8 leading-none tracking-tighter italic">
              About The <br /><span className="text-[#00E5FF]">Show.</span>
            </h2>

            <p className="text-lg leading-relaxed mb-6 opacity-80 font-medium">
              Every great athlete faces an opponent. But the hardest opponent to defeat is often oneself. The Opponents podcast dives deep into the psychology of world-class athletes, uncovering the darkest moments of injury, defeat, and the monumental effort required to claw back to the top.
            </p>
            <p className="text-lg leading-relaxed mb-6 opacity-80 font-medium">
              We deconstruct the physical and mental training plans, focusing on the formulas—the <strong>Δ</strong> and the <strong>Σ</strong>—the continuous change and summation of daily efforts that create unbelievable comeback stories.
            </p>

            <div className="border-t-2 border-[#00E5FF] pt-8">
              <p className="font-bold uppercase tracking-widest text-sm mb-6">Upcoming & Past Athletes</p>
              <div className="flex flex-wrap gap-3">
                {["Vic Williamson", "Recovering Champions", "Elite Cyclists", "Olympians"].map((guest) => (
                  <span key={guest} className="border-2 border-wtf-white px-3 py-1 text-sm font-bold uppercase tracking-widest hover:bg-[#00E5FF] hover:text-wtf-black hover:border-[#00E5FF] transition-colors cursor-default">
                    {guest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="zine-border bg-[#00E5FF] p-10 shadow-[8px_8px_0px_#FFF] rotate-1 transition-transform hover:rotate-0 duration-300">
              <h4 className="text-wtf-black font-black text-2xl mb-4 uppercase flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                The Equation
              </h4>
              <ul className="space-y-4 text-wtf-black font-black text-lg">
                <li className="flex items-center gap-4">
                  <span className="bg-wtf-black text-[#00E5FF] px-2 py-0.5 text-sm">Δ</span> Embrace the change.
                </li>
                <li className="flex items-center gap-4">
                  <span className="bg-wtf-black text-[#00E5FF] px-2 py-0.5 text-sm">Σ</span> Sum of daily efforts.
                </li>
                <li className="flex items-center gap-4">
                  <span className="bg-wtf-black text-[#00E5FF] px-2 py-0.5 text-sm">⚡</span> Unrelenting power.
                </li>
                <li className="flex items-center gap-4">
                  <span className="bg-wtf-black text-[#00E5FF] px-2 py-0.5 text-sm">∞</span> Infinite resilience.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
