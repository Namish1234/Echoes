'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { episodes } from '@/lib/data';

/* ─────────── RIGHT SIDE TRAY ─────────── */
function EpisodeTray({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      <div className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 transform transition-transform duration-300 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'var(--surface)' }}>
        <div className="p-6 border-b-4 flex justify-between items-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--cream-bg)' }}>
          <h3 className="font-black text-2xl uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>Training Tools</h3>
          <button onClick={onClose} className="p-2" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--page-bg)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
          <div className="p-5 zine-border relative overflow-hidden group transition-colors" style={{ backgroundColor: 'rgba(0,229,255,0.08)', borderColor: '#00E5FF' }}>
            <h4 className="font-black text-xl mb-2 uppercase" style={{ color: '#00E5FF' }}>Deep Dive</h4>
            <p className="font-medium text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Full structured transcript with save &amp; annotate.</p>
            <Link href="/episode/op-01/transcript" className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 font-black uppercase tracking-widest text-sm border-2 border-wtf-black shadow-[3px_3px_0px_#00E5FF] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#00E5FF] transition-all bg-[#00E5FF] text-black">Open Transcript</Link>
          </div>
          <div className="p-5 zine-border relative overflow-hidden group transition-colors" style={{ backgroundColor: 'rgba(234,179,8,0.08)', borderColor: '#EAB308' }}>
            <h4 className="font-black text-xl mb-2 uppercase text-[#EAB308]">Mental Map</h4>
            <p className="font-medium text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Interactive visual mind map of the recovery journey.</p>
            <Link href="/episode/op-01/mindmap" className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 bg-[#EAB308] text-black font-black uppercase tracking-widest text-sm shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all border-2 border-wtf-black">View Mind Map</Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────── FULLSCREEN LETTER MODAL ─────────── */
function LetterModal({ isOpen, onClose, lessonContext, summary, index }: { isOpen: boolean, onClose: () => void, lessonContext: string, summary: string, index: number }) {
  const [isSaved, setIsSaved] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col z-10 shadow-[20px_20px_0px_rgba(0,229,255,0.4)] overflow-hidden border-4"
           style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', backgroundImage: 'radial-gradient(var(--page-dot) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        
        {/* Header bar with save button */}
        <div className="w-full px-6 py-3 flex justify-between items-center sticky top-0 z-20"
             style={{ backgroundColor: 'var(--text-primary)', color: 'var(--page-bg)' }}>
          <div className="text-xs font-bold uppercase tracking-widest flex items-center gap-3 bg-wtf-black dark:bg-wtf-white text-wtf-white dark:text-wtf-black p-1">
             <span className="px-2 py-0.5 bg-[#00E5FF] text-black">Round #{index + 1}</span>
             <span className="opacity-70 px-2 flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> The Breakdown</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSaved(!isSaved)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors hover:text-[#00E5FF]"
                    style={{ color: isSaved ? '#00E5FF' : 'inherit' }}>
              {isSaved ? (
                <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Saved</>
              ) : (
                <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Save</>
              )}
            </button>
            <button onClick={onClose} className="hover:text-[#00E5FF] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Letter body */}
        <div className="p-8 md:p-16 overflow-y-auto">
          {/* Decorative doodles inside modal */}
          <div className="absolute top-16 right-8 w-12 h-12 border-4 border-[#00E5FF] opacity-10 rotate-12 flex justify-center items-center"><span className="text-2xl font-black">Δ</span></div>

          <h3 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-8 font-serif italic" style={{ color: 'var(--text-primary)' }}>
             {lessonContext}
          </h3>
          <div className="prose prose-lg max-w-none leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <HighlightedText text={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── HIGHLIGHTED TEXT RENDERER ─────────── */
function HighlightedText({ text }: { text: string }) {
  const keywords: Record<string, string> = {
    '2 millimeters': '#00E5FF',
    'fentanyl': '#00E5FF',
    'project silverback': '#EAB308',
    'zero to hero': '#22C55E',
    'mindset': '#EAB308',
    'dark humor': '#8B5CF6',
    '125kg back squat': '#00E5FF',
    'survive': '#EC4899',
    'resilience': '#22C55E',
    'trauma': '#00E5FF'
  };

  const pattern = new RegExp(`(${Object.keys(keywords).join('|')})`, 'gi');
  const parts = text.split(pattern);

  return (
    <p className="first-letter:text-5xl first-letter:font-black first-letter:font-serif first-letter:float-left first-letter:mr-2" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
      {parts.map((part, i) => {
        const lower = part.toLowerCase();
        if (keywords[lower]) {
          return <span key={i} style={{ color: keywords[lower], fontWeight: 800 }}>{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

/* ─────────── LESSON CARD ─────────── */
function LessonCard({ lessonContext, onClick, index, align }: { lessonContext: string, onClick: () => void, index: number, align: 'left' | 'right' | 'center' }) {
  const alignClass = align === 'left' ? 'mr-auto' : align === 'right' ? 'ml-auto' : 'mx-auto';

  return (
    <div className={`relative w-full max-w-xl ${alignClass} group cursor-pointer`} onClick={onClick}>
      <div className="relative p-5 md:p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[10px_10px_0px_#00E5FF] zine-border overflow-hidden"
           style={{ backgroundColor: 'var(--surface)' }}>
        <div className="absolute top-3 right-3 w-10 h-10 border-2 opacity-20 flex items-center justify-center bg-[#00E5FF]/10 text-[#00E5FF]" style={{ borderColor: '#00E5FF' }}>
          <span className="text-[12px] font-black rotate-12">Σ {index + 1}</span>
        </div>
        
        <div className="relative z-10 flex items-start gap-5 pr-12">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center font-black text-lg border-2 border-wtf-black shadow-[2px_2px_0px_var(--text-primary)]"
               style={{ backgroundColor: '#00E5FF', color: '#000' }}>
            {index + 1}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-1" style={{ color: 'var(--text-muted)' }}>Analyze Set</span>
            <h3 className="text-lg md:text-xl font-black uppercase leading-tight font-serif italic" style={{ color: 'var(--text-primary)' }}>
               {lessonContext.split('.')[0]}.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── SPORTS POLAROID ─────────── */
function Polaroid({ name, role, rotation, imageSrc }: { name: string, role: string, rotation: string, imageSrc: string }) {
  return (
    <div className="group bg-white p-2.5 pb-10 md:pb-12 border border-gray-300 shadow-[4px_6px_0px_#00E5FF] w-48 md:w-56 shrink-0 relative transition-all duration-500 cursor-crosshair zine-border"
         style={{ transform: rotation }}>
      <div className="w-full aspect-square bg-gray-300 relative mb-3 overflow-hidden border border-gray-400 grayscale transition-all duration-700 group-hover:grayscale-0">
        <img src={imageSrc} alt={name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}></div>
      </div>
      <div className="absolute bottom-3 left-0 w-full text-center">
        <p className="font-serif italic font-bold text-black text-base" style={{ transform: 'rotate(-1deg)' }}>{name}</p>
        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-black font-sans mt-0.5 font-bold">{role}</p>
      </div>
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-300/80 backdrop-blur-sm shadow-sm border border-gray-300 z-10" style={{ transform: 'rotate(2deg)', backgroundImage: 'linear-gradient(to right, rgba(0,229,255,0.4), rgba(200,200,200,0.2))' }}></div>
    </div>
  );
}

/* ─────────── RECOMMENDED EPISODE CARD ─────────── */
function RecommendedCard({ id, title, guest, duration, tags }: { id: string, title: string, guest: string, duration: string, tags: string[] }) {
  return (
    <Link href={`/episode/${id}`} className="zine-border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#00E5FF] flex flex-col gap-3"
          style={{ backgroundColor: 'var(--surface)' }}>
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-black text-lg uppercase leading-tight" style={{ color: 'var(--text-primary)' }}>{title}</h4>
        <span className="text-xs font-bold px-2 py-0.5 shrink-0" style={{ backgroundColor: '#00E5FF', color: '#000' }}>{duration}</span>
      </div>
      <p className="text-sm font-black uppercase tracking-widest" style={{ color: '#00E5FF' }}>with {guest}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map(tag => (
          <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2" style={{ borderColor: 'var(--border-subtle)' }}>{tag}</span>
        ))}
      </div>
    </Link>
  );
}

/* ─────────── SPORTS DOODLE DECORATIONS SVG ─────────── */
function SportsDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden md:block" aria-hidden>
      <div className="absolute top-[8%] left-[4%] opacity-[0.2] text-6xl font-black text-[#00E5FF] rotate-[15deg]">Σ</div>
      <div className="absolute top-[28%] right-[5%] opacity-[0.18] text-5xl font-black text-[#EAB308] -rotate-[20deg]">Δ</div>
      <div className="absolute top-[55%] left-[6%] opacity-[0.15] text-5xl font-black text-[#00E5FF] rotate-[35deg]">⚡</div>
      <div className="absolute top-[42%] right-[3%] opacity-[0.17] text-6xl font-black text-[#EC4899] -rotate-[10deg]">∞</div>
      <div className="absolute top-[15%] right-[24%] opacity-[0.16] text-4xl font-black text-[#00E5FF] rotate-[40deg]">🏁</div>
      <div className="absolute top-[72%] left-[15%] opacity-[0.14] text-5xl font-black text-[#EAB308] -rotate-[25deg]">O</div>

      {/* Olympic/Velodrome inspired circles/tracks */}
      <div className="absolute top-[18%] right-[9%] w-32 h-16 rounded-full border-[4px] opacity-[0.05] border-[#00E5FF] rotate-[12deg]"></div>
      <div className="absolute top-[48%] left-[3%] w-24 h-24 rounded-full border-[8px] opacity-[0.05] border-[#EAB308] -rotate-[15deg]"></div>
      
      {/* Dashes / short lines for track lines */}
      <div className="absolute top-[27%] left-[5%] w-12 h-2 opacity-[0.22] rotate-[30deg]" style={{ backgroundColor: '#00E5FF' }}></div>
      <div className="absolute top-[47%] right-[4%] w-10 h-2 opacity-[0.18] -rotate-[20deg]" style={{ backgroundColor: '#EAB308' }}></div>
      <div className="absolute top-[73%] left-[9%] w-8 h-2 opacity-[0.15] rotate-[45deg]" style={{ backgroundColor: '#00E5FF' }}></div>
      
      {/* Plus marks representing effort / weight plates */}
      <div className="absolute top-[56%] right-[4%] opacity-[0.18] text-5xl font-black" style={{ color: '#00E5FF' }}>+</div>
      <div className="absolute top-[25%] left-[3%] opacity-[0.14] text-4xl font-black" style={{ color: '#EAB308' }}>+</div>
      <div className="absolute top-[80%] right-[9%] w-12 h-4 bg-wtf-black opacity-[0.1]"></div>
      <div className="absolute top-[80%] right-[8%] w-4 h-12 bg-wtf-black opacity-[0.1]"></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*                     MAIN PAGE COMPONENT                       */
/* ═══════════════════════════════════════════════════════════════ */
export default function Op01Episode() {
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [activeModalId, setActiveModalId] = useState<number | null>(null);
  const episode = episodes.find(ep => ep.id === 'op-01');

  if (!episode) return <div className="p-12" style={{ color: 'var(--text-primary)' }}>Episode not found</div>;

  const guests = [
    { name: "Vic Williamson", role: "Olympic Cyclist", rotation: "rotate(-3deg) translateY(12px)", image: "/images/guests/vic.jpg" },
    { name: "Iona", role: "The Host", rotation: "rotate(4deg) translateY(-8px)", image: "/images/guests/iona.jpg" },
  ];

  const extendedLessons = [
    {
      context: "Protect your mindset as fiercely as you protect your physical body",
      summary: "When you are 2 millimeters from being completely paralyzed, your physical recovery is only half the battle. Vic emphasizes that losing control over your body can easily translate to losing your mind if you don't actively protect your psychological state. Resilience isn't an accident; it's a trained muscle.",
      align: 'left' as const
    },
    {
      context: "Turn your 'character flaws' into your ultimate recovery superpower",
      summary: "Extreme competitiveness and obsession. Normally, people tell you to calm down. But when facing down 18 months of impossible rehab involving the Intensive Rehab Unit and 'Project Silverback', Vic used her intense stubbornness as fuel. If she wasn't mildly obsessed with winning, she wouldn't have survived the fentanyl withdrawal or the early days of paralysis.",
      align: 'right' as const
    },
    {
      context: "Set impossible physical milestones to survive the present nightmare",
      summary: "A 125kg back squat. Setting an absurdly high goal when you literally can't move your neck seems delusional. But having a 'zero to hero' mission like that builds mental scaffolding. It gives you a reason to do the painful, boring 1% work every day. You don't focus on the broken pelvis, you focus on the bar.",
      align: 'left' as const
    },
    {
      context: "Humor, especially dark humor, is a mandatory trauma response",
      summary: "Laughter is a survival mechanism. They thought she had died and popped a tent up around her on the velodrome. Coping with that level of trauma requires the ability to laugh at the darkness. Without dark humor, the weight of the reality crushes you.",
      align: 'center' as const
    }
  ];

  const recommendedEpisodes = [
    { id: 'ep-03', title: 'Pain, Power & The Game Nobody Wins', guest: 'Chamath Palihapitiya', duration: '1 hr 30 min', tags: ['BUSINESS', 'PSYCHOLOGY'] },
  ];

  return (
    <div className="w-full relative min-h-screen pb-24 overflow-x-hidden">
      <SportsDecorations />

      {/* ── HEADER ── */}
      <header className="w-full max-w-6xl mx-auto px-6 pt-10 pb-8 relative z-10">
        <div className="mb-4">
          <Link href="/the-opponents" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all text-wtf-black">
            ← Back to The Opponents
          </Link>
        </div>

        <div className="mb-4">
          <div className="px-3 py-1 text-xs font-black tracking-widest uppercase inline-block bg-[#00E5FF] text-black border-2 border-wtf-black shadow-[2px_2px_0px_#000]">
            {episode.series || 'The Opponents'} • Episode {episode.number}
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl lg:w-[90%] font-black uppercase tracking-tight leading-[0.95] mb-6 text-wtf-black">
          A Devastating Cycling Accident &amp; <span className="text-[#00E5FF] drop-shadow-sm">Extraordinary Comeback Mission</span>
        </h1>
        
        <p className="text-lg font-bold leading-relaxed max-w-3xl mb-8 opacity-80 text-wtf-black">
          {episode.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-8 text-wtf-black font-bold">
          <span className="font-black">{episode.date}</span>
          <span className="opacity-30 text-xl">|</span>
          <span className="font-black bg-wtf-black dark:bg-wtf-white text-wtf-white dark:text-wtf-black px-2">{episode.duration}</span>
          <span className="opacity-30 text-xl">|</span>
          {episode.tags.map(tag => (
            <span key={tag} className="text-xs font-black uppercase tracking-widest px-3 py-1 border-2 border-[#00E5FF] text-[#00E5FF]">{tag}</span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-3">
          <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1DB954] text-black font-black uppercase tracking-widest text-sm border-2 border-wtf-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.78-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.745 3.805-.87 7.076-.496 9.71 1.115.293.18.386.563.206.854zm1.214-2.723c-.227.37-.706.486-1.076.26-2.712-1.665-6.885-2.153-9.94-1.18-.413.13-.85-.1-1.006-.516-.156-.412.1-.85.516-1.006 3.486-1.11 8.13-.563 11.246 1.353.37.226.486.706.26 1.075zm.116-2.846c-3.264-1.936-8.65-2.115-11.77-1.17-.487.147-.993-.13-1.14-.616-.147-.488.13-.993.616-1.14 3.565-1.08 9.53-.87 13.27 1.35.44.263.58.834.318 1.272-.26.438-.83.58-1.27.318z"/></svg>
            Spotify
          </a>
          <a href="https://youtu.be/CADQHPmDh0k?si=kSti32Oqnfu9iCsP" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF0000] text-white font-black uppercase tracking-widest text-sm border-2 border-wtf-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            YouTube
          </a>
        </div>
      </header>

      {/* ── DIVIDER ── */}
      <div className="w-full max-w-6xl mx-auto px-6 mt-8">
        <div className="border-t-4 border-wtf-black"></div>
      </div>

      {/* ── POLAROID SCRAPBOOK + HIGHLIGHTS ── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 relative">
        <p className="text-center font-black uppercase tracking-widest text-sm mb-4 text-wtf-black">The Competitors</p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {(episode.highlights || []).map((h, i) => (
            <span key={i} className="text-xs font-black uppercase tracking-wider px-3 py-1.5 border-2 border-[#00E5FF] bg-wtf-white text-wtf-black shadow-[2px_2px_0px_#00E5FF]">
              {h}
            </span>
          ))}
        </div>

        <div className="flex flex-row justify-center items-center gap-8 md:gap-16 flex-wrap lg:flex-nowrap relative z-10 w-full max-w-4xl mx-auto">
          {guests.map((g, i) => (
            <div key={i} className="mb-8 lg:mb-0">
               <Polaroid name={g.name} role={g.role} rotation={g.rotation} imageSrc={g.image} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CUSTOM SPORTS SECTION: REHAB BLUEPRINT ── */}
      <div className="w-full py-16 bg-[#00E5FF] border-y-4 border-wtf-black text-black relative overflow-hidden">
        {/* Checkered pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 20px 20px', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4"><span className="text-wtf-black">Project</span> Silverback</h2>
              <p className="text-xl font-bold leading-relaxed mb-6">
                The intensive rehab unit (Bishop) didn&apos;t just prescribe rest and a bit of physio. They instituted a total biological reconstruction targeting immense loads to spark central nervous system recovery.
              </p>
              <div className="p-6 bg-wtf-white text-wtf-black border-4 border-wtf-black shadow-[8px_8px_0px_#000]">
                <h4 className="font-black text-2xl uppercase mb-4 flex items-center gap-3"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> The Protocol</h4>
                <ul className="space-y-3 font-bold">
                  <li className="flex justify-between items-center border-b-2 border-wtf-black pb-2">
                    <span className="uppercase text-sm tracking-widest text-[#00E5FF] bg-wtf-black px-2">Foundation</span>
                    <span>18 Months Complete Rebuild</span>
                  </li>
                  <li className="flex justify-between items-center border-b-2 border-wtf-black pb-2">
                    <span className="uppercase text-sm tracking-widest text-[#00E5FF] bg-wtf-black px-2">Metrics</span>
                    <span>125kg Back Squat Minimum</span>
                  </li>
                  <li className="flex justify-between items-center border-b-2 border-wtf-black pb-2">
                    <span className="uppercase text-sm tracking-widest text-[#00E5FF] bg-wtf-black px-2">System</span>
                    <span>Zero to Hero Target</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="uppercase text-sm tracking-widest text-[#00E5FF] bg-wtf-black px-2">Nutritional Sync</span>
                    <span>Accelerated Caloric Density</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              {/* Symbolic Olympic/Gym Plate graphic */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-wtf-black rounded-full border-8 border-wtf-white shadow-[12px_12px_0px_rgba(0,0,0,0.5)] flex items-center justify-center animate-[spin_60s_linear_infinite]">
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#00E5FF]"></div>
                <div className="absolute inset-8 rounded-full border-4 border-wtf-white"></div>
                <div className="absolute inset-16 rounded-full border-2 border-[#EAB308]"></div>
                <div className="w-12 h-12 bg-[#00E5FF] rounded-full border-4 border-wtf-white shadow-inner"></div>
                <span className="absolute top-[20%] text-wtf-white font-black text-xl uppercase tracking-widest">25 KG</span>
                <span className="absolute bottom-[20%] text-wtf-white font-black text-xl uppercase tracking-widest rotate-180">25 KG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── NEW CUSTOM SECTIONS ── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 text-wtf-black relative z-10">
        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12 border-l-8 border-[#00E5FF] pl-6">Deep Dive: Beyond the Bike</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* SECTION 1: THE CRASH & THE TENT */}
          <div className="bg-wtf-white zine-border shadow-[8px_8px_0px_#EAB308] p-8 md:p-10 flex flex-col justify-center transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_#EAB308]">
            <span className="text-[#EAB308] font-black uppercase tracking-widest text-sm mb-3">01. The Aftermath</span>
            <h4 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-4">Waking up in Rotterdam</h4>
            <p className="font-bold text-lg leading-relaxed opacity-80 mb-6">
              When Vic collided at 43° banking during the Six Day event, the immediate aftermath was so severe that medics actually pitched a tent around her on the track, assuming she hadn't survived. Her 2mm margin from paralysis meant the initial week felt like a blur of fentanyl withdrawals and looking at hospital ceilings.
            </p>
            <p className="font-bold text-lg leading-relaxed opacity-80">
              Surgeons opted for the bare minimum stabilization—avoiding a halo brace drilled into her skull—specifically so she could preserve neck rotation to ride again. This decision set the stage for her entire comeback.
            </p>
          </div>

          {/* SECTION 2: BEHAVIORS OVER PHYSICALITY */}
          <div className="bg-[#00E5FF] text-black zine-border shadow-[8px_8px_0px_#000] p-8 md:p-10 flex flex-col justify-center transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_#000]">
            <span className="text-wtf-black font-black uppercase tracking-widest text-sm mb-3 opacity-70">02. The Origin Story</span>
            <h4 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-4">Mindset &gt; Muscle</h4>
            <p className="font-bold text-lg leading-relaxed mb-6">
              Before the crash, Vic wasn't recruited for her raw physical strength. Out of 3,000 applicants, she secured her spot on the GB setup at age 16 largely due to her psychological profile. 
            </p>
            <p className="font-bold text-lg leading-relaxed">
              Her innate competitiveness, punctuality, and willingness to fight—what coaches called "behavioral aspects"—proved that physical deficits can be trained, but ruthless determination is innate.
            </p>
          </div>
        </div>

        {/* SECTION 3: THE QUOTES (WORDS TO LIVE BY) */}
        <div className="w-full bg-wtf-black text-wtf-white border-4 border-[#00E5FF] shadow-[12px_12px_0px_#00E5FF] relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[16px_16px_0px_#00E5FF]">
          {/* Grid texture background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          {/* Cycle SVG — straight, centered, white filter, visible on black */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.22]">
            <img src="/images/cycle-svg.svg" alt="" aria-hidden className="w-2/3 max-w-xl h-auto object-contain" style={{ filter: 'invert(1) brightness(1.5)' }} />
          </div>

          {/* Large decorative quote mark top-right */}
          <div className="absolute top-0 right-4 text-[#00E5FF] opacity-[0.08] font-serif font-black leading-none" style={{ fontSize: '18rem', lineHeight: 1 }}>"</div>

          <div className="relative z-10 p-8 md:p-16">
            <span className="text-[#00E5FF] font-black uppercase tracking-widest text-xs mb-8 block">03 — Words to Live By</span>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_2px_1fr] gap-0">
              {/* Quote 1 */}
              <div className="pr-0 md:pr-14 pb-10 md:pb-0">
                <p className="font-sans text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-6 text-wtf-white">
                  &ldquo;TAKE ACTION, BE PROACTIVE, DON&apos;T LET THESE MOMENTS DEFINE YOU. USE IT AND LET IT REFINE YOU AS OPPOSED TO DEFINE YOU.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-[#00E5FF]"></div>
                  <span className="uppercase text-xs font-black text-[#00E5FF] tracking-[0.2em]">Vic Williamson</span>
                </div>
              </div>

              {/* Vertical divider */}
              <div className="hidden md:block w-px bg-[#00E5FF] opacity-30 mx-8"></div>
              {/* Horizontal divider (mobile) */}
              <div className="block md:hidden w-full h-px bg-[#00E5FF] opacity-30 my-10"></div>

              {/* Quote 2 */}
              <div className="pl-0 md:pl-14">
                <p className="font-sans text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-6 text-wtf-white">
                  &ldquo;PROTECT YOUR MINDSET AS MUCH AS YOU PROTECT YOUR BODY. I FEEL LIKE MY MIND ACTUALLY CARRIED ME ABOVE WHERE MY BODY WAS.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-[#EAB308]"></div>
                  <span className="uppercase text-xs font-black text-[#EAB308] tracking-[0.2em]">Vic Williamson</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY LESSONS ── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight inline-block relative text-black bg-[#00E5FF] px-4 py-1 border-4 border-wtf-black shadow-[6px_6px_0px_var(--text-primary)]">
            <span className="relative z-10">Examine The Data</span>
          </h2>
          <p className="font-bold mt-6 max-w-xl mx-auto opacity-80" style={{ color: 'var(--text-primary)' }}>Break down the exact mental tactics and physiological hurdles of Vic&apos;s monumental rehab.</p>
        </div>

        <div className="flex flex-col gap-12 relative z-10">
          {extendedLessons.map((lesson, index) => (
             <LessonCard 
               key={index}
               index={index}
               lessonContext={lesson.context}
               onClick={() => setActiveModalId(index)}
               align={lesson.align}
             />
          ))}
        </div>
      </section>

      {/* ── DOTTED DIVIDER ── */}
      <div className="w-full max-w-6xl mx-auto px-6 py-2">
        <div className="border-t-4 border-wtf-black"></div>
      </div>

      {/* ── THE EPISODE IN 60 SECONDS (Summary with inline images) ── */}
      <section className="w-full py-16 relative z-10 overflow-hidden" style={{ backgroundColor: 'var(--page-bg)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 inline-block relative" style={{ color: 'var(--text-primary)' }}>
            <span className="relative z-10">The Episode in 60 Seconds</span>
            <div className="absolute -bottom-1 -left-1 w-[110%] h-4 opacity-40 z-0 bg-[#00E5FF]"></div>
          </h3>
          <p className="font-medium mb-10" style={{ color: 'var(--text-muted)' }}>A rapid-fire breakdown of the crash, the comeback, and the mindset behind it all.</p>

          {/* Paragraph 1 — crash, LEFT image (portrait) */}
          <div className="mb-10 overflow-hidden">
            <div className="float-left mr-6 mb-4 -rotate-3 shadow-[4px_4px_0px_var(--border-color)] border-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-48 h-32 overflow-hidden bg-neutral-200">
                <img src="/images/guests/vic.jpg" alt="Vic Williamson" className="w-full h-full object-cover" />
              </div>
              <div className="px-2 py-1.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Vic · Olympic Cyclist</span>
              </div>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              On January 9th 2016, during a Six Day event in Rotterdam at a <span className="font-extrabold text-[#00E5FF]">200m track with 43° banking</span>, Vic collided with a Dutch rider in the last bend of a match sprint. The impact sent her into the fencing at full race speed. When paramedics reached her, she wasn&apos;t moving. A <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>tent was pitched around her on the track</span> — they assumed the worst. She had sustained a <span className="font-extrabold text-[#00E5FF]">broken neck, back, and pelvis</span>, and was just <span className="font-extrabold text-[#EAB308]">2 millimeters from being paralyzed for life</span>.
            </p>
            <div style={{ clear: 'both' }}></div>
          </div>

          {/* Crash image — floated LEFT, prose wraps right */}
          <div className="mb-10 overflow-hidden">
            <div className="float-left mr-6 mb-4 rotate-2 shadow-[4px_4px_0px_var(--border-color)] border-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-48 h-32 overflow-hidden bg-neutral-200">
                <img src="/images/guests/vic-crash.jpg" alt="Vic Williamson crash Rotterdam 2016" className="w-full h-full object-cover" />
              </div>
              <div className="px-2 py-1.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00E5FF]">Jan 2016 · Rotterdam</span>
              </div>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The image beside captures the moment that divided Vic Williamson&apos;s life into before and after. Track cycling at elite level happens at speeds exceeding <span className="font-extrabold text-[#EAB308]">70 km/h on steeply banked boards</span>. A single wheel-hook at that angle sends riders into the fencing with catastrophic force. When the dust settled, medics prepared for the worst. The crowd went quiet. The tent went up. The assumption — that <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>Vic Williamson had not survived</span>.
            </p>
            <div style={{ clear: 'both' }}></div>
          </div>

          {/* Paragraph 3 — surgery decision, RIGHT host image */}
          <div className="mb-10 overflow-hidden">
            <div className="float-right ml-6 mb-4 rotate-2 shadow-[4px_4px_0px_var(--border-color)] border-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-48 h-32 overflow-hidden bg-neutral-200">
                <img src="/images/guests/iona.jpg" alt="Iona" className="w-full h-full object-cover" />
              </div>
              <div className="px-2 py-1.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Iona · The Host</span>
              </div>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Dutch surgeons wanted to drill a <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>halo brace into her skull</span> to stabilize the broken neck. Vic refused. Her UK surgeon agreed — fusing the neck would have cost her all rotational movement, making riding on a velodrome <span className="font-extrabold text-[#00E5FF]">physiologically impossible</span>. His decision to do the &quot;bare minimum&quot; — not fusing, just bracing — was the singular surgical call that kept the door open for a comeback. She wore the neck brace <span className="font-extrabold text-[#EAB308]">24 hours a day for 6–9 months</span>. Sleeping in it. Driving in it. Rain, gym, recovery — never off.
            </p>
            <div style={{ clear: 'both' }}></div>
          </div>

          {/* Paragraph 4 — Project Silverback */}
          <div className="mb-10">
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              After <span className="font-extrabold text-[#00E5FF]">18 months of zero training</span> — her muscles had wasted, her nervous system had reset — Vic entered <span className="font-extrabold text-[#EAB308]">Bishop, the Intensive Rehab Unit</span>. Run by James Moore with a <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>3-to-1 staff-to-athlete ratio</span>, they designed a whiteboard mission: &quot;Project Silverback.&quot; The outrageous targets: <span className="font-extrabold text-[#00E5FF]">125kg back squat, 170kg single-leg press, 1,500 watts on the bike</span>. She spent <span className="font-extrabold text-[#EAB308]">9 months at Bishop</span> — a record no patient has beaten. She hit every target. On the <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>752nd day</span> after the crash, she rode back on the velodrome.
            </p>
          </div>

          {/* Closing thought */}
          <div className="mt-10 p-6 border-l-4 border-[#00E5FF]" style={{ backgroundColor: 'var(--surface)' }}>
            <p className="text-sm font-black uppercase tracking-widest mb-2 text-[#00E5FF]">The Takeaway</p>
            <p className="text-base leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
              Vic&apos;s competitiveness — the trait that felt like a <span className="font-extrabold text-[#00E5FF]">character flaw</span> to others — was the engine that kept the comeback alive. She was <span className="font-extrabold text-[#EAB308]">obsessive, stubborn, and unreasonable</span>. And that&apos;s exactly why she made it back.
            </p>
          </div>
        </div>
      </section>

      {/* ── CHAMPION SECTION ── */}
      <section className="w-full py-20 bg-wtf-black text-wtf-white relative overflow-hidden z-10">
        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#00E5FF]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00E5FF]"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-px bg-[#00E5FF]"></div>
            <span className="text-[#00E5FF] font-black uppercase tracking-widest text-xs">The Anatomy of a Champion</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-wtf-white">
            What Makes <span className="text-[#00E5FF]">Vic</span> Tick
          </h2>
          <p className="font-medium mb-14 max-w-xl text-wtf-white opacity-60">
            Six defining qualities drawn directly from the conversation — the traits that survived the Rotterdam track.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-[#00E5FF]/30 p-7 hover:border-[#00E5FF] hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-[#00E5FF] text-4xl font-black mb-4 group-hover:scale-110 transition-transform">01</div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3 text-wtf-white">Unbreakable Will</h4>
              <p className="text-sm leading-relaxed text-wtf-white opacity-60">Told she would never cycle again — she didn&apos;t argue, she proved it wrong. <span className="text-[#00E5FF] font-bold opacity-100">752 days</span> later, she was back on the velodrome.</p>
            </div>
            <div className="border border-[#EAB308]/30 p-7 hover:border-[#EAB308] hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-[#EAB308] text-4xl font-black mb-4 group-hover:scale-110 transition-transform">02</div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3 text-wtf-white">Behavioral Edge</h4>
              <p className="text-sm leading-relaxed text-wtf-white opacity-60">Out of <span className="text-[#EAB308] font-bold opacity-100">3,000 applicants</span> she earned her GB place not on physics — but on psychological profile: competition, punctuality, willingness to fight.</p>
            </div>
            <div className="border border-[#00E5FF]/30 p-7 hover:border-[#00E5FF] hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-[#00E5FF] text-4xl font-black mb-4 group-hover:scale-110 transition-transform">03</div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3 text-wtf-white">Mission Mindset</h4>
              <p className="text-sm leading-relaxed text-wtf-white opacity-60">Project Silverback: a <span className="text-[#00E5FF] font-bold opacity-100">125kg back squat</span> when you can&apos;t move your neck. Absurd goals create the daily discipline that compounds into victory.</p>
            </div>
            <div className="border border-[#EAB308]/30 p-7 hover:border-[#EAB308] hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-[#EAB308] text-4xl font-black mb-4 group-hover:scale-110 transition-transform">04</div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3 text-wtf-white">Proactive Resilience</h4>
              <p className="text-sm leading-relaxed text-wtf-white opacity-60">&ldquo;Use it and let it refine you, not define you.&rdquo; She chose the meaning attached to the crash — <span className="text-[#EAB308] font-bold opacity-100">actively, not passively</span>.</p>
            </div>
            <div className="border border-[#00E5FF]/30 p-7 hover:border-[#00E5FF] hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-[#00E5FF] text-4xl font-black mb-4 group-hover:scale-110 transition-transform">05</div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3 text-wtf-white">Dark Humor Shield</h4>
              <p className="text-sm leading-relaxed text-wtf-white opacity-60">A tent was pitched over her on the track. She can laugh about it now. <span className="text-[#00E5FF] font-bold opacity-100">Humor is how elite athletes survive</span> the unbearable.</p>
            </div>
            <div className="border border-[#EAB308]/30 p-7 hover:border-[#EAB308] hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-[#EAB308] text-4xl font-black mb-4 group-hover:scale-110 transition-transform">06</div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3 text-wtf-white">Team Architecture</h4>
              <p className="text-sm leading-relaxed text-wtf-white opacity-60">Bishop&apos;s <span className="text-[#EAB308] font-bold opacity-100">3-to-1 staff ratio</span> didn&apos;t happen by chance — she fought for the right environment. The team was on mission as much as she was.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING DEEP DIVE FAB */}
      <button
        onClick={() => setIsTrayOpen(true)}
        className="fixed bottom-8 right-8 z-40 group flex items-center gap-2 border-4 border-wtf-black shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 transition-all duration-300 px-6 py-4 bg-[#00E5FF] text-black"
        aria-label="Open deep dive tools"
      >
        <span className="font-black text-xl">Δ</span>
        <span className="text-sm font-black uppercase tracking-widest max-w-0 group-hover:max-w-[150px] overflow-hidden transition-all duration-300 whitespace-nowrap">Training Tools</span>
      </button>

      {/* MODALS & OVERLAYS */}
      <EpisodeTray isOpen={isTrayOpen} onClose={() => setIsTrayOpen(false)} />
      {extendedLessons.map((lesson, index) => (
         <LetterModal 
            key={index}
            isOpen={activeModalId === index}
            onClose={() => setActiveModalId(null)}
            lessonContext={lesson.context}
            summary={lesson.summary}
            index={index}
         />
      ))}
    </div>
  );
}
