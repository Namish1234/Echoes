'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendVerificationEmail } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [showVerification, setShowVerification] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        onClose();
      } else {
        await signUpWithEmail(email, password, name);
        setShowVerification(true);
      }
    } catch (err: any) {
      // Friendly error messages mapping
      const code = err.code || '';
      if (code === 'auth/email-already-in-use') setError('Email is already registered. Try logging in.');
      else if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') setError('Invalid email or password.');
      else if (code === 'auth/weak-password') setError('Password should be at least 6 characters.');
      else setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // If using redirect flow, the page navigates away — no need to close.
      // If popup fallback succeeded, close the modal.
      onClose();
    } catch {
      setError('Google sign in failed. Please try again.');
      setLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-wtf-cream/90 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-wtf-white zine-border shadow-[12px_12px_0px_#FF6B00] p-8 relative text-center">
          <div className="text-6xl mb-6">✉️</div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Check Your Inbox</h2>
          <p className="font-bold opacity-80 uppercase tracking-tight mb-8">
            We've sent a verification link to <span className="text-wtf-orange">{email}</span>. 
            Please verify your email to secure your profile.
          </p>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={onClose}
              className="w-full bg-wtf-black text-wtf-white zine-border py-4 font-black uppercase tracking-widest hover:bg-wtf-orange hover:text-wtf-black transition-all shadow-[4px_4px_0px_#000]"
            >
              Continue to Feed →
            </button>
            <button 
              onClick={async () => {
                setError('');
                try { await sendVerificationEmail(); alert('Verification email resent!'); }
                catch { setError('Failed to resend. Try again later.'); }
              }}
              className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity underline"
            >
              Didn't get the link? Resend
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-wtf-cream/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-wtf-white zine-border shadow-[8px_8px_0px_#000] p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-black hover:text-wtf-orange transition-colors"
        >
          ×
        </button>

        <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">
          {mode === 'login' ? 'Welcome Back' : 'Join Echoes'}
        </h2>

        {error && (
          <div className="mb-4 bg-red-100 text-red-600 p-3 zine-border text-sm font-bold border-red-600 shadow-[2px_2px_0px_#dc2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-wtf-cream zine-border p-3 focus:outline-none focus:shadow-[4px_4px_0px_#FF6B00] transition-shadow"
                placeholder="What should we call you?"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-wtf-cream zine-border p-3 focus:outline-none focus:shadow-[4px_4px_0px_#FF6B00] transition-shadow"
              placeholder="you@email.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-wtf-cream zine-border p-3 focus:outline-none focus:shadow-[4px_4px_0px_#FF6B00] transition-shadow"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-wtf-black text-wtf-white zine-border py-3 font-bold uppercase tracking-widest mt-2 hover:-translate-y-0.5 shadow-[4px_4px_0px_#FF6B00] transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 opacity-50">
          <div className="flex-1 border-b-2 border-wtf-black"></div>
          <span className="text-xs font-bold uppercase tracking-widest">OR</span>
          <div className="flex-1 border-b-2 border-wtf-black"></div>
        </div>

        <button 
          onClick={handleGoogle}
          className="w-full bg-wtf-white text-wtf-black zine-border py-3 font-bold uppercase tracking-widest hover:bg-wtf-orange hover:-translate-y-0.5 shadow-[4px_4px_0px_#000] transition-all flex justify-center items-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center text-sm font-medium">
          {mode === 'login' ? (
            <p>
              New here?{' '}
              <button onClick={() => setMode('signup')} className="font-bold underline text-wtf-orange hover:text-wtf-black">
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="font-bold underline text-wtf-orange hover:text-wtf-black">
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
