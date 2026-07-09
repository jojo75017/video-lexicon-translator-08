import React from 'react';
import { Check, X, Sparkles, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Issue } from '@/lib/bookperfect/types';

interface Props {
  issue: Issue;
  onApply: (id: string) => void;
  onIgnore: (id: string) => void;
  onReset: (id: string) => void;
}

const severityBadge: Record<Issue['severity'], { label: string; className: string }> = {
  critical: { label: 'Critique', className: 'bg-destructive/10 text-destructive border-destructive/30' },
  warning: { label: 'À revoir', className: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
  info: { label: 'Suggestion', className: 'bg-primary/10 text-primary border-primary/30' },
};

export const IssueCard: React.FC<Props> = ({ issue, onApply, onIgnore, onReset }) => {
  const sev = severityBadge[issue.severity];
  const applied = issue.status === 'applied';
  const ignored = issue.status === 'ignored';

  return (
    <div className={cn(
      'rounded-lg border p-3 transition-colors',
      applied && 'border-green-500/40 bg-green-500/5',
      ignored && 'opacity-60',
      !applied && !ignored && 'border-border bg-card',
    )}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Badge variant="outline" className={cn('text-xs shrink-0', sev.className)}>{sev.label}</Badge>
          <span className="text-xs text-muted-foreground truncate">{issue.chapterTitle}</span>
          {issue.source === 'ai' ? (
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
        </div>
      </div>

      {issue.original && (
        <p className="text-sm">
          <span className="line-through decoration-destructive/60 bg-destructive/5 px-1 rounded">{issue.original}</span>
          {issue.suggestion && (
            <>
              {' → '}
              <span className="bg-green-500/10 text-green-700 dark:text-green-400 px-1 rounded font-medium">{issue.suggestion}</span>
            </>
          )}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1.5">{issue.reason}</p>

      <div className="flex items-center gap-2 mt-3">
        {issue.suggestion ? (
          applied ? (
            <Button size="sm" variant="ghost" onClick={() => onReset(issue.id)} className="h-7 text-xs gap-1">
              <Check className="h-3.5 w-3.5 text-green-600" /> Appliquée — annuler
            </Button>
          ) : (
            <Button size="sm" onClick={() => onApply(issue.id)} disabled={ignored} className="h-7 text-xs gap-1">
              <Check className="h-3.5 w-3.5" /> Appliquer
            </Button>
          )
        ) : (
          <span className="text-xs text-muted-foreground italic">Signalement (à corriger manuellement)</span>
        )}
        {ignored ? (
          <Button size="sm" variant="ghost" onClick={() => onReset(issue.id)} className="h-7 text-xs">Rétablir</Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => onIgnore(issue.id)} className="h-7 text-xs gap-1 text-muted-foreground">
            <X className="h-3.5 w-3.5" /> Ignorer
          </Button>
        )}
      </div>
    </div>
  );
};
