
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Image, TrendingUp, DollarSign, Users, Target, BarChart3, 
  PieChart, MessageSquare, Lightbulb, Crown, Copy 
} from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useEbookGeneration';

interface EbookAdvancedFeaturesProps {
  ebookTitle: string;
  chapters: Chapter[];
  isGenerating: boolean;
}

export const EbookAdvancedFeatures: React.FC<EbookAdvancedFeaturesProps> = ({
  ebookTitle,
  chapters,
  isGenerating
}) => {
  const [targetAudience, setTargetAudience] = useState('');
  const [priceRange, setPriceRange] = useState<'budget' | 'premium' | 'luxury'>('budget');
  const [marketingBudget, setMarketingBudget] = useState('');
  
  const [marketingPlan, setMarketingPlan] = useState('');
  const [pricingAnalysis, setPricingAnalysis] = useState('');
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');
  const [readerSurvey, setReaderSurvey] = useState('');
  const [trailerScript, setTrailerScript] = useState('');

  const generateBookCover = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    toast.info('Fonctionnalité disponible via la page de gestion');
  };

  const generateMarketingPlan = async () => {
    toast.info('Fonctionnalité disponible prochainement');
  };

  const calculateOptimalPrice = async () => {
    toast.info('Fonctionnalité disponible prochainement');
  };

  const generateReaderSurvey = async () => {
    toast.info('Fonctionnalité disponible prochainement');
  };

  const generateBookTrailer = async () => {
    toast.info('Fonctionnalité disponible prochainement');
  };

  const analyzeCompetition = async () => {
    toast.info('Fonctionnalité disponible prochainement');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier !');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">🚀 Fonctionnalités Avancées</h2>
        <p className="text-muted-foreground">
          Outils professionnels pour maximiser le succès de votre ebook
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-purple-600" />
              Couverture IA
            </CardTitle>
            <CardDescription>
              Générez une couverture avec DALL-E 3
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateBookCover}
              disabled={!ebookTitle || isGenerating}
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

        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Analyse Concurrence
            </CardTitle>
            <CardDescription>
              Positionnement marché et opportunités
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={analyzeCompetition}
              disabled={!ebookTitle || isGenerating}
              className="w-full"
            >
              <Target className="h-4 w-4 mr-2" />
              🔍 Analyser la concurrence
            </Button>
            
            {competitorAnalysis && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap text-sm flex-1">{competitorAnalysis}</pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(competitorAnalysis)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Plan Marketing
            </CardTitle>
            <CardDescription>
              Stratégie de lancement complète
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateMarketingPlan}
              disabled={!ebookTitle || isGenerating}
              className="w-full"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              🚀 Créer le plan marketing
            </Button>
            
            {marketingPlan && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap text-sm flex-1">{marketingPlan}</pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(marketingPlan)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              Analyse Prix
            </CardTitle>
            <CardDescription>
              Calcul automatique des prix
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={calculateOptimalPrice}
              disabled={!ebookTitle || isGenerating}
              className="w-full"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              💰 Calculer le prix optimal
            </Button>
            
            {pricingAnalysis && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap text-sm flex-1">{pricingAnalysis}</pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(pricingAnalysis)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-violet-600" />
              Questionnaire Lecteur
            </CardTitle>
            <CardDescription>
              Feedback et validation d'idées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateReaderSurvey}
              disabled={!ebookTitle || isGenerating}
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              📋 Créer le questionnaire
            </Button>
            
            {readerSurvey && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap text-sm flex-1">{readerSurvey}</pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(readerSurvey)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              Bande-annonce
            </CardTitle>
            <CardDescription>
              Script vidéo promotionnelle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateBookTrailer}
              disabled={!ebookTitle || isGenerating}
              className="w-full"
            >
              <Crown className="h-4 w-4 mr-2" />
              🎬 Script bande-annonce
            </Button>
            
            {trailerScript && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap text-sm flex-1">{trailerScript}</pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(trailerScript)}
                  >
                    <Copy className="h-3 w-3" />
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
