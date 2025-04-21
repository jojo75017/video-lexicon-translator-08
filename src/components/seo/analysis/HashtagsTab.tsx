
import React from "react";
import { Button } from "@/components/ui/button";
import { Hash } from "lucide-react";

const hashtags = [
  "#SEO", "#Référencement", "#Google", "#MetaTitle", "#Digital", "#ConseilSEO",
  "#Ranking", "#Visibilité", "#Tendance", "#Marketing", "#Optimisation", "#StratégieSEO",
  "#WebMarketing", "#ContentMarketing", "#TraficWeb", "#MotsClés", "#Performance", "#Conversion"
];

interface HashtagsTabProps {
  fieldValue: string;
  onInsert: (val: string) => void;
  maxLength: number;
}

const HashtagsTab: React.FC<HashtagsTabProps> = ({ fieldValue, onInsert, maxLength }) => {
  const handleInsert = (hashtag: string) => {
    // Ajoute un espace si besoin
    let insertVal = fieldValue;
    if (insertVal && !insertVal.endsWith(" ")) insertVal += " ";
    const total = insertVal.length + hashtag.length;
    if (total > maxLength) return;
    onInsert(insertVal + hashtag);
    console.log("Hashtag inséré:", hashtag, "Nouvelle valeur:", insertVal + hashtag);
  };

  console.log("HashtagsTab rendu - valeur actuelle:", fieldValue, "max:", maxLength);

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500 flex items-center gap-1">
        <Hash className="h-4 w-4 text-violet-500" />
        Cliquez pour insérer un hashtag dans la description.
      </div>
      <div className="flex flex-wrap gap-1">
        {hashtags.map((h) => (
          <Button
            key={h}
            size="sm"
            variant="outline"
            className="px-2 py-1 text-xs"
            onClick={() => handleInsert(h)}
            disabled={fieldValue.length + h.length > maxLength}
            aria-label={`Ajouter ${h}`}
          >
            {h}
          </Button>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Max <b>{maxLength}</b> caractères – {fieldValue.length} utilisés.
      </div>
    </div>
  );
};

export default HashtagsTab;
