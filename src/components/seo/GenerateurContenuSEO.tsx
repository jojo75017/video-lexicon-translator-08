
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
import { FileText, Copy, Check, Sparkles, RefreshCw, MessageSquare, Lightbulb } from 'lucide-react';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateContentWithWordCount } from '@/utils/seo/contentGenerator';
import ContentOptimizationButton from './buttons/ContentOptimizationButton';

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
    includeTableOfContents: true,
    includeSources: true,
    includeImages: true,
    headerStyle: 'standard' // standard, numbered, decorative
  });

  const generateContent = () => {
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
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="editor">Aperçu</TabsTrigger>
                <TabsTrigger value="code">Code HTML</TabsTrigger>
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
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GenerateurContenuSEO;
