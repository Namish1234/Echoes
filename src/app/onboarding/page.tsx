'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { presetAvatars } from '@/lib/avatars';

const INTEREST_OPTIONS = [
  'Tech & AI',
  'Startups & VC',
  'Business & Economics',
  'Health & Mind',
  'Society & Governance',
  'Creators & Media',
  'Science',
  'Leadership',
  'Philosophy',
  'Geopolitics',
];

const FREQUENCY_OPTIONS = [
  'Daily — I consume long-form content obsessively',
  'Few times a week — Regular listener',
  'Weekly — I pick my episodes carefully',
  'Monthly — When something really catches my eye',
  'Rarely — I\'m just starting to explore',
];

const DISCOVERY_OPTIONS = [
  'Social Media (Twitter/X, Instagram)',
  'YouTube',
  'A friend recommended Echoes',
  'Google Search',
  'Podcast platforms (Spotify, Apple)',
  'Other',
];

const LENGTH_OPTIONS = [
  'Under 1 hour — Quick and focused',
  '1–2 hours — The sweet spot',
  '2+ hours — I want the full deep dive',
  'No preference — Content quality matters more',
];

const CONTENT_ROLE_OPTIONS = [
  'Essential for my growth — I learn actively from it',
  'Nice to have — Background enrichment',
  'I prefer short-form — But I\'m open to trying',
  'Still exploring — This is new territory for me',
];

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest opacity-60">
          Step {current} of {total}
        </span>
        <span className="text-xs font-bold uppercase tracking-widest opacity-60">
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div className="w-full h-3 bg-wtf-white border-3 border-wtf-black zine-border overflow-hidden">
        <div
          className="h-full bg-wtf-orange transition-all duration-500 ease-out"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function NavButtons({ onNext, onBack, isFirst, isLast }: { onNext: () => void; onBack: () => void; isFirst: boolean; isLast: boolean }) {
  return (
    <div className="flex justify-between items-center mt-12 w-full max-w-2xl mx-auto">
      {!isFirst ? (
        <button
          onClick={onBack}
          className="zine-border bg-wtf-white px-6 py-3 font-bold uppercase tracking-widest text-sm shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          ← Back
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        className="zine-border bg-wtf-orange px-8 py-3 font-bold uppercase tracking-widest text-sm text-wtf-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:bg-wtf-black hover:text-wtf-white transition-all cursor-pointer"
      >
        {isLast ? 'Complete Setup →' : 'Continue →'}
      </button>
    </div>
  );
}

function OnboardingForm() {
  const { user, userProfile, updateProfile, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRetake = searchParams.get('mode') === 'retake';
  const [step, setStep] = useState(1);
  const totalSteps = 11;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [interests, setInterests] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('');
  const [discovery, setDiscovery] = useState('');
  const [preferredLength, setPreferredLength] = useState('');
  const [dreamConversation, setDreamConversation] = useState('');
  const [solveOneProblem, setSolveOneProblem] = useState('');
  const [fearedOrRespected, setFearedOrRespected] = useState('');
  const [contentRole, setContentRole] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.avatarId || 'av-01');

  // Sync profile data when loaded
  useEffect(() => {
    if (userProfile) {
      if (userProfile.displayName && !displayName) setDisplayName(userProfile.displayName);
      if (userProfile.avatarId && selectedAvatar === 'av-01') setSelectedAvatar(userProfile.avatarId);
    }
  }, [userProfile]);

  // Hide navbar and footer for full-screen immersive experience
  useEffect(() => {
    document.body.classList.add('onboarding-mode');
    return () => {
      document.body.classList.remove('onboarding-mode');
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
    if (!isLoading && user && !user.emailVerified) {
      router.push('/');
    }
    if (!isLoading && userProfile?.onboardingComplete && !isRetake) {
      router.push('/');
    }
  }, [user, userProfile, isLoading, router, isRetake]);

  const handleComplete = async () => {
    setSaving(true);
    setError('');
    try {
      await updateProfile({
        displayName,
        email: userProfile?.email || user?.email || '',
        interests,
        frequency,
        discoverySource: discovery,
        preferredLength,
        contentRole,
        avatarId: selectedAvatar,
        openResponses: {
          dreamConversation,
          solveOneProblem,
          fearedOrRespected,
        },
        onboardingComplete: true,
      });
      router.push('/');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save your profile. Please check your network connection and try again.');
      setSaving(false);
    }
  };

  const goNext = () => {
    if (step === totalSteps) {
      handleComplete();
    } else {
      setStep((s) => Math.min(s + 1, totalSteps));
    }
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-wtf-cream">
        <div className="text-2xl font-black uppercase tracking-widest animate-pulse">Loading...</div>
      </div>
    );
  }

  const toggleInterest = (tag: string) => {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-wtf-cream overflow-auto">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Decorative shapes */}
      <div className="absolute z-0 w-6 h-6 bg-wtf-orange rounded-full border-2 border-wtf-black top-20 left-[10%] hidden md:block" />
      <div
        className="absolute z-0 w-5 h-5 bg-[#3B82F6] border-2 border-wtf-black bottom-32 right-[15%] rotate-45 hidden md:block"
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
      />
      <div className="absolute z-0 w-10 h-2 bg-wtf-black top-[40%] right-[10%] rotate-[15deg] hidden md:block" />
      <div className="absolute z-0 w-4 h-4 bg-[#22C55E] border-2 border-wtf-black rounded-full bottom-[20%] left-[8%] hidden md:block" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Error banner */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 zine-border bg-red-500 text-white p-4 font-bold text-sm shadow-[4px_4px_0px_#000]">
            ⚠ {error}
          </div>
        )}

        {/* Saving overlay */}
        {saving && (
          <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center">
            <div className="zine-border bg-wtf-white px-12 py-8 shadow-[8px_8px_0px_#000] text-center">
              <div className="text-3xl mb-4 animate-pulse">✦</div>
              <p className="font-black text-xl uppercase tracking-widest">Saving Profile...</p>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block border-2 border-wtf-black text-wtf-black px-4 py-1 text-xs font-bold mb-6 tracking-widest uppercase bg-wtf-white shadow-[4px_4px_0px_#000]">
            Welcome to Echoes
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Let&apos;s Build<br />
            <span className="text-wtf-orange">Your Profile</span>
          </h1>
          <p className="text-lg font-medium opacity-70 max-w-xl mx-auto">
            Answer a few questions so we can curate a feed that matches your intellectual appetite.
          </p>
        </div>

        <ProgressBar current={step} total={totalSteps} />

        {/* Step content */}
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Display Name */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                What should we call you?
              </h2>
              <p className="font-medium opacity-60 mb-8 text-sm">
                This is how you will appear in the Echoes platform.
              </p>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name or Alias"
                className="w-full zine-border bg-wtf-white p-6 font-bold text-xl focus:outline-none focus:shadow-[4px_4px_0px_#FF6B00] transition-shadow placeholder:opacity-40"
              />
            </div>
          )}

          {/* Step 2: What draws you to podcasts */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                What draws you to podcasts?
              </h2>
              <p className="font-medium opacity-60 mb-8 text-sm">Select all that apply.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Learning new frameworks', 'Entertainment & storytelling', 'Inspiration from builders', 'Background enrichment', 'Deep philosophical thinking'].map(
                  (opt) => (
                    <button
                      key={opt}
                      onClick={() => toggleInterest(opt)}
                      className={`zine-border p-4 font-bold uppercase text-sm tracking-widest text-left transition-all hover:-translate-y-0.5 cursor-pointer ${
                        interests.includes(opt)
                          ? 'bg-wtf-orange text-wtf-black shadow-[4px_4px_0px_#000]'
                          : 'bg-wtf-white shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000]'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Step 3: Which domains fascinate you most */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                Which domains fascinate you most?
              </h2>
              <p className="font-medium opacity-60 mb-8 text-sm">Select as many as you like. This shapes your curated feed.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {INTEREST_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className={`zine-border p-4 font-bold uppercase text-xs tracking-widest text-center transition-all hover:-translate-y-0.5 cursor-pointer ${
                      interests.includes(tag)
                        ? 'bg-wtf-orange text-wtf-black shadow-[4px_4px_0px_#000]'
                        : 'bg-wtf-white shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Podcast frequency */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                How often do you listen to podcasts?
              </h2>
              <p className="font-medium opacity-60 mb-8 text-sm">This helps us tune recommendation frequency.</p>
              <div className="flex flex-col gap-3">
                {FREQUENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFrequency(opt)}
                    className={`zine-border p-4 font-bold text-sm tracking-wide text-left transition-all hover:-translate-y-0.5 cursor-pointer ${
                      frequency === opt
                        ? 'bg-wtf-orange text-wtf-black shadow-[4px_4px_0px_#000]'
                        : 'bg-wtf-white shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: How did you discover Echoes */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                How did you discover Echoes?
              </h2>
              <p className="font-medium opacity-60 mb-8 text-sm">We&apos;re curious. No wrong answers.</p>
              <div className="flex flex-col gap-3">
                {DISCOVERY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDiscovery(opt)}
                    className={`zine-border p-4 font-bold text-sm tracking-wide text-left transition-all hover:-translate-y-0.5 cursor-pointer ${
                      discovery === opt
                        ? 'bg-wtf-orange text-wtf-black shadow-[4px_4px_0px_#000]'
                        : 'bg-wtf-white shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Preferred episode length */}
          {step === 6 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                What&apos;s your preferred episode length?
              </h2>
              <p className="font-medium opacity-60 mb-8 text-sm">We&apos;ll prioritize episodes that match your attention style.</p>
              <div className="flex flex-col gap-3">
                {LENGTH_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPreferredLength(opt)}
                    className={`zine-border p-4 font-bold text-sm tracking-wide text-left transition-all hover:-translate-y-0.5 cursor-pointer ${
                      preferredLength === opt
                        ? 'bg-wtf-orange text-wtf-black shadow-[4px_4px_0px_#000]'
                        : 'bg-wtf-white shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Philosophical — Dream conversation */}
          {step === 7 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                The Dream Conversation
              </h2>
              <p className="font-medium opacity-60 mb-2 text-sm italic">A philosophical question.</p>
              <p className="font-bold text-lg mb-8">
                &ldquo;If you could sit across from one person, living or dead, for an hour — who would it be and why?&rdquo;
              </p>
              <textarea
                value={dreamConversation}
                onChange={(e) => setDreamConversation(e.target.value)}
                placeholder="Your answer... (optional)"
                className="w-full zine-border bg-wtf-white p-6 font-medium text-base resize-none h-40 focus:outline-none focus:shadow-[4px_4px_0px_#FF6B00] transition-shadow placeholder:opacity-40"
              />
            </div>
          )}

          {/* Step 8: Situational — Solve one problem */}
          {step === 8 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                The ₹1 Crore Question
              </h2>
              <p className="font-medium opacity-60 mb-2 text-sm italic">A situational question.</p>
              <p className="font-bold text-lg mb-8">
                &ldquo;You&apos;re given ₹1 crore but must use it to solve one problem in India. What do you tackle?&rdquo;
              </p>
              <textarea
                value={solveOneProblem}
                onChange={(e) => setSolveOneProblem(e.target.value)}
                placeholder="Your answer... (optional)"
                className="w-full zine-border bg-wtf-white p-6 font-medium text-base resize-none h-40 focus:outline-none focus:shadow-[4px_4px_0px_#FF6B00] transition-shadow placeholder:opacity-40"
              />
            </div>
          )}

          {/* Step 9: Rhetorical — Feared or Respected */}
          {step === 9 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                Fear vs. Respect
              </h2>
              <p className="font-medium opacity-60 mb-2 text-sm italic">A rhetorical question.</p>
              <p className="font-bold text-lg mb-8">
                &ldquo;Is it better to be feared or respected? Why?&rdquo;
              </p>
              <textarea
                value={fearedOrRespected}
                onChange={(e) => setFearedOrRespected(e.target.value)}
                placeholder="Your answer... (optional)"
                className="w-full zine-border bg-wtf-white p-6 font-medium text-base resize-none h-40 focus:outline-none focus:shadow-[4px_4px_0px_#FF6B00] transition-shadow placeholder:opacity-40"
              />
            </div>
          )}

          {/* Step 10: Content role */}
          {step === 10 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                What role does long-form content play in your life?
              </h2>
              <p className="font-medium opacity-60 mb-8 text-sm">Be honest — there are no wrong answers.</p>
              <div className="flex flex-col gap-3">
                {CONTENT_ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setContentRole(opt)}
                    className={`zine-border p-4 font-bold text-sm tracking-wide text-left transition-all hover:-translate-y-0.5 cursor-pointer ${
                      contentRole === opt
                        ? 'bg-wtf-orange text-wtf-black shadow-[4px_4px_0px_#000]'
                        : 'bg-wtf-white shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 11: Avatar selection */}
          {step === 11 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                Choose Your Identity
              </h2>
              <p className="font-medium opacity-60 mb-8 text-sm">
                Pick an avatar that represents you in the Echoes universe.
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                {user?.photoURL && (
                  <button
                    key="google-avatar"
                    onClick={() => setSelectedAvatar('google')}
                    className={`col-span-2 row-span-2 aspect-square zine-border overflow-hidden transition-all hover:-translate-y-1 cursor-pointer ${
                      selectedAvatar === 'google'
                        ? 'shadow-[4px_4px_0px_#FF6B00] ring-2 ring-wtf-orange scale-110 z-10'
                        : 'shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000]'
                    }`}
                    title="Your Google Photo"
                  >
                    <img src={user.photoURL} alt="Google Avatar" className="w-full h-full object-cover" />
                  </button>
                )}
                {presetAvatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`aspect-square zine-border overflow-hidden transition-all hover:-translate-y-1 cursor-pointer ${
                      selectedAvatar === avatar.id
                        ? 'shadow-[4px_4px_0px_#FF6B00] ring-2 ring-wtf-orange scale-110 z-10'
                        : 'shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000]'
                    }`}
                    title={avatar.name}
                  >
                    <div
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{
                        __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="${avatar.bgColor}" rx="0"/>${avatar.svgPath}</svg>`,
                      }}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest">
                  Selected: <span className="text-wtf-orange">{selectedAvatar === 'google' ? 'Your Google Photo' : presetAvatars.find(a => a.id === selectedAvatar)?.name}</span>
                </p>
              </div>
            </div>
          )}

          <NavButtons
            onNext={goNext}
            onBack={goBack}
            isFirst={step === 1}
            isLast={step === totalSteps}
          />
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-wtf-cream">
        <div className="text-2xl font-black uppercase tracking-widest animate-pulse">Initializing...</div>
      </div>
    }>
      <OnboardingForm />
    </Suspense>
  );
}
