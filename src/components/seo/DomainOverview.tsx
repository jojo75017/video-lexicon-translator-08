
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Users, ExternalLink, TrendingUp, Clock, Zap } from "lucide-react";

interface DomainOverviewProps {
  domain?: string;
}

interface DomainData {
  age: number;
  visitors: number;
  pages: number;
  backlinks: number;
  authority: number;
  loadTime: string;
}

const DomainOverview: React.FC<DomainOverviewProps> = ({ domain }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [domainData, setDomainData] = useState<DomainData | null>(null);
  
  useEffect(() => {
    if (domain) {
      setIsLoading(true);
      // Simulation d'un appel API
      setTimeout(() => {
        setDomainData({
          age: Math.floor(Math.random() * 10) + 3,
          visitors: Math.floor(Math.random() * 50000) + 10000,
          pages: Math.floor(Math.random() * 5000) + 100,
          backlinks: Math.floor(Math.random() * 20000) + 1000,
          authority: Math.floor(Math.random() * 50) + 30,
          loadTime: (Math.random() * 2 + 0.5).toFixed(1)
        });
        setIsLoading(false);
      }, 1500);
    } else {
      setDomainData(null);
    }
  }, [domain]);
  
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
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Vue d'ensemble de {domain}
            </div>
            {!isLoading && (
              <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                Visiter <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Âge du domaine */}
            <div className="bg-green-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-green-700">Âge du domaine</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">{domainData?.age} ans</p>
                )}
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            
            {/* Visiteurs mensuels */}
            <div className="bg-blue-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-blue-700">Visiteurs mensuels</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-20 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">{domainData?.visitors.toLocaleString()}</p>
                )}
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            
            {/* Pages indexées */}
            <div className="bg-amber-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-amber-700">Pages indexées</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">{domainData?.pages.toLocaleString()}</p>
                )}
              </div>
              <Globe className="h-8 w-8 text-amber-500" />
            </div>
            
            {/* Backlinks */}
            <div className="bg-purple-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-purple-700">Backlinks</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-20 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">{domainData?.backlinks.toLocaleString()}</p>
                )}
              </div>
              <ExternalLink className="h-8 w-8 text-purple-500" />
            </div>
            
            {/* Autorité du domaine */}
            <div className="bg-indigo-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-indigo-700">Autorité du domaine</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">{domainData?.authority}/100</p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-500" />
            </div>
            
            {/* Temps de chargement */}
            <div className="bg-emerald-50 rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-emerald-700">Temps de chargement</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-semibold">{domainData?.loadTime}s</p>
                )}
              </div>
              <Zap className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
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
