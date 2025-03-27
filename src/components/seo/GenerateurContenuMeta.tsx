
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, AlertTriangle, Sparkles, RefreshCw, Globe } from 'lucide-react';
import { toast } from "sonner";

const GenerateurContenuMeta = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!title || !description) {
      toast.error("Veuillez remplir au moins le titre et la description");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulation de génération avec IA
    setTimeout(() => {
      if (!ogTitle) setOgTitle(title);
      if (!ogDescription) setOgDescription(description);
      if (!twitterTitle) setTwitterTitle(title);
      if (!twitterDescription) setTwitterDescription(description);
      
      setIsGenerating(false);
      toast.success("Génération terminée", {
        description: "Les balises méta ont été générées avec succès",
      });
    }, 1500);
  };

  const handleLoadFromUrl = () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }
    
    setIsUrlLoading(true);
    
    // Simulation de chargement depuis une URL
    setTimeout(() => {
      setTitle("Titre de page exemple");
      setDescription("Description de la page exemple optimisée pour le référencement. Cette description devrait idéalement comporter entre 120 et 160 caractères pour être parfaitement adaptée aux moteurs de recherche.");
      setKeywords("seo, référencement, optimisation, balises meta");
      
      setIsUrlLoading(false);
      toast.success("Contenu chargé", {
        description: "Les balises méta ont été récupérées depuis l'URL",
      });
    }, 2000);
  };

  const handleCopy = (field: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedField(field);
    
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
    
    toast.success("Copié dans le presse-papier");
  };

  const generateHtmlCode = () => {
    return `<head>
  <!-- Balises méta principales -->
  <title>${title}</title>
  <meta name="description" content="${description}" />
  ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
  
  <!-- Open Graph (Facebook, LinkedIn) -->
  ${ogTitle ? `<meta property="og:title" content="${ogTitle}" />` : ''}
  ${ogDescription ? `<meta property="og:description" content="${ogDescription}" />` : ''}
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url || 'https://votresite.com'}" />
  <meta property="og:image" content="https://votresite.com/image.jpg" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  ${twitterTitle ? `<meta name="twitter:title" content="${twitterTitle}" />` : ''}
  ${twitterDescription ? `<meta name="twitter:description" content="${twitterDescription}" />` : ''}
  <meta name="twitter:image" content="https://votresite.com/image.jpg" />
</head>`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          Générateur de balises méta
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="mb-4">
          <p className="text-gray-600">
            Créez des balises méta optimisées pour améliorer votre référencement et votre présence sur les réseaux sociaux
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="URL du site (optionnel)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleLoadFromUrl}
            disabled={isUrlLoading || !url}
            className="whitespace-nowrap"
          >
            {isUrlLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                Charger depuis l'URL
              </>
            )}
          </Button>
        </div>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Balises principales</TabsTrigger>
            <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
            <TabsTrigger value="code">Code HTML</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de la page <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Titre de la page (50-60 caractères)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy('title', title)}
                    disabled={!title}
                    className="flex-shrink-0"
                  >
                    {copiedField === 'title' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex justify-between">
                  <span>Idéalement 50-60 caractères</span>
                  <span className={`${title.length > 60 ? 'text-red-500' : title.length > 50 ? 'text-green-500' : ''}`}>
                    {title.length} / 60
                  </span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Description de la page (120-160 caractères)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy('description', description)}
                    disabled={!description}
                    className="flex-shrink-0"
                  >
                    {copiedField === 'description' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex justify-between">
                  <span>Idéalement 120-160 caractères</span>
                  <span className={`${description.length > 160 ? 'text-red-500' : description.length > 120 ? 'text-green-500' : ''}`}>
                    {description.length} / 160
                  </span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mots-clés (séparés par des virgules)
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="mot-clé1, mot-clé2, mot-clé3"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy('keywords', keywords)}
                    disabled={!keywords}
                    className="flex-shrink-0"
                  >
                    {copiedField === 'keywords' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recommandation : 3-5 mots-clés pertinents
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                <h3 className="font-medium text-blue-800 mb-1">Open Graph (Facebook, LinkedIn)</h3>
                <p className="text-sm text-blue-700">
                  Ces balises contrôlent l'apparence de votre page lorsqu'elle est partagée sur Facebook, LinkedIn et d'autres plateformes.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre Open Graph
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Titre pour Facebook, LinkedIn (identique au titre par défaut)"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy('ogTitle', ogTitle)}
                    disabled={!ogTitle}
                    className="flex-shrink-0"
                  >
                    {copiedField === 'ogTitle' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description Open Graph
                </label>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Description pour Facebook, LinkedIn (identique à la description par défaut)"
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy('ogDescription', ogDescription)}
                    disabled={!ogDescription}
                    className="flex-shrink-0"
                  >
                    {copiedField === 'ogDescription' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-6 mb-4">
                <h3 className="font-medium text-blue-800 mb-1">Twitter Card</h3>
                <p className="text-sm text-blue-700">
                  Ces balises contrôlent l'apparence de votre page lorsqu'elle est partagée sur Twitter.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre Twitter
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Titre pour Twitter (identique au titre par défaut)"
                    value={twitterTitle}
                    onChange={(e) => setTwitterTitle(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy('twitterTitle', twitterTitle)}
                    disabled={!twitterTitle}
                    className="flex-shrink-0"
                  >
                    {copiedField === 'twitterTitle' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description Twitter
                </label>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Description pour Twitter (identique à la description par défaut)"
                    value={twitterDescription}
                    onChange={(e) => setTwitterDescription(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy('twitterDescription', twitterDescription)}
                    disabled={!twitterDescription}
                    className="flex-shrink-0"
                  >
                    {copiedField === 'twitterDescription' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Aperçu du code HTML</h3>
                  <p className="text-sm text-amber-700">
                    Copiez ce code dans la section <code>&lt;head&gt;</code> de votre page HTML pour implémenter toutes les balises méta générées.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs border border-gray-200">
                <code className="text-gray-800">{generateHtmlCode()}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-white"
                onClick={() => handleCopy('htmlCode', generateHtmlCode())}
              >
                {copiedField === 'htmlCode' ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-6 flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !title || !description}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Générer automatiquement
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerateurContenuMeta;
