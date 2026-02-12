import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, Loader2, Copy, CheckCircle2, Sparkles, Star, Globe, 
  RefreshCw, Lightbulb, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const categories = [
  'Business & Entrepreneuriat', 'Romance', 'Fantasy', 'Science-fiction',
  'Développement personnel', 'Cuisine & Gastronomie', 'Voyage', 'Histoire',
  'Thriller', 'Santé & Bien-être', 'Éducation', 'Technologie',
  'Biographie', 'Art & Design', 'Sport', 'Enfants & Jeunesse', 'Autre'
];

const tones = [
  'Classique & Élégant', 'Moderne & Dynamique', 'Mystérieux & Intrigant',
  'Autoritaire & Expert', 'Créatif & Original', 'International'
];

const markets = [
  'Francophone', 'Anglophone', 'International', 'Germanophone', 'Hispanophone'
];

interface PenName {
  name: string;
  style: string;
  pourquoi: string;
  scoreImpact: number;
  marche: string;
  initiales: string;
}

interface PenNameResult {
  penNames: PenName[];
  conseilsStrategie: string[];
  tendancesGenre: string;
}

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-emerald-500';
  if (score >= 70) return 'text-amber-500';
  return 'text-orange-500';
};

const getStyleBadgeClass = (style: string) => {
  const s = style.toLowerCase();
  if (s.includes('classique') || s.includes('élégant')) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  if (s.includes('moderne') || s.includes('dynamique')) return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
  if (s.includes('mystérieux')) return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
  if (s.includes('autoritaire') || s.includes('expert')) return 'bg-red-500/10 text-red-600 border-red-500/20';
  if (s.includes('créatif') || s.includes('original')) return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
  return 'bg-muted text-muted-foreground';
};

const EbookPenNameGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tone, setTone] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PenNameResult | null>(null);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [favoriteNames, setFavoriteNames] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Le titre de l'ebook est requis");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-pen-name', {
        body: { title, category, tone, targetMarket }
      });
      if (error) throw error;
      setResult(data);
      toast.success('Noms de plume générés !');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    toast.success(`"${name}" copié !`);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const toggleFavorite = (name: string) => {
    setFavoriteNames(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Pen Name Generator
          </h2>
          <p className="text-sm text-muted-foreground">
            Générez des noms de plume professionnels et mémorables pour votre ebook
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Informations sur votre ebook</CardTitle>
          <CardDescription>Renseigne les détails de ton livre pour obtenir des suggestions de noms de plume adaptés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="pen-title">Titre de l'ebook *</Label>
            <Input
              id="pen-title"
              placeholder="Ex: Les Secrets de la Réussite Entrepreneuriale"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tonalité souhaitée</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un style" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Marché cible</Label>
            <Select value={targetMarket} onValueChange={setTargetMarket}>
              <SelectTrigger>
                <SelectValue placeholder="Francophone (par défaut)" />
              </SelectTrigger>
              <SelectContent>
                {markets.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !title.trim()}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg h-12 text-base"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Générer des noms de plume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      {result && result.penNames?.length > 0 ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Grille de noms */}
          <div className="grid gap-4 md:grid-cols-2">
            {result.penNames.map((pen, i) => (
              <Card 
                key={i} 
                className={`border-border/50 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                  favoriteNames.includes(pen.name) ? 'ring-2 ring-violet-500/50 border-violet-500/30' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-foreground">{pen.name}</h3>
                        <span className="text-xs text-muted-foreground font-mono">{pen.initiales}</span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getStyleBadgeClass(pen.style)}`}>
                        {pen.style}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-bold ${getScoreColor(pen.scoreImpact)}`}>
                        {pen.scoreImpact}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">{pen.pourquoi}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      {pen.marche}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => toggleFavorite(pen.name)}
                      >
                        <Star className={`w-3.5 h-3.5 ${favoriteNames.includes(pen.name) ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => copyName(pen.name)}
                      >
                        {copiedName === pen.name ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Favoris */}
          {favoriteNames.length > 0 && (
            <Card className="border-violet-500/30 bg-violet-500/5 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <CardTitle className="text-sm">Mes favoris ({favoriteNames.length})</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {favoriteNames.map((name, i) => (
                    <Badge key={i} variant="outline" className="bg-background cursor-pointer" onClick={() => copyName(name)}>
                      {name}
                      <Copy className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tendances du genre */}
          {result.tendancesGenre && (
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-500" />
                  <CardTitle className="text-sm">Tendances dans ce genre</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{result.tendancesGenre}</p>
              </CardContent>
            </Card>
          )}

          {/* Conseils */}
          {result.conseilsStrategie?.length > 0 && (
            <Card className="border-border/50 shadow-lg border-l-4 border-l-amber-500">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <CardTitle className="text-sm">Conseils stratégiques</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.conseilsStrategie.map((c, i) => (
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
            <Button variant="outline" onClick={handleGenerate} disabled={isGenerating} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Générer de nouveaux noms
            </Button>
          </div>
        </div>
      ) : result ? (
        <Card className="border-border/50 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <User className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">Aucun nom de plume généré pour le moment</p>
            <p className="text-xs text-muted-foreground/60">Remplis le formulaire ci-dessus pour commencer</p>
          </CardContent>
        </Card>
      ) : null}

      {/* Empty state quand pas de résultat */}
      {!result && (
        <Card className="border-border/50 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <User className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">Aucun nom de plume généré pour le moment</p>
            <p className="text-xs text-muted-foreground/60">Remplis le formulaire ci-dessus pour commencer</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EbookPenNameGenerator;
