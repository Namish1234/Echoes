'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function SaveButton({ episodeId }: { episodeId: string }) {
  const { user, userProfile, toggleSaveEpisode } = useAuth();

  if (!user || !userProfile) return null;

  const isSaved = userProfile.savedEpisodes?.includes(episodeId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaveEpisode(episodeId);
      }}
      className={`zine-border px-3 py-1 font-bold text-xs uppercase shadow-zine zine-button transition-all cursor-pointer ${
        isSaved
          ? 'bg-wtf-orange text-wtf-black'
          : 'bg-wtf-white text-wtf-black hover:bg-wtf-orange'
      }`}
      title={isSaved ? 'Unsave' : 'Save episode'}
    >
      {isSaved ? '★ Saved' : '☆ Save'}
    </button>
  );
}
