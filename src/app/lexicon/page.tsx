"use client";
import Link from 'next/link';
import { useState } from 'react';

const FULL_LEXICON = [
  { term: "Moats", definition: "A structural business advantage that protects market share from competitors over the long run. Can be network effects, switching costs, brand, or economies of scale.", category: "Business" },
  { term: "LTV / CAC", definition: "The ratio of Lifetime Value to Customer Acquisition Cost. A pure measure of startup scaling efficiency. A ratio above 3:1 is generally considered healthy for venture-backed companies.", category: "Metrics" },
  { term: "AGI", definition: "Artificial General Intelligence. Highly autonomous systems that outperform humans at most economically valuable work. The holy grail of AI research.", category: "Technology" },
  { term: "First Principles", definition: "Breaking down complex problems into foundational, indisputable truths rather than reasoning by analogy. Popularized by Elon Musk as a decision-making framework.", category: "Thinking" },
  { term: "Nash Equilibrium", definition: "A steady state in game theory where no player can benefit from unilaterally changing strategy. Explains pricing wars, arms races, and competitive stalemates.", category: "Economics" },
  { term: "Zero to One", definition: "The act of creating something entirely new, moving from nothing to something, rather than scaling from 1 to n. Peter Thiel's framework for monopolistic innovation.", category: "Business" },
  { term: "Scaling Laws", definition: "The empirical observation that AI model performance improves predictably with more compute, data, and parameters. The backbone of the current AI arms race.", category: "Technology" },
  { term: "Power Law", definition: "A distribution where a small number of items account for the vast majority of impact. In VC, 1% of deals generate the majority of all returns.", category: "Economics" },
  { term: "Sovereign AI", definition: "The concept that nations must develop their own AI capabilities and infrastructure to maintain geopolitical independence and national security.", category: "Geopolitics" },
  { term: "PMF", definition: "Product-Market Fit. The degree to which a product satisfies strong market demand. Often described as the moment when a startup stops pushing and the market starts pulling.", category: "Business" },
  { term: "Compounding", definition: "The process where growth builds on prior growth, creating exponential returns over time. Einstein allegedly called it the eighth wonder of the world.", category: "Economics" },
  { term: "Antifragility", definition: "A property of systems that actually benefit from shocks, volatility, and stressors. Coined by Nassim Nicholas Taleb. Beyond resilience — it thrives on disorder.", category: "Thinking" },
  { term: "Sunk Cost Fallacy", definition: "The tendency to continue investing in something because of previously invested resources rather than future value. A cognitive trap that kills rational decision-making.", category: "Thinking" },
  { term: "Flywheel Effect", definition: "A self-reinforcing loop where each component accelerates the next. Amazon's model: lower prices → more customers → more sellers → lower costs → lower prices.", category: "Business" },
  { term: "Regulatory Capture", definition: "When a regulatory agency created to act in the public interest instead advances the interests of the industry it is supposed to regulate.", category: "Geopolitics" },
  { term: "Dunbar's Number", definition: "The theoretical cognitive limit (~150) on the number of stable social relationships a human can maintain. Explains why startup culture changes after 150 employees.", category: "Science" },
  { term: "Disruption Theory", definition: "Clayton Christensen's framework: incumbents are displaced not by better products, but by cheaper, simpler ones that serve overlooked market segments.", category: "Business" },
  { term: "Ergodicity", definition: "A system is ergodic if the time average equals the ensemble average. Most real-world financial decisions are non-ergodic, making expected value calculations misleading.", category: "Economics" },
];

const CATEGORIES = ["All", ...Array.from(new Set(FULL_LEXICON.map(m => m.category)))];

export default function LexiconPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" 
    ? FULL_LEXICON 
    : FULL_LEXICON.filter(m => m.category === activeFilter);

  return (
    <div className="w-full bg-wtf-black min-h-screen">
      
      {/* Header */}
      <section className="border-b-4 border-wtf-white relative overflow-hidden py-24">
        {/* Tilted grid */}
        <div className="absolute inset-[-50%] w-[200%] h-[200%] opacity-[0.04] rotate-[8deg]" style={{ backgroundImage: 'linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        {/* Random small scattered shapes */}
        <div className="absolute z-0 w-3 h-3 bg-wtf-orange border border-wtf-white top-20 right-[22%] rotate-[55deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute z-0 w-4 h-4 bg-[#3B82F6] border border-wtf-white top-[30%] left-[8%] rotate-[20deg] hidden md:block"></div>
        <div className="absolute z-0 w-5 h-5 bg-wtf-orange border border-wtf-white bottom-24 left-[35%] rotate-[70deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute z-0 w-3 h-3 bg-wtf-white bottom-16 right-[30%] rotate-[15deg] hidden md:block"></div>
        <div className="absolute z-0 w-6 h-1 bg-wtf-white opacity-40 top-[45%] right-[12%] rotate-[35deg] hidden md:block"></div>
        <div className="absolute z-0 w-4 h-4 bg-[#3B82F6] border border-wtf-white top-12 left-[45%] rotate-[40deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute z-0 w-3 h-3 bg-wtf-orange rounded-full border border-wtf-white bottom-[35%] right-[8%] hidden md:block"></div>
        <div className="absolute z-0 w-5 h-1 bg-wtf-white opacity-30 bottom-[20%] left-[18%] rotate-[65deg] hidden md:block"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-start">
          <Link href="/archives" className="inline-flex items-center gap-2 border-2 border-wtf-orange text-wtf-black px-5 py-2 text-sm font-bold mb-12 tracking-widest uppercase bg-wtf-orange shadow-[4px_4px_0px_#FFF] hover:-translate-y-1 transition-all">
            ← Back to Archives
          </Link>
          <div className="inline-block border-2 border-wtf-black px-4 py-1 text-xs font-bold mb-6 tracking-widest uppercase bg-wtf-white text-wtf-black shadow-[4px_4px_0px_#F97316]">
            Complete Reference
          </div>
          <h1 className="text-6xl md:text-[7rem] font-black leading-none uppercase tracking-tighter text-wtf-orange mb-6">
            The Lexicon.
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl leading-relaxed text-wtf-white opacity-80">
            {FULL_LEXICON.length} mental models, frameworks, and complex terminology deconstructed. The intellectual operating system behind the Echoes network.
          </p>
        </div>
      </section>

      {/* Category Filter Tags */}
      <section className="border-b-4 border-wtf-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveFilter(cat)}
              className={`border-2 px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                activeFilter === cat 
                  ? 'bg-wtf-orange text-wtf-black border-wtf-black' 
                  : 'border-wtf-white text-wtf-white hover:bg-wtf-orange hover:text-wtf-black hover:border-wtf-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Full Lexicon Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-wtf-white whitespace-nowrap">{filtered.length} Entries</h2>
            <div className="flex-1 h-[2px] bg-wtf-white opacity-30"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((model, i) => (
              <div key={i} className="bg-wtf-white border-4 border-wtf-black p-8 shadow-[8px_8px_0px_rgba(249,115,22,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(249,115,22,1)] transition-all cursor-crosshair flex flex-col">
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h3 className="text-2xl font-black uppercase text-wtf-black">{model.term}</h3>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-wtf-cream text-wtf-black whitespace-nowrap">{model.category}</span>
                </div>
                <div className="w-full h-1 bg-wtf-black mb-4"></div>
                <p className="text-wtf-black font-medium leading-relaxed flex-1">{model.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
