import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, Tag, Globe, TrendingUp, DollarSign, 
  Star, Users, Target, Calendar, BarChart3, Sparkles,
  CheckCircle, Quote, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useSubscriptionGeneration, Chapter } from '@/hooks/useSubscriptionGeneration';

interface APlusContent {
  brand_story: { headline: string; body: string };
  hero_module: { headline: string; body: string };
  key_features: Array<{ icon_suggestion: string; title: string; description: string }>;
  comparison_chart: { title: string; items: Array<{ feature: string; included: boolean; detail: string }> };
  ideal_reader: { headline: string; points: string[] };
  testimonial_templates: Array<{ quote: string; attribution: string }>;
  call_to_action: { headline: string; body: string; button_text: string };
}

interface EbookKdpToolsProps {
  ebookTitle: string;
  authorName: string;
  chapters: Chapter[];
  apiKey: string;
  targetAudience: string;
  bookSummary?: string;
}

export const EbookKdpTools: React.FC<EbookKdpToolsProps> = ({
  ebookTitle,
  authorName,
  chapters,
  apiKey,
  targetAudience,
  bookSummary
}) => {
  const { 
    isGenerating,
    generateKDPDescription, 
    generateKDPKeywords, 
    generateKDPCategories,
    generatePricingStrategy,
    generateLaunchPlan,
    generateAuthorBio,
    generateAPlusContent
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
  const [aPlusContent, setAPlusContent] = useState<APlusContent | null>(null);

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

  const handleGenerateAPlusContent = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    const result = await generateAPlusContent(ebookTitle, authorName, chapters, bookSummary);
    if (result) {
      setAPlusContent(result);
      toast.success('Contenu A+ généré avec succès !');
    }
  };

  const copyAPlusSection = (sectionName: string, content: string) => {
    navigator.clipboard.writeText(content);
    toast.success(`${sectionName} copié !`);
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

      {/* A+ Content Generator */}
      <Card className="border-2 border-amber-300 dark:border-amber-700">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            Générateur A+ Content Amazon
          </CardTitle>
          <CardDescription>
            Créez du contenu enrichi cohérent pour votre page produit Amazon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Button 
            onClick={handleGenerateAPlusContent}
            disabled={!ebookTitle || isGenerating}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            ✨ Générer le contenu A+ complet
          </Button>
          
          {aPlusContent && (
            <div className="space-y-6 mt-6">
              {/* Brand Story */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Histoire de la Marque
                  </h4>
                  <Button size="sm" variant="outline" onClick={() => copyAPlusSection('Histoire', `${aPlusContent.brand_story.headline}\n\n${aPlusContent.brand_story.body}`)}>
                    Copier
                  </Button>
                </div>
                <p className="font-bold text-lg mb-2">{aPlusContent.brand_story.headline}</p>
                <p className="text-sm text-muted-foreground">{aPlusContent.brand_story.body}</p>
              </div>

              {/* Hero Module */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Module Hero
                  </h4>
                  <Button size="sm" variant="outline" onClick={() => copyAPlusSection('Hero', `${aPlusContent.hero_module.headline}\n\n${aPlusContent.hero_module.body}`)}>
                    Copier
                  </Button>
                </div>
                <p className="font-bold text-lg mb-2">{aPlusContent.hero_module.headline}</p>
                <p className="text-sm text-muted-foreground">{aPlusContent.hero_module.body}</p>
              </div>

              {/* Key Features */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Caractéristiques Clés
                  </h4>
                  <Button size="sm" variant="outline" onClick={() => copyAPlusSection('Caractéristiques', aPlusContent.key_features.map(f => `${f.icon_suggestion} ${f.title}\n${f.description}`).join('\n\n'))}>
                    Copier
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aPlusContent.key_features.map((feature, idx) => (
                    <div key={idx} className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <p className="font-medium flex items-center gap-2">
                        <span className="text-xl">{feature.icon_suggestion}</span>
                        {feature.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="p-4 bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 rounded-lg border border-cyan-200 dark:border-cyan-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-cyan-800 dark:text-cyan-200 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {aPlusContent.comparison_chart.title}
                  </h4>
                  <Button size="sm" variant="outline" onClick={() => copyAPlusSection('Tableau', aPlusContent.comparison_chart.items.map(i => `✓ ${i.feature}: ${i.detail}`).join('\n'))}>
                    Copier
                  </Button>
                </div>
                <div className="space-y-2">
                  {aPlusContent.comparison_chart.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-white/50 dark:bg-black/20 rounded">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <div>
                        <span className="font-medium">{item.feature}</span>
                        <span className="text-sm text-muted-foreground ml-2">— {item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal Reader */}
              <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30 rounded-lg border border-rose-200 dark:border-rose-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-rose-800 dark:text-rose-200 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {aPlusContent.ideal_reader.headline}
                  </h4>
                  <Button size="sm" variant="outline" onClick={() => copyAPlusSection('Lecteur idéal', aPlusContent.ideal_reader.points.join('\n'))}>
                    Copier
                  </Button>
                </div>
                <ul className="space-y-2">
                  {aPlusContent.ideal_reader.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-rose-500">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial Templates */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <Quote className="h-4 w-4" />
                    Modèles de Témoignages
                  </h4>
                  <Button size="sm" variant="outline" onClick={() => copyAPlusSection('Témoignages', aPlusContent.testimonial_templates.map(t => `"${t.quote}"\n— ${t.attribution}`).join('\n\n'))}>
                    Copier
                  </Button>
                </div>
                <div className="space-y-3">
                  {aPlusContent.testimonial_templates.map((testimonial, idx) => (
                    <div key={idx} className="p-3 bg-white/50 dark:bg-black/20 rounded-lg italic">
                      <p className="text-sm">"{testimonial.quote}"</p>
                      <p className="text-xs text-muted-foreground mt-2 not-italic">— {testimonial.attribution}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-950/40 dark:to-red-950/40 rounded-lg border-2 border-orange-300 dark:border-orange-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Appel à l'Action
                  </h4>
                  <Button size="sm" variant="outline" onClick={() => copyAPlusSection('CTA', `${aPlusContent.call_to_action.headline}\n\n${aPlusContent.call_to_action.body}\n\n[${aPlusContent.call_to_action.button_text}]`)}>
                    Copier
                  </Button>
                </div>
                <p className="font-bold text-lg mb-2">{aPlusContent.call_to_action.headline}</p>
                <p className="text-sm text-muted-foreground mb-3">{aPlusContent.call_to_action.body}</p>
                <div className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg font-medium">
                  {aPlusContent.call_to_action.button_text}
                </div>
              </div>

              {/* Copy All Button */}
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  const fullContent = `=== CONTENU A+ AMAZON ===

📖 HISTOIRE DE LA MARQUE
${aPlusContent.brand_story.headline}
${aPlusContent.brand_story.body}

⚡ MODULE HERO
${aPlusContent.hero_module.headline}
${aPlusContent.hero_module.body}

⭐ CARACTÉRISTIQUES CLÉS
${aPlusContent.key_features.map(f => `${f.icon_suggestion} ${f.title}\n${f.description}`).join('\n\n')}

📊 ${aPlusContent.comparison_chart.title.toUpperCase()}
${aPlusContent.comparison_chart.items.map(i => `✓ ${i.feature}: ${i.detail}`).join('\n')}

🎯 ${aPlusContent.ideal_reader.headline.toUpperCase()}
${aPlusContent.ideal_reader.points.map(p => `• ${p}`).join('\n')}

💬 TÉMOIGNAGES
${aPlusContent.testimonial_templates.map(t => `"${t.quote}"\n— ${t.attribution}`).join('\n\n')}

🚀 APPEL À L'ACTION
${aPlusContent.call_to_action.headline}
${aPlusContent.call_to_action.body}
[${aPlusContent.call_to_action.button_text}]`;
                  navigator.clipboard.writeText(fullContent);
                  toast.success('Tout le contenu A+ copié !');
                }}
              >
                📋 Copier tout le contenu A+
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};