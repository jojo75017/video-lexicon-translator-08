import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Camera, Copy, Download, Image, Lightbulb, Palette, Wand2, Globe2, History } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import PromptHistory from './tabs/PromptHistory';

// Styles prédéfinis pour générer des prompts
const stylePresets = [
  { value: 'photo-realistic', label: 'Photo réaliste', description: 'Image de haute qualité semblable à une photographie professionnelle' },
  { value: 'illustration', label: 'Illustration', description: 'Style d\'illustration artistique, dessiné à la main' },
  { value: 'digital-art', label: 'Art digital', description: 'Art créé numériquement avec des outils modernes' },
  { value: 'minimalistic', label: 'Minimaliste', description: 'Design épuré avec peu d\'éléments et beaucoup d\'espace négatif' },
  { value: 'vintage', label: 'Vintage', description: 'Style rétro évoquant une époque passée' },
  { value: 'watercolor', label: 'Aquarelle', description: 'Effet de peinture à l\'eau avec des couleurs qui se fondent' },
  { value: 'sketch', label: 'Croquis', description: 'Dessin au trait simple comme fait au crayon' },
  { value: 'oil-painting', label: 'Peinture à l\'huile', description: 'Imitation de peinture à l\'huile avec texture et profondeur' },
  { value: 'pop-art', label: 'Pop Art', description: 'Style coloré et audacieux inspiré du mouvement Pop Art' },
  { value: 'anime', label: 'Anime', description: 'Style d\'animation japonaise avec des traits caractéristiques' }
];

// Ambiances prédéfinies
const moodPresets = [
  { value: 'bright', label: 'Lumineux', description: 'Éclairage fort et vif, ambiance positive' },
  { value: 'dark', label: 'Sombre', description: 'Éclairage tamisé, ambiance mystérieuse ou dramatique' },
  { value: 'vibrant', label: 'Vibrant', description: 'Couleurs vives et éclatantes, plein d\'énergie' },
  { value: 'warm', label: 'Chaleureux', description: 'Tons chauds comme l\'orange et le jaune, atmosphère accueillante' },
  { value: 'dramatic', label: 'Dramatique', description: 'Contrastes forts, ambiance intense ou théâtrale' },
  { value: 'peaceful', label: 'Paisible', description: 'Calme et serein, couleurs douces et apaisantes' },
  { value: 'nostalgic', label: 'Nostalgique', description: 'Évoque des souvenirs du passé, teintes légèrement délavées' },
  { value: 'futuristic', label: 'Futuriste', description: 'Aspect moderne et technologique, souvent avec des néons' },
  { value: 'ethereal', label: 'Éthéré', description: 'Atmosphère légère et délicate, presque surnaturelle' },
  { value: 'mystical', label: 'Mystique', description: 'Ambiance magique ou spirituelle, souvent avec des éléments fantastiques' }
];

// Exemples de prompts pour différents styles
const promptExamples = {
  'photo-realistic': 'Une photographie professionnelle de haute résolution d\'un coucher de soleil sur la plage',
  'illustration': 'Une illustration colorée d\'une forêt enchantée avec des fées volant entre les arbres',
  'digital-art': 'Art digital vibrant représentant une ville futuriste avec des gratte-ciels et des véhicules volants',
  'minimalistic': 'Design minimaliste d\'un vase blanc sur fond gris clair, avec une seule fleur rouge',
  'vintage': 'Photographie vintage en sépia d\'une rue parisienne dans les années 1920',
  'watercolor': 'Peinture à l\'aquarelle délicate de montagnes brumeuses au lever du soleil',
  'sketch': 'Croquis au crayon détaillé d\'un port avec des bateaux et des mouettes',
  'oil-painting': 'Peinture à l\'huile d\'un champ de lavande en Provence avec une texture riche',
  'pop-art': 'Portrait pop art aux couleurs vives dans le style de Warhol',
  'anime': 'Personnage de style anime dans un jardin japonais traditionnel'
};

