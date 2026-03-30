'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { RankedEpisode } from '@/app/api/rankings/route';

const TABS = [
  { id: 'trending', label: 'Trending' },
  { id: 'popular', label: 'Popular' },
  { id: 'category', label: 'By Category' },
] as const;

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'technology', label: 'Technology & AI' },
  { id: 'business', label: 'Business & Economics' },
  { id: 'startups', label: 'Startups & VC' },
  { id: 'society', label: 'Society & Governance' },
  { id: 'health', label: 'Health & Wellness' },
  { id: 'creators', label: 'Creators & Media' },
  { id: 'sports', label: 'Sports' },
];

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

function getRankAccent(rank: number): string {
  if (rank === 1) return '#FFD700'; // gold
  if (rank === 2) return '#C0C0C0'; // silver
  if (rank === 3) return '#CD7F32'; // bronze
  return '';
}

// Skeleton loader for card
function SkeletonCard() {
  return (
    <div className="zine-border bg-wtf-white shadow-[4px_4px_0px_#000] animate-pulse">
      <div className="flex gap-0">
        <div className="w-20 md:w-24 shrink-0 flex items-center justify-center bg-wtf-cream border-r-3 border-wtf-black">
          <div className="w-12 h-16 bg-gray-200 rounded" />
        </div>
        <div className="flex-1 p-4 md:p-5 space-y-3">
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<string>('trending');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [episodes, setEpisodes] = useState<RankedEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRankings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tab: activeTab, category: activeCategory });
      const res = await fetch(`/api/rankings?${params}`);
      const data = await res.json();
      setEpisodes(data.episodes);
    } catch (err) {
      console.error('Failed to fetch rankings:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeCategory]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  return (
    <div className="w-full min-h-screen">
      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO BANNER                                           */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="border-b-4 border-wtf-black relative overflow-hidden bg-wtf-cream">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Decorative shapes */}
        <div className="absolute z-0 w-6 h-6 bg-wtf-orange rounded-full border-2 border-wtf-black top-16 right-1/4 hidden md:block" />
        <div
          className="absolute z-0 w-5 h-5 bg-[#3B82F6] border-2 border-wtf-black bottom-12 left-1/3 rotate-45 hidden md:block"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />
        <div className="absolute z-0 w-10 h-1 bg-wtf-black top-1/2 left-[15%] rotate-[20deg] hidden md:block" />

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-block border-2 border-wtf-black text-wtf-black px-4 py-1 text-xs font-bold mb-4 tracking-widest uppercase bg-wtf-white shadow-[4px_4px_0px_#000]">
                📊 Live Rankings
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-none uppercase tracking-tighter text-wtf-black">
                RANK<span className="text-wtf-orange">INGS</span>
              </h1>
              <p className="text-lg md:text-xl font-medium max-w-xl mt-4 opacity-80">
                The most impactful conversations, ranked by audience engagement across YouTube, Spotify, and community signals.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="zine-border bg-wtf-white px-6 py-4 shadow-[4px_4px_0px_#000] text-center">
                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Total Episodes</p>
                <p className="text-4xl font-black text-wtf-orange">{episodes.length || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TAB NAVIGATION                                         */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="border-b-4 border-wtf-black bg-wtf-white sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'category') setActiveCategory('all');
                }}
                className={`
                  relative px-6 md:px-10 py-4 font-black uppercase tracking-widest text-sm transition-all cursor-pointer
                  ${activeTab === tab.id
                    ? 'text-wtf-orange'
                    : 'text-wtf-black opacity-50 hover:opacity-100'
                  }
                `}
              >
                {tab.label}
                {/* Active indicator */}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[4px] bg-wtf-orange" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CATEGORY FILTER PILLS (visible on "By Category" tab)   */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === 'category' && (
        <section className="border-b-4 border-wtf-black bg-wtf-cream">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    shrink-0 px-5 py-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer
                    border-3 border-wtf-black
                    ${activeCategory === cat.id
                      ? 'bg-wtf-orange text-wtf-black shadow-[3px_3px_0px_#000]'
                      : 'bg-wtf-white text-wtf-black hover:bg-wtf-orange hover:text-wtf-black shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:-translate-y-0.5'
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* RANKINGS GRID                                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        {/* Tab info header */}
        <div className="flex justify-between items-center mb-8">
          <p className="font-bold text-sm uppercase tracking-widest opacity-50">
            {loading ? 'Loading...' : `${episodes.length} episodes ranked`}
          </p>
          <p className="font-bold text-xs uppercase tracking-widest opacity-40">
            Updated in real-time
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Rankings list */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {episodes.map((ep) => {
              const rankAccent = getRankAccent(ep.rank);
              const isTop3 = ep.rank <= 3;

              return (
                <Link
                  href={`/episodes/${ep.id}`}
                  key={ep.id}
                  className="group block"
                >
                  <article
                    className={`
                      zine-border bg-wtf-white overflow-hidden transition-all duration-300
                      hover:-translate-y-1 cursor-pointer
                      ${isTop3
                        ? 'shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#000]'
                        : 'shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#000]'
                      }
                    `}
                  >
                    <div className="flex gap-0">
                      {/* ── Rank Number Column ── */}
                      <div
                        className={`
                          w-20 md:w-24 shrink-0 flex flex-col items-center justify-center
                          border-r-3 border-wtf-black relative overflow-hidden
                          ${isTop3 ? 'bg-wtf-black' : 'bg-wtf-cream'}
                        `}
                      >
                        {/* Podcast color stripe at top */}
                        <div
                          className="absolute top-0 left-0 right-0 h-1"
                          style={{ backgroundColor: ep.podcastColor }}
                        />

                        {/* Rank number */}
                        <span
                          className={`
                            font-black leading-none
                            ${isTop3
                              ? 'text-4xl md:text-5xl'
                              : 'text-3xl md:text-4xl text-wtf-black'
                            }
                          `}
                          style={isTop3 ? { color: rankAccent } : undefined}
                        >
                          {ep.rank}
                        </span>

                        {/* Movement indicator */}
                        {ep.movement !== 0 && (
                          <span
                            className={`
                              text-[10px] font-black mt-1 flex items-center gap-0.5
                              ${ep.movement > 0 ? 'text-green-500' : 'text-red-400'}
                            `}
                          >
                            {ep.movement > 0 ? '▲' : '▼'}
                            {Math.abs(ep.movement)}
                          </span>
                        )}
                      </div>

                      {/* ── Content Column ── */}
                      <div className="flex-1 p-4 md:p-5 flex flex-col gap-2 min-w-0">
                        {/* Series + Date row */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5"
                            style={{
                              backgroundColor: ep.podcastColor,
                              color: ['#EAB308', '#00E5FF', '#FFD700'].includes(ep.podcastColor) ? '#000' : '#fff',
                            }}
                          >
                            {ep.series}
                          </span>
                          {ep.isNew && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-green-500 text-white">
                              NEW
                            </span>
                          )}
                          {ep.movement >= 10 && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-wtf-orange text-wtf-black">
                              🔥 HOT
                            </span>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-auto">
                            {ep.date}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm md:text-base font-black uppercase tracking-tight leading-snug line-clamp-2 group-hover:text-wtf-orange transition-colors">
                          {ep.title}
                        </h3>

                        {/* Guest */}
                        <p className="text-xs font-bold opacity-60 truncate">
                          ft. {ep.guest}
                        </p>

                        {/* Tags + Metrics */}
                        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t-2 border-dashed border-wtf-black">
                          {/* Tags */}
                          <div className="flex gap-1.5 overflow-hidden">
                            {ep.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] font-bold uppercase tracking-widest border-2 border-wtf-black px-1.5 py-0.5 shrink-0"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Engagement metrics */}
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="flex items-center gap-1 text-[10px] font-black text-wtf-orange">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                              {formatNumber(ep.likes)}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-black opacity-50">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {formatNumber(ep.views)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && episodes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">📡</span>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No Data Yet</h3>
            <p className="font-bold text-sm uppercase tracking-widest opacity-50">
              No episodes found for this category.
            </p>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BOTTOM CTA                                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="border-t-4 border-wtf-black bg-wtf-black text-wtf-white">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
              Explore the Full Catalog
            </h2>
            <p className="font-medium text-lg opacity-70 mt-2">
              Deep-dive into transcripts, mindmaps, and key lessons.
            </p>
          </div>
          <Link
            href="/podcasts"
            className="zine-border bg-wtf-orange text-wtf-black px-10 py-4 font-black uppercase tracking-widest text-sm hover:-translate-y-1 shadow-[4px_4px_0px_#fff] hover:shadow-[8px_8px_0px_#fff] transition-all shrink-0"
          >
            All Podcasts →
          </Link>
        </div>
      </section>
    </div>
  );
}
