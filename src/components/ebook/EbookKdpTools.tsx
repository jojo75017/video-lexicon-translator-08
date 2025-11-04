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
  isGenerating: boolean;
}

export const EbookKdpTools: React.FC<EbookKdpToolsProps> = ({
  ebookTitle,
  chapters,
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
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    toast.info('Fonctionnalité disponible via la page de gestion');
  };

  const generateKdpKeywords = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    toast.info('Fonctionnalité disponible via la page de gestion');
  };

  const generateKdpCategories = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    toast.info('Fonctionnalité disponible via la page de gestion');
  };

  const generateKdpPricingStrategy = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    toast.info('Fonctionnalité disponible via la page de gestion');
  };

  const generateLaunchPlan = async () => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }
    toast.info('Fonctionnalité disponible via la page de gestion');
  };

  const generateAuthorBio = async () => {
    toast.info('Fonctionnalité disponible via la page de gestion');
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
              Mots-clés KDP
            </CardTitle>
            <CardDescription>
              7 mots-clés optimaux pour le SEO
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateKdpKeywords}
              disabled={!ebookTitle || isGenerating}
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
              disabled={!ebookTitle || isGenerating}
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
              onClick={generateLaunchPlan}
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
              onClick={generateAuthorBio}
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