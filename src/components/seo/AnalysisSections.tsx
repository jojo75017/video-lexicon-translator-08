
import React, { useState, useEffect } from 'react';
import { KeywordSuggestion } from '@/types/seo';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OpenAIService } from '@/utils/seo/openaiService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmojiTab from '@/components/seo/analysis/EmojiTab';
import HashtagsTab from '@/components/seo/analysis/HashtagsTab';
import { Card } from "@/components/ui/card";
import { generateBothDescriptions } from '@/utils/seo/generators/descriptionGenerator';
import SeoAnalysisForm from './analysis/SeoAnalysisForm';
import ResultsDisplay from './analysis/ResultsDisplay';
import ComparisonSection from './analysis/ComparisonSection';
import ContentGenerator from './analysis/ContentGenerator';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface AnalysisSectionsProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  seoAnalysis: any | null;
  setSeoAnalysis: (analysis: any) => void;
  comparisonSite: string;
  setComparisonSite: (site: string) => void;
  generatedKeywords: KeywordSuggestion[];
  setGeneratedKeywords: (keywords: KeywordSuggestion[]) => void;
  generatedContent: {
    title: string;
    intro: string;
    sections: Array<{ heading: string; content: string; }>;
  } | null;
  setGeneratedContent: (content: any) => void;
  contentKeyword: string;
  mockContentIdeas: any[];
  analyzeSite: () => void;
  error: string | null;
  handleActivateProxy: () => void;
  handleContentKeywordChange: (keyword: string) => void;
  handleGeneratedKeywords: (keywords: KeywordSuggestion[]) => void;
  handleContentGenerated: (content: any) => void;
}

