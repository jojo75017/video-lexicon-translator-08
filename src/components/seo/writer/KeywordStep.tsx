
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeywordSuggestion } from "@/types/seo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessagesSquare, Shield, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KeywordMetrics from './keyword/KeywordMetrics';
import KeywordTrends from './keyword/KeywordTrends';
import SeoSuggestions from './keyword/SeoSuggestions';
import TitleEnhancementTabs from './keyword/TitleEnhancementTabs';
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { OpenAIService } from "@/utils/seo/openaiService";
import { generateHashtagsForKeyword } from '@/utils/seo/generators/hashtagGenerator';

interface KeywordStepProps {
  selectedKeyword: string;
  keywords: KeywordSuggestion[];
  onKeywordChange: (value: string) => void;
  onQuoraClick?: () => void;
}

const KeywordStep: React.FC<KeywordStepProps> = ({
  selectedKeyword,
  keywords,
  onKeywordChange,
  onQuoraClick,
}) => {
  const [activeTab, setActiveTab] = useState("trends");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const selectedKeywordData = keywords.find(kw => kw.keyword === selectedKeyword);
  const [title, setTitle] = useState(selectedKeywordData?.suggestedTitle || '');
  const [description, setDescription] = useState(selectedKeywordData?.suggestedDescription || '');
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  
  // Vérifier l'état de la clé API au chargement
  useEffect(() => {
    const storedKey = localStorage.getItem('openaiKey');
    if (storedKey) {
      setApiKey(storedKey);
      validateApiKey(storedKey);
    }
  }, []);

  // Mettre à jour le titre et la description lorsqu'un nouveau mot-clé est sélectionné
  useEffect(() => {
    if (selectedKeywordData) {
      setTitle(selectedKeywordData.suggestedTitle || '');
      setDescription(selectedKeywordData.suggestedDescription || '');
      
      // Générer des hashtags pertinents pour le mot-clé sélectionné
      const hashtags = generateHashtagsForKeyword(selectedKeyword);
      setSuggestedHashtags(hashtags);
      console.log("Hashtags générés pour", selectedKeyword, ":", hashtags);
    }
  }, [selectedKeywordData, selectedKeyword]);

  const validateApiKey = async (key: string) => {
    try {
      const isValid = await OpenAIService.validateApiKey(key);
      setApiKeyStatus(isValid ? 'valid' : 'invalid');
      if (isValid) {
        toast.success("Clé API validée avec succès");
      } else {
        toast.error("Clé API invalide");
      }
    } catch (error) {
      setApiKeyStatus('invalid');
      toast.error("Erreur lors de la validation de la clé API");
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('openaiKey', apiKey);
    validateApiKey(apiKey);
  };

  const getTitleColor = () => {
    const length = title.length;
    if (length === 0) return "border-gray-300";
    if (length > 55) return "border-yellow-500";
    if (length > 45) return "border-green-500";
    return "border-gray-300";
  };

  const getDescriptionColor = () => {
    const length = description.length;
    if (length === 0) return "border-gray-300";
    if (length > 145) return "border-yellow-500";
    if (length > 120) return "border-green-500";
    return "border-gray-300";
  };

  const addHashtagToDescription = (hashtag: string) => {
    // Ajoute un espace si besoin
    let newDescription = description;
    if (newDescription && !newDescription.endsWith(" ")) {
      newDescription += " ";
    }
    
    newDescription += hashtag;
    
    if (newDescription.length <= 155) {
      setDescription(newDescription);
      toast.success(`Hashtag ${hashtag} ajouté à la description`);
    } else {
      toast.warning("Description trop longue pour ajouter ce hashtag");
    }
  };

  return (
    <div className="space-y-6">
      {/* Section clé API */}
      <Card className="p-4 border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-blue-800">Configuration OpenAI</h3>
          {apiKeyStatus === 'valid' && (
            <div className="flex items-center text-green-600 gap-1 text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>Clé API validée</span>
            </div>
          )}
          {apiKeyStatus === 'invalid' && (
            <div className="flex items-center text-red-600 gap-1 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Clé API invalide</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Entrez votre clé API OpenAI (sk-...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className={`flex-1 ${apiKeyStatus === 'valid' ? 'border-green-500' : apiKeyStatus === 'invalid' ? 'border-red-500' : ''}`}
          />
          <Button onClick={handleSaveApiKey} variant="outline" className="whitespace-nowrap">
            Sauvegarder
          </Button>
        </div>
      </Card>
      
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Recherche de mots-clés rentables</Label>
        {onQuoraClick && (
          <Button
            onClick={onQuoraClick}
            className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white border-none gap-2 shadow-md transition-all duration-200 hover:scale-105"
          >
            <MessagesSquare className="h-4 w-4" />
            Réponses Quora
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <Label>Sélectionnez un mot-clé</Label>
          <Select value={selectedKeyword} onValueChange={onKeywordChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Choisissez un mot-clé" />
            </SelectTrigger>
            <SelectContent>
              {keywords.map((kw, index) => (
                <SelectItem key={index} value={kw.keyword}>
                  {kw.keyword} (Volume: {kw.searchVolume || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedKeywordData && <KeywordMetrics keywordData={selectedKeywordData} />}

          {/* Prévisualisation du titre et de la meta description */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Titre SEO</Label>
                <span className={`text-xs ${
                  title.length > 55 ? 'text-yellow-600' : 
                  title.length > 45 ? 'text-green-600' : 
                  'text-gray-500'
                }`}>
                  {title.length}/60 caractères
                </span>
              </div>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={60}
                className={getTitleColor()}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Meta Description</Label>
                <span className={`text-xs ${
                  description.length > 145 ? 'text-yellow-600' : 
                  description.length > 120 ? 'text-green-600' : 
                  'text-gray-500'
                }`}>
                  {description.length}/155 caractères
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={155}
                rows={3}
                className={`w-full p-2 border rounded-md ${getDescriptionColor()}`}
              />
            </div>
          </div>
          
          {/* Onglets pour ajouter emojis et hashtags */}
          <TitleEnhancementTabs 
            title={title}
            description={description}
            selectedKeyword={selectedKeyword}
            onUpdateTitle={setTitle}
            onUpdateDescription={setDescription}
          />
          
          {/* Section hashtags générés spécifiquement pour le mot-clé */}
          {selectedKeyword && suggestedHashtags.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Hashtags suggérés pour "{selectedKeyword}"</h4>
              <div className="flex flex-wrap gap-1">
                {suggestedHashtags.map((hashtag) => (
                  <Button
                    key={hashtag}
                    size="sm"
                    variant="outline"
                    onClick={() => addHashtagToDescription(hashtag)}
                    className="px-2 py-1 text-xs"
                  >
                    {hashtag}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="trends" className="flex-1">Évolution du volume</TabsTrigger>
              <TabsTrigger value="suggestions" className="flex-1">Suggestions SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends">
              <KeywordTrends />
            </TabsContent>
            
            <TabsContent value="suggestions">
              {selectedKeywordData?.suggestedTitle && selectedKeywordData?.suggestedDescription && (
                <SeoSuggestions 
                  keywordData={selectedKeywordData} 
                  onInsertTitle={(title) => {
                    setTitle(title);
                    toast.success("Titre inséré");
                  }}
                  onInsertDescription={(desc) => {
                    setDescription(desc);
                    toast.success("Description insérée");
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Section de débogage - Affichons toutes les suggestions */}
      {keywords.length > 0 && (
        <Card className="p-4 mt-4 bg-gray-50">
          <h3 className="font-medium mb-3">Toutes les suggestions disponibles</h3>
          <div className="grid gap-3 max-h-60 overflow-y-auto">
            {keywords.map((kw, index) => (
              <div key={index} className="p-3 bg-white rounded border border-gray-200">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">{kw.keyword}</span>
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">{kw.relevance}%</span>
                </div>
                <div className="text-sm space-y-1 mt-2">
                  <div>
                    <span className="font-medium text-blue-600">Title: </span>
                    <span>{kw.suggestedTitle || "Non disponible"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-600">Description: </span>
                    <span>{kw.suggestedDescription || "Non disponible"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default KeywordStep;
