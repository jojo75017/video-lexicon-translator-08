
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SeoSuggestionsProps {
  onInsertTitle: (title: string) => void;
  onInsertDescription: (description: string) => void;
}

const SeoSuggestions: React.FC<SeoSuggestionsProps> = ({
  onInsertTitle,
  onInsertDescription
}) => {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const suggestions = {
    titles: [
      "Guide Complet pour Débuter en SEO en 2024",
      "Les 10 Techniques SEO Incontournables",
      "Comment Améliorer son Référencement Naturel"
    ],
    descriptions: [
      "Découvrez notre guide complet pour maîtriser le SEO et améliorer votre référencement naturel. Techniques éprouvées et conseils d'experts inclus.",
      "Apprenez les 10 techniques SEO essentielles pour booster votre site web. Guide pratique avec exemples concrets et résultats mesurables.",
      "Optimisez votre référencement naturel avec nos conseils d'experts. Stratégies SEO efficaces pour augmenter votre visibilité en ligne."
    ]
  };

  const handleCopy = (text: string, type: 'title' | 'description') => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => new Set([...prev, text]));
    toast.success(`${type === 'title' ? 'Titre' : 'Description'} copié !`);
    
    setTimeout(() => {
      setCopiedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(text);
        return newSet;
      });
    }, 2000);
  };

  const handleInsert = (text: string, type: 'title' | 'description') => {
    if (type === 'title') {
      onInsertTitle(text);
    } else {
      onInsertDescription(text);
    }
    toast.success(`${type === 'title' ? 'Titre' : 'Description'} inséré !`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Suggestions SEO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Titres optimisés</h3>
          <div className="space-y-2">
            {suggestions.titles.map((title, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm">{title}</p>
                  <Badge variant="outline" className="mt-1">
                    {title.length} caractères
                  </Badge>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(title, 'title')}
                  >
                    {copiedItems.has(title) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleInsert(title, 'title')}
                  >
                    Utiliser
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Meta descriptions</h3>
          <div className="space-y-2">
            {suggestions.descriptions.map((description, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm">{description}</p>
                  <Badge variant="outline" className="mt-1">
                    {description.length} caractères
                  </Badge>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(description, 'description')}
                  >
                    {copiedItems.has(description) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleInsert(description, 'description')}
                  >
                    Utiliser
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoSuggestions;
