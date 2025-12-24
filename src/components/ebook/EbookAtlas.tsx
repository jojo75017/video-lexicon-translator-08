import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Map, Globe, Wand2, Loader2, FileText, 
  Plus, Trash2, Download, Copy, Sparkles, 
  Compass, Mountain, TreeDeciduous, Waves, Fish, Bird
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface LocationCard {
  id: string;
  name: string;
  region: string;
  country: string;
  type: string;
  description: string;
  geography: string;
  climate: string;
  flora: string;
  fauna: string;
  bestTime: string;
  practicalInfo: string;
  imagePrompt?: string;
}

interface EbookAtlasProps {
  onInsertContent?: (content: string) => void;
}

const atlasTypes = [
  {
    id: 'freshwater-habitats',
    label: 'Habitats eau douce (aquariophilie)',
    icon: Waves,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    description: 'Biotopes naturels des poissons d\'aquarium : Amazonie, Asie du Sud-Est, Grands Lacs Africains...'
  },
  {
    id: 'european-forests',
    label: 'Forêts et lisières d\'Europe',
    icon: TreeDeciduous,
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-500/10',
    description: 'Écosystèmes forestiers européens : forêts tempérées, lisières, clairières et leurs habitants...'
  },
  {
    id: 'birdwatching-spots',
    label: 'Sites d\'observation ornithologique',
    icon: Bird,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    description: 'Meilleurs spots pour observer les oiseaux en Europe : réserves, parcs naturels, zones humides...'
  }
];

