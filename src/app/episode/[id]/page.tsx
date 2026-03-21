import { notFound } from 'next/navigation';
import Link from 'next/link';
import { episodes, Episode, TranscriptLine } from '@/lib/data';
import EpisodeExtras from '@/components/EpisodeExtras';
import AudioPlayer from '@/components/AudioPlayer';

// Helper to parse semantic highlights: [tech: ...], [phil: ...], [biz: ...]
const renderTranscriptContent = (content: string) => {
  const regex = /\[(tech|phil|biz):\s*([^\]]+)\]/g;
  let lastIndex = 0;
  const parts: React.ReactNode[] = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    
    const type = match[1];
    const textPart = match[2];
    
    let styleClass = "";
    if (type === "tech") {
      styleClass = "bg-blue-500/15 text-blue-600 dark:text-blue-300 font-bold border-b-2 border-blue-400 pb-0.5";
    } else if (type === "phil") {
      styleClass = "bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold border-b-2 border-purple-400 pb-0.5";
    } else if (type === "biz") {
      styleClass = "bg-green-500/15 text-green-600 dark:text-green-300 font-bold border-b-2 border-green-400 pb-0.5";
    }
    
    parts.push(
      <span key={match.index} className={styleClass}>
        {textPart}
      </span>
    );
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : content;
};

