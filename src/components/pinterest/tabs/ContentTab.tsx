
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { PinterestPin } from '@/types/pinterest';
import { toast } from 'sonner';
import EmojiPicker from './EmojiPicker';

interface ContentTabProps {
  pin: PinterestPin;
  updatePin: (field: keyof PinterestPin, value: any) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ pin, updatePin }) => {
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [titleCursorPosition, setTitleCursorPosition] = useState<number | null>(null);
  const [descriptionCursorPosition, setDescriptionCursorPosition] = useState<number | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 60) {
      updatePin('title', value);
    } else {
      updatePin('title', value.substring(0, 60));
      toast.warning("Le titre a été tronqué à 60 caractères");
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 600) {
      updatePin('description', value);
    } else {
      updatePin('description', value.substring(0, 600));
      toast.warning("La description a été tronquée à environ 100 mots");
    }
  };

  const insertEmoji = (emoji: string, field: 'title' | 'description') => {
    const currentText = pin[field];
    const position = field === 'title' ? titleCursorPosition : descriptionCursorPosition;
    
    if (position !== null) {
      const newText = currentText.slice(0, position) + emoji + currentText.slice(position);
      updatePin(field, newText);
    } else {
      updatePin(field, currentText + emoji);
    }
  };

  const handleTitleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setTitleCursorPosition(target.selectionStart);
  };

  const handleDescriptionSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setDescriptionCursorPosition(target.selectionStart);
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
      
      // Description plus détaillée (environ 100 mots)
      const defaultDescription = `Explorez ${keyword} et laissez-vous séduire par ses innombrables trésors. Des paysages à couper le souffle aux monuments historiques emblématiques, en passant par une gastronomie délicieuse et une culture fascinante. Chaque coin de rue révèle de nouvelles merveilles à découvrir et de précieux souvenirs à créer. Que vous soyez amateur d'architecture, passionné d'histoire, ou simplement en quête d'évasion, ${keyword} saura vous charmer par son authenticité et sa diversité. Préparez votre appareil photo et vos chaussures de marche, car cette destination regorge d'expériences inoubliables qui n'attendent que vous. Un voyage qui éveillera tous vos sens et vous laissera des souvenirs impérissables pour les années à venir.`;
      
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
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="title">
            Titre (max 60 caractères)
          </Label>
          <span className={`text-xs ${pin.title.length > 55 ? 'text-orange-500' : ''}`}>
            {pin.title.length}/60
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            id="title"
            placeholder="Titre accrocheur"
            value={pin.title}
            onChange={handleTitleChange}
            onSelect={handleTitleSelect}
            className="flex-1"
          />
          <EmojiPicker onEmojiSelect={(emoji) => insertEmoji(emoji, 'title')} />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="description">
            Description (environ 100 mots)
          </Label>
          <span className={`text-xs ${pin.description.length > 540 ? 'text-orange-500' : ''}`}>
            {pin.description.length}/600
          </span>
        </div>
        <div className="flex gap-2">
          <Textarea
            id="description"
            placeholder="Décrivez votre épingle en détail (environ 100 mots)"
            value={pin.description}
            onChange={handleDescriptionChange}
            onSelect={handleDescriptionSelect}
            className="min-h-36 flex-1"
            rows={6}
          />
          <div className="flex flex-col justify-start pt-2">
            <EmojiPicker onEmojiSelect={(emoji) => insertEmoji(emoji, 'description')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTab;
