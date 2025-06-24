
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PenTool, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const KeywordMetaContent = () => {
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMetaContent = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setTitle('Guide Complet 2024 : Tout Savoir sur Votre Sujet Principal');
      setMetaDescription('Découvrez notre guide expert complet avec conseils pratiques, astuces et stratégies pour réussir. Solutions efficaces et résultats garantis.');
      setIsGenerating(false);
      toast.success('Contenu méta généré avec l\'IA');
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
        <Button 
          onClick={generateMetaContent}
          disabled={isGenerating}
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
                  https://votresite.com/page-exemple
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
