'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for code splitting — only load the page the user needs
const LandingPage = dynamic(() => import('@/components/LandingPage'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl font-black uppercase tracking-widest animate-pulse">Loading...</div>
    </div>
  ),
});

const FeedPage = dynamic(() => import('@/components/FeedPage'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl font-black uppercase tracking-widest animate-pulse">Loading your feed...</div>
    </div>
  ),
});

export default function HomePage() {
  const { user, userProfile, isLoading } = useAuth();
  const router = useRouter();

  // Redirect new users to onboarding
  useEffect(() => {
    if (!isLoading && user && userProfile && !userProfile.onboardingComplete) {
      router.push('/onboarding');
    }
  }, [user, userProfile, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-black uppercase tracking-widest animate-pulse">
          ECHOES<span className="text-wtf-orange">.</span>
        </div>
      </div>
    );
  }

  // Logged-in user with completed onboarding → show curated feed
  if (user && userProfile?.onboardingComplete) {
    return <FeedPage />;
  }

  // Not logged in → show landing page
  return <LandingPage />;
}