interface ImagePromptGeneratorProps {
  onPromptGenerated: (prompt: string) => void;
  initialTitle?: string;
}

const ImagePromptGenerator: React.FC<ImagePromptGeneratorProps> = ({ 
  onPromptGenerated, 
  initialTitle = '' 
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [style, setStyle] = useState('photo-realistic');
  const [mood, setMood] = useState('bright');
  const [additionalElements, setAdditionalElements] = useState('');
  const [quality, setQuality] = useState(85);
  const [detailLevel, setDetailLevel] = useState(70);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [autoPreview, setAutoPreview] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [promptHistory, setPromptHistory] = useState<{ prompt: string; date: Date }[]>([]);

  // Effet pour générer automatiquement un aperçu du prompt
  useEffect(() => {
    if (autoPreview && title) {
      generatePreviewPrompt();
    }
  }, [title, style, mood, quality, detailLevel, additionalElements, autoPreview]);

  const generatePreviewPrompt = () => {
    // Récupérer les labels pour affichage
    const selectedStyle = stylePresets.find(option => option.value === style)?.label || style;
    const selectedMood = moodPresets.find(option => option.value === mood)?.label || mood;
    
    // Générer un prompt de base
    let prompt = `Une image ${selectedStyle.toLowerCase()} de ${title}, ambiance ${selectedMood.toLowerCase()}`;
    
    // Ajouter des détails basés sur la qualité et le niveau de détail
    if (quality > 50) {
      prompt += ', haute résolution';
    }
    if (quality > 75) {
      prompt += ', qualité exceptionnelle';
    }
    
    if (detailLevel > 50) {
      prompt += ', détaillé';
    }
    if (detailLevel > 75) {
      prompt += ', extrêmement détaillé';
    }
    
    // Ajouter des éléments supplémentaires si spécifiés
    if (additionalElements) {
      prompt += `, avec ${additionalElements}`;
    }
    
    // Terminer le prompt avec des éléments professionnels
    prompt += ', composition professionnelle, éclairage parfait';
    
    setGeneratedPrompt(prompt);
    return prompt;
  };

  const generatePrompt = () => {
    if (!title) {
      toast.error('Veuillez entrer un titre pour générer un prompt');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newPrompt = generatePreviewPrompt();
      setGeneratedPrompt(newPrompt);
      
      // Ajouter à l'historique
      setPromptHistory(prev => [{
        prompt: newPrompt,
        date: new Date()
      }, ...prev.slice(0, 9)]); // Garder les 10 derniers prompts
      
      setLoading(false);
      toast.success('Prompt généré avec succès');
    }, 800);
  };

  const copyPrompt = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      toast.success('Prompt copié dans le presse-papier');
    }
  };

  const usePrompt = () => {
    if (generatedPrompt) {
      onPromptGenerated(generatedPrompt);
      toast.success('Prompt prêt à être utilisé');
    }
  };

  const useExamplePrompt = (example: string) => {
    setGeneratedPrompt(example);
    toast.success('Exemple de prompt sélectionné');
  };

  const clearHistory = () => {
    setPromptHistory([]);
    toast.success('Historique effacé');
  };

  const handleSelectFromHistory = (prompt: string) => {
    setGeneratedPrompt(prompt);
    toast.success('Prompt sélectionné depuis l\'historique');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> 
          Générateur de Prompts d'Images
        </CardTitle>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Options de base</TabsTrigger>
          <TabsTrigger value="advanced">Options avancées</TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="space-y-4">
          <div className="flex justify-end mb-4">
            <Select value={language} onValueChange={(value: 'fr' | 'en') => setLanguage(value)}>
              <SelectTrigger className="w-[180px]">
                <Globe2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sélectionner la langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="basic" className="space-y-4">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Titre / Description</label>
                <Input
                  id="title"
                  placeholder="ex: Coucher de soleil sur Paris"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="style" className="text-sm font-medium">Style</label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Sélectionnez un style" />
                    </SelectTrigger>
                    <SelectContent>
                      {stylePresets.map((option) => (
                        <SelectItem key={option.value} value={option.value} title={option.description}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">{stylePresets.find(s => s.value === style)?.description}</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="mood" className="text-sm font-medium">Ambiance</label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger id="mood">
                      <SelectValue placeholder="Sélectionnez une ambiance" />
                    </SelectTrigger>
                    <SelectContent>
                      {moodPresets.map((option) => (
                        <SelectItem key={option.value} value={option.value} title={option.description}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">{moodPresets.find(m => m.value === mood)?.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="additionalElements" className="text-sm font-medium">Éléments supplémentaires (optionnel)</label>
                <Input
                  id="additionalElements"
                  placeholder="ex: des nuages roses, des oiseaux qui volent"
                  value={additionalElements}
                  onChange={(e) => setAdditionalElements(e.target.value)}
                />
              </div>
            </CardContent>
          </TabsContent>
        
          <TabsContent value="advanced" className="space-y-4">
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label htmlFor="quality" className="text-sm font-medium">Qualité d'image</label>
                    <span className="text-sm text-gray-500">{quality}%</span>
                  </div>
                  <Slider
                    id="quality"
                    min={0}
                    max={100}
                    step={5}
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                  />
                  <p className="text-xs text-gray-500">Définit la résolution et la netteté de l'image générée</p>
                </div>
              
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label htmlFor="detailLevel" className="text-sm font-medium">Niveau de détail</label>
                    <span className="text-sm text-gray-500">{detailLevel}%</span>
                  </div>
                  <Slider
                    id="detailLevel"
                    min={0}
                    max={100}
                    step={5}
                    value={[detailLevel]}
                    onValueChange={(value) => setDetailLevel(value[0])}
                  />
                  <p className="text-xs text-gray-500">Contrôle la quantité de détails dans l'image</p>
                </div>
              </div>
            
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Exemples de prompts par style</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(promptExamples).slice(0, 4).map(([key, example]) => (
                    <Button 
                      key={key} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                      title={example}
                      onClick={() => useExamplePrompt(example)}
                    >
                      <Lightbulb className="h-3 w-3 mr-2" />
                      <span className="truncate">{stylePresets.find(s => s.value === key)?.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <PromptHistory 
              history={promptHistory}
              onSelectPrompt={handleSelectFromHistory}
              onClearHistory={clearHistory}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardContent className="space-y-4 pt-0">
        <Button
          className="w-full"
          onClick={generatePrompt}
          disabled={loading || !title}
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">○</span>
              Génération en cours...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Générer un prompt
            </>
          )}
        </Button>

        {generatedPrompt && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="generatedPrompt" className="text-sm font-medium">Prompt généré</label>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setAutoPreview(!autoPreview)}
                className="h-6 px-2"
              >
                {autoPreview ? 'Désactiver aperçu auto' : 'Activer aperçu auto'}
              </Button>
            </div>
            <Textarea
              id="generatedPrompt"
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              className="min-h-[100px] font-mono text-sm"
            />
            
            <div className="flex justify-between">
              <p className="text-xs text-gray-500">
                <Palette className="inline h-3 w-3 mr-1" />
                Style: {stylePresets.find(s => s.value === style)?.label}
                <span className="mx-2">•</span>
                <Image className="inline h-3 w-3 mr-1" />
                Ambiance: {moodPresets.find(m => m.value === mood)?.label}
              </p>
              <p className="text-xs text-gray-500">
                {generatedPrompt.length} caractères
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      {generatedPrompt && (
        <CardFooter className="flex justify-between flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyPrompt}>
            <Copy className="mr-2 h-4 w-4" />
            Copier
          </Button>
          <Button variant="secondary" size="sm" onClick={usePrompt}>
            <Download className="mr-2 h-4 w-4" />
            Utiliser
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ImagePromptGenerator;
