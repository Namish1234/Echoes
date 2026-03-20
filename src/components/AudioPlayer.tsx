'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { TranscriptLine } from '@/lib/data';

interface AudioPlayerProps {
  audioSrc: string;
  transcript: TranscriptLine[];
}

// Convert "MM:SS" timestamp to seconds
const timestampToSeconds = (ts: string): number => {
  const parts = ts.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
};

export default function AudioPlayer({ audioSrc, transcript }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [hasAudio, setHasAudio] = useState(true);

  // Determine which transcript line is active based on current playback time
  useEffect(() => {
    if (!transcript.length) return;
    let active = -1;
    for (let i = 0; i < transcript.length; i++) {
      const lineTime = timestampToSeconds(transcript[i].timestamp);
      if (currentTime >= lineTime) {
        active = i;
      } else {
        break;
      }
    }
    if (active !== activeLineIndex) {
      setActiveLineIndex(active);
      // Auto-scroll to active line
      if (active >= 0) {
        const el = document.getElementById(`transcript-line-${active}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [currentTime, transcript, activeLineIndex]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setHasAudio(false));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const jumpToLine = (index: number) => {
    const time = timestampToSeconds(transcript[index].timestamp);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      if (!isPlaying) {
        audioRef.current.play().catch(() => setHasAudio(false));
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (s: number): string => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasAudio(false)}
        preload="metadata"
      />
      
      {/* Sticky bottom player bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-wtf-black dark:bg-[#0a0a0a] border-t-4 border-wtf-orange px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          {/* Play/Pause */}
          <button 
            onClick={togglePlay}
            className="w-12 h-12 shrink-0 bg-wtf-orange text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
          </button>

          {/* Time & Seek */}
          <span className="text-white font-mono text-sm shrink-0 w-12">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-[#FF6B00]"
          />
          <span className="text-white font-mono text-sm shrink-0 w-12">{formatTime(duration)}</span>

          {/* No audio fallback */}
          {!hasAudio && (
            <span className="text-xs text-gray-400 uppercase tracking-widest shrink-0">
              Place audio in /public/audio/
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export { timestampToSeconds };