export default async function EpisodeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let episode = episodes.find(ep => ep.id === id);

  if (!episode) {
    notFound();
  }

  // Fallback missing data to the sample episode data to create a sense of completeness
  if (!episode.parsedTranscript || episode.parsedTranscript.length === 0) {
    const sampleEpisode = episodes.find(e => e.id === 'ep-00');
    if (sampleEpisode) {
      episode = {
        ...episode,
        parsedTranscript: episode.parsedTranscript || sampleEpisode.parsedTranscript,
        mindmapNodes: episode.mindmapNodes || sampleEpisode.mindmapNodes,
        keyLessons: episode.keyLessons || sampleEpisode.keyLessons,
      };
    }
  }

  return (
    <div className="w-full relative min-h-screen pb-24">
      
      {/* ── HEADER ── */}
      <header className="w-full max-w-6xl mx-auto px-6 pt-10 pb-8">
        {/* Back link */}
        <div className="mb-4">
          <Link 
            href="/wtf" 
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-wtf-orange transition-all"
          >
            ← Back to WTF Podcast
          </Link>
        </div>

        {/* Series badge */}
        <div className="mb-4">
          <div className="bg-wtf-black text-wtf-white px-3 py-1 text-xs font-bold tracking-widest uppercase inline-block">
            {episode.series || 'WTF is'} • Episode {episode.number}
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] mb-6">
          {episode.title}
        </h1>
        
        {/* Meta row: guest, date, duration, tags all in one clean line */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="font-black text-wtf-orange uppercase text-lg">
            {episode.guest}
          </span>
          <span className="opacity-30 text-xl">|</span>
          <span className="font-medium opacity-70">{episode.date}</span>
          <span className="opacity-30 text-xl">|</span>
          <span className="font-medium opacity-70">{episode.duration}</span>
          <span className="opacity-30 text-xl">|</span>
          {episode.tags.map(tag => (
            <span key={tag} className="text-xs font-bold uppercase tracking-widest px-3 py-1 zine-border">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Summary */}
        <p className="text-lg font-medium leading-relaxed opacity-80 max-w-3xl mb-8">
          {episode.summary}
        </p>

        {/* Platform buttons — clean, compact row */}
        <div className="flex flex-wrap gap-3">
          <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1DB954] text-black font-bold uppercase tracking-widest text-sm zine-border shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.78-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.745 3.805-.87 7.076-.496 9.71 1.115.293.18.386.563.206.854zm1.214-2.723c-.227.37-.706.486-1.076.26-2.712-1.665-6.885-2.153-9.94-1.18-.413.13-.85-.1-1.006-.516-.156-.412.1-.85.516-1.006 3.486-1.11 8.13-.563 11.246 1.353.37.226.486.706.26 1.075zm.116-2.846c-3.264-1.936-8.65-2.115-11.77-1.17-.487.147-.993-.13-1.14-.616-.147-.488.13-.993.616-1.14 3.565-1.08 9.53-.87 13.27 1.35.44.263.58.834.318 1.272-.26.438-.83.58-1.27.318z"/></svg>
            Spotify
          </a>
          <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF0000] text-white font-bold uppercase tracking-widest text-sm zine-border shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            YouTube
          </a>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-wtf-black text-white font-bold uppercase tracking-widest text-sm zine-border shadow-[3px_3px_0px_rgba(0,0,0,0.3)] dark:shadow-[3px_3px_0px_#333] hover:-translate-y-0.5 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"/></svg>
            PDF
          </button>
        </div>
      </header>

      {/* Divider */}
      <div className="w-full border-t-4 border-wtf-black dark:border-[#333]" />

      {/* Highlight Legend */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-4">
        <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest items-center">
          <span className="opacity-50">Highlights:</span>
          <span className="bg-blue-500/15 text-blue-600 dark:text-blue-300 border-b-2 border-blue-400 px-2 py-0.5">Technical</span>
          <span className="bg-purple-500/15 text-purple-600 dark:text-purple-300 border-b-2 border-purple-400 px-2 py-0.5">Philosophical</span>
          <span className="bg-green-500/15 text-green-600 dark:text-green-300 border-b-2 border-green-400 px-2 py-0.5">Business</span>
        </div>
      </div>

      {/* ── TRANSCRIPT ── */}
      <main className="w-full max-w-5xl mx-auto px-6 py-8 mb-16">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-12 border-b-4 border-wtf-orange pb-2 inline-block">
          Transcript
        </h2>

        <div className="flex flex-col gap-10 text-base md:text-lg leading-relaxed font-medium">
          {episode.parsedTranscript ? (
            episode.parsedTranscript.map((line, index) => (
              <div 
                key={index} 
                id={`transcript-line-${index}`}
                className="flex flex-col md:flex-row gap-3 md:gap-8 relative group"
              >
                {/* Speaker: left column */}
                <div className="md:w-[180px] shrink-0 flex flex-col items-start md:items-end md:text-right pt-1">
                  <span className="font-black uppercase tracking-widest text-sm text-wtf-orange bg-wtf-orange/10 px-2.5 py-1 rounded-sm inline-block leading-tight">
                    {line.speaker}
                  </span>
                  <span className="text-xs font-bold opacity-40 mt-1 font-mono">
                    {line.timestamp}
                  </span>
                </div>
                
                {/* Dialogue: right column */}
                <div className="flex-1 text-wtf-black dark:text-[#E5E7EB] border-l-2 border-transparent group-hover:border-wtf-orange pl-4 transition-colors">
                  {renderTranscriptContent(line.content)}
                </div>
              </div>
            ))
          ) : (
            <div className="prose prose-xl max-w-none text-wtf-black dark:text-[#E5E7EB] border-l-4 border-wtf-orange pl-8 ml-4">
              <p>{episode.transcript}</p>
              <p className="opacity-40 italic mt-12">[Structured transcript not available for this episode]</p>
            </div>
          )}
        </div>
      </main>

      {/* ── FLOATING EXTRAS (Mindmap / Key Lessons) ── */}
      <EpisodeExtras 
        mindmapNodes={episode.mindmapNodes}
        centralTopic={episode.title}
        highlights={episode.highlights} 
        keyLessons={episode.keyLessons}
      />

      {/* ── SYNCED AUDIO PLAYER ── */}
      {episode.audioSrc && episode.parsedTranscript && (
        <AudioPlayer 
          audioSrc={episode.audioSrc}
          transcript={episode.parsedTranscript}
        />
      )}
    </div>
  );
}
