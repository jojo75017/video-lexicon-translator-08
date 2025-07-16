
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TrendingUp, Target, Eye } from "lucide-react";

interface DomainSearchAnalysisProps {
  domain?: string;
  seoData?: any;
  isLoading?: boolean;
}

const DomainSearchAnalysis: React.FC<DomainSearchAnalysisProps> = ({ domain, seoData, isLoading }) => {
  
  if (!domain) {
    return (
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <Search className="h-12 w-12 mx-auto text-blue-600 mb-3" />
        <h3 className="text-lg font-medium text-blue-800">Analyse de recherche organique</h3>
        <p className="text-blue-700 mt-2">
          Entrez un nom de domaine pour analyser ses performances en recherche organique.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Recherche organique pour {domain}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-700">Mots-clés principaux</p>
                  {isLoading ? (
                    <Skeleton className="h-6 w-16 mt-1" />
                  ) : (
                    <p className="text-lg font-semibold">{seoData?.topKeywords?.length || 0}</p>
                  )}
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-700">Score de lisibilité</p>
                  {isLoading ? (
                    <Skeleton className="h-6 w-16 mt-1" />
                  ) : (
                    <p className="text-lg font-semibold">{seoData?.readabilityScore || 'N/A'}/100</p>
                  )}
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          {seoData?.topKeywords && seoData.topKeywords.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Mots-clés les plus fréquents</h4>
              <div className="space-y-2">
                {seoData.topKeywords.slice(0, 5).map((keyword: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{keyword.keyword}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Fréquence: {keyword.frequency}</span>
                      {keyword.density && (
                        <span className="text-xs text-gray-500">Densité: {keyword.density.toFixed(1)}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
              <span className="ml-3 text-blue-700">Analyse en cours...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainSearchAnalysis;
