
import React from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import type { IndexabilityResults as IndexabilityResultsType } from '@/hooks/useIndexabilityAnalysis';

interface IndexabilityResultsProps {
  results: IndexabilityResultsType;
  url: string;
}

export const IndexabilityResults: React.FC<IndexabilityResultsProps> = ({ results, url }) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-full ${results.canIndex ? 'bg-green-100' : 'bg-red-100'}`}>
          {results.canIndex ? 
            <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
            <AlertTriangle className="h-5 w-5 text-red-600" />
          }
        </div>
        <div>
          <h3 className="font-medium">
            {results.canIndex ? 'Page indexable' : 'Page non indexable'}
          </h3>
          <p className="text-sm text-gray-600">
            {results.canIndex 
              ? `Nous avons détecté environ ${results.indexablePages} pages indexables.` 
              : 'Les moteurs de recherche ne peuvent pas indexer cette page.'}
          </p>
        </div>
      </div>
      
      {results.reasons.length > 0 && (
        <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-1">Raisons</h4>
          <ul className="list-disc pl-5 space-y-1">
            {results.reasons.map((reason, index) => (
              <li key={index} className="text-sm text-amber-700">{reason}</li>
            ))}
          </ul>
        </div>
      )}
      
      {results.recommendations.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-1">Recommandations</h4>
          <ul className="list-disc pl-5 space-y-1">
            {results.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-blue-700">{rec}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <a 
          href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Tester cette URL avec l'outil Google Rich Results
        </a>
      </div>
    </div>
  );
};
