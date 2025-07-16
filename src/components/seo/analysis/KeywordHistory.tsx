
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, AlignLeft } from "lucide-react";

type KeywordHistoryItem = {
  keyword: string;
  title: string;
  metaDescription: string;
  longMetaDescription: string;
  date: string;
};

interface KeywordHistoryProps {
  history: KeywordHistoryItem[];
  onLoad: (item: KeywordHistoryItem) => void;
}

function badgeColor(value: string, min: number, max: number) {
  if (min === max) {
    return value.length === min 
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  }
  return value.length >= min && value.length <= max
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-red-100 text-red-800 border-red-200";
}

const KeywordHistory: React.FC<KeywordHistoryProps> = ({ history, onLoad }) => {
  if (history.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-md">Historique de génération</h3>
      <div className="space-y-4">
        {history.map((item, idx) => (
          <div
            key={item.keyword + item.title + idx}
            className="p-3 rounded-lg bg-gray-50 border flex flex-col md:flex-row md:items-center gap-3 md:gap-4 justify-between"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{item.keyword}</span>
                <span className="text-xs text-gray-400">({item.date})</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>{item.title}</span>
                  <Badge
                    className={badgeColor(item.title, 60, 60) + " border ml-1"}
                  >
                    {item.title.length}/60
                  </Badge>
                </span>
                <span className="flex items-center gap-1">
                  <AlignLeft className="h-4 w-4 text-green-600" />
                  <span className="truncate max-w-[180px]">{item.metaDescription}</span>
                  <Badge
                    className={badgeColor(item.metaDescription, 150, 155) + " border ml-1"}
                  >
                    {item.metaDescription.length}/155
                  </Badge>
                </span>
                <span className="flex items-center gap-1">
                  <AlignLeft className="h-4 w-4 text-amber-600" />
                  <span className="truncate max-w-[180px]">{item.longMetaDescription}</span>
                  <Badge
                    className={badgeColor(item.longMetaDescription, 500, 500) + " border ml-1"}
                  >
                    {item.longMetaDescription.length}/500
                  </Badge>
                </span>
              </div>
            </div>
            <Button
              onClick={() => onLoad(item)}
              variant="ghost"
              className="ml-auto flex-shrink-0"
              title="Recharger ce résultat"
            >
              <ArrowRight className="h-4 w-4 mr-1" />
              Recharger
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordHistory;

