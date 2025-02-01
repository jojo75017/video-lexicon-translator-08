import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SeoSuggestionsProps {
  suggestions: string[];
}

const SeoSuggestions = ({ suggestions }: SeoSuggestionsProps) => {
  const { t } = useTranslation();
  
  if (suggestions.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2 flex items-center gap-2">
        <Info className="h-5 w-5 text-blue-500" />
        {t('seo.suggestions.title')}
      </h3>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <Alert key={index} variant={suggestion.includes('manquant') ? 'destructive' : 'default'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{suggestion}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default SeoSuggestions;