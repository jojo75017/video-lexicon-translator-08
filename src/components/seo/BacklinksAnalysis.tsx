
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link, TrendingUp, TrendingDown, Globe } from "lucide-react";
import { BacklinkInfo } from '@/types/seo/Backlinks';

interface BacklinksAnalysisProps {
  backlinks: BacklinkInfo[];
  doFollowBacklinks: number;
  noFollowBacklinks: number;
  topBacklinkDomains: string[];
}

const BacklinksAnalysis: React.FC<BacklinksAnalysisProps> = ({
  backlinks,
  doFollowBacklinks,
  noFollowBacklinks,
  topBacklinkDomains
}) => {
  const [showAllBacklinks, setShowAllBacklinks] = useState(false);
  
  const displayedBacklinks = showAllBacklinks ? backlinks : backlinks.slice(0, 10);
  const totalBacklinks = backlinks.length;
  const doFollowPercentage = totalBacklinks > 0 ? Math.round((doFollowBacklinks / totalBacklinks) * 100) : 0;
  
  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Backlinks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalBacklinks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">DoFollow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{doFollowBacklinks}</div>
            <div className="text-xs text-gray-500">{doFollowPercentage}% du total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">NoFollow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{noFollowBacklinks}</div>
            <div className="text-xs text-gray-500">{100 - doFollowPercentage}% du total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Domaines référents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{topBacklinkDomains.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Referring Domains */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Principaux domaines référents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {topBacklinkDomains.map((domain, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="font-medium">{domain}</span>
                <Badge variant="outline">{index + 1}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backlinks List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Liste des backlinks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayedBacklinks.map((backlink, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                      <a 
                        href={backlink.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {backlink.domain}
                      </a>
                      <Badge 
                        variant={backlink.dofollow || backlink.isDofollow ? "default" : "secondary"}
                        className={backlink.dofollow || backlink.isDofollow ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {backlink.dofollow || backlink.isDofollow ? "DoFollow" : "NoFollow"}
                      </Badge>
                      {backlink.authority && (
                        <Badge variant="outline">
                          DA: {backlink.authority}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Texte d'ancrage:</strong> {backlink.anchor || backlink.anchorText || "Non spécifié"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      URL: {backlink.url}
                    </div>
                  </div>
                  <div className="ml-4">
                    {backlink.dofollow || backlink.isDofollow ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {!showAllBacklinks && backlinks.length > 10 && (
              <Button 
                variant="outline" 
                onClick={() => setShowAllBacklinks(true)}
                className="w-full"
              >
                Voir tous les {backlinks.length} backlinks
              </Button>
            )}
            
            {showAllBacklinks && (
              <Button 
                variant="outline" 
                onClick={() => setShowAllBacklinks(false)}
                className="w-full"
              >
                Afficher moins
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BacklinksAnalysis;
