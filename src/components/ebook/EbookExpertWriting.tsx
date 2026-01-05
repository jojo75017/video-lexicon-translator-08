import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, PenTool, Copy, CheckCircle, BookOpen, Target, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Section {
  titre: string;
  contenu: string;
  exemple?: string;
}

interface ExpertWritingResult {
  introduction?: string;
  sections?: Section[];
  synthese?: string;
  actionConcrete?: string;
  contenuComplet?: string;
}

const EbookExpertWriting = () => {
  const [chapterTitle, setChapterTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ExpertWritingResult | null>(null);

  const generateContent = async () => {
    if (!chapterTitle.trim()) {
      toast.error("Veuillez entrer un titre de chapitre");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('expert-writing', {
        body: { 
          chapterTitle,
          chapterContext: `Générer automatiquement un chapitre complet et professionnel sur "${chapterTitle}"`,
          targetAudience: 'Grand public intéressé par le sujet',
          expertise: chapterTitle
        }
      });

      if (error) throw error;
      setResult(data);
      toast.success("Chapitre généré avec expertise !");
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié !");
  };

  const getFullContent = () => {
    if (!result) return '';
    
    let content = '';
    if (result.introduction) {
      content += result.introduction + '\n\n';
    }
    if (result.sections) {
      result.sections.forEach(section => {
        content += `## ${section.titre}\n\n${section.contenu}\n\n`;
        if (section.exemple) {
          content += `**Exemple :** ${section.exemple}\n\n`;
        }
      });
    }
    if (result.synthese) {
      content += `## Synthèse\n\n${result.synthese}\n\n`;
    }
    if (result.actionConcrete) {
      content += `## Action concrète\n\n${result.actionConcrete}`;
    }
    return content || result.contenuComplet || '';
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            Rédaction Experte
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Entrez juste le titre du chapitre - tout le reste est généré automatiquement
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chapter-title">Titre du chapitre *</Label>
            <Input
              id="chapter-title"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="Ex: Les fondamentaux de la productivité"
              onKeyDown={(e) => e.key === 'Enter' && generateContent()}
            />
          </div>

          <Button 
            onClick={generateContent} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rédaction en cours...
              </>
            ) : (
              <>
                <PenTool className="mr-2 h-4 w-4" />
                Générer le chapitre complet
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.introduction && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.introduction}</p>
              </CardContent>
            </Card>
          )}

          {result.sections && result.sections.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.sections.map((section, index) => (
                  <div key={index} className="border-l-2 border-primary/30 pl-4 space-y-2">
                    <h4 className="font-semibold">{section.titre}</h4>
                    <p className="text-sm text-muted-foreground">{section.contenu}</p>
                    {section.exemple && (
                      <div className="bg-muted/50 p-3 rounded-md">
                        <Badge variant="outline" className="mb-2">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          Exemple
                        </Badge>
                        <p className="text-sm">{section.exemple}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(result.synthese || result.actionConcrete) && (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  Conclusion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.synthese && (
                  <div>
                    <Badge className="mb-2">Synthèse</Badge>
                    <p className="text-muted-foreground">{result.synthese}</p>
                  </div>
                )}
                {result.actionConcrete && (
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Action concrète
                    </Badge>
                    <p className="text-muted-foreground">{result.actionConcrete}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={() => copyToClipboard(getFullContent())}
            variant="outline"
            className="w-full"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copier tout le contenu
          </Button>
        </div>
      )}
    </div>
  );
};

export default EbookExpertWriting;
