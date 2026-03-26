'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { episodes } from '@/lib/data';

interface TranscriptLine {
  speaker: string;
  timestamp: string;
  content: string;
}

interface SavedLine {
  index: number;
  text: string;
  speaker: string;
  comment: string;
}

export default function TranscriptPage() {
  const episode = episodes.find(ep => ep.id === 'ep-15');
  const fallbackTranscript = episode?.parsedTranscript || [];

  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>(fallbackTranscript);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/transcripts/AdI_XWv-ZTk.json')
      .then(res => res.json())
      .then(data => {
        if (data.transcript && data.transcript.length > 0) {
          setTranscriptLines(data.transcript);
        }
      })
      .catch(() => {
        // Keep fallback data from data.ts
      })
      .finally(() => setIsLoading(false));
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [savedLines, setSavedLines] = useState<SavedLine[]>([]);
  const [activeCommentIndex, setActiveCommentIndex] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');

  const filteredLines = useMemo(() => {
    if (!searchQuery.trim()) return transcriptLines;
    return transcriptLines.filter(
      line => 
        line.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        line.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, transcriptLines]);

  const handleSaveLine = (index: number, line: typeof transcriptLines[0]) => {
    const existing = savedLines.find(s => s.index === index);
    if (existing) {
      // Already saved — open comment editor
      setActiveCommentIndex(index);
      setCommentText(existing.comment);
    } else {
      // Quick save directly to profile with no note required
      setSavedLines([...savedLines, { index, text: line.content, speaker: line.speaker, comment: '' }]);
    }
  };

  const submitComment = (index: number, line: typeof transcriptLines[0]) => {
    const existing = savedLines.find(s => s.index === index);
    if (existing) {
      setSavedLines(savedLines.map(s => s.index === index ? { ...s, comment: commentText } : s));
    } else {
      setSavedLines([...savedLines, { index, text: line.content, speaker: line.speaker, comment: commentText }]);
    }
    setActiveCommentIndex(null);
    setCommentText('');
  };

  const removeSave = (index: number) => {
    setSavedLines(savedLines.filter(s => s.index !== index));
    setActiveCommentIndex(null);
  };

  if (!episode) return <div style={{ color: 'var(--text-primary)', padding: '3rem' }}>Episode not found</div>;

  return (
    <div className="w-full min-h-screen pb-24 font-sans">
      {/* HEADER */}
      <header className="w-full max-w-5xl mx-auto px-6 pt-10 pb-6 sticky top-0 z-30 backdrop-blur-md border-b-4 flex flex-col md:flex-row md:items-end justify-between gap-6"
              style={{ backgroundColor: 'color-mix(in srgb, var(--page-bg) 90%, transparent)', borderColor: 'var(--border-color)' }}>
        <div>
          <div className="mb-4">
            <Link 
              href="/episode/ep-15" 
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all"
              style={{ color: 'var(--text-primary)' }}
            >
              ← Back to Episode
            </Link>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>Interactive Transcript</h1>
          <p className="font-bold mt-2 uppercase tracking-widest text-sm" style={{ color: 'var(--text-muted)' }}>
            {episode.title}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 md:w-72 shrink-0">
          <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Search Transcript</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter by keyword or speaker..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full zine-border px-4 py-2 font-bold outline-none focus:ring-2 text-sm"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderRadius: '0' }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 opacity-40 hover:opacity-100"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" style={{ color: 'var(--text-primary)' }}><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* TRANSCRIPT LIST */}
        <div className="flex-1 flex flex-col gap-4 text-base leading-relaxed font-medium">
          {filteredLines.length > 0 ? (
            filteredLines.map((line) => {
              const originalIndex = transcriptLines.findIndex(l => l.content === line.content && l.speaker === line.speaker);
              const isSaved = savedLines.some(s => s.index === originalIndex);
              const isCommenting = activeCommentIndex === originalIndex;
              const savedData = savedLines.find(s => s.index === originalIndex);
              
              return (
                <div 
                  key={originalIndex} 
                  className="flex flex-col md:flex-row gap-4 md:gap-8 relative group p-4 -mx-4 transition-colors border-l-4"
                  style={{ 
                    borderColor: isSaved ? 'var(--color-wtf-orange)' : 'transparent',
                    backgroundColor: isSaved ? 'rgba(255,107,0,0.05)' : 'transparent',
                    borderRadius: '0'
                  }}
                  onMouseEnter={(e) => { if (!isSaved) e.currentTarget.style.backgroundColor = 'var(--surface)'; e.currentTarget.style.borderColor = isSaved ? 'var(--color-wtf-orange)' : 'var(--border-subtle)'; }}
                  onMouseLeave={(e) => { if (!isSaved) e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = isSaved ? 'var(--color-wtf-orange)' : 'transparent'; }}
                >
                  {/* Speaker */}
                  <div className="md:w-[150px] shrink-0 pt-1 flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
                    <span className="font-black uppercase tracking-widest text-xs px-2 py-1 inline-block leading-none"
                          style={{ color: 'var(--color-wtf-orange)', backgroundColor: 'rgba(255,107,0,0.1)' }}>
                      {line.speaker}
                    </span>
                    <span className="text-[10px] font-bold opacity-40 font-mono" style={{ color: 'var(--text-muted)' }}>
                      {line.timestamp || '00:00'}
                    </span>
                    
                    {/* Action buttons */}
                    <div className="md:mt-4 flex gap-2">
                      <button 
                        onClick={() => handleSaveLine(originalIndex, line)}
                        className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: isSaved ? 'var(--color-wtf-orange)' : 'var(--text-muted)' }}
                      >
                         {isSaved ? (
                           <><svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Saved</>
                         ) : (
                           <><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Save</>
                         )}
                      </button>
                      {isSaved && !isCommenting && (
                        <button 
                          onClick={() => { setActiveCommentIndex(originalIndex); setCommentText(savedData?.comment || ''); }}
                          className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          Note
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Dialogue */}
                  <div className="flex-1">
                    <p style={{ color: 'var(--text-primary)', fontWeight: isSaved ? 700 : 500 }}>
                      {line.content}
                    </p>
                    
                    {/* Comment UI */}
                    {isCommenting && (
                      <div className="mt-4 p-4 border-2" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border-color)' }}>
                        <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--text-muted)' }}>Add a personal note (optional)</label>
                        <textarea 
                          className="w-full text-sm font-medium p-3 zine-border outline-none focus:ring-2 focus:ring-[#FF6B00] mb-3 resize-none h-20"
                          placeholder="Why did this resonate with you? (leave empty to save without a note)"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          autoFocus
                          style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderRadius: '0' }}
                        />
                        <div className="flex gap-3 justify-end">
                          {isSaved && (
                            <button 
                              onClick={() => removeSave(originalIndex)}
                              className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 px-3 py-2"
                            >
                              Remove
                            </button>
                          )}
                          <button 
                            onClick={() => { setActiveCommentIndex(null); setCommentText(''); }}
                            className="text-xs font-bold uppercase tracking-widest px-3 py-2"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => submitComment(originalIndex, line)}
                            className="text-xs font-bold uppercase tracking-widest px-4 py-2 shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 transition-transform"
                            style={{ backgroundColor: 'var(--text-primary)', color: 'var(--page-bg)' }}
                          >
                            {commentText.trim() ? 'Save with Note' : 'Save Highlight'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Display existing comment */}
                    {!isCommenting && isSaved && savedData?.comment && (
                      <div className="mt-3 p-3 border-l-4 relative group/note" 
                           style={{ borderColor: 'var(--color-wtf-orange)', backgroundColor: 'var(--surface-alt)' }}>
                        <p className="text-sm font-serif italic" style={{ color: 'var(--text-secondary)' }}>&ldquo;{savedData.comment}&rdquo;</p>
                        <button 
                          onClick={() => { setActiveCommentIndex(originalIndex); setCommentText(savedData.comment); }}
                          className="absolute top-2 right-2 opacity-0 group-hover/note:opacity-100 text-xs font-bold uppercase tracking-widest transition-opacity p-1 border"
                          style={{ color: 'var(--color-wtf-orange)', backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              No results found for &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>

        {/* SAVED HIGHLIGHTS SIDEBAR (Desktop only) */}
        <div className="hidden lg:block w-80 shrink-0 border-l-4 pl-8 relative" style={{ borderColor: 'var(--border-color)' }}>
          <div className="sticky top-40 p-6 border-2 shadow-[4px_4px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--cream-bg)', borderColor: 'var(--border-color)' }}>
            <h3 className="font-black text-xl uppercase tracking-tighter mb-4 border-b-2 pb-2 flex justify-between items-end" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
              Your Notes
              <span className="text-xs px-2 py-0.5" style={{ backgroundColor: 'var(--color-wtf-orange)', color: '#000' }}>{savedLines.length}</span>
            </h3>

            {savedLines.length === 0 ? (
              <p className="text-sm font-medium italic" style={{ color: 'var(--text-muted)' }}>Hover over transcript lines and click save to start building your personal notes.</p>
            ) : (
              <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {savedLines.map(save => (
                  <div key={save.index} className="p-3 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-wtf-orange)' }}>{save.speaker}</p>
                    <p className="text-xs font-medium line-clamp-3 mb-2 italic" style={{ color: 'var(--text-muted)' }}>&ldquo;{save.text}&rdquo;</p>
                    {save.comment && <p className="text-sm font-bold border-t pt-2 line-clamp-2" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>{save.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>

    </div>
  );
}
