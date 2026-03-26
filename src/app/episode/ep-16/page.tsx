'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { episodes } from '@/lib/data';

/* ─────────── RIGHT SIDE TRAY ─────────── */
function EpisodeTray({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      <div className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 transform transition-transform duration-300 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'var(--surface)' }}>
        <div className="p-6 border-b-4 flex justify-between items-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--cream-bg)' }}>
          <h3 className="font-black text-2xl uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>Tools</h3>
          <button onClick={onClose} className="p-2" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--page-bg)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
          <div className="p-5 zine-border relative overflow-hidden group transition-colors" style={{ backgroundColor: 'rgba(255,107,0,0.08)', borderColor: 'var(--color-wtf-orange)' }}>
            <h4 className="font-black text-xl mb-2 uppercase" style={{ color: 'var(--color-wtf-orange)' }}>Deep Dive</h4>
            <p className="font-medium text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Full structured transcript with save &amp; annotate.</p>
            <Link href="/episode/ep-16/transcript" className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 font-black uppercase tracking-widest text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all" style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}>Open Transcript</Link>
          </div>
          <div className="p-5 zine-border relative overflow-hidden group transition-colors" style={{ backgroundColor: 'rgba(139,92,246,0.08)', borderColor: '#8B5CF6' }}>
            <h4 className="font-black text-xl mb-2 uppercase text-[#8B5CF6]">Mental Map</h4>
            <p className="font-medium text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Interactive visual mind map of the conversation.</p>
            <button className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 bg-[#8B5CF6] text-white font-black uppercase tracking-widest text-sm shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all border-2 border-black">View Mind Map</button>
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
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col z-10 shadow-[20px_20px_0px_rgba(0,0,0,0.4)] overflow-hidden border-4"
           style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', backgroundImage: 'radial-gradient(var(--page-dot) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        
        {/* Header bar with save button */}
        <div className="w-full px-6 py-3 flex justify-between items-center sticky top-0 z-20"
             style={{ backgroundColor: 'var(--text-primary)', color: 'var(--page-bg)' }}>
          <div className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
             <span className="px-2 py-0.5" style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}>Lesson #{index + 1}</span>
             <span className="opacity-70">From the Desk of Context</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSaved(!isSaved)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors hover:text-[#FF6B00]"
                    style={{ color: isSaved ? '#FF6B00' : 'inherit' }}>
              {isSaved ? (
                <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Saved</>
              ) : (
                <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Save</>
              )}
            </button>
            <button onClick={onClose} className="hover:text-[#FF6B00] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Letter body */}
        <div className="p-8 md:p-16 overflow-y-auto">
          {/* Decorative doodles inside modal */}
          <div className="absolute top-16 right-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] opacity-10 rotate-12" style={{ borderBottomColor: 'var(--color-wtf-orange)' }}></div>
          <div className="absolute top-32 left-8 w-4 h-4 border-2 rotate-45 opacity-10" style={{ borderColor: '#3B82F6' }}></div>

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
  // Keywords to highlight with a color
  const keywords: Record<string, string> = {
    'stubbornness': '#FF6B00',
    'naive optimism': '#FF6B00',
    'disruption': '#3B82F6',
    'resilience': '#22C55E',
    'paranoia': '#8B5CF6',
    'micro-managing': '#EC4899',
    'micro-managed': '#EC4899',
    'competitive advantage': '#22C55E',
    'impenetrable skin': '#FF6B00',
    'arrogance': '#EF4444',
    'compartmentalize': '#3B82F6',
    'quality control': '#22C55E',
    'creative control': '#8B5CF6',
    'unreasonable': '#FF6B00',
    'sentimentality': '#EC4899',
    'mediocrity': '#EF4444',
    'delusional': '#8B5CF6',
    'neurosis': '#EC4899',
    'superpower': '#22C55E',
    'burned out': '#EF4444',
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
      <div className="relative p-5 md:p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--border-color)] zine-border overflow-hidden"
           style={{ backgroundColor: 'var(--surface)' }}>
        {/* Decorative stamp area */}
        <div className="absolute top-3 right-3 w-10 h-12 border-2 opacity-20 flex items-center justify-center" style={{ borderColor: 'var(--border-subtle)' }}>
          <span className="text-[9px] font-black rotate-12" style={{ color: 'var(--text-muted)' }}>0{index + 1}</span>
        </div>

        {/* Small decorative triangle inside card */}
        <div className="absolute bottom-3 right-14 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] opacity-[0.12] rotate-[25deg]" style={{ borderBottomColor: index % 2 === 0 ? '#FF6B00' : '#3B82F6' }}></div>
        
        <div className="relative z-10 flex items-start gap-5 pr-12">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center font-black text-lg border-2 border-black shadow-[2px_2px_0px_#000]"
               style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}>
            {index + 1}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-1" style={{ color: 'var(--text-muted)' }}>Click to unpack</span>
            <h3 className="text-lg md:text-xl font-black uppercase leading-tight font-serif italic" style={{ color: 'var(--text-primary)' }}>
               {lessonContext.split('.')[0]}.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── VINTAGE POLAROID ─────────── */
function Polaroid({ name, role, rotation, imageSrc }: { name: string, role: string, rotation: string, imageSrc: string }) {
  return (
    <div className="group bg-white p-2.5 pb-12 md:pb-14 border border-gray-300 shadow-[4px_6px_15px_rgba(0,0,0,0.15)] w-40 md:w-48 shrink-0 relative transition-all duration-500 cursor-crosshair"
         style={{ transform: rotation }}>
      <div className="w-full aspect-[4/5] bg-gray-300 relative mb-3 overflow-hidden border border-gray-400 grayscale group-hover:grayscale-0 transition-all duration-700 sepia-[.3] group-hover:sepia-0">
        <Image src={imageSrc} alt={name} fill className="object-cover" sizes="200px" />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}></div>
        <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] pointer-events-none"></div>
      </div>
      <div className="absolute bottom-3 left-0 w-full text-center">
        <p className="font-serif italic font-bold text-gray-800 text-sm md:text-base" style={{ transform: 'rotate(-1deg)' }}>{name}</p>
        <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-gray-500 font-sans mt-0.5">{role}</p>
      </div>
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#f8f5e6]/80 backdrop-blur-sm shadow-sm border border-gray-300 z-10" style={{ transform: 'rotate(2deg)', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(200,200,200,0.2))' }}></div>
    </div>
  );
}

/* ─────────── RECOMMENDED EPISODE CARD ─────────── */
function RecommendedCard({ id, title, guest, duration, tags }: { id: string, title: string, guest: string, duration: string, tags: string[] }) {
  return (
    <Link href={`/episode/${id}`} className="zine-border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--border-color)] flex flex-col gap-3"
          style={{ backgroundColor: 'var(--surface)' }}>
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-black text-lg uppercase leading-tight" style={{ color: 'var(--text-primary)' }}>{title}</h4>
        <span className="text-xs font-bold px-2 py-0.5 shrink-0" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--page-bg)' }}>{duration}</span>
      </div>
      <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-wtf-orange)' }}>with {guest}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map(tag => (
          <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2" style={{ borderColor: 'var(--border-subtle)' }}>{tag}</span>
        ))}
      </div>
    </Link>
  );
}

