
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, FileText, Copy, Check } from 'lucide-react';
import { toast } from "sonner";
import { generateSeoDescription } from '@/utils/seo/generators/descriptionGenerator';
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

  const handleGenerate = async () => {
    if (!selectedKeyword.trim()) {
      toast.error("Veuillez saisir un mot-clé principal");
      return;
    }

    setIsGenerating(true);
    toast.loading("Génération de contenu en cours...");

    try {
      // Générer le titre (60 caractères maximum)
      const generatedTitle = generateSeoTitle(selectedKeyword);
      setTitle(generatedTitle);

      // Générer la méta description (152-155 caractères)
      const generatedDescription = generateSeoDescription(selectedKeyword);
      // Ensure it's between 152-155 characters
      const trimmedDescription = generatedDescription.length > 155 
        ? generatedDescription.substring(0, 152) + '...'
        : generatedDescription;
      setMetaDescription(trimmedDescription);

      // Générer le contenu de l'article (800 mots)
      const generatedContent = generateContentWithWordCount(selectedKeyword, wordCount);
      setContent(generatedContent.intro + '\n\n' + generatedContent.sections.map(section => 
        `## ${section.heading}\n\n${section.content}`
      ).join('\n\n'));

      toast.success("Contenu généré avec succès!");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Une erreur est survenue lors de la génération du contenu");
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
