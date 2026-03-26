import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="border-b-4 border-wtf-black relative overflow-hidden bg-wtf-cream">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Small Random Background Elements Around Main Text */}
        <div className="absolute z-0 w-4 h-4 bg-[#3B82F6] border-2 border-wtf-black top-32 left-1/4 rotate-[15deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute z-0 w-6 h-6 bg-wtf-orange rounded-full border-2 border-wtf-black top-24 right-1/3 hidden md:block"></div>
        <div className="absolute z-0 w-8 h-8 bg-wtf-white border-2 border-wtf-black bottom-32 left-1/3 -rotate-[25deg] flex items-center justify-center hidden md:flex">
           <div className="w-full h-1 bg-wtf-black absolute"></div>
           <div className="h-full w-1 bg-wtf-black absolute"></div>
        </div>
        <div className="absolute z-0 w-12 h-1 bg-wtf-black bottom-24 right-1/4 rotate-[15deg] hidden md:block"></div>
        <div className="absolute z-0 w-8 h-1 bg-wtf-black top-[40%] right-1/4 -rotate-45 hidden md:block"></div>
        <div className="absolute z-0 w-3 h-3 bg-wtf-cream border-2 border-wtf-black rounded-full top-[45%] left-[20%] hidden md:block"></div>

        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10 flex flex-col items-center text-center">
          <div className="inline-block border-2 border-wtf-black text-wtf-black px-4 py-1 text-xs font-bold mb-8 tracking-widest uppercase bg-wtf-white shadow-[4px_4px_0px_#000]">
            The Echoes Platform
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black leading-none uppercase tracking-tighter text-wtf-black mb-6">
            ECHOES.
          </h1>
          <p className="text-xl md:text-3xl font-medium max-w-3xl leading-snug text-wtf-black opacity-90 mx-auto">
            A digital archive for the curious, the ambitious, and the visionaries of Bharat.
          </p>
        </div>
      </section>

      {/* Philosophy / Values Section */}
      <section className="w-full border-b-4 border-wtf-black bg-wtf-white" style={{ color: '#000000' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-wtf-black">
          
          <div className="p-10 md:p-16 flex flex-col justify-start">
            <span className="text-6xl font-black text-wtf-orange mb-6 block">01</span>
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight text-wtf-black transition-colors">Unaltered Narratives</h3>
            <p className="font-medium text-lg leading-relaxed text-wtf-black transition-colors">
              We believe in raw conversations. No fluff, no PR spins. We document the unfiltered realities of building, succeeding, and failing in massive arenas.
            </p>
          </div>

          <div className="p-10 md:p-16 flex flex-col justify-start">
            <span className="text-6xl font-black text-wtf-orange mb-6 block">02</span>
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight text-wtf-black transition-colors">Deep Intellectual Dives</h3>
            <p className="font-medium text-lg leading-relaxed text-wtf-black transition-colors">
              Through transcripts, precise summaries, and visual mindmaps, we extract actionable intelligence from hours of discourse, saving you time without sacrificing depth.
            </p>
          </div>

          <div className="p-10 md:p-16 flex flex-col justify-start">
            <span className="text-6xl font-black text-wtf-orange mb-6 block">03</span>
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight text-wtf-black transition-colors">Focus on Visionaries</h3>
            <p className="font-medium text-lg leading-relaxed text-wtf-black transition-colors">
              Our catalogs focus strictly on builders. Scientists, engineers, politicians, and founders driving the macro-economic and technological shifts of the next century.
            </p>
          </div>

        </div>
      </section>

      {/* Podcast Catalog */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end border-b-4 border-wtf-black pb-4 mb-12">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Our Catalog</h2>
          <Link href="/podcasts" className="zine-border bg-wtf-black text-wtf-white px-6 py-2 font-bold uppercase tracking-widest text-sm shadow-zine hover:bg-wtf-orange hover:text-wtf-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] transition-all hidden md:block">
            All Podcasts →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* WTF Podcast Card */}
          <Link href="/wtf" className="group block">
            <article className="zine-border bg-wtf-white shadow-zine-lg hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
              <div className="bg-wtf-black text-wtf-white p-8 flex items-center justify-center relative overflow-hidden h-48">
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line-inv) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line-inv) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <h3 className="relative z-10 text-5xl font-black uppercase tracking-tighter text-center">WTF<br/><span className="text-wtf-orange">Podcast</span></h3>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex gap-2 mb-4">
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Business</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Tech</span>
                </div>
                <p className="font-medium text-lg opacity-90 leading-relaxed mb-8 flex-grow">
                  Hosted by Nikhil Kamath. Exploring the raw, unfiltered journeys of creators, engineers, and visionaries. Featuring deep-dives into Indian entrepreneurship and global macro trends.
                </p>
                <div className="flex justify-between items-center border-t-2 border-dashed border-wtf-black pt-4">
                  <span className="font-black uppercase text-sm tracking-widest">20 Episodes</span>
                  <span className="font-black text-wtf-orange group-hover:text-wtf-black transition-colors">EXPLORE →</span>
                </div>
              </div>
            </article>
          </Link>

          {/* Figuring Out Podcast Card */}
          <Link href="/figuring-out" className="group block">
            <article className="zine-border bg-wtf-white shadow-zine-lg hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
              <div className="bg-[#3B82F6] text-wtf-white p-8 flex items-center justify-center relative overflow-hidden h-48">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line-inv) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line-inv) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <h3 className="relative z-10 text-5xl font-black uppercase tracking-tighter text-center">Figuring<br/><span className="text-wtf-black">Out</span></h3>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex gap-2 mb-4">
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Growth</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Leadership</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Life</span>
                </div>
                <p className="font-medium text-lg opacity-90 leading-relaxed mb-8 flex-grow">
                  Hosted by Raj Shamani. An authoritative guide to business, relationships, politics, and health. Figuring out how to grow daily to live and love better. 400M+ views/year.
                </p>
                <div className="flex justify-between items-center border-t-2 border-dashed border-wtf-black pt-4">
                  <span className="font-black uppercase text-sm tracking-widest">484+ Episodes</span>
                  <span className="font-black text-[#3B82F6] group-hover:text-wtf-black transition-colors">EXPLORE →</span>
                </div>
              </div>
            </article>
          </Link>

          {/* Builder's Log Card */}
          <Link href="/builders-log" className="group block">
            <article className="zine-border bg-wtf-white shadow-zine-lg hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
              <div className="bg-[#22C55E] text-white p-8 flex items-center justify-center relative overflow-hidden h-48">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line-inv) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line-inv) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <h3 className="relative z-10 text-5xl font-black uppercase tracking-tighter text-center">Builder&apos;s<br/><span className="text-black">Log</span></h3>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex gap-2 mb-4">
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Tech & AI</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Engineering</span>
                </div>
                <p className="font-medium text-lg opacity-90 leading-relaxed mb-8 flex-grow">
                  Hosted by Echoes Core. Raw technical dialogues dissecting application architecture, zero-to-one product building, and engineering culture.
                </p>
                <div className="flex justify-between items-center border-t-2 border-dashed border-wtf-black pt-4">
                  <span className="font-black uppercase text-sm tracking-widest">1 Episode</span>
                  <span className="font-black text-[#22C55E] group-hover:text-wtf-black transition-colors">EXPLORE →</span>
                </div>
              </div>
            </article>
          </Link>

          {/* Mind & Matter Card */}
          <Link href="/mind-matter" className="group block">
            <article className="zine-border bg-wtf-white shadow-zine-lg hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
              <div className="bg-[#8B5CF6] text-white p-8 flex items-center justify-center relative overflow-hidden h-48">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line-inv) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line-inv) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <h3 className="relative z-10 text-5xl font-black uppercase tracking-tighter text-center">Mind &<br/><span className="text-black">Matter</span></h3>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex gap-2 mb-4">
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Health & Mind</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Science</span>
                </div>
                <p className="font-medium text-lg opacity-90 leading-relaxed mb-8 flex-grow">
                  Hosted by Dr. Aryan Sharma. Deconstructing the human condition through synthetic biology, cognitive science, and performance models.
                </p>
                <div className="flex justify-between items-center border-t-2 border-dashed border-wtf-black pt-4">
                  <span className="font-black uppercase text-sm tracking-widest">1 Episode</span>
                  <span className="font-black text-[#8B5CF6] group-hover:text-wtf-black transition-colors">EXPLORE →</span>
                </div>
              </div>
            </article>
          </Link>

          {/* Creator Capital Card */}
          <Link href="/creator-capital" className="group block">
            <article className="zine-border bg-wtf-white shadow-zine-lg hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
              <div className="bg-[#EAB308] text-black p-8 flex items-center justify-center relative overflow-hidden h-48">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <h3 className="relative z-10 text-5xl font-black uppercase tracking-tighter text-center">Creator<br/><span className="text-white">Capital</span></h3>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex gap-2 mb-4">
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Creators</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Economics</span>
                </div>
                <p className="font-medium text-lg opacity-90 leading-relaxed mb-8 flex-grow">
                  Hosted by Network Archives. Analyzing the modern business of audience building, media empires, and the vast decentralization of attention.
                </p>
                <div className="flex justify-between items-center border-t-2 border-dashed border-wtf-black pt-4">
                  <span className="font-black uppercase text-sm tracking-widest">1 Episode</span>
                  <span className="font-black text-[#EAB308] group-hover:text-wtf-black transition-colors">EXPLORE →</span>
                </div>
              </div>
            </article>
          </Link>

          {/* The Opponents Card */}
          <Link href="/the-opponents" className="group block">
            <article className="zine-border bg-wtf-white shadow-zine-lg hover:shadow-[12px_12px_0px_#000] dark:hover:shadow-[12px_12px_0px_#333] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
              <div className="bg-[#00E5FF] text-wtf-black p-8 flex items-center justify-center relative overflow-hidden h-48">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line-inv) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line-inv) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <h3 className="relative z-10 text-4xl lg:text-5xl font-black uppercase tracking-tighter text-center">The<br/><span className="text-white drop-shadow-sm">Opponents</span></h3>
              </div>
              <div className="p-8 flex-grow flex flex-col text-wtf-black">
                <div className="flex gap-2 mb-4">
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Sports</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Resilience</span>
                </div>
                <p className="font-medium text-lg opacity-90 leading-relaxed mb-8 flex-grow">
                  Inspiring comeback stories, sports resilience, and examining the ultimate competitive mindset. Overcoming the toughest opponent: oneself.
                </p>
                <div className="flex justify-between items-center border-t-2 border-dashed border-wtf-black pt-4">
                  <span className="font-black uppercase text-sm tracking-widest">1 Episode</span>
                  <span className="font-black text-[#00E5FF] group-hover:text-wtf-black dark:group-hover:text-wtf-white transition-colors">EXPLORE →</span>
                </div>
              </div>
            </article>
          </Link>

          {/* Coming Soon Placeholder */}
          <article className="border-4 border-dashed border-wtf-black bg-transparent p-8 flex flex-col items-center justify-center text-center opacity-50 min-h-[400px]">
             <span className="text-4xl mb-4">📡</span>
             <h3 className="text-2xl font-black uppercase mb-2">New Channel</h3>
             <p className="font-medium text-sm tracking-widest uppercase">Transmitting Soon</p>
          </article>

        </div>
      </section>
    </div>
  );
}
