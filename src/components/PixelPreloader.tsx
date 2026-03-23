'use client';

import { useEffect, useState } from 'react';

export default function PixelPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReadyToHide, setIsReadyToHide] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if we should skip the preloader for development speed
    const hasLoaded = sessionStorage.getItem('echoes-preloaded');
    if (hasLoaded && process.env.NODE_ENV !== 'development') {
      setIsLoading(false);
      return;
    }

    // Check initial state
    let isSiteLoaded = document.readyState === 'complete';
    
    const handleLoad = () => {
      isSiteLoaded = true;
    };
    
    // Fallback timer if load event somehow misses
    const safetyLoadTimer = setTimeout(handleLoad, 8000); // 8 second hard limit forcing a load sequence
    
    window.addEventListener('load', handleLoad);

    const duration = 1800; // minimum duration 1.8 seconds
    const interval = 40;
    const steps = Math.ceil(duration / interval);
    let currentStep = 0;

    const progressTimer = setInterval(() => {
      currentStep++;
      
      const timeFraction = Math.min(1, currentStep / steps);
      let targetProgress;

      if (isSiteLoaded) {
        // If site is loaded, progress reflects time remaining to hit the 1.8s minimum
        targetProgress = Math.min(100, timeFraction * 100);
      } else {
        // If site is still loading, cap realistic progress at 90% (eases in safely over the minimum time limit)
        targetProgress = Math.min(90, timeFraction * 90);
      }
      
      // Organic stutter easing
      if (Math.random() > 0.1 || targetProgress === 100) {
         setProgress((prev) => {
           let jump = (targetProgress - prev) * 0.3;
           if (targetProgress > prev && jump < 0.5) jump = 0.5; // push it forward if trailing
           return Math.min(100, prev + jump);
         });
      }

      // 100% completion condition: both minimum time exceeded and real site load achieved
      if (currentStep >= steps && isSiteLoaded) {
        setProgress(100);
        clearInterval(progressTimer);
        clearTimeout(safetyLoadTimer);
        setIsReadyToHide(true);
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem('echoes-preloaded', 'true');
        }, 800); // fade out duration
      }
    }, interval);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(safetyLoadTimer);
      window.removeEventListener('load', handleLoad);
    };
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
            <div 
              className="absolute top-0 left-0 h-full bg-wtf-orange transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
            {/* Inner texture lines on the bar (optional zine touch) */}
            <div 
              className="absolute inset-0 opacity-20 hidden md:block" 
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}
            />
          </div>
          
          <div className="flex justify-between w-full font-mono text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-60">
            <span>SYSTEM INIT</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
