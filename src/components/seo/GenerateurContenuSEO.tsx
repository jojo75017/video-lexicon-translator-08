
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
    includeTestimonial: true, // Ajout de l'option manquante
    useCustomIntro: false, // Ajout de l'option manquante
    customIntro: '', // Ajout de l'option manquante
    seoOptimized: true, // Ajout de l'option manquante
    includeTableOfContents: true,
    includeSources: true,
    includeImages: true,
    headerStyle: 'standard' // standard, numbered, decorative
  });
  const [seoAnalysis, setSeoAnalysis] = useState<Array<{
    type: 'amélioration' | 'erreur' | 'optimisation';
    message: string;
    priorité: 'haute' | 'moyenne' | 'basse';
  }> | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80');
  const [seoScore, setSeoScore] = useState(0);

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

      // Générer une image mise en avant aléatoire (simulée)
      const featuredImages = [
        "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80"
      ];
      
      setFeaturedImageUrl(featuredImages[Math.floor(Math.random() * featuredImages.length)]);
      
      // Calculer un score SEO simulé basé sur le contenu généré
      const randomScore = Math.floor(Math.random() * 20) + 75; // score entre 75 et 95
      setSeoScore(randomScore);
      
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
              placeholder="Entrez votre mot-clé principal (ex: marketing digital)"
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
            
            {/* Nouvelle section pour l'image mise en avant et les métriques SEO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-1">
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  <div className="p-3 bg-gray-100 border-b flex justify-between items-center">
                    <h4 className="font-medium flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Image mise en avant
                    </h4>
                    <Button size="sm" variant="ghost">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <div className="aspect-video bg-gray-200 rounded-md overflow-hidden">
                      <img src={featuredImageUrl} alt="Image mise en avant" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <div className="p-3 bg-gray-100 border-b">
                      <h4 className="font-medium">Balise Title (60 caractères)</h4>
                    </div>
                    <div className="p-3">
                      <ProfessionalEditor
                        value={generatedContent.title.length > 60 ? 
                          generatedContent.title.substring(0, 57) + '...' : 
                          generatedContent.title}
                        onChange={() => {}}
                        height="60px"
                        placeholder="Titre SEO"
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Longueur recommandée: 50-60 caractères</span>
                        <span className={generatedContent.title.length > 60 ? "text-red-500 font-bold" : ""}>
                          {generatedContent.title.length}/60
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <div className="p-3 bg-gray-100 border-b">
                      <h4 className="font-medium">Meta Description (155 caractères)</h4>
                    </div>
                    <div className="p-3">
                      <ProfessionalEditor
                        value={generatedContent.intro.replace(/<[^>]*>/g, '').substring(0, 155)}
                        onChange={() => {}}
                        height="80px"
                        placeholder="Description SEO"
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Longueur recommandée: 140-155 caractères</span>
                        <span>
                          {Math.min(generatedContent.intro.replace(/<[^>]*>/g, '').length, 155)}/155
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 border rounded-lg overflow-hidden bg-gray-50">
                  <div className="p-3 bg-gray-100 border-b">
                    <h4 className="font-medium">Score SEO</h4>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-3 text-white font-bold text-xl
                        ${seoScore >= 90 ? 'bg-green-500' : 
                          seoScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      >
                        {seoScore}
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${seoScore >= 90 ? 'bg-green-500' : 
                                              seoScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{width: `${seoScore}%`}}
                          ></div>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {seoScore >= 90 ? 'Excellent' : 
                           seoScore >= 70 ? 'Bon' : 'À améliorer'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="editor">Aperçu</TabsTrigger>
                <TabsTrigger value="code">Code HTML</TabsTrigger>
                <TabsTrigger value="seo">Analyse SEO</TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="prose prose-indigo max-w-none">
                    <h1 className="text-2xl font-bold mb-4">{generatedContent.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: generatedContent.intro }} />
                    
                    {generatedContent.sections.map((section, index) => (
                      <div key={index} className="mt-5">
                        {section.heading && (
                          <div dangerouslySetInnerHTML={{ __html: section.heading }} />
                        )}
                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <MessageSquare className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Statistiques du contenu :</strong> Environ {getWordCountEstimate()} mots · 
                    {options.includeFAQ ? ' Avec FAQ ·' : ''} 
                    {options.includeStats ? ' Avec statistiques ·' : ''} 
                    {options.includeCallToAction ? ' Avec CTA ·' : ''} 
                    {options.includeSources ? ' Avec sources' : ''}
                  </AlertDescription>
                </Alert>
              </TabsContent>
              
              <TabsContent value="code" className="space-y-4">
                <div className="relative">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-xs border border-gray-200 whitespace-pre-wrap">
                    <code className="text-gray-800">{getFullContent()}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white"
                    onClick={() => handleCopy('htmlCode', getFullContent())}
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
              
              <TabsContent value="seo" className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Analyse SEO du contenu</h3>
                  
                  {seoAnalysis ? (
                    <div className="space-y-4">
                      {seoAnalysis.map((item, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border ${
                            item.type === 'erreur' 
                              ? 'bg-red-50 border-red-200' 
                              : item.type === 'amélioration'
                                ? 'bg-yellow-50 border-yellow-200'
                                : 'bg-green-50 border-green-200'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-white
                              ${item.type === 'erreur' 
                                ? 'bg-red-500' 
                                : item.type === 'amélioration'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                            >
                              {item.type === 'erreur' ? '!' : item.type === 'amélioration' ? '↗' : '✓'}
                            </div>
                            <div>
                              <p className="font-medium">
                                {item.type === 'erreur' 
                                  ? 'Erreur à corriger' 
                                  : item.type === 'amélioration'
                                    ? 'Amélioration possible'
                                    : 'Optimisation validée'
                                }
                                <span className={`ml-2 text-xs rounded-full px-2 py-0.5 ${
                                  item.priorité === 'haute' 
                                    ? 'bg-red-100 text-red-800' 
                                    : item.priorité === 'moyenne'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                }`}>
                                  Priorité {item.priorité}
                                </span>
                              </p>
                              <p className="text-sm mt-1">{item.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <RefreshCw className="h-12 w-12 mx-auto text-gray-400 animate-spin" />
                      <p className="mt-4 text-gray-600">Analyse en cours...</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GenerateurContenuSEO;
