
import React from 'react';
import { Card } from "@/components/ui/card";
import SearchTrends from "@/components/seo/SearchTrends";
import { motion } from "framer-motion";
import { analyzeSearchConsole } from '@/utils/seo/searchConsoleAnalyzer';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Search, TrendingUp, Users, LineChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

interface RankingTrackerProps {
  url: string;
}

const RankingTracker: React.FC<RankingTrackerProps> = ({ url }) => {
  const { t } = useTranslation();
  
  const { data: searchData, isLoading } = useQuery({
    queryKey: ['searchConsole', url],
    queryFn: () => analyzeSearchConsole(url),
    enabled: !!url && url.length > 0,
  });

  // Show empty state if no URL is provided
  if (!url) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">{t('seo.noWebsiteToAnalyze')}</h3>
          <p className="text-gray-500 max-w-md">
            {t('seo.enterUrlToSeeRankingData')}
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Card>
    );
  }

  if (!searchData) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500 py-10">{t('seo.noDataAvailable')}</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-indigo-600" />
            {t('seo.rankingTracker')}
          </h2>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            {t('seo.last30Days')}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-lg flex items-center gap-4">
            <div className="bg-indigo-200 p-3 rounded-full">
              <Search className="h-6 w-6 text-indigo-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">{t('seo.averagePosition')}</h3>
              <p className="text-3xl font-bold text-indigo-900">{searchData.position.toFixed(1)}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-lg flex items-center gap-4">
            <div className="bg-emerald-200 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-700">{t('seo.clicks')}</h3>
              <p className="text-3xl font-bold text-emerald-900">{searchData.clicks.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-5 rounded-lg flex items-center gap-4">
            <div className="bg-violet-200 p-3 rounded-full">
              <Users className="h-6 w-6 text-violet-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-violet-700">{t('seo.impressions')}</h3>
              <p className="text-3xl font-bold text-violet-900">{searchData.impressions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <SearchTrends 
          clicks={searchData.clicks} 
          impressions={searchData.impressions} 
        />
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">{t('seo.topKeywords')}</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {searchData.keywords.length > 0 ? (
                <div className="space-y-3">
                  {searchData.keywords.map((keyword, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border border-gray-100">
                      <span className="font-medium">{keyword.keyword}</span>
                      <div className="flex items-center">
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                          {keyword.count} {t('seo.occurrences')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">{t('seo.noKeywordsFound')}</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">{t('seo.topPages')}</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {searchData.topPages.length > 0 ? (
                <div className="space-y-3">
                  {searchData.topPages.slice(0, 3).map((page, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border border-gray-100">
                      <span className="font-medium truncate max-w-[200px]">{page.url.replace(url, '')}</span>
                      <div className="flex items-center">
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                          {page.clicks} {t('seo.clicks')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">{t('seo.noPagesFound')}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RankingTracker;
