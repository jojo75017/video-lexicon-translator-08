import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const WordCountPage: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeContent = () => {
    if (!content.trim()) {
      toast.error('Veuillez entrer du contenu à analyser');
      return;
    }

    setIsLoading(true);

    // Simulation d'analyse
    setTimeout(() => {
      const words = content.trim().split(/\s+/).length;
      const characters = content.length;
      const charactersNoSpaces = content.replace(/\s/g, '').length;
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

      const analysisResult = {
        words,
        characters,
        charactersNoSpaces,
        sentences,
        paragraphs,
        readingTime: Math.ceil(words / 200),
        density: words / Math.max(sentences, 1),
        recommendations: [
          {
            type: words < 300 ? 'warning' : 'success',
            message: words < 300 ? 'Contenu trop court pour un bon SEO (minimum 300 mots recommandés)' : 'Longueur de contenu appropriée pour le SEO'
          },
          {
            type: sentences > 0 && (words / sentences) > 20 ? 'warning' : 'success',
            message: sentences > 0 && (words / sentences) > 20 ? 'Phrases trop longues (réduire à moins de 20 mots par phrase)' : 'Longueur des phrases appropriée'
          },
          {
            type: paragraphs < 3 ? 'warning' : 'success',
            message: paragraphs < 3 ? 'Ajoutez plus de paragraphes pour améliorer la lisibilité' : 'Structure en paragraphes bien organisée'
          }
        ]
      };

      setAnalysis(analysisResult);
      setIsLoading(false);
      toast.success('Analyse terminée !');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            📝 Audit Contenu
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analyse de Contenu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">URL de la page (optionnel)</label>
                <Input
                  placeholder="https://exemple.com/page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Contenu à analyser</label>
                <Textarea
                  placeholder="Collez votre contenu ici pour analyse..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="min-h-[200px]"
                />
              </div>

              <Button onClick={analyzeContent} disabled={isLoading} className="w-full">
                {isLoading ? 'Analyse en cours...' : 'Analyser le contenu'}
              </Button>
            </CardContent>
          </Card>

          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Résultats de l'analyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analysis.words}</div>
                      <div className="text-sm text-gray-600">Mots</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analysis.readingTime}</div>
                      <div className="text-sm text-gray-600">Min. lecture</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{analysis.sentences}</div>
                      <div className="text-sm text-gray-600">Phrases</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{analysis.paragraphs}</div>
                      <div className="text-sm text-gray-600">Paragraphes</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Recommandations SEO</h4>
                    {analysis.recommendations.map((rec: any, index: number) => (
                      <div key={index} className={`flex items-start gap-2 p-3 rounded-lg ${
                        rec.type === 'success' ? 'bg-green-50' : 'bg-yellow-50'
                      }`}>
                        {rec.type === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        )}
                        <span className="text-sm">{rec.message}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Caractères: {analysis.characters}</div>
                      <div>Caractères (sans espaces): {analysis.charactersNoSpaces}</div>
                      <div>Mots par phrase (moyenne): {Math.round(analysis.density)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordCountPage;