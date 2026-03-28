'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function BecomeCreatorPage() {
  const { user, userProfile, becomeCreator, isLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Already a creator? Redirect
  useEffect(() => {
    if (userProfile?.role === 'creator' || userProfile?.role === 'admin') {
      router.push('/creator/dashboard');
    }
  }, [userProfile, router]);

  if (userProfile?.role === 'creator' || userProfile?.role === 'admin') {
    return null;
  }

  const handleBecome = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    if (!user.emailVerified) {
      alert('Please verify your email address before becoming a creator.');
      return;
    }
    setIsProcessing(true);
    try {
      await becomeCreator();
      router.push('/creator/dashboard');
    } catch (e) {
      console.error('Error becoming creator:', e);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-bold uppercase tracking-widest animate-pulse" style={{ color: 'var(--text-primary)' }}>Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block" aria-hidden>
        <div className="absolute top-[10%] left-[5%] w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[32px] opacity-[0.12] rotate-[15deg]" style={{ borderBottomColor: '#FF6B00' }}></div>
        <div className="absolute top-[30%] right-[4%] w-8 h-8 border-[3px] opacity-[0.12] rotate-[20deg]" style={{ borderColor: '#3B82F6' }}></div>
        <div className="absolute top-[50%] left-[3%] w-7 h-7 rounded-full border-[3px] opacity-[0.14]" style={{ borderColor: '#22C55E' }}></div>
        <div className="absolute top-[70%] right-[6%] w-12 h-4 opacity-[0.1] -rotate-[12deg]" style={{ backgroundColor: '#8B5CF6' }}></div>
        <div className="absolute top-[85%] left-[8%] w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[22px] opacity-[0.1] rotate-[40deg]" style={{ borderBottomColor: '#EC4899' }}></div>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 md:pt-28 pb-12 relative z-10">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all" style={{ color: 'var(--text-primary)' }}>
            ← Back to Echoes
          </Link>
        </div>

        <div className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase mb-6" style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}>
          Creator Program
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8" style={{ color: 'var(--text-primary)' }}>
          Your Voice.<br/>
          <span style={{ color: 'var(--color-wtf-orange)' }}>Your Podcast.</span><br/>
          Your Stage.
        </h1>

        <p className="text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-12" style={{ color: 'var(--text-secondary)' }}>
          Join Echoes as a creator and build your own podcast empire. Design episodes with our drag-and-drop editor, choose your color palette, and reach an audience that craves deep, meaningful content.
        </p>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🎨',
              title: 'Design Freedom',
              desc: 'Choose your color palette, add polaroid galleries, mind maps, and more. Your podcast, your aesthetic.',
              color: '#FF6B00',
            },
            {
              icon: '🧩',
              title: 'Drag & Drop',
              desc: 'Build episode pages by dragging content blocks — summaries, key lessons, quotes, images. No code needed.',
              color: '#3B82F6',
            },
            {
              icon: '📊',
              title: 'Your Dashboard',
              desc: 'Track views, scroll depth, and engagement. See what resonates with your audience in real time.',
              color: '#22C55E',
            },
            {
              icon: '🗺️',
              title: 'Interactive Mind Maps',
              desc: 'Build FigJam-style mind maps for each episode. Visualize connections between ideas.',
              color: '#8B5CF6',
            },
            {
              icon: '💬',
              title: 'Comments',
              desc: 'Engage with your audience through episode comments. Build community around your content.',
              color: '#EC4899',
            },
            {
              icon: '🖼️',
              title: 'Polaroid Gallery',
              desc: 'Upload guest photos and we convert them into beautiful vintage polaroid frames automatically.',
              color: '#EAB308',
            },
          ].map((feat, i) => (
            <div key={i} className="zine-border p-6 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.06]" style={{ backgroundColor: feat.color, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              <span className="text-3xl mb-3 block">{feat.icon}</span>
              <h3 className="font-black text-xl uppercase tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>{feat.title}</h3>
              <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t-4 relative" style={{ backgroundColor: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6" style={{ color: 'var(--page-bg)' }}>
            Ready to <span style={{ color: 'var(--color-wtf-orange)' }}>Create</span>?
          </h2>
          <p className="text-lg font-medium mb-10 opacity-80" style={{ color: 'var(--page-bg)' }}>
            It takes 10 seconds. Sign up (or sign in), and you&apos;re a creator.
          </p>

          {showAuthPrompt ? (
            <div className="zine-border p-6 inline-block" style={{ backgroundColor: 'var(--page-bg)' }}>
              <p className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>You need to sign in first!</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all"
                style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}
              >
                Go Sign In →
              </Link>
            </div>
          ) : (
            <button
              onClick={handleBecome}
              disabled={isProcessing}
              className="inline-flex items-center gap-3 px-10 py-5 font-black uppercase tracking-widest text-lg border-3 shadow-[6px_6px_0px_rgba(255,255,255,0.3)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(255,255,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000', borderColor: 'var(--page-bg)' }}
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin">⚙️</span> Setting up...
                </>
              ) : (
                <>🚀 Start Creating</>
              )}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
