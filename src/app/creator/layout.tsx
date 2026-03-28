'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

const NAV_ITEMS = [
  { href: '/creator/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/creator/new-podcast', label: 'New Podcast', icon: '➕' },
];

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/become-creator');
        return;
      }
      if (userProfile && userProfile.role !== 'creator' && userProfile.role !== 'admin') {
        router.push('/become-creator');
      }
    }
  }, [user, userProfile, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-bold uppercase tracking-widest animate-pulse" style={{ color: 'var(--text-primary)' }}>Loading...</span>
      </div>
    );
  }

  if (!user || !userProfile || (userProfile.role !== 'creator' && userProfile.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-50 md:hidden zine-border p-2 shadow-zine cursor-pointer"
        style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}
        aria-label="Toggle sidebar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
          {sidebarOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 z-40 flex flex-col border-r-4 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)' }}
      >
        {/* Logo area */}
        <div className="p-6 border-b-4" style={{ borderColor: 'var(--border-color)' }}>
          <Link href="/" className="block">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Echoes Platform</p>
            <h2 className="text-2xl font-black uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>
              Creator <span style={{ color: 'var(--color-wtf-orange)' }}>Studio</span>
            </h2>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-widest text-sm transition-all ${
                  isActive
                    ? 'zine-border shadow-[3px_3px_0px_var(--border-color)]'
                    : 'hover:translate-x-1'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--color-wtf-orange)' : 'transparent',
                  color: isActive ? '#000' : 'var(--text-primary)',
                }}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          {/* Admin link (only for admins) */}
          {userProfile.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-widest text-sm hover:translate-x-1 transition-all mt-4 border-t-2 pt-6"
              style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
            >
              <span className="text-lg">🔐</span>
              Admin Panel
            </Link>
          )}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black" style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}>
              {userProfile.displayName?.charAt(0)?.toUpperCase() || 'E'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{userProfile.displayName}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{userProfile.role}</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 mt-3 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all"
            style={{ color: 'var(--text-primary)' }}
          >
            ← Back to Echoes
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
