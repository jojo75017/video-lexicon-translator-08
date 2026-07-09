import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Scores } from '@/lib/bookperfect/types';

interface Props {
  scores: Scores;
}

const scoreColor = (n: number) => (n >= 80 ? 'text-green-600' : n >= 60 ? 'text-amber-500' : 'text-destructive');
const ringColor = (n: number) => (n >= 80 ? 'stroke-green-600' : n >= 60 ? 'stroke-amber-500' : 'stroke-destructive');

const ScoreRing: React.FC<{ value: number; label: string; big?: boolean }> = ({ value, label, big }) => {
  const size = big ? 120 : 72;
  const r = big ? 52 : 30;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} className="stroke-muted fill-none" strokeWidth={big ? 10 : 7} />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            className={`fill-none ${ringColor(value)}`}
            strokeWidth={big ? 10 : 7}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center font-bold ${big ? 'text-2xl' : 'text-sm'} ${scoreColor(value)}`}>
          {value}
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
};

export const ScoreDashboard: React.FC<Props> = ({ scores }) => {
  const verdict = scores.verdict === 'green'
    ? { emoji: '🟢', text: 'Prêt pour publication Amazon KDP', cls: 'text-green-600' }
    : scores.verdict === 'orange'
      ? { emoji: '🟠', text: 'Corrections recommandées avant publication', cls: 'text-amber-500' }
      : { emoji: '🔴', text: 'Corrections importantes requises', cls: 'text-destructive' };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ScoreRing value={scores.global} label="Score global" big />
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreRing value={scores.orthographe} label="Orthographe / Typo" />
            <ScoreRing value={scores.style} label="Style / Répétitions" />
            <ScoreRing value={scores.kdp} label="Amazon KDP" />
            <ScoreRing value={scores.tracesIa} label="Traces IA" />
          </div>
        </div>
        <div className={`mt-6 text-center font-medium ${verdict.cls}`}>
          {verdict.emoji} {verdict.text}
        </div>
      </CardContent>
    </Card>
  );
};
