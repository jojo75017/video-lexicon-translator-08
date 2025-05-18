import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Copy, Wand, Key } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSeoDescription, generateBothDescriptions, generateAIDescriptions } from "@/utils/seo/generators/description/generator";
import { getExactLength } from "@/utils/seo/generators/description/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MetaDescriptionGenerator = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [openaiKey, setOpenaiKey] = useState<string>(() => localStorage.getItem('openaiKey') || '');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [shortDescription, setShortDescription] = useState<string>('');
  const [longDescription, setLongDescription] = useState<string>('');
  const [shortLength, setShortLength] = useState(0);
  const [longLength, setLongLength] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('short');
  const [useAI, setUseAI] = useState<boolean>(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  useEffect(() => {
    setShortLength(getExactLength(shortDescription));
  }, [shortDescription]);

  useEffect(() => {
    setLongLength(getExactLength(longDescription));
  }, [longDescription]);

  useEffect(() => {
    // Si une clé API est enregistrée, activer l'option IA par défaut
    if (openaiKey) {
      setUseAI(true);
    }
  }, [openaiKey]);

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez saisir un mot-clé pour générer une description");
      return;
    }

    setIsGenerating(true);
    toast.info("Génération de descriptions en cours...");

    try {
      if (useAI && openaiKey) {
        // Utiliser l'API OpenAI pour générer des descriptions plus pertinentes
        const aiResults = await generateAIDescriptions(keyword, openaiKey);
        setShortDescription(aiResults.short);
        setLongDescription(aiResults.long);
        toast.success("Descriptions générées avec l'IA");
      } else {
        // Utiliser le générateur local amélioré
        const { short, long } = generateBothDescriptions(keyword);
        setShortDescription(short);
        setLongDescription(long);
        toast.success("Descriptions générées avec succès");
      }
    } catch (error) {
      console.error("Error generating descriptions:", error);
      toast.error("Erreur lors de la génération des descriptions");
      
      // En cas d'échec, utiliser le générateur local
      const { short, long } = generateBothDescriptions(keyword);
      setShortDescription(short);
      setLongDescription(long);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copiée dans le presse-papier`);
  };

  const saveApiKey = () => {
    if (openaiKey) {
      localStorage.setItem('openaiKey', openaiKey);
      setUseAI(true);
      setShowApiKeyInput(false);
      toast.success("Clé API OpenAI sauvegardée");
    } else {
      toast.error("Veuillez entrer une clé API valide");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand className="h-5 w-5 text-primary" />
          Générateur de méta-descriptions IA
        </CardTitle>
        <CardDescription>
          Créez des méta-descriptions SEO optimisées à partir de votre mot-clé principal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <Input
                placeholder="Entrez votre mot-clé principal (ex: aquariophilie, voyage à Paris, restaurant italien, etc.)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !keyword.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Wand className="mr-2 h-4 w-4" />
                  Générer
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="use-ai"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="use-ai" className="text-sm text-gray-700">
                Utiliser l'IA (OpenAI) pour des résultats plus pertinents
              </label>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            >
              <Key className="h-4 w-4 mr-2" />
              Configurer API
            </Button>
          </div>
          
          {showApiKeyInput && (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-2">
              <div className="text-sm font-medium mb-2">Configurer l'API OpenAI</div>
              <div className="flex gap-2">
                <Input 
                  type="password"
                  placeholder="Entrez votre clé API OpenAI (commence par sk-...)"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={saveApiKey}>
                  Sauvegarder
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Votre clé est stockée uniquement dans votre navigateur et n'est jamais envoyée à nos serveurs.
              </div>
            </div>
          )}
          
          {useAI && !openaiKey && !showApiKeyInput && (
            <Alert variant="default" className="bg-amber-50 border-amber-200">
              <AlertDescription className="text-amber-800 text-sm">
                Vous avez activé l'IA, mais aucune clé API OpenAI n'est configurée. 
                <Button variant="link" className="p-0 h-auto text-amber-800 underline" onClick={() => setShowApiKeyInput(true)}>
                  Configurer une clé
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {(shortDescription || longDescription) && (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="short">Courte (155 car.)</TabsTrigger>
                <TabsTrigger value="long">Longue (500 car.)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="short" className="mt-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {shortLength} / 155 caractères
                  </div>
                  <div className="relative">
                    <Textarea 
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="min-h-[100px] font-mono text-sm pr-10"
                      placeholder="La description courte apparaîtra ici..."
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(shortDescription, "Description courte")}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copier</span>
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Optimisée pour les résultats Google SERP
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="long" className="mt-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {longLength} / 500 caractères
                  </div>
                  <div className="relative">
                    <Textarea 
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      className="min-h-[200px] font-mono text-sm pr-10"
                      placeholder="La description longue apparaîtra ici..."
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(longDescription, "Description longue")}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copier</span>
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Idéale pour les descriptions de produits et les partages sociaux
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>{useAI && openaiKey ? "Descriptions générées avec l'IA" : "Descriptions générées localement sans API externe"}</span>
        <span>{new Date().toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
};

export default MetaDescriptionGenerator;
