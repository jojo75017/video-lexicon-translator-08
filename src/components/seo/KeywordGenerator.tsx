
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, LineChart, Line } from 'recharts';
import { Search, RefreshCw, Map, FileBarChart, Download, Link2, ListFilter, MessageSquare } from 'lucide-react';
import { toast } from "sonner";
import { KeywordSuggestion, KeywordGroup, KeywordIntent } from '@/types/seo';
import { Separator } from '@/components/ui/separator';

const KeywordGenerator = () => {
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [niche, setNiche] = useState('');
  const [objective, setObjective] = useState('blog');
  const [region, setRegion] = useState('FR');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [keywordResults, setKeywordResults] = useState<{
    mainKeywords: KeywordSuggestion[];
    longTail: KeywordSuggestion[];
    questions: KeywordSuggestion[];
    related: KeywordSuggestion[];
    semantic: string[];
    competitors: {name: string, url: string, strength: number}[];
    byIntent: KeywordIntent;
    contentIdeas: {title: string, type: string}[];
  } | null>(null);

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return "bg-green-100 text-green-800 border-green-200";
    if (difficulty < 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };
  
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 30) return "Facile";
    if (difficulty < 60) return "Moyen";
    return "Difficile";
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      toast.error("Veuillez saisir un mot-clé principal");
      return;
    }
    
    setIsLoading(true);
    
    // Simuler un délai de chargement
    setTimeout(() => {
      // Données simulées basées sur l'entrée
      const baseVolume = Math.floor(Math.random() * 5000 + 1000);
      
      // Générer les mots-clés principaux
      const mainKeywords: KeywordSuggestion[] = [
        {
          keyword: keyword,
          volume: baseVolume,
          difficulty: Math.floor(Math.random() * 70 + 30),
          cpc: parseFloat((Math.random() * 3 + 1).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 100
        },
        {
          keyword: `meilleur ${keyword}`,
          volume: Math.floor(baseVolume * 0.7),
          difficulty: Math.floor(Math.random() * 80 + 20),
          cpc: parseFloat((Math.random() * 4 + 2).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 90
        },
        {
          keyword: `${keyword} pas cher`,
          volume: Math.floor(baseVolume * 0.6),
          difficulty: Math.floor(Math.random() * 60 + 20),
          cpc: parseFloat((Math.random() * 3 + 1).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 85
        },
        {
          keyword: `${keyword} prix`,
          volume: Math.floor(baseVolume * 0.5),
          difficulty: Math.floor(Math.random() * 50 + 20),
          cpc: parseFloat((Math.random() * 2 + 1).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 80
        },
        {
          keyword: `${keyword} avis`,
          volume: Math.floor(baseVolume * 0.45),
          difficulty: Math.floor(Math.random() * 40 + 20),
          cpc: parseFloat((Math.random() * 1 + 0.5).toFixed(2)),
          competition: parseFloat(Math.random().toFixed(2)),
          relevance: 75
        }
      ];
      
      // Générer des mots-clés longue traîne
      const longTail: KeywordSuggestion[] = [
        {
          keyword: `${keyword} pour débutant`,
          volume: Math.floor(baseVolume * 0.3),
          difficulty: Math.floor(Math.random() * 40 + 10),
          cpc: parseFloat((Math.random() * 1.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.6).toFixed(2)),
          relevance: 70
        },
        {
          keyword: `${keyword} en famille`,
          volume: Math.floor(baseVolume * 0.25),
          difficulty: Math.floor(Math.random() * 35 + 10),
          cpc: parseFloat((Math.random() * 1.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.5).toFixed(2)),
          relevance: 65
        },
        {
          keyword: `${keyword} dernière minute`,
          volume: Math.floor(baseVolume * 0.2),
          difficulty: Math.floor(Math.random() * 30 + 10),
          cpc: parseFloat((Math.random() * 2).toFixed(2)),
          competition: parseFloat((Math.random() * 0.6).toFixed(2)),
          relevance: 60
        },
        {
          keyword: `${keyword} tout compris`,
          volume: Math.floor(baseVolume * 0.18),
          difficulty: Math.floor(Math.random() * 25 + 15),
          cpc: parseFloat((Math.random() * 1.8).toFixed(2)),
          competition: parseFloat((Math.random() * 0.5).toFixed(2)),
          relevance: 55
        }
      ];
      
      // Générer des questions fréquentes
      const questions: KeywordSuggestion[] = [
        {
          keyword: `comment organiser ${keyword}`,
          volume: Math.floor(baseVolume * 0.15),
          difficulty: Math.floor(Math.random() * 40),
          cpc: parseFloat((Math.random() * 1).toFixed(2)),
          competition: parseFloat((Math.random() * 0.4).toFixed(2)),
          relevance: 80
        },
        {
          keyword: `pourquoi choisir ${keyword}`,
          volume: Math.floor(baseVolume * 0.12),
          difficulty: Math.floor(Math.random() * 35),
          cpc: parseFloat((Math.random() * 0.8).toFixed(2)),
          competition: parseFloat((Math.random() * 0.3).toFixed(2)),
          relevance: 75
        },
        {
          keyword: `quand partir pour ${keyword}`,
          volume: Math.floor(baseVolume * 0.14),
          difficulty: Math.floor(Math.random() * 38),
          cpc: parseFloat((Math.random() * 0.9).toFixed(2)),
          competition: parseFloat((Math.random() * 0.35).toFixed(2)),
          relevance: 85
        },
        {
          keyword: `où loger pendant ${keyword}`,
          volume: Math.floor(baseVolume * 0.1),
          difficulty: Math.floor(Math.random() * 30),
          cpc: parseFloat((Math.random() * 0.7).toFixed(2)),
          competition: parseFloat((Math.random() * 0.25).toFixed(2)),
          relevance: 70
        }
      ];
      
      // Générer des mots-clés liés
      const related: KeywordSuggestion[] = [
        {
          keyword: keyword.includes("voyage") ? "circuit touristique" : `${keyword} guide`,
          volume: Math.floor(baseVolume * 0.4),
          difficulty: Math.floor(Math.random() * 50 + 20),
          cpc: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.7).toFixed(2)),
          relevance: 60
        },
        {
          keyword: keyword.includes("voyage") ? "activités touristiques" : `alternatives à ${keyword}`,
          volume: Math.floor(baseVolume * 0.35),
          difficulty: Math.floor(Math.random() * 45 + 15),
          cpc: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.65).toFixed(2)),
          relevance: 55
        },
        {
          keyword: keyword.includes("voyage") ? "hébergement" : `${keyword} comparatif`,
          volume: Math.floor(baseVolume * 0.3),
          difficulty: Math.floor(Math.random() * 40 + 15),
          cpc: parseFloat((Math.random() * 1.2 + 0.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.6).toFixed(2)),
          relevance: 50
        }
      ];
      
      // Champ sémantique
      const semantic = keyword.includes("voyage") ? 
        ["séjour", "vacances", "tourisme", "excursion", "découverte", "circuit", "visite", "escapade"] :
        ["guide", "comparatif", "avis", "test", "review", "tutoriel", "conseils", "astuces"];
      
      // Sites concurrents (simulés)
      const competitors = [
        {
          name: `Top${keyword.split(' ')[0]}.com`,
          url: `https://www.top${keyword.split(' ')[0].toLowerCase()}.com`,
          strength: Math.floor(Math.random() * 40 + 60)
        },
        {
          name: `Guide${keyword.split(' ')[0]}.fr`,
          url: `https://www.guide${keyword.split(' ')[0].toLowerCase()}.fr`,
          strength: Math.floor(Math.random() * 30 + 50)
        },
        {
          name: `${keyword.split(' ')[0]}Expert.com`,
          url: `https://www.${keyword.split(' ')[0].toLowerCase()}expert.com`,
          strength: Math.floor(Math.random() * 30 + 40)
        },
        {
          name: `Meilleur${keyword.split(' ')[0]}.fr`,
          url: `https://www.meilleur${keyword.split(' ')[0].toLowerCase()}.fr`,
          strength: Math.floor(Math.random() * 20 + 40)
        }
      ];
      
      // Regroupement par intention
      const byIntent: KeywordIntent = {
        informational: [...questions, {
          keyword: `guide ${keyword}`,
          volume: Math.floor(baseVolume * 0.22),
          difficulty: Math.floor(Math.random() * 45),
          cpc: parseFloat((Math.random() * 1.2).toFixed(2)),
          competition: parseFloat((Math.random() * 0.5).toFixed(2)),
          relevance: 75
        }],
        transactional: [{
          keyword: `réserver ${keyword}`,
          volume: Math.floor(baseVolume * 0.28),
          difficulty: Math.floor(Math.random() * 60 + 20),
          cpc: parseFloat((Math.random() * 3 + 1).toFixed(2)),
          competition: parseFloat((Math.random() * 0.8).toFixed(2)),
          relevance: 85
        }, {
          keyword: `acheter ${keyword}`,
          volume: Math.floor(baseVolume * 0.25),
          difficulty: Math.floor(Math.random() * 55 + 25),
          cpc: parseFloat((Math.random() * 3.5 + 1.5).toFixed(2)),
          competition: parseFloat((Math.random() * 0.85).toFixed(2)),
          relevance: 80
        }],
        navigational: [{
          keyword: `${keyword} site officiel`,
          volume: Math.floor(baseVolume * 0.18),
          difficulty: Math.floor(Math.random() * 30 + 10),
          cpc: parseFloat((Math.random() * 1).toFixed(2)),
          competition: parseFloat((Math.random() * 0.4).toFixed(2)),
          relevance: 60
        }]
      };
      
      // Idées de contenu
      const contentIdeas = [
        { title: `Guide complet : tout savoir sur ${keyword}`, type: 'Article de fond' },
        { title: `Les 10 erreurs à éviter lors de ${keyword}`, type: 'Liste' },
        { title: `Comment planifier ${keyword} : le guide étape par étape`, type: 'Tutoriel' },
        { title: `${keyword} vs alternatives : comparatif complet`, type: 'Comparatif' },
        { title: `FAQ : vos questions sur ${keyword} répondues par des experts`, type: 'FAQ' }
      ];
      
      setKeywordResults({
        mainKeywords,
        longTail,
        questions,
        related,
        semantic,
        competitors,
        byIntent,
        contentIdeas
      });
      
      setIsLoading(false);
      toast.success(`Analyse complète pour "${keyword}" générée avec succès`, {
        description: `${mainKeywords.length + longTail.length + questions.length + related.length} mots-clés analysés`
      });
    }, 2000);
  };

  const handleExport = () => {
    if (!keywordResults) return;
    
    let csvContent = "Mot-clé,Volume,Difficulté,CPC,Concurrence\n";
    
    // Ajouter tous les mots-clés au CSV
    [...keywordResults.mainKeywords, ...keywordResults.longTail, ...keywordResults.questions, ...keywordResults.related].forEach(kw => {
      csvContent += `${kw.keyword},${kw.volume},${kw.difficulty},${kw.cpc},${kw.competition}\n`;
    });
    
    // Créer un blob et le télécharger
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `keywords-${keyword.replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Exportation CSV réussie");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
            <Search className="h-5 w-5 text-indigo-600" />
            Générateur de Mots-Clés SEO
          </CardTitle>
          <p className="text-sm text-indigo-600">
            Générez une stratégie de mots-clés complète et visuelle pour votre contenu
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="keyword" className="text-sm font-medium text-gray-700 block mb-1">
                  Mot-clé principal
                </label>
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: voyage au Vietnam"
                  className="border-indigo-200 focus-visible:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="objective" className="text-sm font-medium text-gray-700 block mb-1">
                  Objectif
                </label>
                <Select value={objective} onValueChange={setObjective}>
                  <SelectTrigger id="objective" className="border-indigo-200 focus:ring-indigo-500">
                    <SelectValue placeholder="Type de contenu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="landing">Landing page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="niche" className="text-sm font-medium text-gray-700 block mb-1">
                  Niche ou secteur
                </label>
                <Input
                  id="niche"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Ex: voyage, tech, mode"
                  className="border-indigo-200 focus-visible:ring-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="language" className="text-sm font-medium text-gray-700 block mb-1">
                    Langue
                  </label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="border-indigo-200 focus:ring-indigo-500">
                      <SelectValue placeholder="Langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">Anglais</SelectItem>
                      <SelectItem value="es">Espagnol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="region" className="text-sm font-medium text-gray-700 block mb-1">
                    Région
                  </label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger id="region" className="border-indigo-200 focus:ring-indigo-500">
                      <SelectValue placeholder="Pays cible" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="BE">Belgique</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="CH">Suisse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full md:w-auto bg-indigo-700 hover:bg-indigo-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Générer ma stratégie de mots-clés
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {keywordResults && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Résultats pour "{keyword}"</h2>
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter CSV
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <FileBarChart className="h-4 w-4" />
                <span className="hidden md:inline">Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="longtail" className="flex items-center gap-1">
                <ListFilter className="h-4 w-4" />
                <span className="hidden md:inline">Longue traîne</span>
              </TabsTrigger>
              <TabsTrigger value="intent" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden md:inline">Intentions</span>
              </TabsTrigger>
              <TabsTrigger value="visualization" className="flex items-center gap-1">
                <Map className="h-4 w-4" />
                <span className="hidden md:inline">Visualisation</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-1">
                <Link2 className="h-4 w-4" />
                <span className="hidden md:inline">Idées de contenu</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Onglet Vue d'ensemble */}
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mots-clés principaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Mot-clé</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Volume</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Difficulté</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">CPC</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Concurrence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {keywordResults.mainKeywords.map((kw, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">{kw.keyword}</td>
                            <td className="px-4 py-3 text-sm">{kw.volume.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                                {kw.difficulty}/100 - {getDifficultyLabel(kw.difficulty)}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">{kw.cpc?.toLocaleString(undefined, {style: 'currency', currency: 'EUR', minimumFractionDigits: 2})}</td>
                            <td className="px-4 py-3 text-sm">{(kw.competition! * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-4">Champ sémantique</h3>
                    <div className="flex flex-wrap gap-2">
                      {keywordResults.semantic.map((word, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-4">Sites concurrents</h3>
                    <div className="space-y-3">
                      {keywordResults.competitors.map((competitor, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="font-medium">{competitor.name}</p>
                            <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                              {competitor.url}
                            </a>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={
                              competitor.strength > 75 
                                ? "bg-red-100 text-red-800 border-red-200" 
                                : competitor.strength > 50 
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                                : "bg-green-100 text-green-800 border-green-200"
                            }
                          >
                            Force {competitor.strength}/100
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Onglet Longue traîne */}
            <TabsContent value="longtail" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mots-clés longue traîne et questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-md font-medium mb-3">Longue traîne</h3>
                      <div className="space-y-2">
                        {keywordResults.longTail.map((kw, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-md">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">{kw.keyword}</p>
                              <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                                {getDifficultyLabel(kw.difficulty)}
                              </Badge>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-500">
                              <span>{kw.volume.toLocaleString()} recherches/mois</span>
                              <span>CPC: {kw.cpc?.toLocaleString(undefined, {style: 'currency', currency: 'EUR', minimumFractionDigits: 2})}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium mb-3">Questions fréquentes</h3>
                      <div className="space-y-2">
                        {keywordResults.questions.map((kw, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-md border border-blue-100">
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-blue-800">{kw.keyword}</p>
                              <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                                {getDifficultyLabel(kw.difficulty)}
                              </Badge>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-blue-600">
                              <span>{kw.volume.toLocaleString()} recherches/mois</span>
                              <span>CPC: {kw.cpc?.toLocaleString(undefined, {style: 'currency', currency: 'EUR', minimumFractionDigits: 2})}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-3">Mots-clés liés</h3>
                    <div className="space-y-2">
                      {keywordResults.related.map((kw, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{kw.keyword}</p>
                            <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                              {getDifficultyLabel(kw.difficulty)}
                            </Badge>
                          </div>
                          <div className="flex justify-between mt-2 text-sm text-gray-500">
                            <span>{kw.volume.toLocaleString()} recherches/mois</span>
                            <span>CPC: {kw.cpc?.toLocaleString(undefined, {style: 'currency', currency: 'EUR', minimumFractionDigits: 2})}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Onglet Intentions */}
            <TabsContent value="intent" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Regroupement par intention de recherche</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-blue-100 text-blue-800 p-1 rounded">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <h3 className="text-md font-medium">Informationnelle</h3>
                      </div>
                      <div className="space-y-2">
                        {keywordResults.byIntent.informational.map((kw, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-md border border-blue-100">
                            <p className="font-medium text-blue-800">{kw.keyword}</p>
                            <div className="flex justify-between mt-2 text-sm text-blue-600">
                              <span>{kw.volume.toLocaleString()}</span>
                              <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                                {getDifficultyLabel(kw.difficulty)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-green-100 text-green-800 p-1 rounded">
                          <Search className="h-4 w-4" />
                        </div>
                        <h3 className="text-md font-medium">Transactionnelle</h3>
                      </div>
                      <div className="space-y-2">
                        {keywordResults.byIntent.transactional.map((kw, index) => (
                          <div key={index} className="p-3 bg-green-50 rounded-md border border-green-100">
                            <p className="font-medium text-green-800">{kw.keyword}</p>
                            <div className="flex justify-between mt-2 text-sm text-green-600">
                              <span>{kw.volume.toLocaleString()}</span>
                              <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                                {getDifficultyLabel(kw.difficulty)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-purple-100 text-purple-800 p-1 rounded">
                          <Link2 className="h-4 w-4" />
                        </div>
                        <h3 className="text-md font-medium">Navigationnelle</h3>
                      </div>
                      <div className="space-y-2">
                        {keywordResults.byIntent.navigational.map((kw, index) => (
                          <div key={index} className="p-3 bg-purple-50 rounded-md border border-purple-100">
                            <p className="font-medium text-purple-800">{kw.keyword}</p>
                            <div className="flex justify-between mt-2 text-sm text-purple-600">
                              <span>{kw.volume.toLocaleString()}</span>
                              <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                                {getDifficultyLabel(kw.difficulty)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Onglet Visualisation */}
            <TabsContent value="visualization" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visualisation des données</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Graphique Volume */}
                    <div>
                      <h3 className="text-md font-medium mb-3">Volume de recherche</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[...keywordResults.mainKeywords].sort((a, b) => b.volume - a.volume).slice(0, 5)}
                            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [`${value} recherches`, "Volume"]} 
                              labelFormatter={(label) => `Mot-clé: ${label}`}
                            />
                            <Bar dataKey="volume" fill="#8884d8" name="Volume de recherche" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Graphique Difficulté */}
                    <div>
                      <h3 className="text-md font-medium mb-3">Difficulté et concurrence</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart
                            margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid />
                            <XAxis type="number" dataKey="difficulty" name="Difficulté" unit="/100" />
                            <YAxis type="number" dataKey="competition" name="Concurrence" unit="%" tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} />
                            <Tooltip 
                              formatter={(value, name) => [
                                name === "Difficulté" ? `${value}/100` : `${(value * 100).toFixed(1)}%`, 
                                name
                              ]}
                              labelFormatter={(index) => {
                                const allKeywords = [
                                  ...keywordResults.mainKeywords, 
                                  ...keywordResults.longTail,
                                  ...keywordResults.questions,
                                  ...keywordResults.related
                                ];
                                return `Mot-clé: ${allKeywords[index]?.keyword}`;
                              }}
                            />
                            <Legend />
                            <Scatter 
                              name="Mots-clés" 
                              data={[
                                ...keywordResults.mainKeywords, 
                                ...keywordResults.longTail,
                                ...keywordResults.questions,
                                ...keywordResults.related
                              ]} 
                              fill="#8884d8" 
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  {/* Nuage de mots-clés */}
                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-3">Nuage de mots-clés</h3>
                    <div className="p-6 bg-gray-50 rounded-lg min-h-[150px] flex flex-wrap gap-2 justify-center">
                      {[
                        ...keywordResults.mainKeywords, 
                        ...keywordResults.longTail, 
                        ...keywordResults.questions, 
                        ...keywordResults.related
                      ].map((kw, i) => {
                        // Calculer la taille du texte en fonction du volume
                        const maxVolume = Math.max(
                          ...keywordResults.mainKeywords.map(k => k.volume),
                          ...keywordResults.longTail.map(k => k.volume),
                          ...keywordResults.questions.map(k => k.volume),
                          ...keywordResults.related.map(k => k.volume)
                        );
                        const minSize = 0.8;
                        const maxSize = 1.8;
                        const size = ((kw.volume / maxVolume) * (maxSize - minSize)) + minSize;
                        
                        return (
                          <span 
                            key={i} 
                            className="px-2 py-1 bg-white rounded shadow hover:shadow-md transition-shadow cursor-pointer"
                            style={{ 
                              fontSize: `${size}rem`, 
                              opacity: 0.6 + (kw.volume / maxVolume) * 0.4
                            }}
                          >
                            {kw.keyword}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Onglet Idées de contenu */}
            <TabsContent value="content" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Idées de contenu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium mb-3">Suggestions d'articles</h3>
                      <div className="space-y-3">
                        {keywordResults.contentIdeas.map((idea, index) => (
                          <div key={index} className="p-4 bg-white border rounded-md hover:border-blue-300 hover:shadow transition-all">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-blue-800">{idea.title}</h4>
                              <Badge variant="secondary">{idea.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                              Mots-clés associés: {
                                [
                                  keywordResults.mainKeywords[index % keywordResults.mainKeywords.length].keyword,
                                  keywordResults.related[index % keywordResults.related.length].keyword
                                ].join(', ')
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-md font-medium mb-3">Architecture de cocon sémantique</h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md font-medium text-center">
                          {keyword}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                          {keywordResults.mainKeywords.slice(0, 3).map((kw, i) => (
                            <div key={i} className="p-2 bg-blue-50 text-blue-700 rounded-md text-center">
                              {kw.keyword}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          {[
                            ...keywordResults.longTail,
                            ...keywordResults.questions
                          ].slice(0, 8).map((kw, i) => (
                            <div key={i} className="p-2 bg-gray-100 text-gray-700 rounded-md text-center text-sm">
                              {kw.keyword}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-md font-medium mb-3">FAQ optimisée SEO</h3>
                      <div className="space-y-3">
                        {keywordResults.questions.map((question, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-md">
                            <p className="font-medium">{question.keyword} ?</p>
                            <p className="text-sm text-gray-600 mt-2">
                              Répondez à cette question en utilisant les mots-clés suivants : {
                                [
                                  keyword, 
                                  keywordResults.semantic[index % keywordResults.semantic.length]
                                ].join(', ')
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {!keywordResults && !isLoading && (
        <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Générateur de stratégie de mots-clés</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Saisissez votre mot-clé principal ci-dessus pour générer une stratégie de mots-clés complète avec volume de recherche, difficulté, concurrence et suggestions de contenu.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["voyage au Japon", "formation SEO", "acheter meuble design", "apprendre la guitare", "recette gâteau chocolat"].map((suggestion, i) => (
                <Badge 
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-indigo-50"
                  onClick={() => {
                    setKeyword(suggestion);
                    toast.info(`Mot-clé "${suggestion}" sélectionné. Cliquez sur Générer pour lancer l'analyse.`);
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeywordGenerator;

