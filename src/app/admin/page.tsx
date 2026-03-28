'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAllPublishedPodcasts } from '@/lib/creatorService';
import type { CreatorPodcast, AnalyticsEvent } from '@/lib/creatorTypes';

interface UserCount {
  total: number;
  creators: number;
  admins: number;
}

export default function AdminDashboard() {
  const [userCounts, setUserCounts] = useState<UserCount>({ total: 0, creators: 0, admins: 0 });
  const [podcasts, setPodcasts] = useState<CreatorPodcast[]>([]);
  const [recentViews, setRecentViews] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Get users
        const usersSnap = await getDocs(collection(db, 'users'));
        const users = usersSnap.docs.map(d => d.data());
        const userCounts: UserCount = {
          total: users.length,
          creators: users.filter(u => u.role === 'creator').length,
          admins: users.filter(u => u.role === 'admin').length,
        };
        setUserCounts(userCounts);

        // Get podcasts
        const pods = await getAllPublishedPodcasts();
        setPodcasts(pods);

        // Get recent analytics
        const analyticsQ = query(collection(db, 'analytics'), orderBy('timestamp', 'desc'));
        const analyticsSnap = await getDocs(analyticsQ);
        const events = analyticsSnap.docs.slice(0, 50).map(d => ({ ...d.data(), id: d.id } as AnalyticsEvent));
        setRecentViews(events);
      } catch (e) {
        console.error('Error loading admin data:', e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const pageViewCount = recentViews.filter(e => e.type === 'page_view').length;
  const avgScrollDepth = (() => {
    const scrollEvents = recentViews.filter(e => e.type === 'scroll_depth' && e.scrollDepth);
    if (scrollEvents.length === 0) return 0;
    return Math.round(scrollEvents.reduce((sum, e) => sum + (e.scrollDepth || 0), 0) / scrollEvents.length);
  })();

  if (loading) {
    return (
      <div className="p-10">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 rounded" style={{ backgroundColor: 'var(--border-subtle)' }}></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4" style={{ backgroundColor: '#EF4444', color: '#fff' }}>
          Admin Dashboard
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none" style={{ color: 'var(--text-primary)' }}>
          Platform <span style={{ color: '#EF4444' }}>Overview</span>
        </h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Users', value: userCounts.total, color: '#3B82F6', icon: '👥' },
          { label: 'Creators', value: userCounts.creators, color: '#FF6B00', icon: '🎨' },
          { label: 'Page Views', value: pageViewCount, color: '#22C55E', icon: '👁️' },
          { label: 'Avg Scroll', value: `${avgScrollDepth}%`, color: '#8B5CF6', icon: '📜' },
        ].map(metric => (
          <div key={metric.label} className="zine-border p-5 relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: metric.color }}></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{metric.label}</p>
                <p className="text-3xl font-black" style={{ color: metric.color }}>{metric.value}</p>
              </div>
              <span className="text-3xl opacity-20">{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Community Podcasts */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Community Podcasts ({podcasts.length})
          </h2>
          {podcasts.length === 0 ? (
            <div className="zine-border p-6 text-center" style={{ backgroundColor: 'var(--surface)' }}>
              <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>No community podcasts yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {podcasts.map(p => (
                <div key={p.id} className="zine-border p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--surface)' }}>
                  <div className="w-3 h-12 shrink-0" style={{ backgroundColor: p.accentColor }}></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm uppercase tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>by {p.host}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5" style={{ backgroundColor: '#22C55E', color: '#fff' }}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Recent Activity
          </h2>
          {recentViews.length === 0 ? (
            <div className="zine-border p-6 text-center" style={{ backgroundColor: 'var(--surface)' }}>
              <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>No analytics data yet. Analytics will appear once tracking is active.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentViews.slice(0, 20).map((event, i) => (
                <div key={i} className="zine-border p-3 flex items-center gap-3" style={{ backgroundColor: 'var(--surface)' }}>
                  <span className="text-lg">
                    {event.type === 'page_view' ? '👁️' : event.type === 'scroll_depth' ? '📜' : '📍'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{event.page}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      {event.type.replace('_', ' ')}
                      {event.scrollDepth ? ` · ${event.scrollDepth}%` : ''}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Role Distribution */}
      <div className="mt-10">
        <h2 className="text-xl font-black uppercase tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>User Roles Distribution</h2>
        <div className="zine-border p-6" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="flex items-end gap-6 h-32">
            {[
              { label: 'Users', count: userCounts.total - userCounts.creators - userCounts.admins, color: '#3B82F6' },
              { label: 'Creators', count: userCounts.creators, color: '#FF6B00' },
              { label: 'Admins', count: userCounts.admins, color: '#EF4444' },
            ].map(role => {
              const maxCount = Math.max(userCounts.total, 1);
              const height = Math.max((role.count / maxCount) * 100, 8);
              return (
                <div key={role.label} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-lg font-black" style={{ color: role.color }}>{role.count}</span>
                  <div className="w-full zine-border" style={{ height: `${height}px`, backgroundColor: role.color }}></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{role.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
