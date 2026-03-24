'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import VerifyEmailPrompt from '@/components/VerifyEmailPrompt';

// Dynamic imports for code splitting
const LandingPage = dynamic(() => import('@/components/LandingPage'), {
  loading: () => null,
});

const FeedPage = dynamic(() => import('@/components/FeedPage'), {
  loading: () => null,
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
    return <div className="min-h-screen" />; // Prevents the sidebar/footer from shrinking while loading
  }

  // Logged-in user with completed onboarding → show curated feed
  if (user && userProfile?.onboardingComplete) {
    if (!user.emailVerified) {
      return <VerifyEmailPrompt />;
    }
    return <FeedPage />;
  }

  // Not logged in → show landing page
  return <LandingPage />;
}