/* ─────────── DOODLE DECORATIONS SVG ─────────── */
function DoodleDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden md:block" aria-hidden>
      {/* Orange triangles — BOLD */}
      <div className="absolute top-[8%] left-[4%] w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[38px] opacity-[0.2] rotate-[15deg]" style={{ borderBottomColor: '#FF6B00' }}></div>
      <div className="absolute top-[28%] right-[5%] w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[28px] opacity-[0.18] -rotate-[20deg]" style={{ borderBottomColor: '#FF6B00' }}></div>
      <div className="absolute top-[55%] left-[6%] w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[24px] opacity-[0.15] rotate-[35deg]" style={{ borderBottomColor: '#FF6B00' }}></div>
      <div className="absolute top-[42%] right-[3%] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] opacity-[0.17] -rotate-[10deg]" style={{ borderBottomColor: '#FF6B00' }}></div>
      <div className="absolute top-[88%] left-[3%] w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[32px] opacity-[0.14] rotate-[22deg]" style={{ borderBottomColor: '#FF6B00' }}></div>

      {/* Blue triangles — BOLD */}
      <div className="absolute top-[15%] right-[4%] w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[22px] opacity-[0.16] rotate-[40deg]" style={{ borderBottomColor: '#3B82F6' }}></div>
      <div className="absolute top-[72%] left-[5%] w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[26px] opacity-[0.14] -rotate-[25deg]" style={{ borderBottomColor: '#3B82F6' }}></div>

      {/* Blue squares — BOLD */}
      <div className="absolute top-[18%] right-[9%] w-8 h-8 border-[3px] opacity-[0.18] rotate-[12deg]" style={{ borderColor: '#3B82F6' }}></div>
      <div className="absolute top-[48%] left-[3%] w-7 h-7 border-[3px] opacity-[0.15] -rotate-[15deg]" style={{ borderColor: '#3B82F6' }}></div>
      <div className="absolute top-[78%] right-[6%] w-10 h-10 border-[3px] opacity-[0.16] rotate-[30deg]" style={{ borderColor: '#3B82F6' }}></div>
      <div className="absolute top-[62%] right-[10%] w-5 h-5 border-[3px] opacity-[0.12] rotate-[45deg]" style={{ borderColor: '#3B82F6' }}></div>

      {/* Orange filled rectangles — BOLD */}
      <div className="absolute top-[35%] left-[2%] w-14 h-5 opacity-[0.18] rotate-[8deg]" style={{ backgroundColor: '#FF6B00' }}></div>
      <div className="absolute top-[70%] right-[3%] w-10 h-4 opacity-[0.15] -rotate-[12deg]" style={{ backgroundColor: '#FF6B00' }}></div>
      <div className="absolute top-[22%] left-[8%] w-8 h-3 opacity-[0.12] rotate-[18deg]" style={{ backgroundColor: '#FF6B00' }}></div>
      <div className="absolute top-[82%] right-[8%] w-12 h-4 opacity-[0.12] -rotate-[5deg]" style={{ backgroundColor: '#FF6B00' }}></div>

      {/* Diamonds — BOLD */}
      <div className="absolute top-[32%] right-[4%] w-7 h-7 border-[3px] opacity-[0.15] rotate-45" style={{ borderColor: '#EC4899' }}></div>
      <div className="absolute top-[67%] left-[2%] w-6 h-6 border-[3px] opacity-[0.18] rotate-45" style={{ borderColor: '#FF6B00' }}></div>
      <div className="absolute top-[92%] right-[5%] w-5 h-5 border-[3px] opacity-[0.12] rotate-45" style={{ borderColor: '#22C55E' }}></div>

      {/* Circles — BOLD */}
      <div className="absolute top-[45%] right-[3%] w-9 h-9 rounded-full border-[3px] opacity-[0.15]" style={{ borderColor: '#22C55E' }}></div>
      <div className="absolute top-[10%] left-[6%] w-5 h-5 rounded-full opacity-[0.2]" style={{ backgroundColor: '#8B5CF6' }}></div>
      <div className="absolute top-[85%] left-[5%] w-7 h-7 rounded-full border-[3px] opacity-[0.14]" style={{ borderColor: '#EC4899' }}></div>
      <div className="absolute top-[38%] left-[2%] w-10 h-10 rounded-full border-[3px] opacity-[0.1]" style={{ borderColor: '#FF6B00' }}></div>
      <div className="absolute top-[58%] right-[7%] w-4 h-4 rounded-full opacity-[0.2]" style={{ backgroundColor: '#22C55E' }}></div>

      {/* White/surface blocks — BOLD */}
      <div className="absolute top-[40%] right-[7%] w-14 h-8 border-[3px] opacity-[0.1]" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface)' }}></div>
      <div className="absolute top-[52%] left-[4%] w-10 h-10 border-[3px] opacity-[0.08]" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface)' }}></div>
      <div className="absolute top-[20%] right-[3%] w-8 h-6 border-[3px] opacity-[0.07]" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface)' }}></div>

      {/* Dashes / short lines — BOLD */}
      <div className="absolute top-[27%] left-[5%] w-12 h-1 opacity-[0.22] rotate-[30deg]" style={{ backgroundColor: '#FF6B00' }}></div>
      <div className="absolute top-[47%] right-[4%] w-10 h-1 opacity-[0.18] -rotate-[20deg]" style={{ backgroundColor: '#3B82F6' }}></div>
      <div className="absolute top-[73%] left-[9%] w-8 h-1 opacity-[0.15] rotate-[45deg]" style={{ backgroundColor: '#8B5CF6' }}></div>
      <div className="absolute top-[60%] left-[6%] w-14 h-1 opacity-[0.12] -rotate-[10deg]" style={{ backgroundColor: '#EC4899' }}></div>
      <div className="absolute top-[35%] right-[6%] w-10 h-1 opacity-[0.15] rotate-[15deg]" style={{ backgroundColor: '#22C55E' }}></div>

      {/* Dots scatter — BOLD */}
      <div className="absolute top-[12%] left-[11%] w-3 h-3 rounded-full opacity-[0.25]" style={{ backgroundColor: '#FF6B00' }}></div>
      <div className="absolute top-[30%] right-[13%] w-2.5 h-2.5 rounded-full opacity-[0.22]" style={{ backgroundColor: '#3B82F6' }}></div>
      <div className="absolute top-[50%] left-[9%] w-2.5 h-2.5 rounded-full opacity-[0.22]" style={{ backgroundColor: '#22C55E' }}></div>
      <div className="absolute top-[75%] right-[11%] w-3 h-3 rounded-full opacity-[0.18]" style={{ backgroundColor: '#8B5CF6' }}></div>
      <div className="absolute top-[5%] right-[7%] w-2 h-2 rounded-full opacity-[0.22]" style={{ backgroundColor: '#FF6B00' }}></div>
      <div className="absolute top-[44%] left-[12%] w-2 h-2 rounded-full opacity-[0.2]" style={{ backgroundColor: '#EC4899' }}></div>
      <div className="absolute top-[65%] right-[14%] w-2.5 h-2.5 rounded-full opacity-[0.18]" style={{ backgroundColor: '#FF6B00' }}></div>
      <div className="absolute top-[90%] left-[10%] w-2 h-2 rounded-full opacity-[0.22]" style={{ backgroundColor: '#3B82F6' }}></div>

      {/* Cross / plus marks — BOLD */}
      <div className="absolute top-[56%] right-[4%] opacity-[0.18] text-5xl font-black" style={{ color: '#FF6B00' }}>+</div>
      <div className="absolute top-[25%] left-[3%] opacity-[0.14] text-4xl font-black" style={{ color: '#3B82F6' }}>+</div>
      <div className="absolute top-[80%] right-[9%] opacity-[0.12] text-3xl font-black" style={{ color: '#22C55E' }}>+</div>
      <div className="absolute top-[40%] left-[2%] opacity-[0.1] text-3xl font-black" style={{ color: '#EC4899' }}>×</div>
    </div>
  );
}

