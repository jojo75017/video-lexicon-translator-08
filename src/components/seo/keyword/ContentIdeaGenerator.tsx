
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Lightbulb, Loader2, BookOpen, Users, Target } from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from '../../../utils/seo/openaiService';

interface ContentIdea {
  title: string;
  type: string;
  targetKeywords: string[];
  wordCount: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  priority: 'Élevée' | 'Moyenne' | 'Faible';
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
        const aiIdeas = await openAIService.generateContentIdeas(keyword);
        
        const ideas: ContentIdea[] = aiIdeas.map((idea, index) => ({
          title: idea,
          type: ['Article de blog', 'Guide', 'Tutoriel', 'Comparatif', 'Liste'][index % 5],
          targetKeywords: [keyword, `${keyword} ${2024}`, `meilleur ${keyword}`],
          wordCount: Math.floor(Math.random() * 2000) + 800,
          difficulty: ['Facile', 'Moyen', 'Difficile'][Math.floor(Math.random() * 3)] as 'Facile' | 'Moyen' | 'Difficile',
          priority: ['Élevée', 'Moyenne', 'Faible'][Math.floor(Math.random() * 3)] as 'Élevée' | 'Moyenne' | 'Faible'
        }));
        
        setContentIdeas(ideas);
        toast.success('Idées de contenu générées avec l\'IA !');
      } else {
        // Génération basique sans IA
        const basicIdeas: ContentIdea[] = [
          {
            title: `Guide complet sur ${keyword}`,
            type: 'Guide',
            targetKeywords: [keyword, `guide ${keyword}`, `tutoriel ${keyword}`],
            wordCount: 1500,
            difficulty: 'Moyen',
            priority: 'Élevée'
          },
          {
            title: `Les 10 meilleures pratiques pour ${keyword}`,
            type: 'Liste',
            targetKeywords: [`meilleures pratiques ${keyword}`, `conseils ${keyword}`],
            wordCount: 1200,
            difficulty: 'Facile',
            priority: 'Élevée'
          },
          {
            title: `Comment choisir ${keyword} en 2024`,
            type: 'Article de blog',
            targetKeywords: [`choisir ${keyword}`, `${keyword} 2024`],
            wordCount: 1000,
            difficulty: 'Facile',
            priority: 'Moyenne'
          }
        ];
        
        setContentIdeas(basicIdeas);
        toast.info('Idées de base générées (configurez OpenAI pour plus d\'options)');
      }
    } catch (error) {
      toast.error('Erreur lors de la génération des idées');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Élevée': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'Faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Générateur d'Idées de Contenu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Mot-clé pour générer des idées..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentIdeas.map((idea, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex gap-1">
                    <Badge className={getPriorityColor(idea.priority)} variant="secondary">
                      {idea.priority}
                    </Badge>
                    <Badge className={getDifficultyColor(idea.difficulty)} variant="secondary">
                      {idea.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {idea.title}
                </h3>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>{idea.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{idea.wordCount} mots</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Mots-clés cibles:</p>
                  <div className="flex flex-wrap gap-1">
                    {idea.targetKeywords.slice(0, 2).map((kw, i) => (
                      <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentIdeaGenerator;
