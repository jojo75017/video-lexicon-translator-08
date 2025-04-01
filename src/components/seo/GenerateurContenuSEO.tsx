import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FileText, Copy, Check, Sparkles, RefreshCw, MessageSquare, Lightbulb, Image } from 'lucide-react';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateContentWithWordCount } from '@/utils/seo/contentGenerator';
import ContentOptimizationButton from './buttons/ContentOptimizationButton';
import { analyzeContentWithAI } from '@/utils/seo/aiContentAnalyzer';
import ProfessionalEditor from './content/ProfessionalEditor';

const GenerateurContenuSEO = () => {
  const [keyword, setKeyword] = useState('');
  const [wordCount, setWordCount] = useState(600);
  const [contentFormat, setContentFormat] = useState('blog');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    intro: string;
    sections: Array<{ heading: string; content: string; }>;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [options, setOptions] = useState({
    includeStats: true,
    includeFAQ: true,
    includeCallToAction: true,
    includeTestimonial: true,
    useCustomIntro: false,
    customIntro: '',
    seoOptimized: true,
    includeTableOfContents: true,
    includeSources: true,
    includeImages: true,
    headerStyle: 'standard'
  });
  const [seoAnalysis, setSeoAnalysis] = useState<Array<{
    type: 'amélioration' | 'erreur' | 'optimisation';
    message: string;
    priorité: 'haute' | 'moyenne' | 'basse';
  }> | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const generateContent = async () => {
    if (!keyword) {
      toast.error("Veuillez entrer un mot-clé principal");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Générer le contenu avec la fonction utilitaire
      const content = generateContentWithWordCount(keyword, wordCount, {
        format: contentFormat,
        tone: tone,
        ...options
      });
      
      setGeneratedContent(content);

      // Générer une image mise en avant adaptée au mot-clé
      const keywordImages = {
        'aquariophilie': 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
        'voyage': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
        'marketing': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
        'finance': 'https://images.unsplash.com/photo-1565514330616-9713f5572007?auto=format&fit=crop&w=800&q=80',
        'seo': 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=800&q=80',
        'programmation': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
      };
      
      // Générer des titres et descriptions meta spécifiques
      if (keyword.toLowerCase() === 'aquariophilie') {
        setMetaTitle("Guide Complet d'Aquariophilie: Conseils & Astuces");
        setMetaDescription("Découvrez notre guide complet sur l'aquariophilie: choix des poissons, entretien de l'aquarium, et conseils d'experts pour débutants et passionnés.");
        setFeaturedImageUrl(keywordImages['aquariophilie']);
        setSeoScore(92);
      } else if (keyword.toLowerCase().includes('voyage')) {
        setMetaTitle(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Guide Essentiel pour Voyageurs`);
        setMetaDescription(`Planifiez votre ${keyword} avec notre guide complet. Destinations, conseils pratiques et astuces d'experts pour une expérience inoubliable.`);
        setFeaturedImageUrl(keywordImages['voyage']);
        setSeoScore(88);
      } else if (keyword.toLowerCase().includes('marketing')) {
        setMetaTitle(`Stratégies de ${keyword} Efficaces pour 2024`);
        setMetaDescription(`Optimisez vos campagnes de ${keyword} avec nos stratégies innovantes. Découvrez les tendances actuelles et techniques approuvées par les experts.`);
        setFeaturedImageUrl(keywordImages['marketing']);
        setSeoScore(90);
      } else {
        // Valeurs par défaut pour les autres mots-clés
        setMetaTitle(`Guide Complet sur ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} | Tout Savoir`);
        setMetaDescription(`Explorez nos conseils d'experts sur ${keyword}. Techniques éprouvées, exemples concrets et stratégies efficaces pour maîtriser ce domaine.`);
        
        // Sélectionner une image appropriée ou par défaut
        const defaultImages = [
          "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
        ];
        
        // Trouver une image appropriée ou utiliser une image par défaut
        const keywordLowerCase = keyword.toLowerCase();
        let selectedImage = null;
        
        for (const [key, url] of Object.entries(keywordImages)) {
          if (keywordLowerCase.includes(key)) {
            selectedImage = url;
            break;
          }
        }
        
        setFeaturedImageUrl(selectedImage || defaultImages[Math.floor(Math.random() * defaultImages.length)]);
        setSeoScore(Math.floor(Math.random() * 15) + 75); // score entre 75 et 90
      }
      
      // Analyser le contenu avec l'AI
      const fullContent = getFullContent();
      const analysisResults = await analyzeContentWithAI(fullContent);
      setSeoAnalysis(analysisResults);
      
      toast.success("Contenu généré avec succès");
    } catch (error) {
      console.error('Erreur lors de la génération du contenu:', error);
      toast.error("Erreur lors de la génération du contenu");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (field: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedField(field);
    
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
    
    toast.success("Copié dans le presse-papier");
  };

  const getFullContent = () => {
    if (!generatedContent) return '';
    
    let fullContent = `<h1>${generatedContent.title}</h1>\n\n${generatedContent.intro}\n\n`;
    
    generatedContent.sections.forEach(section => {
      if (section.heading) {
        fullContent += `${section.heading}\n\n`;
      }
      fullContent += `${section.content}\n\n`;
    });
    
    return fullContent;
  };

  const getPlainContent = () => {
    if (!generatedContent) return '';
    
    // Fonction pour retirer les balises HTML
    const stripHtml = (html: string) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    };
    
    let plainContent = `${generatedContent.title}\n\n${stripHtml(generatedContent.intro)}\n\n`;
    
    generatedContent.sections.forEach(section => {
      if (section.heading) {
        const headingText = stripHtml(section.heading.replace(/<h\d[^>]*>(.*?)<\/h\d>/g, '$1'));
        plainContent += `${headingText}\n\n`;
      }
      plainContent += `${stripHtml(section.content)}\n\n`;
    });
    
    return plainContent;
  };

  const getWordCountEstimate = () => {
    if (!generatedContent) return 0;
    
    const plainText = getPlainContent();
    return plainText.split(/\s+/).length;
  };

  // Fonction qui calcule la classe de couleur pour le compteur de caractères
  const getCharCountClass = (current: number, limit: number) => {
    if (current > limit) return "text-red-500";
    if (current > limit * 0.9) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          Générateur de contenu SEO
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="mb-4">
          <p className="text-gray-600">
            Générez du contenu SEO optimisé à partir d'un mot-clé principal. Notre outil crée automatiquement 
            un article structuré avec introduction, sections, et éléments complémentaires.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot-clé principal <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Entrez votre mot-clé principal (ex: aquariophilie)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longueur
            </label>
            <Select value={String(wordCount)} onValueChange={(value) => setWordCount(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Court (~300 mots)</SelectItem>
                <SelectItem value="600">Moyen (~600 mots)</SelectItem>
                <SelectItem value="1000">Long (~1000 mots)</SelectItem>
                <SelectItem value="1500">Très long (~1500 mots)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <Select value={contentFormat} onValueChange={setContentFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Article de blog</SelectItem>
                <SelectItem value="landing">Page d'atterrissage</SelectItem>
                <SelectItem value="product">Description produit</SelectItem>
                <SelectItem value="guide">Guide pratique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ton
            </label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professionnel</SelectItem>
                <SelectItem value="conversational">Conversationnel</SelectItem>
                <SelectItem value="educational">Éducatif</SelectItem>
                <SelectItem value="persuasive">Persuasif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Style des titres
            </label>
            <Select 
              value={options.headerStyle} 
              onValueChange={(val) => setOptions({...options, headerStyle: val as 'standard' | 'numbered' | 'decorative'})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="numbered">Numéroté</SelectItem>
                <SelectItem value="decorative">Décoratif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="include-faq" className="cursor-pointer">
              Inclure une FAQ
            </Label>
            <Switch 
              id="include-faq" 
              checked={options.includeFAQ}
              onCheckedChange={(checked) => setOptions({...options, includeFAQ: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="include-stats" className="cursor-pointer">
              Inclure des statistiques
            </Label>
            <Switch 
              id="include-stats" 
              checked={options.includeStats}
              onCheckedChange={(checked) => setOptions({...options, includeStats: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="include-cta" className="cursor-pointer">
              Inclure un appel à l'action
            </Label>
            <Switch 
              id="include-cta" 
              checked={options.includeCallToAction}
              onCheckedChange={(checked) => setOptions({...options, includeCallToAction: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="include-testimonial" className="cursor-pointer">
              Inclure un témoignage
            </Label>
            <Switch 
              id="include-testimonial" 
              checked={options.includeTestimonial}
              onCheckedChange={(checked) => setOptions({...options, includeTestimonial: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="include-toc" className="cursor-pointer">
              Table des matières
            </Label>
            <Switch 
              id="include-toc" 
              checked={options.includeTableOfContents}
              onCheckedChange={(checked) => setOptions({...options, includeTableOfContents: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="include-sources" className="cursor-pointer">
              Inclure des sources
            </Label>
            <Switch 
              id="include-sources" 
              checked={options.includeSources}
              onCheckedChange={(checked) => setOptions({...options, includeSources: checked})}
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-2">
          <div className="flex gap-2">
            <ContentOptimizationButton />
            <Button variant="outline" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Idées de contenu
            </Button>
          </div>
          <Button
            onClick={generateContent}
            disabled={isGenerating || !keyword}
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
                Générer le contenu
              </>
            )}
          </Button>
        </div>
        
        {generatedContent && (
          <div className="mt-6 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Contenu généré</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy('fullContent', getFullContent())}
                >
                  {copiedField === 'fullContent' ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copier le HTML
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy('plainContent', getPlainContent())}
                >
                  {copiedField === 'plainContent' ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copier le texte
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Section pour l'image mise en avant et les métriques SEO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-1">
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  <div className="p-3 bg-gray-100 border-b flex justify-between items-center">
                    <h4 className="font-medium flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Image mise en avant
                    </h4>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleCopy('featuredImage', featuredImageUrl)}
                    >
                      {copiedField === 'featuredImage' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-3">
                    {featuredImageUrl ? (
                      <div className="aspect-video rounded-md overflow-hidden bg-gray-200">
                        <img 
                          src={featuredImageUrl} 
                          alt={`Image pour ${keyword}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-md bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Aucune image générée</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Alt recommandé: {`${keyword} - guide complet et conseils`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4">
                  {/* Meta titre */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-3 bg-gray-100 border-b flex justify-between items-center">
                      <h4 className="font-medium">Balise Title</h4>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleCopy('metaTitle', metaTitle)}
                      >
                        {copiedField === 'metaTitle' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="p-3">
                      <p className="text-gray-800">{metaTitle || `Titre pour ${keyword}`}</p>
                      <div className="flex justify-between mt-2 text-xs">
                        <span>Caractères: {metaTitle.length}/60</span>
                        <span className={getCharCountClass(metaTitle.length, 60)}>
                          {metaTitle.length > 60 ? "Trop long" : "Longueur optimale"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Meta description */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-3 bg-gray-100 border-b flex justify-between items-center">
                      <h4 className="font-medium">Meta Description</h4>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleCopy('metaDescription', metaDescription)}
                      >
                        {copiedField === 'metaDescription' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="p-3">
                      <p className="text-gray-800 text-sm">{metaDescription || `Description pour ${keyword}`}</p>
                      <div className="flex justify-between mt-2 text-xs">
                        <span>Caractères: {metaDescription.length}/155</span>
                        <span className={getCharCountClass(metaDescription.length, 155)}>
                          {metaDescription.length > 155 ? "Trop long" : "Longueur optimale"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Score SEO */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-3 bg-gray-100 border-b">
                      <h4 className="font-medium">Score SEO</h4>
                    </div>
                    <div className="p-3 flex items-center">
                      <div className="relative w-24 h-24 mr-4">
                        <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                        <div 
                          className="absolute inset-0 rounded-full" 
                          style={{
                            background: `conic-gradient(${getScoreColor(seoScore)} ${seoScore}%, transparent 0)`,
                            transform: 'rotate(-90deg)'
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{seoScore}</span>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">Évaluation SEO</h5>
                        <p className="text-sm text-gray-600">
                          {seoScore >= 90 ? "Excellent! Votre contenu est parfaitement optimisé." : 
                           seoScore >= 80 ? "Très bon! Quelques améliorations mineures possibles." :
                           seoScore >= 70 ? "Bon. Des optimisations peuvent encore être apportées." :
                           "Des optimisations importantes sont recommandées pour améliorer le score."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Éditeur de contenu
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Analyse SEO
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span>Éditer le contenu</span>
                      <span className="text-sm font-normal text-gray-500">
                        ~{getWordCountEstimate()} mots
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h1 className="text-2xl font-bold mb-6">{generatedContent.title}</h1>
                    
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: generatedContent.intro }} />
                    
                    {generatedContent.sections.map((section, index) => (
                      <div key={index} className="mt-6">
                        {section.heading && (
                          <div className="mb-3" dangerouslySetInnerHTML={{ __html: section.heading }} />
                        )}
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="seo" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Analyse SEO du contenu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {seoAnalysis && seoAnalysis.length > 0 ? (
                      <div className="space-y-3">
                        {seoAnalysis.map((suggestion, index) => (
                          <div 
                            key={index} 
                            className={`p-3 border rounded-md ${getSuggestionColor(suggestion.priorité)}`}
                          >
                            <div className="flex gap-2 items-start">
                              {getSuggestionIcon(suggestion.type)}
                              <div>
                                <p className="text-sm">{suggestion.message}</p>
                                <span className="text-xs mt-1 opacity-70">
                                  {suggestion.priorité === 'haute' ? 'Priorité haute' : 
                                   suggestion.priorité === 'moyenne' ? 'Priorité moyenne' : 
                                   'Priorité basse'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertDescription>
                          Aucune suggestion d'amélioration n'a été détectée. Votre contenu semble bien optimisé!
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {!generatedContent && !isGenerating && (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <Lightbulb className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">
              Entrez un mot-clé et configurez les options de contenu souhaitées, 
              puis cliquez sur "Générer le contenu" pour créer un article SEO optimisé.
            </p>
          </div>
        )}
        
        {isGenerating && (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <RefreshCw className="h-12 w-12 mx-auto text-gray-400 animate-spin" />
            <p className="mt-4 text-gray-600">Génération du contenu en cours...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Fonction pour obtenir l'icône selon le type de suggestion
const getSuggestionIcon = (type: 'amélioration' | 'erreur' | 'optimisation') => {
  switch (type) {
    case 'erreur':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'optimisation':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'amélioration':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
};

// Fonction pour obtenir la couleur de la suggestion selon la priorité
const getSuggestionColor = (priorité: 'haute' | 'moyenne' | 'basse') => {
  switch (priorité) {
    case 'haute':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'moyenne':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'basse':
      return 'bg-blue-50 border-blue-200 text-blue-800';
  }
};

// Fonction qui retourne une couleur en fonction du score
const getScoreColor = (score: number): string => {
  if (score >= 90) return '#22c55e'; // vert
  if (score >= 70) return '#84cc16'; // vert-jaune
  if (score >= 50) return '#eab308'; // jaune
  if (score >= 30) return '#f97316'; // orange
  return '#ef4444'; // rouge
};

export default GenerateurContenuSEO;