const AnalysisSections: React.FC<AnalysisSectionsProps> = ({
  url,
  setUrl,
  isLoading,
  showCorsWarning,
  seoAnalysis,
  comparisonSite,
  setComparisonSite,
  generatedKeywords,
  generatedContent,
  contentKeyword,
  mockContentIdeas,
  analyzeSite,
  error,
  handleActivateProxy,
  handleContentKeywordChange,
  handleGeneratedKeywords
}) => {
  // State variables for KeywordSuggestions
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [openaiKey, setOpenaiKey] = React.useState(() => localStorage.getItem('openaiKey') || '');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const [validationMessage, setValidationMessage] = useState<string>('');
  
  // Vérifier la clé API au chargement du composant
  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = localStorage.getItem('openaiKey');
      if (!apiKey) {
        setApiKeyStatus('invalid');
        setValidationMessage("Aucune clé API configurée");
        return;
      }

      try {
        setOpenaiKey(apiKey);
        const openAIService = new OpenAIService(apiKey);
        // Essayer de valider la clé API
        OpenAIService.enableProxy();
        const isValid = await openAIService.validateApiKey();
        setApiKeyStatus(isValid ? 'valid' : 'invalid');
        
        if (isValid) {
          setValidationMessage("Clé API validée avec succès");
          // Générer automatiquement des suggestions
          if (generatedKeywords.length === 0) {
            generateKeywordSuggestions(openAIService);
          }
        } else {
          setValidationMessage("La clé API n'a pas pu être validée");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la clé API:", error);
        setApiKeyStatus('invalid');
        setValidationMessage("Impossible de vérifier la clé API (problème réseau)");
      }
    };
    
    checkApiKey();
  }, []);
  
  // Handle saving the API key
  const handleSaveApiKey = async () => {
    if (openaiKey) {
      localStorage.setItem('openaiKey', openaiKey);
      toast.info("Validation de la clé API en cours...");
      setValidationMessage("Validation en cours...");
      
      // Valider la clé API
      const openAIService = new OpenAIService(openaiKey);
      OpenAIService.enableProxy();
      try {
        const isValid = await openAIService.validateApiKey();
        setApiKeyStatus(isValid ? 'valid' : 'invalid');
        
        if (isValid) {
          setValidationMessage("Clé API validée avec succès");
          toast.success("Clé API OpenAI validée avec succès");
          
          // Générer automatiquement des suggestions
          generateKeywordSuggestions(openAIService);
        } else {
          setValidationMessage("La clé API n'a pas pu être validée");
          toast.error("La clé API n'a pas pu être validée");
        }
      } catch (error) {
        console.error("Erreur lors de la validation:", error);
        setApiKeyStatus('invalid');
        setValidationMessage("Impossible de vérifier la clé API (problème réseau)");
        toast.warning("Clé sauvegardée mais impossible de la valider (problème réseau)");
      }
    } else {
      toast.error("Veuillez entrer une clé API");
    }
  };
  
  const generateKeywordSuggestions = async (openAIService: OpenAIService) => {
    toast.info("Génération automatique de suggestions...");
    
    try {
      // Utiliser un mot-clé par défaut pour la première génération
      const defaultKeyword = "référencement";
      const newKeywords = await openAIService.getKeywordSuggestions(defaultKeyword);
      
      if (handleGeneratedKeywords) {
        handleGeneratedKeywords(newKeywords);
        toast.success("Suggestions générées avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast.error("Impossible de générer des suggestions");
    }
  };
  
  const handleInsertTitle = (value: string) => {
    setTitle(value);
    toast.success("Titre inséré");
  };
  
  const handleInsertDescription = (value: string) => {
    setDescription(value);
    toast.success("Description insérée");
  };
  
  const handleGenerateMore = () => {
    if (!openaiKey) {
      toast.error("Veuillez d'abord configurer votre clé API OpenAI");
      return;
    }
    
    toast.info("Génération de nouvelles suggestions...");
    // Appel à l'API pour générer de nouvelles suggestions
    const openAIService = new OpenAIService(openaiKey);
    OpenAIService.enableProxy();
    
    // Exemple avec un mot-clé par défaut si aucun n'est défini
    const keyword = generatedKeywords.length > 0 
      ? generatedKeywords[0].keyword 
      : "référencement";
      
    openAIService.getKeywordSuggestions(keyword)
      .then(newKeywords => {
        if (handleGeneratedKeywords) {
          handleGeneratedKeywords(newKeywords);
          toast.success("Nouvelles suggestions générées");
        }
      })
      .catch(error => {
        console.error("Erreur lors de la génération:", error);
        toast.error("Impossible de générer des suggestions");
      });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
      <p className="text-gray-600 mb-4">
        Cette section contient les analyses SEO pour votre site. 
        Veuillez utiliser le formulaire d'analyse pour commencer.
      </p>
      
      <div className="space-y-6">
        {/* Section de configuration de la clé API */}
        <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
          <h3 className="font-medium mb-2">Configuration de l'API OpenAI</h3>
          <div className="flex gap-2 mb-2">
            <Input
              type="password"
              placeholder="Entrez votre clé API OpenAI (sk-...)"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className={`flex-1 ${apiKeyStatus === 'valid' ? 'border-green-500' : apiKeyStatus === 'invalid' ? 'border-red-500' : ''}`}
            />
            <Button onClick={handleSaveApiKey}>
              Sauvegarder
            </Button>
          </div>
          <div className="flex items-center mt-2">
            {apiKeyStatus === 'valid' && (
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>{validationMessage}</span>
              </div>
            )}
            {apiKeyStatus === 'invalid' && (
              <div className="flex items-center text-xs text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{validationMessage}</span>
              </div>
            )}
            {apiKeyStatus === 'unchecked' && (
              <span className="text-xs text-gray-500">Aucune clé API vérifiée</span>
            )}
          </div>
        </div>
        
        <SeoAnalysisForm 
          url={url}
          setUrl={setUrl}
          isLoading={isLoading}
          showCorsWarning={showCorsWarning}
          analyzeSite={analyzeSite}
          error={error}
          handleActivateProxy={handleActivateProxy}
        />
        
        {seoAnalysis && <ResultsDisplay seoAnalysis={seoAnalysis} />}
        
        <ComparisonSection 
          comparisonSite={comparisonSite}
          setComparisonSite={setComparisonSite}
          isLoading={isLoading}
        />
        
        <KeywordSuggestions 
          generatedKeywords={generatedKeywords}
          onGenerateClick={handleGenerateMore}
          fieldValue={title}
          onInsert={handleInsertTitle}
          maxLength={60}
          descriptionValue={description}
          onInsertDescription={handleInsertDescription}
          maxLengthDescription={155}
        />
        
        <ContentGenerator 
          contentKeyword={contentKeyword}
          handleContentKeywordChange={handleContentKeywordChange}
          generatedContent={generatedContent}
          mockContentIdeas={mockContentIdeas}
        />
      </div>
    </Card>
  );
};

export default AnalysisSections;
