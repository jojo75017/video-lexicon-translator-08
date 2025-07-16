
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, Sparkles, Copy, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface PromptGeneratorProps {
  onPromptGenerated: (prompt: string) => void;
}

const PromptGenerator: React.FC<PromptGeneratorProps> = ({ onPromptGenerated }) => {
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState('photo');
  const [mood, setMood] = useState('naturel');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const styleOptions = [
    { value: 'photo', label: 'Photo réaliste' },
    { value: 'painting', label: 'Peinture' },
    { value: 'digital-art', label: 'Art digital' },
    { value: 'minimalist', label: 'Minimaliste' },
    { value: 'cartoon', label: 'Dessin animé' },
    { value: 'watercolor', label: 'Aquarelle' },
    { value: 'sketch', label: 'Croquis' }
  ];

  const moodOptions = [
    { value: 'naturel', label: 'Naturel' },
    { value: 'lumineux', label: 'Lumineux' },
    { value: 'sombre', label: 'Sombre' },
    { value: 'chaleureux', label: 'Chaleureux' },
    { value: 'dramatique', label: 'Dramatique' },
    { value: 'joyeux', label: 'Joyeux' },
    { value: 'mélancolique', label: 'Mélancolique' }
  ];

  const generatePrompt = () => {
    if (!subject) {
      toast.error('Veuillez entrer un sujet pour générer un prompt');
      return;
    }

    setLoading(true);

    // Construction du prompt basée sur les sélections de l'utilisateur
    const selectedStyle = styleOptions.find(option => option.value === style)?.label || style;
    const selectedMood = moodOptions.find(option => option.value === mood)?.label || mood;

    // Génération du prompt (version simplifiée sans appel API)
    setTimeout(() => {
      const prompt = `Une ${selectedStyle.toLowerCase()} de ${subject}, avec une ambiance ${selectedMood.toLowerCase()}, haute résolution, détaillée, mise en scène professionnelle, éclairage parfait, couleurs vives`;
      
      setGeneratedPrompt(prompt);
      setLoading(false);
      toast.success('Prompt généré avec succès');
    }, 1000);
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
        <CardTitle>Générateur de Prompts</CardTitle>
        <CardDescription>
          Créez des prompts optimisés pour la génération d'images par IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">Sujet principal</label>
          <Input
            id="subject"
            placeholder="ex: coucher de soleil sur la plage"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
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
          disabled={loading || !subject}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
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
        <CardFooter className="flex justify-between flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyPrompt}>
            <Copy className="mr-2 h-4 w-4" />
            Copier
          </Button>
          <Button variant="outline" size="sm" onClick={usePrompt}>
            <Download className="mr-2 h-4 w-4" />
            Utiliser
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://free.theresanaiforthat.com/@taaft/image-generator/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Plus d'options
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PromptGenerator;
