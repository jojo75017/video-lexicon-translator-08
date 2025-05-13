
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { InternalLinkAnalysis, PageLinkMetric, InternalLinkRecommendation } from '@/types/seo';
import { 
  Link2, 
  ExternalLink, 
  BarChart2, 
  ArrowRight, 
  FileSymlink, 
  Layers, 
  FileWarning 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SeoChecklistItem from './SeoChecklistItem';

interface InternalLinkAnalyzerProps {
  analysis: InternalLinkAnalysis | undefined;
  url: string;
}

const InternalLinkAnalyzer: React.FC<InternalLinkAnalyzerProps> = ({ analysis, url }) => {
  const { t } = useTranslation();

  if (!analysis) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-blue-600" />
            {t('seo.internalLinks.title', 'Analyse des liens internes')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-gray-500">
            {t('seo.internalLinks.noData', 'Aucune donnée disponible sur les liens internes')}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get base domain for proper URL formatting
  const baseUrl = url ? new URL(url).origin : '';

  const formatUrl = (fullUrl: string) => {
    if (!fullUrl) return '';
    try {
      // Convert to relative URL if same domain
      if (fullUrl.startsWith(baseUrl)) {
        return fullUrl.replace(baseUrl, '');
      }
      return fullUrl;
    } catch (e) {
      return fullUrl;
    }
  };

  const formatPageTitle = (pageMetric: PageLinkMetric) => {
    return pageMetric.title || formatUrl(pageMetric.url);
  };

  const getImportanceColor = (importance: number) => {
    if (importance > 80) return 'text-green-600 bg-green-50';
    if (importance > 60) return 'text-blue-600 bg-blue-50';
    if (importance > 40) return 'text-purple-600 bg-purple-50';
    if (importance > 20) return 'text-amber-600 bg-amber-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-blue-600" />
          {t('seo.internalLinks.title', 'Analyse des liens internes')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-sm text-blue-600 mb-1">{t('seo.internalLinks.totalLinks', 'Total des liens')}</div>
            <div className="text-2xl font-bold">{analysis.totalLinks}</div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <div className="text-sm text-indigo-600 mb-1">{t('seo.internalLinks.uniquePages', 'Pages uniques')}</div>
            <div className="text-2xl font-bold">{analysis.uniquePages}</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="text-sm text-purple-600 mb-1">{t('seo.internalLinks.averageDepth', 'Profondeur moyenne')}</div>
            <div className="text-2xl font-bold">{analysis.linkDepth.averageDepth.toFixed(1)}</div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
            <div className="text-sm text-amber-600 mb-1">{t('seo.internalLinks.orphanPages', 'Pages orphelines')}</div>
            <div className="text-2xl font-bold">{analysis.orphanPages.length}</div>
          </div>
        </div>

        <Tabs defaultValue="metrics" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">
              <BarChart2 className="h-4 w-4 mr-1" />
              {t('seo.internalLinks.pageMetrics', 'Métriques des pages')}
            </TabsTrigger>
            <TabsTrigger value="distribution">
              <Layers className="h-4 w-4 mr-1" />
              {t('seo.internalLinks.distribution', 'Distribution')}
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <FileSymlink className="h-4 w-4 mr-1" />
              {t('seo.internalLinks.recommendations', 'Recommandations')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('seo.internalLinks.page', 'Page')}</TableHead>
                  <TableHead className="text-center">{t('seo.internalLinks.incomingLinks', 'Liens entrants')}</TableHead>
                  <TableHead className="text-center">{t('seo.internalLinks.outgoingLinks', 'Liens sortants')}</TableHead>
                  <TableHead className="text-center">{t('seo.internalLinks.depth', 'Profondeur')}</TableHead>
                  <TableHead className="text-center">{t('seo.internalLinks.importance', 'Importance')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.pageMetrics
                  .sort((a, b) => b.importance - a.importance)
                  .slice(0, 10)
                  .map((page, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium truncate max-w-[200px]">
                        {formatPageTitle(page)}
                        <div className="text-xs text-gray-500 truncate">
                          {formatUrl(page.url)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{page.incomingLinks}</TableCell>
                      <TableCell className="text-center">{page.outgoingLinks}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" 
                          className={page.depth <= 2 ? "bg-green-50 text-green-700" : 
                                    page.depth <= 4 ? "bg-amber-50 text-amber-700" : 
                                    "bg-red-50 text-red-700"}
                        >
                          {page.depth}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={page.importance} className="h-2" />
                          <span className={`text-sm px-2 py-0.5 rounded ${getImportanceColor(page.importance)}`}>
                            {page.importance}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {analysis.pageMetrics.length > 10 && (
              <div className="text-center text-sm text-gray-500 mt-2">
                {t('seo.internalLinks.showingTopPages', 'Affichage des 10 pages les plus importantes sur {{total}}', {
                  total: analysis.pageMetrics.length
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="distribution">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">{t('seo.internalLinks.linkTypes', 'Types de liens')}</h3>
                <div className="space-y-4">
                  {Object.entries(analysis.linkDistribution).map(([key, value]) => {
                    const total = analysis.totalLinks;
                    const percentage = total > 0 ? (Number(value) / total) * 100 : 0;
                    
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                          <span className="font-medium">{value} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">{t('seo.internalLinks.depthDistribution', 'Distribution par profondeur')}</h3>
                {Object.entries(analysis.linkDepth.depthDistribution).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(analysis.linkDepth.depthDistribution)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([depth, count]) => {
                        const total = analysis.uniquePages;
                        const percentage = total > 0 ? (Number(count) / total) * 100 : 0;
                        
                        return (
                          <div key={depth} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{t('seo.internalLinks.depthLevel', 'Niveau {{depth}}', { depth })}</span>
                              <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <Progress 
                              value={percentage} 
                              className={`h-2 ${Number(depth) <= 2 ? 'bg-green-100' : 
                                               Number(depth) <= 4 ? 'bg-amber-100' : 
                                               'bg-red-100'}`} 
                            />
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">{t('seo.internalLinks.noDepthData', 'Aucune donnée de profondeur disponible')}</div>
                )}
              </div>
            </div>
            
            {analysis.orphanPages.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3 flex items-center">
                  <FileWarning className="h-4 w-4 mr-2 text-amber-600" />
                  {t('seo.internalLinks.orphanPages', 'Pages orphelines')} ({analysis.orphanPages.length})
                </h3>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="text-sm text-amber-800 mb-2">
                    {t('seo.internalLinks.orphanDescription', 
                      'Les pages orphelines sont des pages sans aucun lien interne pointant vers elles, ce qui les rend difficiles à découvrir pour les moteurs de recherche.')}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {analysis.orphanPages.slice(0, 5).map((page, index) => (
                      <Badge key={index} variant="outline" className="bg-white">
                        {formatUrl(page)}
                      </Badge>
                    ))}
                    {analysis.orphanPages.length > 5 && (
                      <Badge variant="outline" className="bg-white">
                        +{analysis.orphanPages.length - 5} {t('common.more', 'autres')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {analysis.siloPagesFound && analysis.siloStructure && (
              <div className="mt-6">
                <h3 className="font-medium mb-3 flex items-center">
                  <Layers className="h-4 w-4 mr-2 text-green-600" />
                  {t('seo.internalLinks.siloStructure', 'Structure en silo')} 
                </h3>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="text-sm text-green-800 mb-2">
                    {t('seo.internalLinks.siloDescription', 
                      'Les structures en silo organisent le contenu de manière thématique, ce qui peut améliorer le référencement en établissant une autorité thématique claire.')}
                  </div>
                  <div className="space-y-3 mt-3">
                    {analysis.siloStructure.slice(0, 3).map((silo, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-green-100">
                        <div className="font-medium text-green-800">{silo.name}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <span>{formatUrl(silo.mainPage)}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{silo.subPages.length} {t('common.pages', 'pages')}</span>
                        </div>
                      </div>
                    ))}
                    {analysis.siloStructure.length > 3 && (
                      <div className="text-center text-sm text-gray-500">
                        +{analysis.siloStructure.length - 3} {t('common.more', 'autres silos')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations">
            <div className="space-y-4">
              {analysis.recommendations
                .sort((a, b) => priorityScore(b.priority) - priorityScore(a.priority))
                .map((recommendation, index) => (
                  <SeoChecklistItem
                    key={index}
                    title={recommendation.description}
                    status={recommendationToStatus(recommendation.type)}
                    description={recommendation.reason}
                    priority={recommendation.priority}
                    impact={recommendation.impact}
                    value={recommendation.source && recommendation.target ? 
                      `${formatUrl(recommendation.source)} → ${formatUrl(recommendation.target)}` : 
                      undefined
                    }
                  />
                ))}
                
              {analysis.recommendations.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  {t('seo.internalLinks.noRecommendations', 'Aucune recommandation disponible')}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper functions
const priorityScore = (priority: 'high' | 'medium' | 'low'): number => {
  switch (priority) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
};

const recommendationToStatus = (type: string): 'success' | 'error' | 'warning' | 'info' => {
  switch (type) {
    case 'add': return 'success';
    case 'remove': return 'error';
    case 'modify': return 'warning';
    case 'info': 
    default: return 'info';
  }
};

export default InternalLinkAnalyzer;
