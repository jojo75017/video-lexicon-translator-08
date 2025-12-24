import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Fish, Bird, Wand2, Loader2, FileText, 
  Plus, Trash2, Download, Copy, Sparkles, Search,
  TreeDeciduous, Waves, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SpeciesCard {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  description: string;
  characteristics: string;
  habitat: string;
  behavior: string;
  care?: string; // Pour les poissons d'aquarium
  diet: string;
  reproduction: string;
  funFacts: string;
  imagePrompt?: string;
}

interface EbookEncyclopediaProps {
  onInsertContent?: (content: string) => void;
}

const encyclopediaTypes = [
  {
    id: 'freshwater-fish',
    label: 'Poissons d\'aquarium eau douce',
    icon: Fish,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    description: 'Fiches détaillées sur les poissons d\'aquarium d\'eau douce : Guppy, Néon, Betta, Discus, Corydoras...'
  },
  {
    id: 'european-birds',
    label: 'Oiseaux d\'Europe (lisières et forêts)',
    icon: Bird,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    description: 'Fiches détaillées sur les oiseaux européens des lisières et forêts : Rouge-gorge, Mésange, Pic-vert, Geai...'
  }
];

const EbookEncyclopedia: React.FC<EbookEncyclopediaProps> = ({ onInsertContent }) => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [speciesName, setSpeciesName] = useState('');
  const [numberOfCards, setNumberOfCards] = useState(5);
  const [cards, setCards] = useState<SpeciesCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const generateCards = async () => {
    if (!selectedType) {
      toast.error('Veuillez sélectionner un type d\'encyclopédie');
      return;
    }

    setIsGenerating(true);

    try {
      const typeInfo = encyclopediaTypes.find(t => t.id === selectedType);
      
      let prompt = '';
      if (selectedType === 'freshwater-fish') {
        prompt = `Tu es un expert en aquariophilie d'eau douce. Génère ${numberOfCards} fiches encyclopédiques détaillées sur des poissons d'aquarium d'eau douce${speciesName ? ` en te concentrant sur: ${speciesName}` : ' populaires et variés'}.
        
${customPrompt ? `Instructions supplémentaires: ${customPrompt}\n\n` : ''}

Pour chaque poisson, fournis une fiche complète au format JSON avec:
- name: nom commun français
- scientificName: nom scientifique latin
- category: famille (Cyprinidés, Characidés, Cichlidés, etc.)
- description: description physique détaillée (couleurs, taille, forme)
- characteristics: caractéristiques principales (taille adulte, température, pH, dureté de l'eau)
- habitat: origine géographique et biotope naturel
- behavior: comportement social, compatibilité avec autres poissons
- care: entretien en aquarium (taille minimum du bac, décor, filtration)
- diet: alimentation (type de nourriture, fréquence)
- reproduction: mode de reproduction, difficulté, élevage des alevins
- funFacts: 2-3 faits intéressants ou anecdotes
- imagePrompt: description détaillée pour générer une illustration du poisson

Retourne UNIQUEMENT un tableau JSON valide, sans texte avant ou après.`;
      } else if (selectedType === 'european-birds') {
        prompt = `Tu es un ornithologue expert spécialisé dans l'avifaune européenne. Génère ${numberOfCards} fiches encyclopédiques détaillées sur des oiseaux d'Europe vivant dans les lisières et forêts${speciesName ? ` en te concentrant sur: ${speciesName}` : ''}.

${customPrompt ? `Instructions supplémentaires: ${customPrompt}\n\n` : ''}

Pour chaque oiseau, fournis une fiche complète au format JSON avec:
- name: nom commun français
- scientificName: nom scientifique latin
- category: famille (Turdidés, Paridés, Picidés, Corvidés, etc.)
- description: description physique détaillée (plumage, taille, dimorphisme sexuel)
- characteristics: caractéristiques principales (envergure, poids, longévité, chant)
- habitat: type de forêt et lisières préférées, altitude, répartition géographique
- behavior: comportement (sédentaire/migrateur, solitaire/grégaire, territorial)
- diet: régime alimentaire selon les saisons
- reproduction: période de nidification, type de nid, nombre d'œufs, élevage des jeunes
- funFacts: 2-3 faits intéressants, folklore, ou particularités remarquables
- imagePrompt: description détaillée pour générer une illustration de l'oiseau dans son habitat

Retourne UNIQUEMENT un tableau JSON valide, sans texte avant ou après.`;
      }

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt,
          type: 'encyclopedia',
          maxTokens: 4000
        }
      });

      if (error) throw error;

      let generatedCards: SpeciesCard[] = [];
      
      try {
        // Nettoyer la réponse et parser le JSON
        let content = data.content || data;
        if (typeof content === 'string') {
          // Supprimer les balises markdown code block si présentes
          content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          generatedCards = JSON.parse(content);
        } else if (Array.isArray(content)) {
          generatedCards = content;
        }

        // Ajouter des IDs uniques
        generatedCards = generatedCards.map((card, index) => ({
          ...card,
          id: `card-${Date.now()}-${index}`
        }));

        setCards(prev => [...prev, ...generatedCards]);
        toast.success(`${generatedCards.length} fiches générées avec succès !`);
      } catch (parseError) {
        console.error('Erreur parsing:', parseError);
        toast.error('Erreur lors de l\'analyse des fiches générées');
      }

    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('Erreur lors de la génération des fiches');
    } finally {
      setIsGenerating(false);
    }
  };

  const removeCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    toast.success('Fiche supprimée');
  };

  const copyCardContent = (card: SpeciesCard) => {
    const content = formatCardAsText(card);
    navigator.clipboard.writeText(content);
    toast.success('Fiche copiée dans le presse-papier');
  };

  const formatCardAsText = (card: SpeciesCard): string => {
    return `# ${card.name} (${card.scientificName})

**Famille:** ${card.category}

## Description
${card.description}

## Caractéristiques
${card.characteristics}

## Habitat
${card.habitat}

## Comportement
${card.behavior}

${card.care ? `## Entretien en aquarium\n${card.care}\n\n` : ''}## Alimentation
${card.diet}

## Reproduction
${card.reproduction}

## Le saviez-vous ?
${card.funFacts}

---
`;
  };

  const insertCard = (card: SpeciesCard) => {
    if (onInsertContent) {
      onInsertContent(formatCardAsText(card));
      toast.success('Fiche insérée dans le contenu');
    }
  };

  const exportAllCards = () => {
    const content = cards.map(formatCardAsText).join('\n\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encyclopedie-${selectedType}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Encyclopédie exportée !');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Encyclopédie Naturaliste</CardTitle>
              <CardDescription>
                Générez des fiches encyclopédiques détaillées pour vos ebooks nature
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sélection du type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Choisissez votre thématique
          </CardTitle>
          <CardDescription>
            Sélectionnez le type de fiches encyclopédiques à générer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {encyclopediaTypes.map((type) => {
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
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-background'}`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isSelected ? 'text-white' : ''}`}>
                        {type.label}
                      </h3>
                      <p className={`text-sm mt-1 ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {type.description}
                      </p>
                    </div>
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
              <Wand2 className="w-5 h-5 text-purple-500" />
              Configuration de la génération
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Espèce(s) spécifique(s) (optionnel)</Label>
                <Input
                  value={speciesName}
                  onChange={(e) => setSpeciesName(e.target.value)}
                  placeholder={selectedType === 'freshwater-fish' 
                    ? 'Ex: Guppy, Betta, Néon tetra...' 
                    : 'Ex: Rouge-gorge, Mésange bleue...'}
                />
                <p className="text-xs text-muted-foreground">
                  Laissez vide pour une sélection variée automatique
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Nombre de fiches</Label>
                <Select value={numberOfCards.toString()} onValueChange={(v) => setNumberOfCards(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 fiches</SelectItem>
                    <SelectItem value="5">5 fiches</SelectItem>
                    <SelectItem value="8">8 fiches</SelectItem>
                    <SelectItem value="10">10 fiches</SelectItem>
                    <SelectItem value="15">15 fiches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Instructions supplémentaires (optionnel)</Label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ex: Concentre-toi sur les espèces adaptées aux débutants, inclus des conseils pratiques..."
                rows={3}
              />
            </div>

            <Button 
              onClick={generateCards}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer les fiches encyclopédiques
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
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                Fiches générées ({cards.length})
              </CardTitle>
            </div>
            <Button variant="outline" onClick={exportAllCards}>
              <Download className="w-4 h-4 mr-2" />
              Exporter tout
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
                        <p className="text-sm italic text-muted-foreground">{card.scientificName}</p>
                        <Badge variant="secondary" className="mt-1">{card.category}</Badge>
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
                      <h4 className="font-semibold text-primary">Caractéristiques</h4>
                      <p className="text-muted-foreground">{card.characteristics}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Habitat</h4>
                      <p className="text-muted-foreground">{card.habitat}</p>
                    </div>
                    {card.care && (
                      <div>
                        <h4 className="font-semibold text-primary">Entretien</h4>
                        <p className="text-muted-foreground">{card.care}</p>
                      </div>
                    )}
                    <div className="bg-amber-500/10 p-2 rounded-lg">
                      <h4 className="font-semibold text-amber-700 dark:text-amber-400">💡 Le saviez-vous ?</h4>
                      <p className="text-muted-foreground">{card.funFacts}</p>
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

export default EbookEncyclopedia;
