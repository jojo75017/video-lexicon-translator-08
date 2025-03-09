
import React from 'react';
import { KeywordSuggestion } from '@/types/seo';

interface KeywordSuggestionsProps {
  generatedKeywords: KeywordSuggestion[];
}

const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
  generatedKeywords
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-3">Suggestions de mots-clés</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Obtenez des suggestions de mots-clés pertinents pour votre site.
        </p>
        
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Générer des suggestions
        </button>
      </div>
      
      {generatedKeywords.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2">Mots-clés suggérés</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {generatedKeywords.map((keyword, index) => (
              <div key={index} className="flex justify-between bg-gray-50 p-2 rounded-md">
                <span>{keyword.keyword}</span>
                <span className="text-gray-500 text-sm">
                  {keyword.volume} recherches/mois
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordSuggestions;
