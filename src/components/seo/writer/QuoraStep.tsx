
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface QuoraStepProps {
  quoraTitle: string;
  setQuoraTitle: (value: string) => void;
  quoraQuestion: string;
  setQuoraQuestion: (value: string) => void;
  quoraAnswer: string;
  setQuoraAnswer: (value: string) => void;
  quoraLink: string;
  setQuoraLink: (value: string) => void;
  onSubmit: () => void;
}

const QuoraStep = ({
  quoraTitle,
  setQuoraTitle,
  quoraQuestion,
  setQuoraQuestion,
  quoraAnswer,
  setQuoraAnswer,
  quoraLink,
  setQuoraLink,
  onSubmit,
}: QuoraStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="quora-title">Titre Quora</Label>
        <Input
          id="quora-title"
          value={quoraTitle}
          onChange={(e) => setQuoraTitle(e.target.value)}
          placeholder="Ex: Comment améliorer son référencement ?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quora-question">Question Quora</Label>
        <Textarea
          id="quora-question"
          value={quoraQuestion}
          onChange={(e) => setQuoraQuestion(e.target.value)}
          placeholder="Ex: Quelles sont les meilleures pratiques SEO en 2024 ?"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quora-answer">Votre réponse</Label>
        <Textarea
          id="quora-answer"
          value={quoraAnswer}
          onChange={(e) => setQuoraAnswer(e.target.value)}
          placeholder="Écrivez votre réponse détaillée ici..."
          className="min-h-[200px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quora-link">Lien (optionnel)</Label>
        <Input
          id="quora-link"
          value={quoraLink}
          onChange={(e) => setQuoraLink(e.target.value)}
          placeholder="https://votre-site.com"
          type="url"
        />
      </div>

      <Button 
        onClick={onSubmit}
        className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
      >
        Générer la réponse Quora
      </Button>
    </div>
  );
};

export default QuoraStep;
