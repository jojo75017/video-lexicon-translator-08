
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, FileText, Copy, Check, KeyRound } from 'lucide-react';
import { toast } from "sonner";
import { generateAIDescriptions } from '@/utils/seo/generators/description/generator';
import { generateSeoTitle } from '@/utils/seo/generators/titleGenerator';
import { generateContentWithWordCount } from '@/utils/seo/contentGenerator';
import { KeywordSuggestion } from '@/types/seo';

interface BlogContentGeneratorProps {
  keyword?: string;
  keywordsList?: KeywordSuggestion[];
}

const BlogContentGenerator: React.FC<BlogContentGeneratorProps> = ({ keyword = '', keywordsList = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState(keyword);
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(800);
  const [titleCopied, setTitleCopied] = useState(false);
  const [descriptionCopied, setDescriptionCopied] = useState(false);
  const [contentCopied, setContentCopied] = useState(false);
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [useAI, setUseAI] = useState(false);

  // Check if API key exists in localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openaiKey');
    if (savedKey) {
      setOpenaiKey(savedKey);
      setUseAI(true);
    }
  }, []);

  const handleGenerate = async () => {
    if (!selectedKeyword.trim()) {
      toast.error("Veuillez saisir un mot-clé principal");
      return;
    }

    setIsGenerating(true);
    toast.loading("Génération de contenu en cours...", { id: "content-generation" });

    try {
      // Générer le titre (60 caractères maximum)
      const generatedTitle = generateSeoTitle(selectedKeyword);
      setTitle(generatedTitle);

      // Générer la méta description (152-155 caractères)
      let generatedDescription;
      
      if (useAI && openaiKey) {
        // Utiliser l'API pour générer la description
        const aiDescriptions = await generateAIDescriptions(selectedKeyword, openaiKey);
        generatedDescription = aiDescriptions.short;
      } else {
        // Utiliser le générateur local
        generatedDescription = generateSeoTitle(selectedKeyword);
      }
      
      // Ensure it's between 152-155 characters
      const trimmedDescription = generatedDescription.length > 155 
        ? generatedDescription.substring(0, 152) + '...'
        : generatedDescription;
      setMetaDescription(trimmedDescription);

      // Générer le contenu de l'article
      let generatedContentText = "";
      
      if (useAI && openaiKey) {
        // Utiliser l'API OpenAI pour générer le contenu
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: "Tu es un expert en rédaction de contenu pour le voyage et le tourisme. Ton objectif est de créer du contenu SEO optimisé, informatif et engageant."
                },
                {
                  role: "user",
                  content: `Rédige un article de blog complet de ${wordCount} mots sur le sujet "${selectedKeyword}". 
                  L'article doit être structuré avec une introduction, plusieurs sections avec des sous-titres, et une conclusion.
                  Concentre-toi sur des informations utiles pour les voyageurs, avec des conseils pratiques, des recommandations d'activités, et des descriptions évocatrices.
                  Adopte un ton conversationnel et expert. Format: Markdown.`
                }
              ],
              temperature: 0.7,
              max_tokens: 2500
            })
          });
          
          const data = await response.json();
          
          if (data.choices && data.choices[0] && data.choices[0].message) {
            generatedContentText = data.choices[0].message.content;
          } else {
            throw new Error("Format de réponse OpenAI invalide");
          }
        } catch (apiError) {
          console.error("Erreur API OpenAI:", apiError);
          // Fallback au générateur local
          const generatedContent = generateContentWithWordCount(selectedKeyword, wordCount);
          generatedContentText = generatedContent.intro + '\n\n' + generatedContent.sections.map(section => 
            `## ${section.heading}\n\n${section.content}`
          ).join('\n\n');
        }
      } else {
        // Utiliser le générateur local
        const generatedContent = generateContentWithWordCount(selectedKeyword, wordCount);
        generatedContentText = generatedContent.intro + '\n\n' + generatedContent.sections.map(section => 
          `## ${section.heading}\n\n${section.content}`
        ).join('\n\n');
      }
      
      setContent(generatedContentText);
      toast.success("Contenu généré avec succès!", { id: "content-generation" });
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Une erreur est survenue lors de la génération du contenu", { id: "content-generation" });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: 'title' | 'description' | 'content') => {
    navigator.clipboard.writeText(text);
    
    if (type === 'title') {
      setTitleCopied(true);
      setTimeout(() => setTitleCopied(false), 2000);
    } else if (type === 'description') {
      setDescriptionCopied(true);
      setTimeout(() => setDescriptionCopied(false), 2000);
    } else {
      setContentCopied(true);
      setTimeout(() => setContentCopied(false), 2000);
    }
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} copié dans le presse-papiers`);
  };
  
  const handleSaveApiKey = () => {
    if (openaiKey) {
      localStorage.setItem('openaiKey', openaiKey);
      setUseAI(true);
      toast.success("Clé API sauvegardée", { 
        description: "Votre clé API OpenAI sera utilisée pour générer du contenu de meilleure qualité" 
      });
    } else {
      setUseAI(false);
      localStorage.removeItem('openaiKey');
      toast.info("Mode de génération standard activé");
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Contenu
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Générateur d'Articles de Blog SEO</DialogTitle>
            <DialogDescription>
              Générez un article de blog optimisé SEO avec un titre (60 caractères), une méta description (152-155 caractères) et un contenu de 800 mots.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Configuration OpenAI API */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Configuration API OpenAI
                </h3>
                
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="Entrez votre clé API OpenAI (sk-...)"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleSaveApiKey}>
                    Sauvegarder
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500">
                  {useAI 
                    ? "✅ Mode avancé: Le contenu sera généré avec l'API OpenAI pour une qualité supérieure" 
                    : "Mode standard: Le contenu sera généré localement avec des modèles pré-établis"}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <label htmlFor="keyword" className="text-sm font-medium">
                Mot-clé principal
              </label>
              {keywordsList && keywordsList.length > 0 ? (
                <select 
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  value={selectedKeyword}
                  onChange={(e) => setSelectedKeyword(e.target.value)}
                >
                  <option value="">-- Sélectionner un mot-clé --</option>
                  {keywordsList.map((kw, i) => (
                    <option key={i} value={kw.keyword}>
                      {kw.keyword}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id="keyword"
                  placeholder="Entrez votre mot-clé principal"
                  value={selectedKeyword}
                  onChange={(e) => setSelectedKeyword(e.target.value)}
                />
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="wordCount" className="text-sm font-medium">
                Nombre de mots
              </label>
              <Input
                id="wordCount"
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                min={300}
                max={2000}
              />
            </div>

            <Button 
              onClick={handleGenerate}
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                "Générer le contenu"
              )}
            </Button>

            {(title || metaDescription || content) && (
              <div className="pt-4 space-y-6 border-t">
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Titre ({title.length}/60 caractères)</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(title, 'title')}
                      >
                        {titleCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      {title}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Meta Description ({metaDescription.length}/155 caractères)</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(metaDescription, 'description')}
                      >
                        {descriptionCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      {metaDescription}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Contenu ({wordCount} mots)</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(content, 'content')}
                      >
                        {contentCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Textarea
                      className="min-h-[300px] bg-gray-50 font-mono"
                      value={content}
                      readOnly
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogContentGenerator;
