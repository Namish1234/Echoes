'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { podcasts, episodes, Episode } from '@/lib/data';
import { presetAvatars } from '@/lib/avatars';
import SaveButton from './SaveButton';
import Pagination from './Pagination';
import { useState } from 'react';

// Tag matching logic: map questionnaire interests → episode tag matching
function getMatchingEpisodes(userInterests: string[], allEpisodes: typeof episodes) {
  if (!userInterests || userInterests.length === 0) return allEpisodes;

  return [...allEpisodes].sort((a, b) => {
    const aScore = a.tags.filter((tag) =>
      userInterests.some(
        (interest) =>
          tag.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(tag.toLowerCase())
      )
    ).length;
    const bScore = b.tags.filter((tag) =>
      userInterests.some(
        (interest) =>
          tag.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(tag.toLowerCase())
      )
    ).length;
    // Higher matching score first, then by date
    if (bScore !== aScore) return bScore - aScore;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export default function FeedPage({ dbOfflineFallback }: { dbOfflineFallback?: boolean }) {
  const { userProfile, isLoading } = useAuth();
  const curatedEpisodes = getMatchingEpisodes(userProfile?.interests || [], episodes);
  // Pick some "trending" episodes (just the top 4 most recent for now)
  const trendingEpisodes = [...episodes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
  const savedEpisodes = episodes.filter((ep) =>
    userProfile?.savedEpisodes?.includes(ep.id)
  );
  const unseenEpisodes = dbOfflineFallback ? trendingEpisodes.slice(0, 3) : curatedEpisodes.filter(
    (ep) => !userProfile?.viewedEpisodes?.includes(ep.id)
  );
  if (isLoading) return null; // Wait for profile

  const avatarSvg = (() => {
    const av = presetAvatars.find((a) => a.id === (userProfile?.avatarId || 'av-01'));
    if (!av) return '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="${av.bgColor}" rx="0"/>${av.svgPath}</svg>`;
  })();

  // --- Pagination Logic ---
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(curatedEpisodes.length / ITEMS_PER_PAGE);

  const paginatedEpisodes = curatedEpisodes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full min-h-screen">
      {/* Feed Header */}
      <section className="border-b-4 border-wtf-black relative overflow-hidden bg-wtf-cream">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Decorative shapes */}
        <div className="absolute z-0 w-5 h-5 bg-wtf-orange rounded-full border-2 border-wtf-black top-16 left-[15%] hidden md:block" />
        <div className="absolute z-0 w-4 h-4 bg-[#3B82F6] border-2 border-wtf-black bottom-12 right-[20%] rotate-45 hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        <div className="absolute z-0 w-10 h-2 bg-wtf-black top-[50%] right-[12%] rotate-[20deg] hidden md:block" />

        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-block border-2 border-wtf-black text-wtf-black px-4 py-1 text-xs font-bold mb-4 tracking-widest uppercase bg-wtf-white shadow-[4px_4px_0px_#000]">
                Your Feed
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                Welcome back,<br />
                <span className="text-wtf-orange">{(userProfile?.displayName || 'Explorer').split(' ')[0]}</span>
              </h1>
            </div>
            <p className="text-lg font-medium opacity-70 max-w-md">
              Curated for you based on your interests. Discover episodes that align with your intellectual appetite.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Feed Column */}
          <div className="flex-1">
            {/* Trending Section */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6 border-b-4 border-wtf-black pb-4">
                <h2 className="text-3xl md:text-3xl font-black uppercase tracking-tighter">Trending Now</h2>
                <span className="bg-[#00D1FF] text-wtf-black text-xs font-bold px-3 py-1 zine-border shadow-[2px_2px_0px_#000]">
                  HOT
                 </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trendingEpisodes.map((ep) => (
                  <Link
                    key={ep.id + '-trending'}
                    href={`/episode/${ep.id}`}
                    className="zine-border bg-wtf-white p-4 shadow-zine hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all flex flex-col justify-between block relative"
                  >
                     <div className="absolute top-0 right-0 w-8 h-8 bg-wtf-orange flex items-center justify-center font-black border-l-3 border-b-3 border-wtf-black z-10">
                        {ep.number}
                     </div>
                     <h3 className="font-black text-lg uppercase tracking-tight leading-tight mb-2 pr-6">
                       {ep.title}
                     </h3>
                     <p className="text-xs font-bold text-wtf-orange uppercase tracking-widest">
                       {ep.guest}
                     </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* For You / General Feed Section */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8 border-b-4 border-wtf-black pb-4">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                  {dbOfflineFallback ? 'The Daily Echo' : 'For You'}
                </h2>
                <span className="bg-wtf-orange text-wtf-black text-xs font-bold px-3 py-1 zine-border shadow-[2px_2px_0px_#000]">
                  {dbOfflineFallback ? 'GENERAL FEED' : `${curatedEpisodes.length} EPISODES`}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedEpisodes.map((ep) => (
                  <article
                    key={ep.id}
                    className="zine-border bg-wtf-white p-6 shadow-zine-lg hover:-translate-y-1 hover:shadow-[12px_12px_0px_#000] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <Link href={`/episode/${ep.id}`}>
                          <h3 className="font-black text-xl uppercase tracking-tight leading-tight hover:text-wtf-orange transition-colors">
                            {ep.title}
                          </h3>
                        </Link>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {ep.isNew && (
                            <span className="bg-[#00D1FF] text-wtf-black text-[10px] font-bold px-2 py-0.5 uppercase">
                              New
                            </span>
                          )}
                          <span className="bg-wtf-black text-wtf-white text-xs font-bold px-2 py-0.5">
                            EP {ep.number}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-wtf-orange uppercase tracking-widest block mb-3">
                        with {ep.guest}
                      </span>
                      <p className="text-xs font-bold opacity-60 mb-3 uppercase tracking-widest">
                        {ep.date} • {ep.duration}
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-6 text-sm">{ep.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest pt-4 border-t-2 border-dashed border-gray-300">
                      {ep.tags.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="border-2 border-wtf-black px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                      <div className="flex-1" />
                      <SaveButton episodeId={ep.id} />
                      <Link href={`/episode/${ep.id}`}>
                        <span className="zine-border bg-wtf-orange px-3 py-1 font-bold text-xs uppercase shadow-zine zine-button text-wtf-black">
                          Read →
                        </span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Numbered Pagination */}
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Queue (Saved) Episodes */}
            {savedEpisodes.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-8 border-b-4 border-wtf-black pb-4">
                  <h2 className="text-3xl font-black uppercase tracking-tighter">Your Queue</h2>
                  <span className="bg-wtf-black text-wtf-white text-xs font-bold px-3 py-1 zine-border shadow-[2px_2px_0px_#000]">
                    {savedEpisodes.length} SAVED
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedEpisodes.slice(0, 4).map((ep) => (
                    <Link
                      key={ep.id}
                      href={`/episode/${ep.id}`}
                      className="zine-border bg-wtf-white p-5 shadow-zine hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all block"
                    >
                      <h4 className="font-black text-lg uppercase tracking-tight mb-1">{ep.title}</h4>
                      <p className="text-sm font-bold text-wtf-orange uppercase tracking-widest">
                        {ep.guest} • {ep.duration}
                      </p>
                    </Link>
                  ))}
                </div>
                {savedEpisodes.length > 4 && (
                  <Link
                    href="/profile#saved"
                    className="inline-block mt-4 font-bold text-sm uppercase tracking-widest text-wtf-orange hover:text-wtf-black transition-colors"
                  >
                    View all saved →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Profile Sidebar (Desktop) */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-28 max-h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-32">
              {/* Profile Card */}
              {(() => {
                const isGoogleAvatar = userProfile?.avatarId === 'google' && userProfile?.photoURL;
                const avatarSvg = !isGoogleAvatar ? (() => {
                  const av = presetAvatars.find((a) => a.id === (userProfile?.avatarId || 'av-01'));
                  if (!av) return '';
                  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="${av.bgColor}" rx="0"/>${av.svgPath}</svg>`;
                })() : '';

                return (
                  <div className="zine-border bg-wtf-white shadow-[8px_8px_0px_#000] overflow-hidden mb-8">
                    <div className="bg-wtf-black p-6 flex items-center gap-4 relative">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            'linear-gradient(to right, var(--grid-line-inv) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line-inv) 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                      />
                      <div className="w-16 h-16 zine-border overflow-hidden relative z-10 shrink-0">
                        {isGoogleAvatar ? (
                          <img src={userProfile?.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: avatarSvg }} className="w-full h-full" />
                        )}
                      </div>
                  <div className="relative z-10">
                    <p className="font-black text-lg uppercase tracking-widest text-wtf-white leading-tight">
                      {userProfile?.displayName || 'Explorer'}
                    </p>
                    <p className="text-xs font-medium text-wtf-white opacity-50 truncate">
                      {userProfile?.email || 'No email provided'}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-black text-wtf-orange">{userProfile?.savedEpisodes?.length || 0}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Saved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black text-wtf-orange">{userProfile?.viewedEpisodes?.length || 0}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Viewed</p>
                    </div>
                  </div>
                  {/* Interests */}
                  {userProfile?.interests && userProfile.interests.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-3">Your Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.interests.slice(0, 6).map((tag: string) => (
                          <span
                            key={tag}
                            className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  href="/profile"
                  className="block bg-wtf-cream border-t-3 border-wtf-black px-6 py-3 font-bold text-sm uppercase tracking-widest text-center hover:bg-wtf-orange hover:text-wtf-black transition-colors"
                >
                  View Full Profile →
                </Link>
              </div>
              );
            })()}

              {/* Discover New */}
              {unseenEpisodes.length > 0 && (
                <div className="zine-border bg-wtf-cream shadow-[4px_4px_0px_#000] p-6">
                  <h3 className="font-black uppercase tracking-widest text-sm mb-4 border-b-2 border-wtf-black pb-2">
                    Unwatched For You
                  </h3>
                  <div className="space-y-3">
                    {unseenEpisodes.slice(0, 3).map((ep) => (
                      <Link
                        key={ep.id}
                        href={`/episode/${ep.id}`}
                        className="block hover:text-wtf-orange transition-colors"
                      >
                        <p className="font-bold text-sm leading-tight">{ep.title}</p>
                        <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">
                          {ep.guest}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
