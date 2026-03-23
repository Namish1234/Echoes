'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { episodes } from '@/lib/data';
import { presetAvatars } from '@/lib/avatars';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, userProfile, updateProfile, signOut, deleteUserAccount, updateEmailAddress, updateUserDisplayName, sendReauthMagicLink, isLoading } = useAuth();
  const router = useRouter();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(userProfile?.displayName || '');
  const [editEmail, setEditEmail] = useState(userProfile?.email || '');
  const [editPassword, setEditPassword] = useState('');
  const [showReauth, setShowReauth] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-black uppercase tracking-widest animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  const isGoogleAvatar = userProfile.avatarId === 'google' && userProfile.photoURL;
  const avatar = presetAvatars.find((a) => a.id === userProfile.avatarId);
  const avatarSvg = avatar && !isGoogleAvatar
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="${avatar.bgColor}" rx="0"/>${avatar.svgPath}</svg>`
    : '';

  const savedEps = episodes.filter((ep) => userProfile.savedEpisodes?.includes(ep.id));
  const viewedEps = episodes.filter((ep) => userProfile.viewedEpisodes?.includes(ep.id));

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleAvatarChange = async (avatarId: string) => {
    await updateProfile({ avatarId });
    setShowAvatarPicker(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') return;
    setDeleting(true);
    try {
      await deleteUserAccount();
      router.push('/');
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert('Failed to delete account. You may need to log out and log back in to perform this sensitive action.');
      setDeleting(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // 1. Update Name if changed
      if (editName !== userProfile.displayName) {
        await updateUserDisplayName(editName);
      }
      
      // 2. Update Email if changed
      if (editEmail !== userProfile.email) {
        await updateEmailAddress(editEmail, editPassword);
      }
      
      setShowEditModal(false);
      setShowReauth(false);
      setEditPassword('');
      alert('Profile updated successfully!');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setShowReauth(true);
      } else {
        alert(err.message || 'Failed to update profile');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleMagicLink = async () => {
    setSendingLink(true);
    try {
      await sendReauthMagicLink();
      alert(`A secure login link has been sent to ${user?.email}. Please check your inbox and click it to authorize your profile changes.`);
      setShowReauth(false);
      setShowEditModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to send magic link');
    } finally {
      setSendingLink(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <section className="border-b-4 border-wtf-black relative overflow-hidden bg-wtf-cream">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Decorative shapes */}
        <div className="absolute z-0 w-6 h-6 bg-[#3B82F6] border-2 border-wtf-black top-12 right-[20%] rotate-45 hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        <div className="absolute z-0 w-4 h-4 bg-wtf-orange rounded-full border-2 border-wtf-black bottom-16 left-[15%] hidden md:block" />
        <div className="absolute z-0 w-10 h-2 bg-wtf-black top-[45%] left-[10%] rotate-[25deg] hidden md:block" />

        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 zine-border bg-wtf-white shadow-[8px_8px_0px_#000] overflow-hidden">
                {isGoogleAvatar ? (
                  <img src={userProfile.photoURL!} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: avatarSvg }} className="w-full h-full" />
                )}
              </div>
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute -bottom-2 -right-2 zine-border bg-wtf-orange w-10 h-10 flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-all cursor-pointer"
                title="Change avatar"
              >
                ✎
              </button>
            </div>

            <div className="text-center md:text-left">
              <div className="inline-block border-2 border-wtf-black text-wtf-black px-4 py-1 text-xs font-bold mb-4 tracking-widest uppercase bg-wtf-white shadow-[4px_4px_0px_#000]">
                Profile
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
                {userProfile.displayName || 'Explorer'}
              </h1>
              <p className="font-medium opacity-60 text-sm">{userProfile.email || 'No email provided'}</p>
              <p className="font-black text-red-500 uppercase text-[10px] mt-1 tracking-widest px-2 py-0.5 border-2 border-red-500 inline-block bg-white shadow-[2px_2px_0px_#FF0000]">
                Joined {new Date(userProfile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAvatarPicker(false)}>
          <div className="bg-wtf-white zine-border shadow-[12px_12px_0px_#000] p-8 max-w-lg w-full mx-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Change Avatar</h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
              {user?.photoURL && (
                <button
                  key="google-avatar"
                  onClick={() => handleAvatarChange('google')}
                  className={`col-span-2 row-span-2 aspect-square zine-border overflow-hidden transition-all hover:-translate-y-1 cursor-pointer ${
                    userProfile.avatarId === 'google'
                      ? 'shadow-[4px_4px_0px_#FF6B00] ring-2 ring-wtf-orange scale-110 z-10'
                      : 'shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000]'
                  }`}
                  title="Your Google Photo"
                >
                  <img src={user.photoURL} alt="Google Avatar" className="w-full h-full object-cover" />
                </button>
              )}
              {presetAvatars.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleAvatarChange(av.id)}
                  className={`aspect-square zine-border overflow-hidden transition-all hover:-translate-y-1 cursor-pointer ${
                    userProfile.avatarId === av.id
                      ? 'shadow-[4px_4px_0px_#FF6B00] ring-2 ring-wtf-orange scale-110 z-10'
                      : 'shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000]'
                  }`}
                  title={av.name}
                >
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="${av.bgColor}" rx="0"/>${av.svgPath}</svg>`,
                    }}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="mt-6 w-full zine-border bg-wtf-black text-wtf-white py-3 font-bold uppercase tracking-widest hover:bg-wtf-orange hover:text-wtf-black transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="zine-border bg-wtf-white p-6 shadow-[4px_4px_0px_#000] text-center">
            <p className="text-4xl font-black text-wtf-orange">{savedEps.length}</p>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">Saved</p>
          </div>
          <div className="zine-border bg-wtf-white p-6 shadow-[4px_4px_0px_#000] text-center">
            <p className="text-4xl font-black text-wtf-orange">{viewedEps.length}</p>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">Viewed</p>
          </div>
          <div className="zine-border bg-wtf-white p-6 shadow-[4px_4px_0px_#000] text-center">
            <p className="text-4xl font-black text-wtf-orange">{userProfile.interests?.length || 0}</p>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">Interests</p>
          </div>
          <div className="zine-border bg-wtf-white p-6 shadow-[4px_4px_0px_#000] text-center">
            <p className="text-4xl font-black text-wtf-orange">{episodes.length}</p>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">Available</p>
          </div>
        </div>

        {/* Interests */}
        {userProfile.interests && userProfile.interests.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-4 border-wtf-black pb-3">
              Your Interests
            </h2>
            <div className="flex flex-wrap gap-3">
              {userProfile.interests.map((tag) => (
                <span
                  key={tag}
                  className="zine-border px-4 py-2 font-bold text-sm uppercase tracking-widest bg-wtf-white shadow-[2px_2px_0px_#000]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Saved Episodes */}
        <div className="mb-16" id="saved">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-4 border-wtf-black pb-3">
            Saved Episodes
          </h2>
          {savedEps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedEps.map((ep) => (
                <Link
                  key={ep.id}
                  href={`/episode/${ep.id}`}
                  className="zine-border bg-wtf-white p-6 shadow-zine hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all block"
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h4 className="font-black text-lg uppercase tracking-tight leading-tight">{ep.title}</h4>
                    <span className="bg-wtf-orange text-wtf-black text-xs font-bold px-2 py-0.5 shrink-0">EP {ep.number}</span>
                  </div>
                  <p className="text-sm font-bold text-wtf-orange uppercase tracking-widest mb-2">
                    {ep.guest}
                  </p>
                  <p className="text-xs font-bold opacity-60 uppercase tracking-widest">
                    {ep.date} • {ep.duration}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="zine-border bg-wtf-white p-12 text-center shadow-[4px_4px_0px_#000]">
              <span className="text-4xl mb-4 block">☆</span>
              <p className="font-black text-lg uppercase tracking-widest mb-2">No Saved Episodes</p>
              <p className="font-medium opacity-60 text-sm">
                Save episodes from the feed to find them here later.
              </p>
            </div>
          )}
        </div>

        {/* Questionnaire Responses */}
        {userProfile.openResponses && (
          <div className="mb-16">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-4 border-wtf-black pb-3">
              Your Reflections
            </h2>
            <div className="space-y-6">
              {userProfile.openResponses.dreamConversation && (
                <div className="zine-border bg-wtf-white p-6 shadow-[2px_2px_0px_#000]">
                  <p className="font-bold text-sm uppercase tracking-widest text-wtf-orange mb-3">Dream Conversation</p>
                  <p className="font-medium leading-relaxed">{userProfile.openResponses.dreamConversation}</p>
                </div>
              )}
              {userProfile.openResponses.solveOneProblem && (
                <div className="zine-border bg-wtf-white p-6 shadow-[2px_2px_0px_#000]">
                  <p className="font-bold text-sm uppercase tracking-widest text-wtf-orange mb-3">The ₹1 Crore Question</p>
                  <p className="font-medium leading-relaxed">{userProfile.openResponses.solveOneProblem}</p>
                </div>
              )}
              {userProfile.openResponses.fearedOrRespected && (
                <div className="zine-border bg-wtf-white p-6 shadow-[2px_2px_0px_#000]">
                  <p className="font-bold text-sm uppercase tracking-widest text-wtf-orange mb-3">Fear vs. Respect</p>
                  <p className="font-medium leading-relaxed">{userProfile.openResponses.fearedOrRespected}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Actions */}
        <div className="border-t-4 border-wtf-black pt-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Account</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/onboarding?mode=retake"
              className="zine-border bg-wtf-white px-6 py-3 font-bold uppercase tracking-widest text-sm shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-all"
            >
              Retake Questionnaire
            </Link>
            <button
              onClick={() => {
                setEditName(userProfile.displayName || '');
                setEditEmail(userProfile.email || '');
                setShowEditModal(true);
              }}
              className="zine-border bg-wtf-white px-6 py-3 font-bold uppercase tracking-widest text-sm shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Edit Basic Info
            </button>
            <button
              onClick={handleSignOut}
              className="zine-border bg-red-600 text-white px-6 py-3 font-bold uppercase tracking-widest text-sm shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Log Out
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="zine-border bg-red-500 text-white px-6 py-3 font-bold uppercase tracking-widest text-sm shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <div className="bg-wtf-white zine-border shadow-[12px_12px_0px_#FF0000] p-8 max-w-md w-full">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-red-600">Danger Zone</h3>
              <p className="font-bold mb-6 opacity-80 uppercase tracking-tight">
                This action is permanent. All your saved episodes, interests, and profile data will be wiped from the Echoes universe.
              </p>
              
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">
                  Type <span className="text-red-600">DELETE</span> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="w-full zine-border bg-wtf-white p-4 font-black text-xl focus:outline-none focus:shadow-[4px_4px_0px_#FF0000] transition-shadow uppercase"
                  placeholder="DELETE"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== 'DELETE' || deleting}
                  className={`zine-border py-4 font-black uppercase tracking-widest text-lg transition-all ${
                    deleteInput === 'DELETE' && !deleting
                      ? 'bg-red-600 text-white shadow-[4px_4px_0px_#000] cursor-pointer hover:-translate-y-1'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {deleting ? 'Wiping Data...' : 'Permanently Delete'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteInput('');
                  }}
                  className="font-bold uppercase tracking-widest text-sm opacity-60 hover:opacity-100 transition-opacity py-2"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-wtf-white zine-border shadow-[12px_12px_0px_#FF6B00] p-8 max-w-md w-full">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Edit Basic Info</h3>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1 opacity-60">Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full zine-border bg-wtf-cream p-3 focus:outline-none focus:shadow-[4px_4px_0px_#000] transition-shadow"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1 opacity-60">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full zine-border bg-wtf-cream p-3 focus:outline-none focus:shadow-[4px_4px_0px_#000] transition-shadow"
                    required
                  />
                  {editEmail !== userProfile.email && (
                    <p className="text-[10px] font-bold text-wtf-orange mt-2 uppercase tracking-tighter italic">
                      Note: Email change requires verification link delivery.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="zine-border bg-wtf-black text-wtf-white py-3 font-black uppercase tracking-widest hover:bg-wtf-orange hover:text-wtf-black transition-all shadow-[4px_4px_0px_#000] disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setShowReauth(false);
                      setEditPassword('');
                    }}
                    className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Security Re-authentication Modal */}
        {showReauth && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <div className="bg-wtf-white zine-border shadow-[12px_12px_0px_#FF0000] p-8 max-w-md w-full text-center">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-red-600">Security Verification</h3>
              <p className="font-bold mb-6 opacity-80 uppercase tracking-tight text-sm">
                To change your email address, you must confirm your current password or request a security link.
              </p>
              
              <div className="mb-6">
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full zine-border bg-wtf-cream p-4 font-black focus:outline-none focus:shadow-[4px_4px_0px_#FF0000] transition-shadow"
                  placeholder="Enter current password"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleUpdateProfile}
                  disabled={!editPassword || updating}
                  className="zine-border bg-wtf-black text-wtf-white py-4 font-black uppercase tracking-widest hover:bg-wtf-orange hover:text-wtf-black transition-all shadow-[4px_4px_0px_#000] disabled:opacity-50"
                >
                  {updating ? 'Verifying...' : 'Verify Password'}
                </button>
                <div className="flex items-center gap-2 my-2 w-full justify-center opacity-50">
                   <div className="h-px bg-wtf-black w-8"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">OR</span>
                   <div className="h-px bg-wtf-black w-8"></div>
                </div>
                <button
                  onClick={handleMagicLink}
                  disabled={sendingLink}
                  type="button"
                  className="zine-border py-3 border-2 border-wtf-black font-black uppercase tracking-widest text-sm hover:bg-wtf-cream transition-all shadow-[2px_2px_0px_#000]"
                >
                  {sendingLink ? 'Sending Link...' : 'Send Magic Link Instead'}
                </button>
                <button
                  onClick={() => {
                    setShowReauth(false);
                    setEditPassword('');
                  }}
                  className="text-xs font-bold uppercase tracking-widest mt-2 opacity-60 hover:opacity-100 transition-opacity"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
