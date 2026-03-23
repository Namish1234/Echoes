import Link from 'next/link';

const ALL_COLLECTIONS = [
  { title: "Startups & VC", slug: "startups", count: 32, color: "bg-wtf-orange", description: "From bootstrapping to billion-dollar exits. The raw mechanics of building companies from zero." },
  { title: "Tech & AI", slug: "tech", count: 18, color: "bg-[#3B82F6]", description: "Artificial intelligence, scaling laws, frontier models, and the infrastructure reshaping civilization." },
  { title: "Society & Law", slug: "society", count: 14, color: "bg-wtf-white", description: "Governance, geopolitics, civic responsibility, and the legal frameworks binding modern societies." },
  { title: "Health & Mind", slug: "health", count: 22, color: "bg-wtf-cream", description: "Longevity, biohacking, cognitive science, and the optimization of the human operating system." },
  { title: "Creators", slug: "creators", count: 11, color: "bg-wtf-orange", description: "The creator economy, audience building, algorithmic leverage, and the decentralization of media." },
  { title: "Economics", slug: "economics", count: 27, color: "bg-[#3B82F6]", description: "Macro-economics, wealth creation, market cycles, and the invisible forces governing capital flow." },
  { title: "Science", slug: "science", count: 9, color: "bg-wtf-white", description: "Synthetic biology, quantum computing, space exploration, and the empirical pursuit of truth." },
  { title: "Philosophy", slug: "philosophy", count: 7, color: "bg-wtf-cream", description: "Existentialism, stoicism, ethics, and the timeless questions governing human meaning and purpose." },
  { title: "Leadership", slug: "leadership", count: 16, color: "bg-wtf-orange", description: "Decision-making under pressure, organizational culture, legacy building, and the psychology of power." },
  { title: "Education", slug: "education", count: 12, color: "bg-[#3B82F6]", description: "The future of learning, credentialism, skill acquisition, and whether degrees still matter." },
  { title: "Media & Entertainment", slug: "media", count: 8, color: "bg-wtf-white", description: "Streaming wars, content strategy, storytelling craft, and the attention economy." },
  { title: "Finance & Markets", slug: "finance", count: 21, color: "bg-wtf-cream", description: "Angel investing, public markets, portfolio theory, and the mechanics of generating asymmetric returns." },
];

export default function AllCollectionsPage() {
  return (
    <div className="w-full bg-wtf-white min-h-screen">
      
      {/* Header */}
      <section className="border-b-4 border-wtf-black relative overflow-hidden bg-wtf-cream py-24">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Random small scattered shapes */}
        <div className="absolute z-0 w-3 h-3 bg-wtf-orange border border-wtf-black top-16 right-[18%] rotate-[30deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute z-0 w-4 h-4 bg-[#3B82F6] border border-wtf-black bottom-20 left-[12%] rotate-[15deg] hidden md:block"></div>
        <div className="absolute z-0 w-5 h-1 bg-wtf-black top-[40%] right-[28%] rotate-[55deg] hidden md:block"></div>
        <div className="absolute z-0 w-3 h-3 bg-wtf-orange rounded-full border border-wtf-black top-[25%] left-[40%] hidden md:block"></div>
        <div className="absolute z-0 w-4 h-4 bg-[#3B82F6] border border-wtf-black bottom-[30%] right-[10%] rotate-[65deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute z-0 w-6 h-1 bg-wtf-black opacity-50 bottom-16 left-[25%] rotate-[40deg] hidden md:block"></div>
        <div className="absolute z-0 w-3 h-3 bg-wtf-white border border-wtf-black top-12 left-[15%] rotate-[50deg] hidden md:block"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-start">
          <Link href="/archives" className="inline-flex items-center gap-2 border-2 border-wtf-black text-wtf-black px-5 py-2 text-sm font-bold mb-12 tracking-widest uppercase bg-wtf-orange shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all">
            ← Back to Archives
          </Link>
          <div className="inline-block border-2 border-wtf-black px-4 py-1 text-xs font-bold mb-6 tracking-widest uppercase bg-wtf-black text-wtf-white shadow-[4px_4px_0px_#F97316]">
            Full Directory
          </div>
          <h1 className="text-6xl md:text-[7rem] font-black leading-none uppercase tracking-tighter text-wtf-black mb-6">
            All Collections.
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl leading-relaxed text-wtf-black opacity-80">
            The complete index of every thematic volume across the Echoes network. {ALL_COLLECTIONS.length} collections spanning {ALL_COLLECTIONS.reduce((a, c) => a + c.count, 0)}+ archived logs.
          </p>
        </div>
      </section>

      {/* Full Collections Grid */}
      <section className="w-full py-24 relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-wtf-black whitespace-nowrap">{ALL_COLLECTIONS.length} Volumes</h2>
            <div className="flex-1 h-1 bg-wtf-black"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ALL_COLLECTIONS.map((col) => (
              <Link href={`/collections/${col.slug}`} key={col.slug} className="group border-4 border-wtf-black bg-wtf-white shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#333333] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#000000] dark:hover:shadow-[12px_12px_0px_#333333] transition-all flex flex-col">
                
                {/* Color Header */}
                <div className={`${col.color} border-b-4 border-wtf-black p-6 flex justify-between items-start`}>
                  <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight">{col.title}</h3>
                  <span className="bg-wtf-black text-wtf-white px-3 py-1 text-xs font-bold uppercase whitespace-nowrap">{col.count} Logs</span>
                </div>

                {/* Description */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-wtf-black font-medium leading-relaxed mb-6 flex-1">{col.description}</p>
                  <span className="font-black text-sm uppercase tracking-widest text-wtf-black group-hover:text-wtf-orange transition-colors">Explore Volume →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
