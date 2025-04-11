
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PinterestPin } from '@/types/pinterest';
import { popularHashtags } from '@/data/pinterestImages';

interface HashtagsTabProps {
  pin: PinterestPin;
  customHashtag: string;
  setCustomHashtag: (hashtag: string) => void;
  handleAddHashtag: () => void;
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
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Ajouter un hashtag"
          value={customHashtag}
          onChange={(e) => setCustomHashtag(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleAddHashtag()}
        />
        <Button onClick={handleAddHashtag} type="button" disabled={!customHashtag}>
          Ajouter
        </Button>
      </div>
      
      <div>
        <Label className="mb-2 block">Hashtags populaires</Label>
        <div className="flex flex-wrap gap-2 mb-4">
          {popularHashtags.slice(0, 15).map(tag => (
            <Badge 
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleSelectHashtag(tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">Hashtags sélectionnés</Label>
        <div className="flex flex-wrap gap-2">
          {pin.hashtags.map(tag => (
            <Badge 
              key={tag}
              variant="secondary"
              className="cursor-pointer"
            >
              #{tag}
              <button 
                onClick={() => handleRemoveHashtag(tag)}
                className="ml-1 text-xs hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HashtagsTab;
