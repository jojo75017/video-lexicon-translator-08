import React from 'react';
import { CheckCircle2, AlertTriangle, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IssueListTab } from '../shared/IssueListTab';
import type { Analysis } from '@/lib/bookperfect/types';

interface Props {
  analysis: Analysis;
  onApply: (id: string) => void;
  onIgnore: (id: string) => void;
  onReset: (id: string) => void;
}

export const AmazonKdpTab: React.FC<Props> = ({ analysis, onApply, onIgnore, onReset }) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Contrôle de conformité Amazon KDP
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {analysis.kdpReport.map((c) => (
          <div key={c.label} className="flex items-start gap-2 text-sm">
            {c.ok
              ? <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              : <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />}
            <span><strong>{c.label}</strong> — <span className="text-muted-foreground">{c.detail}</span></span>
          </div>
        ))}
      </CardContent>
    </Card>

    <IssueListTab
      analysis={analysis}
      category="kdp"
      title="Points éditoriaux KDP"
      description="Éléments à corriger pour une publication propre sur Amazon."
      icon={<ShoppingCart className="h-5 w-5 text-primary" />}
      onApply={onApply}
      onIgnore={onIgnore}
      onReset={onReset}
    />
  </div>
);
