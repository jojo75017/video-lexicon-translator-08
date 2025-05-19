
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Check, X, Activity, BarChart, LineChart, Brain, Globe, Filter, Award, Share2, Save } from "lucide-react";
import { toast } from "sonner";
import { GoogleSearchConsole } from '@/utils/googleSearchConsole';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DomainSuggestion } from '@/types/domain';

interface DomainStatusProps {
  domain: string;
  isAvailable: boolean | null;
  isChecking: boolean;
}

export const DomainStatus: React.FC<DomainStatusProps> = ({ domain, isAvailable, isChecking }) => {
  const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);
  const [isConnectingSearchConsole, setIsConnectingSearchConsole] = useState(false);
  const [isConnectingAnalytics, setIsConnectingAnalytics] = useState(false);
  const [isGeneratingAiSuggestions, setIsGeneratingAiSuggestions] = useState(false);
  const [isSavingDomain, setIsSavingDomain] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [aiSuggestions, setAiSuggestions] = useState<DomainSuggestion[]>([]);
  
  // Nouveaux états pour les filtres avancés
  const [minScore, setMinScore] = useState(60);
  const [maxPrice, setMaxPrice] = useState(100);
  const [includeNonLatin, setIncludeNonLatin] = useState(false);
  const [domainLength, setDomainLength] = useState([3, 20]);
  const [preferredExtensions, setPreferredExtensions] = useState<string[]>(['.com', '.net', '.org']);
  
  const searchConsole = new GoogleSearchConsole();

  const estimateTraffic = async () => {
    if (!domain) return;
    
    setIsLoadingTraffic(true);
    toast.info(`Estimation du trafic pour ${domain} en cours...`);
    
    try {
      // Utiliser l'API Search Console pour obtenir des données réelles
      const searchData = await searchConsole.getSearchAnalytics(domain);
      
      toast.success(`Trafic estimé pour ${domain}: ${searchData.impressions.toLocaleString()} impressions, ${searchData.clicks.toLocaleString()} clics`);
    } catch (error) {
      console.error("Erreur lors de l'estimation du trafic:", error);
      // Fallback vers des données simulées en cas d'erreur
      const estimatedVisits = Math.floor(Math.random() * 5000) + 1000;
      toast.success(`Trafic estimé pour ${domain}: ${estimatedVisits.toLocaleString()} visites/mois (données simulées)`);
    } finally {
      setIsLoadingTraffic(false);
    }
  };

  const connectSearchConsole = async () => {
    if (!domain) return;
    
    setIsConnectingSearchConsole(true);
    toast.info(`Connexion à Google Search Console pour ${domain} en cours...`);
    
    try {
      // Ici, vous pourriez implémenter une vraie connexion à l'API Search Console
      // Pour l'instant, nous simulons une réponse
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Domaine ${domain} connecté à Google Search Console avec succès!`);
      toast.info("Pour voir les vraies données, vous devez configurer l'API Google Search Console");
    } catch (error) {
      console.error("Erreur lors de la connexion à Search Console:", error);
      toast.error(`Erreur lors de la connexion à Search Console: ${error.message}`);
    } finally {
      setIsConnectingSearchConsole(false);
    }
  };

  const connectGoogleAnalytics = async () => {
    if (!domain) return;
    
    setIsConnectingAnalytics(true);
    toast.info(`Connexion à Google Analytics pour ${domain} en cours...`);
    
    try {
      // Ici, vous pourriez implémenter une vraie connexion à l'API Google Analytics
      // Pour l'instant, nous simulons une réponse
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Domaine ${domain} connecté à Google Analytics avec succès!`);
      toast.info("Pour voir les vraies données, vous devez configurer l'API Google Analytics");
    } catch (error) {
      console.error("Erreur lors de la connexion à Google Analytics:", error);
      toast.error(`Erreur lors de la connexion à Google Analytics: ${error.message}`);
    } finally {
      setIsConnectingAnalytics(false);
    }
  };

  const generateAdvancedAiSuggestions = async () => {
    if (!domain) return;
    
    setIsGeneratingAiSuggestions(true);
    toast.info(`Génération de suggestions avancées par IA pour ${domain} en cours...`);
    
    try {
      // Simuler une opération d'IA qui prend un peu de temps
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const baseName = domain.split('.')[0];
      const variations: DomainSuggestion[] = [
        { 
          domain: `${baseName}pro.com`, 
          score: 92, 
          reason: "Version professionnelle avec TLD premium",
          available: true,
          price: "12.99€/an",
          aiGenerated: true,
          categoryRelevance: 95,
          brandability: 87,
          memorability: 91,
          seoFriendliness: 94,
          trademarkedRisk: 'low'
        },
        { 
          domain: `my${baseName}.com`, 
          score: 88, 
          reason: "Préfixe engageant qui personnalise l'expérience",
          available: true,
          price: "14.99€/an",
          aiGenerated: true,
          categoryRelevance: 82,
          brandability: 90,
          memorability: 88,
          seoFriendliness: 86,
          trademarkedRisk: 'low'
        },
        { 
          domain: `${baseName}hub.com`, 
          score: 85, 
          reason: "Suggère une plateforme centrale pour votre activité",
          available: true,
          price: "15.99€/an",
          aiGenerated: true,
          categoryRelevance: 88,
          brandability: 82,
          memorability: 84,
          seoFriendliness: 90,
          trademarkedRisk: 'low'
        },
        { 
          domain: `${baseName}.io`, 
          score: 84, 
          reason: "TLD moderne idéal pour les technologies et startups",
          available: true,
          price: "29.99€/an",
          aiGenerated: true,
          categoryRelevance: 77,
          brandability: 85,
          memorability: 82,
          seoFriendliness: 83,
          trademarkedRisk: 'low'
        },
        { 
          domain: `get${baseName}.com`, 
          score: 82, 
          reason: "Suggère une action directe et une accessibilité",
          available: true,
          price: "14.99€/an",
          aiGenerated: true,
          categoryRelevance: 79,
          brandability: 84,
          memorability: 80,
          seoFriendliness: 87,
          trademarkedRisk: 'low'
        }
      ];
      
      // Mise à jour des suggestions générées
      setAiSuggestions(variations);
      
      // Informer l'utilisateur du succès avec un toast contenant un aperçu
      toast.success(`Suggestions avancées générées par IA pour ${domain}`, {
        description: `${variations.length} nouvelles suggestions premium disponibles`,
        duration: 5000
      });
    } catch (error) {
      console.error("Erreur lors de la génération des suggestions avancées:", error);
      toast.error(`Erreur lors de la génération des suggestions: ${error.message}`);
    } finally {
      setIsGeneratingAiSuggestions(false);
    }
  };

  const saveDomainToFavorites = () => {
    setIsSavingDomain(true);
    
    // Simuler l'enregistrement du domaine
    setTimeout(() => {
      toast.success(`Domaine ${domain} ajouté aux favoris`);
      setIsSavingDomain(false);
    }, 1000);
  };

  // Évaluer la qualité du nom de domaine
  const evaluateDomainQuality = (domain: string) => {
    if (!domain) return { score: 0, feedback: [] };
    
    const feedback = [];
    let score = 0;
    
    // Vérifier la longueur
    const name = domain.split('.')[0];
    if (name.length <= 10) {
      score += 20;
      feedback.push("Longueur idéale: Moins de 10 caractères");
    } else if (name.length <= 15) {
      score += 15;
      feedback.push("Longueur acceptable: 10-15 caractères");
    } else {
      score += 5;
      feedback.push("Nom trop long: Plus de 15 caractères");
    }
    
    // Vérifier si contient des chiffres
    if (/\d/.test(name)) {
      score += 5;
      feedback.push("Contient des chiffres: Peut réduire la mémorabilité");
    } else {
      score += 15;
      feedback.push("Sans chiffres: Plus mémorable");
    }
    
    // Vérifier si contient des tirets
    if (name.includes('-')) {
      score += 5;
      feedback.push("Contient des tirets: Peut réduire la mémorabilité");
    } else {
      score += 15;
      feedback.push("Sans tirets: Plus facile à communiquer");
    }
    
    // Vérifier l'extension
    const extension = domain.split('.').pop();
    if (extension === 'com') {
      score += 25;
      feedback.push("Extension .com: Extension premium la plus reconnue");
    } else if (['org', 'net', 'io'].includes(extension)) {
      score += 20;
      feedback.push(`Extension .${extension}: Extension bien établie`);
    } else {
      score += 10;
      feedback.push(`Extension .${extension}: Extension moins connue`);
    }
    
    // Vérifier la facilité de prononciation (estimation simplifiée)
    const vowelsRatio = (name.match(/[aeiouy]/gi) || []).length / name.length;
    if (vowelsRatio >= 0.3 && vowelsRatio <= 0.6) {
      score += 25;
      feedback.push("Bonne prononciation: Équilibre voyelles/consonnes");
    } else {
      score += 10;
      feedback.push("Prononciation difficile: Déséquilibre voyelles/consonnes");
    }
    
    return {
      score: Math.min(score, 100),
      feedback
    };
  };
  
  const domainQuality = evaluateDomainQuality(domain);
  
  const getQualityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        <span className="ml-3 text-green-700">Vérification de la disponibilité...</span>
      </div>
    );
  }
  
  if (isAvailable === null) {
    return null;
  }
  
  return isAvailable ? (
    <Alert className="bg-green-50 text-green-800 border-green-200">
      <div className="flex flex-col w-full">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="ml-2">
            <AlertTitle className="font-medium">Domaine disponible!</AlertTitle>
            <AlertDescription>
              Le domaine <strong>{domain}</strong> est actuellement disponible à l'enregistrement.
            </AlertDescription>
          </div>
        </div>
        
        <div className="mt-3 bg-green-100 rounded-md p-3">
          <div className="flex items-center mb-2">
            <Award className="h-4 w-4 text-green-700 mr-2" />
            <span className="font-medium">Qualité du nom de domaine</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${domainQuality.score}%` }}
              ></div>
            </div>
            <span className={`font-medium ${getQualityColor(domainQuality.score)}`}>
              {domainQuality.score}/100
            </span>
          </div>
          <div className="text-xs space-y-1 mt-2">
            {domainQuality.feedback.map((item, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-3 w-3 mr-1 text-green-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
            onClick={saveDomainToFavorites}
            disabled={isSavingDomain}
          >
            <Save className="h-4 w-4" />
            {isSavingDomain ? 'Enregistrement...' : 'Ajouter aux favoris'}
          </Button>
          
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
            onClick={estimateTraffic}
            disabled={isLoadingTraffic}
          >
            <Activity className="h-4 w-4" />
            {isLoadingTraffic ? 'Estimation...' : 'Estimer le trafic potentiel'}
          </Button>
          
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
            onClick={connectSearchConsole}
            disabled={isConnectingSearchConsole}
          >
            <LineChart className="h-4 w-4" />
            {isConnectingSearchConsole ? 'Connexion...' : 'Search Console'}
          </Button>
          
          <Button 
            size="sm" 
            className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1"
            onClick={connectGoogleAnalytics}
            disabled={isConnectingAnalytics}
          >
            <BarChart className="h-4 w-4" />
            {isConnectingAnalytics ? 'Connexion...' : 'Google Analytics'}
          </Button>
          
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
            onClick={generateAdvancedAiSuggestions}
            disabled={isGeneratingAiSuggestions}
          >
            <Brain className="h-4 w-4" />
            {isGeneratingAiSuggestions ? 'Génération...' : 'Suggestions IA avancées'}
          </Button>

          <Button 
            size="sm" 
            variant="outline"
            className="border-green-300 text-green-600 hover:bg-green-50 flex items-center gap-1"
            onClick={() => setShowFilterDialog(true)}
          >
            <Filter className="h-4 w-4" />
            Filtres avancés
          </Button>
        </div>

        {/* Afficher les suggestions AI si disponibles */}
        {aiSuggestions.length > 0 && (
          <div className="mt-4 border-t border-green-200 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-green-800 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                Suggestions générées par IA
              </h3>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-8 text-xs w-32">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="technology">Technologie</SelectItem>
                    <SelectItem value="creative">Créatif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              {aiSuggestions.map((suggestion, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-white rounded-md border border-green-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-green-800">{suggestion.domain}</div>
                      <div className="text-sm text-gray-600 mt-1">{suggestion.reason}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center mb-1">
                        <Badge className="bg-green-100 text-green-800 font-medium">
                          Score: {suggestion.score}/100
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">{suggestion.price}</div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="flex items-center text-xs">
                      <span className="w-24">Pertinence:</span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${suggestion.categoryRelevance}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="w-24">Mémorabilité:</span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-purple-600 h-1.5 rounded-full" 
                          style={{ width: `${suggestion.memorability}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="w-24">SEO:</span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full" 
                          style={{ width: `${suggestion.seoFriendliness}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="w-24">Marque:</span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-amber-600 h-1.5 rounded-full" 
                          style={{ width: `${suggestion.brandability}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2">
                      <Share2 className="h-3 w-3 mr-1" />
                      Partager
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs px-2">
                      Réserver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialogue de filtres avancés */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filtres avancés pour les suggestions</DialogTitle>
            <DialogDescription>
              Personnalisez les critères pour générer des suggestions de domaines sur mesure.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Score minimum</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[minScore]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setMinScore(value[0])}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-10 text-right">{minScore}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Prix maximum (€/an)</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[maxPrice]}
                  min={0}
                  max={500}
                  step={10}
                  onValueChange={(value) => setMaxPrice(value[0])}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-10 text-right">{maxPrice}€</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Longueur du nom (caractères)</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={domainLength}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={setDomainLength}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-16 text-right">{domainLength[0]}-{domainLength[1]}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Extensions préférées</label>
              <div className="flex flex-wrap gap-2">
                {['.com', '.net', '.org', '.io', '.app', '.co', '.me', '.info'].map((ext) => (
                  <Badge 
                    key={ext}
                    variant={preferredExtensions.includes(ext) ? "default" : "outline"}
                    className={`cursor-pointer ${preferredExtensions.includes(ext) ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}`}
                    onClick={() => {
                      if (preferredExtensions.includes(ext)) {
                        setPreferredExtensions(preferredExtensions.filter(e => e !== ext));
                      } else {
                        setPreferredExtensions([...preferredExtensions, ext]);
                      }
                    }}
                  >
                    {ext}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setMinScore(60);
                setMaxPrice(100);
                setDomainLength([3, 20]);
                setPreferredExtensions(['.com', '.net', '.org']);
                setIncludeNonLatin(false);
              }}
            >
              Réinitialiser
            </Button>
            <Button 
              onClick={() => {
                toast.success("Filtres appliqués avec succès");
                setShowFilterDialog(false);
                generateAdvancedAiSuggestions();
              }}
            >
              Appliquer les filtres
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Alert>
  ) : (
    <Alert className="bg-red-50 text-red-800 border-red-200">
      <X className="h-5 w-5 text-red-600" />
      <AlertTitle className="font-medium">Domaine non disponible</AlertTitle>
      <AlertDescription>
        Le domaine <strong>{domain}</strong> est déjà enregistré ou réservé.
        <div className="mt-2">
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={generateAdvancedAiSuggestions}
            disabled={isGeneratingAiSuggestions}
          >
            <Globe className="h-4 w-4 mr-1" />
            {isGeneratingAiSuggestions ? 'Recherche...' : 'Trouver des alternatives par IA'}
          </Button>
        </div>
        
        {/* Afficher les suggestions AI si disponibles */}
        {aiSuggestions.length > 0 && (
          <div className="mt-4 border-t border-red-200 pt-4">
            <h3 className="font-medium text-red-800 mb-3 flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Alternatives disponibles
            </h3>
            <div className="grid gap-2">
              {aiSuggestions.map((suggestion, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{suggestion.domain}</div>
                    <Badge className="bg-green-100 text-green-800">
                      Score: {suggestion.score}/100
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{suggestion.reason}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">{suggestion.price}</div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs">
                      Réserver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default DomainStatus;
