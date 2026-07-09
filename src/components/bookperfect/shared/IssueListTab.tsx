import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IssueCard } from './IssueCard';
import type { Analysis, Issue, IssueCategory } from '@/lib/bookperfect/types';
import { CATEGORY_LABELS, SEVERITY_ORDER } from '@/lib/bookperfect/types';
import { Info } from 'lucide-react';

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
      <CardContent className="space-y-4">
        {category === 'traces-ia' && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Qu’est-ce qu’une trace IA ?</h4>
                <p className="text-sm text-muted-foreground">
                  Ce n’est pas une accusation, mais un motif textuel que le vérificateur a reconnu comme typique d’un contenu généré ou d’un brouillon non finalisé. Une seule trace suffit à signaler un passage à relire.
                </p>
                <div className="text-sm">
                  <p className="font-medium mb-1">Causes fréquentes :</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                    <li>Marqueurs de travail laissés dans le texte : <code>TODO</code>, <code>FIXME</code>, <code>XXX</code></li>
                    <li>Texte de remplissage : <em>Lorem ipsum</em>, placeholders, accolades non remplacées</li>
                    <li>Mentions provisoires : « à compléter », « texte provisoire », « titre temporaire »</li>
                    <li>Formulations typiques d’IA : « en tant que modèle de langage », « je ne peux pas », « n’hésitez pas à »</li>
                    <li>Amorces automatiques : « Voici un exemple », « Chapitre X » non renseigné</li>
                  </ul>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-1">Que faire ?</p>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-0.5">
                    <li>Lisez l’extrait et son contexte dans la carte ci-dessous.</li>
                    <li>Corrigez le passage directement dans votre fichier source (Word, Google Docs, etc.).</li>
                    <li>Réimportez le manuscrit corrigé pour une nouvelle analyse complète.</li>
                  </ol>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Si le reste du manuscrit est déjà validé, vous n’avez pas besoin de tout réanalyser : corrigez la trace et relancez la vérification sur le fichier mis à jour.
                </p>
              </div>
            </div>
          </div>
        )}
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
