import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const FirecrawlNoticeBanner: React.FC<{ variant?: 'info' | 'warning' }> = ({ variant = 'info' }) => {
  const isWarning = variant === 'warning';
  return (
    <Card className={`border-l-4 ${isWarning ? 'border-l-amber-500 bg-amber-50/60 dark:bg-amber-950/20' : 'border-l-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/15'} rounded-r-lg`}>
      <CardContent className="p-3.5 flex items-start gap-3">
        <div className={`shrink-0 mt-0.5 ${isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
          {isWarning ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {isWarning ? 'Maintenance en cours' : 'Information importante'}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            KDSpy / Espion Amazon utilise le service Firecrawl pour scanner les résultats Amazon en temps réel. 
            Nous sommes en train de reconnecter ce connecteur pour garantir des analyses fiables. 
            Cette fonctionnalité n'est <strong>pas bloquante</strong> pour la création et la publication de vos livres : 
            vous pouvez continuer à utiliser tous les autres outils normalement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirecrawlNoticeBanner;
