
import React from "react";
import { Button } from "@/components/ui/button";
import { Hash } from "lucide-react";
import { toast } from "sonner";
import { generateHashtagsForKeyword } from '@/utils/seo/generators/hashtagGenerator';

interface HashtagsTabProps {
  fieldValue: string;
  onInsert: (val: string) => void;
  maxLength: number;
  keywordToUse?: string; // Mot-clé pour générer des hashtags pertinents
}

const HashtagsTab: React.FC<HashtagsTabProps> = ({
  fieldValue,
  onInsert,
  maxLength,
  keywordToUse
}) => {
  // Générer des hashtags soit génériques, soit basés sur le mot-clé
  const hashtags = keywordToUse 
    ? generateHashtagsForKeyword(keywordToUse)
    : [
        "#SEO", "#Référencement", "#Google", "#MetaTitle", "#Digital", "#ConseilSEO",
        "#Ranking", "#Visibilité", "#Tendance", "#Marketing", "#Optimisation", "#StratégieSEO",
        "#WebMarketing", "#ContentMarketing", "#TraficWeb", "#MotsClés", "#Performance", "#Conversion"
      ];

  const handleInsert = (hashtag: string) => {
    // Ajoute un espace si besoin
    let insertVal = fieldValue;
    if (insertVal && !insertVal.endsWith(" ")) insertVal += " ";
    
    const newValue = insertVal + hashtag;
    const total = newValue.length;
    
    if (total > maxLength) {
      toast.warning(`Trop long ! La limite est de ${maxLength} caractères.`);
      return;
    }
    
    onInsert(newValue);
    console.log("Hashtag inséré:", hashtag, "Nouvelle valeur:", newValue);
    toast.success(`Hashtag ${hashtag} ajouté à la description`);
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500 flex items-center gap-1">
        <Hash className="h-4 w-4 text-violet-500" />
        <span>Cliquez pour insérer un hashtag dans la description.</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {hashtags.map((h) => (
          <Button
            key={h}
            size="sm"
            variant="outline"
            className="px-2 py-1 text-xs"
            onClick={() => handleInsert(h)}
            disabled={fieldValue.length + h.length + (fieldValue ? 1 : 0) > maxLength}
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
