
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Lightbulb, Loader2, BookOpen, List, 
  MessageSquare, Clock, Hash, CheckCircle 
} from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from '../../../utils/seo/openaiService';

interface BlogOutline {
  title: string;
  introduction: string;
  sections: Array<{ 
    heading: string; 
    subpoints: string[]; 
    wordCount: number;
  }>;
  conclusion: string;
  faq: Array<{ 
    question: string; 
    answer: string;
  }>;
  estimatedWordCount: number;
}

const BlogOutlineGenerator = () => {
  const [keyword, setKeyword] = useState('');
  const [outline, setOutline] = useState<BlogOutline | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey] = useState(() => localStorage.getItem('openaiKey') || '');

  const generateOutline = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé (3 mots recommandés)');
      return;
    }

    const wordCount = keyword.trim().split(' ').length;
    if (wordCount < 2) {
      toast.error('Veuillez entrer au moins 2 mots pour un meilleur résultat');
      return;
    }

    if (!apiKey) {
      toast.error('Veuillez configurer votre clé API OpenAI d\'abord');
      return;
    }

    setIsGenerating(true);
    try {
      const blogOutline = await OpenAIService.generateBlogOutline(keyword, [], apiKey);
      
      setOutline(blogOutline);
      toast.success('Plan d\'article généré avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la génération du plan');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers !');
  };

  const exportOutline = () => {
    if (!outline) return;
    
    let exportText = `# ${outline.title}\n\n`;
    exportText += `## Introduction\n${outline.introduction}\n\n`;
    
    outline.sections.forEach((section, index) => {
      exportText += `## ${index + 1}. ${section.heading}\n`;
      section.subpoints.forEach(point => {
        exportText += `- ${point}\n`;
      });
      exportText += `*Estimation : ${section.wordCount} mots*\n\n`;
    });
    
    exportText += `## Conclusion\n${outline.conclusion}\n\n`;
    
    exportText += `## FAQ\n`;
    outline.faq.forEach((item, index) => {
      exportText += `### ${index + 1}. ${item.question}\n${item.answer}\n\n`;
    });
    
    exportText += `---\n*Estimation totale : ${outline.estimatedWordCount} mots*`;
    
    copyToClipboard(exportText);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Générateur de Plan d'Article de Blog
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              💡 Conseils pour de meilleurs résultats
            </h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Utilisez 2-4 mots pour votre mot-clé (ex: "marketing digital efficace")</li>
              <li>• Soyez spécifique (ex: "recettes végétariennes rapides" plutôt que "cuisine")</li>
              <li>• L'IA générera un plan SEO optimisé avec structure H2/H3</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ex: marketing digital efficace, recettes végétariennes rapides..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateOutline()}
              className="flex-1"
            />
            <Button
              onClick={generateOutline}
              disabled={isGenerating || !keyword.trim()}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lightbulb className="h-4 w-4 mr-2" />
              )}
              Générer le Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {outline && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Plan d'Article Généré</h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {outline.estimatedWordCount} mots
              </Badge>
              <Button variant="outline" size="sm" onClick={exportOutline}>
                Copier le Plan
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-green-600" />
                Titre Principal (H1)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-lg cursor-pointer hover:bg-gray-50 p-2 rounded" 
                 onClick={() => copyToClipboard(outline.title)}>
                {outline.title}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded"
                 onClick={() => copyToClipboard(outline.introduction)}>
                {outline.introduction}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-purple-600" />
                Structure du Contenu ({outline.sections.length} sections)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {outline.sections.map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                        onClick={() => copyToClipboard(section.heading)}>
                      {index + 1}. {section.heading}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      ~{section.wordCount} mots
                    </Badge>
                  </div>
                  <ul className="space-y-1 ml-4">
                    {section.subpoints.map((point, pointIndex) => (
                      <li key={pointIndex} className="text-sm text-gray-600 flex items-start gap-2 cursor-pointer hover:text-gray-800"
                          onClick={() => copyToClipboard(point)}>
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                Section FAQ ({outline.faq.length} questions)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {outline.faq.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                  <h4 className="font-medium text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                      onClick={() => copyToClipboard(item.question)}>
                    Q{index + 1}: {item.question}
                  </h4>
                  <p className="text-sm text-gray-600 cursor-pointer hover:text-gray-800"
                     onClick={() => copyToClipboard(item.answer)}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Conclusion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded"
                 onClick={() => copyToClipboard(outline.conclusion)}>
                {outline.conclusion}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {!apiKey && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <Lightbulb className="h-5 w-5" />
              <p>
                <strong>Configuration requise :</strong> Allez dans l'onglet "API Config" pour configurer votre clé OpenAI et débloquer cette fonctionnalité.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogOutlineGenerator;
