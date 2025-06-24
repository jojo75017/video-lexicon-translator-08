
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Copy, Loader2, Lightbulb, BookOpen, Video, Image } from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from '../../../utils/seo/openaiService';

interface ContentIdea {
  title: string;
  type: string;
  difficulty: number;
  estimatedWords: number;
  targetKeywords: string[];
  contentFormat: string;
}

const ContentIdeaGenerator = () => {
  const [keyword, setKeyword] = useState('');
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey] = useState(() => localStorage.getItem('openaiKey') || '');

  const generateContentIdeas = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsGenerating(true);
    try {
      if (apiKey) {
        const openAIService = new OpenAIService(apiKey);
        const ideas = await openAIService.generateContentIdeas(keyword);
        
        const contentData: ContentIdea[] = ideas.map(idea => ({
          title: idea,
          type: getContentType(idea),
          difficulty: Math.floor(Math.random() * 80) + 20,
          estimatedWords: getEstimatedWords(idea),
          targetKeywords: generateTargetKeywords(keyword, idea),
          contentFormat: getContentFormat(idea)
        }));

        setContentIdeas(contentData);
        toast.success('Idées de contenu générées !');
      } else {
        generateBasicContentIdeas();
        toast.info('Idées basiques générées');
      }
    } catch (error) {
      toast.error('Erreur lors de la génération des idées');
    } finally {
      setIsGenerating(false);
    }
  };

  const getContentType = (title: string): string => {
    if (title.toLowerCase().includes('guide')) return 'Guide complet';
    if (title.toLowerCase().includes('top') || title.toLowerCase().includes('meilleur')) return 'Liste';
    if (title.toLowerCase().includes('vs') || title.toLowerCase().includes('comparatif')) return 'Comparatif';
    if (title.toLowerCase().includes('comment')) return 'Tutoriel';
    if (title.toLowerCase().includes('avis')) return 'Review';
    return 'Article informatif';
  };

  const getEstimatedWords = (title: string): number => {
    if (title.toLowerCase().includes('guide')) return Math.floor(Math.random() * 2000) + 2000;
    if (title.toLowerCase().includes('top')) return Math.floor(Math.random() * 1000) + 1500;
    if (title.toLowerCase().includes('comment')) return Math.floor(Math.random() * 1200) + 800;
    return Math.floor(Math.random() * 800) + 600;
  };

  const generateTargetKeywords = (mainKeyword: string, title: string): string[] => {
    const keywords = [mainKeyword];
    
    if (title.toLowerCase().includes('guide')) {
      keywords.push(`guide ${mainKeyword}`, `${mainKeyword} débutant`);
    }
    if (title.toLowerCase().includes('meilleur')) {
      keywords.push(`meilleur ${mainKeyword}`, `top ${mainKeyword}`);
    }
    if (title.toLowerCase().includes('comment')) {
      keywords.push(`comment ${mainKeyword}`, `${mainKeyword} tutoriel`);
    }
    
    return keywords.slice(0, 3);
  };

  const getContentFormat = (title: string): string => {
    if (title.toLowerCase().includes('vidéo') || title.toLowerCase().includes('tutoriel')) return 'Vidéo + Article';
    if (title.toLowerCase().includes('infographie')) return 'Infographie';
    if (title.toLowerCase().includes('liste') || title.toLowerCase().includes('top')) return 'Liste numérotée';
    return 'Article long';
  };

  const generateBasicContentIdeas = () => {
    const ideaTemplates = [
      `Guide complet du ${keyword}`,
      `Top 10 ${keyword} en 2024`,
      `Comment choisir son ${keyword}`,
      `${keyword} : avantages et inconvénients`,
      `Comparatif ${keyword} vs alternatives`,
      `${keyword} pour débutants`,
      `Erreurs à éviter avec ${keyword}`,
      `${keyword} : tendances 2024`,
      `ROI du ${keyword}`,
      `Cas d'usage ${keyword}`
    ];

    const contentData: ContentIdea[] = ideaTemplates.map(idea => ({
      title: idea,
      type: getContentType(idea),
      difficulty: Math.floor(Math.random() * 70) + 15,
      estimatedWords: getEstimatedWords(idea),
      targetKeywords: generateTargetKeywords(keyword, idea),
      contentFormat: getContentFormat(idea)
    }));

    setContentIdeas(contentData);
  };

  const copyIdea = (idea: string) => {
    navigator.clipboard.writeText(idea);
    toast.success('Idée copiée !');
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Guide complet': 'bg-blue-100 text-blue-800',
      'Liste': 'bg-purple-100 text-purple-800',
      'Comparatif': 'bg-orange-100 text-orange-800',
      'Tutoriel': 'bg-green-100 text-green-800',
      'Review': 'bg-pink-100 text-pink-800',
      'Article informatif': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getFormatIcon = (format: string) => {
    if (format.includes('Vidéo')) return <Video className="h-4 w-4" />;
    if (format.includes('Infographie')) return <Image className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-600" />
            Générateur d'Idées de Contenu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Mot-clé pour générer du contenu..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateContentIdeas()}
              className="flex-1"
            />
            <Button
              onClick={generateContentIdeas}
              disabled={isGenerating || !keyword.trim()}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lightbulb className="h-4 w-4 mr-2" />
              )}
              Générer
            </Button>
          </div>
        </CardContent>
      </Card>

      {contentIdeas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Idées de contenu SEO ({contentIdeas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentIdeas.map((idea, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg flex-1 pr-4">
                      {idea.title}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyIdea(idea.title)}
                      className="hover:bg-blue-50"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-3">
                    <Badge className={getTypeColor(idea.type)}>
                      {idea.type}
                    </Badge>
                    <Badge className={getDifficultyColor(idea.difficulty)}>
                      Difficulté: {idea.difficulty}/100
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getFormatIcon(idea.contentFormat)}
                      {idea.contentFormat}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mots estimés:</span>
                      <span className="font-semibold ml-2">{idea.estimatedWords.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Mots-clés cibles:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {idea.targetKeywords.map((kw, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentIdeaGenerator;
