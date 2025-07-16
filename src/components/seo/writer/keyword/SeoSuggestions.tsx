
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Copy, CheckCircle } from "lucide-react";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import { toast } from "sonner";

interface SeoSuggestionsProps {
  keyword: KeywordSuggestion;
  onInsertTitle: (title: string) => void;
  onInsertDescription: (description: string) => void;
}

const SeoSuggestions: React.FC<SeoSuggestionsProps> = ({ 
  keyword, 
  onInsertTitle, 
  onInsertDescription 
}) => {
  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copié dans le presse-papiers`);
  };

  const generateTitleSuggestions = () => {
    if (!keyword?.keyword) return [];
    
    return [
      `Guide complet: ${keyword.keyword} en 2024`,
      `${keyword.keyword}: 10 conseils d'experts`,
      `Tout savoir sur ${keyword.keyword} - Guide pratique`,
      `${keyword.keyword}: Techniques avancées et astuces`,
      `Maîtriser ${keyword.keyword}: Le guide ultime`
    ];
  };

  const generateDescriptionSuggestions = () => {
    if (!keyword?.keyword) return [];
    
    return [
      `Découvrez tout ce qu'il faut savoir sur ${keyword.keyword}. Guide complet avec conseils pratiques, techniques avancées et exemples concrets.`,
      `Apprenez ${keyword.keyword} étape par étape. Méthodes éprouvées, astuces d'experts et ressources pour réussir dès maintenant.`,
      `${keyword.keyword} expliqué simplement. Techniques, conseils et stratégies pour obtenir des résultats rapidement et efficacement.`
    ];
  };

  const titleSuggestions = generateTitleSuggestions();
  const descriptionSuggestions = generateDescriptionSuggestions();

  if (!keyword?.keyword) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-gray-500 text-center">Sélectionnez un mot-clé pour voir les suggestions SEO</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Suggestions SEO pour "{keyword.keyword}"
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Suggestions de titres</h4>
          <div className="space-y-2">
            {titleSuggestions.map((title, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm flex-1">{title}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyToClipboard(title, 'Titre')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onInsertTitle(title)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Utiliser
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Suggestions de descriptions</h4>
          <div className="space-y-2">
            {descriptionSuggestions.map((description, index) => (
              <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                <span className="text-sm flex-1">{description}</span>
                <div className="flex gap-2 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyToClipboard(description, 'Description')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onInsertDescription(description)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Utiliser
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Informations sur le mot-clé</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Volume de recherche:</span>
              <Badge variant="outline" className="ml-2">
                {keyword.volume ? keyword.volume.toLocaleString() : 'N/A'}
              </Badge>
            </div>
            <div>
              <span className="text-blue-700">Difficulté:</span>
              <Badge variant="outline" className="ml-2">
                {keyword.difficulty || 'N/A'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoSuggestions;
