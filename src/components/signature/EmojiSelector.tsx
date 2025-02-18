
import React from 'react';

interface EmojiSelectorProps {
  emojis: string[];
  selectedEmoji: string;
  onSelect: (emoji: string) => void;
  label?: string;
}

const EmojiSelector = ({ emojis, selectedEmoji, onSelect, label }: EmojiSelectorProps) => {
  return (
    <div className="mt-2 flex items-center gap-2 flex-wrap">
      {label && <span className="text-sm text-gray-500">{label}:</span>}
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className={`p-1 rounded hover:bg-gray-100 ${selectedEmoji === emoji ? 'bg-gray-200' : ''}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiSelector;
