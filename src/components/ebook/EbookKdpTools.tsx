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
import { Chapter } from '@/hooks/useEbookGeneration';

interface EbookKdpToolsProps {
  ebookTitle: string;
  chapters: Chapter[];
  apiKey: string;
  isGenerating: boolean;
}

export const EbookKdpTools: React.FC<EbookKdpToolsProps> = ({
  ebookTitle,
  chapters,
  apiKey,
  isGenerating
}) => {
  const [targetLanguage, setTargetLanguage] = useState('français');
  const [genre, setGenre] = useState('');
  const [targetAge, setTargetAge] = useState('');
  const [kdpDescription, setKdpDescription] = useState('');
  const [kdpKeywords, setKdpKeywords] = useState('');
  const [kdpCategories, setKdpCategories] = useState('');
  const [pricingStrategy, setPricingStrategy] = useState('');
  const [launchPlan, setLaunchPlan] = useState('');
  const [authorBio, setAuthorBio] = useState('');

  const generateKdpDescription = async () => {
    if (!apiKey || !ebookTitle) {
      toast.error('Titre et clé API requis');
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Crée une description Amazon KDP optimisée pour l'ebook "${ebookTitle}".

La description doit:
1. Accrocher le lecteur dès les premières lignes
2. Présenter clairement les bénéfices du livre
3. Utiliser des mots-clés pertinents pour le SEO
4. Créer l'urgence d'achat
5. Respecter les 4000 caractères maximum de KDP
6. Inclure des puces pour la lisibilité
7. Se terminer par un appel à l'action fort

Genre: ${genre || 'non spécifié'}
Public cible: ${targetAge || 'tout public'}
Langue: ${targetLanguage}

Format HTML basique autorisé pour KDP.`
          }],
          temperature: 0.8,
          max_tokens: 800
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const description = data.choices[0].message.content;
      
      setKdpDescription(description);
      toast.success('Description KDP générée !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération de la description KDP');
    }
  };

  const generateKdpKeywords = async () => {
    if (!apiKey || !ebookTitle) {
      toast.error('Titre et clé API requis');
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Génère les 7 mots-clés optimaux pour Amazon KDP pour l'ebook "${ebookTitle}".

Critères:
- Maximum 50 caractères par mot-clé
- Mots-clés à fort volume de recherche
- Faible concurrence
- Pertinents pour le contenu
- Adaptés au public ${targetAge || 'général'}
- En ${targetLanguage}

Genre: ${genre || 'non spécifié'}

Format: Liste numérotée, un mot-clé par ligne.
Ajoute aussi 10 mots-clés secondaires pour backup.`
          }],
          temperature: 0.7,
          max_tokens: 600
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const keywords = data.choices[0].message.content;
      
      setKdpKeywords(keywords);
      toast.success('Mots-clés KDP générés !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération des mots-clés');
    }
  };

  const generateKdpCategories = async () => {
    if (!apiKey || !ebookTitle) {
      toast.error('Titre et clé API requis');
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Recommande les meilleures catégories Amazon KDP pour l'ebook "${ebookTitle}".

Analyse:
1. 3 catégories principales recommandées
2. 5 catégories alternatives
3. Niveau de concurrence pour chaque catégorie
4. Potentiel de ranking dans chaque catégorie
5. Conseils pour optimiser le placement

Genre: ${genre || 'non spécifié'}
Public: ${targetAge || 'tout public'}
Langue: ${targetLanguage}

Donne les chemins complets des catégories KDP.`
          }],
          temperature: 0.7,
          max_tokens: 700
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const categories = data.choices[0].message.content;
      
      setKdpCategories(categories);
      toast.success('Catégories KDP générées !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération des catégories');
    }
  };

  const generateKdpPricingStrategy = async () => {
    if (!apiKey || !ebookTitle) {
      toast.error('Titre et clé API requis');
      return;
    }

    const wordCount = chapters.reduce((total, chapter) => {
      const chapterWords = chapter.content ? chapter.content.split(' ').length : 0;
      const subChapterWords = chapter.subChapters.reduce((subTotal, sub) => {
        return subTotal + (sub.content ? sub.content.split(' ').length : 0);
      }, 0);
      return total + chapterWords + subChapterWords;
    }, 0);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Crée une stratégie de prix Amazon KDP pour l'ebook "${ebookTitle}".

Données:
- Nombre de mots: ${wordCount}
- Genre: ${genre || 'non spécifié'}
- Public: ${targetAge || 'tout public'}
- Marché: ${targetLanguage}

Analyse:
1. Prix de lancement optimal (30 premiers jours)
2. Prix régulier recommandé
3. Stratégie de promotion (prix réduits)
4. Comparaison avec la concurrence
5. Calcul des royalties (35% vs 70%)
6. Calendrier de prix sur 6 mois
7. Prix psychologiques optimal (0.99, 2.99, etc.)

Format détaillé avec justifications.`
          }],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const strategy = data.choices[0].message.content;
      
      setPricingStrategy(strategy);
      toast.success('Stratégie de prix KDP générée !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération de la stratégie de prix');
    }
  };

  const generateLaunchPlan = async () => {
    if (!apiKey || !ebookTitle) {
      toast.error('Titre et clé API requis');
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Crée un plan de lancement Amazon KDP complet pour "${ebookTitle}".

Plan sur 90 jours:

SEMAINES 1-2 (Pré-lancement):
- Checklist complète avant publication
- Tests A/B de couverture et titre
- Constitution d'une liste email
- Recherche d'influenceurs du secteur

SEMAINES 3-4 (Lancement):
- Stratégie jour J
- Demandes de reviews
- Posts réseaux sociaux
- Promotions flash

SEMAINES 5-12 (Post-lancement):
- Optimisations continues
- Campagnes publicitaires Amazon
- Partenariats et collaborations
- Analyse des KPIs

Genre: ${genre || 'non spécifié'}
Public: ${targetAge || 'tout public'}

Format actionnable avec dates précises.`
          }],
          temperature: 0.8,
          max_tokens: 1000
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const plan = data.choices[0].message.content;
      
      setLaunchPlan(plan);
      toast.success('Plan de lancement généré !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération du plan de lancement');
    }
  };

  const generateAuthorBio = async () => {
    if (!apiKey) {
      toast.error('Clé API requise');
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Crée 3 versions de biographie d'auteur pour Amazon KDP:

1. VERSION COURTE (100 mots)
2. VERSION MOYENNE (200 mots) 
3. VERSION LONGUE (300 mots)

Pour un auteur qui a écrit "${ebookTitle}".

Inclus:
- Crédibilité et expertise
- Ton personnel et authentique
- Appel à suivre l'auteur
- Mention d'autres livres (fictifs si besoin)
- Contact réseaux sociaux

Genre: ${genre || 'non spécifié'}
Adapte le ton au public ${targetAge || 'général'}.`
          }],
          temperature: 0.8,
          max_tokens: 700
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const bio = data.choices[0].message.content;
      
      setAuthorBio(bio);
      toast.success('Biographies d\'auteur générées !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération de la biographie');
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
              onClick={generateKdpDescription}
              disabled={!apiKey || !ebookTitle || isGenerating}
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
              Mots-clés KDP
            </CardTitle>
            <CardDescription>
              7 mots-clés optimaux pour le SEO
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateKdpKeywords}
              disabled={!apiKey || !ebookTitle || isGenerating}
              className="w-full"
            >
              <Tag className="h-4 w-4 mr-2" />
              🏷️ Générer mots-clés
            </Button>
            
            {kdpKeywords && (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap text-sm flex-1">{kdpKeywords}</pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(kdpKeywords);
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
              <BarChart3 className="h-5 w-5" />
              Catégories KDP
            </CardTitle>
            <CardDescription>
              Placement optimal dans les catégories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateKdpCategories}
              disabled={!apiKey || !ebookTitle || isGenerating}
              className="w-full"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              📊 Analyser catégories
            </Button>
            
            {kdpCategories && (
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap text-sm flex-1">{kdpCategories}</pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(kdpCategories);
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
              <DollarSign className="h-5 w-5" />
              Stratégie Prix
            </CardTitle>
            <CardDescription>
              Prix optimal et planning promotions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateKdpPricingStrategy}
              disabled={!apiKey || !ebookTitle || isGenerating}
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
              onClick={generateLaunchPlan}
              disabled={!apiKey || !ebookTitle || isGenerating}
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
              onClick={generateAuthorBio}
              disabled={!apiKey || isGenerating}
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