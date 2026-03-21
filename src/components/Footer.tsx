import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-wtf-cream border-t-4 border-wtf-black pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <h2 className="text-7xl font-black mb-6">ECHOES<span className="text-wtf-orange">.</span></h2>
            <p className="max-w-md font-medium text-lg leading-snug">
              A digital archive platform for the curious, the ambitious, and the visionaries of Bharat. Curating humanity's boldest conversations across multiple channels.
            </p>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-widest text-sm mb-6 underline decoration-wtf-orange decoration-4 underline-offset-4">Explore</h5>
            <ul className="space-y-3 font-bold text-sm">
              <li><Link className="hover:text-wtf-orange" href="/podcasts">Full Catalog</Link></li>
              <li><Link className="hover:text-wtf-orange" href="/wtf">WTF Podcast</Link></li>
              <li><Link className="hover:text-wtf-orange" href="/figuring-out">Figuring Out</Link></li>
              <li><Link className="hover:text-wtf-orange" href="/builders-log">Builder's Log</Link></li>
              <li><Link className="hover:text-wtf-orange" href="/mind-matter">Mind & Matter</Link></li>
              <li><Link className="hover:text-wtf-orange" href="/creator-capital">Creator Capital</Link></li>
              <li><Link className="hover:text-wtf-orange" href="/archives">Archives</Link></li>
              <li><Link className="hover:text-wtf-orange" href="/lexicon">The Lexicon</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-widest text-sm mb-6 underline decoration-wtf-orange decoration-4 underline-offset-4">Socials</h5>
            <ul className="space-y-3 font-bold text-sm">
              <li><Link className="hover:text-wtf-orange" href="#">YouTube</Link></li>
              <li><Link className="hover:text-wtf-orange" href="#">Spotify</Link></li>
              <li><Link className="hover:text-wtf-orange" href="#">Twitter / X</Link></li>
              <li><Link className="hover:text-wtf-orange" href="#">LinkedIn</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t-4 border-wtf-black pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black uppercase tracking-widest">
          <p>© 2024 Echoes Platform. All rights reserved.</p>
          <p>Curating the voice of the future</p>
          <div className="flex gap-6">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
