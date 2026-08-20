/**
 * Barre « Sommaire Stratégique » : budget KDP en temps réel + santé du sommaire.
 * Tous les chiffres sont calculés à partir du sommaire réel de l'auteur.
 */
import { AlertTriangle, BookOpen, Coins, FileText, Gauge, Info, Timer } from 'lucide-react';
import type { BookBrief, BriefOutlineChapter } from '@/lib/v3/bookBrief';
import { outlineBudget, outlineHealth, outlineIssues } from '@/lib/v3/outlineStudio';

export default function V3OutlineStudioBar({ brief, outline }: { brief: BookBrief; outline: BriefOutlineChapter[] }) {
  if (!outline.length) return null;
  const budget = outlineBudget(brief, outline);
  const issues = outlineIssues(brief, outline);
  const health = outlineHealth(issues);
  const healthColor = health >= 85 ? 'var(--v3-emerald, #064e3b)' : health >= 60 ? '#8C6A3F' : '#b91c1c';

  const stats = [
    { icon: BookOpen, label: 'Chapitres', value: String(budget.chapters) },
    { icon: FileText, label: 'Mots visés', value: budget.words.toLocaleString('fr-FR') },
    { icon: FileText, label: 'Pages KDP (6×9)', value: String(budget.pages) },
    { icon: Timer, label: 'Lecture', value: `${budget.minutes} min` },
    { icon: Coins, label: 'Prix conseillé', value: `${budget.suggestedPrice.toFixed(2)} $` },
    { icon: Coins, label: 'Royalties / vente', value: `${budget.royalty.toFixed(2)} $` },
  ];

  return (
    <div className="mt-4 rounded-2xl border p-3" style={{ borderColor: 'var(--v3-border)', background: 'rgba(6,78,59,0.04)' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>
          <Gauge className="h-3.5 w-3.5" /> Budget & santé du sommaire
        </p>
        <span className="rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: healthColor, color: '#fff' }}>
          Santé {health}/100
        </span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border px-2.5 py-2" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
            <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>
              <s.icon className="h-3 w-3" /> {s.label}
            </p>
            <p className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {issues.length > 0 && (
        <ul className="mt-2 space-y-1">
          {issues.slice(0, 8).map((issue, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[11px]" style={{ color: issue.level === 'info' ? 'var(--v3-muted)' : 'var(--v3-ink)' }}>
              {issue.level === 'info'
                ? <Info className="mt-0.5 h-3 w-3 shrink-0" />
                : <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" style={{ color: issue.level === 'error' ? '#b91c1c' : '#8C6A3F' }} />}
              <span>{issue.message}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[10px]" style={{ color: 'var(--v3-muted)' }}>
        Estimations basées sur la densité KDP réelle (~305 mots/page en 6×9) et la formule broché 60 % moins l’impression.
      </p>
    </div>
  );
}
