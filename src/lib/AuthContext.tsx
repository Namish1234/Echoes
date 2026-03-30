'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  deleteUser as firebaseDeleteUser,
  sendEmailVerification,
  updateEmail,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'creator' | 'admin';
  avatarId: string; // Preset avatar ID
  interests: string[]; // Tags selected during onboarding
  frequency: string;
  savedEpisodes: string[]; // Episode IDs
  viewedEpisodes: string[]; // Episode IDs
  onboardingComplete: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  toggleSaveEpisode: (episodeId: string) => Promise<void>;
  markEpisodeViewed: (episodeId: string) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  becomeCreator: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  sendReauthMagicLink: () => Promise<void>;
  updateEmailAddress: (newEmail: string, passwordForReauth?: string) => Promise<void>;
  updateUserDisplayName: (newName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    // 1. Handle Redirect Result from Google Sign In
    getRedirectResult(auth).then((result) => {
      if (result) {
        console.log('[Auth] Google sign-in redirect success:', result.user.email);
      }
    }).catch((error) => {
      console.error('[Auth] Google sign-in redirect error:', error.code, error.message);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // Fetch or create profile from Firestore
          const profileRef = doc(db, 'users', firebaseUser.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            setUserProfile(profileSnap.data() as UserProfile);
          } else {
            // New user — create a minimal profile, onboarding not complete
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Explorer',
              photoURL: firebaseUser.photoURL || '',
              role: 'user',
              avatarId: 'av-01',
              interests: [],
              frequency: '',
              savedEpisodes: [],
              viewedEpisodes: [],
              onboardingComplete: false,
              createdAt: new Date().toISOString(),
            };
            await setDoc(profileRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.error('Firestore error — using local fallback profile:', error);
          // Create a local-only fallback profile so the app still works
          // This handles cases where Firestore isn't provisioned yet
          setUserProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Echoes User',
            photoURL: firebaseUser.photoURL || '',
            role: 'user',
            avatarId: 'av-01',
            interests: [],
            frequency: '',
            savedEpisodes: [],
            viewedEpisodes: [],
            onboardingComplete: false,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    // 2. Handle Magic Link Sign-In / Re-auth intercept
    if (typeof window !== 'undefined' && isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        emailForSignIn = window.prompt('Please confirm your email address to complete verification:');
      }
      
      if (emailForSignIn) {
        signInWithEmailLink(auth, emailForSignIn, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            // Clean up the URL securely
            window.history.replaceState(null, '', window.location.pathname);
            alert('Security verification successful! You may now safely perform account actions.');
          })
          .catch((err) => {
            console.error('Magic link sign in failed:', err);
          });
      }
    }

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('[Auth] Initiating Google Sign-In via popup...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('[Auth] Google sign-in popup success:', result.user?.email);
    } catch (error: any) {
      console.error('[Auth] Google sign-in popup error:', error.code, error.message);
      // Fallback: try redirect (e.g. if popup is blocked by highly restrictive browsers)
      try {
        console.warn('[Auth] Popup failed, trying redirect fallback...');
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectError: any) {
        console.error('[Auth] Redirect fallback also failed:', redirectError.code, redirectError.message);
        throw redirectError;
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await firebaseUpdateProfile(userCredential.user, { displayName: name });
      // Send verification email immediately
      await sendEmailVerification(userCredential.user);
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    // Wrap in timeout — if Firestore hangs (offline/blocked), fail after 10s
    const writePromise = setDoc(profileRef, data, { merge: true });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(
        'Firestore write timed out after 10 seconds. This usually means your network is blocking connections to firestore.googleapis.com. Try: (1) disabling VPN/proxy, (2) using mobile hotspot, or (3) checking browser Network tab for blocked requests.'
      )), 10000)
    );
    await Promise.race([writePromise, timeoutPromise]);
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  const toggleSaveEpisode = async (episodeId: string) => {
    if (!user || !userProfile) return;
    const saved = userProfile.savedEpisodes || [];
    const updated = saved.includes(episodeId)
      ? saved.filter((id) => id !== episodeId)
      : [...saved, episodeId];
    await updateProfile({ savedEpisodes: updated });
  };

  const markEpisodeViewed = async (episodeId: string) => {
    if (!user || !userProfile) return;
    const viewed = userProfile.viewedEpisodes || [];
    if (!viewed.includes(episodeId)) {
      await updateProfile({ viewedEpisodes: [...viewed, episodeId] });
    }
  };
  
  const sendVerificationEmail = async () => {
    if (user) {
      await sendEmailVerification(user);
    }
  };

  const sendReauthMagicLink = async () => {
    if (!user || !user.email) throw new Error("No user email found to send link to.");
    
    const actionCodeSettings = {
      // Direct them exactly back to where they are currently (e.g. /profile)
      url: window.location.href,
      handleCodeInApp: true,
    };
    
    await sendSignInLinkToEmail(auth, user.email, actionCodeSettings);
    // Best practice: store the email so they aren't asked for it when they click the link
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('emailForSignIn', user.email);
    }
  };

  const updateUserDisplayName = async (newName: string) => {
    if (!user) return;
    // 1. Update Auth profile
    await firebaseUpdateProfile(user, { displayName: newName });
    // 2. Update Firestore profile
    await updateProfile({ displayName: newName });
  };

  const updateEmailAddress = async (newEmail: string, passwordForReauth?: string) => {
    if (!user) return;
    
    try {
      await updateEmail(user, newEmail);
      // Wait to update Firestore until AFTER successful re-auth and link generation
      await updateProfile({ email: newEmail });
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com');

        if (isGoogleUser) {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          await reauthenticateWithPopup(user, provider);
        } else if (passwordForReauth) {
          const credential = EmailAuthProvider.credential(user.email!, passwordForReauth);
          await reauthenticateWithCredential(user, credential);
        } else {
          throw error;
        }

        // Try again after proving identity
        await updateEmail(user, newEmail);
        await updateProfile({ email: newEmail });
      } else {
        throw error;
      }
    }
  };

  const deleteUserAccount = async () => {
    if (!user) return;
    try {
      // 1. Delete Firestore data
      const profileRef = doc(db, 'users', user.uid);
      await deleteDoc(profileRef);
      
      // 2. Delete Auth user
      await firebaseDeleteUser(user);
      
      // 3. Clear local state
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  };

  const becomeCreator = async () => {
    if (!user || !userProfile) return;
    if (userProfile.role === 'creator' || userProfile.role === 'admin') return;
    await updateProfile({ role: 'creator' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateProfile,
        toggleSaveEpisode,
        markEpisodeViewed,
        deleteUserAccount,
        sendVerificationEmail,
        sendReauthMagicLink,
        updateEmailAddress,
        updateUserDisplayName,
        becomeCreator,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
