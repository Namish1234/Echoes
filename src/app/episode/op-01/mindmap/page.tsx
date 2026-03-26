'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Node = {
  id: string;
  label: string;
  sublabel?: string;
  color: string;
  children?: Node[];
};

const MINDMAP: Node = {
  id: 'root',
  label: 'VIC WILLIAMSON',
  sublabel: 'The Comeback Story',
  color: '#00E5FF',
  children: [
    {
      id: 'origins',
      label: 'Origins',
      sublabel: 'How it started',
      color: '#EAB308',
      children: [
        { id: 'o1', label: '2009 Talent ID', sublabel: 'British Cycling programme', color: '#EAB308' },
        { id: 'o2', label: '3,000 Applicants', sublabel: 'Only successful female', color: '#EAB308' },
        { id: 'o3', label: 'Mindset Over Muscle', sublabel: 'Chosen for psychology, not power', color: '#EAB308' },
        { id: 'o4', label: 'Track Sprint', sublabel: '200m · Keirin · Team Sprint', color: '#EAB308' },
      ],
    },
    {
      id: 'crash',
      label: 'The Crash',
      sublabel: 'Jan 9, 2016 · Rotterdam',
      color: '#EC4899',
      children: [
        { id: 'c1', label: 'Six Day Event', sublabel: '43° banking velodrome', color: '#EC4899' },
        { id: 'c2', label: 'Wheel Hook', sublabel: 'Collision with Dutch rider', color: '#EC4899' },
        { id: 'c3', label: '2mm From Paralysis', sublabel: 'Broken neck · back · pelvis', color: '#EC4899' },
        { id: 'c4', label: 'Tent on the Track', sublabel: 'Medics assumed the worst', color: '#EC4899' },
      ],
    },
    {
      id: 'surgery',
      label: 'The Decision',
      sublabel: 'Halo brace refused',
      color: '#8B5CF6',
      children: [
        { id: 's1', label: 'Refused Skull Drilling', sublabel: 'Halo brace would end cycling', color: '#8B5CF6' },
        { id: 's2', label: 'Bare Minimum Stabilisation', sublabel: 'Preserve neck rotation', color: '#8B5CF6' },
        { id: 's3', label: 'Neck Brace 24/7', sublabel: '6–9 months, never removed', color: '#8B5CF6' },
        { id: 's4', label: 'Screws Cracked', sublabel: 'Bones stronger than titanium', color: '#8B5CF6' },
      ],
    },
    {
      id: 'rehab',
      label: 'Project Silverback',
      sublabel: 'Bishop Rehab · 9 months',
      color: '#00E5FF',
      children: [
        { id: 'r1', label: 'James Moore', sublabel: '3-to-1 staff ratio', color: '#00E5FF' },
        { id: 'r2', label: '125kg Back Squat', sublabel: 'The mission target', color: '#00E5FF' },
        { id: 'r3', label: '170kg Leg Press', sublabel: 'Single leg strength KPI', color: '#00E5FF' },
        { id: 'r4', label: '1,500 Watts', sublabel: 'Peak power on the bike', color: '#00E5FF' },
        { id: 'r5', label: '752 Days', sublabel: 'Crash to velodrome return', color: '#00E5FF' },
      ],
    },
    {
      id: 'mindset',
      label: 'The Mindset',
      sublabel: 'How she survived',
      color: '#22C55E',
      children: [
        { id: 'm1', label: 'Plan Everything', sublabel: 'First advice to anyone in rehab', color: '#22C55E' },
        { id: 'm2', label: 'Protect the Mind', sublabel: '"Mind carried me above my body"', color: '#22C55E' },
        { id: 'm3', label: 'Take Action', sublabel: '"Refine, don\'t define"', color: '#22C55E' },
        { id: 'm4', label: 'Dark Humor', sublabel: 'Essential survival mechanism', color: '#22C55E' },
        { id: 'm5', label: 'Comparison = Thief of Joy', sublabel: 'The biggest mental battle', color: '#22C55E' },
      ],
    },
  ],
};

