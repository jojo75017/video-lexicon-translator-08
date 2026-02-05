import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bird, Feather, Thermometer, Sparkles, Image as ImageIcon, Download, BookOpen,
  Loader2, RefreshCw, FileText, Settings, Heart, AlertTriangle, Star, Copy, CheckCircle,
  Volume2, Egg, Home, Apple, Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface BirdSheet {
  id: number;
  scientificName: string;
  commonName: string;
  origin: string;
  size: string;
  weight: string;
  wingspan: string;
  lifespan: string;
  behavior: string;
  flightType: string;
  cageWidth: string;
  cageHeight: string;
  cageDepth: string;
  barSpacing: string;
  cageType: string;
  perches: string;
  bathFrequency: string;
  temperature: string;
  humidity: string;
  lightHours: string;
  heating: string;
  ventilation: string;
  compatibleBirds: string[];
  avoidBirds: string[];
  groupSize: string;
  baseDiet: string;
  supplements: string[];
  waterInfo: string;
  feedingFrequency: string;
  nestType: string;
  clutchSize: string;
  incubationDays: string;
  breedingConditions: string;
  noiseLevel: string;
  canTalk: boolean;
  talkingAbility: string;
  enrichment: string[];
  commonDiseases: string[];
  warningSigns: string[];
  vetCare: string;
  dailyCleaning: string;
  weeklyCleaning: string;
  monthlyCleaning: string;
  handlingTips: string;
  difficulty: string;
  difficultyStars: number;
  tips: string[];
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

interface EbookBirdSheetGeneratorProps {
  ebookTitle?: string;
}

const BIRD_CATEGORIES = [
  { id: 'parrots', label: '🦜 Perroquets', description: 'Ara, cacatoès, gris du Gabon, amazone...' },
  { id: 'parakeets', label: '🐦 Perruches', description: 'Ondulées, calopsittes, inséparables...' },
  { id: 'canaries', label: '🎵 Canaris & Passereaux', description: 'Canaris, mandarins, diamants...' },
  { id: 'exotic', label: '🌴 Exotiques', description: 'Mainates, toucans, loris...' },
  { id: 'mixed', label: '🎯 Mix complet', description: 'Toutes catégories' },
];

const EbookBirdSheetGenerator: React.FC<EbookBirdSheetGeneratorProps> = ({ ebookTitle = '' }) => {
  const [bookTitle, setBookTitle] = useState(ebookTitle || 'Guide Complet des Oiseaux de Compagnie');
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState('mixed');
  const [numberOfSheets, setNumberOfSheets] = useState('10');
  const [customInstructions, setCustomInstructions] = useState('');
  
  const [sheets, setSheets] = useState<BirdSheet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [activeTab, setActiveTab] = useState('config');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  // Placeholder - La logique de génération sera ajoutée plus tard
  const handleGenerateSheets = async () => {
    toast.info('🚧 Module en cours de configuration - Bientôt disponible !');
  };

  return (
    <div className="space-y-6">
      {/* Header avec badge "Bientôt" */}
      <Card className="border-2 border-dashed border-amber-400/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Bird className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">🐦 Générateur Fiches Oiseaux</CardTitle>
                <Badge className="bg-amber-500 text-white animate-pulse">BIENTÔT</Badge>
              </div>
              <CardDescription>
                Créez des fiches ornithologiques complètes pour oiseaux de compagnie
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="template" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Template
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2" disabled>
            <BookOpen className="w-4 h-4" />
            Résultats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6 mt-6">
          {/* Configuration du livre */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Configuration du livre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre du livre</Label>
                  <Input
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="Guide Complet des Oiseaux de Compagnie"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom de l'auteur</Label>
                  <Input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Georges Boubet"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie d'oiseaux</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BIRD_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div>
                            <div className="font-medium">{cat.label}</div>
                            <div className="text-xs text-muted-foreground">{cat.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nombre de fiches</Label>
                  <Select value={numberOfSheets} onValueChange={setNumberOfSheets}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 fiches (test)</SelectItem>
                      <SelectItem value="10">10 fiches</SelectItem>
                      <SelectItem value="20">20 fiches (recommandé)</SelectItem>
                      <SelectItem value="30">30 fiches</SelectItem>
                      <SelectItem value="40">40 fiches (livre complet)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Instructions personnalisées (optionnel)</Label>
                <Textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Ex: Focus sur les espèces adaptées aux débutants, ou les oiseaux parleurs..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleGenerateSheets}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Bird className="w-4 h-4 mr-2" />
                    🚧 Bientôt disponible
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="space-y-6 mt-6">
          {/* Affichage du template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Template de fiche oiseau
              </CardTitle>
              <CardDescription>
                Voici la structure de chaque fiche générée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-6 font-mono text-sm space-y-4 max-h-[600px] overflow-y-auto">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-bold text-primary">🐦 NOM SCIENTIFIQUE <span className="text-muted-foreground">(nom commun)</span></h3>
                  <p className="mt-2"><strong>🗺️ Origine</strong> : [pays/climat, habitat naturel : forêt, savane, mangrove]</p>
                  <p><strong>📏 Taille</strong> : [X cm] | <strong>Poids</strong> : [X g] | <strong>Envergure</strong> : [X cm]</p>
                  <p><strong>⏳ Espérance de vie</strong> : [X ans en captivité]</p>
                  <p><strong>👥 Comportement</strong> : [calme/agressif/grégaire/solitaire] | <strong>Vol</strong> : [rapide/calme]</p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <Home className="w-4 h-4" /> CAGE/VOLIÈRE RECOMMANDÉE
                  </h4>
                  <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-background p-2 rounded text-center">
                      <div className="font-bold">Largeur</div>
                      <div>[80cm+]</div>
                    </div>
                    <div className="bg-background p-2 rounded text-center">
                      <div className="font-bold">Hauteur</div>
                      <div>[100cm+]</div>
                    </div>
                    <div className="bg-background p-2 rounded text-center">
                      <div className="font-bold">Profondeur</div>
                      <div>[60cm+]</div>
                    </div>
                    <div className="bg-background p-2 rounded text-center">
                      <div className="font-bold">Barreaux</div>
                      <div>[1-1.5mm]</div>
                    </div>
                  </div>
                  <p className="mt-2"><strong>Type</strong> : [cage intérieure/volière extérieure]</p>
                  <p><strong>Perchoirs</strong> : [diam 2-4cm, naturel/buissons] | <strong>Bain</strong> : [quotidien]</p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <Thermometer className="w-4 h-4" /> ENVIRONNEMENT
                  </h4>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-background p-2 rounded text-center">
                      <div className="font-bold">Température</div>
                      <div>[20-28°C]</div>
                    </div>
                    <div className="bg-background p-2 rounded text-center">
                      <div className="font-bold">Humidité</div>
                      <div>[50-80%]</div>
                    </div>
                    <div className="bg-background p-2 rounded text-center">
                      <div className="font-bold">Lumière</div>
                      <div>[10-12h/jour]</div>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <Heart className="w-4 h-4" /> COHABITATION
                  </h4>
                  <p className="mt-2">✅ <strong>Compatible</strong> : [inséparables, perruches calopsittes]</p>
                  <p>❌ <strong>Éviter</strong> : [perroquets agressifs, oiseaux nerveux]</p>
                  <p><strong>Groupe</strong> : [paire | petit groupe 4-6]</p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <Apple className="w-4 h-4" /> ALIMENTATION
                  </h4>
                  <p className="mt-2"><strong>Base</strong> : [mélange graines | granulés | fruits/légumes]</p>
                  <p><strong>Compléments</strong> : [germés, vers de farine, millet en épis]</p>
                  <p><strong>Eau</strong> : [fraîche 2x/jour | supplément calcium]</p>
                  <p><strong>Fréquence</strong> : [libre + ration fruits/jour]</p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <Egg className="w-4 h-4" /> NIDS & REPRODUCTION
                  </h4>
                  <p className="mt-2"><strong>Nid</strong> : [boîte 25x25x30cm | cavité naturelle]</p>
                  <p><strong>Ponte</strong> : [4-6 œufs | incubation 18 jours]</p>
                  <p><strong>Conditions</strong> : [hiver artificiel | mâle nourricier]</p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <Volume2 className="w-4 h-4" /> VOCALISATION & INTELLIGENCE
                  </h4>
                  <p className="mt-2"><strong>Niveau bruit</strong> : [silencieux/moyen/bruyant]</p>
                  <p><strong>Parole</strong> : [oui/non | apprentissage facile]</p>
                  <p><strong>Jeux</strong> : [puzzles | jouets à détruire | interaction humaine]</p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <Shield className="w-4 h-4" /> SANTÉ & VIGILANCE
                  </h4>
                  <p className="mt-2"><strong>Maladies fréquentes</strong> : [psittacose | diarrhée | plumes arrachées]</p>
                  <p><strong>Signes alarmes</strong> : [plumes gonflées | selles anormales | bec ouvert]</p>
                  <p><strong>Vétérinaire</strong> : [AVP obligatoire/an]</p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-bold text-primary">🧹 ENTRETIEN QUOTIDIEN</h4>
                  <p className="mt-2"><strong>Nettoyage</strong> : [fond quotidien | perchoirs hebdo | désinfection mensuelle]</p>
                  <p><strong>Manipulation</strong> : [seuil de tolérance | apprivoisement progressif]</p>
                </div>

                <div>
                  <h4 className="font-bold text-primary">🎯 NIVEAU & CONSEILS</h4>
                  <p className="mt-2"><strong>Difficulté</strong> : [Débutant ⭐ / Intermédiaire ⭐⭐ / Expert ⭐⭐⭐]</p>
                  <p><strong>💡 Astuces clés</strong> :</p>
                  <ol className="list-decimal ml-6 mt-1">
                    <li>[Habituer jeune au contact humain]</li>
                    <li>[Varier jouets toutes les 2 semaines]</li>
                    <li>[Contrôle poids hebdomadaire]</li>
                  </ol>
                </div>

                <div className="mt-4 pt-4 border-t text-center text-muted-foreground italic">
                  Source : Ornithologie pratique 2026 | Georges Boubet
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6 mt-6">
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Bird className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Les fiches générées apparaîtront ici</p>
              <p className="text-sm mt-2">Configurez et lancez la génération pour voir les résultats</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookBirdSheetGenerator;
