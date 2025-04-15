import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { PinterestPin } from '@/types/pinterest';
import { toast } from 'sonner';

interface ContentTabProps {
  pin: PinterestPin;
  updatePin: (field: keyof PinterestPin, value: any) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ pin, updatePin }) => {
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Limit to 60 characters
    if (value.length <= 60) {
      updatePin('title', value);
    } else {
      // Truncate to 60 characters if longer
      updatePin('title', value.substring(0, 60));
      toast.warning("Le titre a été tronqué à 60 caractères");
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Limit to ~50 words (approximately 300 characters)
    if (value.length <= 300) {
      updatePin('description', value);
    }
  };

  const generateContentFromKeyword = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate content directly from the keyword
      const defaultTitle = `Découvrez les merveilles de ${keyword}`.substring(0, 60);
      const defaultDescription = `Explorez ${keyword} avec ses particularités uniques, ses paysages magnifiques et son atmosphère inoubliable. Une destination qui mérite d'être découverte.`;
      
      // Update title and description
      updatePin('title', defaultTitle);
      updatePin('description', defaultDescription);
      
      // Add keyword to hashtags if not already present
      if (!pin.hashtags.includes(keyword.toLowerCase())) {
        const updatedHashtags = [...pin.hashtags, keyword.toLowerCase()];
        updatePin('hashtags', updatedHashtags);
      }
      
      toast.success("Contenu généré avec succès !");
    } catch (error) {
      console.error("Erreur lors de la génération de contenu:", error);
      toast.error("Erreur lors de la génération du contenu");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 mb-4">
        <div className="flex-1">
          <Label htmlFor="keyword">Mot-clé pour générer du contenu</Label>
          <Input
            id="keyword"
            placeholder="Ex: Paris, Italie, voyage..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Button 
          onClick={generateContentFromKeyword} 
          disabled={isGenerating || !keyword.trim()}
          className="flex items-center gap-2"
        >
          <Wand2 className="h-4 w-4" />
          Générer
        </Button>
      </div>

      <div>
        <Label htmlFor="title" className="flex justify-between">
          <span>Titre (max 60 caractères)</span>
          <span className={`text-xs ${pin.title.length > 55 ? 'text-orange-500' : ''}`}>
            {pin.title.length}/60
          </span>
        </Label>
        <Input
          id="title"
          placeholder="Titre accrocheur"
          value={pin.title}
          onChange={handleTitleChange}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="description" className="flex justify-between">
          <span>Description (environ 50 mots)</span>
          <span className={`text-xs ${pin.description.length > 270 ? 'text-orange-500' : ''}`}>
            {pin.description.length}/300
          </span>
        </Label>
        <Textarea
          id="description"
          placeholder="Décrivez votre épingle en 50 mots environ"
          value={pin.description}
          onChange={handleDescriptionChange}
          className="mt-1 min-h-24"
        />
      </div>
    </div>
  );
};

export default ContentTab;
