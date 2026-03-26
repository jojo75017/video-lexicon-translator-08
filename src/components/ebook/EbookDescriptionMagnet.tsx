import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, Loader2, Copy, CheckCircle2, Sparkles, Target, TrendingUp, 
  Lightbulb, BarChart3, Zap, BookOpen, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

const genres = [
  'Business & Entrepreneuriat', 'Romance', 'Fantasy', 'Science-fiction',
  'Développement personnel', 'Cuisine & Gastronomie', 'Voyage', 'Histoire',
  'Thriller', 'Santé & Bien-être', 'Éducation', 'Technologie',
  'Biographie', 'Art & Design', 'Sport', 'Autre'
];

const audiences = [
  'Débutants', 'Professionnels', 'Étudiants', 'Parents',
  'Entrepreneurs', 'Adolescents', 'Seniors', 'Grand public'
];

interface DescriptionResult {
  descriptionComplete: string;
  descriptionCourte: string;
  hook: string;
  bulletPoints: string[];
  callToAction: string;
  scorePersuasion: number;
  conseilsAmelioration: string[];
  motsClesSeo: string[];
  tonaliteDetectee: string;
  structureAnalysis: {
    hookScore: number;
    beneficesScore: number;
    ctaScore: number;
    seoScore: number;
    lisibiliteScore: number;
  };
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
};

const getScoreGradient = (score: number) => {
  if (score >= 80) return 'from-emerald-500 to-green-400';
  if (score >= 60) return 'from-amber-500 to-yellow-400';
  return 'from-red-500 to-orange-400';
};

const ScoreCircle = ({ score, label, size = 'md' }: { score: number; label: string; size?: 'sm' | 'md' }) => {
  const radius = size === 'md' ? 44 : 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
  const viewBox = size === 'md' ? '0 0 100 100' : '0 0 76 76';
  const center = size === 'md' ? 50 : 38;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg className={`${size === 'md' ? 'w-24 h-24' : 'w-16 h-16'} -rotate-90`} viewBox={viewBox}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/20" />
        <circle
          cx={center} cy={center} r={radius} fill="none"
          strokeWidth="6"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className={getScoreColor(score)}
          style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
        />
      </svg>
      <span className={`text-xs font-medium text-muted-foreground`}>{label}</span>
      <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}%</span>
    </div>
  );
};

const EbookDescriptionMagnet: React.FC = () => {
  const { apiKey: userGeminiKey } = useOpenAIConfig();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [genre, setGenre] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keywords, setKeywords] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<DescriptionResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Le titre de l'ebook est requis");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-kdp-description', {
        body: { userApiKey: userGeminiKey, title, subtitle, genre, targetAudience, keywords, additionalInfo }
      });

      if (error) throw error;
      setResult(data);
      toast.success('Description générée avec succès !');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copié dans le presse-papiers !');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const charCount = result?.descriptionComplete?.replace(/<[^>]*>/g, '').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Description Magnet
          </h2>
          <p className="text-sm text-muted-foreground">
            Génère une description vendeuse optimisée pour Amazon KDP
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Informations sur ton ebook</CardTitle>
          <CardDescription>Remplis les informations pour générer une description qui convertit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'ebook *</Label>
              <Input
                id="title"
                placeholder="Ex: Le guide de survie de l'immobilier"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre *</Label>
              <Input
                id="subtitle"
                placeholder="Ex: Vivre de l'immobilier"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Public cible</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le public cible" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Mots-clés à privilégier</Label>
            <Input
              id="keywords"
              placeholder="Ex: marketing digital, stratégie, croissance..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="info">Informations supplémentaires (optionnel)</Label>
            <Textarea
              id="info"
              placeholder="Ex: Chapitres principaux, promesses clés..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !title.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg h-12 text-base"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Générer la description
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Score global */}
          <Card className="border-border/50 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex flex-col items-center">
                  <ScoreCircle score={result.scorePersuasion} label="Score Persuasion" />
                </div>
                <div className="flex-1 grid grid-cols-5 gap-3">
                  <ScoreCircle score={result.structureAnalysis.hookScore} label="Hook" size="sm" />
                  <ScoreCircle score={result.structureAnalysis.beneficesScore} label="Bénéfices" size="sm" />
                  <ScoreCircle score={result.structureAnalysis.ctaScore} label="CTA" size="sm" />
                  <ScoreCircle score={result.structureAnalysis.seoScore} label="SEO" size="sm" />
                  <ScoreCircle score={result.structureAnalysis.lisibiliteScore} label="Lisibilité" size="sm" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <Badge variant="outline" className="bg-background/80">
                  🎯 Tonalité : {result.tonaliteDetectee}
                </Badge>
                <span className="text-muted-foreground">
                  {charCount} / 4000 caractères
                </span>
              </div>
            </div>
          </Card>

          {/* Description complète */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <CardTitle className="text-lg">Description Amazon KDP</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(result.descriptionComplete, 'complete')}
              >
                {copiedField === 'complete' ? <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1" />}
                Copier
              </Button>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/30 rounded-lg border border-border/50"
                dangerouslySetInnerHTML={{ __html: result.descriptionComplete }}
              />
            </CardContent>
          </Card>

          {/* Hook + CTA */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <CardTitle className="text-sm">Accroche</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.hook, 'hook')}>
                    {copiedField === 'hook' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium italic text-foreground/90">"{result.hook}"</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" />
                    <CardTitle className="text-sm">Appel à l'action</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.callToAction, 'cta')}>
                    {copiedField === 'cta' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-foreground/90">{result.callToAction}</p>
              </CardContent>
            </Card>
          </div>

          {/* Bullet Points */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <CardTitle className="text-sm">Points clés de vente</CardTitle>
                </div>
                <Button 
                  variant="ghost" size="sm" 
                  onClick={() => copyToClipboard(result.bulletPoints.map(b => `✅ ${b}`).join('\n'), 'bullets')}
                >
                  {copiedField === 'bullets' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {result.bulletPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description courte réseaux sociaux */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <CardTitle className="text-sm">Description courte (réseaux sociaux)</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.descriptionCourte, 'short')}>
                  {copiedField === 'short' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 p-3 bg-muted/30 rounded-lg border border-border/50">
                {result.descriptionCourte}
              </p>
            </CardContent>
          </Card>

          {/* Mots-clés SEO */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-500" />
                <CardTitle className="text-sm">7 Mots-clés SEO Amazon</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.motsClesSeo.map((kw, i) => (
                  <Badge 
                    key={i} 
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => copyToClipboard(kw, `kw-${i}`)}
                  >
                    {copiedField === `kw-${i}` ? <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> : null}
                    {kw}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" size="sm" className="mt-3"
                onClick={() => copyToClipboard(result.motsClesSeo.join(', '), 'allkw')}
              >
                {copiedField === 'allkw' ? <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> : <Copy className="w-3 h-3 mr-1" />}
                Copier tous les mots-clés
              </Button>
            </CardContent>
          </Card>

          {/* Conseils d'amélioration */}
          {result.conseilsAmelioration?.length > 0 && (
            <Card className="border-border/50 shadow-lg border-l-4 border-l-amber-500">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <CardTitle className="text-sm">Conseils d'amélioration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.conseilsAmelioration.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-500 font-bold shrink-0">{i + 1}.</span>
                      <span className="text-foreground/80">{c}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Régénérer */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Régénérer une nouvelle version
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbookDescriptionMagnet;
