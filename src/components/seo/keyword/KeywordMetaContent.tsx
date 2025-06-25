
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PenTool, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Fonctions améliorées pour générer du contenu vraiment personnalisé
const generatePersonalizedTitle = (keyword: string): string => {
  if (!keyword.trim()) return '';
  
  const currentYear = new Date().getFullYear();
  const templates = [
    `${keyword} : Guide Expert ${currentYear} - Conseils et Astuces`,
    `Tout savoir sur ${keyword} - Guide Complet ${currentYear}`,
    `${keyword} : Les Meilleures Pratiques et Solutions`,
    `Guide ${keyword} : Stratégies Efficaces pour Réussir`,
    `${keyword} - Expert Conseils et Recommandations`,
    `Maîtriser ${keyword} : Guide Professionnel ${currentYear}`,
    `${keyword} : Méthodes Éprouvées et Conseils d'Expert`
  ];
  
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
  return selectedTemplate.length > 60 ? selectedTemplate.substring(0, 57) + "..." : selectedTemplate;
};

const generatePersonalizedDescription = (keyword: string): string => {
  if (!keyword.trim()) return '';
  
  const templates = [
    `Découvrez tout sur ${keyword} avec notre guide expert. Conseils pratiques, astuces et stratégies pour réussir. Gratuit et complet.`,
    `${keyword} : guide détaillé avec techniques avancées, bonnes pratiques et conseils d'experts pour optimiser vos résultats.`,
    `Maîtrisez ${keyword} grâce à notre approche step-by-step. Méthodes éprouvées, exemples concrets et astuces pour réussir rapidement.`,
    `Guide complet ${keyword} : tout ce que vous devez savoir. Solutions efficaces, conseils d'experts et outils recommandés.`,
    `${keyword} expliqué simplement : guide pratique avec exemples, conseils et techniques pour obtenir des résultats concrets.`
  ];
  
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
  return selectedTemplate.length > 155 ? selectedTemplate.substring(0, 152) + "..." : selectedTemplate;
};

export const KeywordMetaContent = () => {
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMetaContent = () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé avant de générer');
      return;
    }

    setIsGenerating(true);
    
    // Simuler un délai de génération IA
    setTimeout(() => {
      const generatedTitle = generatePersonalizedTitle(keyword);
      const generatedDescription = generatePersonalizedDescription(keyword);
      
      setTitle(generatedTitle);
      setMetaDescription(generatedDescription);
      setIsGenerating(false);
      toast.success('Contenu méta généré avec succès !');
    }, 1500);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copié dans le presse-papiers`);
  };

  const getTitleColor = () => {
    if (title.length === 0) return 'text-gray-400';
    if (title.length <= 60) return 'text-green-600';
    return 'text-red-600';
  };

  const getDescriptionColor = () => {
    if (metaDescription.length === 0) return 'text-gray-400';
    if (metaDescription.length >= 150 && metaDescription.length <= 155) return 'text-green-600';
    if (metaDescription.length <= 160) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5 text-blue-600" />
          Optimisation Title & Meta Description
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot-clé principal
          </label>
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Ex: conseiller en aquariophilie, voyage à Paris..."
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Entrez votre mot-clé pour générer du contenu personnalisé
          </p>
        </div>

        <Button 
          onClick={generateMetaContent}
          disabled={isGenerating || !keyword.trim()}
          className="w-full gap-2"
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <PenTool className="h-4 w-4" />
          )}
          Générer Title & Meta avec IA
        </Button>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Title Tag</label>
              <div className="flex items-center gap-2">
                <Badge className={getTitleColor()}>
                  {title.length}/60 caractères
                </Badge>
                {title && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(title, 'Title')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Votre title tag optimisé..."
              maxLength={80}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optimal : 50-60 caractères. Doit inclure le mot-clé principal.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Meta Description</label>
              <div className="flex items-center gap-2">
                <Badge className={getDescriptionColor()}>
                  {metaDescription.length}/155 caractères
                </Badge>
                {metaDescription && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(metaDescription, 'Meta Description')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Votre meta description optimisée..."
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optimal : 150-155 caractères. Doit être engageante et inclure le mot-clé.
            </p>
          </div>

          {title && metaDescription && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Aperçu Google SERP</h4>
              <div className="space-y-1">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                  {title}
                </div>
                <div className="text-green-700 text-sm">
                  https://votresite.com/{keyword.toLowerCase().replace(/\s+/g, '-')}
                </div>
                <div className="text-gray-600 text-sm">
                  {metaDescription}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
