
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Building2, 
  FileText, 
  Users, 
  BarChart3,
  Lightbulb,
  Download,
  Key,
  MessageSquare,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import ComprehensiveArticleGenerator from './ComprehensiveArticleGenerator';

interface ProfessionalKeywordGeneratorProps {}

const ProfessionalKeywordGenerator: React.FC<ProfessionalKeywordGeneratorProps> = () => {
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState('generator');
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateKeywords = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simuler la génération de mots-clés
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedKeywords: KeywordSuggestion[] = [
        {
          keyword: `${keyword} guide complet`,
          volume: 2400,
          difficulty: 45,
          cpc: 1.2,
          competition: 0.6,
          trend: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
          intent: 'informational',
          type: 'long-tail',
          opportunity: 75,
          searchVolume: 2400,
          relevance: 90,
          suggestedTitle: `Guide Complet ${keyword} 2025`,
          suggestedDescription: `Découvrez tout sur ${keyword} avec notre guide expert. Conseils pratiques et stratégies éprouvées.`
        },
        {
          keyword: `comment utiliser ${keyword}`,
          volume: 1800,
          difficulty: 35,
          cpc: 0.8,
          competition: 0.4,
          trend: [15, 18, 22, 28, 32, 38, 42, 48, 52, 58, 62, 68],
          intent: 'informational',
          type: 'question',
          opportunity: 80,
          searchVolume: 1800,
          relevance: 85,
          suggestedTitle: `Comment Utiliser ${keyword} Efficacement`,
          suggestedDescription: `Apprenez à utiliser ${keyword} étape par étape avec nos conseils d'experts.`
        },
        {
          keyword: `${keyword} prix`,
          volume: 3200,
          difficulty: 55,
          cpc: 2.1,
          competition: 0.8,
          trend: [25, 28, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75],
          intent: 'commercial',
          type: 'standard',
          opportunity: 65,
          searchVolume: 3200,
          relevance: 95,
          suggestedTitle: `Prix ${keyword} 2025 : Comparatif Complet`,
          suggestedDescription: `Découvrez les prix ${keyword} actuels. Comparaisons, promotions et conseils d'achat.`
        },
        {
          keyword: `meilleur ${keyword}`,
          volume: 2800,
          difficulty: 60,
          cpc: 1.8,
          competition: 0.7,
          trend: [30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
          intent: 'commercial',
          type: 'standard',
          opportunity: 70,
          searchVolume: 2800,
          relevance: 88,
          suggestedTitle: `Meilleur ${keyword} 2025 : Top 10`,
          suggestedDescription: `Classement des meilleurs ${keyword}. Tests, avis et recommandations d'experts.`
        },
        {
          keyword: `${keyword} débutant`,
          volume: 1600,
          difficulty: 30,
          cpc: 0.9,
          competition: 0.3,
          trend: [12, 15, 18, 22, 25, 30, 35, 40, 45, 50, 55, 60],
          intent: 'informational',
          type: 'long-tail',
          opportunity: 85,
          searchVolume: 1600,
          relevance: 82,
          suggestedTitle: `${keyword} pour Débutants : Guide Facile`,
          suggestedDescription: `Commencez avec ${keyword} facilement. Guide débutant avec exemples pratiques.`
        }
      ];

      setKeywords(generatedKeywords);
      setHasGenerated(true);
      toast.success(`${generatedKeywords.length} mots-clés générés avec succès !`);
      
    } catch (error) {
      toast.error("Erreur lors de la génération des mots-clés");
    } finally {
      setIsLoading(false);
    }
  };

  const KeywordCard = ({ keywordData }: { keywordData: KeywordSuggestion }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900">{keywordData.keyword}</h3>
        <Badge className={`
          ${keywordData.intent === 'commercial' ? 'bg-green-100 text-green-800' : ''}
          ${keywordData.intent === 'informational' ? 'bg-blue-100 text-blue-800' : ''}
          ${keywordData.intent === 'transactional' ? 'bg-purple-100 text-purple-800' : ''}
        `}>
          {keywordData.intent}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-500">Volume:</span>
          <span className="ml-1 font-medium">{keywordData.volume?.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-500">Difficulté:</span>
          <span className="ml-1 font-medium">{keywordData.difficulty}/100</span>
        </div>
        <div>
          <span className="text-gray-500">CPC:</span>
          <span className="ml-1 font-medium">{keywordData.cpc}€</span>
        </div>
        <div>
          <span className="text-gray-500">Opportunité:</span>
          <span className="ml-1 font-medium text-green-600">{keywordData.opportunity}%</span>
        </div>
      </div>
      
      {keywordData.suggestedTitle && (
        <div className="mt-3 p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-600 mb-1">Titre suggéré:</p>
          <p className="text-sm font-medium">{keywordData.suggestedTitle}</p>
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* En-tête du générateur */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Générateur de Mots-Clés Professionnel
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Générez des mots-clés intelligents, analysez la concurrence, identifiez les opportunités 
            et créez du contenu optimisé SEO avec notre outil professionnel.
          </p>
        </div>
      </Card>

      {/* Formulaire de recherche */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold">Recherche de mots-clés</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
          <Input 
            placeholder="Entrez votre mot-clé principal"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full"
          />
          
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">Anglais</SelectItem>
              <SelectItem value="es">Espagnol</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={generateKeywords}
            disabled={isLoading || !keyword.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Générer
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Générateur d'article complet */}
      {hasGenerated && (
        <ComprehensiveArticleGenerator 
          keywords={keywords}
          mainKeyword={keyword}
        />
      )}

      {/* Résultats des mots-clés */}
      {hasGenerated && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Mots-clés générés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywords.map((kw, idx) => (
              <KeywordCard key={idx} keywordData={kw} />
            ))}
          </div>
        </Card>
      )}

      {/* État vide */}
      {!hasGenerated && !isLoading && (
        <Card className="p-12 text-center">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Commencez votre recherche</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Entrez un mot-clé pour générer des suggestions intelligentes, 
            analyser la concurrence et découvrir de nouvelles opportunités SEO.
          </p>
        </Card>
      )}
    </div>
  );
};

export default ProfessionalKeywordGenerator;
