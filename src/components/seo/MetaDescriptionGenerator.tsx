
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Copy, Wand } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSeoDescription, generateBothDescriptions } from "@/utils/seo/generators/descriptionGenerator";

const MetaDescriptionGenerator = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [shortDescription, setShortDescription] = useState<string>('');
  const [longDescription, setLongDescription] = useState<string>('');

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez saisir un mot-clé pour générer une description");
      return;
    }

    setIsGenerating(true);
    toast.info("Génération de descriptions en cours...");

    try {
      // Génération avec notre nouveau système amélioré
      const { short, long } = generateBothDescriptions(keyword);
      setShortDescription(short);
      setLongDescription(long);
      
      toast.success("Descriptions générées avec succès");
    } catch (error) {
      console.error("Error generating descriptions:", error);
      toast.error("Erreur lors de la génération des descriptions");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copiée dans le presse-papier`);
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
                placeholder="Entrez votre mot-clé principal (ex: digital nomad à Bali, voyage à Paris, etc.)"
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
          
          {(shortDescription || longDescription) && (
            <Tabs defaultValue="short" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="short">Courte (155 car.)</TabsTrigger>
                <TabsTrigger value="long">Longue (500 car.)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="short" className="mt-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {shortDescription.length} / 155 caractères
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
                    {longDescription.length} / 500 caractères
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
        <span>Les descriptions sont générées localement sans API externe</span>
        <span>{new Date().toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
};

export default MetaDescriptionGenerator;
