"use client";
import Link from 'next/link';
import { useState } from 'react';
import { episodes, podcasts } from '@/lib/data';

interface ArchiveBookProps {
  title: string;
  slug: string;
  episodesCount: number;
  colorClass: string;
}

const ArchiveBook = ({ title, slug, episodesCount, colorClass }: ArchiveBookProps) => {
  return (
    <Link href={`/collections/${slug}`} className="relative group w-full max-w-[280px] h-[380px] mx-auto cursor-pointer block mt-12 mb-16 focus:outline-none">
      
      {/* Decorative Scattering Shapes */}
      <div className="absolute z-10 w-16 h-16 bg-[#3B82F6] border-4 border-wtf-black opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out top-1/4 right-0 group-hover:translate-x-32 group-hover:-translate-y-12 rotate-0 group-hover:rotate-[45deg]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
      <div className="absolute z-10 w-16 h-16 bg-wtf-orange rounded-full border-4 border-wtf-black opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out bottom-1/4 -left-4 group-hover:-translate-x-20 group-hover:translate-y-12 rotate-0 group-hover:-rotate-[20deg]"></div>
      <div className="absolute z-10 w-12 h-12 bg-wtf-white border-4 border-wtf-black opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out top-0 left-10 group-hover:-translate-y-20 group-hover:-translate-x-12 rotate-0 group-hover:rotate-[135deg] flex items-center justify-center">
         <div className="w-full h-1.5 bg-wtf-black absolute"></div>
         <div className="h-full w-1.5 bg-wtf-black absolute"></div>
      </div>
      <div className="absolute z-10 w-20 h-8 rounded-full bg-[#3B82F6] border-4 border-wtf-black opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out bottom-4 right-4 group-hover:translate-x-24 group-hover:translate-y-16 rotate-0 group-hover:-rotate-[15deg]"></div>

      {/* Scattered Pages (2 multi-directional episodes) */}
      <div className="absolute z-20 inset-0 bg-wtf-cream border-4 border-wtf-black shadow-[2px_2px_0px_#000] transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] origin-bottom-right flex flex-col p-4 opacity-0 group-hover:opacity-100 group-hover:-rotate-[6deg] group-hover:-translate-x-12 group-hover:-translate-y-1">
         <div className="w-full h-32 bg-gray-200 border-2 border-wtf-black mb-4 flex items-center justify-center font-bold text-2xl text-wtf-black uppercase opacity-50">Log 01</div>
         <div className="h-4 bg-wtf-black w-3/4 mb-3"></div>
         <div className="h-4 bg-wtf-black w-1/2 mb-3"></div>
         <div className="h-4 bg-wtf-black w-5/6"></div>
      </div>
      <div className="absolute z-20 inset-0 bg-wtf-white border-4 border-wtf-black shadow-[2px_2px_0px_#000] transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] origin-bottom-left flex flex-col p-4 opacity-0 group-hover:opacity-100 group-hover:rotate-[6deg] group-hover:translate-x-12 group-hover:-translate-y-1">
         <div className="w-full h-32 bg-gray-200 border-2 border-wtf-black mb-4 flex items-center justify-center font-bold text-2xl text-wtf-black uppercase opacity-50">Log 02</div>
         <div className="h-4 bg-wtf-black w-3/4 mb-3"></div>
         <div className="h-4 bg-wtf-black w-1/2 mb-3"></div>
         <div className="h-4 bg-wtf-black w-5/6"></div>
      </div>

      {/* Main Book Cover */}
      <div className={`absolute z-40 inset-0 ${colorClass} border-4 border-wtf-black dark:border-[#555] flex flex-col p-8 shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#333] group-hover:-translate-y-6 group-hover:shadow-[16px_24px_0px_#000] dark:group-hover:shadow-[16px_24px_0px_#333] transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]`}>
        <div className="flex justify-between items-start">
           <span className="font-black border-2 border-wtf-black px-2 py-1 text-xs uppercase bg-wtf-white text-wtf-black shadow-[2px_2px_0px_#000]">Ref</span>
           <span className="font-bold text-sm uppercase px-2 py-1 bg-wtf-black text-wtf-white">{episodesCount} Logs</span>
        </div>
        
        <div className="mt-auto">
          <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4 break-words">
            {title}
          </h2>
          <div className="w-full h-2 bg-wtf-black"></div>
          <div className="w-3/4 h-2 bg-wtf-black mt-2"></div>
        </div>
      </div>

    </Link>
  );
};


