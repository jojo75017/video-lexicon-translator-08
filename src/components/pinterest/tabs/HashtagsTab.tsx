
import React from 'react';
import { PinterestPin } from '@/types/pinterest';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface HashtagsTabProps {
  pin: PinterestPin;
  customHashtag: string;
  setCustomHashtag: (value: string) => void;
  updatePin?: (field: keyof PinterestPin, value: any) => void;
}

const HashtagsTab: React.FC<HashtagsTabProps> = ({
  pin,
  customHashtag,
  setCustomHashtag,
  updatePin
}) => {
  const handleAddHashtag = () => {
    if (!customHashtag.trim() || !updatePin) return;
    
    const newHashtag = customHashtag.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!pin.hashtags.includes(newHashtag)) {
      updatePin('hashtags', [...pin.hashtags, newHashtag]);
      setCustomHashtag('');
    }
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    if (!updatePin) return;
    updatePin('hashtags', pin.hashtags.filter(tag => tag !== tagToRemove));
  };

  const toggleHashtagsVisibility = () => {
    if (!updatePin) return;
    updatePin('showHashtags', !pin.showHashtags);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="show-hashtags"
          checked={pin.showHashtags}
          onCheckedChange={toggleHashtagsVisibility}
        />
        <Label htmlFor="show-hashtags">Afficher les hashtags sur l'image</Label>
      </div>

      <div className="space-y-2">
        <Label>Ajouter un hashtag</Label>
        <div className="flex gap-2">
          <Input
            value={customHashtag}
            onChange={(e) => setCustomHashtag(e.target.value)}
            placeholder="Entrez un hashtag"
            className="flex-1"
          />
          <Button onClick={handleAddHashtag} type="button">
            Ajouter
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {pin.hashtags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="px-2 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => handleRemoveHashtag(tag)}
          >
            #{tag} ×
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default HashtagsTab;