const EbookAtlas: React.FC<EbookAtlasProps> = ({ onInsertContent }) => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [locationName, setLocationName] = useState('');
  const [numberOfCards, setNumberOfCards] = useState(5);
  const [cards, setCards] = useState<LocationCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const generateCards = async () => {
    if (!selectedType) {
      toast.error('Veuillez sélectionner un type d\'atlas');
      return;
    }

    setIsGenerating(true);

    try {
      let prompt = '';
      
      if (selectedType === 'freshwater-habitats') {
        prompt = `Tu es un expert en aquariophilie et en écologie des milieux aquatiques. Génère ${numberOfCards} fiches atlas détaillées sur des biotopes d'eau douce naturels${locationName ? ` en te concentrant sur: ${locationName}` : ''}.

${customPrompt ? `Instructions supplémentaires: ${customPrompt}\n\n` : ''}

Ces biotopes sont les habitats naturels des poissons d'aquarium populaires. Pour chaque biotope, fournis une fiche complète au format JSON avec:
- name: nom du biotope (ex: "Rio Negro", "Lac Tanganyika", "Rivières de Bornéo")
- region: région géographique précise
- country: pays ou zone géographique
- type: type d'habitat (fleuve, lac, rivière, marais, estuaire)
- description: description générale du biotope et son importance pour l'aquariophilie
- geography: caractéristiques géographiques (profondeur, courant, substrat, végétation aquatique)
- climate: climat et variations saisonnières, paramètres de l'eau (pH, dureté, température)
- flora: plantes aquatiques typiques
- fauna: espèces de poissons emblématiques pour l'aquariophilie
- bestTime: meilleure période pour un biotope aquarium (conseils saisonniers)
- practicalInfo: conseils pour recréer ce biotope en aquarium
- imagePrompt: description pour illustrer le biotope

Retourne UNIQUEMENT un tableau JSON valide, sans texte avant ou après.`;
      } else if (selectedType === 'european-forests') {
        prompt = `Tu es un écologue expert des écosystèmes forestiers européens. Génère ${numberOfCards} fiches atlas détaillées sur des forêts et lisières d'Europe${locationName ? ` en te concentrant sur: ${locationName}` : ''}.

${customPrompt ? `Instructions supplémentaires: ${customPrompt}\n\n` : ''}

Pour chaque lieu, fournis une fiche complète au format JSON avec:
- name: nom de la forêt ou zone forestière
- region: région/département/land
- country: pays
- type: type de forêt (chênaie, hêtraie, forêt mixte, forêt boréale, etc.)
- description: description générale et particularités
- geography: relief, altitude, sols, cours d'eau
- climate: climat local et microclimats forestiers
- flora: espèces végétales caractéristiques (arbres, arbustes, sous-bois, champignons)
- fauna: faune typique avec accent sur les oiseaux forestiers
- bestTime: meilleures saisons pour l'observation naturaliste
- practicalInfo: accès, sentiers, points d'observation, réglementation
- imagePrompt: description pour illustrer l'écosystème

Retourne UNIQUEMENT un tableau JSON valide, sans texte avant ou après.`;
      } else if (selectedType === 'birdwatching-spots') {
        prompt = `Tu es un ornithologue passionné et guide nature expérimenté. Génère ${numberOfCards} fiches atlas détaillées sur des sites d'observation ornithologique en Europe${locationName ? ` en te concentrant sur: ${locationName}` : ''}.

${customPrompt ? `Instructions supplémentaires: ${customPrompt}\n\n` : ''}

Pour chaque site, fournis une fiche complète au format JSON avec:
- name: nom du site (réserve, parc, zone humide)
- region: région précise
- country: pays
- type: type de site (réserve naturelle, parc national, zone humide, forêt protégée)
- description: présentation du site et son importance ornithologique
- geography: caractéristiques du paysage (étangs, roselières, prairies, boisements)
- climate: conditions météo typiques, migrations
- flora: habitats végétaux favorables aux oiseaux
- fauna: espèces d'oiseaux emblématiques (résidents et migrateurs), meilleures observations
- bestTime: meilleurs mois et heures pour l'observation, périodes de migration
- practicalInfo: accès, équipement recommandé, affûts, guides locaux, hébergement
- imagePrompt: description pour illustrer le site et son avifaune

Retourne UNIQUEMENT un tableau JSON valide, sans texte avant ou après.`;
      }

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt,
          type: 'atlas',
          maxTokens: 4000
        }
      });

      if (error) throw error;

      let generatedCards: LocationCard[] = [];
      
      try {
        let content = data.content || data;
        if (typeof content === 'string') {
          content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          generatedCards = JSON.parse(content);
        } else if (Array.isArray(content)) {
          generatedCards = content;
        }

        generatedCards = generatedCards.map((card, index) => ({
          ...card,
          id: `location-${Date.now()}-${index}`
        }));

        setCards(prev => [...prev, ...generatedCards]);
        toast.success(`${generatedCards.length} fiches atlas générées !`);
      } catch (parseError) {
        console.error('Erreur parsing:', parseError);
        toast.error('Erreur lors de l\'analyse des fiches');
      }

    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const removeCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    toast.success('Fiche supprimée');
  };

  const formatCardAsText = (card: LocationCard): string => {
    return `# ${card.name}

**Région:** ${card.region}, ${card.country}
**Type:** ${card.type}

## Description
${card.description}

## Géographie
${card.geography}

## Climat
${card.climate}

## Flore
${card.flora}

## Faune
${card.fauna}

## Meilleure période
${card.bestTime}

## Informations pratiques
${card.practicalInfo}

---
`;
  };

  const copyCardContent = (card: LocationCard) => {
    navigator.clipboard.writeText(formatCardAsText(card));
    toast.success('Fiche copiée');
  };

  const insertCard = (card: LocationCard) => {
    if (onInsertContent) {
      onInsertContent(formatCardAsText(card));
      toast.success('Fiche insérée');
    }
  };

  const exportAllCards = () => {
    const content = cards.map(formatCardAsText).join('\n\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-${selectedType}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Atlas exporté !');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-emerald-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Atlas Naturaliste</CardTitle>
              <CardDescription>
                Générez des fiches géographiques et écologiques pour vos ebooks nature
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sélection du type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Choisissez votre atlas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {atlasTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected 
                      ? `border-transparent bg-gradient-to-br ${type.color} text-white shadow-lg scale-[1.02]`
                      : `border-border hover:border-primary/50 ${type.bgColor}`
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className={`p-2 rounded-lg w-fit ${isSelected ? 'bg-white/20' : 'bg-background'}`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <h3 className={`font-semibold ${isSelected ? 'text-white' : ''}`}>
                      {type.label}
                    </h3>
                    <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {type.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      {selectedType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-500" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lieu(x) spécifique(s) (optionnel)</Label>
                <Input
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder={
                    selectedType === 'freshwater-habitats' 
                      ? 'Ex: Amazonie, Lac Malawi...'
                      : selectedType === 'european-forests'
                        ? 'Ex: Forêt de Fontainebleau...'
                        : 'Ex: Camargue, Baie de Somme...'
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>Nombre de fiches</Label>
                <Select value={numberOfCards.toString()} onValueChange={(v) => setNumberOfCards(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 fiches</SelectItem>
                    <SelectItem value="10">10 fiches</SelectItem>
                    <SelectItem value="15">15 fiches</SelectItem>
                    <SelectItem value="20">20 fiches</SelectItem>
                    <SelectItem value="30">30 fiches</SelectItem>
                    <SelectItem value="50">50 fiches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Instructions supplémentaires</Label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ex: Focus sur les sites accessibles en famille, inclure des conseils photo..."
                rows={3}
              />
            </div>

            <Button 
              onClick={generateCards}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer les fiches atlas
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Fiches générées */}
      {cards.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Fiches atlas ({cards.length})
            </CardTitle>
            <Button variant="outline" onClick={exportAllCards}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cards.map((card) => (
                <Card key={card.id} className="border-2 hover:border-primary/30 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{card.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{card.region}, {card.country}</p>
                        <Badge variant="secondary" className="mt-1">{card.type}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => copyCardContent(card)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        {onInsertContent && (
                          <Button variant="ghost" size="icon" onClick={() => insertCard(card)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => removeCard(card.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold text-primary">Description</h4>
                      <p className="text-muted-foreground">{card.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Faune</h4>
                      <p className="text-muted-foreground">{card.fauna}</p>
                    </div>
                    <div className="bg-emerald-500/10 p-2 rounded-lg">
                      <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">📍 Meilleure période</h4>
                      <p className="text-muted-foreground">{card.bestTime}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EbookAtlas;
