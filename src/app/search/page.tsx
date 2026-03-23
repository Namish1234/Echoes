'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { episodes, podcasts } from '@/lib/data';
import Pagination from '@/components/Pagination';

// Wrap the actual search component in a Suspense boundary 
// because useSearchParams() triggers client-side de-opt warnings in Next.js if not suspended.
function SearchClient() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [networkSearchQuery, setNetworkSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Collect all unique tags from podcasts/episodes
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    podcasts.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Filter the episodes based on query, network, and tags
  const filteredEpisodes = useMemo(() => {
    let result = episodes;

    // 1. Text Query
    if (rawQuery.trim()) {
      const q = rawQuery.toLowerCase();
      result = result.filter(ep => 
        ep.title.toLowerCase().includes(q) ||
        (ep.guest && ep.guest.toLowerCase().includes(q)) ||
        (ep.description && ep.description.toLowerCase().includes(q)) ||
        (ep.tags && ep.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // 2. Network Filter (Robust logic supporting both new schemas and legacy prefixes)
    if (selectedNetwork) {
      result = result.filter(ep => {
        // Direct match if property exists
        if (ep.podcastId === selectedNetwork) return true;
        
        // Legacy id prefix fallback
        if (selectedNetwork === 'wtf-podcast' && ep.id.startsWith('ep-')) return true;
        if (selectedNetwork === 'figuring-out' && ep.id.startsWith('fo-')) return true;
        
        return false;
      });
    }

    // 3. Tags Filter
    if (selectedTags.length > 0) {
      result = result.filter(ep => 
        ep.tags && ep.tags.some(t => selectedTags.includes(t)) // OR logic for tags
      );
    }

    return result;
  }, [rawQuery, selectedNetwork, selectedTags]);

  // Pagination
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Reset pagination if search parameters change
  useEffect(() => {
    setCurrentPage(1);
  }, [rawQuery, selectedNetwork, selectedTags]);

  const totalPages = Math.ceil(filteredEpisodes.length / ITEMS_PER_PAGE);
  const paginatedEpisodes = filteredEpisodes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-wtf-cream w-full flex justify-center pb-24">
      {/* Background patterned grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl w-full mx-auto px-6 pt-12 relative z-10">
        
        {/* Header */}
        <div className="mb-12 border-b-4 border-wtf-black pb-8">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-wtf-black mb-4 flex items-center gap-4">
            Search Results
            <span className="bg-wtf-orange text-wtf-black px-4 py-2 text-2xl md:text-4xl shadow-[4px_4px_0px_#000]">
              {filteredEpisodes.length}
            </span>
          </h1>
          {rawQuery && (
            <p className="text-xl font-bold font-mono opacity-80">
              Query: &quot;{rawQuery}&quot;
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-8 lg:sticky lg:top-32">
            
            {/* Network Filter */}
            <div className="bg-wtf-white border-4 border-wtf-black shadow-[4px_4px_0px_#000] p-6 flex flex-col max-h-[400px]">
              <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-b-2 border-wtf-black pb-2 shrink-0">By Network</h2>
              
              <input 
                type="text" 
                placeholder="Find a network..." 
                className="w-full border-2 border-wtf-black px-3 py-2 text-xs font-bold uppercase tracking-widest mb-4 focus:outline-none shrink-0"
                value={networkSearchQuery}
                onChange={(e) => setNetworkSearchQuery(e.target.value)}
              />

              <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
                <button 
                  onClick={() => setSelectedNetwork(null)}
                  className={`text-left font-bold uppercase tracking-wide text-sm px-3 py-2 border-2 border-transparent hover:border-wtf-black transition-colors shrink-0 ${!selectedNetwork ? 'bg-wtf-black text-wtf-white' : 'text-wtf-black'}`}
                >
                  All Networks
                </button>
                {podcasts.filter(p => p.title.toLowerCase().includes(networkSearchQuery.toLowerCase())).map(pod => (
                  <button 
                    key={pod.id}
                    onClick={() => setSelectedNetwork(pod.id)}
                    className={`text-left font-bold uppercase tracking-wide text-sm px-3 py-2 border-2 border-transparent hover:border-wtf-black transition-colors flex items-center gap-3 shrink-0 ${selectedNetwork === pod.id ? 'bg-wtf-black text-wtf-white' : 'text-wtf-black'}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${pod.coverColor} border border-current`} />
                    <span className="truncate">{pod.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topics Filter */}
            <div className="bg-wtf-white border-4 border-wtf-black shadow-[4px_4px_0px_#000] p-6">
              <h2 className="text-xl font-black uppercase tracking-widest mb-4 border-b-2 border-wtf-black pb-2">By Topic</h2>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs font-bold uppercase tracking-widest px-3 py-2 border-2 border-wtf-black shadow-[2px_2px_0px_#000] hover:translate-y-px hover:shadow-[1px_1px_0px_#000] transition-all ${isSelected ? 'bg-wtf-orange text-wtf-black' : 'bg-transparent text-wtf-black'}`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* Results List */}
          <main className="flex-1 w-full flex flex-col gap-6">
            {filteredEpisodes.length > 0 ? (
              <>
                {paginatedEpisodes.map(ep => (
                <Link
                  href={`/episodes/${ep.id}`}
                  key={ep.id}
                  className="group bg-wtf-white border-4 border-wtf-black p-6 md:p-8 flex flex-col hover:-translate-y-1 shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#F97316] transition-all cursor-crosshair"
                >
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="font-black text-xs uppercase tracking-widest bg-wtf-black text-wtf-white px-2 py-1">
                      {ep.series || 'Echoes Original'}
                    </span>
                    {ep.guest && (
                      <span className="font-bold text-xs uppercase tracking-widest border-2 border-wtf-black px-2 py-0.5">
                        {ep.guest}
                      </span>
                    )}
                    <span className="font-bold text-xs uppercase tracking-widest border-2 border-transparent text-wtf-black opacity-60 ml-auto">
                      {ep.duration}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-none mb-4 group-hover:text-wtf-orange transition-colors">
                    {ep.title}
                  </h2>
                  
                  <p className="text-base font-medium opacity-80 leading-relaxed mb-6 line-clamp-3">
                    {ep.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {ep.tags && ep.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-widest border border-wtf-black px-2 py-1 opacity-70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}

              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
            ) : (
              <div className="w-full bg-wtf-white border-4 border-wtf-black border-dashed flex flex-col justify-center items-center py-32 px-6 text-center">
                <div className="w-24 h-24 mb-8 bg-wtf-cream border-4 border-wtf-black flex items-center justify-center rotate-12 shadow-[8px_8px_0px_#000]">
                  <span className="text-4xl">?</span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">No Signal Found</h3>
                <p className="text-lg font-medium opacity-70 max-w-md">We couldn&apos;t find any logs matching your current query and filters. Try widening your search parameters.</p>
                <button 
                  onClick={() => {
                    setSelectedNetwork(null);
                    setSelectedTags([]);
                  }}
                  className="mt-8 bg-wtf-orange border-4 border-wtf-black text-wtf-black font-black uppercase tracking-widest px-8 py-4 shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000]"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-wtf-cream w-full flex items-center justify-center"><h1 className="text-4xl font-black uppercase animate-pulse">Scanning Archives...</h1></div>}>
      <SearchClient />
    </Suspense>
  );
}
