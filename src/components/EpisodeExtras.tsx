'use client';

import { useState } from 'react';
import { MindmapNodeData } from '@/lib/data';
import InteractiveMindmap from './InteractiveMindmap';

interface EpisodeExtrasProps {
  mindmapNodes?: MindmapNodeData[];
  centralTopic: string;
  highlights: string[];
  keyLessons?: string[];
}

export default function EpisodeExtras({ mindmapNodes, centralTopic, highlights, keyLessons }: EpisodeExtrasProps) {
  const [activeTab, setActiveTab] = useState<'none' | 'mindmap' | 'cards'>('none');

  const lessons = keyLessons || highlights;

  if (activeTab === 'none') {
    return (
      <div className="fixed bottom-20 right-6 z-40 flex flex-col gap-3">
        <button
          onClick={() => setActiveTab('cards')}
          className="zine-border bg-wtf-white dark:bg-[#1a1a1a] text-wtf-black dark:text-white px-5 py-2.5 font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#333] hover:shadow-[6px_6px_0px_#000] dark:hover:shadow-[6px_6px_0px_#333] hover:-translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>🎴</span> Key Lessons
        </button>
        <button
          onClick={() => setActiveTab('mindmap')}
          className="zine-border bg-wtf-orange text-black px-5 py-2.5 font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#333] hover:shadow-[6px_6px_0px_#000] dark:hover:shadow-[6px_6px_0px_#333] hover:-translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>🧠</span> Mindmap
        </button>
      </div>
    );
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={() => setActiveTab('none')}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-wtf-white dark:bg-[#0f0f0f] z-50 border-l-4 border-wtf-orange shadow-[-12px_0px_24px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden text-wtf-black dark:text-white">
        
        {/* Header */}
        <div className="p-5 border-b-4 border-wtf-black dark:border-[#333] flex justify-between items-center bg-wtf-white dark:bg-[#1a1a1a]">
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab('mindmap')}
              className={`font-black uppercase tracking-widest text-sm px-4 py-2 zine-border transition-colors cursor-pointer ${activeTab === 'mindmap' ? 'bg-wtf-orange text-black' : 'bg-transparent text-wtf-black dark:text-white'}`}
            >
              🧠 Mindmap
            </button>
            <button 
              onClick={() => setActiveTab('cards')}
              className={`font-black uppercase tracking-widest text-sm px-4 py-2 zine-border transition-colors cursor-pointer ${activeTab === 'cards' ? 'bg-wtf-orange text-black' : 'bg-transparent text-wtf-black dark:text-white'}`}
            >
              🎴 Key Lessons
            </button>
          </div>
          <button 
            onClick={() => setActiveTab('none')}
            className="w-9 h-9 flex items-center justify-center zine-border bg-wtf-white dark:bg-[#0f0f0f] text-xl font-black hover:bg-red-500 hover:text-white transition-colors cursor-pointer text-wtf-black dark:text-white"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8">
          {activeTab === 'mindmap' && (
            <div className="space-y-4">
              {mindmapNodes && mindmapNodes.length > 0 ? (
                <InteractiveMindmap 
                  centralTopic={centralTopic}
                  nodes={mindmapNodes}
                />
              ) : (
                <div className="zine-border bg-wtf-white dark:bg-[#1a1a1a] p-12 text-center font-bold uppercase opacity-50">
                  Mindmap data not yet available for this episode
                </div>
              )}
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black uppercase text-wtf-black dark:text-white">Key Takeaways</h2>
              <div className="flex flex-col gap-5">
                {lessons.map((lesson, index) => (
                  <div key={index} className="bg-wtf-white dark:bg-[#1a1a1a] p-5 rounded-lg border-2 border-wtf-black dark:border-[#444] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#333333] relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-wtf-orange text-black font-black flex items-center justify-center zine-border text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                      {index + 1}
                    </div>
                    <p className="font-medium text-base leading-relaxed mt-1 pl-4 text-wtf-black dark:text-gray-200">
                      {lesson}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
