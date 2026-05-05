import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, PlayCircle } from 'lucide-react';
import type { Tutoriel } from '@/data/tutoriels';

interface TutorialCardProps {
  tutoriel: Tutoriel;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({ tutoriel }) => {
  const navigate = useNavigate();
  const Icon = tutoriel.icon;

  return (
    <Card className="border-2 transition-all hover:shadow-md hover:border-accent/40 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-base leading-snug">{tutoriel.title}</CardTitle>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1 flex-shrink-0">
            <Clock className="h-3 w-3" />
            {tutoriel.durationMin} min
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{tutoriel.description}</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ol className="space-y-2 list-decimal list-inside text-sm text-foreground/90 flex-1">
          {tutoriel.steps.map((step, i) => (
            <li key={i} className="leading-relaxed">
              <span className="ml-1">{step}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          <Button
            size="sm"
            onClick={() => navigate(tutoriel.targetRoute)}
            className="bg-primary hover:bg-accent transition-colors"
          >
            {tutoriel.ctaLabel ?? "Lancer cette action"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          {tutoriel.videoRoute && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate(tutoriel.videoRoute!)}
            >
              <PlayCircle className="h-4 w-4 mr-1" />
              Voir la vidéo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
