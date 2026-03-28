'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/lib/AuthContext';
import { presetAvatars } from '@/lib/avatars';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import { episodes } from '@/lib/data';

export default function Navbar() {
  const { user, userProfile, isLoading, signInWithGoogle, signOut } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const isGoogleAvatar = userProfile?.avatarId === 'google' && userProfile?.photoURL;
  const avatarSvg = userProfile && !isGoogleAvatar
    ? (() => {
        const av = presetAvatars.find((a) => a.id === userProfile.avatarId);
        if (!av) return null;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="${av.bgColor}" rx="0"/>${av.svgPath}</svg>`;
      })()
    : null;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/podcasts', label: 'Podcasts' },
    { href: '/archives', label: 'Archives' },
    { href: '/about', label: 'About' },
  ];

  const handleSignIn = () => {
    setMobileMenuOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setMobileMenuOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  const searchResults = searchQuery.trim() 
    ? episodes.filter(ep => 
        ep.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (ep.guest && ep.guest.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ep.description && ep.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 4)
    : [];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-wtf-cream border-b-4 border-wtf-black px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
            ECHOES<span className="text-wtf-orange">.</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex space-x-8 font-medium uppercase tracking-widest text-sm items-center">
            {navLinks.map((link) => (
              <Link key={link.href} className="hover:text-wtf-orange transition-colors" href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Desktop Expanding Search */}
            <div className="hidden md:flex relative top-0 items-center justify-end w-10 h-10" ref={searchContainerRef}>
              <form 
                onSubmit={handleSearch} 
                className={`absolute right-0 flex items-center border-2 border-wtf-black bg-wtf-white h-10 px-3 transition-all duration-300 z-20 ${isSearchExpanded ? 'w-64' : 'w-10 cursor-pointer hover:-translate-y-0.5 shadow-[2px_2px_0px_#000] zine-border'}`}
                onClick={() => {
                  if (!isSearchExpanded) {
                    setIsSearchExpanded(true);
                    // Focus input on next tick
                    setTimeout(() => document.getElementById('desktop-search-input')?.focus(), 50);
                  }
                }}
              >
                <button type={isSearchExpanded ? "submit" : "button"} className="shrink-0 group">
                  <svg className={`w-4 h-4 text-wtf-black ${isSearchExpanded ? 'opacity-50' : 'opacity-100'} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSearchExpanded ? 2 : 3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <input
                  id="desktop-search-input"
                  type="text"
                  placeholder="Search episodes..."
                  className={`bg-transparent border-none focus:outline-none text-sm font-bold placeholder:opacity-50 w-full transition-opacity duration-300 ${isSearchExpanded ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Live Search Autocomplete Dropdown */}
              {isSearchExpanded && searchQuery.trim().length > 0 && (
                <div className="absolute right-0 top-12 w-80 bg-wtf-white border-4 border-wtf-black shadow-[8px_8px_0px_#000] z-50 flex flex-col">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((ep) => (
                        <Link 
                          href={`/episodes/${ep.id}`} 
                          key={ep.id}
                          onClick={() => {
                            setIsSearchExpanded(false);
                            setSearchQuery('');
                          }}
                          className="flex flex-col p-4 border-b-2 border-wtf-black border-dashed hover:bg-wtf-orange hover:text-wtf-black transition-colors"
                        >
                          <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{ep.guest || 'Episode'}</span>
                          <span className="text-sm font-black uppercase leading-tight line-clamp-2">{ep.title}</span>
                        </Link>
                      ))}
                      <Link 
                        href={`/search?q=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setIsSearchExpanded(false);
                          setSearchQuery('');
                        }}
                        className="p-3 text-center bg-wtf-cream text-xs font-black uppercase tracking-widest hover:bg-wtf-black hover:text-wtf-white transition-colors"
                      >
                        See All Results →
                      </Link>
                    </>
                  ) : (
                    <div className="p-6 text-center text-sm font-bold text-wtf-black opacity-50 uppercase tracking-widest">
                      No matching logs found.
                    </div>
                  )}
                </div>
              )}
            </div>

            <ThemeToggle />

            {/* Desktop auth */}
            <div className="hidden md:block">
              {!isLoading && user && userProfile ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="w-10 h-10 shrink-0 zine-border bg-wtf-white shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-all overflow-hidden cursor-pointer"
                    title={userProfile.displayName || 'Explorer'}
                  >
                    {isGoogleAvatar ? (
                      <img src={userProfile.photoURL!} alt="Profile" className="w-full h-full object-cover" />
                    ) : avatarSvg ? (
                      <div dangerouslySetInnerHTML={{ __html: avatarSvg }} className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-wtf-orange flex items-center justify-center font-black text-lg text-wtf-black">
                        {(userProfile.displayName || 'Explorer').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-14 w-64 zine-border bg-wtf-white shadow-[8px_8px_0px_#000] z-50">
                      {/* User info header */}
                      <div className="p-4 border-b-3 border-wtf-black bg-wtf-cream">
                        <p className="font-black text-sm uppercase tracking-widest truncate">{userProfile.displayName || 'Explorer'}</p>
                        <p className="text-xs font-medium opacity-50 truncate">{userProfile.email || 'No email provided'}</p>
                      </div>
                      {/* Links */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-3 font-bold text-sm uppercase tracking-widest hover:bg-wtf-orange hover:text-wtf-black transition-colors"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/profile#saved"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-3 font-bold text-sm uppercase tracking-widest hover:bg-wtf-orange hover:text-wtf-black transition-colors"
                        >
                          Saved Episodes
                        </Link>
                        {(userProfile.role === 'creator' || userProfile.role === 'admin') && (
                          <Link
                            href="/creator/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="block px-4 py-3 font-bold text-sm uppercase tracking-widest hover:bg-wtf-orange hover:text-wtf-black transition-colors"
                          >
                            🚀 My Space
                          </Link>
                        )}
                        {userProfile.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="block px-4 py-3 font-bold text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
                          >
                            🛡️ Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-3 font-bold text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors border-t-2 border-dashed border-wtf-black cursor-pointer"
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : !isLoading ? (
                <button
                  onClick={handleSignIn}
                  className="zine-border shrink-0 bg-wtf-orange px-6 py-2 font-bold uppercase tracking-widest text-wtf-black hover:bg-wtf-black hover:text-wtf-white hover:-translate-y-0.5 shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] transition-all text-sm cursor-pointer"
                >
                  Sign In
                </button>
              ) : null}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 zine-border bg-wtf-white shadow-[2px_2px_0px_#000] flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:shadow-[4px_4px_0px_#000] transition-all"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-wtf-black transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-wtf-black transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-wtf-black transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-wtf-cream transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] md:hidden flex flex-col ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Decorative shapes */}
        <div className="absolute w-6 h-6 bg-wtf-orange rounded-full border-2 border-wtf-black top-24 right-12 z-0" />
        <div className="absolute w-5 h-5 bg-[#3B82F6] border-2 border-wtf-black bottom-32 left-12 rotate-45 z-0" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />

        {/* Mobile menu header */}
        <div className="relative z-20 flex justify-between items-center p-6 border-b-4 border-wtf-black bg-wtf-cream">
          <span className="text-3xl font-bold tracking-tighter">ECHOES<span className="text-wtf-orange">.</span></span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 zine-border bg-wtf-white shadow-[2px_2px_0px_#000] flex items-center justify-center text-3xl font-black leading-none hover:-translate-y-0.5"
          >
            ×
          </button>
        </div>

        {/* Scrollable content container */}
        <div className="relative z-10 flex flex-col items-center pt-8 pb-24 px-8 overflow-y-auto h-full w-full gap-8">
          
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="w-full max-w-sm border-4 border-wtf-black bg-wtf-white h-14 flex items-center px-4 shadow-[4px_4px_0px_#000] sticky top-0 z-30">
            <svg className="w-6 h-6 text-wtf-black opacity-50 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="GLOBAL SEARCH..."
              className="w-full bg-transparent border-none focus:outline-none text-lg font-black uppercase tracking-widest placeholder:opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Mobile Live Results (Push down content) */}
          {searchQuery.trim().length > 0 && (
            <div className="w-full max-w-sm bg-wtf-white border-4 border-wtf-black flex flex-col -mt-4 mb-4">
              {searchResults.length > 0 ? (
                <>
                  {searchResults.map((ep) => (
                    <Link 
                      href={`/episodes/${ep.id}`} 
                      key={ep.id}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex flex-col p-4 border-b-2 border-wtf-black border-dashed active:bg-wtf-orange transition-colors"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{ep.guest || 'Episode'}</span>
                      <span className="text-sm font-black uppercase leading-tight line-clamp-2">{ep.title}</span>
                    </Link>
                  ))}
                  <Link 
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-4 text-center bg-wtf-cream text-sm font-black uppercase tracking-widest active:bg-wtf-black active:text-wtf-white transition-colors"
                  >
                    See All Results →
                  </Link>
                </>
              ) : (
                <div className="p-6 text-center text-sm font-bold text-wtf-black opacity-50 uppercase tracking-widest">
                  No matching logs found.
                </div>
              )}
            </div>
          )}

          {/* User info (if logged in) */}
          {user && userProfile && (
            <div className="flex flex-col items-center mb-2">
              <div className="w-20 h-20 zine-border overflow-hidden shadow-[4px_4px_0px_#000] mb-4">
                {avatarSvg ? (
                  <div dangerouslySetInnerHTML={{ __html: avatarSvg }} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-wtf-orange flex items-center justify-center font-black text-3xl text-wtf-black">
                    {userProfile.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <p className="font-black text-xl uppercase tracking-widest text-center leading-none">{userProfile.displayName}</p>
            </div>
          )}

          {/* Nav links */}
          <div className="flex flex-col items-center gap-6 w-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-black uppercase tracking-tighter hover:text-wtf-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-32 h-2 bg-wtf-black shrink-0" />

          {/* Auth section */}
          {user && userProfile ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-black uppercase tracking-tighter hover:text-wtf-orange transition-colors"
              >
                My Profile
              </Link>
              <Link
                href="/profile#saved"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-black uppercase tracking-tighter hover:text-wtf-orange transition-colors"
              >
                Saved Episodes
              </Link>
              {(userProfile.role === 'creator' || userProfile.role === 'admin') && (
                <Link
                  href="/creator/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-black uppercase tracking-tighter hover:text-wtf-orange transition-colors"
                >
                  🚀 My Space
                </Link>
              )}
              {userProfile.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-black uppercase tracking-tighter text-red-500 hover:text-red-600 transition-colors"
                >
                  🛡️ Admin Panel
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="zine-border bg-red-500 text-white px-8 py-3 font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-all cursor-pointer mt-4"
              >
                Log Out
              </button>
            </>
          ) : !isLoading ? (
            <button
              onClick={handleSignIn}
              className="zine-border bg-wtf-orange px-10 py-4 font-bold uppercase tracking-widest text-wtf-black text-lg shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Sign In
            </button>
          ) : null}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
