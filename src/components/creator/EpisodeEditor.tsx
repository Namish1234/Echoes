'use client';

import { useState, useRef, useCallback } from 'react';
import type {
  EpisodeSection,
  SummarySection,
  SixtySecondSection,
  KeyLessonsSection,
  PolaroidSection,
  MindmapSection,
  QuoteSection,
  StatsSection,
  CustomTextSection,
} from '@/lib/creatorTypes';
import { generateSectionId } from '@/lib/creatorTypes';
import PolaroidUploader from './PolaroidUploader';
import MindmapBuilder from './MindmapBuilder';
import { uploadImage } from '@/lib/creatorService';

// ── Section palette items ──
const SECTION_TYPES = [
  { type: 'summary', label: 'Summary', icon: '📝', desc: 'Episode summary text' },
  { type: 'sixty-second', label: '60-Second', icon: '⏱️', desc: 'Quick breakdown with images' },
  { type: 'key-lessons', label: 'Key Lessons', icon: '💡', desc: 'Expandable lesson cards' },
  { type: 'polaroids', label: 'Polaroids', icon: '📸', desc: 'Guest photo gallery' },
  { type: 'mindmap', label: 'Mind Map', icon: '🗺️', desc: 'Interactive concept map' },
  { type: 'quote', label: 'Quote', icon: '💬', desc: 'Notable quote block' },
  { type: 'stats', label: 'Stats', icon: '📊', desc: 'Breakdown stat cards' },
  { type: 'custom-text', label: 'Custom Text', icon: '✏️', desc: 'Free-form text block' },
] as const;

interface Props {
  sections: EpisodeSection[];
  onChange: (sections: EpisodeSection[]) => void;
  accentColor: string;
  textOnAccent: string;
}

function createDefaultSection(type: string): EpisodeSection {
  const id = generateSectionId();
  switch (type) {
    case 'summary': return { type: 'summary', id, content: '' } as SummarySection;
    case 'sixty-second': return { type: 'sixty-second', id, heading: 'The 60-Second Breakdown', subheading: '', paragraphs: [{ text: '', imageUrl: '', imageCaption: '', imagePosition: 'right' }], takeaway: '' } as SixtySecondSection;
    case 'key-lessons': return { type: 'key-lessons', id, heading: 'Key Lessons', subheading: '', lessons: [{ context: '', summary: '', align: 'left' }] } as KeyLessonsSection;
    case 'polaroids': return { type: 'polaroids', id, heading: 'The Faces Behind the Story', highlights: [''], images: [] } as PolaroidSection;
    case 'mindmap': return { type: 'mindmap', id, centralTopic: '', nodes: [] } as MindmapSection;
    case 'quote': return { type: 'quote', id, text: '', attribution: '' } as QuoteSection;
    case 'stats': return { type: 'stats', id, cards: [{ label: '', value: '', description: '', color: '#FF6B00' }] } as StatsSection;
    case 'custom-text': return { type: 'custom-text', id, heading: '', content: '' } as CustomTextSection;
    default: return { type: 'custom-text', id, heading: '', content: '' } as CustomTextSection;
  }
}

