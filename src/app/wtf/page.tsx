'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { episodes } from '@/lib/data';
import Pagination from '@/components/Pagination';

const ALL_CATEGORIES = ["ALL", "STARTUPS & VC", "TECHNOLOGY & AI", "SOCIETY & GOVERNANCE", "BUSINESS & ECONOMICS", "HEALTH & WELLNESS", "CREATORS & MEDIA"];

export default function HomeWrapper() {
  return (
    <Suspense fallback={null}>
      <Home />
    </Suspense>
  );
}

function Home() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const backHref = from === 'archives' ? '/archives' : '/podcasts';
  const backLabel = from === 'archives' ? '← Back to Archives' : '← Back to Podcasts';

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  // Filter episodes based on category and search query (including invisible tags)
  const filteredEpisodes = episodes.filter((ep) => {
    // Category match
    const matchCategory = activeCategory === "ALL" || ep.tags.includes(activeCategory);
    
    // Search match
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = 
      searchLower === "" ||
      ep.title.toLowerCase().includes(searchLower) ||
      ep.description.toLowerCase().includes(searchLower) ||
      ep.guest.toLowerCase().includes(searchLower) ||
      (ep.invisibleTags || []).some(tag => tag.toLowerCase().includes(searchLower));

    return matchCategory && matchSearch;
  });

  // --- Pagination Logic ---
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredEpisodes.length / ITEMS_PER_PAGE);

  // Reset pagination when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const paginatedEpisodes = filteredEpisodes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full">
      {/* Hero Section Grid Redesign */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="zine-border bg-wtf-white shadow-zine-lg p-8 md:p-16 relative overflow-hidden">
          {/* Decorative Grid Pattern layered behind */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-12 border-b-4 border-wtf-black pb-12 mb-12">
            <div className="flex flex-col items-start">
              <Link href={backHref} className="inline-block bg-wtf-orange text-wtf-black px-3 py-1 text-xs font-bold mb-4 tracking-widest uppercase border-2 border-wtf-black shadow-[2px_2px_0px_#000]">
                {backLabel}
              </Link>
              <div className="inline-block bg-wtf-black text-wtf-white px-3 py-1 text-xs font-bold mb-6 tracking-widest uppercase">
                Digital Archive Series
              </div>
              <h1 className="text-6xl md:text-[8rem] font-black leading-none uppercase tracking-tighter">
                WTF <br/><span className="text-wtf-orange">Podcast.</span>
              </h1>
            </div>
            
            <div className="max-w-md">
              <p className="text-xl md:text-2xl font-bold mb-8 leading-snug">
                Casual yet intellectually stimulating conversations with the world&apos;s sharpest minds. Hosted by Nikhil Kamath. Top Spotify Global Podcast.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="zine-border bg-wtf-black text-wtf-white px-8 py-4 font-bold uppercase tracking-widest shadow-zine zine-button text-sm">
                  Explore Learnings
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-8 font-bold uppercase tracking-widest text-sm">
            <div className="flex-1 border-l-4 border-wtf-orange pl-4">
              <span className="opacity-50 block mb-1">Host</span>
              <span className="text-xl">Nikhil Kamath</span>
            </div>
            <div className="flex-1 border-l-4 border-wtf-orange pl-4">
              <span className="opacity-50 block mb-1">Episodes</span>
              <span className="text-xl">23+ Archived</span>
            </div>
            <div className="flex-1 border-l-4 border-wtf-orange pl-4">
              <span className="opacity-50 block mb-1">Series</span>
              <span className="text-xl">WTF is + People</span>
            </div>
            <div className="flex-1 border-l-4 border-wtf-orange pl-4">
              <span className="opacity-50 block mb-1">Available</span>
              <span className="text-xl">Global</span>
            </div>
          </div>
        </div>
      </section>

      {/* Episode Explorer Header with Search & Filter */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="flex flex-col border-b-4 border-wtf-black pb-4 gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Episodes ({filteredEpisodes.length})</h2>
              <div className="flex flex-wrap gap-3 mt-6">
                {ALL_CATEGORIES.map(category => (
                  <button 
                    key={category}
                    onClick={() => { setActiveCategory(category); }}
                    className={`zine-border px-6 py-1 font-bold rounded-full text-sm transition-colors ${
                      activeCategory === category 
                        ? 'bg-wtf-black text-wtf-white' 
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
                  placeholder="Search episodes, guests, tags..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); }}
                  className="zine-border pl-4 pr-10 py-2 w-full md:w-72 font-bold outline-none focus:ring-2 focus:ring-wtf-orange bg-wtf-white"
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
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {paginatedEpisodes.length > 0 ? (
            paginatedEpisodes.map(ep => (
            <Link key={ep.id} href={`/episode/${ep.id}`} className="zine-border bg-wtf-white shadow-zine p-6 flex flex-col hover:-translate-y-1 hover:shadow-zine-lg transition-all cursor-pointer">
              <div className="border-b-2 border-wtf-black pb-4 mb-4">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight leading-tight">{ep.title}</h3>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {ep.isNew && <span className="bg-wtf-orange text-wtf-black text-[10px] font-bold px-2 py-0.5 uppercase">New</span>}
                    <span className="bg-wtf-black text-wtf-white text-xs font-bold px-2 py-0.5">{ep.series ? `${ep.series} #${ep.number}` : `EP ${ep.number}`}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-wtf-orange uppercase tracking-widest">with {ep.guest}</span>
              </div>
              <p className="font-medium leading-relaxed mb-6 flex-1">{ep.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest">
                {ep.tags.map(tag => (
                  <span key={tag} className="border-2 border-wtf-black px-2 py-0.5">{tag}</span>
                ))}
                <span className="border-2 border-wtf-black px-2 py-0.5 bg-wtf-black text-wtf-white">{ep.duration}</span>
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
              className="mt-6 zine-border bg-wtf-orange px-6 py-2 font-bold uppercase shadow-zine zine-button text-wtf-black"
            >
              Clear Filters
            </button>
          </div>
        )}
        </div>

        {paginatedEpisodes.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </section>

      {/* About the Creator */}
      <section className="bg-wtf-black text-wtf-white py-24 border-t-4 border-wtf-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-5xl font-black uppercase mb-8 leading-none tracking-tighter italic">
              About the <br /><span className="text-wtf-orange">Host.</span>
            </h2>
            <p className="text-lg leading-relaxed mb-6 opacity-80">
              Nikhil Kamath is the co-founder of Zerodha, India&apos;s largest stock brokerage, and True Beacon, a hedge fund managing billions in assets. A self-taught trader who dropped out of school at 14, he became one of India&apos;s youngest self-made billionaires.
            </p>
            <p className="text-lg leading-relaxed mb-6 opacity-80">
              He launched the WTF podcast in March 2024 with a mission to create educative, informative shows freely available to everyone. The show quickly became one of Spotify&apos;s top global video podcasts. It spans two sub-series: &ldquo;WTF is&rdquo; (topic deep-dives) and &ldquo;People by WTF&rdquo; (candid interviews with world leaders).
            </p>
            <p className="text-lg leading-relaxed mb-10 opacity-80">
              For each episode, Kamath encourages donations to charity, often letting the audience choose the recipient. His approach: ask raw questions, play curious, and make guests comfortable enough to reveal what textbooks never teach.
            </p>
            <div className="border-t-2 border-wtf-orange pt-8">
              <p className="font-bold uppercase tracking-widest text-sm mb-6">Notable Guests</p>
              <div className="flex flex-wrap gap-3">
                {["PM Modi", "Bill Gates", "Elon Musk", "Yann LeCun", "Dario Amodei", "Sam Altman", "Ray Dalio", "Ted Sarandos", "Bryan Johnson"].map((guest) => (
                  <span key={guest} className="border-2 border-wtf-white px-3 py-1 text-sm font-bold uppercase tracking-widest">
                    {guest}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="zine-border bg-wtf-orange p-10 shadow-zine rotate-1">
              <h4 className="text-wtf-black font-black text-2xl mb-4 uppercase">The WTF Vision</h4>
              <ul className="space-y-4 text-wtf-black font-bold">
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-black text-wtf-white px-2 py-0.5">01</span> No sugar-coating business reality.
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-black text-wtf-white px-2 py-0.5">02</span> Democratizing high-level mentorship.
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-black text-wtf-white px-2 py-0.5">03</span> Building a community of doers.
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-black text-wtf-white px-2 py-0.5">04</span> Free, educative shows — donate to charity per episode.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
