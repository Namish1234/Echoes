import { NextResponse } from 'next/server';
import { episodes, podcasts } from '@/lib/data';

// ─── Scoring weights for deterministic ranking ───
// These simulate real engagement metrics based on episode properties.
// When real YouTube/Spotify data is available, these are replaced.

const GUEST_WEIGHT: Record<string, number> = {
  'Elon Musk': 98,
  'Bill Gates': 95,
  'Sam Altman': 94,
  'Yann LeCun': 92,
  'Dario Amodei': 91,
  'Ray Dalio': 90,
  'Yuval Noah Harari': 89,
  'Chamath Palihapitiya': 88,
  'Vinod Khosla': 87,
  'Ted Sarandos': 85,
  'Dara Khosrowshahi': 84,
  'Kumar Mangalam Birla': 83,
  'Bryan Johnson, Nithin Kamath & Panel': 82,
  'Ritesh Agarwal, Ghazal Alagh, Manish Poddar': 80,
  'Tanmay Bhat, Prajakta Koli, Ranveer Allahbadia, Nuseir Yassin': 79,
  'Omar Sultan Al Olama': 78,
  'Rajan Anandan': 76,
  'Naval Ravikant': 93,
  'Dr. Andrew Huberman': 86,
  'Sarah Mei': 70,
  'Simon Sinek': 91,
  'Vijay Mallya': 94,
  'Emmanuel Macron': 96,
  'Karan Johar': 82,
  'Smriti Irani': 80,
  'Suniel Shetty': 78,
};

const TAG_BOOST: Record<string, number> = {
  'TECHNOLOGY & AI': 15,
  'BUSINESS & ECONOMICS': 12,
  'STARTUPS & VC': 10,
  'SOCIETY & GOVERNANCE': 8,
  'HEALTH & WELLNESS': 7,
  'CREATORS & MEDIA': 6,
  'SPORTS': 5,
};

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateMetrics(episodeId: string, guestWeight: number, tagBoost: number, isNew: boolean) {
  const seed = hashCode(episodeId);
  
  // Base views: 50K to 15M range, weighted by guest prominence
  const baseViews = Math.floor(((guestWeight / 100) * 14_500_000) + 500_000 + (seed % 500_000));
  
  // Likes: 2-8% of views
  const likeRatio = 0.02 + ((seed % 60) / 1000);
  const likes = Math.floor(baseViews * likeRatio);
  
  // Rank movement: -30 to +30, newer episodes trend up
  const movement = isNew 
    ? Math.floor((seed % 20) + 1) 
    : Math.floor((seed % 41) - 20);
  
  // Trending score: recency + engagement velocity
  const trendingBoost = isNew ? 30 : 0;
  const trendingScore = guestWeight + tagBoost + trendingBoost + (movement > 0 ? movement : 0);
  
  // Popularity score: total engagement
  const popularityScore = guestWeight + tagBoost + Math.floor(Math.log10(baseViews) * 10);
  
  return {
    views: baseViews,
    likes,
    movement,
    trendingScore,
    popularityScore,
  };
}

export interface RankedEpisode {
  id: string;
  rank: number;
  number: string;
  series: string;
  title: string;
  guest: string;
  description: string;
  tags: string[];
  date: string;
  duration: string;
  isNew?: boolean;
  podcastColor: string;
  views: number;
  likes: number;
  movement: number; // positive = up, negative = down
  trendingScore: number;
  popularityScore: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab') || 'trending';     // trending | popular | category
  const category = searchParams.get('category') || 'all'; // tag filter
  
  // Build ranked list
  const rankedEpisodes: RankedEpisode[] = episodes.map((ep) => {
    const guestWeight = GUEST_WEIGHT[ep.guest] || 50 + (hashCode(ep.guest) % 30);
    const tagBoost = ep.tags.reduce((acc, tag) => {
      return acc + (TAG_BOOST[tag] || 3);
    }, 0);
    
    const metrics = generateMetrics(ep.id, guestWeight, tagBoost, !!ep.isNew);
    
    // Find podcast color
    const podcast = podcasts.find(p => p.id === ep.podcastId) || 
                    podcasts.find(p => ep.series?.toLowerCase().includes(p.title.toLowerCase().split(' ')[0]));
    
    let podcastColor = '#FF6B00'; // default orange
    if (ep.series?.includes('WTF') || ep.series?.includes('People by WTF')) podcastColor = '#FF6B00';
    else if (ep.series?.includes('Figuring')) podcastColor = '#3B82F6';
    else if (ep.series?.includes('Builder')) podcastColor = '#22C55E';
    else if (ep.series?.includes('Mind')) podcastColor = '#8B5CF6';
    else if (ep.series?.includes('Creator')) podcastColor = '#EAB308';
    else if (ep.series?.includes('Opponent')) podcastColor = '#00E5FF';
    else if (podcast) podcastColor = podcast.coverColor.replace('bg-[', '').replace(']', '').replace('bg-wtf-orange', '#FF6B00');
    
    return {
      id: ep.id,
      rank: 0, // will be set after sorting
      number: ep.number,
      series: ep.series || 'Echoes',
      title: ep.title,
      guest: ep.guest,
      description: ep.description,
      tags: ep.tags,
      date: ep.date,
      duration: ep.duration,
      isNew: ep.isNew,
      podcastColor,
      ...metrics,
    };
  });
  
  // Filter by category if specified
  let filtered = rankedEpisodes;
  if (category !== 'all') {
    filtered = rankedEpisodes.filter(ep => 
      ep.tags.some(tag => tag.toUpperCase().includes(category.toUpperCase()))
    );
  }
  
  // Sort by tab
  if (tab === 'trending') {
    filtered.sort((a, b) => b.trendingScore - a.trendingScore);
  } else if (tab === 'popular') {
    filtered.sort((a, b) => b.popularityScore - a.popularityScore);
  } else {
    filtered.sort((a, b) => b.views - a.views);
  }
  
  // Assign ranks
  filtered.forEach((ep, idx) => {
    ep.rank = idx + 1;
  });
  
  return NextResponse.json({
    tab,
    category,
    total: filtered.length,
    episodes: filtered,
  });
}
