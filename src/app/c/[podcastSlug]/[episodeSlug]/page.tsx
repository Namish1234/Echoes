'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPodcastBySlug, getEpisodeBySlug } from '@/lib/creatorService';
import type { CreatorPodcast, CreatorEpisode, EpisodeSection } from '@/lib/creatorTypes';
import CommentSection from '@/components/CommentSection';

export default function PublicEpisodePage() {
  const params = useParams();
  const podcastSlug = params.podcastSlug as string;
  const episodeSlug = params.episodeSlug as string;

  const [podcast, setPodcast] = useState<CreatorPodcast | null>(null);
  const [episode, setEpisode] = useState<CreatorEpisode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getPodcastBySlug(podcastSlug);
      if (p) {
        setPodcast(p);
        const ep = await getEpisodeBySlug(p.id, episodeSlug);
        setEpisode(ep);
      }
      setLoading(false);
    }
    load();
  }, [podcastSlug, episodeSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-bold uppercase tracking-widest animate-pulse" style={{ color: 'var(--text-primary)' }}>Loading...</span>
      </div>
    );
  }

  if (!podcast || !episode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-3xl font-black uppercase" style={{ color: 'var(--text-primary)' }}>Episode Not Found</h2>
        <Link href={`/c/${podcastSlug}`} className="font-bold" style={{ color: 'var(--color-wtf-orange)' }}>← Back to Podcast</Link>
      </div>
    );
  }

  const ac = podcast.accentColor;
  const toa = podcast.textOnAccent === 'white' ? '#fff' : '#000';

  return (
    <div className="min-h-screen w-full">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-28 border-b-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, var(--border-color) 1px, transparent 1px), linear-gradient(to bottom, var(--border-color) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}></div>
        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: ac }}></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link href={`/c/${podcastSlug}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6 opacity-60 hover:opacity-100 transition-all" style={{ color: 'var(--text-primary)' }}>
            ← {podcast.title}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 font-black text-lg" style={{ backgroundColor: ac, color: toa }}>EP {episode.number}</span>
            {episode.duration && <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{episode.duration}</span>}
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{episode.date}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-4" style={{ color: 'var(--text-primary)' }}>
            {episode.title}<span style={{ color: ac }}>.</span>
          </h1>
          {episode.guest && (
            <p className="text-lg font-bold uppercase tracking-widest" style={{ color: ac }}>
              Featuring {episode.guest}
            </p>
          )}
          {episode.description && (
            <p className="text-base font-medium mt-4 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{episode.description}</p>
          )}
        </div>
      </section>

      {/* Dynamic Sections */}
      {episode.sections.map((section, index) => (
        <div key={section.id}>
          <SectionRenderer section={section} accentColor={ac} textOnAccent={toa} />
          {index < episode.sections.length - 1 && (
            <div className="max-w-4xl mx-auto px-6">
              <div 
                className="w-full h-0 border-t-4 border-dashed opacity-20 my-8 md:my-16" 
                style={{ borderColor: 'var(--border-color)' }}
              ></div>
            </div>
          )}
        </div>
      ))}

      {/* Comments */}
      <section className="border-t-4" style={{ borderColor: 'var(--border-color)' }}>
        <CommentSection episodeId={episode.id} accentColor={ac} />
      </section>
    </div>
  );
}

// ── Dynamic Section Renderer ──

function SectionRenderer({ section, accentColor, textOnAccent }: {
  section: EpisodeSection;
  accentColor: string;
  textOnAccent: string;
}) {
  switch (section.type) {
    case 'summary':
      return (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="zine-border p-8 relative" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: accentColor }}></div>
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 pl-4" style={{ color: 'var(--text-primary)' }}>Summary</h2>
            <div className="pl-4 text-base font-medium leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
              {section.content}
            </div>
          </div>
        </section>
      );

    case 'sixty-second':
      return (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2" style={{ color: 'var(--text-primary)' }}>{section.heading}<span style={{ color: accentColor }}>.</span></h2>
          {section.subheading && <p className="text-sm font-medium mb-8" style={{ color: 'var(--text-muted)' }}>{section.subheading}</p>}

          {section.paragraphs.map((p, i) => (
            <div key={i} className={`flex flex-col ${p.imagePosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 mb-8`}>
              <div className="flex-1">
                <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.text}</p>
              </div>
              {p.imageUrl && (
                <div className="w-full md:w-64 shrink-0">
                  <img src={p.imageUrl} alt={p.imageCaption || ''} className="w-full zine-border shadow-zine" />
                  {p.imageCaption && <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-center" style={{ color: 'var(--text-muted)' }}>{p.imageCaption}</p>}
                </div>
              )}
            </div>
          ))}

          {section.takeaway && (
            <div className="zine-border p-5 mt-4" style={{ backgroundColor: `${accentColor}10`, borderColor: accentColor }}>
              <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: accentColor }}>Key Takeaway</p>
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{section.takeaway}</p>
            </div>
          )}
        </section>
      );

    case 'key-lessons':
      return (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2" style={{ color: 'var(--text-primary)' }}>{section.heading}<span style={{ color: accentColor }}>.</span></h2>
          {section.subheading && <p className="text-sm font-medium mb-8" style={{ color: 'var(--text-muted)' }}>{section.subheading}</p>}

          <div className="space-y-4">
            {section.lessons.map((lesson, i) => (
              <LessonCard key={i} lesson={lesson} index={i} accentColor={accentColor} />
            ))}
          </div>
        </section>
      );

    case 'polaroids':
      return (
        <section className="py-12 border-y-4 my-8" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface)' }}>
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ color: 'var(--text-primary)' }}>{section.heading}<span style={{ color: accentColor }}>.</span></h2>
            {section.highlights.length > 0 && (
              <ul className="mb-8 space-y-1">
                {section.highlights.filter(h => h).map((h, i) => (
                  <li key={i} className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap justify-center gap-8">
              {section.images.map((img, i) => (
                <div key={i} className="bg-white p-3 shadow-[6px_6px_0px_rgba(0,0,0,0.15)]" style={{ transform: img.rotation }}>
                  <img src={img.imageUrl} alt={img.name} className="w-40 h-48 object-cover" />
                  <div className="mt-2 text-center">
                    <p className="text-sm font-black text-black">{img.name}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{img.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'mindmap':
      return (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ color: 'var(--text-primary)' }}>
            Mind Map<span style={{ color: accentColor }}>.</span>
          </h2>
          <div className="zine-border p-6" style={{ backgroundColor: 'var(--surface)' }}>
            <p className="text-center font-black text-lg uppercase mb-6" style={{ color: accentColor }}>{section.centralTopic}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {section.nodes.map(node => {
                const catColors: Record<string, string> = { core: '#FF6B00', tech: '#3B82F6', phil: '#8B5CF6', biz: '#22C55E', example: '#6B7280' };
                return (
                  <div key={node.id} className="zine-border px-4 py-2 text-sm font-bold" style={{ borderColor: catColors[node.category], color: 'var(--text-primary)', borderLeftWidth: '4px' }}>
                    {node.label}
                    {node.children && node.children.length > 0 && (
                      <span className="text-[10px] font-bold ml-2 px-1 rounded-full" style={{ backgroundColor: catColors[node.category], color: '#fff' }}>{node.children.length}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );

    case 'quote':
      return (
        <section className="py-16 border-y-4 my-8" style={{ borderColor: 'var(--border-color)' }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="text-6xl mb-4 opacity-20" style={{ color: accentColor }}>&ldquo;</div>
            <blockquote className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              {section.text}
            </blockquote>
            {section.attribution && (
              <cite className="text-sm font-bold uppercase tracking-widest not-italic" style={{ color: accentColor }}>
                {section.attribution}
              </cite>
            )}
          </div>
        </section>
      );

    case 'stats':
      return (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {section.cards.map((card, i) => (
              <div key={i} className="zine-border p-5 relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: card.color }}></div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1 pt-1" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
                <p className="text-3xl font-black mb-1" style={{ color: card.color }}>{card.value}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{card.description}</p>
              </div>
            ))}
          </div>
        </section>
      );

    case 'custom-text':
      return (
        <section className="max-w-4xl mx-auto px-6 py-12">
          {section.heading && (
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ color: 'var(--text-primary)' }}>
              {section.heading}<span style={{ color: accentColor }}>.</span>
            </h2>
          )}
          <div className="text-base font-medium leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
            {section.content}
          </div>
        </section>
      );

    default:
      return null;
  }
}

// ── Lesson Card with expand/collapse ──

function LessonCard({ lesson, index, accentColor }: { lesson: { context: string; summary: string }; index: number; accentColor: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="zine-border overflow-hidden transition-all hover:shadow-[4px_4px_0px_var(--border-color)]" style={{ backgroundColor: 'var(--surface)' }}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left flex items-center gap-4 p-5 cursor-pointer">
        <span className="w-8 h-8 flex items-center justify-center font-black text-sm shrink-0" style={{ backgroundColor: accentColor, color: '#000' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-black uppercase tracking-tight text-base flex-1" style={{ color: 'var(--text-primary)' }}>
          {lesson.context}
        </span>
        <span className="text-lg" style={{ color: 'var(--text-muted)' }}>{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="px-5 pb-5 pt-0 border-t-2 border-dashed" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-sm font-medium leading-relaxed pt-4" style={{ color: 'var(--text-secondary)' }}>{lesson.summary}</p>
        </div>
      )}
    </div>
  );
}
