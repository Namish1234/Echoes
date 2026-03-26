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
            <Link href="/episode/ep-03/transcript" className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 font-black uppercase tracking-widest text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all" style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}>Open Transcript</Link>
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
        <div className="p-8 md:p-16 overflow-y-auto">
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
  const keywords: Record<string, string> = {
    'distribution': '#FF6B00',
    'authenticity': '#22C55E',
    'consistency': '#3B82F6',
    'algorithm': '#8B5CF6',
    'algorithmic': '#8B5CF6',
    'virality': '#EC4899',
    'viral': '#EC4899',
    'attention': '#FF6B00',
    'brand': '#3B82F6',
    'influence': '#FF6B00',
    'influencer': '#EF4444',
    'burnout': '#EF4444',
    'content creator': '#22C55E',
    'creator economy': '#22C55E',
    'audience': '#3B82F6',
    'discipline': '#8B5CF6',
    'hardworking': '#22C55E',
    'monetisation': '#FF6B00',
    'platform': '#3B82F6',
    'eyeballs': '#FF6B00',
    'community': '#22C55E',
    'vulnerable': '#EC4899',
    'hierarchy': '#8B5CF6',
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
        <div className="absolute top-3 right-3 w-10 h-12 border-2 opacity-20 flex items-center justify-center" style={{ borderColor: 'var(--border-subtle)' }}>
          <span className="text-[9px] font-black rotate-12" style={{ color: 'var(--text-muted)' }}>0{index + 1}</span>
        </div>
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

/* ─────────── DOODLE DECORATIONS ─────────── */
function DoodleDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden md:block" aria-hidden>
      <div className="absolute top-[8%] left-[4%] w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[38px] opacity-[0.2] rotate-[15deg]" style={{ borderBottomColor: '#FF6B00' }}></div>
      <div className="absolute top-[28%] right-[5%] w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[28px] opacity-[0.18] -rotate-[20deg]" style={{ borderBottomColor: '#FF6B00' }}></div>
      <div className="absolute top-[55%] left-[6%] w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[24px] opacity-[0.15] rotate-[35deg]" style={{ borderBottomColor: '#FF6B00' }}></div>
      <div className="absolute top-[15%] right-[4%] w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[22px] opacity-[0.16] rotate-[40deg]" style={{ borderBottomColor: '#3B82F6' }}></div>
      <div className="absolute top-[72%] left-[5%] w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[26px] opacity-[0.14] -rotate-[25deg]" style={{ borderBottomColor: '#3B82F6' }}></div>
      <div className="absolute top-[18%] right-[9%] w-8 h-8 border-[3px] opacity-[0.18] rotate-[12deg]" style={{ borderColor: '#3B82F6' }}></div>
      <div className="absolute top-[48%] left-[3%] w-7 h-7 border-[3px] opacity-[0.15] -rotate-[15deg]" style={{ borderColor: '#3B82F6' }}></div>
      <div className="absolute top-[35%] left-[2%] w-14 h-5 opacity-[0.18] rotate-[8deg]" style={{ backgroundColor: '#FF6B00' }}></div>
      <div className="absolute top-[70%] right-[3%] w-10 h-4 opacity-[0.15] -rotate-[12deg]" style={{ backgroundColor: '#FF6B00' }}></div>
      <div className="absolute top-[32%] right-[4%] w-7 h-7 border-[3px] opacity-[0.15] rotate-45" style={{ borderColor: '#EC4899' }}></div>
      <div className="absolute top-[67%] left-[2%] w-6 h-6 border-[3px] opacity-[0.18] rotate-45" style={{ borderColor: '#FF6B00' }}></div>
      <div className="absolute top-[45%] right-[3%] w-9 h-9 rounded-full border-[3px] opacity-[0.15]" style={{ borderColor: '#22C55E' }}></div>
      <div className="absolute top-[10%] left-[6%] w-5 h-5 rounded-full opacity-[0.2]" style={{ backgroundColor: '#8B5CF6' }}></div>
      <div className="absolute top-[56%] right-[4%] opacity-[0.18] text-5xl font-black" style={{ color: '#FF6B00' }}>+</div>
      <div className="absolute top-[25%] left-[3%] opacity-[0.14] text-4xl font-black" style={{ color: '#3B82F6' }}>+</div>
      <div className="absolute top-[80%] right-[9%] opacity-[0.12] text-3xl font-black" style={{ color: '#22C55E' }}>+</div>
    </div>
  );
}


