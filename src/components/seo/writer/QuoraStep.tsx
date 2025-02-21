
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface QuoraStepProps {
  quoraTitle: string;
  setQuoraTitle: (value: string) => void;
  quoraQuestion: string;
  setQuoraQuestion: (value: string) => void;
  quoraAnswer: string;
  setQuoraAnswer: (value: string) => void;
  quoraLink: string;
  setQuoraLink: (value: string) => void;
}

const QuoraStep: React.FC<QuoraStepProps> = ({
  quoraTitle,
  setQuoraTitle,
  quoraQuestion,
  setQuoraQuestion,
  quoraAnswer,
  setQuoraAnswer,
  quoraLink,
  setQuoraLink,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="quora-title" className="font-medium text-blue-800">
          Titre Quora *
        </Label>
        <Input
          id="quora-title"
          placeholder="Ex: Tendance du marketing numérique"
          value={quoraTitle}
          onChange={(e) => setQuoraTitle(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="quora-question" className="font-medium text-blue-800">
          Question Quora *
        </Label>
        <Textarea
          id="quora-question"
          placeholder="Ex: Quelle est la tendance majeure en matière de marketing numérique en 2024 ?"
          value={quoraQuestion}
          onChange={(e) => setQuoraQuestion(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="quora-answer" className="font-medium text-blue-800">
          Réponse Quora
        </Label>
        <Textarea
          id="quora-answer"
          placeholder="Ex: L'intelligence artificielle est utilisée dans tous les aspects du marketing numérique..."
          value={quoraAnswer}
          onChange={(e) => setQuoraAnswer(e.target.value)}
          className="mt-1 min-h-[150px]"
        />
      </div>

      <div>
        <Label htmlFor="quora-link" className="font-medium text-blue-800">
          Lien (optionnel)
        </Label>
        <Input
          id="quora-link"
          placeholder="https://example.com"
          value={quoraLink}
          onChange={(e) => setQuoraLink(e.target.value)}
          className="mt-1"
          type="url"
        />
      </div>
    </div>
  );
};

export default QuoraStep;
