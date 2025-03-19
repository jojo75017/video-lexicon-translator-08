
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, AlertTriangle, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

interface SeoSuggestionsProps {
  suggestions: string[];
}

const SeoSuggestions = ({ suggestions }: SeoSuggestionsProps) => {
  const { t } = useTranslation();
  
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <Info className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">
            {t('seo.noSuggestions')}
          </h3>
        </div>
        <p className="text-gray-600">
          {t('seo.allGood')}
        </p>
      </div>
    );
  }
  
  // Categorize suggestions by severity
  const categorizedSuggestions = {
    critical: suggestions.filter(s => 
      s.includes('manquant') || 
      s.includes('Aucune') || 
      s.includes('critique') || 
      s.includes('erreur')
    ),
    important: suggestions.filter(s => 
      !s.includes('manquant') && 
      !s.includes('Aucune') && 
      !s.includes('critique') && 
      !s.includes('erreur') &&
      (s.includes('améliorer') || s.includes('optimiser') || s.includes('important'))
    ),
    suggestions: suggestions.filter(s => 
      !s.includes('manquant') && 
      !s.includes('Aucune') && 
      !s.includes('critique') && 
      !s.includes('erreur') &&
      !s.includes('améliorer') && 
      !s.includes('optimiser') && 
      !s.includes('important')
    )
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
        {t('seo.optimizationRecommendations')}
      </h3>
      
      {categorizedSuggestions.critical.length > 0 && (
        <div className="space-y-3">
          <div className="mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <AlertCircle className="w-4 h-4 mr-2" />
              {t('seo.critical')}
            </span>
          </div>
          {categorizedSuggestions.critical.map((suggestion, index) => (
            <div key={`critical-${index}`} className="group flex">
              <div className="mr-3 mt-0.5 text-red-500">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="bg-red-50 border border-red-100 p-4 rounded-md group-hover:border-red-200 transition-colors">
                  <div className="text-sm text-red-700">{suggestion}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {categorizedSuggestions.important.length > 0 && (
        <div className="space-y-3">
          <div className="mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t('seo.important')}
            </span>
          </div>
          {categorizedSuggestions.important.map((suggestion, index) => (
            <div key={`important-${index}`} className="group flex">
              <div className="mr-3 mt-0.5 text-amber-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-md group-hover:border-amber-200 transition-colors">
                  <div className="text-sm text-amber-700">{suggestion}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {categorizedSuggestions.suggestions.length > 0 && (
        <div className="space-y-3">
          <div className="mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Info className="w-4 h-4 mr-2" />
              {t('seo.suggestion')}
            </span>
          </div>
          {categorizedSuggestions.suggestions.map((suggestion, index) => (
            <div key={`suggestion-${index}`} className="group flex">
              <div className="mr-3 mt-0.5 text-blue-500">
                <Info className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-md group-hover:border-blue-200 transition-colors">
                  <div className="text-sm text-blue-700">{suggestion}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <Button 
          variant="outline"
          className="text-indigo-600 group hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
        >
          {t('seo.viewAllRecommendations')}
          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
};

export default SeoSuggestions;
