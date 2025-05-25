
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Users, ExternalLink, TrendingUp, Clock, Zap, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DomainOverviewProps {
  domain?: string;
  seoData?: any;
  isLoading?: boolean;
  error?: string | null;
}

const DomainOverview: React.FC<DomainOverviewProps> = ({ domain, seoData, isLoading, error }) => {
  
  if (!domain) {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center">
        <Globe className="h-12 w-12 mx-auto text-green-600 mb-3" />
        <h3 className="text-lg font-medium text-green-800">Analyse de domaine</h3>
        <p className="text-green-700 mt-2">
          Entrez un nom de domaine ci-dessus pour obtenir une analyse complète de son autorité, trafic et performances.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Erreur lors de l'analyse du domaine: {error}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Vue d'ensemble de {domain}
            </div>
            {!isLoading && seoData && (
              <a href={seoData.url || `https://${domain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                Visiter <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Titre de la page */}
            <div className="bg-green-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-green-700">Titre de la page</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-20 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">{seoData?.title ? `${seoData.title.length} caractères` : "N/A"}</p>
                )}
              </div>
              <Globe className="h-8 w-8 text-green-500" />
            </div>
            
            {/* Score SEO */}
            <div className="bg-blue-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-blue-700">Score SEO</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">{seoData?.performance?.score || 'N/A'}/100</p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            
            {/* Mots-clés */}
            <div className="bg-amber-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-amber-700">Mots-clés détectés</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">{seoData?.topKeywords?.length || 0}</p>
                )}
              </div>
              <Users className="h-8 w-8 text-amber-500" />
            </div>
            
            {/* Images */}
            <div className="bg-purple-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-purple-700">Images</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-20 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">{seoData?.imgCount || 0} ({seoData?.imgWithoutAlt || 0} sans alt)</p>
                )}
              </div>
              <ExternalLink className="h-8 w-8 text-purple-500" />
            </div>
            
            {/* Liens */}
            <div className="bg-indigo-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-indigo-700">Liens</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">Int: {seoData?.internalLinks || 0} | Ext: {seoData?.externalLinks || 0}</p>
                )}
              </div>
              <Clock className="h-8 w-8 text-indigo-500" />
            </div>
            
            {/* Temps de chargement */}
            <div className="bg-emerald-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-emerald-700">Performance</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">{seoData?.performance?.loadTime ? `${seoData.performance.loadTime}ms` : "N/A"}</p>
                )}
              </div>
              <Zap className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          {seoData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Détails de l'analyse</h4>
              <div className="text-sm space-y-1">
                <p><strong>URL:</strong> {seoData.url}</p>
                <p><strong>Titre:</strong> {seoData.title || "Non défini"}</p>
                <p><strong>Description:</strong> {seoData.description || "Non définie"}</p>
                <p><strong>Nombre de mots:</strong> {seoData.wordCount || "N/A"}</p>
                {seoData.technicalSuggestions && seoData.technicalSuggestions.length > 0 && (
                  <div className="mt-3">
                    <p><strong>Suggestions d'amélioration:</strong></p>
                    <ul className="list-disc pl-5 mt-1">
                      {seoData.technicalSuggestions.slice(0, 3).map((suggestion: string, index: number) => (
                        <li key={index} className="text-gray-600">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <span className="ml-3 text-green-700">Chargement des données...</span>
        </div>
      )}
    </div>
  );
};

export default DomainOverview;