export default function EpisodeEditor({ sections, onChange, accentColor, textOnAccent }: Props) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragRef = useRef<number | null>(null);

  const addSection = (type: string) => {
    const section = createDefaultSection(type);
    onChange([...sections, section]);
    setExpandedSection(section.id);
  };

  const updateSection = useCallback((id: string, data: Partial<EpisodeSection>) => {
    onChange(sections.map(s => s.id === id ? { ...s, ...data } as EpisodeSection : s));
  }, [sections, onChange]);

  const removeSection = (id: string) => {
    onChange(sections.filter(s => s.id !== id));
    if (expandedSection === id) setExpandedSection(null);
  };

  const moveSection = (from: number, to: number) => {
    const updated = [...sections];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  // Drag handlers for reordering
  const handleDragStart = (index: number) => { dragRef.current = index; };
  const handleDragOver = (e: React.DragEvent, index: number) => { e.preventDefault(); setDragOverIndex(index); };
  const handleDragLeave = () => { setDragOverIndex(null); };
  const handleDrop = (index: number) => {
    if (dragRef.current !== null && dragRef.current !== index) {
      moveSection(dragRef.current, index);
    }
    dragRef.current = null;
    setDragOverIndex(null);
  };

  return (
    <div className="flex gap-4 flex-col lg:flex-row">
      {/* Section Palette — Left Sidebar */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-4">
          <h3 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            Section Blocks — Click to Add
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {SECTION_TYPES.map(st => (
              <button
                key={st.type}
                onClick={() => addSection(st.type)}
                className="flex items-center gap-3 p-3 zine-border text-left transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)] cursor-pointer"
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <span className="text-xl">{st.icon}</span>
                <div>
                  <p className="text-xs font-black uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{st.label}</p>
                  <p className="text-[10px] font-medium hidden lg:block" style={{ color: 'var(--text-muted)' }}>{st.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas — Main Area */}
      <div className="flex-1 min-h-[500px]">
        {sections.length === 0 ? (
          <div className="zine-border border-dashed p-16 text-center" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
            <div className="text-5xl mb-4 opacity-30">🧩</div>
            <h3 className="font-black uppercase tracking-tight text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Drop Sections Here</h3>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Click section blocks on the left to add them to your episode. Drag to reorder.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(index)}
                className={`zine-border transition-all ${dragOverIndex === index ? 'border-2 -translate-y-1 shadow-[6px_6px_0px_var(--border-color)]' : ''}`}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: dragOverIndex === index ? accentColor : undefined,
                }}
              >
                {/* Section Header — always visible */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                >
                  <span className="cursor-grab opacity-40 text-lg" title="Drag to reorder">⠿</span>
                  <span className="text-lg">{SECTION_TYPES.find(s => s.type === section.type)?.icon}</span>
                  <span className="font-black uppercase tracking-tight text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
                    {SECTION_TYPES.find(s => s.type === section.type)?.label}
                    <span className="font-medium text-[10px] ml-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      {expandedSection === section.id ? '▲ collapse' : '▼ expand'}
                    </span>
                  </span>
                  <div className="flex gap-1">
                    {index > 0 && (
                      <button onClick={e => { e.stopPropagation(); moveSection(index, index - 1); }} className="px-2 py-1 text-xs opacity-40 hover:opacity-100 cursor-pointer">↑</button>
                    )}
                    {index < sections.length - 1 && (
                      <button onClick={e => { e.stopPropagation(); moveSection(index, index + 1); }} className="px-2 py-1 text-xs opacity-40 hover:opacity-100 cursor-pointer">↓</button>
                    )}
                    <button onClick={e => { e.stopPropagation(); removeSection(section.id); }} className="px-2 py-1 text-xs hover:bg-red-500/20 rounded cursor-pointer" title="Remove" style={{ color: '#EF4444' }}>✕</button>
                  </div>
                </div>

                {/* Section Editor — expanded */}
                {expandedSection === section.id && (
                  <div className="px-4 pb-4 border-t-2 border-dashed pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                    <SectionEditor section={section} onUpdate={(data) => updateSection(section.id, data)} accentColor={accentColor} textOnAccent={textOnAccent} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section Editor (renders the right form based on type) ──

function SectionEditor({ section, onUpdate, accentColor, textOnAccent }: {
  section: EpisodeSection;
  onUpdate: (data: Partial<EpisodeSection>) => void;
  accentColor: string;
  textOnAccent: string;
}) {
  const inputClass = "w-full zine-border px-3 py-2 font-bold text-sm outline-none focus:shadow-[3px_3px_0px_var(--border-color)]";
  const inputStyle = { backgroundColor: 'var(--surface)', color: 'var(--text-primary)' };
  const labelClass = "block text-[10px] font-black uppercase tracking-widest mb-1";
  const labelStyle = { color: 'var(--text-muted)' };

  switch (section.type) {
    case 'summary':
      return (
        <div>
          <label className={labelClass} style={labelStyle}>Summary Text</label>
          <textarea value={section.content} onChange={e => onUpdate({ content: e.target.value })} rows={5} className={`${inputClass} resize-none`} style={inputStyle} placeholder="Write your episode summary..." />
        </div>
      );

    case 'sixty-second':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={labelStyle}>Heading</label>
              <input type="text" value={section.heading} onChange={e => onUpdate({ heading: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Subheading</label>
              <input type="text" value={section.subheading} onChange={e => onUpdate({ subheading: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Paragraphs</label>
            {section.paragraphs.map((p, i) => (
              <div key={i} className="zine-border p-3 mb-2 space-y-2" style={{ backgroundColor: 'var(--page-bg)' }}>
                <textarea value={p.text} onChange={e => {
                  const updated = [...section.paragraphs];
                  updated[i] = { ...updated[i], text: e.target.value };
                  onUpdate({ paragraphs: updated });
                }} rows={3} className={`${inputClass} resize-none`} style={inputStyle} placeholder="Paragraph text..." />
                <div className="flex gap-2 items-center">
                  <input type="text" value={p.imageUrl} onChange={e => {
                    const updated = [...section.paragraphs];
                    updated[i] = { ...updated[i], imageUrl: e.target.value };
                    onUpdate({ paragraphs: updated });
                  }} className={`${inputClass} flex-1`} style={inputStyle} placeholder="Image URL (or upload below)" />
                  <input type="file" accept="image/*" className="text-xs w-40" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const result = await uploadImage(file);
                    const updated = [...section.paragraphs];
                    updated[i] = { ...updated[i], imageUrl: result.url };
                    onUpdate({ paragraphs: updated });
                  }} />
                  <select value={p.imagePosition} onChange={e => {
                    const updated = [...section.paragraphs];
                    updated[i] = { ...updated[i], imagePosition: e.target.value as 'left' | 'right' };
                    onUpdate({ paragraphs: updated });
                  }} className="zine-border px-2 py-1 text-xs font-bold" style={inputStyle}>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                {section.paragraphs.length > 1 && (
                  <button onClick={() => {
                    const updated = section.paragraphs.filter((_, j) => j !== i);
                    onUpdate({ paragraphs: updated });
                  }} className="text-[10px] font-bold uppercase cursor-pointer" style={{ color: '#EF4444' }}>Remove Paragraph</button>
                )}
              </div>
            ))}
            <button onClick={() => onUpdate({ paragraphs: [...section.paragraphs, { text: '', imageUrl: '', imageCaption: '', imagePosition: 'right' as const }] })} className="text-xs font-black uppercase tracking-widest px-3 py-1 zine-border cursor-pointer" style={{ backgroundColor: accentColor, color: textOnAccent === 'white' ? '#fff' : '#000' }}>+ Add Paragraph</button>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Key Takeaway</label>
            <input type="text" value={section.takeaway} onChange={e => onUpdate({ takeaway: e.target.value })} className={inputClass} style={inputStyle} placeholder="The one-liner takeaway..." />
          </div>
        </div>
      );

    case 'key-lessons':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={labelStyle}>Section Heading</label>
              <input type="text" value={section.heading} onChange={e => onUpdate({ heading: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Subheading</label>
              <input type="text" value={section.subheading} onChange={e => onUpdate({ subheading: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
          </div>

          {section.lessons.map((lesson, i) => (
            <div key={i} className="zine-border p-3 space-y-2" style={{ backgroundColor: 'var(--page-bg)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black" style={{ color: accentColor }}>Lesson {i + 1}</span>
                {section.lessons.length > 1 && (
                  <button onClick={() => onUpdate({ lessons: section.lessons.filter((_, j) => j !== i) })} className="text-[10px] font-bold ml-auto cursor-pointer" style={{ color: '#EF4444' }}>Remove</button>
                )}
              </div>
              <input type="text" value={lesson.context} onChange={e => {
                const updated = [...section.lessons];
                updated[i] = { ...updated[i], context: e.target.value };
                onUpdate({ lessons: updated });
              }} className={inputClass} style={inputStyle} placeholder="Lesson headline (e.g. 'Start With Why')" />
              <textarea value={lesson.summary} onChange={e => {
                const updated = [...section.lessons];
                updated[i] = { ...updated[i], summary: e.target.value };
                onUpdate({ lessons: updated });
              }} rows={2} className={`${inputClass} resize-none`} style={inputStyle} placeholder="Expanded explanation..." />
            </div>
          ))}
          <button onClick={() => onUpdate({ lessons: [...section.lessons, { context: '', summary: '', align: 'left' as const }] })} className="text-xs font-black uppercase tracking-widest px-3 py-1 zine-border cursor-pointer" style={{ backgroundColor: accentColor, color: textOnAccent === 'white' ? '#fff' : '#000' }}>+ Add Lesson</button>
        </div>
      );

    case 'polaroids':
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass} style={labelStyle}>Section Heading</label>
            <input type="text" value={section.heading} onChange={e => onUpdate({ heading: e.target.value })} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Highlights</label>
            {section.highlights.map((h, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <input type="text" value={h} onChange={e => {
                  const updated = [...section.highlights];
                  updated[i] = e.target.value;
                  onUpdate({ highlights: updated });
                }} className={`${inputClass} flex-1`} style={inputStyle} placeholder="Highlight text..." />
                {section.highlights.length > 1 && (
                  <button onClick={() => onUpdate({ highlights: section.highlights.filter((_, j) => j !== i) })} className="px-2 cursor-pointer" style={{ color: '#EF4444' }}>×</button>
                )}
              </div>
            ))}
            <button onClick={() => onUpdate({ highlights: [...section.highlights, ''] })} className="text-[10px] font-bold uppercase cursor-pointer mt-1" style={{ color: accentColor }}>+ Add Highlight</button>
          </div>

          <PolaroidUploader
            images={section.images}
            onChange={(images) => onUpdate({ images })}
            accentColor={accentColor}
          />
        </div>
      );

    case 'mindmap':
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass} style={labelStyle}>Central Topic</label>
            <input type="text" value={section.centralTopic} onChange={e => onUpdate({ centralTopic: e.target.value })} className={inputClass} style={inputStyle} placeholder="e.g. The Future of Work" />
          </div>
          <MindmapBuilder
            nodes={section.nodes}
            onChange={(nodes) => onUpdate({ nodes })}
            accentColor={accentColor}
          />
        </div>
      );

    case 'quote':
      return (
        <div className="space-y-3">
          <div>
            <label className={labelClass} style={labelStyle}>Quote Text</label>
            <textarea value={section.text} onChange={e => onUpdate({ text: e.target.value })} rows={3} className={`${inputClass} resize-none`} style={inputStyle} placeholder='"The best way to predict the future is to create it."' />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Attribution</label>
            <input type="text" value={section.attribution} onChange={e => onUpdate({ attribution: e.target.value })} className={inputClass} style={inputStyle} placeholder="— Peter Drucker" />
          </div>
        </div>
      );

    case 'stats':
      return (
        <div className="space-y-3">
          {section.cards.map((card, i) => (
            <div key={i} className="zine-border p-3 grid grid-cols-2 gap-2" style={{ backgroundColor: 'var(--page-bg)' }}>
              <input type="text" value={card.label} onChange={e => {
                const updated = [...section.cards];
                updated[i] = { ...updated[i], label: e.target.value };
                onUpdate({ cards: updated });
              }} className={inputClass} style={inputStyle} placeholder="Label (e.g. Revenue)" />
              <input type="text" value={card.value} onChange={e => {
                const updated = [...section.cards];
                updated[i] = { ...updated[i], value: e.target.value };
                onUpdate({ cards: updated });
              }} className={inputClass} style={inputStyle} placeholder="Value (e.g. $10M)" />
              <input type="text" value={card.description} onChange={e => {
                const updated = [...section.cards];
                updated[i] = { ...updated[i], description: e.target.value };
                onUpdate({ cards: updated });
              }} className={`${inputClass} col-span-2`} style={inputStyle} placeholder="Description..." />
              <div className="flex items-center gap-2 col-span-2">
                <input type="color" value={card.color} onChange={e => {
                  const updated = [...section.cards];
                  updated[i] = { ...updated[i], color: e.target.value };
                  onUpdate({ cards: updated });
                }} className="w-8 h-8 cursor-pointer" />
                {section.cards.length > 1 && (
                  <button onClick={() => onUpdate({ cards: section.cards.filter((_, j) => j !== i) })} className="text-[10px] font-bold ml-auto cursor-pointer" style={{ color: '#EF4444' }}>Remove</button>
                )}
              </div>
            </div>
          ))}
          <button onClick={() => onUpdate({ cards: [...section.cards, { label: '', value: '', description: '', color: accentColor }] })} className="text-xs font-black uppercase tracking-widest px-3 py-1 zine-border cursor-pointer" style={{ backgroundColor: accentColor, color: textOnAccent === 'white' ? '#fff' : '#000' }}>+ Add Stat Card</button>
        </div>
      );

    case 'custom-text':
      return (
        <div className="space-y-3">
          <div>
            <label className={labelClass} style={labelStyle}>Heading</label>
            <input type="text" value={section.heading} onChange={e => onUpdate({ heading: e.target.value })} className={inputClass} style={inputStyle} placeholder="Section heading (optional)" />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Content</label>
            <textarea value={section.content} onChange={e => onUpdate({ content: e.target.value })} rows={5} className={`${inputClass} resize-none`} style={inputStyle} placeholder="Write your content here..." />
          </div>
        </div>
      );

    default:
      return <p style={{ color: 'var(--text-muted)' }}>Unknown section type</p>;
  }
}
