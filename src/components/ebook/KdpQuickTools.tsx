import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Tag, DollarSign, Sparkles, ChevronDown, Copy, BookOpen, 
  Target, TrendingUp, Loader2, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type KdpProductType = 'coloring' | 'comic' | 'diary' | 'documentary' | 'atlas' | 'encyclopedia';

interface KdpQuickToolsProps {
  productType: KdpProductType;
  title: string;
  pageCount: number;
  targetAudience?: string;
  theme?: string;
  defaultOpen?: boolean;
}

interface KdpData {
  keywords: string[];
  categories: string[];
  description: string;
  suggestedPrice: { min: number; max: number; optimal: number };
}

const PRODUCT_TYPE_LABELS: Record<KdpProductType, string> = {
  coloring: 'Livre de coloriage',
  comic: 'Bande dessinée',
  diary: 'Agenda / Journal intime',
  documentary: 'Livre documentaire',
  atlas: 'Atlas',
  encyclopedia: 'Encyclopédie',
};

const KDP_PRICE_RANGES: Record<KdpProductType, { min: number; max: number; optimal: number }> = {
  coloring: { min: 5.99, max: 12.99, optimal: 7.99 },
  comic: { min: 9.99, max: 19.99, optimal: 14.99 },
  diary: { min: 6.99, max: 14.99, optimal: 9.99 },
  documentary: { min: 12.99, max: 24.99, optimal: 17.99 },
  atlas: { min: 14.99, max: 29.99, optimal: 19.99 },
  encyclopedia: { min: 19.99, max: 34.99, optimal: 24.99 },
};

const KDP_CATEGORY_SUGGESTIONS: Record<KdpProductType, string[]> = {
  coloring: [
    'Books > Children\'s Books > Activities, Crafts & Games > Activity Books',
    'Books > Arts & Photography > Drawing > Coloring Books for Grown-Ups',
    'Books > Children\'s Books > Arts, Music & Photography',
  ],
  comic: [
    'Books > Comics & Graphic Novels > Graphic Novels',
    'Books > Children\'s Books > Comics & Graphic Novels',
    'Books > Teens > Literature & Fiction > Comics & Graphic Novels',
  ],
  diary: [
    'Books > Self-Help > Journal Writing',
    'Books > Reference > Diaries & Journals',
    'Books > Children\'s Books > Growing Up & Facts of Life > Friendship, Social Skills & School Life',
  ],
  documentary: [
    'Books > Nonfiction > Education & Reference',
    'Books > Science & Math > Essays & Commentary',
    'Books > History > World',
  ],
  atlas: [
    'Books > Reference > Atlases & Maps',
    'Books > Children\'s Books > Education & Reference > Geography',
    'Books > Travel > Reference > Atlases & Maps',
  ],
  encyclopedia: [
    'Books > Reference > Encyclopedias & Subject Guides',
    'Books > Children\'s Books > Education & Reference > Reference',
    'Books > Science & Math > Reference',
  ],
};

