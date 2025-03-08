
import React from 'react';
import { Card } from '@/components/ui/card';
import { SeoAnalysisResult } from '@/types/seo';
import { ExternalLink, TrendingUp, Shield } from 'lucide-react';

interface BacklinkSectionProps {
  isLoading: boolean;
  seoAnalysis: SeoAnalysisResult | null;
}

const BacklinkSection: React.FC<BacklinkSectionProps> = ({ isLoading, seoAnalysis }) => {
  return (
    <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ExternalLink className="h-5 w-5 mr-2" />
          Analyse des backlinks
        </h2>
      </div>
      <p className="text-gray-600 mb-6">
        Examinez le profil et la qualité des liens externes pointant vers votre site
      </p>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div>
          {seoAnalysis ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-2">
                  <ExternalLink className="h-5 w-5 text-blue-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Total des backlinks</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">{seoAnalysis.backlinks || 0}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+12% ce mois-ci</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-sm font-medium text-gray-700 ml-2">Score d'autorité</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">{seoAnalysis.authorityScore || 0}/100</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full" 
                    style={{ width: `${seoAnalysis.authorityScore || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Répartition des liens</h3>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-600">DoFollow</span>
                    </div>
                    <span className="text-lg font-semibold">{seoAnalysis.doFollowBacklinks || 0}</span>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-600">NoFollow</span>
                    </div>
                    <span className="text-lg font-semibold">{seoAnalysis.noFollowBacklinks || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500 font-medium">
                Analysez un site pour voir son profil de backlinks
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Les données sur les liens externes s'afficheront ici
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default BacklinkSection;