function NodeCard({ node, depth = 0 }: { node: Node; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;
  const isRoot = depth === 0;

  return (
    <div className={`flex flex-col items-center ${depth === 0 ? '' : ''}`}>
      <button
        className={`group relative text-center transition-all duration-200 hover:-translate-y-1 ${isRoot ? 'mb-8' : 'mb-4'}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
        style={{ cursor: hasChildren ? 'pointer' : 'default' }}
      >
        <div
          className={`
            border-2 font-black uppercase tracking-tight
            ${isRoot ? 'px-8 py-4 text-xl md:text-2xl border-4' : 'px-4 py-3 text-xs md:text-sm border-2'}
          `}
          style={{
            backgroundColor: node.color,
            borderColor: '#000',
            color: '#000',
            boxShadow: isRoot ? `6px 6px 0px #000` : `3px 3px 0px #000`,
          }}
        >
          {node.label}
          {node.sublabel && (
            <p className="font-sans font-bold normal-case tracking-normal mt-0.5 opacity-70 text-[10px]">
              {node.sublabel}
            </p>
          )}
        </div>
        {hasChildren && (
          <span
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-black text-white border border-white"
          >
            {expanded ? '−' : '+'}
          </span>
        )}
      </button>

      {hasChildren && expanded && (
        <div className="flex flex-wrap justify-center gap-4 relative">
          {/* Vertical connector */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-white opacity-30"
            style={{ height: '20px', marginTop: '-20px' }}
          ></div>
          {node.children!.map(child => (
            <div key={child.id} className="flex flex-col items-center">
              <div className="w-px h-5 opacity-30" style={{ backgroundColor: child.color }}></div>
              <NodeCard node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Op01Mindmap() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = MINDMAP.children || [];

  return (
    <div className="w-full min-h-screen bg-wtf-black text-wtf-white relative overflow-hidden">
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      {/* Cyan stripe */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#00E5FF] z-50"></div>

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <Link href="/episode/op-01" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-6 opacity-50 hover:opacity-100 hover:text-[#00E5FF] transition-all text-wtf-white">
            ← Back to Episode
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-black uppercase tracking-widest bg-[#EAB308] text-black border-2 border-black shadow-[2px_2px_0px_#000]">Mental Map</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-3 text-wtf-white">
            The Recovery <span className="text-[#00E5FF]">Blueprint</span>
          </h1>
          <p className="text-lg font-bold opacity-50 text-wtf-white">An interactive breakdown of Vic Williamson&apos;s journey. Click nodes to expand.</p>
        </div>

        {/* Visual Map — cluster cards */}
        <div className="flex flex-col items-center mb-16">
          {/* Root node */}
          <div
            className="px-8 py-4 text-xl md:text-2xl font-black uppercase tracking-tight text-center border-4 border-[#00E5FF] mb-8"
            style={{ backgroundColor: '#00E5FF', color: '#000', boxShadow: '6px 6px 0px #000' }}
          >
            VIC WILLIAMSON
            <p className="font-sans font-bold normal-case tracking-normal mt-0.5 opacity-70 text-[10px]">The Comeback Story</p>
          </div>

          {/* Branch clusters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {sections.map((section) => (
              <div key={section.id} className="border border-white/10 p-6 hover:border-white/30 transition-all duration-300">
                {/* Section header */}
                <button
                  className="w-full text-left mb-4 group"
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="inline-block px-3 py-1 text-xs font-black uppercase tracking-widest mb-2 text-black border-2 border-black"
                        style={{ backgroundColor: section.color }}
                      >
                        {section.label}
                      </div>
                      <p className="text-xs font-bold opacity-40 text-wtf-white">{section.sublabel}</p>
                    </div>
                    <div
                      className="w-7 h-7 flex items-center justify-center font-black text-sm border-2 shrink-0"
                      style={{ borderColor: section.color, color: section.color }}
                    >
                      {activeSection === section.id ? '−' : '+'}
                    </div>
                  </div>
                </button>

                {/* Sub-nodes */}
                {activeSection === section.id && section.children && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    {section.children.map((child) => (
                      <div key={child.id} className="flex items-start gap-3 py-2">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ backgroundColor: child.color }}></div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight text-wtf-white">{child.label}</p>
                          {child.sublabel && (
                            <p className="text-xs font-medium opacity-50 text-wtf-white">{child.sublabel}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-node count when collapsed */}
                {activeSection !== section.id && section.children && (
                  <p className="text-xs font-bold opacity-30 text-wtf-white">{section.children.length} nodes · Click to expand</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-10">
          {[
            { val: '752', label: 'Days to Return', color: '#00E5FF' },
            { val: '3,000', label: 'Applicants Faced', color: '#EAB308' },
            { val: '2mm', label: 'From Paralysis', color: '#EC4899' },
            { val: '125kg', label: 'Target Back Squat', color: '#22C55E' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black" style={{ color: stat.color }}>{stat.val}</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-40 mt-1 text-wtf-white">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
