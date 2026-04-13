import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FlaskConical, Plus, Trash2, Trophy, BarChart3, RefreshCw, Sparkles, Image, Type, Eye, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

interface Variant {
  id: string;
  name: string;
  title?: string;
  subtitle?: string;
  coverUrl?: string;
  description?: string;
  score?: number;
  votes?: { up: number; down: number };
  analysis?: {
    clarity: number;
    emotion: number;
    uniqueness: number;
    marketFit: number;
  };
}

interface TestResult {
  winnerId: string;
  winnerName: string;
  confidence: number;
  reasoning: string;
  recommendations: string[];
}

interface EbookABTestingProps {
  ebookTitle: string;
  coverImage?: string;
}

const EbookABTesting: React.FC<EbookABTestingProps> = ({
  ebookTitle,
  coverImage
}) => {
  const [testType, setTestType] = useState<'title' | 'cover' | 'description'>('title');
  const [variants, setVariants] = useState<Variant[]>([
    { id: '1', name: 'Version A', title: ebookTitle, votes: { up: 0, down: 0 } },
    { id: '2', name: 'Version B', title: '', votes: { up: 0, down: 0 } },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const addVariant = () => {
    if (variants.length >= 5) {
      toast.error('Maximum 5 variantes autorisées');
      return;
    }
    const newId = (variants.length + 1).toString();
    setVariants([...variants, {
      id: newId,
      name: `Version ${String.fromCharCode(65 + variants.length)}`,
      title: '',
      votes: { up: 0, down: 0 }
    }]);
  };

  const removeVariant = (id: string) => {
    if (variants.length <= 2) {
      toast.error('Minimum 2 variantes requises');
      return;
    }
    setVariants(variants.filter(v => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof Variant, value: any) => {
    setVariants(variants.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const handleVote = (variantId: string, type: 'up' | 'down') => {
    setVariants(variants.map(v => {
      if (v.id === variantId) {
        return {
          ...v,
          votes: {
            ...v.votes!,
            [type]: (v.votes?.[type] || 0) + 1
          }
        };
      }
      return v;
    }));
  };

  const runAIAnalysis = async () => {
    const validVariants = variants.filter(v => 
      testType === 'title' ? v.title?.trim() : 
      testType === 'cover' ? v.coverUrl?.trim() : 
      v.description?.trim()
    );

    if (validVariants.length < 2) {
      toast.error('Remplissez au moins 2 variantes');
      return;
    }

    setIsAnalyzing(true);
    toast.info('🧪 Analyse IA en cours...');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ab-test-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          testType,
          variants: validVariants,
          context: { ebookTitle }
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur d\'analyse');
      }

      const data = await response.json();
      
      if (data.result) {
        setTestResult(data.result);
        // Update variants with scores
        if (data.variantScores) {
          setVariants(variants.map(v => ({
            ...v,
            score: data.variantScores[v.id]?.score,
            analysis: data.variantScores[v.id]?.analysis
          })));
        }
        toast.success('🏆 Analyse terminée !');
      } else {
        toast.error('Analyse impossible — réponse vide du serveur. Réessayez.');
      }
    } catch (error) {
      console.error('Erreur A/B test:', error);
      toast.error('Analyse impossible — vérifiez votre connexion et réessayez.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAIVariants = async () => {
    toast.info('✨ Génération de variantes IA...');
    setIsAnalyzing(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ab-variants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          testType,
          originalTitle: ebookTitle,
          count: 4
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur de génération');
      }

      const data = await response.json();
      
      if (data.variants) {
        setVariants(data.variants.map((v: any, i: number) => ({
          id: (i + 1).toString(),
          name: `Version ${String.fromCharCode(65 + i)}`,
          title: v.title,
          subtitle: v.subtitle,
          votes: { up: 0, down: 0 }
        })));
        toast.success(`✨ ${data.variants.length} variantes générées !`);
      } else {
        // Fallback
        const generatedVariants = [
          { title: ebookTitle, subtitle: 'Le guide complet' },
          { title: `Maîtrisez ${ebookTitle.split(' ').slice(0, 3).join(' ')}`, subtitle: 'Méthode éprouvée' },
          { title: `${ebookTitle} : La Méthode Ultime`, subtitle: 'Résultats garantis' },
          { title: `Secrets de ${ebookTitle.split(' ').slice(-2).join(' ')}`, subtitle: 'Ce que personne ne vous dit' },
        ];
        setVariants(generatedVariants.map((v, i) => ({
          id: (i + 1).toString(),
          name: `Version ${String.fromCharCode(65 + i)}`,
          title: v.title,
          subtitle: v.subtitle,
          votes: { up: 0, down: 0 }
        })));
        toast.success('✨ 4 variantes générées !');
      }
    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-gradient-to-r from-green-500 to-emerald-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <FlaskConical className="h-6 w-6 text-white" />
            </div>
            <div>
              <span>🧪 A/B Testing Titres & Couvertures</span>
              <Badge className="ml-3 bg-gradient-to-r from-amber-500 to-orange-500">2026</Badge>
            </div>
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Testez plusieurs versions de titres, sous-titres ou couvertures pour identifier celle qui performera le mieux
          </p>
        </CardHeader>
      </Card>

      {/* Test Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Type de Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setTestType('title')}
              className={`p-4 rounded-xl border-2 transition-all ${
                testType === 'title'
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                  : 'border-border hover:border-green-300'
              }`}
            >
              <Type className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Titres</p>
              <p className="text-xs text-muted-foreground">Testez différents titres</p>
            </button>
            <button
              onClick={() => setTestType('cover')}
              className={`p-4 rounded-xl border-2 transition-all ${
                testType === 'cover'
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                  : 'border-border hover:border-green-300'
              }`}
            >
              <Image className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Couvertures</p>
              <p className="text-xs text-muted-foreground">Comparez les visuels</p>
            </button>
            <button
              onClick={() => setTestType('description')}
              className={`p-4 rounded-xl border-2 transition-all ${
                testType === 'description'
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                  : 'border-border hover:border-green-300'
              }`}
            >
              <Eye className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Descriptions</p>
              <p className="text-xs text-muted-foreground">Testez vos accroches</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Variants Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Variantes à Tester ({variants.length})</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateAIVariants}
                disabled={isAnalyzing}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Générer avec IA
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={addVariant}
                disabled={variants.length >= 5}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((variant, index) => (
            <div
              key={variant.id}
              className={`p-4 border-2 rounded-xl transition-all ${
                testResult?.winnerId === variant.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                  : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{variant.name}</Badge>
                  {testResult?.winnerId === variant.id && (
                    <Badge className="bg-green-500">
                      <Trophy className="h-3 w-3 mr-1" />
                      Gagnant
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {variant.score && (
                    <Badge variant="secondary" className="text-lg">
                      {variant.score}%
                    </Badge>
                  )}
                  {variants.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(variant.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>

              {testType === 'title' && (
                <div className="space-y-3">
                  <Input
                    placeholder="Titre..."
                    value={variant.title || ''}
                    onChange={(e) => updateVariant(variant.id, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Sous-titre (optionnel)..."
                    value={variant.subtitle || ''}
                    onChange={(e) => updateVariant(variant.id, 'subtitle', e.target.value)}
                  />
                </div>
              )}

              {testType === 'cover' && (
                <div className="space-y-3">
                  <Input
                    placeholder="URL de l'image de couverture..."
                    value={variant.coverUrl || ''}
                    onChange={(e) => updateVariant(variant.id, 'coverUrl', e.target.value)}
                  />
                  {variant.coverUrl && (
                    <img
                      src={variant.coverUrl}
                      alt={variant.name}
                      className="h-48 object-cover rounded-lg mx-auto"
                    />
                  )}
                </div>
              )}

              {testType === 'description' && (
                <Textarea
                  placeholder="Description..."
                  value={variant.description || ''}
                  onChange={(e) => updateVariant(variant.id, 'description', e.target.value)}
                  rows={4}
                />
              )}

              {/* Vote Buttons */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                <span className="text-sm text-muted-foreground">Vote rapide :</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleVote(variant.id, 'up')}
                  className="text-green-600"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {variant.votes?.up || 0}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleVote(variant.id, 'down')}
                  className="text-red-600"
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  {variant.votes?.down || 0}
                </Button>
              </div>

              {/* Analysis Details */}
              {variant.analysis && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(variant.analysis).map(([key, value]) => (
                      <div key={key} className="text-center p-2 bg-muted/50 rounded-lg">
                        <div className="text-xs text-muted-foreground capitalize">
                          {key === 'marketFit' ? 'Marché' : key}
                        </div>
                        <div className="font-medium">{value}%</div>
                        <Progress value={value} className="h-1 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Analyze Button */}
          <Button
            onClick={runAIAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <FlaskConical className="h-5 w-5 mr-2" />
                Lancer l'Analyse IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {testResult && (
        <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Résultat du Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl">
              <div>
                <p className="text-sm text-muted-foreground">Version Gagnante</p>
                <p className="text-2xl font-bold text-green-600">{testResult.winnerName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Score de confiance</p>
                <p className="text-2xl font-bold">{testResult.confidence}%</p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
              <p className="font-medium mb-2">💡 Analyse</p>
              <p className="text-muted-foreground">{testResult.reasoning}</p>
            </div>

            <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
              <p className="font-medium mb-2">📋 Recommandations</p>
              <ul className="space-y-1">
                {testResult.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">🎯 Bonnes pratiques A/B Testing</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• <strong>Testez une variable :</strong> Changez un seul élément à la fois pour des résultats fiables</li>
            <li>• <strong>Titres :</strong> Variez la promesse, le ton, ou la structure (question vs affirmation)</li>
            <li>• <strong>Couvertures :</strong> Testez les couleurs, la typographie et le style visuel</li>
            <li>• <strong>Après publication :</strong> Utilisez Amazon Experiments pour des tests réels</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookABTesting;
