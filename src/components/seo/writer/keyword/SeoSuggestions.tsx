
import React from 'react';
import { FileText, AlignLeft, ShieldCheck } from 'lucide-react';
import { KeywordSuggestion } from "@/types/seo";

interface SeoSuggestionsProps {
  keywordData: KeywordSuggestion;
}

const SeoSuggestions: React.FC<SeoSuggestionsProps> = ({ keywordData }) => {
  const getCharacterLimitClass = (length: number, limit: number) => {
    if (length > limit) return "text-red-500";
    if (length > limit * 0.9) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <h3 className="font-medium">Balise Title</h3>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-4 w-4 ${keywordData.suggestedTitle.length <= 60 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs ${getCharacterLimitClass(keywordData.suggestedTitle.length, 60)}`}>
              {keywordData.suggestedTitle.length}/60
            </span>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-md text-sm">
          {keywordData.suggestedTitle}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4 text-green-600" />
            <h3 className="font-medium">Meta Description</h3>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-4 w-4 ${keywordData.suggestedDescription.length <= 155 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs ${getCharacterLimitClass(keywordData.suggestedDescription.length, 155)}`}>
              {keywordData.suggestedDescription.length}/155
            </span>
          </div>
        </div>
        <div className="p-3 bg-green-50 rounded-md text-sm">
          {keywordData.suggestedDescription}
        </div>
      </div>
    </div>
  );
};

export default SeoSuggestions;
