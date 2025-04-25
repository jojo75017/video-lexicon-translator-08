
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, Tag, FileText, KeyRound, Info, Search, Link, Copy, Check, SwitchCamera } from 'lucide-react';
import { toast } from "sonner";
import { KeywordSuggestion } from '@/types/seo';
import { OpenAIService } from '@/utils/seo/openaiService';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import OpenAIKeyForm from '@/components/settings/OpenAIKeyForm';

const KeywordTabContent = () => {
  const [openaiKey, setOpenaiKey] = useState<string>('');
  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const [isLoadingKey, setIsLoadingKey] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [longDescription, setLongDescription] = useState<string>('');
  const [extraDescription, setExtraDescription] = useState<string>('');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [isCopied, setIsCopied] = useState<{title: boolean, short: boolean, long: boolean, extra: boolean}>({title: false, short: false, long: false, extra: false});
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<KeywordSuggestion[]>([]);

  useEffect(() => {
    const storedKey = localStorage.getItem('openaiKey');
    if (storedKey) {
      console.log("Found stored OpenAI key in KeywordTabContent");
      setOpenaiKey(storedKey);
      validateApiKey(storedKey);
    } else {
      console.log("No stored OpenAI key found in KeywordTabContent");
    }
  }, []);

  const validateApiKey = async (key: string) => {
    if (!key) {
      setIsValidKey(false);
      return;
    }

    setIsLoadingKey(true);
    try {
      console.log("Validating API key in KeywordTabContent");
      
      // Make sure the proxy is enabled for validation
      OpenAIService.enableProxy();
      
      const openaiService = new OpenAIService(key);
      const isValid = await openaiService.validateApiKey();
      
      console.log("API key validation result:", isValid);
      setIsValidKey(isValid);

      if (isValid) {
        localStorage.setItem('openaiKey', key);
        toast.success("Clé API OpenAI valide", {
          description: "Vous pouvez maintenant utiliser les fonctionnalités d'IA"
        });
      } else {
        toast.error("Clé API OpenAI invalide", {
          description: "Veuillez vérifier votre clé et réessayer"
        });
      }
    } catch (err) {
      console.error("Erreur lors de la validation de la clé API:", err);
      setIsValidKey(false);
      
      toast.error("Erreur de validation", {
        description: "Impossible de valider la clé API. Vérifiez votre connexion internet."
      });
    } finally {
      setIsLoadingKey(false);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setOpenaiKey(key);
    validateApiKey(key);
  };

  const generateKeywordSuggestions = async (keywordText: string) => {
    if (!keywordText) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    // Récupérer la clé API depuis l'état local ou localStorage
    let keyToUse = openaiKey;
    if (!keyToUse) {
      const storedKey = localStorage.getItem('openaiKey');
      if (storedKey) {
        keyToUse = storedKey;
        setOpenaiKey(storedKey);
      } else {
        toast.error("Veuillez configurer une clé API OpenAI valide");
        return;
      }
    }

    setError(null);
    setIsGenerating(true);

    try {
      console.log("Generating keyword suggestions for:", keywordText, "with key:", keyToUse ? "Key exists" : "No key");
      
      // Make sure proxy is enabled
      OpenAIService.enableProxy();
      
      const openaiService = new OpenAIService(keyToUse);
      const suggestions = await openaiService.getKeywordSuggestions(keywordText);
      
      console.log("Generated suggestions:", suggestions);
      
      if (suggestions && suggestions.length > 0) {
        setGeneratedKeywords(suggestions);
        setHistory(prev => [suggestions[0], ...prev].slice(0, 10));
        setTitle(suggestions[0].suggestedTitle || '');
        
        // Ensure short description is exactly 155 characters
        const shortDesc = suggestions[0].suggestedShortDescription || suggestions[0].suggestedDescription || '';
        setShortDescription(shortDesc.length > 155 ? shortDesc.slice(0, 155) : shortDesc.padEnd(155));
        
        // Ensure long description is exactly 500 characters
        const longDesc = suggestions[0].suggestedLongDescription || suggestions[0].suggestedDescription || '';
        setLongDescription(longDesc.length > 500 ? longDesc.slice(0, 500) : longDesc.padEnd(500));
        
        // Ensure extra description is exactly 1000 characters
        const baseDesc = (suggestions[0].suggestedLongDescription || suggestions[0].suggestedDescription || '');
        setExtraDescription(baseDesc.length > 1000 ? baseDesc.slice(0, 1000) : baseDesc.padEnd(1000));
        
        toast.success("Suggestions générées avec succès");
      } else {
        toast.error("Aucune suggestion n'a pu être générée");
      }
    } catch (err) {
      console.error("Erreur lors de la génération des suggestions:", err);
      setError("Une erreur est survenue lors de la génération des suggestions");
      toast.error("Erreur de génération", {
        description: "Impossible de générer des suggestions pour ce mot-clé. Vérifiez votre clé API et votre connexion."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: 'title' | 'short' | 'long' | 'extra') => {
    navigator.clipboard.writeText(text);
    setIsCopied({
      ...isCopied,
      [type]: true
    });
    toast.success(`${(type === "title" ? "Titre" : type === "short" ? "Description courte" : type === "long" ? "Description longue" : "Description extra-longue")} copié !`);
    setTimeout(() => {
      setIsCopied(prev => ({...prev, [type]: false}));
    }, 1500);
  };

  const colorIndicator = (value: string, max: number) => {
    if (value.length > max) return 'text-red-500';
    if (value.length > max * 0.9) return 'text-yellow-500';
    return 'text-green-500';
  };

  const fillFromHistory = (s: KeywordSuggestion) => {
    setTitle(s.suggestedTitle || '');
    
    // Ensure short description is exactly 155 characters
    const shortDesc = s.suggestedShortDescription || s.suggestedDescription || '';
    setShortDescription(shortDesc.length > 155 ? shortDesc.slice(0, 155) : shortDesc.padEnd(155));
    
    // Ensure long description is exactly 500 characters
    const longDesc = s.suggestedLongDescription || s.suggestedDescription || '';
    setLongDescription(longDesc.length > 500 ? longDesc.slice(0, 500) : longDesc.padEnd(500));
    
    // Ensure extra description is exactly 1000 characters
    const baseDesc = (s.suggestedLongDescription || s.suggestedDescription || '');
    setExtraDescription(baseDesc.length > 1000 ? baseDesc.slice(0, 1000) : baseDesc.padEnd(1000));
    
    toast.success("Suggestion appliquée !");
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Configuration de la clé API */}
      <Card className="p-6 shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Configuration API</h3>
        </div>
        <OpenAIKeyForm 
          apiKey={openaiKey} 
          onSave={handleSaveApiKey} 
          isLoading={isLoadingKey}
          isValid={isValidKey}
        />
        {isValidKey && (
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Clé API valide. Vous pouvez utiliser toutes les fonctionnalités.
          </div>
        )}
      </Card>

      {/* Génération de mots-clés et meta tags */}
      <Card className="p-6 shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-medium">Génération de meta tags</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              Mot-clé principal
            </label>
            <div className="flex space-x-2">
              <Input 
                id="keyword"
                placeholder="seo, marketing digital, etc." 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => generateKeywordSuggestions(keyword)}
                className="whitespace-nowrap"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Générer
                  </>
                )}
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Entrez un mot-clé principal pour générer des suggestions de titres et descriptions.
            </p>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Balise Title (max 60 caractères)
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input 
                  id="title"
                  placeholder="Titre optimisé pour le SEO" 
                  value={title} 
                  onChange={handleTitleChange}
                  className={`pr-10 ${title.length > 60 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-green-300 focus:border-green-500 focus:ring-green-500'}`}
                  maxLength={60}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Button
                    onClick={() => copyToClipboard(title, 'title')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    {isCopied.title ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>Le titre apparaît dans les résultats de recherche.</span>
              <span className={`font-medium ${colorIndicator(title, 60)}`}>{title.length}/60</span>
            </p>
          </div>

          {/* Descriptions */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Courte */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meta description courte (max 155)
              </label>
              <div className="relative">
                <Textarea
                  value={shortDescription}
                  onChange={e => setShortDescription(e.target.value)}
                  maxLength={155}
                  rows={5}
                  className={`resize-none pr-10 ${shortDescription.length > 155 ? 'border-red-300 focus:border-red-500' : 'border-green-300 focus:border-green-500'}`}
                />
                <div className="absolute top-0 right-0 m-2">
                  <Button onClick={() => copyToClipboard(shortDescription, 'short')} variant="ghost" size="icon" className="h-7 w-7">
                    {isCopied.short ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>
              <span className={`text-xs font-medium ${colorIndicator(shortDescription, 155)}`}>
                {shortDescription.length}/155
              </span>
            </div>
            {/* Longue */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meta description longue (max 500)
              </label>
              <div className="relative">
                <Textarea
                  value={longDescription}
                  onChange={e => setLongDescription(e.target.value)}
                  maxLength={500}
                  rows={5}
                  className={`resize-none pr-10 ${longDescription.length > 500 ? 'border-red-300 focus:border-red-500' : 'border-green-300 focus:border-green-500'}`}
                />
                <div className="absolute top-0 right-0 m-2">
                  <Button onClick={() => copyToClipboard(longDescription, 'long')} variant="ghost" size="icon" className="h-7 w-7">
                    {isCopied.long ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>
              <span className={`text-xs font-medium ${colorIndicator(longDescription, 500)}`}>
                {longDescription.length}/500
              </span>
            </div>
            {/* Extra longue */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meta description extra-longue (max 1000)
              </label>
              <div className="relative">
                <Textarea
                  value={extraDescription}
                  onChange={e => setExtraDescription(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  className={`resize-none pr-10 ${extraDescription.length > 1000 ? 'border-red-300 focus:border-red-500' : 'border-green-300 focus:border-green-500'}`}
                />
                <div className="absolute top-0 right-0 m-2">
                  <Button onClick={() => copyToClipboard(extraDescription, 'extra')} variant="ghost" size="icon" className="h-7 w-7">
                    {isCopied.extra ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>
              <span className={`text-xs font-medium ${colorIndicator(extraDescription, 1000)}`}>
                {extraDescription.length}/1000
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Historique : derniers titres/descriptions générés */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-bold mb-2">Historique des suggestions</h4>
        {history.length === 0
          ? <span className="text-gray-400 text-sm">Aucune suggestion générée pour le moment.</span>
          : (
            <div className="space-y-2">
              {history.map((s, idx) => (
                <div key={idx} className="bg-white p-2 rounded flex justify-between items-center cursor-pointer border hover:bg-blue-50"
                  onClick={() => fillFromHistory(s)}>
                  <div>
                    <span className="font-medium">{s.keyword} </span>
                    <span className="text-xs ml-2 text-gray-500">{(s.suggestedTitle||'').slice(0,40)}</span>
                  </div>
                  <span className="text-xs text-blue-500">Appliquer</span>
                </div>
              ))}
            </div>
          )}
      </Card>

      {/* Suggestions détails */}
      <KeywordSuggestions
        generatedKeywords={generatedKeywords}
        onGenerateClick={() => generateKeywordSuggestions(keyword)}
        fieldValue={title}
        onInsert={setTitle}
        maxLength={60}
        descriptionValue={shortDescription}
        onInsertDescription={setShortDescription}
        maxLengthDescription={155}
        descriptionType={'short'}
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default KeywordTabContent;
