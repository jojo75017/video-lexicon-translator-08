
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, MapPin, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import { LocalizationConfig, LocalizedKeyword } from "@/types/seo";

interface MultiLanguageSupportProps {
  keywords: KeywordSuggestion[];
}

const MultiLanguageSupport: React.FC<MultiLanguageSupportProps> = ({ keywords }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [selectedCountry, setSelectedCountry] = useState('FR');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localizedResults, setLocalizedResults] = useState<LocalizedKeyword[]>([]);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const countries = [
    { code: 'FR', name: 'France', currency: 'EUR' },
    { code: 'US', name: 'États-Unis', currency: 'USD' },
    { code: 'UK', name: 'Royaume-Uni', currency: 'GBP' },
    { code: 'DE', name: 'Allemagne', currency: 'EUR' },
    { code: 'ES', name: 'Espagne', currency: 'EUR' },
    { code: 'IT', name: 'Italie', currency: 'EUR' },
    { code: 'CA', name: 'Canada', currency: 'CAD' },
    { code: 'AU', name: 'Australie', currency: 'AUD' },
    { code: 'BR', name: 'Brésil', currency: 'BRL' },
    { code: 'JP', name: 'Japon', currency: 'JPY' }
  ];

  const analyzeLocalizedKeywords = async () => {
    if (keywords.length === 0) {
      toast.error("Aucun mot-clé à analyser");
      return;
    }

    setIsAnalyzing(true);

    // Simulation d'analyse multilingue
    setTimeout(() => {
      const localized: LocalizedKeyword[] = keywords.slice(0, 5).map((keyword) => {
        const baseVolume = keyword.volume || 1000;
        const regionMultiplier = selectedCountry === 'US' ? 3.2 : selectedCountry === 'DE' ? 1.8 : 1;
        const languageMultiplier = selectedLanguage === 'en' ? 2.5 : selectedLanguage === 'es' ? 1.3 : 1;
        
        return {
          keyword: translateKeyword(keyword.keyword, selectedLanguage),
          language: selectedLanguage,
          country: selectedCountry,
          volume: Math.round(baseVolume * regionMultiplier * languageMultiplier),
          difficulty: keyword.difficulty || Math.floor(Math.random() * 50) + 20,
          cpc: convertCurrency(keyword.cpc || 1.5, selectedCurrency),
          localCompetition: Math.random() * 0.8,
          culturalRelevance: Math.floor(Math.random() * 30) + 70
        };
      });

      setLocalizedResults(localized);
      setIsAnalyzing(false);
      toast.success(`Analyse terminée pour ${selectedLanguage.toUpperCase()}/${selectedCountry}`);
    }, 3000);
  };

  const translateKeyword = (keyword: string, targetLang: string): string => {
    // Simulation de traduction
    const translations: Record<string, Record<string, string>> = {
      'marketing': { es: 'marketing', de: 'Marketing', it: 'marketing', fr: 'marketing' },
      'seo': { es: 'seo', de: 'SEO', it: 'seo', fr: 'référencement' },
      'business': { es: 'negocio', de: 'Geschäft', it: 'business', fr: 'entreprise' }
    };
    
    return translations[keyword.toLowerCase()]?.[targetLang] || keyword;
  };

  const convertCurrency = (amount: number, currency: string): number => {
    const rates: Record<string, number> = {
      'EUR': 1, 'USD': 1.1, 'GBP': 0.85, 'CAD': 1.35, 'AUD': 1.45, 'BRL': 5.2, 'JPY': 110
    };
    return Math.round((amount * (rates[currency] || 1)) * 100) / 100;
  };

  const getCultureIcon = (relevance: number) => {
    if (relevance >= 85) return '🎯';
    if (relevance >= 70) return '👍';
    return '⚠️';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-500" />
          Support multi-langues & géolocalisation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Langue</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Pays</label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Devise</label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['EUR', 'USD', 'GBP', 'CAD', 'AUD', 'BRL', 'JPY'].map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={analyzeLocalizedKeywords}
          disabled={isAnalyzing || keywords.length === 0}
          className="w-full gap-2"
        >
          {isAnalyzing ? (
            <>Analyse en cours...</>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              Analyser pour {selectedLanguage.toUpperCase()}/{selectedCountry}
            </>
          )}
        </Button>

        {localizedResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Résultats localisés</h4>
              <Badge variant="outline">
                {selectedLanguage.toUpperCase()} • {selectedCountry} • {selectedCurrency}
              </Badge>
            </div>

            <div className="space-y-3">
              {localizedResults.map((result, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{result.keyword}</span>
                    <div className="flex items-center gap-1">
                      <span>{getCultureIcon(result.culturalRelevance)}</span>
                      <Badge variant="secondary">{result.culturalRelevance}% pertinent</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Volume:</span>
                      <div className="font-medium">{result.volume.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulté:</span>
                      <div className="font-medium">{result.difficulty}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">CPC:</span>
                      <div className="font-medium">{result.cpc} {selectedCurrency}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Compétition:</span>
                      <div className="font-medium">{(result.localCompetition * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiLanguageSupport;