const MENTAL_MODELS = [
  { term: "Moats", definition: "A structural business advantage that protects market share from competitors over the long run." },
  { term: "LTV / CAC", definition: "The ratio of Lifetime Value to Customer Acquisition Cost. A pure measure of startup scaling efficiency." },
  { term: "AGI", definition: "Artificial General Intelligence. Highly autonomous systems that outperform humans at most economically valuable work." },
  { term: "First Principles", definition: "Breaking down complex problems into foundational, indisputable truths rather than reasoning by analogy." },
  { term: "Nash Equilibrium", definition: "A steady state in game theory where no player can benefit from unilaterally changing strategy." },
  { term: "Zero to One", definition: "The act of creating something entirely new, moving from nothing to something, rather than scaling from 1 to n." }
];

function LexiconSection() {
  return (
    <section className="bg-wtf-black py-32 border-b-4 border-wtf-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-24 gap-8">
           <div>
             <div className="inline-block border-2 border-wtf-white text-wtf-white px-4 py-1 text-xs font-bold mb-6 tracking-widest uppercase bg-transparent">
               The Lexicon
             </div>
             <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-wtf-orange leading-none">Mental Models</h2>
           </div>
           <p className="text-wtf-white opacity-90 text-xl font-medium max-w-md">Deconstructing the core frameworks and complex terminology surfaced continuously across the Echoes network.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MENTAL_MODELS.map((model, i) => (
             <div key={i} className="bg-wtf-white border-4 border-wtf-black p-8 shadow-[8px_8px_0px_rgba(249,115,22,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(249,115,22,1)] transition-all cursor-crosshair">
                <h3 className="text-3xl font-black uppercase text-wtf-black mb-6 border-b-4 border-wtf-black pb-4">{model.term}</h3>
                <p className="text-wtf-black font-medium leading-relaxed">{model.definition}</p>
             </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Link href="/lexicon" className="border-4 border-wtf-white bg-transparent text-wtf-white px-10 py-5 font-black uppercase tracking-widest shadow-[4px_4px_0px_#F97316] hover:bg-wtf-orange hover:text-wtf-black hover:border-wtf-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FFF] transition-all text-lg">
            Explore Full Lexicon →
          </Link>
        </div>
      </div>
    </section>
  );
}


function EpisodeShuffler() {
  const [selectedEpisode, setSelectedEpisode] = useState(episodes[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateEpisode = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    let count = 0;
    const interval = setInterval(() => {
      setSelectedEpisode(episodes[Math.floor(Math.random() * episodes.length)]);
      count++;
      if (count >= 15) {
        clearInterval(interval);
        // Ensure the final one is randomly selected one last time
        setSelectedEpisode(episodes[Math.floor(Math.random() * episodes.length)]);
        setIsAnimating(false);
      }
    }, 60);
  };

  return (
    <section className="py-32 bg-wtf-cream relative overflow-hidden border-t-4 border-wtf-black">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center relative z-10">
        <div className="inline-block border-2 border-wtf-black text-wtf-black px-4 py-1 text-xs font-bold mb-6 tracking-widest uppercase bg-wtf-white shadow-[4px_4px_0px_#000]">
          Serendipity Engine
        </div>
        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-wtf-black mb-6 text-center">Randomized Audio</h2>
        <p className="text-xl md:text-2xl font-medium text-wtf-black opacity-80 mb-12 text-center max-w-2xl">Throw the dice. Discover an unadulterated masterclass selected completely at random from our massive log of archives.</p>
        
        <button 
          onClick={generateEpisode}
          className="zine-border bg-wtf-black text-wtf-white px-10 py-5 font-bold uppercase tracking-widest hover:bg-wtf-orange hover:text-wtf-black hover:-translate-y-1 shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-all text-xl mb-16"
        >
          {isAnimating ? "Shuffling Logs..." : "Discover Episode"}
        </button>

        {/* Displaying the fetched episode violently */}
        <div className={`w-full max-w-3xl transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
           <Link href={`/episode/${selectedEpisode.id}`} className="block bg-wtf-white border-4 border-wtf-black shadow-[12px_12px_0px_#000] p-8 hover:-translate-y-2 hover:shadow-[20px_20px_0px_#000] transition-all">
              <div className="flex justify-between items-start mb-6 border-b-4 border-wtf-black pb-6 gap-4">
                 <h3 className="font-black text-3xl md:text-5xl uppercase tracking-tighter leading-none">{selectedEpisode.title}</h3>
                 <span className="bg-wtf-orange text-wtf-black border-2 border-wtf-black px-3 py-1 text-sm font-black whitespace-nowrap">EP. {selectedEpisode.number}</span>
              </div>
              <p className="text-xl font-medium leading-relaxed mb-8">{selectedEpisode.description}</p>
              <div className="flex flex-wrap gap-2 text-sm font-bold uppercase tracking-widest">
                 {selectedEpisode.tags.map(tag => (
                   <span key={tag} className="border-2 border-wtf-black px-2 py-1">{tag}</span>
                 ))}
                 <span className="border-2 border-wtf-black px-2 py-1 bg-wtf-black text-wtf-white">{selectedEpisode.duration}</span>
              </div>
           </Link>
        </div>

      </div>
    </section>
  );
}


export default function ArchivesPage() {
  return (
    <div className="w-full bg-wtf-white min-h-screen">
      
      {/* Header Section */}
      <section className="border-b-4 border-wtf-black relative overflow-hidden bg-wtf-cream">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Smaller Scattered Background Elements */}
        <div className="absolute z-0 w-5 h-5 bg-[#3B82F6] border-2 border-wtf-black bottom-24 right-[25%] rotate-[70deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute z-0 w-10 h-4 rounded-full bg-wtf-orange border-2 border-wtf-black top-32 left-[20%] -rotate-[15deg] hidden md:block"></div>
        <div className="absolute z-0 w-8 h-1 bg-wtf-black top-[30%] right-[30%] rotate-[45deg] hidden md:block"></div>
        <div className="absolute z-0 w-4 h-4 bg-wtf-white border-2 border-wtf-black bottom-[30%] left-[30%] rotate-[10deg] hidden md:block"></div>
        <div className="absolute z-0 w-6 h-6 bg-wtf-cream border-2 border-wtf-black rounded-full top-[15%] right-[25%] hidden md:block"></div>

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 flex flex-col items-center text-center">
          <div className="inline-block border-2 border-wtf-black text-wtf-black px-4 py-1 text-xs font-bold mb-8 tracking-widest uppercase bg-wtf-white shadow-[4px_4px_0px_#000]">
            The Master Catalog
          </div>
          <h1 className="text-7xl md:text-[8rem] font-black leading-none uppercase tracking-tighter text-wtf-black mb-6">
            ARCHIVES.
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl leading-snug text-wtf-black opacity-90 mx-auto">
            Hover over a volume to scatter its logs. Every discussion, meticulously indexed and archived by topic.
          </p>
        </div>
      </section>

      {/* Collections Section */}
      <section className="w-full py-32 border-b-4 border-wtf-black relative overflow-visible">
        {/* Light Subtler Grid - now full width */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-wtf-black mb-4">Collections</h2>
            <div className="w-24 h-2 bg-wtf-orange"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
            <ArchiveBook title="Startups & VC" slug="startups" episodesCount={32} colorClass="bg-wtf-orange text-wtf-black" />
            <ArchiveBook title="Tech & AI" slug="tech" episodesCount={18} colorClass="bg-[#3B82F6] text-wtf-black" />
            <ArchiveBook title="Society & Law" slug="society" episodesCount={14} colorClass="bg-wtf-white text-wtf-black" />
            
            <ArchiveBook title="Health & Mind" slug="health" episodesCount={22} colorClass="bg-wtf-cream text-wtf-black" />
            <ArchiveBook title="Creators" slug="creators" episodesCount={11} colorClass="bg-wtf-orange text-wtf-black" />
            <ArchiveBook title="Economics" slug="economics" episodesCount={27} colorClass="bg-[#3B82F6] text-wtf-black" />
          </div>

          <div className="flex justify-center mt-24">
            <Link href="/collections" className="border-4 border-wtf-black bg-wtf-black text-wtf-white px-10 py-5 font-black uppercase tracking-widest shadow-[4px_4px_0px_#F97316] hover:bg-wtf-orange hover:text-wtf-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all text-lg">
              Show All Collections →
            </Link>
          </div>
        </div>
      </section>

      {/* The Lexicon Section */}
      <LexiconSection />

      {/* Transcript Search Section */}
      <section className="bg-[#3B82F6] py-32 relative overflow-hidden hidden md:block">
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-block border-2 border-wtf-black text-wtf-black px-4 py-1 text-xs font-bold mb-8 tracking-widest uppercase bg-wtf-white shadow-[4px_4px_0px_#000]">
            Global Query
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-wtf-black mb-6 leading-none">Search The Transcripts</h2>
          <p className="text-xl md:text-2xl font-medium text-wtf-black mb-12 opacity-90">Deep query 1,402,391 spoken words across the entire Echoes network.</p>
          
          <div className="relative flex flex-col md:flex-row shadow-[12px_12px_0px_#000]">
            <input 
              type="text" 
              placeholder="E.g., Artificial General Intelligence..." 
              className="w-full border-4 md:border-r-0 border-wtf-black px-6 py-6 font-bold text-xl md:text-2xl focus:outline-none bg-wtf-white placeholder:text-gray-400"
            />
            <button className="bg-wtf-orange border-4 border-t-0 md:border-t-4 border-wtf-black px-12 py-6 md:py-0 font-black tracking-widest uppercase hover:bg-wtf-black hover:text-wtf-white transition-colors text-xl whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Episode Shuffler Component */}
      <EpisodeShuffler />

    </div>
  );
}
