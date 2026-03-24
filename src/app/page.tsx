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
      // Only redirect if VERIFIED (Google users are automatically verified)
      if (user.emailVerified) {
        router.push('/onboarding');
      }
    }
  }, [user, userProfile, isLoading, router]);

  if (isLoading) {
    return <div className="min-h-screen" />; // Prevents the sidebar/footer from shrinking while loading
  }

  if (user) {
    if (!user.emailVerified) {
      return <VerifyEmailPrompt />;
    }
    if (userProfile?.onboardingComplete) {
      return <FeedPage />;
    }
    // If they are verified but haven't completed onboarding, the useEffect will redirect them.
    // Just show a blank screen while redirecting to avoid flashing the LandingPage.
    return <div className="min-h-screen" />; 
  }

  // Not logged in → show landing page
  return <LandingPage />;
}
