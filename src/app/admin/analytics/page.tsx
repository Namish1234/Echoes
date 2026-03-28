'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AnalyticsEvent } from '@/lib/creatorTypes';

interface PageStats {
  page: string;
  views: number;
  avgScroll: number;
  sections: number;
}

export default function AdminAnalyticsPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    async function load() {
      const q = query(collection(db, 'analytics'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      setEvents(snap.docs.map(d => ({ ...d.data(), id: d.id } as AnalyticsEvent)));
      setLoading(false);
    }
    load();
  }, []);

  // Filter by time
  const filtered = events.filter(e => {
    if (timeFilter === 'all') return true;
    const now = Date.now();
    const eventTime = new Date(e.timestamp).getTime();
    const diff = now - eventTime;
    if (timeFilter === '24h') return diff < 86400000;
    if (timeFilter === '7d') return diff < 604800000;
    if (timeFilter === '30d') return diff < 2592000000;
    return true;
  });

  // Page stats
  const pageStats: PageStats[] = (() => {
    const map = new Map<string, { views: number; scrolls: number[]; sections: Set<string> }>();
    filtered.forEach(e => {
      if (!map.has(e.page)) map.set(e.page, { views: 0, scrolls: [], sections: new Set() });
      const entry = map.get(e.page)!;
      if (e.type === 'page_view') entry.views++;
      if (e.type === 'scroll_depth' && e.scrollDepth) entry.scrolls.push(e.scrollDepth);
      if (e.type === 'section_view' && e.sectionId) entry.sections.add(e.sectionId);
    });
    return Array.from(map.entries())
      .map(([page, data]) => ({
        page,
        views: data.views,
        avgScroll: data.scrolls.length > 0 ? Math.round(data.scrolls.reduce((a, b) => a + b, 0) / data.scrolls.length) : 0,
        sections: data.sections.size,
      }))
      .sort((a, b) => b.views - a.views);
  })();

  // Referrer stats
  const referrerStats = (() => {
    const map = new Map<string, number>();
    filtered.filter(e => e.type === 'page_view' && e.referrer).forEach(e => {
      let ref = 'Direct';
      try {
        ref = e.referrer ? new URL(e.referrer).hostname : 'Direct';
      } catch {
        ref = e.referrer || 'Direct';
      }
      map.set(ref, (map.get(ref) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  })();

  // Scroll depth distribution
  const scrollDistribution = (() => {
    const buckets = { '0-25%': 0, '25-50%': 0, '50-75%': 0, '75-100%': 0 };
    filtered.filter(e => e.type === 'scroll_depth' && e.scrollDepth).forEach(e => {
      const d = e.scrollDepth!;
      if (d <= 25) buckets['0-25%']++;
      else if (d <= 50) buckets['25-50%']++;
      else if (d <= 75) buckets['50-75%']++;
      else buckets['75-100%']++;
    });
    return buckets;
  })();

  if (loading) {
    return (
      <div className="p-10">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-40 rounded" style={{ backgroundColor: 'var(--border-subtle)' }}></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <div className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4" style={{ backgroundColor: '#8B5CF6', color: '#fff' }}>
            Analytics
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            Deep <span style={{ color: '#8B5CF6' }}>Analytics</span>
          </h1>
        </div>
        <div className="flex gap-2">
          {(['24h', '7d', '30d', 'all'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-4 py-2 font-black uppercase tracking-widest text-xs zine-border cursor-pointer transition-all ${timeFilter === t ? 'shadow-[3px_3px_0px_var(--border-color)] -translate-y-0.5' : ''}`}
              style={{
                backgroundColor: timeFilter === t ? '#8B5CF6' : 'var(--surface)',
                color: timeFilter === t ? '#fff' : 'var(--text-primary)',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="zine-border p-5" style={{ backgroundColor: 'var(--surface)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Total Events</p>
          <p className="text-3xl font-black" style={{ color: '#8B5CF6' }}>{filtered.length}</p>
        </div>
        <div className="zine-border p-5" style={{ backgroundColor: 'var(--surface)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Page Views</p>
          <p className="text-3xl font-black" style={{ color: '#3B82F6' }}>{filtered.filter(e => e.type === 'page_view').length}</p>
        </div>
        <div className="zine-border p-5" style={{ backgroundColor: 'var(--surface)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Pages Tracked</p>
          <p className="text-3xl font-black" style={{ color: '#22C55E' }}>{pageStats.length}</p>
        </div>
        <div className="zine-border p-5" style={{ backgroundColor: 'var(--surface)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Referrers</p>
          <p className="text-3xl font-black" style={{ color: '#FF6B00' }}>{referrerStats.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>Top Pages</h2>
          <div className="space-y-2">
            {pageStats.length === 0 ? (
              <div className="zine-border p-6 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>No page view data yet.</p>
              </div>
            ) : (
              pageStats.slice(0, 10).map((ps, i) => (
                <div key={ps.page} className="zine-border p-3 flex items-center gap-3" style={{ backgroundColor: 'var(--surface)' }}>
                  <span className="w-8 h-8 flex items-center justify-center font-black text-sm shrink-0" style={{ backgroundColor: '#8B5CF6', color: '#fff' }}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{ps.page}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      {ps.views} views · {ps.avgScroll}% scroll · {ps.sections} sections
                    </p>
                  </div>
                  {/* Mini bar */}
                  <div className="w-20 h-3 zine-border overflow-hidden" style={{ backgroundColor: 'var(--page-bg)' }}>
                    <div className="h-full" style={{ width: `${Math.min(100, (ps.views / Math.max(pageStats[0]?.views || 1, 1)) * 100)}%`, backgroundColor: '#8B5CF6' }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Scroll Depth Distribution */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>Scroll Depth</h2>
          <div className="zine-border p-6" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="flex items-end gap-4 h-40">
              {Object.entries(scrollDistribution).map(([bucket, count]) => {
                const max = Math.max(...Object.values(scrollDistribution), 1);
                const height = Math.max((count / max) * 100, 5);
                const colors: Record<string, string> = { '0-25%': '#EF4444', '25-50%': '#FF6B00', '50-75%': '#EAB308', '75-100%': '#22C55E' };
                return (
                  <div key={bucket} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-sm font-black" style={{ color: colors[bucket] }}>{count}</span>
                    <div className="w-full zine-border" style={{ height: `${height}%`, backgroundColor: colors[bucket] }}></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{bucket}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referrers */}
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 mt-8" style={{ color: 'var(--text-primary)' }}>Entry Sources</h2>
          <div className="space-y-2">
            {referrerStats.length === 0 ? (
              <div className="zine-border p-6 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>No referrer data yet.</p>
              </div>
            ) : (
              referrerStats.map(([ref, count]) => (
                <div key={ref} className="zine-border p-3 flex items-center gap-3" style={{ backgroundColor: 'var(--surface)' }}>
                  <span className="text-xs font-bold flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{ref}</span>
                  <span className="font-black text-sm" style={{ color: '#FF6B00' }}>{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
