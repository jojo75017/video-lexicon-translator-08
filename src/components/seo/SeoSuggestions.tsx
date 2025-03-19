
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, AlertTriangle, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SeoSuggestionsProps {
  suggestions: string[];
}

const SeoSuggestions = ({ suggestions }: SeoSuggestionsProps) => {
  if (suggestions.length === 0) return null;
  
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
    <div className="space-y-4">
      {categorizedSuggestions.critical.length > 0 && (
        <div className="space-y-2">
          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              Critique
            </span>
          </div>
          {categorizedSuggestions.critical.map((suggestion, index) => (
            <div key={`critical-${index}`} className="group flex">
              <div className="mr-2 mt-0.5 text-red-500">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="bg-red-50 border border-red-100 p-3 rounded-md group-hover:border-red-200 transition-colors">
                  <div className="text-sm text-red-700">{suggestion}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {categorizedSuggestions.important.length > 0 && (
        <div className="space-y-2">
          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Important
            </span>
          </div>
          {categorizedSuggestions.important.map((suggestion, index) => (
            <div key={`important-${index}`} className="group flex">
              <div className="mr-2 mt-0.5 text-amber-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-md group-hover:border-amber-200 transition-colors">
                  <div className="text-sm text-amber-700">{suggestion}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {categorizedSuggestions.suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Info className="w-3 h-3 mr-1" />
              Suggestion
            </span>
          </div>
          {categorizedSuggestions.suggestions.map((suggestion, index) => (
            <div key={`suggestion-${index}`} className="group flex">
              <div className="mr-2 mt-0.5 text-blue-500">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-md group-hover:border-blue-200 transition-colors">
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
          Voir toutes les recommandations
          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
};

export default SeoSuggestions;
