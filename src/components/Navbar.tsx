'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-wtf-cream border-b-4 border-wtf-black px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link href="/" className="text-3xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          ECHOES<span className="text-wtf-orange">.</span>
        </Link>
        
        <div className="hidden md:flex space-x-8 font-medium uppercase tracking-widest text-sm items-center">
          <Link className="hover:text-wtf-orange transition-colors" href="/">Home</Link>
          <Link className="hover:text-wtf-orange transition-colors" href="/podcasts">Podcasts</Link>
          <Link className="hover:text-wtf-orange transition-colors" href="/archives">Archives</Link>
          <Link className="hover:text-wtf-orange transition-colors" href="#">Journal</Link>
          <Link className="hover:text-wtf-orange transition-colors" href="/about">About</Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isLoggedIn ? (
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-10 h-10 shrink-0 zine-border bg-wtf-white shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-all overflow-hidden relative cursor-pointer"
              title="Log Out"
            >
              <Image 
                src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop" 
                alt="Profile" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                unoptimized
              />
            </button>
          ) : (
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="zine-border shrink-0 bg-wtf-orange px-6 py-2 font-bold uppercase tracking-widest text-wtf-black hover:bg-wtf-black hover:text-wtf-white hover:-translate-y-0.5 shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] transition-all text-sm md:text-base"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
