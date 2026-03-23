import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="w-full bg-wtf-cream min-h-screen">
      {/* Hero Section */}
      <section className="border-b-4 border-wtf-black relative overflow-hidden bg-wtf-cream">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-block border-2 border-wtf-black text-wtf-black px-4 py-1 text-xs font-bold mb-6 tracking-widest uppercase bg-wtf-white shadow-[4px_4px_0px_#000]">
              The Echoes Objective
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-none uppercase tracking-tighter text-wtf-black mb-6">
              Who We <br/><span className="text-wtf-orange">Are.</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium leading-snug text-wtf-black opacity-90">
              Echoes is not just a podcast network. It is a digital archive meticulously documenting the raw, unfiltered conversations of humanity's boldest builders and visionaries. 
            </p>
          </div>
          <div className="flex-1 border-4 border-wtf-black p-4 bg-wtf-white shadow-zine-lg rotate-1 hidden md:block">
            <div className="bg-wtf-black w-full h-[300px] flex justify-center items-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line-inv) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line-inv) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               <span className="text-wtf-white font-black text-4xl uppercase absolute z-10 text-center">Curating<br/>The Future</span>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Service Section */}
      <section className="w-full border-b-4 border-wtf-black bg-wtf-white">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 text-wtf-orange drop-shadow-sm">Our Impact</h2>
              <p className="font-medium text-lg leading-relaxed text-wtf-black mb-6">
                We believe that the stories of builders shouldn't be trapped behind PR walls. The Echoes platform breaks down hours of dense, intellectual discussion into actionable transcripts, summaries, and visual mindmaps.
              </p>
              <p className="font-medium text-lg leading-relaxed text-wtf-black">
                By doing so, we democratize access to high-level mentorship, giving the next generation of founders, engineers, and creatives the exact blueprints they need to execute.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="border-t-4 border-wtf-black pt-4">
                <h3 className="text-6xl font-black text-wtf-black mb-2">50+</h3>
                <span className="uppercase font-bold tracking-widest text-xs opacity-70">Visionaries Logged</span>
              </div>
              <div className="border-t-4 border-wtf-black pt-4">
                <h3 className="text-6xl font-black text-wtf-black mb-2">1M+</h3>
                <span className="uppercase font-bold tracking-widest text-xs opacity-70">Learners Reached</span>
              </div>
              <div className="border-t-4 border-wtf-black pt-4">
                <h3 className="text-6xl font-black text-wtf-black mb-2">100+</h3>
                <span className="uppercase font-bold tracking-widest text-xs opacity-70">Hours Archived</span>
              </div>
              <div className="border-t-4 border-wtf-black pt-4">
                <h3 className="text-6xl font-black text-wtf-black mb-2">∞</h3>
                <span className="uppercase font-bold tracking-widest text-xs opacity-70">Actionable Ideas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline & Roadmap */}
      <section className="w-full border-b-4 border-wtf-black bg-wtf-cream">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16 text-center">Timeline & Roadmap</h2>
          
          <div className="relative border-l-4 border-wtf-black ml-4 md:mx-auto md:w-1/2">
            
            {/* 2023 */}
            <div className="mb-12 relative pl-8">
              <span className="absolute -left-[14px] top-1 w-6 h-6 rounded-full bg-wtf-orange border-4 border-wtf-black"></span>
              <h3 className="text-2xl font-black uppercase mb-2 text-wtf-black">2023: The Genesis</h3>
              <p className="font-medium text-wtf-black opacity-80">Started to explore unadulterated conversations. Quickly built a massive audience hungry for dense, raw content.</p>
            </div>

            {/* 2024 */}
            <div className="mb-12 relative pl-8">
              <span className="absolute -left-[14px] top-1 w-6 h-6 rounded-full bg-wtf-orange border-4 border-wtf-black"></span>
              <h3 className="text-2xl font-black uppercase mb-2 text-wtf-black">2024: Digital Archives</h3>
              <p className="font-medium text-wtf-black opacity-80">Evolved into the Echoes Platform. Transcripts, mindmaps, and actionable highlights were introduced to elevate the learning experience.</p>
            </div>

            {/* 2025 */}
            <div className="mb-12 relative pl-8">
              <span className="absolute -left-[14px] top-1 w-6 h-6 rounded-full bg-wtf-white border-4 border-wtf-black"></span>
              <h3 className="text-2xl font-black uppercase mb-2 text-wtf-black opacity-60">2025: Network Expansion</h3>
              <p className="font-medium text-wtf-black opacity-60">Fostering deep-dive channels spanning AI, synthetic biology, and global economics with dedicated domain-expert hosts.</p>
            </div>

            {/* Next */}
            <div className="relative pl-8">
              <span className="absolute -left-[14px] top-1 w-6 h-6 rounded-full bg-wtf-black border-4 border-wtf-black animate-pulse"></span>
              <h3 className="text-2xl font-black uppercase mb-2 text-wtf-black opacity-40">Beyond: The Global Syllabus</h3>
              <p className="font-medium text-wtf-black opacity-40">Translating these archives into university-grade curriculums accessible to the next billion learners worldwide.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Curated Gallery */}
      <section className="w-full bg-wtf-black text-wtf-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end border-b-4 border-wtf-white pb-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Behind The Lens</h2>
            <span className="font-bold uppercase tracking-widest text-sm opacity-50 hidden md:block">Curated Archives</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Gallery images utilizing placeholders to fit aesthetic */}
             <div className="col-span-1 md:col-span-2 aspect-[16/9] zine-border bg-wtf-white relative group overflow-hidden">
               <Image unoptimized src="https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=1200&h=800&fit=crop" fill alt="Studio setup" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
             </div>
             
             <div className="col-span-1 aspect-square md:aspect-auto zine-border bg-wtf-white relative group overflow-hidden">
               <Image unoptimized src="https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?w=600&h=800&fit=crop" fill alt="Microphone" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
             </div>
             
             <div className="col-span-1 aspect-square zine-border bg-wtf-white relative group overflow-hidden">
               <Image unoptimized src="https://images.unsplash.com/photo-1499914485622-a88fac536970?w=600&h=600&fit=crop" fill alt="Creative session" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
             </div>

             <div className="col-span-1 md:col-span-2 aspect-[16/9] md:aspect-auto zine-border bg-wtf-white relative group overflow-hidden">
               <Image unoptimized src="https://images.unsplash.com/photo-1542435503-956c469968f8?w=1200&h=600&fit=crop" fill alt="Live discussion" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}
