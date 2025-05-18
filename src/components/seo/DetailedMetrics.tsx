
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, CircleCheck, Link2, Share2, ShieldCheck, Maximize } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { SocialMetricsProps, BacklinksAnalysisProps, SocialTags } from '@/types/seo/Hierarchy';

const SocialMetricsCard: React.FC<SocialMetricsProps> = ({ 
  facebook,
  twitter,
  pinterest,
  linkedin
}) => {
  const total = facebook + twitter + pinterest + linkedin;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Share2 className="h-5 w-5 mr-2 text-blue-600" />
          Partages sociaux
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">{total.toLocaleString()}</div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Facebook</span>
              <span className="font-medium">{facebook.toLocaleString()}</span>
            </div>
            <Progress value={(facebook / total) * 100} className="h-2 bg-gray-100" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Twitter</span>
              <span className="font-medium">{twitter.toLocaleString()}</span>
            </div>
            <Progress value={(twitter / total) * 100} className="h-2 bg-gray-100" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Pinterest</span>
              <span className="font-medium">{pinterest.toLocaleString()}</span>
            </div>
            <Progress value={(pinterest / total) * 100} className="h-2 bg-gray-100" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>LinkedIn</span>
              <span className="font-medium">{linkedin.toLocaleString()}</span>
            </div>
            <Progress value={(linkedin / total) * 100} className="h-2 bg-gray-100" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SocialTagsCard: React.FC<{ tags: SocialTags }> = ({ tags }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Maximize className="h-5 w-5 mr-2 text-indigo-600" />
          Balises sociales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-md p-3">
            <h3 className="font-medium mb-1 text-sm">Open Graph</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">og:title</span>
                <span className={tags.ogTitle ? "text-green-600" : "text-red-600"}>
                  {tags.ogTitle ? <CircleCheck className="h-4 w-4" /> : "Manquant"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">og:description</span>
                <span className={tags.ogDescription ? "text-green-600" : "text-red-600"}>
                  {tags.ogDescription ? <CircleCheck className="h-4 w-4" /> : "Manquant"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">og:image</span>
                <span className={tags.ogImage ? "text-green-600" : "text-red-600"}>
                  {tags.ogImage ? <CircleCheck className="h-4 w-4" /> : "Manquant"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <h3 className="font-medium mb-1 text-sm">Twitter Card</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">twitter:card</span>
                <span className={tags.twitterCard ? "text-green-600" : "text-red-600"}>
                  {tags.twitterCard ? <CircleCheck className="h-4 w-4" /> : "Manquant"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">twitter:title</span>
                <span className={tags.twitterTitle ? "text-green-600" : "text-red-600"}>
                  {tags.twitterTitle ? <CircleCheck className="h-4 w-4" /> : "Manquant"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">twitter:description</span>
                <span className={tags.twitterDescription ? "text-green-600" : "text-red-600"}>
                  {tags.twitterDescription ? <CircleCheck className="h-4 w-4" /> : "Manquant"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">twitter:image</span>
                <span className={tags.twitterImage ? "text-green-600" : "text-red-600"}>
                  {tags.twitterImage ? <CircleCheck className="h-4 w-4" /> : "Manquant"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BacklinksAnalysis: React.FC<BacklinksAnalysisProps> = ({ 
  backlinks, 
  doFollowCount, 
  noFollowCount, 
  topDomains, 
  qualityScore,
  relevanceScore,
  trustScore 
}) => {
  const totalBacklinks = backlinks.length;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Link2 className="h-5 w-5 mr-2 text-blue-600" />
          Analyse des backlinks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Backlinks totaux</div>
            <div className="text-2xl font-bold">{totalBacklinks}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Domaines référents</div>
            <div className="text-2xl font-bold">{topDomains.length}</div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Type de lien</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${(doFollowCount / totalBacklinks) * 100}%` }} 
                />
                <div 
                  className="h-full bg-gray-300" 
                  style={{ width: `${(noFollowCount / totalBacklinks) * 100}%` }} 
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-1"></span> DoFollow ({doFollowCount})</div>
              <div className="flex items-center"><span className="h-2 w-2 bg-gray-300 rounded-full mr-1"></span> NoFollow ({noFollowCount})</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Qualité</span>
                <span className="text-sm font-medium">{qualityScore}/100</span>
              </div>
              <Progress value={qualityScore} className="h-2 bg-gray-100" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Pertinence</span>
                <span className="text-sm font-medium">{relevanceScore}/100</span>
              </div>
              <Progress value={relevanceScore} className="h-2 bg-gray-100" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Confiance</span>
                <span className="text-sm font-medium">{trustScore}/100</span>
              </div>
              <Progress value={trustScore} className="h-2 bg-gray-100" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DetailedMetricsProps {
  url: string;
  facebookShares: number;
  twitterShares: number;
  pinterestShares: number;
  linkedinShares: number;
  backlinks: any[];
  doFollow: number;
  noFollow: number;
  domains: any[];
  qualityScore: number;
  relevanceScore: number;
  trustScore: number;
  socialTags: SocialTags;
}

const DetailedMetrics: React.FC<DetailedMetricsProps> = ({
  url,
  facebookShares = 0,
  twitterShares = 0,
  pinterestShares = 0,
  linkedinShares = 0,
  backlinks = [],
  doFollow = 0,
  noFollow = 0,
  domains = [],
  qualityScore = 0,
  relevanceScore = 0,
  trustScore = 0,
  socialTags
}) => {
  const [activeTab, setActiveTab] = useState('social-shares');
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Tabs 
            defaultValue="social-shares" 
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 bg-muted/50 p-0">
              <TabsTrigger value="social-shares" className="flex-1 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                <Share2 className="w-4 h-4 mr-2" />
                Partages sociaux
              </TabsTrigger>
              <TabsTrigger value="social-tags" className="flex-1 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                <Maximize className="w-4 h-4 mr-2" />
                Balises sociales
              </TabsTrigger>
              <TabsTrigger value="backlinks" className="flex-1 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                <Link2 className="w-4 h-4 mr-2" />
                Backlinks
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="social-shares" className="p-4">
              <SocialMetricsCard
                facebook={facebookShares}
                twitter={twitterShares}
                pinterest={pinterestShares}
                linkedin={linkedinShares}
              />
            </TabsContent>
            
            <TabsContent value="social-tags" className="p-4">
              <SocialTagsCard tags={socialTags} />
            </TabsContent>
            
            <TabsContent value="backlinks" className="p-4">
              <BacklinksAnalysis 
                backlinks={backlinks}
                doFollowCount={doFollow}
                noFollowCount={noFollow}
                topDomains={domains}
                qualityScore={qualityScore}
                relevanceScore={relevanceScore}
                trustScore={trustScore}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedMetrics;
