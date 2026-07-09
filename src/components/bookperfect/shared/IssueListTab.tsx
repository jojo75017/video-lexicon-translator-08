import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IssueCard } from './IssueCard';
import type { Analysis, Issue, IssueCategory } from '@/lib/bookperfect/types';
import { CATEGORY_LABELS, SEVERITY_ORDER } from '@/lib/bookperfect/types';

interface Props {
  analysis: Analysis;
  category: IssueCategory;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onApply: (id: string) => void;
  onIgnore: (id: string) => void;
  onReset: (id: string) => void;
}

export const IssueListTab: React.FC<Props> = ({ analysis, category, title, description, icon, onApply, onIgnore, onReset }) => {
  const issues = useMemo(() => {
    return analysis.issues
      .filter((i) => i.category === category)
      .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  }, [analysis.issues, category]);

  const pending = issues.filter((i: Issue) => i.status === 'pending').length;
  const applied = issues.filter((i: Issue) => i.status === 'applied').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title || CATEGORY_LABELS[category]}
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {issues.length} point(s) · {applied} appliquée(s) · {pending} en attente
          </span>
        </CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            🎉 Aucun point détecté dans cette catégorie.
          </p>
        ) : (
          <div className="max-h-[520px] overflow-y-auto pr-3">
            <div className="space-y-2">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onApply={onApply} onIgnore={onIgnore} onReset={onReset} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