export const KdpQuickTools: React.FC<KdpQuickToolsProps> = ({
  productType,
  title,
  pageCount,
  targetAudience,
  theme,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isGenerating, setIsGenerating] = useState(false);
  const [kdpData, setKdpData] = useState<KdpData | null>(null);
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState('');
  
  // Synchroniser isOpen avec defaultOpen quand il change
  React.useEffect(() => {
    if (defaultOpen) {
      setIsOpen(true);
    }
  }, [defaultOpen]);
  
  // Auto-générer les données KDP si ouvert par défaut
  React.useEffect(() => {
    if (isOpen && !kdpData && !isGenerating && title) {
      generateKdpData();
    }
  }, [isOpen, title]);

  const generateKdpData = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'kdp-metadata',
          title,
          productType,
          pageCount,
          targetAudience,
          theme,
          model: 'google/gemini-2.5-flash',
        },
      });

      if (error) throw error;

      const content = data?.content || data?.result || '';
      
      // Parse la réponse IA
      let parsedData: KdpData;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        // Fallback avec données par défaut
        parsedData = {
          keywords: generateDefaultKeywords(),
          categories: KDP_CATEGORY_SUGGESTIONS[productType],
          description: generateDefaultDescription(),
          suggestedPrice: KDP_PRICE_RANGES[productType],
        };
      }

      setKdpData(parsedData);
      setCustomKeywords(parsedData.keywords || []);
      setCustomDescription(parsedData.description || '');
      toast.success('Métadonnées KDP générées !');
    } catch (error) {
      console.error('Erreur génération KDP:', error);
      // Utiliser les valeurs par défaut
      const defaultData: KdpData = {
        keywords: generateDefaultKeywords(),
        categories: KDP_CATEGORY_SUGGESTIONS[productType],
        description: generateDefaultDescription(),
        suggestedPrice: KDP_PRICE_RANGES[productType],
      };
      setKdpData(defaultData);
      setCustomKeywords(defaultData.keywords);
      setCustomDescription(defaultData.description);
      toast.info('Métadonnées par défaut chargées');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDefaultKeywords = (): string[] => {
    const baseKeywords = [PRODUCT_TYPE_LABELS[productType].toLowerCase()];
    if (theme) baseKeywords.push(theme.toLowerCase());
    if (targetAudience) baseKeywords.push(targetAudience);
    
    const typeKeywords: Record<KdpProductType, string[]> = {
      coloring: ['coloriage', 'activités enfants', 'dessin', 'créativité', 'détente', 'anti-stress'],
      comic: ['bande dessinée', 'BD', 'comics', 'aventure', 'illustrations', 'histoire illustrée'],
      diary: ['journal intime', 'agenda', 'organisation', 'planificateur', 'bien-être', 'développement personnel'],
      documentary: ['documentaire', 'non-fiction', 'éducatif', 'informatif', 'culture générale', 'découverte'],
      atlas: ['atlas', 'géographie', 'cartes', 'monde', 'pays', 'régions'],
      encyclopedia: ['encyclopédie', 'référence', 'savoir', 'connaissances', 'complet', 'guide'],
    };

    return [...baseKeywords, ...typeKeywords[productType]].slice(0, 7);
  };

  const generateDefaultDescription = (): string => {
    const templates: Record<KdpProductType, string> = {
      coloring: `Découvrez "${title}" - un livre de coloriage captivant avec ${pageCount} pages d'illustrations originales. Parfait pour ${targetAudience || 'tous les âges'}, ce livre offre des heures de créativité et de détente. Chaque page a été conçue pour stimuler l'imagination tout en développant la concentration et la motricité fine.`,
      comic: `"${title}" est une bande dessinée passionnante de ${pageCount} pages. Une aventure illustrée captivante pour ${targetAudience || 'les lecteurs de tous âges'}. Des illustrations dynamiques et une histoire palpitante vous attendent dans ce récit visuel unique.`,
      diary: `Organisez votre vie avec "${title}" - un journal/agenda de ${pageCount} pages conçu pour ${targetAudience || 'vous'}. Des pages pratiques pour planifier, réfléchir et grandir. Le compagnon idéal pour votre développement personnel et votre organisation quotidienne.`,
      documentary: `"${title}" est un ouvrage documentaire de ${pageCount} pages explorant ${theme || 'des sujets fascinants'}. Une lecture enrichissante pour ${targetAudience || 'les curieux'}, combinant recherches approfondies et présentation accessible.`,
      atlas: `Explorez le monde avec "${title}" - un atlas de ${pageCount} pages. Des cartes détaillées et des informations précieuses pour ${targetAudience || 'les explorateurs'}. Une référence indispensable pour découvrir et comprendre notre planète.`,
      encyclopedia: `"${title}" est une encyclopédie complète de ${pageCount} pages. Un ouvrage de référence essentiel pour ${targetAudience || 'les passionnés de savoir'}. Des informations précises et accessibles sur ${theme || 'de nombreux sujets'}.`,
    };
    return templates[productType];
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  const priceRange = KDP_PRICE_RANGES[productType];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-amber-200 dark:border-amber-800 bg-card text-card-foreground">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-amber-500/10 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                <span>Outils KDP Amazon</span>
                <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/40">
                  Publication
                </Badge>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Bouton génération IA */}
            <Button 
              onClick={generateKdpData} 
              disabled={isGenerating || !title}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer les métadonnées KDP
                </>
              )}
            </Button>

            {/* Prix suggéré */}
            <div className="p-4 bg-card text-card-foreground rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-green-400" />
                <h4 className="font-semibold">Prix suggéré</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Minimum</div>
                  <div className="text-lg font-bold text-foreground">{priceRange.min}€</div>
                </div>
                <div className="p-3 bg-green-500/15 rounded-lg border-2 border-green-500">
                  <div className="text-sm text-green-400">Optimal</div>
                  <div className="text-xl font-bold text-green-400">{priceRange.optimal}€</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Maximum</div>
                  <div className="text-lg font-bold text-foreground">{priceRange.max}€</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Basé sur {pageCount} pages pour un {PRODUCT_TYPE_LABELS[productType]}
              </p>
            </div>

            {/* Mots-clés */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">Mots-clés KDP (7 max)</h4>
                </div>
                {customKeywords.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(customKeywords.join(', '), 'Mots-clés')}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copier
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(customKeywords.length > 0 ? customKeywords : generateDefaultKeywords()).map((kw, i) => (
                  <Badge key={i} variant="secondary" className="bg-blue-500/20 text-blue-200">
                    {kw}
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Ajouter un mot-clé personnalisé..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value && customKeywords.length < 7) {
                    setCustomKeywords([...customKeywords, e.currentTarget.value]);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>

            {/* Catégories */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold">Catégories suggérées</h4>
              </div>
              <div className="space-y-2">
                {(kdpData?.categories || KDP_CATEGORY_SUGGESTIONS[productType]).map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-purple-500/10 rounded border border-purple-200 dark:border-purple-800">
                    <span className="text-sm text-foreground">{cat}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(cat, 'Catégorie')}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold">Description KDP</h4>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(customDescription || generateDefaultDescription(), 'Description')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copier
                </Button>
              </div>
              <Textarea
                value={customDescription || generateDefaultDescription()}
                onChange={(e) => setCustomDescription(e.target.value)}
                rows={5}
                className="resize-none"
                placeholder="Description pour Amazon KDP..."
              />
              <p className="text-xs text-muted-foreground">
                {(customDescription || generateDefaultDescription()).length}/4000 caractères
              </p>
            </div>

            {/* Checklist */}
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Checklist publication
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${pageCount >= 24 ? 'text-green-400' : 'text-red-500'}`} />
                  <span className={pageCount >= 24 ? 'text-green-400' : 'text-red-400'}>
                    Minimum 24 pages ({pageCount} pages)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${title ? 'text-green-400' : 'text-gray-400'}`} />
                  <span className="text-foreground">Titre défini</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${customKeywords.length >= 5 ? 'text-green-400' : 'text-yellow-500'}`} />
                  <span className="text-foreground">5-7 mots-clés ({customKeywords.length}/7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${(customDescription || '').length > 100 ? 'text-green-400' : 'text-yellow-500'}`} />
                  <span className="text-foreground">Description complète</span>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default KdpQuickTools;
