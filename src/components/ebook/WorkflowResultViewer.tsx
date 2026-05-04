import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, RefreshCw, Eye } from 'lucide-react';

interface WorkflowResultViewerProps {
  stepId: string;
  stepName: string;
  result: {
    displayContent: string;
    generatedAt: string;
  } | undefined;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  children: React.ReactNode;
}

export const WorkflowResultViewer: React.FC<WorkflowResultViewerProps> = ({
  stepId,
  stepName,
  result,
  onRegenerate,
  isRegenerating,
  children
}) => {
  const [showSaved, setShowSaved] = React.useState(!!result);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h2>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold mt-2">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('**')) {
        const parts = line.split('**');
        return (
          <p key={i} className="mt-1">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          </p>
        );
      }
      if (line.startsWith('_') && line.endsWith('_')) {
        return <p key={i} className="italic text-muted-foreground mt-2">{line.slice(1, -1)}</p>;
      }
      if (line.startsWith('✓') || line.startsWith('✗') || line.startsWith('•') || line.startsWith('⚠️') || line.startsWith('✦') || line.startsWith('→')) {
        return <p key={i} className="ml-4 mt-1">{line}</p>;
      }
      if (line.startsWith('---')) {
        return <hr key={i} className="my-4 border-border" />;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="mt-1">{line}</p>;
    });
  };

  if (result && showSaved) {
    return (
      <div className="space-y-4">
        {/* Banner showing saved result */}
        <Card className="border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/5">
          <CardHeader className="pb-2">
            <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-start">
              <CardTitle className="flex min-w-0 items-center gap-2 text-lg leading-tight">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="min-w-0 break-words">Résultat {stepId} - {stepName}</span>
              </CardTitle>
              <div className="flex min-w-0 items-center gap-2">
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(result.generatedAt)}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Généré par le workflow complet. Vous pouvez consulter ou régénérer.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display content */}
            <div className="p-4 bg-background/80 rounded-lg border max-h-[500px] overflow-y-auto">
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                {renderMarkdown(result.displayContent)}
              </div>
            </div>

            {/* Actions */}
            <div className="grid gap-2 sm:flex">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaved(false)}
                className="h-auto min-h-9 flex-1 whitespace-normal px-3 py-2 leading-snug"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Régénérer manuellement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show the original component for manual generation
  return (
    <div className="space-y-4">
      {result && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSaved(true)}
          className="h-auto min-h-9 w-full justify-start whitespace-normal text-left leading-snug text-muted-foreground hover:text-foreground"
        >
          <Eye className="h-4 w-4 mr-2" />
          Voir le résultat sauvegardé du workflow complet
        </Button>
      )}
      {children}
    </div>
  );
};
