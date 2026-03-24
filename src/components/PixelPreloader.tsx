'use client';

import { useEffect, useState } from 'react';

export default function PixelPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReadyToHide, setIsReadyToHide] = useState(false);

  useEffect(() => {
    // Check if we should skip the preloader for development speed
    const hasLoaded = sessionStorage.getItem('echoes-preloaded');
    if (hasLoaded && process.env.NODE_ENV !== 'development') {
      setIsLoading(false);
      return;
    }

    // primitive timeout mechanism (bulletproof against JS thread blocking)
    const duration = 2000; // 2 seconds minimum display
    
    const preloaderTimer = setTimeout(() => {
       setIsReadyToHide(true);
       setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem('echoes-preloaded', 'true');
       }, 800); // fade out duration
    }, duration);

    return () => clearTimeout(preloaderTimer);
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isReadyToHide ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'}`}
      style={{ 
        backgroundColor: 'var(--page-bg)', 
        backgroundImage: 'radial-gradient(var(--page-dot) 1px, transparent 1px)', 
        backgroundSize: '24px 24px' 
      }}
    >
      {/* Corner Elements */}
      <div className="absolute top-8 left-8 w-8 h-8 md:w-12 md:h-12 border-l-4 border-t-4 border-wtf-black opacity-30"></div>
      <div className="absolute top-8 right-8 w-8 h-8 md:w-12 md:h-12 border-r-4 border-t-4 border-wtf-black opacity-30"></div>
      <div className="absolute bottom-8 left-8 w-8 h-8 md:w-12 md:h-12 border-l-4 border-b-4 border-wtf-black opacity-30"></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 md:w-12 md:h-12 border-r-4 border-b-4 border-wtf-black opacity-30"></div>

      {/* Decorative Crosshairs at Screen Edges */}
      <div className="absolute top-1/2 left-4 w-4 h-[3px] bg-wtf-black opacity-20 transform -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-4 w-4 h-[3px] bg-wtf-black opacity-20 transform -translate-y-1/2"></div>
      <div className="absolute top-4 left-1/2 w-[3px] h-4 bg-wtf-black opacity-20 transform -translate-x-1/2"></div>
      <div className="absolute bottom-4 left-1/2 w-[3px] h-4 bg-wtf-black opacity-20 transform -translate-x-1/2"></div>

      <div className="flex flex-col items-center gap-8 z-10">
        {/* ECHOES Logo */}
        <div className="text-6xl md:text-8xl font-black tracking-tighter mt-4 flex items-center">
          <span className="text-wtf-black">ECHOES</span>
          <span className="text-wtf-orange">.</span>
        </div>

        {/* Loading Bar & Text Container */}
        <div className="flex flex-col items-center gap-3 w-64 md:w-80">
          {/* Progress Bar */}
          <div className="w-full h-4 zine-border bg-wtf-white relative shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#333] overflow-hidden">
            {/* Pure CSS Progress Fill targeting width from 0% to 100% */}
            <div 
              className="absolute top-0 left-0 h-full bg-wtf-orange"
              style={{ animation: 'fillBar 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}
            />
            {/* Inner texture lines on the bar */}
            <div 
              className="absolute inset-0 opacity-20 hidden md:block" 
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}
            />
          </div>
          
          <div className="flex justify-between w-full font-mono text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-60">
            <span>SYSTEM INIT</span>
            <span>WAIT...</span>
          </div>
        </div>
      </div>
      
      {/* Define the CSS animation globally locally in preloader */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fillBar {
          0% { width: 0%; }
          40% { width: 45%; }
          70% { width: 85%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}
