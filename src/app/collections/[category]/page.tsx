import Link from 'next/link';
import { podcasts } from '@/lib/data';

const categoryMap: Record<string, string> = {
  'startups': 'Startups & VC',
  'tech': 'Tech & AI',
  'society': 'Society & Law',
  'health': 'Health & Mind',
  'creators': 'Creators',
  'economics': 'Economics'
};

export default async function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  const title = categoryMap[category] || category.replace('-', ' ');
  
  const filteredPodcasts = podcasts.filter(p => 
    p.tags.some(tag => tag === categoryMap[category]) || 
    p.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
  );

  return (
    <div className="w-full bg-wtf-cream min-h-screen">
      
      {/* Header */}
      <section className="border-b-4 border-wtf-black relative overflow-hidden bg-wtf-white py-24">
        {/* Aesthetic grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Random small scattered shapes */}
        <div className="absolute z-0 w-3 h-3 bg-wtf-orange border border-wtf-black top-20 right-[15%] rotate-[25deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute z-0 w-4 h-4 bg-[#3B82F6] border border-wtf-black bottom-16 left-[10%] rotate-[50deg] hidden md:block"></div>
        <div className="absolute z-0 w-5 h-1 bg-wtf-black top-[40%] right-[25%] rotate-[60deg] hidden md:block"></div>
        <div className="absolute z-0 w-3 h-3 bg-wtf-white border border-wtf-black top-[25%] left-[25%] rotate-[15deg] hidden md:block"></div>
        <div className="absolute z-0 w-4 h-4 bg-wtf-orange border border-wtf-black bottom-[30%] right-[8%] rotate-[70deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute z-0 w-5 h-1 bg-wtf-black opacity-40 bottom-20 left-[30%] rotate-[40deg] hidden md:block"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-start">
          <Link href="/archives" className="inline-flex items-center gap-2 border-2 border-wtf-black text-wtf-black px-5 py-2 text-sm font-bold mb-12 tracking-widest uppercase bg-wtf-orange shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] focus:outline-none transition-all">
            ← Back to Archives
          </Link>
          <div className="inline-block border-2 border-wtf-black px-4 py-1 text-xs font-bold mb-6 tracking-widest uppercase bg-wtf-black text-wtf-white shadow-[4px_4px_0px_#F97316]">
            Collection
          </div>
          <h1 className="text-6xl md:text-[7rem] font-black leading-none uppercase tracking-tighter text-wtf-black mb-6">
            {title}.
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl leading-relaxed text-wtf-black opacity-80">
            A curated network of foundational shows and long-form dialogues specifically interrogating <span className="font-black">{title.toLowerCase()}</span>.
          </p>
        </div>
      </section>

      {/* Shows Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-wtf-black">{filteredPodcasts.length} Networks Found</h2>
          <div className="flex-1 h-1 bg-wtf-black"></div>
        </div>
        
        {filteredPodcasts.length > 0 ? (
          <div className="flex flex-col gap-12">
             {filteredPodcasts.map((podcast) => (
                <Link href={podcast.id === 'wtf-podcast' ? '/wtf?from=archives' : podcast.id === 'figuring-out' ? '/figuring-out?from=archives' : '#'} key={podcast.id} className="group relative flex flex-col md:flex-row border-4 border-wtf-black bg-wtf-white shadow-[8px_8px_0px_#000] hover:-translate-y-2 hover:shadow-[16px_16px_0px_#000] transition-all">
                   
                   {/* Cover Art */}
                   <div className={`w-full md:w-[340px] shrink-0 border-b-4 md:border-b-0 md:border-r-4 border-wtf-black ${podcast.coverColor} p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden`}>
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-wtf-white opacity-15 rotate-12 border-4 border-wtf-black"></div>
                      <div className="absolute top-6 right-6 w-8 h-8 bg-wtf-black opacity-10 rounded-full"></div>
                      
                      <span className="font-black uppercase tracking-widest border-2 border-wtf-black px-3 py-1 bg-wtf-white text-wtf-black self-start shadow-[3px_3px_0px_#000] text-xs">Network</span>
                      
                      <div>
                        <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none ${podcast.textColor} relative z-10 break-words mb-3`}>{podcast.title}</h3>
                        <div className="w-16 h-1 bg-wtf-black opacity-40"></div>
                      </div>
                   </div>

                   {/* Info Panel */}
                   <div className="p-8 md:p-12 flex flex-col flex-1 justify-center relative overflow-hidden">
                      {/* Background Decorative Cross */}
                      <div className="absolute opacity-[0.03] top-8 right-8 w-40 h-40 border-4 border-wtf-black rotate-12 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-3 bg-wtf-black absolute"></div>
                        <div className="h-full w-3 bg-wtf-black absolute"></div>
                      </div>

                      <div className="border-2 border-wtf-black px-4 py-1 text-xs font-bold tracking-widest uppercase bg-wtf-cream text-wtf-black self-start mb-6 shadow-[2px_2px_0px_#000]">
                         Hosted by <span className="font-black">{podcast.host}</span>
                      </div>
                      
                      <p className="text-xl md:text-2xl font-medium leading-relaxed text-wtf-black mb-10 max-w-2xl relative z-10">
                         {podcast.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                         {podcast.tags.map(tag => (
                            <span key={tag} className="border-2 border-wtf-black px-3 py-1 font-bold text-xs tracking-widest uppercase bg-wtf-white text-wtf-black shadow-[2px_2px_0px_#000]">
                               {tag}
                            </span>
                         ))}
                      </div>

                      {/* Explore CTA */}
                      <div className="mt-8 pt-6 border-t-2 border-wtf-black flex items-center gap-3">
                         <span className="font-black text-sm uppercase tracking-widest text-wtf-black group-hover:text-wtf-orange transition-colors">Explore Network →</span>
                      </div>
                   </div>
                </Link>
             ))}
          </div>
        ) : (
          <div className="text-center py-24 border-4 border-wtf-black bg-wtf-white shadow-[8px_8px_0px_#000]">
            <div className="w-16 h-16 bg-wtf-orange rounded-full border-4 border-wtf-black mx-auto mb-8 flex items-center justify-center">
               <span className="text-3xl font-black">?</span>
            </div>
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-wtf-black">No Networks Deployed</h3>
            <p className="text-xl font-medium opacity-70 max-w-lg mx-auto">This frequency range is currently inactive. New transmissions are being recorded and will be indexed here soon.</p>
            <Link href="/archives" className="inline-block mt-10 border-4 border-wtf-black bg-wtf-orange px-8 py-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all">
              Return to Archives
            </Link>
          </div>
        )}
      </section>

    </div>
  );
}
