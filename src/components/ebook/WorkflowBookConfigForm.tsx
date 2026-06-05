import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, FileText, Plus } from 'lucide-react';

export interface WorkflowBookConfigFormProps {
  ebookTitle: string;
  bookSubtitle?: string;
  authorName?: string;
  bookDescription?: string;
  genre?: string;
  targetAudience?: string;
  numberOfChapters?: number;
  chapters?: Array<{ id: string; title: string }>;
  onUpdateTitle?: (value: string) => void;
  onUpdateSubtitle?: (value: string) => void;
  onUpdateAuthor?: (value: string) => void;
  onUpdateDescription?: (value: string) => void;
  onGenerateDescription?: () => void;
  isGeneratingDescription?: boolean;
  onUpdateGenre?: (value: string) => void;
  onUpdateTargetAudience?: (value: string) => void;
  onUpdateNumberOfChapters?: (value: number) => void;
  onUpdateChapterTitle?: (chapterId: string, title: string) => void;
  onAddChapter?: () => void;
  /** Visual variant. "card" wraps in a Card (used in classic dashboard). "plain" renders only the inner form (kanban can wrap differently). */
  variant?: 'card' | 'plain';
  title?: string;
}

const InnerForm: React.FC<WorkflowBookConfigFormProps> = ({
  ebookTitle,
  bookSubtitle = '',
  authorName = '',
  bookDescription = '',
  genre = '',
  targetAudience = '',
  numberOfChapters = 8,
  chapters = [],
  onUpdateTitle,
  onUpdateSubtitle,
  onUpdateAuthor,
  onUpdateDescription,
  onGenerateDescription,
  isGeneratingDescription = false,
  onUpdateGenre,
  onUpdateTargetAudience,
  onUpdateNumberOfChapters,
  onUpdateChapterTitle,
  onAddChapter,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="workflow-book-title">Titre *</Label>
          <Input
            id="workflow-book-title"
            value={ebookTitle}
            onChange={(e) => onUpdateTitle?.(e.target.value)}
            placeholder="Titre du livre"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workflow-book-subtitle">Sous-titre</Label>
          <Input
            id="workflow-book-subtitle"
            value={bookSubtitle}
            onChange={(e) => onUpdateSubtitle?.(e.target.value)}
            placeholder="Sous-titre (optionnel mais recommandé KDP)"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workflow-book-author">Nom de l'auteur</Label>
        <Input
          id="workflow-book-author"
          value={authorName}
          onChange={(e) => onUpdateAuthor?.(e.target.value)}
          placeholder="Votre nom ou pseudonyme"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Label htmlFor="workflow-book-description">Petite introduction / sujet</Label>
          {onGenerateDescription && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onGenerateDescription()}
              disabled={isGeneratingDescription || !ebookTitle.trim()}
              className="border-[#008296] text-[#008296] hover:bg-[#008296] hover:text-white"
            >
              {isGeneratingDescription ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Générer avec l'IA
            </Button>
          )}
        </div>
        <Textarea
          id="workflow-book-description"
          value={bookDescription}
          onChange={(e) => onUpdateDescription?.(e.target.value)}
          placeholder="Décrivez en quelques lignes le sujet, l'angle et l'intention du livre"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select value={genre || undefined} onValueChange={(value) => onUpdateGenre?.(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roman">📖 Roman</SelectItem>
              <SelectItem value="thriller">🔪 Thriller/Policier</SelectItem>
              <SelectItem value="romance">💕 Romance</SelectItem>
              <SelectItem value="fantasy">🧙 Fantasy</SelectItem>
              <SelectItem value="science-fiction">🚀 Science-Fiction</SelectItem>
              <SelectItem value="developpement-personnel">🧠 Développement personnel</SelectItem>
              <SelectItem value="business">💼 Business/Entrepreneuriat</SelectItem>
              <SelectItem value="guide-pratique">📚 Guide pratique</SelectItem>
              <SelectItem value="cuisine">🍳 Cuisine</SelectItem>
              <SelectItem value="voyage">✈️ Voyage</SelectItem>
              <SelectItem value="enfant">🧒 Livre pour enfants</SelectItem>
              <SelectItem value="autre">📋 Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Public cible</Label>
          <Select value={targetAudience || undefined} onValueChange={(value) => onUpdateTargetAudience?.(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Enfants (3-6 ans)">🧒 Enfants (3-6 ans)</SelectItem>
              <SelectItem value="Enfants (6-10 ans)">👦 Enfants (6-10 ans)</SelectItem>
              <SelectItem value="Adolescents">🎮 Adolescents</SelectItem>
              <SelectItem value="Jeunes adultes">🎓 Jeunes adultes</SelectItem>
              <SelectItem value="Adultes">👔 Adultes</SelectItem>
              <SelectItem value="Seniors">🌟 Seniors</SelectItem>
              <SelectItem value="Tout public">🌍 Tout public</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workflow-book-chapter-count">Nombre de chapitres</Label>
          <Input
            id="workflow-book-chapter-count"
            type="number"
            min="3"
            max="40"
            value={numberOfChapters}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10) || 8;
              onUpdateNumberOfChapters?.(Math.min(val, 40));
            }}
          />
          {numberOfChapters > 30 && (
            <p className="text-xs text-destructive flex items-start gap-1.5 mt-1">
              <span>⚠️</span>
              <span>Au-delà de 30 chapitres, des timeouts peuvent survenir. Maximum&nbsp;: 40.</span>
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Chapitres du workflow
            </h3>
            <p className="text-xs text-muted-foreground">
              Préparez votre structure ici avant de lancer les agents.
            </p>
          </div>
          {onAddChapter && (
            <Button type="button" variant="outline" size="sm" onClick={() => onAddChapter()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un chapitre
            </Button>
          )}
        </div>

        {chapters.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
            Aucun chapitre saisi pour l'instant.
          </div>
        ) : (
          <div className="space-y-3">
            {chapters.map((chapter, index) => (
              <div key={chapter.id} className="rounded-lg border border-border bg-background/60 p-3">
                <Label htmlFor={`workflow-chapter-${chapter.id}`} className="text-xs text-muted-foreground">
                  Chapitre {index + 1}
                </Label>
                <Input
                  id={`workflow-chapter-${chapter.id}`}
                  value={chapter.title}
                  onChange={(e) => onUpdateChapterTitle?.(chapter.id, e.target.value)}
                  placeholder={`Titre du chapitre ${index + 1}`}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const WorkflowBookConfigForm: React.FC<WorkflowBookConfigFormProps> = (props) => {
  const { variant = 'card', title = 'Configuration du livre pour le workflow' } = props;

  if (variant === 'plain') {
    return <InnerForm {...props} />;
  }

  return (
    <Card className="border-border/60 bg-card/95 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InnerForm {...props} />
      </CardContent>
    </Card>
  );
};

export default WorkflowBookConfigForm;
