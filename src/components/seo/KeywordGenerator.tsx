import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Download, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  ArrowRight, 
  Info,
  FileText,
  MessageSquare,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo';
import KeywordResults from './keyword/KeywordResults';
import KeywordCard from './keyword/KeywordCard';
import { 
  generateStandardKeywords, 
  generateLongTailKeywords, 
  rankKeywordsByDifficulty, 
  rankKeywordsByVolume,
  generateTrendData,
  sortKeywordsByScore
} from '@/utils/keyword/keywordGeneratorUtils';
import { determineKeywordIntent, enrichKeywords, generateQuestionKeywords } from '@/utils/keyword/keywordAnalyzer';

const KeywordGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [searchVolume, setSearchVolume] = useState('all');
  const [competition, setCompetition] = useState('all');
  const [activeTab, setActiveTab] = useState('standard');
  const [hasSearched, setHasSearched] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  
  // États pour les résultats
  const [standardKeywords, setStandardKeywords] = useState<KeywordSuggestion[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordSuggestion[]>([]);
  const [questionKeywords, setQuestionKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  
  // États pour les données complémentaires
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [serpResults, setSerpResults] = useState<any[]>([]);
  
  // Fonction pour générer les mots-clés
  const handleGenerate = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    
    // Simuler un appel API avec un délai
    setTimeout(() => {
      try {
        // Générer les mots-clés standards
        const standards = generateStandardKeywords(keyword);
        
        // Générer les mots-clés longue traîne
        const longTails = generateLongTailKeywords(keyword);
        
        // Générer les questions fréquentes
        const questions = generateQuestionKeywords(keyword).map(q => ({
          keyword: q,
          volume: Math.floor(Math.random() * 500) + 10,
          difficulty: Math.floor(Math.random() * 40) + 5,
          cpc: parseFloat((Math.random() * 0.8).toFixed(2)),
          competition: parseFloat((Math.random() * 0.5).toFixed(2)),
          relevance: Math.floor(Math.random() * 30) + 65,
          type: 'question' as 'question',
          intent: 'informational' as 'informational',
          opportunity: Math.floor(Math.random() * 30) + 60,
          trend: generateTrendData(q)
        }));
        
        // Enrichir les mots-clés avec des données supplémentaires
        const enrichedStandards = enrichKeywords(standards);
        const enrichedLongTails = enrichKeywords(longTails);
        
        // Genérer des données de concurrents fictives
        const mockCompetitors = [
          { 
            name: "competitor1.com", 
            url: "https://www.competitor1.com", 
            strength: 85, 
            organic_traffic: 45000, 
            keywords: 1200 
          },
          { 
            name: "competitor2.com", 
            url: "https://www.competitor2.com", 
            strength: 72, 
            organic_traffic: 28000, 
            keywords: 850 
          },
          { 
            name: "competitor3.com", 
            url: "https://www.competitor3.com", 
            strength: 63, 
            organic_traffic: 17500, 
            keywords: 520 
          }
        ];
        
        // Mettre à jour les états
        setStandardKeywords(enrichedStandards);
        setLongTailKeywords(enrichedLongTails);
        setQuestionKeywords(questions);
        setCompetitors(mockCompetitors);
        setSerpResults([]);
        setHasGenerated(true);
        
        toast.success(`${enrichedStandards.length + enrichedLongTails.length + questions.length} mots-clés générés`);
      } catch (error) {
        console.error("Erreur lors de la génération des mots-clés:", error);
        toast.error("Erreur lors de la génération des mots-clés");
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };
  
  // Fonction pour trier les mots-clés
  const sortKeywords = (type: string) => {
    switch(type) {
      case 'volume':
        setStandardKeywords([...rankKeywordsByVolume(standardKeywords)]);
        setLongTailKeywords([...rankKeywordsByVolume(longTailKeywords)]);
        toast.info("Mots-clés triés par volume de recherche");
        break;
      case 'difficulty':
        setStandardKeywords([...rankKeywordsByDifficulty(standardKeywords)]);
        setLongTailKeywords([...rankKeywordsByDifficulty(longTailKeywords)]);
        toast.info("Mots-clés triés par difficulté");
        break;
      case 'opportunity':
        setStandardKeywords([...sortKeywordsByScore(standardKeywords)]);
        setLongTailKeywords([...sortKeywordsByScore(longTailKeywords)]);
        toast.info("Mots-clés triés par opportunité");
        break;
      default:
        break;
    }
  };
  
  // Fonction pour sélectionner/désélectionner un mot-clé
  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords(prev => {
      if (prev.includes(keyword)) {
        return prev.filter(k => k !== keyword);
      } else {
        return [...prev, keyword];
      }
    });
  };
  
  // Fonction pour effacer tous les mots-clés sélectionnés
  const clearSelectedKeywords = () => {
    setSelectedKeywords([]);
    toast.info("Tous les mots-clés ont été désélectionnés");
  };
  
  // Fonction pour exporter les mots-clés sélectionnés
  const exportSelectedKeywords = () => {
    if (selectedKeywords.length === 0) {
      toast.error("Aucun mot-clé sélectionné");
      return;
    }
    
    const allKeywords = [...standardKeywords, ...longTailKeywords, ...questionKeywords];
    const selected = allKeywords.filter(kw => selectedKeywords.includes(kw.keyword));
    
    // Créer un fichier CSV
    let csv = "Mot-clé,Volume,Difficulté,CPC,Opportunité,Type,Intention\n";
    selected.forEach(kw => {
      csv += `"${kw.keyword}",${kw.volume || 'N/A'},${kw.difficulty || 'N/A'},${kw.cpc || 'N/A'},${kw.opportunity || 'N/A'},${kw.type || 'standard'},${kw.intent || 'N/A'}\n`;
    });
    
    // Créer un blob et générer un lien de téléchargement
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mots-cles-${keyword.replace(/\s+/g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${selectedKeywords.length} mots-clés exportés`);
  };
  
  // Nombre total de mots-clés générés
  const totalKeywords = standardKeywords.length + longTailKeywords.length + questionKeywords.length;
  
  // Vérifier si des données de concurrents sont disponibles
  const hasCompetitorData = competitors.length > 0;

  return (
    <div className="space-y-6">
      <Card className="p-6 border-t-4 border-t-blue-500">
        <div className="flex items-center gap-2 mb-6">
          <Search className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold">Recherche de mots-clés</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <div>
            <Input 
              placeholder="Entrez votre mot-clé principal"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">Anglais</SelectItem>
              <SelectItem value="es">Espagnol</SelectItem>
              <SelectItem value="de">Allemand</SelectItem>
              <SelectItem value="it">Italien</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={searchVolume} onValueChange={setSearchVolume}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Volume de recherche" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous volumes</SelectItem>
              <SelectItem value="high">Volume élevé</SelectItem>
              <SelectItem value="medium">Volume moyen</SelectItem>
              <SelectItem value="low">Volume faible</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={competition} onValueChange={setCompetition}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Concurrence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toute concurrence</SelectItem>
              <SelectItem value="high">Concurrence élevée</SelectItem>
              <SelectItem value="medium">Concurrence moyenne</SelectItem>
              <SelectItem value="low">Concurrence faible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleGenerate}
            disabled={isLoading || !keyword.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>Génération en cours...</>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Générer des mots-clés
              </>
            )}
          </Button>
          
          {hasGenerated && (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => sortKeywords('volume')}
                className="flex items-center gap-1"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Volume</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => sortKeywords('difficulty')}
                className="flex items-center gap-1"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Difficulté</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => sortKeywords('opportunity')}
                className="flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Opportunité</span>
              </Button>
            </div>
          )}
        </div>
      </Card>
      
      {/* État vide */}
      {!hasSearched && (
        <Card className="p-6 text-center py-12">
          <Search className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Commencez votre recherche de mots-clés</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Entrez un mot-clé ci-dessus pour découvrir des opportunités de contenu, 
            analyser la concurrence et optimiser votre stratégie SEO.
          </p>
        </Card>
      )}
      
      {/* État de chargement */}
      {isLoading && (
        <Card className="p-6 text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium mb-2">Recherche de mots-clés en cours...</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Nous analysons les données pour vous fournir les meilleures suggestions de mots-clés.
          </p>
        </Card>
      )}
      
      {/* Résultats */}
      {hasGenerated && !isLoading && (
        <>
          <KeywordResults 
            standardKeywords={standardKeywords}
            longTailKeywords={longTailKeywords}
            selectedKeywords={selectedKeywords}
            competitors={competitors}
            serpResults={serpResults}
            hasCompetitorData={hasCompetitorData}
            totalKeywords={totalKeywords}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            toggleKeywordSelection={toggleKeywordSelection}
            clearSelectedKeywords={clearSelectedKeywords}
            exportSelectedKeywords={exportSelectedKeywords}
          />
          
          {questionKeywords.length > 0 && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Questions fréquentes (FAQ)</h2>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {questionKeywords.length} questions
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {questionKeywords.map((question, idx) => (
                  <KeywordCard 
                    key={idx}
                    keywordData={question}
                    isSelected={selectedKeywords.includes(question.keyword)}
                    onToggleSelection={toggleKeywordSelection}
                  />
                ))}
              </div>
            </Card>
          )}
          
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Champ sémantique et synonymes</h2>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {[...standardKeywords, ...longTailKeywords]
                .slice(0, 15)
                .map((kw, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    {kw.keyword}
                  </Badge>
                ))
              }
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold">Suggestions de contenu</h2>
            </div>
            
            <ul className="space-y-2 mb-6">
              {[...questionKeywords].slice(0, 3).map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <span>{q.keyword}</span>
                </li>
              ))}
              
              {[
                `Guide complet sur ${keyword}`,
                `Les 10 erreurs à éviter avec ${keyword}`,
                `Comment optimiser votre ${keyword} en 2024`
              ].map((title, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <span>{title}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex justify-end">
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Générer plus d'idées avec l'IA
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default KeywordGenerator;
