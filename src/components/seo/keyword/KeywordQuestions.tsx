
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const KeywordQuestions = () => {
  const [keyword, setKeyword] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuestions = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const generatedQuestions = [
        `Qu'est-ce que ${keyword} exactement ?`,
        `Comment commencer avec ${keyword} ?`,
        `Quels sont les avantages de ${keyword} ?`,
        `Combien coûte ${keyword} ?`,
        `${keyword} est-il fait pour moi ?`,
        `Comment choisir le meilleur ${keyword} ?`,
        `Quelles sont les erreurs à éviter avec ${keyword} ?`,
        `Où trouver des ressources sur ${keyword} ?`,
        `Comment mesurer le succès de ${keyword} ?`,
        `Quelles sont les alternatives à ${keyword} ?`
      ];
      
      setQuestions(generatedQuestions);
      setIsGenerating(false);
      toast.success(`${generatedQuestions.length} questions FAQ générées`);
    }, 2000);
  };

  const addCustomQuestion = () => {
    const customQuestion = prompt("Entrez votre question personnalisée:");
    if (customQuestion && customQuestion.trim()) {
      setQuestions([...questions, customQuestion.trim()]);
      toast.success("Question ajoutée");
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    toast.success("Question supprimée");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-green-600" />
          Générateur de Questions FAQ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Entrez votre mot-clé pour générer des questions..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1"
          />
          <Button onClick={generateQuestions} disabled={isGenerating}>
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <HelpCircle className="h-4 w-4" />
            )}
          </Button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Questions générées</h4>
              <div className="flex gap-2">
                <Badge variant="outline">{questions.length} questions</Badge>
                <Button variant="outline" size="sm" onClick={addCustomQuestion}>
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {questions.map((question, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm mb-2">{question}</h5>
                      <p className="text-xs text-gray-600">
                        Réponse à développer pour optimiser le contenu SEO
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Conseil SEO:</strong> Intégrez ces questions dans votre contenu 
                comme titres H2/H3 pour optimiser pour la recherche vocale et les featured snippets.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordQuestions;