/* ═══════════════════ MAIN PAGE ═══════════════════ */
export default function EpisodePage() {
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [activeModalId, setActiveModalId] = useState<number | null>(null);
  const episode = episodes.find(ep => ep.id === 'ep-03');

  if (!episode) return <div className="p-12" style={{ color: 'var(--text-primary)' }}>Episode not found</div>;

  const guests = [
    { name: "Tanmay Bhat", role: "Comedian · Creator", rotation: "rotate(-7deg) translateY(12px)", image: "/images/guests/tanmay.jpg" },
    { name: "Prajakta Koli", role: "MostlySane", rotation: "rotate(4deg) translateY(-8px)", image: "/images/guests/prajakta.webp" },
    { name: "Ranveer Allahbadia", role: "BeerBiceps", rotation: "rotate(-4deg) translateY(10px)", image: "/images/guests/ranveer.webp" },
    { name: "Nuseir Yassin", role: "Nas Daily", rotation: "rotate(7deg) translateY(-6px)", image: "/images/guests/nuseir.webp" },
    { name: "Nikhil Kamath", role: "Host", rotation: "rotate(-3deg) translateY(6px)", image: "/images/guests/nikhil.jpg" }
  ];

  const extendedLessons = [
    {
      context: "'Influencer' is a dirty word — and none of them want it.",
      summary: "Nas Daily dropped this bomb in the opening minutes: 'The influencers are the parents, the doctors, the teachers. What we do is content creation.' The table unanimously rejected the label. Tanmay — who started as a comedy writer for TV before co-founding AIB, then pivoted to YouTube after the scandal — said the term reduces 14 years of evolution to a social media stereotype. Ranveer added that he titled his early videos 'how to impress girls' because 'personality development tips' got zero clicks. That clickbait label stuck for years, becoming a cautionary tale: the internet never forgets your first packaging. Prajakta simply said she's never once introduced herself as an influencer. Nikhil probed whether the resistance was just ego, but each creator backed it up with a structural argument — they build businesses, employ teams, and create media. The word 'influencer' strips all of that away.",
      align: 'left' as const
    },
    {
      context: "Distribution is the only moat — everything else is a feature.",
      summary: "Tanmay's thesis landed like a thesis should — with immediate agreement from a billionaire. His argument: if you own distribution, you own eyeballs. When you move industries — from comedy to ads to entrepreneurship — the eyeballs follow. Nikhil pressed on this, and Tanmay doubled down: paying for ads destroys the delta that organic reach gives you for free. He has 20-25 million followers across channels. In a country of 1.5 billion, that's nothing — there's runway for decades. But then Nas dropped the counterpoint: 'At some point, you will saturate every single person in India that could potentially like you. Then you'll have this amazing and sad decline.' YouTube's best interest, he argued, is to create a new Mr Beast every 5 years. The algorithm isn't sinister — it's just hungry for novelty. Tanmay's response? 'Which is why I'll also be aggressive on Instagram.' The lesson: distribution is the moat, but you can never stop digging it.",
      align: 'right' as const
    },
    {
      context: "Every creator has a shelf life — and you must engineer your exit.",
      summary: "Nas was the one who said the quiet part out loud: 'Let me be the bad guy and sound the alarm to everybody watching — you must plan and engineer your exit plan when you make it big as a content creator.' He cited a seven-year cycle thesis ('the seven-year itch, even your taste buds change every seven years'), which Tanmay — who started in 2009 — confirmed through lived experience. Fourteen years in, he's reinvented himself across standup, YouTube sketches, and now ad/marketing consulting. Nas was more blunt about his own trajectory: 'I think so, and I intend on exiting creator life at some point.' The panel agreed that creator life moves in 'batches' — every four years a new wave arrives, and if you haven't reinvented or diversified, you get replaced. The decline, Nas warned, is 'often very lonely' — the views just quietly stop coming and nobody talks about it.",
      align: 'left' as const
    },
    {
      context: "Platform classism is real — and it mirrors society's screen obsession.",
      summary: "Nas mapped out the hierarchy: YouTubers are first-class citizens of the creator world, then Instagrammers, then TikTokers, then Facebookers. Tanmay immediately connected this to something he'd discussed with Kunal Shah: the bigger the screen, the higher the perceived status. A movie star on a 70-foot IMAX has more cultural weight than a TV actor on a 50-inch screen, who has more than a creator on a 6-inch phone. But Tanmay confessed something revealing: 'I would rather meet Joe Rogan than Tom Cruise. Rogan has shaped my thinking more in the last decade than any film has.' The generational flip is real. The panel also explored how politicians and creators share identical skill sets — mass communication, handling criticism, and reading audiences. Nas declared: 'I feel like if I run for prime minister of any country, I'm ready.' A YouTuber president, they all agreed, is not just possible — it's inevitable.",
      align: 'right' as const
    },
    {
      context: "You can't be cancelled — but you can be broken by authenticity.",
      summary: "Nas pushed back hard on cancel culture: 'There's no such thing as cancel. The algorithm has no emotions — right wing, left wing, it doesn't care. You create content, it's interesting enough, it shows it to people.' His framework: pushback is actually the most positive thing that can happen — it means you're finally relevant enough to hate. But Ranveer's experience was more personal. He revealed he went through a devastating phase during engineering college that 'blew all the emotions out of me.' He'd been cancelled multiple times since COVID, and his honest answer about coping was: quantity. 'My game has always been quantity. I'm not the smartest, not the most creative Creator, but I can create a huge amount of content.' The group landed on a nuanced authenticity model — Nikhil compared it to FIFA player attributes: the digital version of authentic means choosing which true traits to project. 'Everything you say should be true,' Tanmay concluded, 'but not everything that's true should be said.'",
      align: 'center' as const
    }
  ];

  const recommendedEpisodes = [
    {
      id: 'ep-16',
      title: "What character 'flaws' make the best entrepreneurs?",
      guest: 'Ritesh Agarwal, Ghazal Alagh, Manish Poddar',
      duration: '2hr+',
      tags: ['STARTUPS & VC'],
    },
    {
      id: 'ep-06',
      title: 'WTF is Fueling India\'s Beauty & Skincare Revolution?',
      guest: 'Bhakti Mehta, Shantanu Deshpande, Diipa Büller-Khosla',
      duration: '2hr 38m',
      tags: ['BUSINESS & ECONOMICS'],
    },
    {
      id: 'ep-18',
      title: 'Pain, Power & The Game Nobody Wins',
      guest: 'Chamath Palihapitiya',
      duration: '1hr 30m',
      tags: ['BUSINESS & ECONOMICS'],
    }
  ];

  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: 'var(--page-bg)', backgroundImage: 'radial-gradient(var(--page-dot) 1px, transparent 1px)', backgroundSize: '25px 25px' }}>
      
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
          WTF does it take to Build <span style={{ color: 'var(--color-wtf-orange)' }}>Influence</span> Today?
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
          <a href="https://youtu.be/JjDjDvNgkFo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF0000] text-white font-bold uppercase tracking-widest text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all">
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
          <p className="font-medium mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>Five takeaways from India&apos;s biggest creators on building real influence.</p>
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

      {/* ── EPISODE BREAKDOWN ── */}
      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 zine-border relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5" style={{ backgroundColor: 'var(--color-wtf-orange)', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>Duration</h4>
              <p className="text-4xl font-black" style={{ color: 'var(--color-wtf-orange)' }}>2.5hr</p>
              <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-muted)' }}>Unfiltered conversation about the creator economy.</p>
            </div>
            <div className="p-6 zine-border relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5" style={{ backgroundColor: '#3B82F6', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>Themes</h4>
              <p className="text-4xl font-black" style={{ color: '#3B82F6' }}>6</p>
              <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-muted)' }}>Distribution, consistency, vulnerability, hierarchy, monetisation, authenticity.</p>
            </div>
            <div className="p-6 zine-border relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5" style={{ backgroundColor: '#22C55E', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              <h4 className="font-black text-xl uppercase tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>Creators</h4>
              <p className="text-4xl font-black" style={{ color: '#22C55E' }}>4</p>
              <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-muted)' }}>MostlySane · BeerBiceps · Nas Daily · Tanmay Bhat</p>
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
            If you own distribution, you own eyeballs. No matter where you move, the eyeballs will travel with you.
          </blockquote>
          <p className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--color-wtf-orange)' }}>— Tanmay Bhat</p>
        </div>
      </section>

      {/* ── THE EPISODE IN 60 SECONDS ── */}
      <section className="w-full py-16" style={{ backgroundColor: 'var(--page-bg)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 inline-block relative" style={{ color: 'var(--text-primary)' }}>
            <span className="relative z-10">The Episode in 60 Seconds</span>
            <div className="absolute -bottom-1 -left-1 w-[110%] h-4 opacity-40 z-0" style={{ backgroundColor: '#3B82F6' }}></div>
          </h3>
          <p className="font-medium mb-10" style={{ color: 'var(--text-muted)' }}>A rapid-fire breakdown of the core ideas, with the moments that mattered most.</p>

          {/* Paragraph 1 — LEFT image: Tanmay */}
          <div className="mb-8 overflow-hidden">
            <div className="float-left mr-6 mb-4 -rotate-3 shadow-[4px_4px_0px_var(--border-color)] border-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-48 h-32 overflow-hidden bg-neutral-200">
                <img src="/images/guests/tanmay.jpg" alt="Tanmay Bhat" className="w-full h-full object-cover" />
              </div>
              <div className="px-2 py-1.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Tanmay · Comedian</span>
              </div>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Tanmay opened with the thesis that anchored the entire conversation: <span className="font-extrabold" style={{ color: '#FF6B00' }}>distribution</span> is the only real moat. If you own <span className="font-extrabold" style={{ color: '#FF6B00' }}>eyeballs</span>, you own everything — OTT deals, billboards, Davos invitations. He&apos;s been creating since 2009 — writing for TV, then standup with AIB, now co-founding 20+ companies. With 25 million followers across channels, his logic is simple: in a country of 1.5 billion, the runway is decades long. But he was also the one who reminded everyone that he still introduces himself as a comedian. &ldquo;Being a comic is an attitude of just leading life,&rdquo; he said. &ldquo;It&apos;s inherently <span className="font-extrabold" style={{ color: '#8B5CF6' }}>anti-establishment</span>.&rdquo; He drew a fascinating parallel to court jesters — historically wearing crowns, pardoned for speaking truth to power. The comedian, he argued, is the original <span className="font-extrabold" style={{ color: '#22C55E' }}>content creator</span>.
            </p>
          </div>

          {/* Paragraph 2 — RIGHT image: Prajakta */}
          <div className="mb-8 overflow-hidden">
            <div className="float-right ml-6 mb-4 rotate-2 shadow-[4px_4px_0px_var(--border-color)] border-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-48 h-32 overflow-hidden bg-neutral-200">
                <img src="/images/guests/prajakta.webp" alt="Prajakta Koli" className="w-full h-full object-cover" />
              </div>
              <div className="px-2 py-1.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Prajakta · MostlySane</span>
              </div>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Prajakta was the <span className="font-extrabold" style={{ color: '#3B82F6' }}>consistency</span> argument personified. She was fired from her radio internship in 2015, started making videos with zero strategy, and her first <span className="font-extrabold" style={{ color: '#EC4899' }}>viral</span> hit landed that July. But the real story isn&apos;t the viral moment — it&apos;s the 9+ years of relentless daily output that followed. She&apos;s someone Tanmay described as &ldquo;incredibly hardworking&rdquo; with a purpose &ldquo;intensely strong.&rdquo; Nikhil noted he&apos;d seen her at 5 AM breakfast buffets and 2 AM parties — and the conversation was never dull. She&apos;s worked with Michelle Obama, represented India at Davos, and transitioned into acting — but she defined herself simply and clearly: &ldquo;I&apos;ve never once called myself an <span className="font-extrabold" style={{ color: '#EF4444' }}>influencer</span>.&rdquo;
            </p>
          </div>

          {/* Paragraph 3 — LEFT image: Nas */}
          <div className="mb-8 overflow-hidden">
            <div className="float-left mr-6 mb-4 -rotate-2 shadow-[4px_4px_0px_var(--border-color)] border-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-48 h-32 overflow-hidden bg-neutral-200">
                <img src="/images/guests/nuseir.webp" alt="Nuseir Yassin" className="w-full h-full object-cover" />
              </div>
              <div className="px-2 py-1.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Nas · Nas Daily</span>
              </div>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Nas was the panel&apos;s designated alarm-sounder. He rejected the word &ldquo;<span className="font-extrabold" style={{ color: '#EF4444' }}>influencer</span>&rdquo; most forcefully, argued that creator life has a <span className="font-extrabold" style={{ color: '#8B5CF6' }}>shelf life</span> of about seven years, and declared that every creator must plan an exit — into <span className="font-extrabold" style={{ color: '#FF6B00' }}>entrepreneurship</span>, acting, books, whatever. He mapped out <span className="font-extrabold" style={{ color: '#8B5CF6' }}>platform</span> classism with surgical precision: YouTubers sit at the top, then Instagrammers, then TikTokers, then Facebookers. On cancel culture, he was characteristically direct: &ldquo;You cannot be cancelled. The <span className="font-extrabold" style={{ color: '#8B5CF6' }}>algorithm</span> has no emotions. Right wing, left wing — it doesn&apos;t care.&rdquo; Pushback, he argued, is the most positive sign a creator can receive: &ldquo;You are finally relevant enough to hate.&rdquo;
            </p>
          </div>

          {/* Paragraph 4 — RIGHT image: Ranveer */}
          <div className="mb-8 overflow-hidden">
            <div className="float-right ml-6 mb-4 rotate-3 shadow-[4px_4px_0px_var(--border-color)] border-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-48 h-32 overflow-hidden bg-neutral-200">
                <img src="/images/guests/ranveer.webp" alt="Ranveer Allahbadia" className="w-full h-full object-cover" />
              </div>
              <div className="px-2 py-1.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Ranveer · BeerBiceps</span>
              </div>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Ranveer brought the most <span className="font-extrabold" style={{ color: '#EC4899' }}>vulnerable</span> energy. He openly shared that a devastating phase in engineering college &ldquo;blew all the emotions out of me.&rdquo; He tried <span className="font-extrabold" style={{ color: '#FF6B00' }}>entrepreneurship</span> — building an Uber for fitness coaches — but came back to content because his priorities shifted: &ldquo;I&apos;ve started craving heartfelt messages and impact more than money and growth.&rdquo; He was a fitness trainer before BeerBiceps, and Tanmay was one of his first clients. When asked how he handles being cancelled — something that&apos;s happened repeatedly since COVID — his answer was candid: <span className="font-extrabold" style={{ color: '#3B82F6' }}>quantity</span>. &ldquo;I&apos;m not the smartest, not the most creative Creator, but I can create a huge amount of content.&rdquo; That volume, he argued, is how you absorb feedback, show improvement, and outlast the hate cycle.
            </p>
          </div>

          {/* Paragraph 5 — LEFT image: Nikhil */}
          <div className="mb-8 overflow-hidden">
            <div className="float-left mr-6 mb-4 -rotate-1 shadow-[4px_4px_0px_var(--border-color)] border-2" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-48 h-32 overflow-hidden bg-neutral-200">
                <img src="/images/guests/nikhil.jpg" alt="Nikhil Kamath" className="w-full h-full object-cover" />
              </div>
              <div className="px-2 py-1.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Nikhil · Host</span>
              </div>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Nikhil played a sharper role than a typical host. He probed whether creators truly believe in <span className="font-extrabold" style={{ color: '#22C55E' }}>authenticity</span> or just project a curated version of it. When Tanmay said content creators need the same skills as politicians — &ldquo;effectively mass manipulation&rdquo; — Nikhil connected it to Machiavelli: a prince must project virtue, generosity, and morality, but actually be something else entirely. He compared <span className="font-extrabold" style={{ color: '#22C55E' }}>authenticity</span> to FIFA character attributes — you pick the true ones and project those, but never go to 100% because &ldquo;that gets you into trouble.&rdquo; He also surfaced the identity question: do people associate their vocation with where they make the most money? And pushed on whether being anti-establishment is genuinely who these creators are, or just another <span className="font-extrabold" style={{ color: '#3B82F6' }}>brand</span> strategy that happens to work.
            </p>
          </div>

          {/* Takeaway */}
          <div className="mt-10 p-6 border-l-4" style={{ borderColor: 'var(--color-wtf-orange)', backgroundColor: 'var(--surface)' }}>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-wtf-orange)' }}>The Takeaway</p>
            <p className="text-base leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
              The creator economy isn&apos;t a side hustle — it&apos;s the new media infrastructure, and it comes with a shelf life. <span className="font-extrabold" style={{ color: '#FF6B00' }}>Distribution</span> is the only real moat, <span className="font-extrabold" style={{ color: '#3B82F6' }}>consistency</span> beats <span className="font-extrabold" style={{ color: '#EC4899' }}>virality</span> every time, and <span className="font-extrabold" style={{ color: '#22C55E' }}>authenticity</span> is a spectrum — not a binary switch. The <span className="font-extrabold" style={{ color: '#8B5CF6' }}>algorithm</span> doesn&apos;t care about your feelings; it cares about engagement. Plan your exit, own your identity, and never confuse attention with influence.
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
          <p className="font-medium mb-10" style={{ color: 'var(--text-muted)' }}>Episodes exploring similar themes of building, influence, and the creator mindset.</p>
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
