import React from 'react';

/**
 * Bandeau moteur : l'abonné sait toujours quelle IA travaille.
 * 🟣 Gemini = architecture / analyse / cohérence
 * 🟢 ChatGPT = rédaction / narration / style
 */
export type Engine = 'gemini' | 'chatgpt';

const CONFIG: Record<Engine, { dot: string; name: string; ring: string; bg: string; text: string }> = {
  gemini: {
    dot: '🟣',
    name: 'Gemini',
    ring: 'border-purple-200',
    bg: 'bg-purple-50',
    text: 'text-purple-900',
  },
  chatgpt: {
    dot: '🟢',
    name: 'ChatGPT',
    ring: 'border-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
  },
};

interface Props {
  engine: Engine;
  task: string;
  active?: boolean;
  className?: string;
}

const EngineBadge: React.FC<Props> = ({ engine, task, active = false, className = '' }) => {
  const c = CONFIG[engine];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${c.ring} ${c.bg} ${c.text} ${className}`}
    >
      <span className={active ? 'animate-pulse' : ''} aria-hidden>{c.dot}</span>
      <span className="font-semibold">{c.name}</span>
      <span className="opacity-70">— {task}</span>
    </span>
  );
};

export default EngineBadge;
