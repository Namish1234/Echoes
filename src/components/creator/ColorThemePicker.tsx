'use client';

import { useState } from 'react';

interface ColorThemePickerProps {
  selectedColor: string;
  onSelect: (color: string, textOnAccent: 'white' | 'black') => void;
}

const PRESETS = [
  { name: 'Sunset Orange', hex: '#FF6B00', textOnAccent: 'black' as const, desc: 'Bold & energetic' },
  { name: 'Ocean Blue', hex: '#3B82F6', textOnAccent: 'white' as const, desc: 'Professional & trust' },
  { name: 'Forest Green', hex: '#22C55E', textOnAccent: 'white' as const, desc: 'Growth & health' },
  { name: 'Royal Purple', hex: '#8B5CF6', textOnAccent: 'white' as const, desc: 'Creative & deep' },
  { name: 'Electric Cyan', hex: '#00E5FF', textOnAccent: 'black' as const, desc: 'Modern & tech' },
  { name: 'Rose Pink', hex: '#EC4899', textOnAccent: 'white' as const, desc: 'Warm & human' },
  { name: 'Amber Gold', hex: '#EAB308', textOnAccent: 'black' as const, desc: 'Premium & warm' },
  { name: 'Crimson Red', hex: '#EF4444', textOnAccent: 'white' as const, desc: 'Powerful & urgent' },
];

export default function ColorThemePicker({ selectedColor, onSelect }: ColorThemePickerProps) {
  const [customColor, setCustomColor] = useState('#FF6B00');
  const [isCustom, setIsCustom] = useState(false);

  function getContrastText(hex: string): 'white' | 'black' {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'black' : 'white';
  }

  return (
    <div>
      <h3 className="text-lg font-black uppercase tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
        Choose Your Color Palette
      </h3>
      <p className="text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>
        This color will be used across your podcast page — buttons, accents, badges, and more.
      </p>

      {/* Preset grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {PRESETS.map((preset) => {
          const isActive = selectedColor === preset.hex && !isCustom;
          return (
            <button
              key={preset.hex}
              onClick={() => {
                setIsCustom(false);
                onSelect(preset.hex, preset.textOnAccent);
              }}
              className={`relative zine-border p-3 transition-all cursor-pointer ${
                isActive ? 'shadow-[4px_4px_0px_var(--border-color)] -translate-y-1' : 'hover:shadow-[3px_3px_0px_var(--border-color)] hover:-translate-y-0.5'
              }`}
              style={{ backgroundColor: 'var(--surface)' }}
            >
              {isActive && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black z-10" style={{ backgroundColor: preset.hex, color: preset.textOnAccent === 'white' ? '#fff' : '#000' }}>
                  ✓
                </div>
              )}
              <div className="w-full h-12 mb-2 zine-border" style={{ backgroundColor: preset.hex }}></div>
              <p className="text-xs font-black uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{preset.name}</p>
              <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{preset.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Custom color */}
      <div className="zine-border p-4" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={() => setIsCustom(true)}
            className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 zine-border transition-all cursor-pointer ${
              isCustom ? 'shadow-[3px_3px_0px_var(--border-color)]' : ''
            }`}
            style={{
              backgroundColor: isCustom ? 'var(--color-wtf-orange)' : 'transparent',
              color: isCustom ? '#000' : 'var(--text-primary)',
            }}
          >
            Custom Color
          </button>
        </div>

        {isCustom && (
          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                onSelect(e.target.value, getContrastText(e.target.value));
              }}
              className="w-14 h-14 cursor-pointer zine-border p-1"
              style={{ backgroundColor: 'var(--surface)' }}
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                  setCustomColor(val);
                  onSelect(val, getContrastText(val));
                } else {
                  setCustomColor(val);
                }
              }}
              placeholder="#FF6B00"
              className="zine-border px-3 py-2 font-bold text-sm w-28 uppercase outline-none"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Preview:</span>
              <div className="w-24 h-8 zine-border" style={{ backgroundColor: customColor }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview Card */}
      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
          Live Preview
        </p>
        <div className="zine-border overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="h-3" style={{ backgroundColor: selectedColor }}></div>
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-black text-lg uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>Your Podcast</h4>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5" style={{ backgroundColor: '#22C55E', color: '#fff' }}>Published</span>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: selectedColor }}>Hosted by You</p>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Your podcast description will appear here...</p>
            <div className="flex gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2" style={{ borderColor: 'var(--border-subtle)' }}>TAG</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2" style={{ borderColor: 'var(--border-subtle)' }}>TOPIC</span>
            </div>
            <button className="text-xs font-black uppercase tracking-widest px-4 py-2 zine-border shadow-[2px_2px_0px_var(--border-color)]" style={{ backgroundColor: selectedColor, color: getContrastText(selectedColor) === 'white' ? '#fff' : '#000' }}>
              Explore →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getContrastText(hex: string): 'white' | 'black' {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
}
