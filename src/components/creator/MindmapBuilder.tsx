'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { MindmapNode } from '@/lib/creatorTypes';

interface Props {
  nodes: MindmapNode[];
  onChange: (nodes: MindmapNode[]) => void;
  accentColor: string;
}

const CATEGORIES: { value: MindmapNode['category']; label: string; color: string; bg: string }[] = [
  { value: 'core',    label: 'Core',        color: '#FF6B00', bg: '#FF6B0022' },
  { value: 'tech',    label: 'Tech',        color: '#3B82F6', bg: '#3B82F622' },
  { value: 'phil',    label: 'Philosophy',  color: '#8B5CF6', bg: '#8B5CF622' },
  { value: 'biz',     label: 'Business',    color: '#22C55E', bg: '#22C55E22' },
  { value: 'example', label: 'Example',     color: '#6B7280', bg: '#6B728022' },
];

interface NodePos { x: number; y: number; }

function getCategoryStyle(cat?: string) {
  return CATEGORIES.find(c => c.value === cat) || CATEGORIES[0];
}

// Compute radial positions for nodes around a central node
function computeLayout(nodes: MindmapNode[], width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const positions: Record<string, NodePos> = {};

  if (nodes.length === 0) return positions;

  // Root node (first, or one with no parent)
  const childIds = new Set(nodes.flatMap(n => n.children || []));
  const roots = nodes.filter(n => !childIds.has(n.id));
  const root = roots[0] || nodes[0];
  positions[root.id] = { x: cx, y: cy };

  // BFS layout
  const visited = new Set<string>([root.id]);
  const queue: { id: string; depth: number; parentX: number; parentY: number; angleStart: number; angleEnd: number }[] = [];

  const rootChildren = root.children?.filter(c => nodes.find(n => n.id === c)) || [];
  const R1 = Math.min(width, height) * 0.28;
  const angleStep = rootChildren.length > 0 ? (2 * Math.PI) / rootChildren.length : 0;

  rootChildren.forEach((cid, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    queue.push({ id: cid, depth: 1, parentX: cx, parentY: cy, angleStart: angle - angleStep / 2, angleEnd: angle + angleStep / 2 });
  });

  while (queue.length > 0) {
    const item = queue.shift()!;
    if (visited.has(item.id)) continue;
    visited.add(item.id);

    const node = nodes.find(n => n.id === item.id);
    if (!node) continue;

    const midAngle = (item.angleStart + item.angleEnd) / 2;
    const r = item.depth === 1 ? R1 : R1 * 0.55 * item.depth;
    const nx = item.parentX + r * Math.cos(midAngle);
    const ny = item.parentY + r * Math.sin(midAngle);
    positions[item.id] = { x: Math.max(60, Math.min(width - 60, nx)), y: Math.max(40, Math.min(height - 40, ny)) };

    const kids = node.children?.filter(c => !visited.has(c) && nodes.find(n => n.id === c)) || [];
    const kStep = kids.length > 0 ? (item.angleEnd - item.angleStart) / kids.length : 0;
    kids.forEach((kid, i) => {
      queue.push({
        id: kid,
        depth: item.depth + 1,
        parentX: positions[item.id].x,
        parentY: positions[item.id].y,
        angleStart: item.angleStart + i * kStep,
        angleEnd: item.angleStart + (i + 1) * kStep,
      });
    });
  }

  // Place orphan nodes in a ring
  let orphanIdx = 0;
  nodes.forEach(n => {
    if (!positions[n.id]) {
      const angle = (orphanIdx / Math.max(1, nodes.length - Object.keys(positions).length)) * 2 * Math.PI;
      positions[n.id] = {
        x: Math.max(60, Math.min(width - 60, cx + R1 * 1.1 * Math.cos(angle))),
        y: Math.max(40, Math.min(height - 40, cy + R1 * 1.1 * Math.sin(angle))),
      };
      orphanIdx++;
    }
  });

  return positions;
}

