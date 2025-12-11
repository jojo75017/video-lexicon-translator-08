import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, Tag, Globe, TrendingUp, DollarSign, 
  Star, Users, Target, Calendar, BarChart3 
} from 'lucide-react';
import { toast } from 'sonner';
import { useSubscriptionGeneration, Chapter } from '@/hooks/useSubscriptionGeneration';

interface EbookKdpToolsProps {
  ebookTitle: string;
  authorName: string;
  chapters: Chapter[];
  apiKey: string;
  targetAudience: string;
}

export const EbookKdpTools: React.FC<EbookKdpToolsProps> = ({
  ebookTitle,
  authorName,
  chapters,
  apiKey,
  targetAudience
}) => {
  const { 
    isGenerating,
    generateKDPDescription, 
    generateKDPKeywords, 
    generateKDPCategories,
    generatePricingStrategy,
    generateLaunchPlan,
    generateAuthorBio
  } = useSubscriptionGeneration('', apiKey, ebookTitle, targetAudience, null, 'narratif', 'moyen', 'détaillé', 'professionnel', 'troisième personne');
  const [targetLanguage, setTargetLanguage] = useState('français');
  const [genre, setGenre] = useState('');
  const [targetAge, setTargetAge] = useState('');
  const [kdpDescription, setKdpDescription] = useState('');
  const [kdpKeywords, setKdpKeywords] = useState<any[]>([]);
  const [kdpCategories, setKdpCategories] = useState<any[]>([]);
  const [pricingStrategy, setPricingStrategy] = useState('');
  const [launchPlan, setLaunchPlan] = useState('');
  const [authorBio, setAuthorBio] = useState('');

  const handleGenerateKdpDescription = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    const result = await generateKDPDescription(ebookTitle, chapters);
    if (result) {
      setKdpDescription(result);
      toast.success('Description KDP générée !');
    }
  };

  const handleGenerateKdpKeywords = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    const result = await generateKDPKeywords(ebookTitle, chapters);
    if (result) {
      setKdpKeywords(result);
      toast.success('Mots-clés KDP générés !');
    }
  };

  const handleGenerateKdpCategories = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    const result = await generateKDPCategories(ebookTitle, chapters);
    if (result) {
      setKdpCategories(result);
      toast.success('Catégories KDP générées !');
    }
  };

  const handleGeneratePricingStrategy = async () => {
    if (!ebookTitle) {
      toast.error('Titre de l\'ebook requis');
      return;
    }
    
    if (!genre) {
      toast.error('Veuillez renseigner le genre de votre ebook');
      return;
    }
    
    const result = await generatePricingStrategy(ebookTitle, genre, targetAge);
    if (result) {
      setPricingStrategy(result);
      toast.success('Stratégie de prix générée !');
    }
  };

  const handleGenerateLaunchPlan = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    
    const result = await generateLaunchPlan(ebookTitle);
    if (result) {
      setLaunchPlan(result);
    }
  };

  const handleGenerateAuthorBio = async () => {
    const result = await generateAuthorBio(authorName, genre);
    if (result) {
      setAuthorBio(result);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration KDP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Configuration KDP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="genre">Genre/Catégorie</Label>
            <Input
              id="genre"
              placeholder="Ex: Développement personnel, Romance, Science-fiction..."
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="target-age">Public cible</Label>
            <Select value={targetAge} onValueChange={setTargetAge}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le public" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enfants">👶 Enfants (3-8 ans)</SelectItem>
                <SelectItem value="jeunes">🧒 Jeunes (9-17 ans)</SelectItem>
                <SelectItem value="adultes">👨 Adultes (18-65 ans)</SelectItem>
                <SelectItem value="seniors">👴 Seniors (65+ ans)</SelectItem>
                <SelectItem value="tout-public">🌍 Tout public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Langue de publication</Label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="français">🇫🇷 Français</SelectItem>
                <SelectItem value="anglais">🇺🇸 Anglais</SelectItem>
                <SelectItem value="espagnol">🇪🇸 Espagnol</SelectItem>
                <SelectItem value="allemand">🇩🇪 Allemand</SelectItem>
                <SelectItem value="italien">🇮🇹 Italien</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Outils KDP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Description KDP
            </CardTitle>
            <CardDescription>
              Description optimisée pour Amazon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateKdpDescription}
              disabled={!ebookTitle || isGenerating}
              className="w-full"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              📝 Générer description
            </Button>
            
            {kdpDescription && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap text-sm flex-1">{kdpDescription}</pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(kdpDescription);
                      toast.success('Copié dans le presse-papier !');
                    }}
                  >
                    Copier
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Mots-clés KDP (A9)
            </CardTitle>
            <CardDescription>
              7 mots-clés optimisés pour l'algorithme Amazon A9
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateKdpKeywords}
              disabled={!ebookTitle || isGenerating}
              className="w-full"
            >
              <Tag className="h-4 w-4 mr-2" />
              🏷️ Générer mots-clés
            </Button>
            
            {kdpKeywords.length > 0 && (
              <div className="space-y-2">
                {kdpKeywords.map((kw: any, idx: number) => (
                  <div key={idx} className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-800 dark:text-green-200">{kw.keyword || kw}</span>
                      <div className="flex items-center gap-2">
                        {kw.chars && <span className="text-xs text-muted-foreground">{kw.chars} car.</span>}
                        {kw.relevance && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            kw.relevance === 'haute' ? 'bg-green-500 text-white' :
                            kw.relevance === 'moyenne' ? 'bg-yellow-500 text-white' :
                            'bg-gray-400 text-white'
                          }`}>
                            {kw.relevance}
                          </span>
                        )}
                      </div>
                    </div>
                    {kw.tip && <p className="text-xs text-muted-foreground mt-1">💡 {kw.tip}</p>}
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const text = kdpKeywords.map((kw: any) => kw.keyword || kw).join('\n');
                    navigator.clipboard.writeText(text);
                    toast.success('Mots-clés copiés !');
                  }}
                >
                  Copier tous les mots-clés
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Catégories KDP
            </CardTitle>
            <CardDescription>
              Catégories BISAC avec niveau de concurrence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateKdpCategories}
              disabled={!ebookTitle || isGenerating}
              className="w-full"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              📊 Analyser catégories
            </Button>
            
            {kdpCategories.length > 0 && (
              <div className="space-y-3">
                {kdpCategories.map((cat: any, idx: number) => (
                  <div key={idx} className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-purple-800 dark:text-purple-200">{cat.category || cat}</p>
                        {cat.books_estimate && (
                          <p className="text-xs text-muted-foreground mt-1">📚 ~{cat.books_estimate} livres</p>
                        )}
                        {cat.recommendation && (
                          <p className="text-xs text-muted-foreground mt-1">💡 {cat.recommendation}</p>
                        )}
                        {cat.ranking_potential && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">🎯 {cat.ranking_potential}</p>
                        )}
                      </div>
                      {cat.competition && (
                        <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                          cat.competition === 'faible' ? 'bg-green-500 text-white' :
                          cat.competition === 'moyenne' ? 'bg-yellow-500 text-white' :
                          cat.competition === 'élevée' ? 'bg-orange-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {cat.competition}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const text = kdpCategories.map((cat: any) => cat.category || cat).join('\n');
                    navigator.clipboard.writeText(text);
                    toast.success('Catégories copiées !');
                  }}
                >
                  Copier toutes les catégories
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Stratégie Prix
            </CardTitle>
            <CardDescription>
              Prix optimal et planning promotions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGeneratePricingStrategy}
              disabled={!ebookTitle || isGenerating}
              className="w-full"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              💰 Calculer prix optimal
            </Button>
            
            {pricingStrategy && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap text-sm flex-1">{pricingStrategy}</pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(pricingStrategy);
                      toast.success('Copié dans le presse-papier !');
                    }}
                  >
                    Copier
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Plan de Lancement
            </CardTitle>
            <CardDescription>
              Stratégie complète sur 90 jours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateLaunchPlan}
              disabled={!ebookTitle || isGenerating}
              className="w-full"
            >
              <Calendar className="h-4 w-4 mr-2" />
              🚀 Plan de lancement
            </Button>
            
            {launchPlan && (
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap text-sm flex-1">{launchPlan}</pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(launchPlan);
                      toast.success('Copié dans le presse-papier !');
                    }}
                  >
                    Copier
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Biographie Auteur
            </CardTitle>
            <CardDescription>
              3 versions de bio professionnelle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateAuthorBio}
              disabled={isGenerating}
              className="w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              👤 Créer biographie
            </Button>
            
            {authorBio && (
              <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-200 dark:border-pink-800">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap text-sm flex-1">{authorBio}</pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(authorBio);
                      toast.success('Copié dans le presse-papier !');
                    }}
                  >
                    Copier
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};