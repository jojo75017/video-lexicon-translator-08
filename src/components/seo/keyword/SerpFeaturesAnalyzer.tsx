
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Star, MapPin, Image, Video, ShoppingCart, MessageSquare, FileText } from "lucide-react";
import { toast } from "sonner";
import { SerpFeature } from "@/types/seo/Keyword";

const SerpFeaturesAnalyzer = () => {
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [serpFeatures, setSerpFeatures] = useState<SerpFeature[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);

  const analyzeSerpFeatures = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const features: SerpFeature[] = [
        {
          type: 'featured-snippet',
          present: true,
          position: 0,
          content: 'Définition et guide complet visible dans le featured snippet'
        },
        {
          type: 'paa',
          present: true,
          position: 3,
          content: '4 questions "People Also Ask" détectées'
        },
        {
          type: 'local-pack',
          present: false,
          position: undefined
        },
        {
          type: 'images',
          present: true,
          position: 2,
          content: 'Pack d\'images avec 8 résultats'
        },
        {
          type: 'videos',
          present: true,
          position: 5,
          content: '3 vidéos YouTube intégrées'
        },
        {
          type: 'shopping',
          present: true,
          position: 1,
          content: 'Google Shopping avec 6 produits'
        },
        {
          type: 'ads',
          present: true,
          position: 0,
          content: '3 annonces en haut, 2 annonces en bas'
        }
      ];

      const opps = [
        {
          type: 'Featured Snippet',
          opportunity: 85,
          action: 'Créer du contenu structuré avec définitions claires',
          difficulty: 'Moyenne',
          impact: 'Élevé',
          icon: FileText
        },
        {
          type: 'People Also Ask',
          opportunity: 92,
          action: 'Intégrer les questions dans le contenu avec réponses détaillées',
          difficulty: 'Faible',
          impact: 'Élevé',
          icon: MessageSquare
        },
        {
          type: 'Images',
          opportunity: 67,
          action: 'Optimiser les images avec alt-text et légendes',
          difficulty: 'Faible',
          impact: 'Moyen',
          icon: Image
        },
        {
          type: 'Vidéos',
          opportunity: 78,
          action: 'Créer du contenu vidéo optimisé pour Youtube',
          difficulty: 'Élevée',
          impact: 'Élevé',
          icon: Video
        }
      ];

      setSerpFeatures(features);
      setOpportunities(opps);
      setIsAnalyzing(false);
      toast.success(`Analyse SERP terminée pour "${keyword}"`);
    }, 2500);
  };

  const getFeatureIcon = (type: string) => {
    switch (type) {
      case 'featured-snippet': return FileText;
      case 'paa': return MessageSquare;
      case 'local-pack': return MapPin;
      case 'images': return Image;
      case 'videos': return Video;
      case 'shopping': return ShoppingCart;
      case 'ads': return Star;
      default: return Search;
    }
  };

  const getFeatureName = (type: string) => {
    switch (type) {
      case 'featured-snippet': return 'Featured Snippet';
      case 'paa': return 'People Also Ask';
      case 'local-pack': return 'Pack Local';
      case 'images': return 'Images';
      case 'videos': return 'Vidéos';
      case 'shopping': return 'Shopping';
      case 'ads': return 'Annonces';
      default: return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Faible': return 'text-green-600';
      case 'Moyenne': return 'text-yellow-600';
      case 'Élevée': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getOpportunityColor = (opportunity: number) => {
    if (opportunity >= 80) return 'bg-green-500';
    if (opportunity >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-600" />
          Analyseur de SERP Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Mot-clé à analyser dans les SERP..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1"
          />
          <Button onClick={analyzeSerpFeatures} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyse...' : 'Analyser SERP'}
          </Button>
        </div>

        {serpFeatures.length > 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Features détectées dans la SERP</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serpFeatures.map((feature, index) => {
                  const IconComponent = getFeatureIcon(feature.type);
                  return (
                    <Card key={index} className={`p-3 ${feature.present ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-4 w-4 ${feature.present ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className="font-medium text-sm">{getFeatureName(feature.type)}</span>
                        </div>
                        <Badge className={feature.present ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                          {feature.present ? 'Présent' : 'Absent'}
                        </Badge>
                      </div>
                      {feature.present && feature.content && (
                        <p className="text-xs text-gray-600 mt-2">{feature.content}</p>
                      )}
                      {feature.present && feature.position !== undefined && (
                        <p className="text-xs text-blue-600 mt-1">Position: {feature.position}</p>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Opportunités d'optimisation</h3>
              <div className="space-y-3">
                {opportunities.map((opp, index) => {
                  const IconComponent = opp.icon;
                  return (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                            <h4 className="font-medium">{opp.type}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={getDifficultyColor(opp.difficulty)} text-sm>
                              {opp.difficulty}
                            </span>
                            <Badge className={`${getOpportunityColor(opp.opportunity)} text-white`}>
                              {opp.opportunity}%
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700">{opp.action}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Impact: {opp.impact}</span>
                          <Progress value={opp.opportunity} className="w-24 h-2" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Conseil SEO:</strong> Concentrez-vous sur les opportunités à fort impact et faible difficulté pour maximiser vos résultats rapidement.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SerpFeaturesAnalyzer;
