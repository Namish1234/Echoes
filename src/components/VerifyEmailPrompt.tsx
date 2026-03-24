'use client';

import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';

export default function VerifyEmailPrompt() {
  const { user, sendVerificationEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await sendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox and spam folder.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wtf-cream/30 p-6">
      <div className="max-w-md w-full bg-wtf-white zine-border shadow-[12px_12px_0px_#FF6B00] border-4 border-wtf-black p-8 text-center relative">
        <div className="absolute top-0 right-0 w-16 h-16 bg-wtf-black -mt-4 -mr-4 rounded-full flex items-center justify-center border-4 border-wtf-cream z-10">
          <span className="text-3xl text-wtf-orange pt-1">✉️</span>
        </div>
        
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 pr-10 text-left">
          Verify Your <br/> <span className="text-wtf-orange">Email.</span>
        </h1>
        
        <p className="font-bold mb-8 text-left opacity-90 leading-relaxed border-l-4 border-wtf-orange pl-4">
          You need to verify your email address (<span className="text-wtf-black bg-wtf-cream px-1">{user?.email}</span>) before you can access your personalized feed and save episodes.
        </p>

        {message && (
          <div className="mb-6 bg-green-100 text-green-800 p-3 zine-border border-green-600 font-bold text-sm text-left">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 text-red-600 p-3 zine-border border-red-600 font-bold text-sm text-left">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={handleRefresh}
            className="w-full bg-wtf-black text-wtf-white zine-border py-4 font-black uppercase tracking-widest hover:bg-wtf-orange hover:text-wtf-black transition-all shadow-[4px_4px_0px_#000]"
          >
            I've Verified It →
          </button>
          
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity underline disabled:opacity-30"
          >
            {loading ? 'Sending...' : "Didn't get the link? Resend"}
          </button>
        </div>
      </div>
    </div>
  );
}
