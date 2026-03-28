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
      <section className="relative overflow-hidden py-16 md:py-28" style={{ borderBottom: '1px dashed var(--border-color)' }}>
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
      <section style={{ borderTop: '1px dashed var(--border-color)' }}>
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
      return <MindmapDisplay section={section} accentColor={accentColor} />;

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

// ── Visual Mindmap Display ──

const CAT_COLORS: Record<string, string> = {
  core: '#FF6B00', tech: '#3B82F6', phil: '#8B5CF6', biz: '#22C55E', example: '#6B7280',
};

function MindmapDisplay({ section, accentColor }: { section: { type: 'mindmap'; id: string; centralTopic: string; nodes: { id: string; label: string; category: string; children?: string[] }[] }, accentColor: string }) {
  const nodes = section.nodes;
  const W = 680, H = 380;
  const cx = W / 2, cy = H / 2;

  // Build positions radially
  const positions: Record<string, { x: number; y: number }> = {};
  const childIds = new Set(nodes.flatMap(n => n.children || []));
  const root = nodes.find(n => !childIds.has(n.id)) || nodes[0];
  if (!root) return null;

  positions[root.id] = { x: cx, y: cy };
  const rootKids = (root.children || []).filter(c => nodes.find(n => n.id === c));
  const R = Math.min(W, H) * 0.3;
  rootKids.forEach((cid, i) => {
    const angle = -Math.PI / 2 + (i / Math.max(1, rootKids.length)) * 2 * Math.PI;
    const node = nodes.find(n => n.id === cid);
    positions[cid] = { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
    if (node) {
      (node.children || []).forEach((gcid, j) => {
        const ga = angle + (j - ((node.children || []).length - 1) / 2) * 0.6;
        positions[gcid] = {
          x: Math.max(60, Math.min(W - 60, cx + R * 1.7 * Math.cos(ga))),
          y: Math.max(30, Math.min(H - 30, cy + R * 1.7 * Math.sin(ga))),
        };
      });
    }
  });
  // Orphans
  let oi = 0;
  nodes.forEach(n => {
    if (!positions[n.id]) {
      const a = (oi / Math.max(1, nodes.length)) * 2 * Math.PI;
      positions[n.id] = { x: cx + R * 1.1 * Math.cos(a), y: cy + R * 1.1 * Math.sin(a) };
      oi++;
    }
  });

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ color: 'var(--text-primary)' }}>
        Mind Map<span style={{ color: accentColor }}>.</span>
      </h2>
      <div className="zine-border overflow-hidden relative" style={{ backgroundColor: 'var(--surface)', height: H }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="mm-arrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="var(--border-color)" opacity="0.5" />
            </marker>
          </defs>
          {nodes.map(node =>
            (node.children || []).map(cid => {
              const f = positions[node.id], t = positions[cid];
              if (!f || !t) return null;
              const mx = (f.x + t.x) / 2, my = (f.y + t.y) / 2 - 25;
              return (
                <path key={`${node.id}-${cid}`}
                  d={`M ${f.x} ${f.y} C ${mx} ${my}, ${mx} ${my}, ${t.x} ${t.y}`}
                  fill="none" stroke={CAT_COLORS[node.category] || '#999'}
                  strokeWidth={1.5} strokeDasharray="4 3" opacity={0.45}
                  markerEnd="url(#mm-arrow)"
                />
              );
            })
          )}
        </svg>
        {nodes.map(node => {
          const pos = positions[node.id];
          if (!pos) return null;
          const isRoot = node.id === root.id;
          const color = CAT_COLORS[node.category] || '#999';
          return (
            <div key={node.id} className="absolute flex items-center justify-center"
              style={{ left: pos.x, top: pos.y, transform: 'translate(-50%,-50%)', zIndex: 10 }}>
              <div className="px-3 py-1.5 rounded-sm border-2 text-center"
                style={{
                  backgroundColor: isRoot ? color : `${color}18`,
                  borderColor: color,
                  minWidth: isRoot ? 100 : 72,
                  maxWidth: 140,
                  boxShadow: isRoot ? `0 2px 8px ${color}44` : '1px 1px 4px rgba(0,0,0,0.1)',
                }}>
                <span className="text-xs font-black leading-tight block" style={{ color: isRoot ? '#fff' : color }}>
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex gap-4 flex-wrap mt-3">
        {Object.entries(CAT_COLORS).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: v }} />{k}
          </span>
        ))}
      </div>
    </section>
  );
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
