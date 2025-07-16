
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, Copy, Check, FileText, Image, Lightbulb } from 'lucide-react';
import { toast } from "sonner";
import MetaContentGenerator from '@/components/seo/MetaContentGenerator';

const SuggestionsTabContent = () => {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Simulation de génération de suggestions
  const generateSuggestions = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    setIsLoading(true);
    
    // Délai simulé pour l'analyse
    setTimeout(() => {
      let demoSuggestions = [];
      
      // Suggestions spécifiques pour l'aquariophilie
      if (keyword.toLowerCase() === 'aquariophilie') {
        demoSuggestions = [
          {
            type: 'title',
            content: `Guide Complet d'Aquariophilie: Conseils & Astuces pour Débutants`,
            score: 94
          },
          {
            type: 'title',
            content: `Aquariophilie: 10 Erreurs à Éviter pour un Aquarium Réussi`,
            score: 91
          },
          {
            type: 'title',
            content: `Comment Débuter en Aquariophilie: Guide Pas à Pas | Conseils d'Experts`,
            score: 89
          },
          {
            type: 'meta',
            content: `Découvrez notre guide complet sur l'aquariophilie: choix des poissons, entretien de l'aquarium, et conseils d'experts pour débutants et passionnés.`,
            score: 96
          },
          {
            type: 'meta',
            content: `Tout savoir sur l'aquariophilie: équipements nécessaires, poissons compatibles, plantes aquatiques et techniques d'entretien pour un écosystème sain.`,
            score: 93
          },
          {
            type: 'meta',
            content: `Guide d'aquariophilie pour débutants: apprenez à créer, entretenir et profiter d'un aquarium magnifique avec nos conseils d'experts.`,
            score: 90
          },
          {
            type: 'image',
            content: `https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80`,
            alt: `Aquarium d'eau douce avec poissons tropicaux et plantes aquatiques`,
            score: 93
          },
          {
            type: 'image',
            content: `https://images.unsplash.com/photo-1571166581046-d1bff23c1b81?auto=format&fit=crop&w=800&q=80`,
            alt: `Ensemble d'équipements pour aquariophilie: pompe, filtres et éclairage`,
            score: 87
          },
          {
            type: 'image',
            content: `https://images.unsplash.com/photo-1534575180408-b7d7c0136ee8?auto=format&fit=crop&w=800&q=80`,
            alt: `Petit poisson Betta dans un aquarium décoré avec substrat et plantes`,
            score: 85
          }
        ];
      } 
      // Suggestions par défaut pour les autres mots-clés
      else {
        demoSuggestions = [
          {
            type: 'title',
            content: `Guide Ultime : ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} en 2024 - Conseils d'experts`,
            score: 92
          },
          {
            type: 'title',
            content: `Les 10 Meilleures Stratégies pour ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} | Guide Complet`,
            score: 89
          },
          {
            type: 'title',
            content: `Comment Optimiser votre ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} pour de Meilleurs Résultats`,
            score: 87
          },
          {
            type: 'meta',
            content: `Découvrez les meilleures pratiques pour ${keyword} dans notre guide complet. Nos experts partagent des conseils éprouvés et stratégies innovantes pour des résultats garantis.`,
            score: 94
          },
          {
            type: 'meta',
            content: `Tout ce que vous devez savoir sur ${keyword} en un seul guide. Techniques avancées, exemples concrets et méthodes testées par les professionnels.`,
            score: 91
          },
          {
            type: 'meta',
            content: `Améliorez vos performances avec nos stratégies pour ${keyword}. Guide pratique avec étapes détaillées, études de cas et bonnes pratiques industrielles.`,
            score: 88
          },
          {
            type: 'image',
            content: `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80`,
            alt: `Professionnels travaillant sur des stratégies de ${keyword}`,
            score: 85
          },
          {
            type: 'image',
            content: `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80`,
            alt: `Technologies innovantes pour ${keyword}`,
            score: 83
          },
          {
            type: 'image',
            content: `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80`,
            alt: `Solutions digitales pour optimiser ${keyword}`,
            score: 80
          }
        ];
      }
      
      setSuggestions(demoSuggestions);
      setIsLoading(false);
      toast.success("Suggestions générées avec succès");
    }, 1500);
  };
  
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
    
    toast.success("Copié dans le presse-papier");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Générateur de suggestions SEO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input 
              placeholder="Entrez un mot-clé principal (ex: aquariophilie, marketing digital)" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={generateSuggestions}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Générer
                </>
              )}
            </Button>
          </div>
          
          {suggestions.length > 0 && (
            <Tabs defaultValue="title">
              <TabsList className="mb-4">
                <TabsTrigger value="title">
                  <FileText className="h-4 w-4 mr-2" />
                  Balises Title
                </TabsTrigger>
                <TabsTrigger value="meta">
                  <FileText className="h-4 w-4 mr-2" />
                  Meta Description
                </TabsTrigger>
                <TabsTrigger value="image">
                  <Image className="h-4 w-4 mr-2" />
                  Images Proposées
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="title" className="space-y-4">
                {suggestions.filter(s => s.type === 'title').map((suggestion, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 mb-2">
                        Score SEO: {suggestion.score}/100
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(suggestion.content, index)}
                      >
                        {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-gray-900">{suggestion.content}</p>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Caractères: {suggestion.content.length}/60</span>
                      <span className={suggestion.content.length > 60 ? "text-red-500" : "text-green-500"}>
                        {suggestion.content.length > 60 ? "Trop long" : "Longueur optimale"}
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="meta" className="space-y-4">
                {suggestions.filter(s => s.type === 'meta').map((suggestion, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200 mb-2">
                        Score SEO: {suggestion.score}/100
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(suggestion.content, index + 100)}
                      >
                        {copiedIndex === index + 100 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-gray-900">{suggestion.content}</p>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Caractères: {suggestion.content.length}/155</span>
                      <span className={suggestion.content.length > 155 ? "text-red-500" : "text-green-500"}>
                        {suggestion.content.length > 155 ? "Trop long" : "Longueur optimale"}
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="image" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.filter(s => s.type === 'image').map((suggestion, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-2">
                        Score SEO: {suggestion.score}/100
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(suggestion.content, index + 200)}
                      >
                        {copiedIndex === index + 200 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="aspect-video mb-2 rounded-md overflow-hidden bg-gray-100">
                      <img 
                        src={suggestion.content} 
                        alt={suggestion.alt} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm text-gray-500 mb-1">Alt suggéré:</div>
                    <p className="text-gray-900 text-sm bg-gray-50 p-2 rounded border border-gray-100">
                      {suggestion.alt}
                    </p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}
          
          {suggestions.length === 0 && !isLoading && (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <Lightbulb className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-600">
                Entrez un mot-clé et cliquez sur "Générer" pour obtenir des suggestions de titres, 
                descriptions et images optimisées pour le SEO.
              </p>
            </div>
          )}
          
          {isLoading && (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <RefreshCw className="h-12 w-12 mx-auto text-gray-400 animate-spin" />
              <p className="mt-4 text-gray-600">Génération des suggestions en cours...</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <MetaContentGenerator />
    </div>
  );
};

export default SuggestionsTabContent;
