
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EmojiSelectorProps {
  emojis: string[];
  selectedEmoji: string;
  onSelect: (emoji: string) => void;
  label: string;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ 
  emojis,
  selectedEmoji,
  onSelect,
  label
}) => {
  return (
    <div className="mt-2">
      <Label className="text-xs text-muted-foreground mb-1 block">
        {label}
      </Label>
      <RadioGroup
        value={selectedEmoji}
        onValueChange={onSelect}
        className="flex flex-wrap gap-3"
      >
        {emojis.map((emoji) => (
          <div key={emoji} className="flex items-center gap-1">
            <RadioGroupItem value={emoji} id={`emoji-${emoji}`} />
            <Label 
              htmlFor={`emoji-${emoji}`}
              className="text-base cursor-pointer hover:bg-gray-100 rounded-full px-2 py-1"
            >
              {emoji}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default EmojiSelector;
