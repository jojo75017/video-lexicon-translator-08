
import React from 'react';
import { DomainSuggestion } from '@/types/domain';
import DomainSuggestionCard from './DomainSuggestionCard';

interface DomainSuggestionsListProps {
  suggestions: DomainSuggestion[];
}

export const DomainSuggestionsList: React.FC<DomainSuggestionsListProps> = ({ suggestions }) => {
  if (suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6 grid gap-3">
      {suggestions.map((suggestion, idx) => (
        <DomainSuggestionCard key={idx} suggestion={suggestion} />
      ))}
    </div>
  );
};

export default DomainSuggestionsList;