/* (Rope removed per user request) */

/* ═══════════════════════════════════════════════════════════════ */
/*                     MAIN PAGE COMPONENT                       */
/* ═══════════════════════════════════════════════════════════════ */
export default function WTF16Episode() {
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [activeModalId, setActiveModalId] = useState<number | null>(null);
  const episode = episodes.find(ep => ep.id === 'ep-16');

  if (!episode) return <div className="p-12" style={{ color: 'var(--text-primary)' }}>Episode not found</div>;

  const guests = [
    { name: "Ritesh Agarwal", role: "OYO Rooms", rotation: "rotate(-7deg) translateY(12px)", image: "/images/guests/Ritesh.avif" },
    { name: "Ghazal Alagh", role: "Mamaearth", rotation: "rotate(4deg) translateY(-8px)", image: "/images/guests/gazal.jpg" },
    { name: "Manish Poddar", role: "Rare Rabbit", rotation: "rotate(-4deg) translateY(10px)", image: "/images/guests/manish.avif" },
    { name: "Nikhil Kamath", role: "Host · Zerodha", rotation: "rotate(7deg) translateY(-6px)", image: "/images/guests/nikhil.jpg" }
  ];

  const extendedLessons = [
    {
      context: "True entrepreneurial spirit often disguises itself as stubbornness or naive optimism",
      summary: "During the conversation, Ritesh discussed how the initial audacity to standardize cheap hotels was viewed as purely naive. However, this 'flaw' of ignoring industry norms is precisely what allowed OYO to see an opportunity where legacy hospitality companies saw only risk. The lesson here is that standard societal 'flaws' like extreme stubbornness or inability to adhere to 'how things are done' are actually prerequisites for massive scale disruption. If you fit perfectly into the existing system, you are unlikely to reinvent it.",
      align: 'left' as const
    },
    {
      context: "Public failure is not a setback; it's a filtration system for resilience",
      summary: "Ghazal touched upon the immense pressure of building a D2C brand in the grueling public eye. They discussed that founders who lack the 'filter' to ignore public criticism usually fail early. The 'flaw' of being dangerously unaffected by outside noise or overly obsessed with a singular vision often reads as arrogance, but it acts as a necessary shield. The conversation summarized that intense, public failures either break a founder or build an impenetrable skin.",
      align: 'right' as const
    },
    {
      context: "Operational paranoia over comfortable delegation",
      summary: "Manish Poddar provided insights on the scaling phase of fashion retail. A common 'flaw' discussed was the inability to fully let go—micro-managing the aesthetics and details when conventional management science says 'delegate'. But for creative businesses like Rare Rabbit, that paranoia is the secret sauce. The podcast referenced multiple moments where giving up control too early led to dilution of the core thesis.",
      align: 'left' as const
    },
    {
      context: "The ability to compartmentalize emotion is a survival mechanism, not coldness",
      summary: "Ritesh described how dealing with intense public scrutiny requires you to compartmentalize. Another 'flaw' of his is complete emotional detachment when analyzing a business failure. OYO had massive pushback in certain markets. If he took it personally, he would have burned out at 22. Instead, looking at it purely as data—a trait labelled 'cold'—is actually the highest form of professional resilience. The founders agreed: sentimentality is for the vision, not the operational decisions.",
      align: 'right' as const
    },
    {
      context: "Finding the industry where your neurosis is a competitive advantage",
      summary: "Manish's closing advice crystallized the entire episode. Instead of trying to 'fix' your flaws, the entrepreneurial approach is to channel them. Find an industry where your specific neurosis—whether detail-oriented paranoia or unreasonable stubbornness—becomes the differentiating factor. The world is built by unreasonable people. If you fit molds designed by conventional wisdom, you are optimized for mediocrity.",
      align: 'center' as const
    }
  ];

  const recommendedEpisodes = [
    { id: 'ep-03', title: 'Pain, Power & The Game Nobody Wins', guest: 'Chamath Palihapitiya', duration: '1 hr 30 min', tags: ['BUSINESS', 'PSYCHOLOGY'] },
    { id: 'ep-05', title: 'WTF Is Wealth?', guest: 'Ray Dalio', duration: '1 hr 05 min', tags: ['ECONOMICS', 'FINANCE'] },
    { id: 'ep-06', title: 'WTF is Beauty?', guest: 'Bhakti Modi & Panel', duration: '2 hr 38 min', tags: ['D2C', 'BRAND BUILDING'] }
  ];

  return (
    <div className="w-full relative min-h-screen pb-24 overflow-x-hidden">
      
      {/* Global doodle decorations */}
      <DoodleDecorations />

      {/* ── HEADER ── */}
      <header className="w-full max-w-6xl mx-auto px-6 pt-10 pb-8 relative z-10">
        <div className="mb-4">
          <Link href="/wtf" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all" style={{ color: 'var(--text-primary)' }}>
            ← Back to WTF Podcast
          </Link>
        </div>

        <div className="mb-4">
          <div className="px-3 py-1 text-xs font-bold tracking-widest uppercase inline-block" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--page-bg)' }}>
            {episode.series || 'WTF is'} • Episode {episode.number}
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl lg:w-[90%] font-black uppercase tracking-tight leading-[0.95] mb-6" style={{ color: 'var(--text-primary)' }}>
          Everyone and everything: <span style={{ color: 'var(--color-wtf-orange)' }}>What character flaws make the best entrepreneurs?</span>
        </h1>
        
        <p className="text-lg font-medium leading-relaxed max-w-3xl mb-8" style={{ color: 'var(--text-secondary)' }}>
          {episode.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-8" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-medium">{episode.date}</span>
          <span className="opacity-30 text-xl">|</span>
          <span className="font-medium">{episode.duration}</span>
          <span className="opacity-30 text-xl">|</span>
          {episode.tags.map(tag => (
            <span key={tag} className="text-xs font-bold uppercase tracking-widest px-3 py-1 zine-border">{tag}</span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-3">
          <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1DB954] text-black font-bold uppercase tracking-widest text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.78-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.745 3.805-.87 7.076-.496 9.71 1.115.293.18.386.563.206.854zm1.214-2.723c-.227.37-.706.486-1.076.26-2.712-1.665-6.885-2.153-9.94-1.18-.413.13-.85-.1-1.006-.516-.156-.412.1-.85.516-1.006 3.486-1.11 8.13-.563 11.246 1.353.37.226.486.706.26 1.075zm.116-2.846c-3.264-1.936-8.65-2.115-11.77-1.17-.487.147-.993-.13-1.14-.616-.147-.488.13-.993.616-1.14 3.565-1.08 9.53-.87 13.27 1.35.44.263.58.834.318 1.272-.26.438-.83.58-1.27.318z"/></svg>
            Spotify
          </a>
          <a href="https://youtu.be/FPV5fAkqyBs?si=IMHTAl1A4IADcVL2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF0000] text-white font-bold uppercase tracking-widest text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            YouTube
          </a>
        </div>
      </header>

      {/* ── DIVIDER ── */}
      <div className="w-full max-w-6xl mx-auto px-6 mt-8">
        <div className="border-t-2 border-dashed" style={{ borderColor: 'var(--border-color)', opacity: 0.4 }}></div>
      </div>

      {/* ── POLAROID SCRAPBOOK + HIGHLIGHTS ── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 relative">
        <p className="text-center font-bold uppercase tracking-widest text-sm mb-4" style={{ color: 'var(--text-muted)' }}>The Perspectives</p>
        
        {/* Highlights merged under the heading */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {(episode.highlights || []).map((h, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-l-4" 
                  style={{ borderColor: 'var(--color-wtf-orange)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface)' }}>
              {h}
            </span>
          ))}
        </div>

        <div className="flex flex-row justify-center items-center gap-0 md:-space-x-4 flex-wrap lg:flex-nowrap relative z-10 w-full max-w-4xl mx-auto">
          {guests.map((g, i) => (
            <div key={i} className="mb-8 lg:mb-0">
               <Polaroid name={g.name} role={g.role} rotation={g.rotation} imageSrc={g.image} />
            </div>
          ))}
        </div>
      </section>

      {/* ── DOTTED DIVIDER ── */}
      <div className="w-full max-w-5xl mx-auto px-6 py-2">
        <div className="border-t-2 border-dashed" style={{ borderColor: 'var(--border-color)', opacity: 0.4 }}></div>
      </div>

      {/* ── KEY LESSONS ── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16 relative z-10">

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight inline-block relative" style={{ color: 'var(--text-primary)' }}>
            <span className="relative z-10">Unpack the Lessons</span>
            <div className="absolute -bottom-2 -left-2 w-[110%] h-5 opacity-50 z-0" style={{ backgroundColor: 'var(--color-wtf-orange)' }}></div>
          </h2>
          <p className="font-medium mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>Crack open these envelopes to dive into the deep psychological truths shared during the podcast.</p>
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
        <div className="border-t-2 border-dashed" style={{ borderColor: 'var(--border-color)', opacity: 0.4 }}></div>
      </div>

      {/* ── EPISODE BREAKDOWN SECTION ── */}
      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 zine-border relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5" style={{ backgroundColor: 'var(--color-wtf-orange)', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>Duration</h4>
              <p className="text-4xl font-black" style={{ color: 'var(--color-wtf-orange)' }}>2hr+</p>
              <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-muted)' }}>Deep, unedited conversation across several key themes.</p>
            </div>
            <div className="p-6 zine-border relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5" style={{ backgroundColor: '#3B82F6', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>Themes</h4>
              <p className="text-4xl font-black" style={{ color: '#3B82F6' }}>5</p>
              <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-muted)' }}>Stubbornness, resilience, paranoia, compartmentalization, channeling.</p>
            </div>
            <div className="p-6 zine-border relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5" style={{ backgroundColor: '#22C55E', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>Companies</h4>
              <p className="text-4xl font-black" style={{ color: '#22C55E' }}>3</p>
              <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-muted)' }}>OYO · Mamaearth · Rare Rabbit — combined $5B+ valuation.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* ── DOTTED DIVIDER ── */}
      <div className="w-full max-w-5xl mx-auto px-6 py-2">
        <div className="border-t-2 border-dashed" style={{ borderColor: 'var(--border-color)', opacity: 0.4 }}></div>
      </div>

      {/* ── NOTABLE QUOTE ── */}
      <section className="w-full py-20 relative" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-6xl md:text-8xl font-serif opacity-10 leading-none mb-4" style={{ color: 'var(--color-wtf-orange)' }}>&ldquo;</div>
          <blockquote className="text-2xl md:text-4xl font-black uppercase leading-tight tracking-tight italic mb-8" style={{ color: 'var(--text-primary)' }}>
            Don&apos;t fix it. Channel it. Find an industry where your specific neurosis is a competitive advantage.
          </blockquote>
          <p className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--color-wtf-orange)' }}>— Manish Poddar, Rare Rabbit</p>
        </div>
      </section>

      {/* ── THE EPISODE IN 60 SECONDS (Summary with inline images) ── */}
      <section className="w-full py-16" style={{ backgroundColor: 'var(--page-bg)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 inline-block relative" style={{ color: 'var(--text-primary)' }}>
            <span className="relative z-10">The Episode in 60 Seconds</span>
            <div className="absolute -bottom-1 -left-1 w-[110%] h-4 opacity-40 z-0" style={{ backgroundColor: '#3B82F6' }}></div>
          </h3>
          <p className="font-medium mb-10" style={{ color: 'var(--text-muted)' }}>A rapid-fire breakdown of the core ideas, with the moments that mattered most.</p>

          {/* Paragraph 1 with LEFT image */}
          <div className="mb-8 overflow-hidden">
            <div className="float-left mr-6 mb-4 -rotate-3 shadow-[4px_4px_0px_var(--border-color)] border-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-48 h-32 overflow-hidden bg-neutral-200">
                <img src="/images/guests/Ritesh.avif" alt="Ritesh Agarwal" className="w-full h-full object-cover" />
              </div>
              <div className="px-2 py-1.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Ritesh · OYO</span>
              </div>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The conversation opened with Ritesh Agarwal describing his early days. The industry told him standardizing budget hotels was impossible — a <span className="font-extrabold" style={{ color: '#FF6B00' }}>fool&apos;s errand</span> in a structurally broken market. But his <span className="font-extrabold" style={{ color: '#FF6B00' }}>stubbornness</span> — a trait routinely criticised in school — became the engine that built OYO into a global brand. He argued that <span className="font-extrabold" style={{ color: '#8B5CF6' }}>rational, balanced people</span> who listen to veterans will never build something truly <span className="font-extrabold" style={{ color: '#22C55E' }}>disruptive</span>. You have to be <span className="font-extrabold" style={{ color: '#FF6B00' }}>slightly delusional</span>.
            </p>
          </div>

          {/* Paragraph 2 with RIGHT image */}
          <div className="mb-8 overflow-hidden">
            <div className="float-right ml-6 mb-4 rotate-2 shadow-[4px_4px_0px_var(--border-color)] border-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-48 h-32 overflow-hidden bg-neutral-200">
                <img src="/images/guests/gazal.jpg" alt="Ghazal Alagh" className="w-full h-full object-cover" />
              </div>
              <div className="px-2 py-1.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Ghazal · Mamaearth</span>
              </div>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Ghazal Alagh brought a different angle: <span className="font-extrabold" style={{ color: '#8B5CF6' }}>paranoia</span>. In the D2C beauty market, her inability to trust any standard industry certification drove <span className="font-extrabold" style={{ color: '#22C55E' }}>extreme quality control</span>. What reads as obsessive anxiety from the outside became Mamaearth&apos;s core brand promise — <span className="font-extrabold" style={{ color: '#3B82F6' }}>100% toxin-free</span>. She stressed that founders who lack the flaw of being <span className="font-extrabold" style={{ color: '#FF6B00' }}>dangerously unaffected</span> by outside noise usually fail early.
            </p>
          </div>

          {/* Paragraph 3 with LEFT image */}
          <div className="mb-8 overflow-hidden">
            <div className="float-left mr-6 mb-4 -rotate-2 shadow-[4px_4px_0px_var(--border-color)] border-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-48 h-32 overflow-hidden bg-neutral-200">
                <img src="/images/guests/manish.avif" alt="Manish Poddar" className="w-full h-full object-cover" />
              </div>
              <div className="px-2 py-1.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Manish · Rare Rabbit</span>
              </div>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Manish Poddar closed the loop with <span className="font-extrabold" style={{ color: '#FF6B00' }}>micro-management</span>. Every business book preaches delegation, but Manish argued that in fashion, the <span className="font-extrabold" style={{ color: '#8B5CF6' }}>aesthetic is everything</span>. He micro-managed the exact shade of every fabric, the lighting in every store — and that <span className="font-extrabold" style={{ color: '#22C55E' }}>intense creative control</span> is the sole reason Rare Rabbit&apos;s brand DNA stayed intact from 1 store to 100. Board members called it a flaw. He calls it <span className="font-extrabold" style={{ color: '#FF6B00' }}>the business</span>.
            </p>
          </div>

          {/* Closing thought */}
          <div className="mt-10 p-6 border-l-4" style={{ borderColor: 'var(--color-wtf-orange)', backgroundColor: 'var(--surface)' }}>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-wtf-orange)' }}>The Takeaway</p>
            <p className="text-base leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
              All three founders took traits society actively tries to train out of us — <span className="font-extrabold" style={{ color: '#FF6B00' }}>stubbornness</span>, <span className="font-extrabold" style={{ color: '#8B5CF6' }}>paranoia</span>, <span className="font-extrabold" style={{ color: '#22C55E' }}>micro-management</span> — and weaponized them. The world is built by unreasonable people.
            </p>
          </div>
        </div>
      </section>

      {/* ── DOTTED DIVIDER ── */}
      <div className="w-full max-w-6xl mx-auto px-6 py-2">
        <div className="border-t-2 border-dashed" style={{ borderColor: 'var(--border-color)', opacity: 0.4 }}></div>
      </div>

      {/* ── RECOMMENDED EPISODES ── */}
      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3" style={{ color: 'var(--text-primary)' }}>If You Liked This</h3>
          <p className="font-medium mb-10" style={{ color: 'var(--text-muted)' }}>Episodes exploring similar themes of resilience, building, and the entrepreneur&apos;s psyche.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedEpisodes.map(ep => (
              <RecommendedCard key={ep.id} {...ep} />
            ))}
          </div>
        </div>
      </section>

      {/* FLOATING DEEP DIVE FAB */}
      <button
        onClick={() => setIsTrayOpen(true)}
        className="fixed bottom-8 right-8 z-40 group flex items-center gap-2 border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all duration-300 px-4 py-3"
        style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}
        aria-label="Open deep dive tools"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        <span className="text-xs font-black uppercase tracking-widest max-w-0 group-hover:max-w-[120px] overflow-hidden transition-all duration-300 whitespace-nowrap">Deep Dive</span>
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
