
import React from "react";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

const emojis = [
  "✨", "🔥", "💡", "🔝", "🚀", "✅", "⭐", "🎯", "😍", "🎉",
  "🔍", "😎", "🤣", "😉", "👌", "🥇", "🥳", "🧐", "🦄", "👍",
  "💪", "🏆", "💯", "⚡", "📈", "🤩", "💫", "👑", "🌟", "🔆"
];

interface EmojiTabProps {
  fieldValue: string;
  onInsert: (val: string) => void;
  maxLength: number;
}

const EmojiTab: React.FC<EmojiTabProps> = ({ fieldValue, onInsert, maxLength }) => {
  const handleInsert = (emoji: string) => {
    if (fieldValue.length + emoji.length > maxLength) return;
    onInsert(fieldValue + emoji);
    console.log("Emoji inséré:", emoji, "Nouvelle valeur:", fieldValue + emoji);
  };

  console.log("EmojiTab rendu - valeur actuelle:", fieldValue, "max:", maxLength);

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500 flex items-center gap-1">
        <Smile className="h-4 w-4 text-yellow-500" />
        Cliquez pour ajouter un emoji à votre titre.
      </div>
      <div className="flex flex-wrap gap-1">
        {emojis.map((e) => (
          <Button
            key={e}
            size="sm"
            variant="outline"
            className="px-2 py-1 text-lg"
            onClick={() => handleInsert(e)}
            disabled={fieldValue.length + e.length > maxLength}
            aria-label={`Ajouter ${e}`}
          >
            {e}
          </Button>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Max <b>{maxLength}</b> caractères – {fieldValue.length} utilisés.
      </div>
    </div>
  );
};

export default EmojiTab;
