
import React, { useState } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilePenLine, FileText, RefreshCw, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { generateContentWithWordCount } from '@/utils/seo/contentGenerator';

const AiWriterPage = () => {
  const [keyword, setKeyword] = useState('');
  const [contentType, setContentType] = useState('article');
  const [tone, setTone] = useState('professional');
  const [wordCount, setWordCount] = useState(500);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    toast.info("Génération du contenu en cours...");

    // Utiliser le nouveau générateur de contenu intelligent
    setTimeout(() => {
      const generatedData = generateContentWithWordCount(keyword, wordCount);
      
      // Formater le contenu en Markdown
      let formattedContent = `# ${generatedData.title}\n\n`;
      formattedContent += `## Introduction\n\n${generatedData.intro}\n\n`;
      
      generatedData.sections.forEach((section, index) => {
        formattedContent += `## ${section.heading}\n\n${section.content}\n\n`;
      });

      setGeneratedContent(formattedContent);
      setIsGenerating(false);
      toast.success("Contenu généré avec succès !");
    }, 1500);
  };

  const copyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Contenu copié dans le presse-papier");
  };

  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FilePenLine className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">Rédacteur IA 2.0</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Créez du contenu de qualité avec l'aide de l'intelligence artificielle.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Mot-clé principal (ex: SEO, marketing digital, référencement)" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Select onValueChange={(value) => setContentType(value)} defaultValue={contentType}>
                <SelectTrigger>
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
                <SelectTrigger>
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
                type="number"
                placeholder="Nombre de mots" 
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                min="100"
                max="2000"
              />
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

            {generatedContent && (
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Contenu généré</h3>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={copyContent}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copier
                  </Button>
                </div>
                <Textarea 
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Le contenu généré apparaîtra ici..."
                />
              </Card>
            )}
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default AiWriterPage;
