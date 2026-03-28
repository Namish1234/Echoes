'use client';

import { useState } from 'react';
import type { MindmapNode } from '@/lib/creatorTypes';

interface Props {
  nodes: MindmapNode[];
  onChange: (nodes: MindmapNode[]) => void;
  accentColor: string;
}

const CATEGORIES: { value: MindmapNode['category']; label: string; color: string }[] = [
  { value: 'core', label: 'Core', color: '#FF6B00' },
  { value: 'tech', label: 'Tech', color: '#3B82F6' },
  { value: 'phil', label: 'Philosophy', color: '#8B5CF6' },
  { value: 'biz', label: 'Business', color: '#22C55E' },
  { value: 'example', label: 'Example', color: '#6B7280' },
];

export default function MindmapBuilder({ nodes, onChange, accentColor }: Props) {
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<MindmapNode['category']>('core');
  const [connectFrom, setConnectFrom] = useState<string | null>(null);

  const addNode = () => {
    if (!newLabel.trim()) return;
    const id = `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const node: MindmapNode = {
      id,
      label: newLabel.trim(),
      category: newCategory,
      children: [],
    };
    onChange([...nodes, node]);
    setNewLabel('');
  };

  const removeNode = (id: string) => {
    // Remove node and any references to it in children arrays
    const updated = nodes
      .filter(n => n.id !== id)
      .map(n => ({
        ...n,
        children: n.children?.filter(c => c !== id),
      }));
    onChange(updated);
  };

  const updateNode = (id: string, data: Partial<MindmapNode>) => {
    onChange(nodes.map(n => n.id === id ? { ...n, ...data } : n));
  };

  const handleConnect = (toId: string) => {
    if (!connectFrom || connectFrom === toId) {
      setConnectFrom(null);
      return;
    }
    const fromNode = nodes.find(n => n.id === connectFrom);
    if (fromNode && !fromNode.children?.includes(toId)) {
      updateNode(connectFrom, { children: [...(fromNode.children || []), toId] });
    }
    setConnectFrom(null);
  };

  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
        Mindmap Nodes ({nodes.length})
      </label>

      {/* Add node form */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addNode()}
          placeholder="Node label..."
          className="flex-1 min-w-[200px] zine-border px-3 py-2 font-bold text-sm outline-none"
          style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
        />
        <select
          value={newCategory}
          onChange={e => setNewCategory(e.target.value as MindmapNode['category'])}
          className="zine-border px-3 py-2 font-bold text-xs"
          style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
        >
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <button
          onClick={addNode}
          disabled={!newLabel.trim()}
          className="zine-border px-4 py-2 font-black uppercase text-xs cursor-pointer disabled:opacity-40"
          style={{ backgroundColor: accentColor, color: '#000' }}
        >
          Add Node
        </button>
      </div>

      {/* Connection mode indicator */}
      {connectFrom && (
        <div className="zine-border p-2 mb-3 text-xs font-bold text-center animate-pulse" style={{ backgroundColor: '#3B82F620', borderColor: '#3B82F6', color: '#3B82F6' }}>
          🔗 Click a target node to connect from &quot;{nodes.find(n => n.id === connectFrom)?.label}&quot; — or click again to cancel
        </div>
      )}

      {/* Node list */}
      {nodes.length > 0 ? (
        <div className="space-y-2">
          {nodes.map(node => {
            const cat = CATEGORIES.find(c => c.value === node.category);
            const isConnectSource = connectFrom === node.id;
            return (
              <div
                key={node.id}
                className={`zine-border p-3 flex items-center gap-3 transition-all ${isConnectSource ? '-translate-y-0.5 shadow-[4px_4px_0px_#3B82F6]' : ''}`}
                style={{ backgroundColor: 'var(--page-bg)', borderColor: isConnectSource ? '#3B82F6' : undefined }}
              >
                {/* Category dot */}
                <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat?.color }}></div>

                {/* Label */}
                <input
                  type="text"
                  value={node.label}
                  onChange={e => updateNode(node.id, { label: e.target.value })}
                  className="flex-1 bg-transparent font-bold text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />

                {/* Category select */}
                <select
                  value={node.category}
                  onChange={e => updateNode(node.id, { category: e.target.value as MindmapNode['category'] })}
                  className="text-[10px] font-bold uppercase px-2 py-1 zine-border"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>

                {/* Children count */}
                {node.children && node.children.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cat?.color, color: '#fff' }}>
                    {node.children.length} link{node.children.length !== 1 ? 's' : ''}
                  </span>
                )}

                {/* Connect button */}
                <button
                  onClick={() => connectFrom === node.id ? setConnectFrom(null) : connectFrom ? handleConnect(node.id) : setConnectFrom(node.id)}
                  className="text-[10px] font-black uppercase px-2 py-1 zine-border cursor-pointer"
                  style={{
                    backgroundColor: connectFrom === node.id ? '#3B82F6' : 'transparent',
                    color: connectFrom === node.id ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {connectFrom === node.id ? '⟳' : connectFrom ? '→ Link' : '🔗'}
                </button>

                {/* Delete */}
                <button onClick={() => removeNode(node.id)} className="text-sm cursor-pointer opacity-40 hover:opacity-100" style={{ color: '#EF4444' }}>✕</button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="zine-border border-dashed p-6 text-center" style={{ backgroundColor: 'var(--page-bg)' }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>No nodes yet. Add your first one above!</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-3 mt-4 flex-wrap">
        {CATEGORIES.map(c => (
          <span key={c.value} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c.color }}></span>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
