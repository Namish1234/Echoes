import Link from 'next/link';
import { podcasts } from '@/lib/data';

export default function PodcastsPage() {
  return (
    <div className="w-full">
      
      {/* Hero */}
      <section className="border-b-4 border-wtf-black relative overflow-hidden bg-wtf-cream">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Random scattered shapes */}
        <div className="absolute z-0 w-3 h-3 bg-wtf-orange border border-wtf-black top-16 right-[20%] rotate-[35deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute z-0 w-4 h-4 bg-[#3B82F6] border border-wtf-black bottom-20 left-[12%] rotate-[50deg] hidden md:block"></div>
        <div className="absolute z-0 w-5 h-1 bg-wtf-black top-[40%] right-[30%] rotate-[55deg] hidden md:block"></div>
        <div className="absolute z-0 w-3 h-3 bg-wtf-orange rounded-full border border-wtf-black top-[25%] left-[40%] hidden md:block"></div>
        <div className="absolute z-0 w-4 h-4 bg-[#3B82F6] border border-wtf-black bottom-[30%] right-[10%] rotate-[65deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>

        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10 flex flex-col items-start">
          <div className="inline-block border-2 border-wtf-black px-4 py-1 text-xs font-bold mb-8 tracking-widest uppercase bg-wtf-black text-wtf-white shadow-[4px_4px_0px_#F97316]">
            Full Directory
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black leading-none uppercase tracking-tighter text-wtf-black mb-6">
            Podcasts.
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl leading-relaxed text-wtf-black opacity-80">
            The complete catalog of every show archived on the Echoes platform. Raw conversations, deep dives, and unfiltered narratives from the sharpest minds.
          </p>
        </div>
      </section>

      {/* Podcasts List */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-wtf-black whitespace-nowrap">{podcasts.filter(p => p.id === 'wtf-podcast' || p.id === 'figuring-out').length} Active Shows</h2>
          <div className="flex-1 h-1 bg-wtf-black"></div>
        </div>

        <div className="flex flex-col gap-12">
          
          {/* WTF Podcast */}
          <Link href="/wtf?from=podcasts" className="group">
            <article className="zine-border bg-wtf-white shadow-zine-lg hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all flex flex-col md:flex-row overflow-hidden">
              <div className="bg-wtf-black text-wtf-white p-10 md:p-16 flex items-center justify-center relative overflow-hidden w-full md:w-[400px] shrink-0">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <h3 className="relative z-10 text-6xl font-black uppercase tracking-tighter text-center">WTF<br/><span className="text-wtf-orange">Podcast</span></h3>
              </div>
              <div className="p-8 md:p-12 flex flex-col flex-1 justify-center">
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Business</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Tech</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Startups</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Economics</span>
                </div>
                <h4 className="text-3xl font-black uppercase tracking-tight mb-3">The WTF Podcast</h4>
                <p className="font-medium text-lg opacity-80 leading-relaxed mb-6">
                  Hosted by <span className="font-black">Nikhil Kamath</span>. Deep, unscripted explorations with founders, builders, and visionaries shaping the future. Featuring deep-dives into Indian entrepreneurship and global macro trends.
                </p>
                <div className="flex justify-between items-center border-t-2 border-dashed border-wtf-black pt-4">
                  <span className="font-black uppercase text-sm tracking-widest">20 Episodes Archived</span>
                  <span className="font-black text-wtf-orange group-hover:text-wtf-black transition-colors text-lg">EXPLORE →</span>
                </div>
              </div>
            </article>
          </Link>

          {/* Figuring Out */}
          <Link href="/figuring-out?from=podcasts" className="group">
            <article className="zine-border bg-wtf-white shadow-zine-lg hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all flex flex-col md:flex-row overflow-hidden">
              <div className="bg-[#3B82F6] text-wtf-white p-10 md:p-16 flex items-center justify-center relative overflow-hidden w-full md:w-[400px] shrink-0">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <h3 className="relative z-10 text-6xl font-black uppercase tracking-tighter text-center">Figuring<br/><span className="text-wtf-black">Out</span></h3>
              </div>
              <div className="p-8 md:p-12 flex flex-col flex-1 justify-center">
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Growth</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Leadership</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Life</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Creators</span>
                </div>
                <h4 className="text-3xl font-black uppercase tracking-tight mb-3">Figuring Out</h4>
                <p className="font-medium text-lg opacity-80 leading-relaxed mb-6">
                  Hosted by <span className="font-black">Raj Shamani</span>. An authoritative guide to business, relationships, politics, and health — figuring out how to grow daily to live and love better. 400M+ views/year.
                </p>
                <div className="flex justify-between items-center border-t-2 border-dashed border-wtf-black pt-4">
                  <span className="font-black uppercase text-sm tracking-widest">484+ Episodes</span>
                  <span className="font-black text-[#3B82F6] group-hover:text-wtf-black transition-colors text-lg">EXPLORE →</span>
                </div>
              </div>
            </article>
          </Link>

        </div>

        {/* More Coming Soon */}
        <div className="mt-16 border-4 border-dashed border-wtf-black p-12 text-center opacity-50">
          <span className="text-4xl mb-4 block">📡</span>
          <h3 className="text-2xl font-black uppercase mb-2">More Shows Coming Soon</h3>
          <p className="font-medium text-sm tracking-widest uppercase">New channels are being calibrated for transmission</p>
        </div>
      </section>

    </div>
  );
}
