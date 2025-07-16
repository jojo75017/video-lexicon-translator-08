
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface QuoraStepProps {
  title: string;
  setTitle: (title: string) => void;
  question: string;
  setQuestion: (question: string) => void;
  answer: string;
  setAnswer: (answer: string) => void;
  link: string;
  setLink: (link: string) => void;
  onSubmit: () => void;
}

const QuoraStep: React.FC<QuoraStepProps> = ({
  title,
  setTitle,
  question,
  setQuestion,
  answer,
  setAnswer,
  link,
  setLink,
  onSubmit
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Générateur de réponses Quora</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="quora-title">Titre de votre réponse</Label>
          <Input
            id="quora-title"
            placeholder="Ex: Comment optimiser son SEO en 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="quora-question">Question Quora</Label>
          <Input
            id="quora-question"
            placeholder="Ex: Quelle est la meilleure stratégie SEO ?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="quora-answer">Votre réponse détaillée</Label>
          <Textarea
            id="quora-answer"
            placeholder="Rédigez votre réponse complète et détaillée..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
          />
        </div>

        <div>
          <Label htmlFor="quora-link">Lien optionnel (pour plus d'infos)</Label>
          <Input
            id="quora-link"
            placeholder="https://votre-site.com/article-detaille"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <Button onClick={onSubmit} className="w-full">
          Générer la réponse Quora
        </Button>
      </div>
    </Card>
  );
};

export default QuoraStep;
