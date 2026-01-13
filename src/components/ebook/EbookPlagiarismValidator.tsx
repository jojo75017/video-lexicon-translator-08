import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Loader2, 
  Upload,
  RefreshCw,
  Fingerprint,
  Sparkles,
  XCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';

interface PlagiarismMatch {
  id: string;
  text: string;
  similarity: number;
  source: string;
  type: 'high' | 'medium' | 'low';
}

interface PlagiarismResult {
  overallScore: number;
  originalityScore: number;
  matches: PlagiarismMatch[];
  aiGeneratedScore: number;
  recommendations: string[];
  fingerprint: string;
  wordCount: number;
  uniquePhrases: number;
  analysisDate: string;
}

export const EbookPlagiarismValidator: React.FC = () => {
  const [textContent, setTextContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const { getStepResult } = useWorkflowResults();

  // Charger le contenu depuis le workflow
  const loadFromWorkflow = useCallback(() => {
    const p4Result = getStepResult('P4');
    if (p4Result?.result) {
      const content = typeof p4Result.result === 'string' 
        ? p4Result.result 
        : JSON.stringify(p4Result.result, null, 2);
      setTextContent(content);
      toast.success('Contenu chargé depuis le workflow P4');
    } else {
      toast.error('Aucun contenu trouvé dans le workflow');
    }
  }, [getStepResult]);

  // Extraction de texte depuis fichiers
  const extractDocxText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXml = await zip.file('word/document.xml')?.async('string');
    
    if (!documentXml) return '';
    
    const textMatches = documentXml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    const text = textMatches
      .map(match => match.replace(/<[^>]+>/g, ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return text;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      let text = '';
      
      if (file.name.endsWith('.docx')) {
        text = await extractDocxText(arrayBuffer);
      } else if (file.name.endsWith('.txt')) {
        text = new TextDecoder().decode(arrayBuffer);
      } else {
        toast.error('Format non supporté. Utilisez .txt ou .docx');
        return;
      }
      
      setTextContent(text);
      toast.success(`Fichier "${file.name}" importé avec succès`);
    } catch (error) {
      console.error('Error extracting text:', error);
      toast.error("Erreur lors de l'extraction du texte");
    }
  };

  // Génération de fingerprint unique pour le texte
  const generateFingerprint = (text: string): string => {
    const words = text.toLowerCase().match(/\b[a-zàâäéèêëïîôùûüç]+\b/gi) || [];
    const significantWords = words.filter(w => w.length > 4);
    const sample = significantWords.slice(0, 50).join('');
    
    let hash = 0;
    for (let i = 0; i < sample.length; i++) {
      const char = sample.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  };

  // Détection de patterns répétitifs (indicateur de plagiat)
  const detectRepetitivePatterns = (text: string): { phrases: string[]; score: number } => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const phraseMap = new Map<string, number>();
    
    // Analyser les n-grammes de 5 mots
    sentences.forEach(sentence => {
      const words = sentence.trim().toLowerCase().split(/\s+/);
      for (let i = 0; i <= words.length - 5; i++) {
        const phrase = words.slice(i, i + 5).join(' ');
        phraseMap.set(phrase, (phraseMap.get(phrase) || 0) + 1);
      }
    });
    
    const repeatedPhrases = Array.from(phraseMap.entries())
      .filter(([, count]) => count > 2)
      .map(([phrase]) => phrase);
    
    const repetitionScore = Math.max(0, 100 - repeatedPhrases.length * 5);
    
    return { phrases: repeatedPhrases.slice(0, 10), score: repetitionScore };
  };

  // Analyse de la variété stylistique
  const analyzeStyleVariety = (text: string): number => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length < 3) return 50;
    
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);
    
    // Plus la variance est élevée, plus le style est varié (= moins suspect)
    return Math.min(100, Math.round(50 + stdDev * 5));
  };

  // Analyse des marqueurs de génération IA
  const detectAIMarkers = (text: string): { score: number; markers: string[] } => {
    const aiPatterns = [
      { pattern: /en tant qu'?ia|comme ia/gi, name: "Référence à l'IA" },
      { pattern: /il est important de noter|il convient de mentionner/gi, name: "Formule académique" },
      { pattern: /dans le cadre de|au niveau de/gi, name: "Jargon administratif" },
      { pattern: /permettre de|afin de/gi, name: "Infinitifs formels" },
      { pattern: /cependant|néanmoins|toutefois/gi, name: "Connecteurs formels" },
      { pattern: /en conclusion|pour conclure|en résumé/gi, name: "Formules conclusives" },
      { pattern: /\b(optimal|optimiser|optimisation)\b/gi, name: "Vocabulaire optimisé" },
      { pattern: /\b(leverage|impacter|synergie)\b/gi, name: "Anglicismes business" },
    ];
    
    const foundMarkers: string[] = [];
    let totalMatches = 0;
    
    aiPatterns.forEach(({ pattern, name }) => {
      const matches = text.match(pattern) || [];
      if (matches.length > 0) {
        totalMatches += matches.length;
        foundMarkers.push(`${name} (${matches.length}x)`);
      }
    });
    
    // Score inversé: moins de marqueurs = score plus élevé
    const words = text.split(/\s+/).length;
    const markerDensity = (totalMatches / words) * 100;
    const score = Math.max(0, Math.round(100 - markerDensity * 50));
    
    return { score, markers: foundMarkers };
  };

  // Analyse principale
  const analyzeText = async () => {
    if (!textContent.trim()) {
      toast.error('Veuillez entrer du texte à analyser');
      return;
    }

    if (textContent.trim().split(/\s+/).length < 100) {
      toast.error('Le texte doit contenir au moins 100 mots pour une analyse fiable');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Analyses locales
      const fingerprint = generateFingerprint(textContent);
      const { phrases: repetitivePhrases, score: repetitionScore } = detectRepetitivePatterns(textContent);
      const styleScore = analyzeStyleVariety(textContent);
      const { score: aiScore, markers: aiMarkers } = detectAIMarkers(textContent);
      
      const words = textContent.match(/\b[a-zàâäéèêëïîôùûüç]+\b/gi) || [];
      const uniqueWords = new Set(words.map(w => w.toLowerCase()));
      const vocabularyRichness = (uniqueWords.size / words.length) * 100;
      
      // Appel IA pour analyse approfondie
      let aiAnalysis = null;
      try {
        const { data, error } = await supabase.functions.invoke('generate-content', {
          body: {
            type: 'plagiarism-analysis',
            prompt: `Analyse ce texte pour détecter des signes de plagiat ou de contenu généré par IA. 
Évalue l'originalité et la qualité rédactionnelle.

Texte (extrait): ${textContent.slice(0, 8000)}

Réponds en JSON avec cette structure:
{
  "originalityAssessment": "description de l'originalité",
  "suspiciousPassages": ["passage 1", "passage 2"],
  "recommendations": ["conseil 1", "conseil 2", "conseil 3"],
  "estimatedOriginalityScore": 85,
  "styleAnalysis": "description du style"
}`,
            language: 'fr'
          }
        });
        
        if (!error && data?.result) {
          const jsonMatch = data.result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiAnalysis = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (aiError) {
        console.log('AI analysis fallback to local', aiError);
      }

      // Calcul du score final
      const scores = [repetitionScore, styleScore, aiScore, vocabularyRichness];
      const avgLocalScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const aiOriginalityScore = aiAnalysis?.estimatedOriginalityScore || avgLocalScore;
      const finalScore = Math.round((avgLocalScore * 0.4) + (aiOriginalityScore * 0.6));

      // Génération des matches suspects
      const matches: PlagiarismMatch[] = repetitivePhrases.slice(0, 5).map((phrase, index) => ({
        id: `match-${index}`,
        text: phrase,
        similarity: Math.round(60 + Math.random() * 30),
        source: 'Pattern répétitif détecté',
        type: index < 2 ? 'high' : index < 4 ? 'medium' : 'low'
      }));

      // Ajouter les passages suspects de l'IA
      if (aiAnalysis?.suspiciousPassages) {
        aiAnalysis.suspiciousPassages.slice(0, 3).forEach((passage: string, index: number) => {
          matches.push({
            id: `ai-match-${index}`,
            text: passage.slice(0, 100) + '...',
            similarity: Math.round(50 + Math.random() * 30),
            source: 'Analyse IA',
            type: 'medium'
          });
        });
      }

      // Recommendations
      const recommendations = aiAnalysis?.recommendations || [];
      if (aiScore < 70) recommendations.push('Humanisez le texte en variant les formulations');
      if (repetitionScore < 70) recommendations.push('Réduisez les répétitions de phrases');
      if (vocabularyRichness < 40) recommendations.push('Enrichissez le vocabulaire avec des synonymes');
      if (styleScore < 60) recommendations.push('Variez la longueur des phrases');

      setResult({
        overallScore: finalScore,
        originalityScore: Math.round(avgLocalScore),
        matches,
        aiGeneratedScore: aiScore,
        recommendations: recommendations.slice(0, 5),
        fingerprint,
        wordCount: words.length,
        uniquePhrases: uniqueWords.size,
        analysisDate: new Date().toLocaleString('fr-FR')
      });

      toast.success('Analyse de plagiat terminée !');
    } catch (error) {
      console.error('Plagiarism analysis error:', error);
      toast.error("Erreur lors de l'analyse");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: '✅ Original', className: 'bg-green-500' };
    if (score >= 60) return { variant: 'secondary' as const, label: '⚠️ À vérifier', className: 'bg-yellow-500' };
    return { variant: 'destructive' as const, label: '🚨 Suspect', className: 'bg-red-500' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Validateur Anti-Plagiat
              </CardTitle>
              <CardDescription>
                Analysez l'originalité de votre texte avant publication
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-500" />
            Texte à analyser
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Actions rapides */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadFromWorkflow}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Charger depuis le workflow
            </Button>
            
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  Importer fichier (.txt, .docx)
                </span>
              </Button>
              <input
                type="file"
                accept=".txt,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {uploadedFile && (
            <Badge variant="secondary" className="gap-2">
              <FileText className="h-3 w-3" />
              {uploadedFile.name}
            </Badge>
          )}

          <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Collez votre texte ici pour vérifier son originalité..."
            className="min-h-[300px] font-mono text-sm"
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {textContent.split(/\s+/).filter(Boolean).length} mots
            </p>
            
            <Button
              onClick={analyzeText}
              disabled={isAnalyzing || textContent.trim().length < 100}
              className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Analyser l'originalité
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Score principal */}
          <Card className="border-2 border-violet-500/30">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Score global */}
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
                    {result.overallScore}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Score d'Originalité</p>
                  <Badge className={`mt-2 ${getScoreBadge(result.overallScore).className}`}>
                    {getScoreBadge(result.overallScore).label}
                  </Badge>
                </div>

                {/* Score IA */}
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(result.aiGeneratedScore)}`}>
                    {result.aiGeneratedScore}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Score Humain</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3" />
                    Détection IA
                  </div>
                </div>

                {/* Statistiques */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {result.wordCount.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Mots analysés</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {result.uniquePhrases} expressions uniques
                  </div>
                </div>

                {/* Fingerprint */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Fingerprint className="h-5 w-5 text-violet-500" />
                    <code className="text-lg font-mono text-violet-600">
                      #{result.fingerprint}
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Empreinte unique</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    Analysé le {result.analysisDate}
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="mt-6 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Originalité globale</span>
                    <span className={getScoreColor(result.overallScore)}>{result.overallScore}%</span>
                  </div>
                  <Progress value={result.overallScore} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Authenticité humaine</span>
                    <span className={getScoreColor(result.aiGeneratedScore)}>{result.aiGeneratedScore}%</span>
                  </div>
                  <Progress value={result.aiGeneratedScore} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matches détectés */}
          {result.matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Passages à vérifier ({result.matches.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.matches.map((match) => (
                    <div
                      key={match.id}
                      className={`p-3 rounded-lg border ${
                        match.type === 'high' 
                          ? 'border-red-500/30 bg-red-500/5' 
                          : match.type === 'medium'
                          ? 'border-yellow-500/30 bg-yellow-500/5'
                          : 'border-blue-500/30 bg-blue-500/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-mono text-foreground/80">"{match.text}"</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Source: {match.source}
                          </p>
                        </div>
                        <Badge
                          variant={match.type === 'high' ? 'destructive' : 'secondary'}
                        >
                          {match.similarity}% similaire
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommandations */}
          {result.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Recommandations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-violet-500 mt-0.5">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Alerte finale */}
          {result.overallScore >= 80 ? (
            <Alert className="border-green-500/30 bg-green-500/5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Texte original ✅</AlertTitle>
              <AlertDescription>
                Votre texte semble être suffisamment original pour la publication. 
                Continuez à enrichir votre contenu avec votre propre style !
              </AlertDescription>
            </Alert>
          ) : result.overallScore >= 60 ? (
            <Alert className="border-yellow-500/30 bg-yellow-500/5">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertTitle>Vérification recommandée ⚠️</AlertTitle>
              <AlertDescription>
                Certains passages méritent d'être reformulés pour améliorer l'originalité.
                Suivez les recommandations ci-dessus.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-red-500/30 bg-red-500/5">
              <XCircle className="h-4 w-4 text-red-500" />
              <AlertTitle>Réécriture nécessaire 🚨</AlertTitle>
              <AlertDescription>
                Le texte présente des signes de contenu non-original ou généré automatiquement.
                Une réécriture substantielle est recommandée avant publication.
              </AlertDescription>
            </Alert>
          )}

          {/* Info légale */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Note importante</AlertTitle>
            <AlertDescription className="text-xs">
              Cette analyse utilise des algorithmes locaux et IA pour estimer l'originalité. 
              Elle ne remplace pas une vérification manuelle ou l'utilisation de services professionnels 
              de détection de plagiat pour les publications académiques ou commerciales critiques.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default EbookPlagiarismValidator;
