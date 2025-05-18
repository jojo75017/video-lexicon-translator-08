import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowUpRight, Link2, LinkOff, Network, BarChart3, FilePlus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageLinkMetric, OrphanPage } from '@/types/seo/Hierarchy';
import { Button } from "@/components/ui/button";

interface InternalLinkAnalyzerProps {
  pages?: PageLinkMetric[];
  orphanedPages?: OrphanPage[];
  siteUrl?: string;
  totalLinks?: number;
  averageOutgoing?: number;
  averageDepth?: number;
  depthDistribution?: Record<string, number>;
}

const InternalLinkAnalyzer: React.FC<InternalLinkAnalyzerProps> = ({
  pages = [],
  orphanedPages = [],
  siteUrl = "",
  totalLinks = 0,
  averageOutgoing = 0,
  averageDepth = 0,
  depthDistribution = {}
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    totalPages: 0,
    totalLinks: 0,
    avgLinksPerPage: 0,
    connectedPages: 0,
    orphanedPages: 0,
    maxDepth: 0
  });
  
  useEffect(() => {
    // Calculate metrics
    const totalPages = pages.length;
    const connectedPages = totalPages - orphanedPages.length;
    let maxDepth = 0;
    
    pages.forEach(page => {
      if (page.depth > maxDepth) {
        maxDepth = page.depth;
      }
    });
    
    setMetrics({
      totalPages,
      totalLinks: totalLinks || 0,
      avgLinksPerPage: totalPages > 0 ? Math.round((totalLinks || 0) / totalPages) : 0,
      connectedPages,
      orphanedPages: orphanedPages.length,
      maxDepth
    });
  }, [pages, orphanedPages, totalLinks]);
  
  // Find pages with the most incoming/outgoing links
  const getMostLinkedPages = (type: 'incoming' | 'outgoing', limit: number = 5) => {
    if (!pages || pages.length === 0) return [];
    
    const sortedPages = [...pages].sort((a, b) => {
      return type === 'incoming' 
        ? b.incomingLinks - a.incomingLinks 
        : b.outgoingLinks - a.outgoingLinks;
    });
    
    return sortedPages.slice(0, limit);
  };
  
  // Calculate distribution for chart
  const getDistribution = () => {
    // Distribution by depth
    const depthDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, '5+': 0 };
    
    pages.forEach(page => {
      const depth = page.depth;
      if (depth <= 5) {
        depthDist[depth] = (depthDist[depth] || 0) + 1;
      } else {
        depthDist['5+'] = (depthDist['5+'] || 0) + 1;
      }
    });
    
    // Distribution by incoming links
    const inDist = { 0: 0, '1-3': 0, '4-10': 0, '11+': 0 };
    
    pages.forEach(page => {
      const links = page.incomingLinks;
      if (links === 0) inDist[0]++;
      else if (links <= 3) inDist['1-3']++;
      else if (links <= 10) inDist['4-10']++;
      else inDist['11+']++;
    });
    
    // Distribution by outgoing links
    const outDist = { 0: 0, '1-5': 0, '6-15': 0, '16+': 0 };
    
    pages.forEach(page => {
      const links = page.outgoingLinks;
      if (links === 0) outDist[0]++;
      else if (links <= 5) outDist['1-5']++;
      else if (links <= 15) outDist['6-15']++;
      else outDist['16+']++;
    });
    
    return { depthDist, inDist, outDist };
  };
  
  const distribution = getDistribution();
  const mostIncoming = getMostLinkedPages('incoming');
  const mostOutgoing = getMostLinkedPages('outgoing');
  
  const getLinkScore = () => {
    if (!pages || pages.length === 0) return 0;
    
    const orphanPercentage = metrics.totalPages > 0 
      ? (orphanedPages.length / metrics.totalPages) * 100 
      : 0;
    
    let depthScore = 0;
    if (metrics.maxDepth <= 3) depthScore = 100;
    else if (metrics.maxDepth <= 5) depthScore = 80;
    else if (metrics.maxDepth <= 7) depthScore = 60;
    else depthScore = 40;
    
    let linkDensity = 0;
    if (metrics.avgLinksPerPage >= 3 && metrics.avgLinksPerPage <= 15) linkDensity = 100;
    else if (metrics.avgLinksPerPage > 15) linkDensity = 70;
    else if (metrics.avgLinksPerPage > 0) linkDensity = 60;
    else linkDensity = 0;
    
    const orphanScore = Math.max(0, 100 - orphanPercentage * 4);
    
    // Calculate overall score
    return Math.round((depthScore + linkDensity + orphanScore) / 3);
  };
  
  const linkScore = getLinkScore();
  
  const getTruncatedUrl = (url: string) => {
    if (!url) return "";
    if (url.length <= 30) return url;
    
    // Keep the domain and truncate the path
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const path = urlObj.pathname;
      
      if (path.length <= 15) return `${domain}${path}`;
      return `${domain}${path.substring(0, 12)}...`;
    } catch {
      return url.substring(0, 27) + "...";
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Network className="h-5 w-5 text-blue-600" />
          Analyse du maillage interne
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="pages">Pages clés</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-white shadow-sm border border-blue-100">
                  <span className={`text-lg font-bold ${
                    linkScore >= 80 ? "text-green-600" :
                    linkScore >= 60 ? "text-amber-500" : 
                    "text-red-500"
                  }`}>{linkScore}</span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium">Score de Maillage</div>
                  <div className="text-xs text-gray-500">
                    {linkScore >= 80 ? "Excellent" :
                    linkScore >= 60 ? "Bon" :
                    linkScore >= 40 ? "Moyen" : 
                    "Insuffisant"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm font-bold">{metrics.totalPages}</div>
                  <div className="text-xs text-gray-500">Pages</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold">{metrics.totalLinks}</div>
                  <div className="text-xs text-gray-500">Liens</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold">{metrics.orphanedPages}</div>
                  <div className="text-xs text-gray-500">Orphelines</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium mb-4">Profondeur des pages</h3>
                <div className="space-y-4">
                  {Object.entries(distribution.depthDist || {}).map(([depth, count], index) => (
                    <div key={depth} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Niveau {depth}</span>
                        <span>{count} page{count > 1 ? 's' : ''}</span>
                      </div>
                      <Progress 
                        value={count > 0 ? (count / metrics.totalPages) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                  ))}
                  
                  <div className="pt-2 text-xs text-gray-500 italic">
                    Profondeur moyenne : {Number(averageDepth).toFixed(1)} niveau{averageDepth !== 1 ? 'x' : ''}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium mb-4">Distribution des liens</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium mb-2">Liens entrants</div>
                    <div className="flex items-center h-5 mb-2">
                      {Object.entries(distribution.inDist || {}).map(([range, count], index) => (
                        <div 
                          key={range}
                          className={`h-full ${
                            index === 0 ? "bg-red-400" :
                            index === 1 ? "bg-amber-400" :
                            index === 2 ? "bg-green-400" :
                            "bg-blue-400"
                          }`}
                          style={{ width: `${(count / metrics.totalPages) * 100}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0 liens</span>
                      <span>1-3 liens</span>
                      <span>4-10 liens</span>
                      <span>11+ liens</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-xs font-medium mb-2">Liens sortants</div>
                    <div className="flex items-center h-5 mb-2">
                      {Object.entries(distribution.outDist || {}).map(([range, count], index) => (
                        <div 
                          key={range}
                          className={`h-full ${
                            index === 0 ? "bg-red-400" :
                            index === 1 ? "bg-amber-400" :
                            index === 2 ? "bg-green-400" :
                            "bg-blue-400"
                          }`}
                          style={{ width: `${(count / metrics.totalPages) * 100}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0 liens</span>
                      <span>1-5 liens</span>
                      <span>6-15 liens</span>
                      <span>16+ liens</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="pages" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1 text-blue-500" />
                  Pages les plus liées
                </h3>
                <div className="space-y-2">
                  {mostIncoming.length > 0 ? (
                    mostIncoming.map((page, index) => (
                      <div key={`in-${index}`} className="p-3 bg-white rounded-md border border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="truncate max-w-[200px]">
                            {getTruncatedUrl(page.url)}
                          </div>
                          <Badge variant="secondary">
                            {page.incomingLinks} lien{page.incomingLinks > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-md text-gray-500">
                      Aucune donnée de liens entrants
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Network className="h-4 w-4 mr-1 text-purple-500" />
                  Pages avec le plus de liens sortants
                </h3>
                <div className="space-y-2">
                  {mostOutgoing.length > 0 ? (
                    mostOutgoing.map((page, index) => (
                      <div key={`out-${index}`} className="p-3 bg-white rounded-md border border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="truncate max-w-[200px]">
                            {getTruncatedUrl(page.url)}
                          </div>
                          <Badge variant="outline">
                            {page.outgoingLinks} lien{page.outgoingLinks > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-md text-gray-500">
                      Aucune donnée de liens sortants
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <LinkOff className="h-4 w-4 mr-1 text-red-500" />
                Pages orphelines ({orphanedPages.length})
              </h3>
              
              {orphanedPages.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {orphanedPages.map((page, index) => (
                    <div key={`orphan-${index}`} className="p-3 bg-white rounded-md border border-red-100 flex items-center justify-between">
                      <div className="truncate max-w-[300px] text-sm">{page.url}</div>
                      <Button size="sm" variant="outline" className="text-xs h-8">
                        <Link2 className="h-3 w-3 mr-1" />
                        Ajouter des liens
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <div className="text-green-700 text-sm">
                    Aucune page orpheline détectée. Excellent maillage !
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <Alert className={orphanedPages.length > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              <AlertTriangle className={`h-4 w-4 ${orphanedPages.length > 0 ? "text-red-500" : "text-green-500"}`} />
              <AlertTitle className={orphanedPages.length > 0 ? "text-red-700" : "text-green-700"}>
                Pages orphelines
              </AlertTitle>
              <AlertDescription className={`text-sm ${orphanedPages.length > 0 ? "text-red-700" : "text-green-700"}`}>
                {orphanedPages.length > 0 
                  ? `Vous avez ${orphanedPages.length} page${orphanedPages.length > 1 ? 's' : ''} orpheline${orphanedPages.length > 1 ? 's' : ''}. Ajoutez des liens vers ces pages.`
                  : "Aucune page orpheline détectée. Excellent travail!"
                }
              </AlertDescription>
            </Alert>
            
            {metrics.maxDepth > 3 && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">
                  Profondeur excessive
                </AlertTitle>
                <AlertDescription className="text-sm text-amber-700">
                  {`Certaines pages sont à ${metrics.maxDepth} niveaux de profondeur. Améliorez la structure pour limiter à 3-4 niveaux.`}
                </AlertDescription>
              </Alert>
            )}
            
            {metrics.avgLinksPerPage < 2 && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">
                  Densité de liens faible
                </AlertTitle>
                <AlertDescription className="text-sm text-amber-700">
                  {`Moyenne de ${metrics.avgLinksPerPage.toFixed(1)} liens par page. Visez au moins 3-5 liens internes par page.`}
                </AlertDescription>
              </Alert>
            )}
            
            {metrics.avgLinksPerPage > 25 && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">
                  Trop de liens par page
                </AlertTitle>
                <AlertDescription className="text-sm text-amber-700">
                  {`Moyenne de ${metrics.avgLinksPerPage.toFixed(1)} liens par page. Une densité très élevée peut diluer la pertinence.`}
                </AlertDescription>
              </Alert>
            )}
            
            {linkScore >= 80 && orphanedPages.length === 0 && metrics.maxDepth <= 3 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">
                  Excellent maillage interne
                </AlertTitle>
                <AlertDescription className="text-sm text-green-700">
                  Votre maillage interne est bien structuré avec une bonne densité de liens et une profondeur optimale.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-3 text-blue-800">Améliorations prioritaires</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                {orphanedPages.length > 0 && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Créez des liens vers les pages orphelines depuis des pages pertinentes</span>
                  </li>
                )}
                {metrics.maxDepth > 3 && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Réduisez la profondeur en liant les pages importantes depuis la page d'accueil</span>
                  </li>
                )}
                {metrics.avgLinksPerPage < 2 && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Augmentez le nombre de liens internes, surtout sur les pages à contenu long</span>
                  </li>
                )}
                {metrics.avgLinksPerPage > 25 && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Réduisez le nombre de liens sur certaines pages pour éviter la dilution</span>
                  </li>
                )}
                {linkScore >= 90 && orphanedPages.length === 0 && metrics.maxDepth <= 3 && metrics.avgLinksPerPage >= 2 && metrics.avgLinksPerPage <= 25 && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Continuez à maintenir cette excellente structure de maillage!</span>
                  </li>
                )}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InternalLinkAnalyzer;
