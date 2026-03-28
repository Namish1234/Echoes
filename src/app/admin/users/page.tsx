'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  avatarId: string;
  onboardingComplete?: boolean;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'users'));
      const all = snap.docs.map(d => ({ uid: d.id, ...d.data() } as User));
      setUsers(all);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = users.filter(u => {
    const matchesSearch = !search || u.displayName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
          {[1,2,3,4].map(i => <div key={i} className="h-16 rounded" style={{ backgroundColor: 'var(--border-subtle)' }}></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4" style={{ backgroundColor: '#EF4444', color: '#fff' }}>
          User Management
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>
          All Users <span style={{ color: '#EF4444' }}>({users.length})</span>
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 zine-border px-4 py-3 font-bold text-sm outline-none focus:shadow-[3px_3px_0px_var(--border-color)]"
          style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
        />
        <div className="flex gap-2">
          {['all', 'user', 'creator', 'admin'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-3 font-black uppercase tracking-widest text-xs zine-border transition-all cursor-pointer ${roleFilter === role ? 'shadow-[3px_3px_0px_var(--border-color)] -translate-y-0.5' : ''}`}
              style={{
                backgroundColor: roleFilter === role ? (role === 'admin' ? '#EF4444' : role === 'creator' ? '#FF6B00' : role === 'user' ? '#3B82F6' : 'var(--text-primary)') : 'var(--surface)',
                color: roleFilter === role ? '#fff' : 'var(--text-primary)',
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="space-y-2">
        {/* Header */}
        <div className="hidden md:flex gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          <span className="w-10">Avatar</span>
          <span className="flex-1">Name</span>
          <span className="w-56">Email</span>
          <span className="w-24">Role</span>
          <span className="w-28">Onboarding</span>
        </div>

        {filtered.length === 0 ? (
          <div className="zine-border p-8 text-center" style={{ backgroundColor: 'var(--surface)' }}>
            <p className="font-bold" style={{ color: 'var(--text-muted)' }}>No users found matching your criteria.</p>
          </div>
        ) : (
          filtered.map(u => (
            <div key={u.uid} className="zine-border flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 transition-all hover:shadow-[4px_4px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0" style={{
                backgroundColor: u.role === 'admin' ? '#EF4444' : u.role === 'creator' ? '#FF6B00' : '#3B82F6',
                color: '#fff',
              }}>
                {u.displayName?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm truncate" style={{ color: 'var(--text-primary)' }}>{u.displayName || 'No Name'}</p>
              </div>
              <div className="w-56 min-w-0 hidden md:block">
                <p className="text-xs font-bold truncate" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
              </div>
              <div className="w-24">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5" style={{
                  backgroundColor: u.role === 'admin' ? '#EF4444' : u.role === 'creator' ? '#FF6B00' : '#3B82F6',
                  color: '#fff',
                }}>
                  {u.role || 'user'}
                </span>
              </div>
              <div className="w-28">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: u.onboardingComplete ? '#22C55E' : 'var(--text-muted)' }}>
                  {u.onboardingComplete ? '✓ Complete' : 'Pending'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
