
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PinterestPin } from '@/types/pinterest';

interface ContentTabProps {
  pin: PinterestPin;
  updatePin: (field: keyof PinterestPin, value: any) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ pin, updatePin }) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Limiter à 40 caractères
    if (value.length <= 40) {
      updatePin('title', value);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Limiter à ~50 mots (environ 300 caractères)
    if (value.length <= 300) {
      updatePin('description', value);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title" className="flex justify-between">
          <span>Titre (max 40 caractères)</span>
          <span className={`text-xs ${pin.title.length > 35 ? 'text-orange-500' : ''}`}>
            {pin.title.length}/40
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
