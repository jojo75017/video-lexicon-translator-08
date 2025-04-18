
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Hash } from 'lucide-react';
import { PinterestPin } from '@/types/pinterest';
import { popularHashtags } from '@/data/pinterestImages';
import { extractTagsFromImage } from '@/services/imageService';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HashtagsTabProps {
  pin: PinterestPin;
  customHashtag: string;
  setCustomHashtag: React.Dispatch<React.SetStateAction<string>>;
  handleAddHashtag: (tag: string) => void;
  handleRemoveHashtag: (tag: string) => void;
  handleSelectHashtag: (tag: string) => void;
}

const HashtagsTab: React.FC<HashtagsTabProps> = ({ 
  pin,
  customHashtag,
  setCustomHashtag,
  handleAddHashtag,
  handleRemoveHashtag,
  handleSelectHashtag
}) => {
  // Fonction pour ajouter le hashtag personnalisé
  const handleAddCustomHashtag = () => {
    if (!customHashtag.trim()) {
      toast.warning("Veuillez entrer un hashtag");
      return;
    }
    
    // Nettoyage du hashtag (enlever les espaces et caractères spéciaux)
    const cleanedTag = customHashtag.trim()
      .toLowerCase()
      .replace(/[^\w]/g, '')
      .replace(/\s+/g, '');
    
    if (cleanedTag.length < 2) {
      toast.warning("Le hashtag doit contenir au moins 2 caractères");
      return;
    }
    
    if (pin.hashtags.includes(cleanedTag)) {
      toast.info(`Le hashtag #${cleanedTag} est déjà ajouté`);
      return;
    }
    
    handleAddHashtag(cleanedTag);
    setCustomHashtag('');
  };
  
  // Extraire les suggestions de hashtags basées sur l'image
  const suggestedHashtags = pin.image ? extractTagsFromImage(pin.image) : [];
  
  // Combiner les hashtags suggérés avec les hashtags populaires, sans doublons
  const allSuggestions = [...new Set([...suggestedHashtags, ...popularHashtags])];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="hashtags">Hashtags sélectionnés</Label>
        <div className="flex flex-wrap gap-2 min-h-12 p-2 border rounded-md bg-gray-50">
          {pin.hashtags.length === 0 ? (
            <div className="text-gray-400 italic flex items-center">
              <Hash className="h-4 w-4 mr-1" />
              Ajoutez des hashtags pour améliorer la visibilité
            </div>
          ) : (
            pin.hashtags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="flex items-center gap-1 text-sm py-1 px-2"
              >
                #{tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveHashtag(tag)}
                />
              </Badge>
            ))
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="custom-hashtag">Ajouter un hashtag personnalisé</Label>
        <div className="flex">
          <div className="flex-none flex items-center bg-gray-100 px-3 border border-r-0 rounded-l-md">
            <Hash className="h-4 w-4 text-gray-500" />
          </div>
          <Input
            id="custom-hashtag"
            value={customHashtag}
            onChange={(e) => setCustomHashtag(e.target.value)}
            className="rounded-l-none"
            placeholder="Entrez un hashtag..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomHashtag()}
          />
          <Button 
            onClick={handleAddCustomHashtag}
            className="ml-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>
      
      {suggestedHashtags.length > 0 && (
        <div className="space-y-2">
          <Label>Suggestions basées sur l'image</Label>
          <div className="flex flex-wrap gap-2">
            {suggestedHashtags.map(tag => (
              <Badge 
                key={tag} 
                variant={pin.hashtags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectHashtag(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Hashtags populaires</Label>
        <ScrollArea className="h-[150px] border rounded-md p-2">
          <div className="flex flex-wrap gap-2 p-1">
            {allSuggestions.map(tag => (
              <Badge 
                key={tag} 
                variant={pin.hashtags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectHashtag(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default HashtagsTab;
