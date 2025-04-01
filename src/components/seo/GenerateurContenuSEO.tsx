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
  ListChecks
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { analyzeContentWithAI } from '@/utils/seo/aiContentAnalyzer';
import ProfessionalEditor from './content/ProfessionalEditor';

interface ContentIdea {
  title: string;
  description: string;
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
  
  useEffect(() => {
    if (editorContent) {
      analyzeEditorContent(editorContent);
    }
  }, [editorContent]);
  
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
      setIsGenerating(false);
      toast.success("Contenu généré avec succès");
    }, 2000);
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
            <Select onValueChange={(value) => setContentType(value)}>
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
            
            <Select onValueChange={(value) => setTone(value)}>
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
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
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
      
      {analysisResults.length > 0 && (
        <Card>
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
    </div>
  );
};

export default GenerateurContenuSEO;
