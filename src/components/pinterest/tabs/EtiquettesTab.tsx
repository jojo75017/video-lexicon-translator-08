
import React, { useState } from 'react';
import { PinterestPin } from '@/types/pinterest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus, X } from 'lucide-react';

interface EtiquettesTabProps {
  pin: PinterestPin;
  updatePin: (field: keyof PinterestPin, value: any) => void;
}

const EtiquettesTab: React.FC<EtiquettesTabProps> = ({ pin, updatePin }) => {
  const [newTag, setNewTag] = useState('');
  
  // Suggestions d'étiquettes populaires
  const suggestedTags = [
    'voyage', 'cuisine', 'décoration', 'mode', 'beauté', 
    'photographie', 'art', 'design', 'jardinage', 'bricolage', 
    'santé', 'fitness', 'technologie', 'nature', 'animaux'
  ];
  
  const handleAddTag = () => {
    if (newTag.trim() && !pin.tags.includes(newTag.trim())) {
      const updatedTags = [...pin.tags, newTag.trim()];
      updatePin('tags', updatedTags);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    const updatedTags = pin.tags.filter(t => t !== tag);
    updatePin('tags', updatedTags);
  };
  
  const handleSuggestedTagClick = (tag: string) => {
    if (!pin.tags.includes(tag)) {
      const updatedTags = [...pin.tags, tag];
      updatePin('tags', updatedTags);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Étiquettes de classification</h2>
      <p className="text-sm text-gray-500">
        Ajoutez des étiquettes pour catégoriser votre image Pinterest. Ces étiquettes aident à classer votre contenu et à le rendre plus facilement découvrable.
      </p>
      
      <div className="flex items-center gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ajouter une étiquette..."
          className="flex-1"
        />
        <Button 
          onClick={handleAddTag} 
          size="sm" 
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>
      
      {pin.tags.length > 0 && (
        <div className="border rounded-md p-3 bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Étiquettes actuelles</h3>
          <div className="flex flex-wrap gap-2">
            {pin.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="flex gap-1 items-center py-1 px-2 bg-white"
              >
                <Tag className="h-3 w-3" />
                {tag}
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="border rounded-md p-3">
        <h3 className="text-sm font-medium mb-2">Suggestions d'étiquettes</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedTags.map(tag => (
            <Badge 
              key={tag} 
              variant="outline" 
              className={`cursor-pointer ${pin.tags.includes(tag) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => handleSuggestedTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EtiquettesTab;
