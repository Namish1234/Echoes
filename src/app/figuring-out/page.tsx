'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { figuringOutEpisodes } from '@/lib/data';
import Pagination from '@/components/Pagination';

const ALL_CATEGORIES = ["ALL", "GEOPOLITICS", "BUSINESS", "LEADERSHIP", "ENTERTAINMENT", "PSYCHOLOGY", "TECHNOLOGY", "MENTAL HEALTH", "STARTUPS", "SELF-IMPROVEMENT"];

export default function FiguringOutPageWrapper() {
  return (
    <Suspense fallback={null}>
      <FiguringOutPage />
    </Suspense>
  );
}

function FiguringOutPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const backHref = from === 'archives' ? '/archives' : '/podcasts';
  const backLabel = from === 'archives' ? '← Back to Archives' : '← Back to Podcasts';

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredEpisodes = figuringOutEpisodes.filter((ep) => {
    const matchCategory = activeCategory === "ALL" || ep.tags.includes(activeCategory);
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = 
      searchLower === "" ||
      ep.title.toLowerCase().includes(searchLower) ||
      ep.description.toLowerCase().includes(searchLower) ||
      ep.guest.toLowerCase().includes(searchLower);

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
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="zine-border bg-wtf-white shadow-zine-lg p-8 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Small random shapes */}
          <div className="absolute z-[5] w-3 h-3 bg-[#3B82F6] border border-wtf-black top-12 right-[20%] rotate-[30deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          <div className="absolute z-[5] w-4 h-4 bg-wtf-orange border border-wtf-black bottom-20 left-[15%] rotate-[55deg] hidden md:block"></div>
          <div className="absolute z-[5] w-5 h-1 bg-wtf-black top-[35%] right-[10%] rotate-[45deg] hidden md:block"></div>
          <div className="absolute z-[5] w-3 h-3 bg-[#3B82F6] border border-wtf-black bottom-[30%] right-[25%] rotate-[15deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-12 border-b-4 border-wtf-black pb-12 mb-12">
            <div className="flex flex-col items-start">
              <Link href={backHref} className="inline-block bg-wtf-orange text-wtf-black px-3 py-1 text-xs font-bold mb-4 tracking-widest uppercase border-2 border-wtf-black shadow-[2px_2px_0px_#000]">
                {backLabel}
              </Link>
              <div className="inline-block bg-wtf-black text-wtf-white px-3 py-1 text-xs font-bold mb-6 tracking-widest uppercase">
                Digital Archive Series
              </div>
              <h1 className="text-6xl md:text-[8rem] font-black leading-none uppercase tracking-tighter">
                Figuring<br/><span className="text-[#3B82F6]">Out.</span>
              </h1>
            </div>
            
            <div className="max-w-md">
              <p className="text-xl md:text-2xl font-bold mb-8 leading-snug">
                An authoritative guide to business, relationships, politics, and health. Figuring out how to grow daily. Hosted by Raj Shamani.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="zine-border bg-[#3B82F6] text-wtf-white px-8 py-4 font-bold uppercase tracking-widest shadow-zine zine-button text-sm">
                  Explore Episodes
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-8 font-bold uppercase tracking-widest text-sm">
            <div className="flex-1 border-l-4 border-[#3B82F6] pl-4">
              <span className="opacity-50 block mb-1">Host</span>
              <span className="text-xl">Raj Shamani</span>
            </div>
            <div className="flex-1 border-l-4 border-[#3B82F6] pl-4">
              <span className="opacity-50 block mb-1">Episodes</span>
              <span className="text-xl">484+</span>
            </div>
            <div className="flex-1 border-l-4 border-[#3B82F6] pl-4">
              <span className="opacity-50 block mb-1">Focus</span>
              <span className="text-xl">Growth & Mastery</span>
            </div>
            <div className="flex-1 border-l-4 border-[#3B82F6] pl-4">
              <span className="opacity-50 block mb-1">Views</span>
              <span className="text-xl">400M+ / Year</span>
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
                        ? 'bg-[#3B82F6] text-wtf-white border-[#3B82F6]' 
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
                  onChange={(e) => { setSearchQuery(e.target.value); }}
                  className="zine-border pl-4 pr-10 py-2 w-full md:w-72 font-bold outline-none focus:ring-2 focus:ring-[#3B82F6] bg-wtf-white"
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
                    {ep.isNew && <span className="bg-[#3B82F6] text-wtf-white text-[10px] font-bold px-2 py-0.5 uppercase">New</span>}
                    <span className="bg-wtf-black text-wtf-white text-xs font-bold px-2 py-0.5">FO {ep.number}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#3B82F6] uppercase tracking-widest">with {ep.guest}</span>
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
              className="mt-6 zine-border bg-[#3B82F6] text-wtf-white px-6 py-2 font-bold uppercase shadow-zine zine-button"
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
              About the <br /><span className="text-[#3B82F6]">Host.</span>
            </h2>
            <p className="text-lg leading-relaxed mb-6 opacity-80">
              Raj Shamani is a Forbes 30 Under 30 entrepreneur, angel investor, and author of &ldquo;Build, Don&apos;t Talk.&rdquo; His journey began at 16, door-to-door selling dish soaps for his family&apos;s chemical business — scaling it to ₹200 crore turnover by 2020.
            </p>
            <p className="text-lg leading-relaxed mb-6 opacity-80">
              Today, he&apos;s spoken at the United Nations and TEDx, founded House of X to help creators build D2C brands, and invested in startups like Classplus, Wint Wealth, and Growth School. Figuring Out garners 400M+ views annually.
            </p>
            <p className="text-lg leading-relaxed mb-10 opacity-80">
              His mission: inspire and empower young people in finance, startups, sales, and seizing opportunities — through raw, unfiltered conversations with the world&apos;s sharpest minds.
            </p>
            <div className="border-t-2 border-[#3B82F6] pt-8">
              <p className="font-bold uppercase tracking-widest text-sm mb-6">Notable Guests</p>
              <div className="flex flex-wrap gap-3">
                {["Bill Gates", "Emmanuel Macron", "Simon Sinek", "Karan Johar", "Vijay Mallya", "Smriti Irani"].map((guest) => (
                  <span key={guest} className="border-2 border-wtf-white px-3 py-1 text-sm font-bold uppercase tracking-widest">
                    {guest}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="zine-border bg-[#3B82F6] p-10 shadow-zine rotate-1">
              <h4 className="text-wtf-white font-black text-2xl mb-4 uppercase">The Figuring Out Vision</h4>
              <ul className="space-y-4 text-wtf-white font-bold">
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-white text-[#3B82F6] px-2 py-0.5">01</span> Democratizing knowledge across India.
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-white text-[#3B82F6] px-2 py-0.5">02</span> Build, don&apos;t talk — action over theory.
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-white text-[#3B82F6] px-2 py-0.5">03</span> Figure out how to grow daily.
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-white text-[#3B82F6] px-2 py-0.5">04</span> Empower creators to build empires.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
