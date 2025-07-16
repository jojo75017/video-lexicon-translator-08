
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
      <div className="flex flex-wrap gap-3">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className={`text-xl cursor-pointer hover:bg-gray-100 rounded-full px-2 py-1 ${
              selectedEmoji === emoji ? 'bg-blue-100 border-blue-300 border' : ''
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiSelector;
