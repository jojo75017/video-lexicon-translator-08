
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  FileText, 
  RefreshCw, 
  Send, 
  Maximize2, 
  CheckCircle, 
  AlertCircle, 
  Info,
  ImageIcon, 
  Copy, 
  Check, 
  Lightbulb,
  ListChecks,
  Image
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { analyzeContentWithAI } from '@/utils/seo/aiContentAnalyzer';
import ProfessionalEditor from './content/ProfessionalEditor';

interface ContentIdea {
  title: string;
  description: string;
}

interface MetaSuggestion {
  title: string;
  description: string;
  seoScore: number;
  imageUrl: string;
}

const GenerateurContenuSEO = () => {
  const [keyword, setKeyword] = useState('');
  const [contentType, setContentType] = useState('article');
  const [tone, setTone] = useState('professional');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentLength, setContentLength] = useState(500);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [editorContent, setEditorContent] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [metaSuggestions, setMetaSuggestions] = useState<MetaSuggestion | null>(null);
  const [currentTab, setCurrentTab] = useState('content');
  
  useEffect(() => {
    if (editorContent) {
      analyzeEditorContent(editorContent);
    }
  }, [editorContent]);

  // Reset content when keyword changes
  useEffect(() => {
    setGeneratedContent('');
    setMetaSuggestions(null);
  }, [keyword]);
  
  const handleGenerateContent = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    setIsGenerating(true);
    setGeneratedContent('');
    
    // Simulation d'un appel API avec un délai
    setTimeout(() => {
      const simulatedContent = `
        <h1>Guide Ultime sur ${keyword}</h1>
        <p>Introduction à ${keyword}.</p>
        <h2>Qu'est-ce que ${keyword} ?</h2>
        <p>Explication détaillée de ${keyword}.</p>
        <h2>Comment utiliser ${keyword} ?</h2>
        <p>Instructions pas à pas pour utiliser ${keyword}.</p>
        <h2>Avantages de ${keyword}</h2>
        <ul>
          <li>Avantage 1</li>
          <li>Avantage 2</li>
        </ul>
        <p>Conclusion sur ${keyword}.</p>
      `;
      
      setGeneratedContent(simulatedContent);
      setEditorContent(simulatedContent);
      setIsGenerating(false);
      toast.success("Contenu généré avec succès");
      
      // Générer des suggestions de balises meta après la génération de contenu
      generateMetaSuggestions(keyword);
    }, 2000);
  };
  
  const generateMetaSuggestions = (keyword: string) => {
    const keywordLower = keyword.toLowerCase();
    let imageUrl = "https://via.placeholder.com/600x400/007bff/ffffff?text=" + encodeURIComponent(keyword);
    let seoScore = Math.floor(Math.random() * 30) + 70; // Score entre 70 et 100
    let title = "";
    let description = "";
    
    // Images spécifiques pour certains mots-clés
    if (keywordLower === 'aquariophilie') {
      imageUrl = "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
      title = "Guide complet d'aquariophilie pour débutants et experts";
      description = "Découvrez tous les conseils et astuces pour réussir votre aquarium : choix des poissons, entretien, plantes aquatiques et équipements essentiels.";
    } else if (keywordLower.includes('marketing')) {
      imageUrl = "https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
      title = `Stratégies de ${keyword} efficaces pour 2024`;
      description = `Explorez les meilleures pratiques de ${keyword} pour développer votre entreprise. Conseils d'experts et exemples de réussite inclus.`;
    } else if (keywordLower.includes('seo') || keywordLower.includes('référencement')) {
      imageUrl = "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
      title = `Optimisez votre ${keyword} pour dominer les SERP`;
      description = `Guide complet pour améliorer votre ${keyword} et augmenter votre visibilité en ligne. Techniques actualisées et conseils d'experts.`;
    } else {
      // Titres et descriptions génériques pour d'autres mots-clés
      title = `Guide complet sur ${keyword} : Tout ce que vous devez savoir`;
      description = `Découvrez les meilleures pratiques pour maîtriser ${keyword}. Conseils d'experts, astuces et stratégies pour réussir.`;
    }
    
    setMetaSuggestions({
      title: title.substring(0, 60),
      description: description.substring(0, 155),
      seoScore,
      imageUrl
    });
    
    // Automatiquement passer à l'onglet "Optimisations" après la génération
    setCurrentTab('suggestions');
  };
  
  const handleAnalyzeContent = async () => {
    if (!generatedContent.trim()) {
      toast.error("Veuillez générer du contenu d'abord");
      return;
    }
    
    analyzeEditorContent(generatedContent);
  };
  
  const analyzeEditorContent = async (content: string) => {
    try {
      const results = await analyzeContentWithAI(content);
      setAnalysisResults(results);
    } catch (error: any) {
      console.error("Erreur lors de l'analyse du contenu:", error);
      toast.error("Erreur lors de l'analyse du contenu: " + error.message);
      setAnalysisResults([]);
    }
  };
  
  const handleCopySuggestion = (message: string, index: number) => {
    navigator.clipboard.writeText(message);
    setCopiedIndex(index);
    
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
    
    toast.success("Suggestion copiée dans le presse-papier");
  };
  
  const handleGenerateIdeas = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé pour générer des idées");
      return;
    }
    
    setIsGeneratingIdeas(true);
    setContentIdeas([]);
    
    // Simulation de la génération d'idées
    setTimeout(() => {
      const ideas = [
        { title: `Comment maîtriser ${keyword} en 30 jours`, description: "Un guide étape par étape pour les débutants." },
        { title: `Les erreurs à éviter avec ${keyword}`, description: "Conseils pour ne pas tomber dans les pièges courants." },
        { title: `Les outils indispensables pour ${keyword}`, description: "Une liste des meilleurs outils pour optimiser votre travail." }
      ];
      
      setContentIdeas(ideas);
      setIsGeneratingIdeas(false);
      toast.success("Idées de contenu générées avec succès");
    }, 1500);
  };
  
  const handleCopyMetaTitle = () => {
    if (metaSuggestions) {
      navigator.clipboard.writeText(metaSuggestions.title);
      toast.success("Titre copié dans le presse-papier");
    }
  };
  
  const handleCopyMetaDescription = () => {
    if (metaSuggestions) {
      navigator.clipboard.writeText(metaSuggestions.description);
      toast.success("Description copiée dans le presse-papier");
    }
  };
  
  const getSeoScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Générateur de Contenu SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="Mot-clé principal" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Select onValueChange={(value) => setContentType(value)} defaultValue={contentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type de contenu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="blogPost">Article de blog</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="tutorial">Tutoriel</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => setTone(value)} defaultValue={tone}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ton" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professionnel</SelectItem>
                <SelectItem value="casual">Décontracté</SelectItem>
                <SelectItem value="persuasive">Persuasif</SelectItem>
                <SelectItem value="informative">Informatif</SelectItem>
              </SelectContent>
            </Select>
            
            <Input 
              placeholder="Audience cible (ex: débutants, experts)" 
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="content-length">Longueur du contenu:</Label>
            <Slider
              id="content-length"
              defaultValue={[contentLength]}
              max={2000}
              step={100}
              onValueChange={(value) => setContentLength(value[0])}
            />
            <span>{contentLength} mots</span>
          </div>
          
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleGenerateContent}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Générer le contenu
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="content" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Contenu
          </TabsTrigger>
          <TabsTrigger value="ideas">
            <Lightbulb className="h-4 w-4 mr-2" />
            Idées
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            <CheckCircle className="h-4 w-4 mr-2" />
            Optimisations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Éditeur de Contenu</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfessionalEditor 
                value={editorContent}
                onChange={setEditorContent}
                placeholder="Collez votre contenu ici ou modifiez le contenu généré..."
                height="300px"
              />
              
              <div className="flex justify-between mt-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleAnalyzeContent}
                >
                  <ListChecks className="mr-2 h-4 w-4" />
                  Analyser le contenu
                </Button>
                
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    navigator.clipboard.writeText(editorContent);
                    toast.success("Contenu copié dans le presse-papier");
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copier le contenu
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {analysisResults.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Analyse du contenu (IA)</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {analysisResults.map((result, index) => (
                      <div key={index} className="p-3 rounded-md border border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {result.type === 'erreur' && <AlertCircle className="text-red-500 h-4 w-4" />}
                            {result.type === 'amélioration' && <Info className="text-blue-500 h-4 w-4" />}
                            {result.type === 'optimisation' && <CheckCircle className="text-green-500 h-4 w-4" />}
                            <span className="font-medium">{result.type.charAt(0).toUpperCase() + result.type.slice(1)}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopySuggestion(result.message, index)}
                          >
                            {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-700">{result.message}</p>
                        <Badge variant="secondary" className="mt-2">{result.priorité}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="ideas">
          <Card>
            <CardHeader>
              <CardTitle>Idées de contenu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleGenerateIdeas}
                  disabled={isGeneratingIdeas}
                >
                  {isGeneratingIdeas ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Générer des idées
                    </>
                  )}
                </Button>
              </div>
              
              {contentIdeas.length > 0 ? (
                <ul className="list-disc pl-5">
                  {contentIdeas.map((idea, index) => (
                    <li key={index} className="mb-2">
                      <h3 className="font-semibold">{idea.title}</h3>
                      <p className="text-sm text-gray-500">{idea.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-500">
                  {keyword ? "Cliquez sur 'Générer des idées' pour obtenir des suggestions de contenu basées sur votre mot-clé." : "Entrez un mot-clé ci-dessus pour générer des idées de contenu."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suggestions">
          <Card>
            <CardHeader>
              <CardTitle>Optimisations SEO</CardTitle>
            </CardHeader>
            <CardContent>
              {metaSuggestions ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-3">Image mise en avant</h3>
                    <div className="aspect-video rounded-md overflow-hidden bg-gray-100 mb-3">
                      <img 
                        src={metaSuggestions.imageUrl} 
                        alt={`Image pour ${keyword}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <Image className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Balises meta</h3>
                      <div className={`font-bold text-lg ${getSeoScoreColor(metaSuggestions.seoScore)}`}>
                        {metaSuggestions.seoScore}/100
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium text-gray-700">Titre (60 caractères max)</label>
                          <span className="text-xs text-gray-500">{metaSuggestions.title.length}/60</span>
                        </div>
                        <div className="flex">
                          <Input value={metaSuggestions.title} readOnly className="flex-1" />
                          <Button variant="ghost" size="sm" onClick={handleCopyMetaTitle}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium text-gray-700">Description (155 caractères max)</label>
                          <span className="text-xs text-gray-500">{metaSuggestions.description.length}/155</span>
                        </div>
                        <div className="flex">
                          <Textarea value={metaSuggestions.description} readOnly className="flex-1 min-h-[80px]" />
                          <Button variant="ghost" size="sm" className="self-start" onClick={handleCopyMetaDescription}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2">Recommandations SEO</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-blue-700">
                        <CheckCircle className="h-4 w-4 mt-1 text-blue-500" />
                        <span>Utilisez le mot-clé "{keyword}" dans le premier paragraphe</span>
                      </li>
                      <li className="flex items-start gap-2 text-blue-700">
                        <CheckCircle className="h-4 w-4 mt-1 text-blue-500" />
                        <span>Ajoutez des sous-titres H2 et H3 contenant des variantes du mot-clé</span>
                      </li>
                      <li className="flex items-start gap-2 text-blue-700">
                        <CheckCircle className="h-4 w-4 mt-1 text-blue-500" />
                        <span>Incluez au moins 3 liens internes vers d'autres articles pertinents</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {keyword ? 
                    "Cliquez sur 'Générer le contenu' pour obtenir des suggestions de balises meta et d'optimisations SEO." : 
                    "Entrez un mot-clé et générez du contenu pour obtenir des suggestions d'optimisation SEO."
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GenerateurContenuSEO;
