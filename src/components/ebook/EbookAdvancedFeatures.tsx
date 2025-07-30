
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Image, TrendingUp, DollarSign, Users, Target, BarChart3, 
  PieChart, MessageSquare, Lightbulb, Crown 
} from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useEbookGeneration';

interface EbookAdvancedFeaturesProps {
  ebookTitle: string;
  chapters: Chapter[];
  apiKey: string;
  isGenerating: boolean;
}

export const EbookAdvancedFeatures: React.FC<EbookAdvancedFeaturesProps> = ({
  ebookTitle,
  chapters,
  apiKey,
  isGenerating
}) => {
  const [targetAudience, setTargetAudience] = useState('');
  const [priceRange, setPriceRange] = useState<'budget' | 'premium' | 'luxury'>('budget');
  const [marketingBudget, setMarketingBudget] = useState('');

  const generateBookCover = async () => {
    if (!apiKey) {
      toast.error('Clé API OpenAI requise');
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `Crée une couverture de livre professionnelle pour un ebook intitulé "${ebookTitle}". Style moderne, couleurs attractives, typographie claire, design commercial.`,
          size: '1024x1024',
          quality: 'standard',
          n: 1
        })
      });

      if (!response.ok) throw new Error('Erreur API DALL-E');

      const data = await response.json();
      const imageUrl = data.data[0].url;
      
      // Ouvrir l'image dans un nouvel onglet
      window.open(imageUrl, '_blank');
      toast.success('Couverture générée ! Image ouverte dans un nouvel onglet.');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération de la couverture');
    }
  };

  const analyzeCompetition = async () => {
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
            content: `Analyse la concurrence pour un ebook sur "${ebookTitle}". 

Génère:
1. 5 livres concurrents populaires
2. Prix moyens du marché
3. Points faibles des concurrents
4. Opportunités de différenciation
5. Stratégies recommandées

Format de réponse structuré et détaillé.`
          }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const analysis = data.choices[0].message.content;
      
      navigator.clipboard.writeText(analysis);
      toast.success('Analyse concurrentielle copiée dans le presse-papiers !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'analyse concurrentielle');
    }
  };

  const generateMarketingPlan = async () => {
    if (!apiKey || !ebookTitle) {
      toast.error('Titre et clé API requis');
      return;
    }

    const audienceText = targetAudience || 'grand public';
    const budgetText = marketingBudget || 'budget limité';

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
            content: `Crée un plan marketing complet pour l'ebook "${ebookTitle}".

Public cible: ${audienceText}
Budget: ${budgetText}

Génère:
1. Stratégie de lancement (30 premiers jours)
2. Canaux de promotion recommandés
3. Calendrier éditorial pour 3 mois
4. 10 accroches publicitaires
5. Stratégie de prix progressive
6. Partenariats et collaborations suggérés
7. KPIs à suivre

Format détaillé et actionnable.`
          }],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const plan = data.choices[0].message.content;
      
      navigator.clipboard.writeText(plan);
      toast.success('Plan marketing copié dans le presse-papiers !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération du plan marketing');
    }
  };

  const calculateOptimalPrice = async () => {
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
            content: `Calcule le prix optimal pour un ebook "${ebookTitle}".

Données:
- Nombre de mots: ${wordCount}
- Nombre de chapitres: ${chapters.length}
- Catégorie de prix visée: ${priceRange}

Analyse:
1. Prix recommandé principal
2. 3 stratégies de prix différentes
3. Prix de lancement vs prix régulier
4. Comparaison avec la concurrence
5. Justification des prix proposés
6. Impact psychologique des prix

Présente sous forme de rapport détaillé.`
          }],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const pricing = data.choices[0].message.content;
      
      navigator.clipboard.writeText(pricing);
      toast.success('Analyse tarifaire copiée dans le presse-papiers !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du calcul des prix');
    }
  };

  const generateReaderSurvey = async () => {
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
            content: `Crée un questionnaire complet pour les lecteurs de l'ebook "${ebookTitle}".

Génère:
1. 10 questions pour valider l'intérêt AVANT publication
2. 10 questions de feedback APRÈS lecture  
3. Questions pour améliorer les prochaines versions
4. Questions pour identifier de nouveaux sujets d'ebooks
5. Format Google Forms prêt à utiliser

Mélange questions ouvertes et fermées, soyez stratégique pour maximiser les réponses.`
          }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const survey = data.choices[0].message.content;
      
      navigator.clipboard.writeText(survey);
      toast.success('Questionnaire lecteur copié dans le presse-papiers !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération du questionnaire');
    }
  };

  const generateBookTrailer = async () => {
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
            content: `Crée un script pour une bande-annonce vidéo de l'ebook "${ebookTitle}".

Génère:
1. Script de 60 secondes (narration)
2. Description des visuels pour chaque séquence
3. Musique et effets sonores recommandés
4. Call-to-action final percutant
5. 3 versions: courte (30s), moyenne (60s), longue (90s)
6. Conseils de tournage/montage

Format professionnel prêt pour production.`
          }],
          temperature: 0.8,
          max_tokens: 1200
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const script = data.choices[0].message.content;
      
      navigator.clipboard.writeText(script);
      toast.success('Script de bande-annonce copié dans le presse-papiers !');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération du script');
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Configuration Marketing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="audience">Public cible</Label>
            <Input
              id="audience"
              placeholder="Ex: Parents, Entrepreneurs, Étudiants..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="price-range">Gamme de prix</Label>
            <Select value={priceRange} onValueChange={(value: any) => setPriceRange(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">💰 Budget (5-15€)</SelectItem>
                <SelectItem value="premium">💎 Premium (15-50€)</SelectItem>
                <SelectItem value="luxury">👑 Luxe (50€+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budget">Budget marketing</Label>
            <Input
              id="budget"
              placeholder="Ex: 500€, Budget limité, Pas de budget..."
              value={marketingBudget}
              onChange={(e) => setMarketingBudget(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Outils créatifs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Couverture IA
            </CardTitle>
            <CardDescription>
              Générez une couverture avec DALL-E 3
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateBookCover}
              disabled={!apiKey || !ebookTitle || isGenerating}
              className="w-full"
            >
              <Image className="h-4 w-4 mr-2" />
              🎨 Générer la couverture
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Requiert DALL-E 3 (payant)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analyse Concurrence
            </CardTitle>
            <CardDescription>
              Étudiez vos concurrents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={analyzeCompetition}
              disabled={!apiKey || !ebookTitle || isGenerating}
              className="w-full"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              📊 Analyser la concurrence
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Plan Marketing
            </CardTitle>
            <CardDescription>
              Stratégie de lancement complète
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateMarketingPlan}
              disabled={!apiKey || !ebookTitle || isGenerating}
              className="w-full"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              🚀 Créer le plan marketing
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Prix Optimal
            </CardTitle>
            <CardDescription>
              Calcul automatique des prix
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={calculateOptimalPrice}
              disabled={!apiKey || !ebookTitle || isGenerating}
              className="w-full"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              💰 Calculer le prix optimal
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Questionnaire Lecteur
            </CardTitle>
            <CardDescription>
              Feedback et validation d'idées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateReaderSurvey}
              disabled={!apiKey || !ebookTitle || isGenerating}
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              📋 Créer le questionnaire
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Bande-annonce
            </CardTitle>
            <CardDescription>
              Script vidéo promotionnelle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateBookTrailer}
              disabled={!apiKey || !ebookTitle || isGenerating}
              className="w-full"
            >
              <Crown className="h-4 w-4 mr-2" />
              🎬 Script bande-annonce
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
