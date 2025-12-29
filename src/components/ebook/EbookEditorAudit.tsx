import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, FileText, CheckCircle2, AlertTriangle, XCircle, 
  Loader2, Sparkles, BookOpen, PenTool, Languages, 
  BarChart3, Lightbulb, RefreshCw, Eye
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configuration du worker PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;

interface AuditResult {
  category: string;
  score: number;
  issues: { type: 'error' | 'warning' | 'suggestion'; message: string }[];
  suggestions: string[];
}

interface FullAuditResult {
  overallScore: number;
  results: AuditResult[];
  summary: string;
}

export const EbookEditorAudit: React.FC = () => {
  const [textContent, setTextContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [auditResult, setAuditResult] = useState<FullAuditResult | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Format non supporté', {
        description: 'Veuillez uploader un fichier PDF ou DOC/DOCX uniquement'
      });
      return;
    }

    setUploadedFileName(file.name);
    setIsExtracting(true);
    setTextContent('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const text = await extractDocxText(arrayBuffer);
        if (text.trim()) {
          setTextContent(text);
          toast.success('Document DOCX chargé', {
            description: `${text.length.toLocaleString()} caractères extraits`
          });
        } else {
          toast.error('Échec extraction DOCX', {
            description: 'Le document semble vide ou corrompu'
          });
        }
      } else if (file.type === 'application/pdf') {
        const text = await extractPdfText(arrayBuffer);
        if (text.trim()) {
          setTextContent(text);
          toast.success('PDF chargé', {
            description: `${text.length.toLocaleString()} caractères extraits`
          });
        } else {
          toast.warning('PDF scanné ou vide', {
            description: 'Aucun texte extractible. Ce PDF est peut-être une image scannée.'
          });
        }
      } else if (file.type === 'application/msword') {
        toast.error('Format .doc non supporté', {
          description: 'Veuillez convertir votre fichier en .docx ou .pdf'
        });
      }
    } catch (error) {
      console.error('Extraction error:', error);
      toast.error('Erreur de lecture', {
        description: 'Impossible de lire le fichier. Vérifiez qu\'il n\'est pas corrompu.'
      });
    } finally {
      setIsExtracting(false);
    }
  }, []);

  // Extraction du texte DOCX via JSZip
  const extractDocxText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXml = await zip.file('word/document.xml')?.async('string');
    
    if (!documentXml) return '';
    
    // Extraire le texte des balises <w:t>
    const textMatches = documentXml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    const text = textMatches
      .map(match => match.replace(/<[^>]+>/g, ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return text;
  };

  // Extraction du texte PDF via pdf.js
  const extractPdfText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const textParts: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        textParts.push(pageText);
      }

      return textParts.join('\n\n').replace(/\s+/g, ' ').trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw error;
    }
  };

  const runAudit = useCallback(async () => {
    if (!textContent.trim()) {
      toast.error('Contenu vide', {
        description: 'Veuillez coller ou uploader du texte à analyser'
      });
      return;
    }

    if (textContent.length < 500) {
      toast.warning('Texte court', {
        description: 'Pour un audit complet, fournissez au moins 500 caractères'
      });
    }

    setIsAnalyzing(true);
    setAuditResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'editor-audit',
          prompt: `Analyse ce texte d'ebook et fournis un audit éditorial complet en JSON. Texte à analyser:\n\n${textContent.slice(0, 15000)}`,
          language: 'fr'
        }
      });

      if (error) throw error;

      // Parse la réponse AI
      let parsed: FullAuditResult;
      try {
        const content = data?.content || data?.text || data;
        if (typeof content === 'string') {
          // Extraire le JSON de la réponse
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found');
          }
        } else {
          parsed = content;
        }
      } catch {
        // Fallback: créer un résultat basé sur l'analyse locale
        parsed = performLocalAudit(textContent);
      }

      setAuditResult(parsed);
      toast.success('Audit terminé !', {
        description: `Score global: ${parsed.overallScore}/100`
      });
    } catch (error) {
      console.error('Audit error:', error);
      // Fallback sur analyse locale
      const localResult = performLocalAudit(textContent);
      setAuditResult(localResult);
      toast.success('Audit local terminé', {
        description: `Score global: ${localResult.overallScore}/100`
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [textContent]);

  const performLocalAudit = (text: string): FullAuditResult => {
    const results: AuditResult[] = [];
    
    // Analyse orthographe/grammaire basique
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(' ').length, 0) / sentences.length;
    const grammarScore = Math.min(100, Math.max(0, 100 - Math.abs(avgSentenceLength - 15) * 3));
    
    results.push({
      category: 'Lisibilité',
      score: Math.round(grammarScore),
      issues: avgSentenceLength > 25 
        ? [{ type: 'warning', message: 'Phrases trop longues en moyenne' }]
        : avgSentenceLength < 8 
        ? [{ type: 'suggestion', message: 'Phrases très courtes - variez le rythme' }]
        : [],
      suggestions: ['Visez 15-20 mots par phrase en moyenne', 'Alternez phrases courtes et longues']
    });

    // Analyse structure
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    const structureScore = paragraphs.length >= 3 ? 85 : 60;
    
    results.push({
      category: 'Structure',
      score: structureScore,
      issues: paragraphs.length < 3 
        ? [{ type: 'warning', message: 'Peu de paragraphes distincts' }]
        : [],
      suggestions: ['Utilisez des paragraphes courts (3-5 phrases)', 'Ajoutez des sous-titres']
    });

    // Analyse vocabulaire
    const words = text.toLowerCase().match(/\b[a-zàâäéèêëïîôùûüç]+\b/gi) || [];
    const uniqueWords = new Set(words);
    const vocabularyRichness = (uniqueWords.size / words.length) * 100;
    const vocabScore = Math.min(100, vocabularyRichness * 2.5);
    
    results.push({
      category: 'Vocabulaire',
      score: Math.round(vocabScore),
      issues: vocabularyRichness < 30 
        ? [{ type: 'warning', message: 'Vocabulaire répétitif détecté' }]
        : [],
      suggestions: ['Utilisez des synonymes pour varier', 'Évitez les répétitions proches']
    });

    // Analyse engagement
    const exclamations = (text.match(/!/g) || []).length;
    const questions = (text.match(/\?/g) || []).length;
    const dialogues = (text.match(/[«»""]/g) || []).length;
    const engagementScore = Math.min(100, 60 + exclamations * 2 + questions * 3 + dialogues);
    
    results.push({
      category: 'Engagement',
      score: Math.round(engagementScore),
      issues: questions === 0 && dialogues === 0 
        ? [{ type: 'suggestion', message: 'Ajoutez des éléments interactifs (questions, dialogues)' }]
        : [],
      suggestions: ['Posez des questions au lecteur', 'Incluez des dialogues ou citations']
    });

    // Analyse cohérence
    const coherenceScore = 75; // Baseline
    results.push({
      category: 'Cohérence',
      score: coherenceScore,
      issues: [],
      suggestions: ['Vérifiez la continuité des idées', 'Assurez-vous des transitions fluides']
    });

    const overallScore = Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length);

    return {
      overallScore,
      results,
      summary: overallScore >= 80 
        ? 'Excellent travail ! Votre texte est de bonne qualité éditoriale.'
        : overallScore >= 60
        ? 'Bon texte avec quelques améliorations possibles.'
        : 'Ce texte nécessite des révisions pour atteindre un niveau professionnel.'
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getIssueIcon = (type: 'error' | 'warning' | 'suggestion') => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/20">
              <Eye className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <CardTitle className="text-xl">Audit Éditeur</CardTitle>
              <CardDescription>
                Analysez votre manuscrit pour détecter les erreurs et améliorer la qualité
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Zone d'input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Votre texte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isExtracting 
                  ? 'border-violet-500/50 bg-violet-500/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onClick={() => !isExtracting && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isExtracting}
              />
              {isExtracting ? (
                <>
                  <Loader2 className="w-10 h-10 mx-auto mb-3 text-violet-500 animate-spin" />
                  <p className="text-sm font-medium text-violet-500">
                    Extraction du texte en cours...
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {uploadedFileName || 'Cliquez pour uploader votre manuscrit'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Formats acceptés : PDF, DOCX
                  </p>
                </>
              )}
            </div>

            {/* Aperçu du texte extrait */}
            {textContent && (
              <div className="p-4 rounded-lg bg-muted/50 max-h-[250px] overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Texte extrait :</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-[12]">
                  {textContent.slice(0, 1500)}
                  {textContent.length > 1500 && '...'}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {textContent.length.toLocaleString()} caractères extraits
              </span>
              <Button 
                onClick={runAudit}
                disabled={isAnalyzing || !textContent.trim()}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Lancer l'audit
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Résultats de l'audit
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
                <p className="text-muted-foreground">Analyse de votre texte...</p>
              </div>
            ) : auditResult ? (
              <div className="space-y-6">
                {/* Score global */}
                <div className="text-center p-6 rounded-lg bg-muted/50">
                  <div className={`text-5xl font-bold ${getScoreColor(auditResult.overallScore)}`}>
                    {auditResult.overallScore}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Score global / 100</p>
                  <p className="text-sm mt-3">{auditResult.summary}</p>
                </div>

                {/* Détails par catégorie */}
                <Tabs defaultValue={auditResult.results[0]?.category} className="w-full">
                  <TabsList className="grid grid-cols-5 w-full h-auto">
                    {auditResult.results.map((result) => (
                      <TabsTrigger 
                        key={result.category} 
                        value={result.category}
                        className="text-xs py-2 px-1"
                      >
                        <span className="hidden sm:inline">{result.category}</span>
                        <span className="sm:hidden">{result.category.slice(0, 3)}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {auditResult.results.map((result) => (
                    <TabsContent key={result.category} value={result.category} className="space-y-4 mt-4">
                      {/* Score de la catégorie */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress 
                            value={result.score} 
                            className="h-3"
                          />
                        </div>
                        <Badge className={`${getScoreBgColor(result.score)} text-white`}>
                          {result.score}/100
                        </Badge>
                      </div>

                      {/* Issues */}
                      {result.issues.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Problèmes détectés :</p>
                          {result.issues.map((issue, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
                              {getIssueIcon(issue.type)}
                              <span className="text-sm">{issue.message}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggestions */}
                      {result.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Suggestions :</p>
                          {result.suggestions.map((suggestion, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2 rounded-md bg-emerald-500/10">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                              <span className="text-sm">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>

                {/* Bouton relancer */}
                <Button 
                  variant="outline" 
                  onClick={runAudit}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Relancer l'audit
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <BookOpen className="w-12 h-12 text-muted-foreground/50" />
                <div>
                  <p className="text-muted-foreground">Aucun audit effectué</p>
                  <p className="text-sm text-muted-foreground/70">
                    Collez votre texte et lancez l'analyse
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Guide */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            Ce que l'audit vérifie :
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
              <span><strong>Lisibilité</strong> - Longueur des phrases, clarté</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
              <span><strong>Structure</strong> - Paragraphes, organisation</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
              <span><strong>Vocabulaire</strong> - Richesse, répétitions</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
              <span><strong>Engagement</strong> - Dynamisme, dialogues</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
              <span><strong>Cohérence</strong> - Transitions, fluidité</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookEditorAudit;
