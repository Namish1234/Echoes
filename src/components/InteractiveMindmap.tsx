'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface MindmapNode {
  id: string;
  label: string;
  category: 'core' | 'tech' | 'phil' | 'biz' | 'example';
  children?: string[];
}

interface InteractiveMindmapProps {
  centralTopic: string;
  nodes: MindmapNode[];
}

const categoryStyles: Record<string, { bg: string; border: string; text: string; fill: string }> = {
  core:    { bg: 'bg-wtf-orange',  border: 'border-wtf-orange',  text: 'text-black',  fill: '#FF6B00' },
  tech:    { bg: 'bg-blue-500',    border: 'border-blue-500',    text: 'text-white',  fill: '#3B82F6' },
  phil:    { bg: 'bg-purple-500',  border: 'border-purple-500',  text: 'text-white',  fill: '#8B5CF6' },
  biz:     { bg: 'bg-green-500',   border: 'border-green-500',   text: 'text-white',  fill: '#22C55E' },
  example: { bg: 'bg-gray-600',    border: 'border-gray-500',    text: 'text-white',  fill: '#4B5563' },
};

const categoryLabels: Record<string, string> = {
  core: 'Core Concept',
  tech: 'Technical',
  phil: 'Philosophical',
  biz: 'Business',
  example: 'Example',
};

export default function InteractiveMindmap({ centralTopic, nodes }: InteractiveMindmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Canvas dimensions for the mindmap world
  const worldW = 900;
  const worldH = 700;
  const centerX = worldW / 2;
  const centerY = worldH / 2;

  // Split nodes
  const topLevel = nodes.filter(n => n.category !== 'example');
  const exampleNodes = nodes.filter(n => n.category === 'example');

  // Position top-level nodes radially
  const radius = 240;
  const getNodePos = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  };

  // Mouse/touch drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only pan on left click / primary touch
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [pan]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom only via buttons (scroll was conflicting with sidebar scrolling)

  // Reset view
  const resetView = () => { setPan({ x: 0, y: 0 }); setScale(1); };

  // Generate a curved path between two points
  const curvePath = (x1: number, y1: number, x2: number, y2: number, curve: number = 40) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} Q ${mx + curve} ${my - curve} ${x2} ${y2}`;
  };

  return (
    <div className="space-y-4">
      {/* Legend + Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <span key={key} className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${categoryStyles[key].bg} ${categoryStyles[key].text}`}>
              {label}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={resetView} className="text-xs font-bold uppercase tracking-widest px-3 py-1 zine-border bg-white dark:bg-[#222] cursor-pointer hover:bg-wtf-orange hover:text-black transition-colors">
            Reset
          </button>
          <button onClick={() => setScale(s => Math.min(2.5, s * 1.2))} className="text-xs font-bold px-2 py-1 zine-border bg-white dark:bg-[#222] cursor-pointer hover:bg-wtf-orange hover:text-black transition-colors">+</button>
          <button onClick={() => setScale(s => Math.max(0.4, s * 0.8))} className="text-xs font-bold px-2 py-1 zine-border bg-white dark:bg-[#222] cursor-pointer hover:bg-wtf-orange hover:text-black transition-colors">−</button>
        </div>
      </div>

      {/* Draggable Canvas */}
      <div
        ref={containerRef}
        className="relative w-full h-[500px] zine-border bg-[#FAFAF8] dark:bg-[#111] overflow-hidden select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Hint overlay */}
        <div className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-widest opacity-40 pointer-events-none">
          Drag to pan • Use +/− to zoom
        </div>

        {/* Transformable world */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            width: worldW,
            height: worldH,
            position: 'relative',
          }}
        >
          {/* SVG Connectors Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${worldW} ${worldH}`}>
            {/* Lines from center to top-level nodes */}
            {topLevel.map((node, i) => {
              const pos = getNodePos(i, topLevel.length);
              const isActive = activeNode === node.id;
              return (
                <path
                  key={`c-${node.id}`}
                  d={curvePath(centerX, centerY, pos.x, pos.y, (i % 2 === 0 ? 35 : -35))}
                  fill="none"
                  stroke={isActive ? '#FF6B00' : '#888'}
                  strokeWidth={isActive ? 3 : 1.5}
                  strokeDasharray={isActive ? 'none' : '6 4'}
                  className="transition-all duration-300"
                />
              );
            })}
            {/* Lines from top-level to their example children */}
            {topLevel.map((parent, pi) => {
              const parentPos = getNodePos(pi, topLevel.length);
              return (parent.children || []).map((childId, ci) => {
                const child = exampleNodes.find(n => n.id === childId);
                if (!child) return null;
                const childAngle = ((pi + (ci + 1) * 0.35) / topLevel.length) * 2 * Math.PI - Math.PI / 2;
                const childR = radius + 120;
                const cx = centerX + childR * Math.cos(childAngle);
                const cy = centerY + childR * Math.sin(childAngle);
                return (
                  <path
                    key={`s-${childId}`}
                    d={curvePath(parentPos.x, parentPos.y, cx, cy, 20)}
                    fill="none"
                    stroke="#555"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                  />
                );
              });
            })}
          </svg>

          {/* Central Node */}
          <div
            className="absolute z-10"
            style={{ left: centerX - 85, top: centerY - 28, width: 170, height: 56 }}
          >
            <div className="zine-border bg-wtf-orange text-black px-4 py-2 font-black text-center uppercase tracking-wider text-xs shadow-[3px_3px_0px_#000] w-full h-full flex items-center justify-center leading-tight">
              {centralTopic}
            </div>
          </div>

          {/* Top-Level Nodes */}
          {topLevel.map((node, i) => {
            const pos = getNodePos(i, topLevel.length);
            const style = categoryStyles[node.category] || categoryStyles.tech;
            const isActive = activeNode === node.id;
            return (
              <div
                key={node.id}
                className={`absolute z-10 transition-all duration-200 ${isActive ? 'scale-110 z-20' : 'hover:scale-105'}`}
                style={{ left: pos.x - 70, top: pos.y - 18.5 }}
                onClick={(e) => { e.stopPropagation(); setActiveNode(isActive ? null : node.id); }}
              >
                <div
                  className={`cursor-pointer zine-border ${style.bg} ${style.text} px-3 py-1.5 font-bold text-[11px] uppercase tracking-widest text-center whitespace-nowrap shadow-[2px_2px_0px_#000] ${isActive ? 'shadow-[4px_4px_0px_#000] ring-2 ring-white' : ''}`}
                >
                  {node.label}
                </div>
              </div>
            );
          })}

          {/* Example Nodes (sub-nodes) */}
          {topLevel.map((parent, pi) => {
            return (parent.children || []).map((childId, ci) => {
              const child = exampleNodes.find(n => n.id === childId);
              if (!child) return null;
              const childAngle = ((pi + (ci + 1) * 0.35) / topLevel.length) * 2 * Math.PI - Math.PI / 2;
              const childR = radius + 120;
              const cx = centerX + childR * Math.cos(childAngle);
              const cy = centerY + childR * Math.sin(childAngle);
              return (
                <div
                  key={childId}
                  className="absolute z-10"
                  style={{ left: cx - 55, top: cy - 14 }}
                >
                  <div className="cursor-default zine-border bg-gray-600 text-white px-2 py-1 font-bold text-[10px] uppercase tracking-widest text-center whitespace-nowrap shadow-[2px_2px_0px_#000] opacity-80">
                    {child.label}
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}
