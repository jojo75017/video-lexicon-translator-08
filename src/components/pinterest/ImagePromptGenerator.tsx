
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Camera, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

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
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const styleOptions = [
    { value: 'photo-realistic', label: 'Photo réaliste' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'digital-art', label: 'Art digital' },
    { value: 'minimalistic', label: 'Minimaliste' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'watercolor', label: 'Aquarelle' },
    { value: 'sketch', label: 'Croquis' }
  ];

  const moodOptions = [
    { value: 'bright', label: 'Lumineux' },
    { value: 'dark', label: 'Sombre' },
    { value: 'vibrant', label: 'Vibrant' },
    { value: 'warm', label: 'Chaleureux' },
    { value: 'dramatic', label: 'Dramatique' },
    { value: 'peaceful', label: 'Paisible' },
    { value: 'nostalgic', label: 'Nostalgique' }
  ];

  const generatePrompt = () => {
    if (!title) {
      toast.error('Veuillez entrer un titre pour générer un prompt');
      return;
    }

    setLoading(true);

    // Construction du prompt basée sur le titre et les paramètres sélectionnés
    const selectedStyle = styleOptions.find(option => option.value === style)?.label || style;
    const selectedMood = moodOptions.find(option => option.value === mood)?.label || mood;

    // Simulation d'un traitement
    setTimeout(() => {
      // Extraire les mots-clés du titre
      const keywords = title.split(/\s+/).filter(word => word.length > 3);
      
      // Construire le prompt
      const prompt = `Une image ${selectedStyle.toLowerCase()} de ${title}, ambiance ${selectedMood.toLowerCase()}, haute résolution, composition professionnelle, éclairage parfait, couleurs vives, mise en scène élégante${keywords.length > 0 ? ', mettant en valeur ' + keywords.join(', ') : ''}`;
      
      setGeneratedPrompt(prompt);
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> 
          Générateur de Prompts d'Images
        </CardTitle>
      </CardHeader>
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
                {styleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="mood" className="text-sm font-medium">Ambiance</label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger id="mood">
                <SelectValue placeholder="Sélectionnez une ambiance" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

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
              <Sparkles className="mr-2 h-4 w-4" />
              Générer un prompt
            </>
          )}
        </Button>

        {generatedPrompt && (
          <div className="mt-4 space-y-2">
            <label htmlFor="generatedPrompt" className="text-sm font-medium">Prompt généré</label>
            <Textarea
              id="generatedPrompt"
              value={generatedPrompt}
              readOnly
              className="min-h-[100px] font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
      
      {generatedPrompt && (
        <CardFooter className="flex justify-between">
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
