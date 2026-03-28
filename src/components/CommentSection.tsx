'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { addComment, getComments, deleteComment } from '@/lib/creatorService';
import type { EpisodeComment } from '@/lib/creatorTypes';

interface Props {
  episodeId: string;
  accentColor: string;
}

export default function CommentSection({ episodeId, accentColor }: Props) {
  const { user, userProfile } = useAuth();
  const [comments, setComments] = useState<EpisodeComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComments(episodeId).then(c => { setComments(c); setLoading(false); });
  }, [episodeId]);

  const handlePost = async (parentId?: string) => {
    const content = parentId ? replyText : newComment;
    if (!user || !userProfile || !content.trim()) return;
    
    setPosting(true);
    try {
      const id = await addComment({
        episodeId,
        userId: user.uid,
        userName: userProfile.displayName || 'Anonymous',
        userAvatarId: userProfile.avatarId || 'av-01',
        content: content.trim(),
        replyToId: parentId || undefined
      });
      
      const newC: EpisodeComment = {
        id,
        episodeId,
        userId: user.uid,
        userName: userProfile.displayName || 'Anonymous',
        userAvatarId: userProfile.avatarId || 'av-01',
        content: content.trim(),
        createdAt: new Date().toISOString(),
        replyToId: parentId || undefined
      };
      
      setComments(prev => [newC, ...prev]);
      
      if (parentId) {
        setReplyText('');
        setReplyingTo(null);
      } else {
        setNewComment('');
      }
    } catch (e) {
      console.error('Error posting comment:', e);
    }
    setPosting(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment? Replies will remain.')) return;
    await deleteComment(commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Grouping replies
  const topLevelComments = comments.filter(c => !c.replyToId);
  const getReplies = (parentId: string) => 
    comments.filter(c => c.replyToId === parentId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const CommentInput = ({ isReply, parentId }: { isReply?: boolean, parentId?: string }) => (
    <div className={`zine-border p-4 ${isReply ? 'mt-4' : 'mb-8'}`} style={{ backgroundColor: 'var(--surface)' }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{ backgroundColor: accentColor, color: '#000' }}>
          {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'E'}
        </div>
        <div className="flex-1">
          <textarea
            value={isReply ? replyText : newComment}
            onChange={e => isReply ? setReplyText(e.target.value) : setNewComment(e.target.value)}
            placeholder={isReply ? "Write a reply..." : "Share your thoughts..."}
            rows={isReply ? 2 : 3}
            className="w-full zine-border px-3 py-2 font-medium text-sm outline-none resize-none focus:shadow-[3px_3px_0px_var(--border-color)]"
            style={{ backgroundColor: 'var(--page-bg)', color: 'var(--text-primary)' }}
          />
          <div className="flex justify-end gap-2 mt-2">
            {isReply && (
              <button
                onClick={() => setReplyingTo(null)}
                className="px-4 py-2 font-bold text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => handlePost(parentId)}
              disabled={posting || (isReply ? !replyText.trim() : !newComment.trim())}
              className="zine-border px-5 py-2 font-black uppercase tracking-widest text-xs shadow-[2px_2px_0px_var(--border-color)] hover:-translate-y-0.5 transition-all disabled:opacity-40 cursor-pointer"
              style={{ backgroundColor: accentColor, color: '#000' }}
            >
              {posting ? '...' : (isReply ? 'Reply' : '💬 Post')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CommentThread = ({ comment, depth = 0 }: { comment: EpisodeComment, depth?: number }) => {
    const replies = getReplies(comment.id);
    
    return (
      <div className={`${depth > 0 ? 'ml-6 md:ml-12 mt-4 border-l-4 pl-4' : 'mb-6'}`} style={{ borderColor: depth > 0 ? 'var(--border-subtle)' : 'transparent' }}>
        <div className="zine-border p-4 transition-all hover:shadow-[4px_4px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ backgroundColor: accentColor, color: '#000' }}>
              {comment.userName?.charAt(0)?.toUpperCase() || 'E'}
            </div>
            <div>
              <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>{comment.userName}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest ml-2" style={{ color: 'var(--text-muted)' }}>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
          <p className="text-sm font-medium leading-relaxed mb-4 pl-10" style={{ color: 'var(--text-secondary)' }}>{comment.content}</p>
          
          <div className="flex items-center gap-4 pl-10">
             {user && depth < 3 && ( 
               <button 
                 onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                 className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1"
               >
                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                 Reply
               </button>
             )}
            {user?.uid === comment.userId && (
              <button 
                onClick={() => handleDelete(comment.id)} 
                className="text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 cursor-pointer text-red-500"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {replyingTo === comment.id && (
           <CommentInput isReply parentId={comment.id} />
        )}

        {/* Recursively render replies */}
        {replies.length > 0 && (
          <div className="mt-2">
            {replies.map(reply => (
               <CommentThread key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-8" style={{ color: 'var(--text-primary)' }}>
        Community<span style={{ color: accentColor }}>.</span>
        <span className="text-sm font-bold ml-2" style={{ color: 'var(--text-muted)' }}>({comments.length})</span>
      </h2>

      {user ? (
        <CommentInput />
      ) : (
        <div className="zine-border p-4 mb-8 text-center" style={{ backgroundColor: 'var(--surface)' }}>
          <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>Sign in to leave a comment or reply to this thread.</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="zine-border p-6 animate-pulse" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="h-4 w-32 rounded mb-3" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
              <div className="h-3 w-full rounded" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
            </div>
          ))}
        </div>
      ) : topLevelComments.length === 0 ? (
        <div className="text-center py-12 zine-border border-dashed" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
          <span className="text-4xl mb-3 block opacity-40">💬</span>
          <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>No comments yet. Start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-1">
          {topLevelComments.map(comment => (
            <CommentThread key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
