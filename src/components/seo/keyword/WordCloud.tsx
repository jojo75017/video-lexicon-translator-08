
import React from 'react';
import { KeywordSuggestion } from '@/types/seo';

interface WordCloudProps {
  keywords: KeywordSuggestion[];
}

const WordCloud: React.FC<WordCloudProps> = ({ keywords }) => {
  const maxVolume = Math.max(...keywords.map(k => k.volume || k.searchVolume || 0));
  const minSize = 0.8;
  const maxSize = 1.8;

  return (
    <div className="p-6 bg-gray-50 rounded-lg min-h-[150px] flex flex-wrap gap-2 justify-center">
      {keywords.map((kw, i) => {
        const volume = kw.volume || kw.searchVolume || 0;
        const size = ((volume / maxVolume) * (maxSize - minSize)) + minSize;
        
        return (
          <span 
            key={i} 
            className="px-2 py-1 bg-white rounded shadow hover:shadow-md transition-shadow cursor-pointer"
            style={{ 
              fontSize: `${size}rem`, 
              opacity: 0.6 + (volume / maxVolume) * 0.4
            }}
          >
            {kw.keyword}
          </span>
        );
      })}
    </div>
  );
};

export default WordCloud;