export default function MindmapBuilder({ nodes, onChange, accentColor }: Props) {
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<MindmapNode['category']>('core');
  const [connectMode, setConnectMode] = useState<string | null>(null); // id of source node
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [customPositions, setCustomPositions] = useState<Record<string, NodePos>>({});
  const [canvasSize, setCanvasSize] = useState({ w: 680, h: 420 });
  const [animatedIds, setAnimatedIds] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  // Measure canvas
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setCanvasSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setCanvasSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const computedPositions = computeLayout(nodes, canvasSize.w, canvasSize.h);
  const positions: Record<string, NodePos> = { ...computedPositions, ...customPositions };

  const addNode = () => {
    if (!newLabel.trim()) return;
    const id = `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const node: MindmapNode = { id, label: newLabel.trim(), category: newCategory, children: [] };
    onChange([...nodes, node]);
    setNewLabel('');
    // Animate in
    setAnimatedIds(prev => new Set([...prev, id]));
    setTimeout(() => setAnimatedIds(prev => { const s = new Set(prev); s.delete(id); return s; }), 600);
  };

  const removeNode = (id: string) => {
    onChange(nodes.filter(n => n.id !== id).map(n => ({ ...n, children: n.children?.filter(c => c !== id) })));
    if (selectedId === id) setSelectedId(null);
    if (connectMode === id) setConnectMode(null);
    const cp = { ...customPositions };
    delete cp[id];
    setCustomPositions(cp);
  };

  const updateNode = (id: string, data: Partial<MindmapNode>) => {
    onChange(nodes.map(n => n.id === id ? { ...n, ...data } : n));
  };

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectMode) {
      if (connectMode === id) { setConnectMode(null); return; }
      const from = nodes.find(n => n.id === connectMode)!;
      if (!from.children?.includes(id)) {
        updateNode(connectMode, { children: [...(from.children || []), id] });
      }
      setConnectMode(null);
    } else {
      setSelectedId(id === selectedId ? null : id);
    }
  };

  // Drag logic
  const handleMouseDown = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingId(id);
    const rect = canvasRef.current!.getBoundingClientRect();
    const pos = positions[id] || { x: 0, y: 0 };
    dragOffset.current = { dx: e.clientX - rect.left - pos.x, dy: e.clientY - rect.top - pos.y };
  }, [positions]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingId || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(50, Math.min(canvasSize.w - 50, e.clientX - rect.left - dragOffset.current.dx));
      const y = Math.max(30, Math.min(canvasSize.h - 30, e.clientY - rect.top - dragOffset.current.dy));
      setCustomPositions(prev => ({ ...prev, [draggingId]: { x, y } }));
    };
    const onUp = () => setDraggingId(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [draggingId, canvasSize]);

  const selectedNode = nodes.find(n => n.id === selectedId);
  const childIds = new Set(nodes.flatMap(n => n.children || []));
  const roots = nodes.filter(n => !childIds.has(n.id));
  const rootId = roots[0]?.id;

  return (
    <div className="space-y-4">
      {/* Add node bar */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addNode()}
          placeholder="Node label..."
          className="flex-1 min-w-[160px] zine-border px-3 py-2 font-bold text-sm outline-none"
          style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
        />
        <div className="flex gap-1">
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => setNewCategory(c.value)}
              title={c.label}
              className="w-7 h-7 rounded-full border-2 transition-all cursor-pointer"
              style={{
                backgroundColor: c.color,
                borderColor: newCategory === c.value ? 'var(--text-primary)' : 'transparent',
                transform: newCategory === c.value ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          ))}
        </div>
        <button
          onClick={addNode}
          disabled={!newLabel.trim()}
          className="zine-border px-4 py-2 font-black uppercase text-xs cursor-pointer disabled:opacity-40 transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: accentColor, color: '#000' }}
        >
          + Add Node
        </button>
      </div>

      {/* Connect mode banner */}
      {connectMode && (
        <div className="px-3 py-2 text-xs font-bold text-center animate-pulse rounded"
          style={{ backgroundColor: '#3B82F615', color: '#3B82F6', border: '2px solid #3B82F6' }}>
          🔗 Click a target node to connect from &ldquo;{nodes.find(n => n.id === connectMode)?.label}&rdquo; — or click it again to cancel
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full rounded overflow-hidden select-none"
        style={{ height: '420px', backgroundColor: 'var(--page-bg)', border: '2px solid var(--border-color)' }}
        onClick={() => { setSelectedId(null); if (!connectMode) return; }}
      >
        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <div className="text-4xl opacity-20">⬡</div>
            <p className="text-xs font-bold uppercase tracking-widest">Add nodes above to build your mind map</p>
          </div>
        ) : (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--border-color)" />
              </marker>
            </defs>
            {nodes.map(node =>
              (node.children || []).map(childId => {
                const from = positions[node.id];
                const to = positions[childId];
                if (!from || !to) return null;
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2 - 30;
                const d = `M ${from.x} ${from.y} C ${mx} ${my}, ${mx} ${my}, ${to.x} ${to.y}`;
                const catFrom = getCategoryStyle(node.category);
                return (
                  <path
                    key={`${node.id}-${childId}`}
                    d={d}
                    fill="none"
                    stroke={catFrom.color}
                    strokeWidth={1.5}
                    strokeDasharray="5,3"
                    opacity={0.5}
                    markerEnd="url(#arrowhead)"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                );
              })
            )}
          </svg>
        )}

        {/* Nodes */}
        {nodes.map(node => {
          const pos = positions[node.id];
          if (!pos) return null;
          const cat = getCategoryStyle(node.category);
          const isRoot = node.id === rootId;
          const isSelected = selectedId === node.id;
          const isConnectSrc = connectMode === node.id;
          const isNew = animatedIds.has(node.id);

          return (
            <div
              key={node.id}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
                zIndex: draggingId === node.id ? 100 : isSelected ? 50 : 10,
                transition: draggingId === node.id ? 'none' : 'left 0.35s cubic-bezier(.4,0,.2,1), top 0.35s cubic-bezier(.4,0,.2,1)',
              }}
              onMouseDown={e => handleMouseDown(node.id, e)}
              onClick={e => handleNodeClick(node.id, e)}
            >
              <div
                className="relative flex items-center gap-1.5 rounded-sm px-3 py-1.5 border-2 shadow-sm"
                style={{
                  backgroundColor: isRoot ? cat.color : cat.bg,
                  borderColor: isConnectSrc ? '#3B82F6' : isSelected ? cat.color : `${cat.color}66`,
                  boxShadow: isSelected ? `0 0 0 3px ${cat.color}44` : isConnectSrc ? '0 0 0 3px #3B82F644' : '2px 2px 0 rgba(0,0,0,0.15)',
                  transform: isNew ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.3s ease, box-shadow 0.2s, border-color 0.2s',
                  minWidth: isRoot ? 90 : 70,
                  maxWidth: 140,
                }}
              >
                <span
                  className="text-xs font-black leading-tight text-center w-full"
                  style={{ color: isRoot ? '#fff' : cat.color }}
                >
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Node inspector */}
      {selectedNode && (
        <div
          className="p-3 rounded border-2 space-y-3 animate-in"
          style={{ backgroundColor: 'var(--surface)', borderColor: getCategoryStyle(selectedNode.category).color + '66' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Edit Node
            </span>
            <button onClick={() => removeNode(selectedNode.id)} className="text-xs font-bold cursor-pointer hover:opacity-100 opacity-50" style={{ color: '#EF4444' }}>Remove ✕</button>
          </div>
          <input
            type="text"
            value={selectedNode.label}
            onChange={e => updateNode(selectedNode.id, { label: e.target.value })}
            className="w-full zine-border px-3 py-2 font-bold text-sm outline-none"
            style={{ backgroundColor: 'var(--page-bg)', color: 'var(--text-primary)' }}
          />
          <div className="flex gap-2 items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Type:</span>
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => updateNode(selectedNode.id, { category: c.value })}
                title={c.label}
                className="w-6 h-6 rounded-full border-2 cursor-pointer transition-all"
                style={{
                  backgroundColor: c.color,
                  borderColor: selectedNode.category === c.value ? 'var(--text-primary)' : 'transparent',
                  transform: selectedNode.category === c.value ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setConnectMode(selectedNode.id); setSelectedId(null); }}
              className="flex-1 zine-border px-3 py-1.5 text-xs font-black uppercase tracking-widest cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: '#3B82F6', color: '#fff' }}
            >
              🔗 Connect to...
            </button>
          </div>
          {selectedNode.children && selectedNode.children.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Connections ({selectedNode.children.length})</p>
              <div className="flex flex-wrap gap-1">
                {selectedNode.children.map(cid => {
                  const cn = nodes.find(n => n.id === cid);
                  return cn ? (
                    <span key={cid} className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: getCategoryStyle(cn.category).bg, color: getCategoryStyle(cn.category).color }}>
                      {cn.label}
                      <button onClick={() => updateNode(selectedNode.id, { children: selectedNode.children?.filter(x => x !== cid) })} className="opacity-50 hover:opacity-100 cursor-pointer">×</button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-3 flex-wrap">
        {CATEGORIES.map(c => (
          <span key={c.value} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c.color }} />
            {c.label}
          </span>
        ))}
        <span className="text-[10px] font-bold uppercase tracking-widest ml-2" style={{ color: 'var(--text-muted)' }}>
          · Drag nodes to reposition · Click to edit · Use Connect to link
        </span>
      </div>
    </div>
  );
}
