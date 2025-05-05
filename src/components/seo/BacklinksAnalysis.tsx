
import React from 'react';
import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  ExternalLink,
  Globe,
  LinkIcon,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BacklinkInfo } from '@/types/seo';

interface BacklinksAnalysisProps {
  backlinks?: BacklinkInfo[] | number;
  backlinkDetails?: {
    qualityScore: number;
    relevanceScore: number;
    trustScore: number;
  };
  topBacklinkDomains?: string[];
  doFollowBacklinks?: number;
  noFollowBacklinks?: number;
}

const BacklinksAnalysis = ({
  backlinks,
  backlinkDetails,
  topBacklinkDomains,
  doFollowBacklinks,
  noFollowBacklinks,
}: BacklinksAnalysisProps) => {
  // Valeurs par défaut
  const qualityScore = backlinkDetails?.qualityScore || 65;
  const relevanceScore = backlinkDetails?.relevanceScore || 70;
  const trustScore = backlinkDetails?.trustScore || 60;

  // Valeur par défaut pour les backlinks
  const backlinkCount = typeof backlinks === 'number' ? backlinks : backlinks?.length || 0;
  const doFollow = doFollowBacklinks || 0;
  const noFollow = noFollowBacklinks || 0;
  const topDomains = topBacklinkDomains || [];

  // Pour le graphique
  const totalBacklinks = doFollow + noFollow;
  const doFollowPercent = totalBacklinks > 0 ? Math.round((doFollow / totalBacklinks) * 100) : 0;
  const noFollowPercent = 100 - doFollowPercent;

  let backlinkItems: BacklinkInfo[] = [];
  if (backlinks && Array.isArray(backlinks)) {
    backlinkItems = backlinks.slice(0, 5);
  }

  return (
    <Card className="p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Analyse des backlinks</h3>
        <span className="text-sm text-gray-600">{backlinkCount} backlinks</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Qualité</span>
            <span className="text-sm font-medium">{qualityScore}/100</span>
          </div>
          <Progress value={qualityScore} className="h-2 mt-2" />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pertinence</span>
            <span className="text-sm font-medium">{relevanceScore}/100</span>
          </div>
          <Progress value={relevanceScore} className="h-2 mt-2" />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Confiance</span>
            <span className="text-sm font-medium">{trustScore}/100</span>
          </div>
          <Progress value={trustScore} className="h-2 mt-2" />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Distribution des attributs</h4>
        <div className="flex items-center mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${doFollowPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 w-32 pl-2">
            <span>DoFollow: {doFollow}</span>
            <span>NoFollow: {noFollow}</span>
          </div>
        </div>
      </div>

      {topDomains.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Principaux domaines</h4>
          <ul className="space-y-2">
            {topDomains.map((domain, index) => (
              <li key={index} className="flex items-center text-sm">
                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                {domain}
              </li>
            ))}
          </ul>
        </div>
      )}

      {backlinkItems.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Exemples de backlinks</h4>
          <ul className="space-y-3">
            {backlinkItems.map((link, index) => (
              <li key={index} className="text-sm border-b pb-2">
                <div className="flex items-start">
                  <LinkIcon className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <div className="truncate">{link.sourcePage || link.sourceUrl}</div>
                    <div className="flex mt-1 items-center space-x-2 text-xs text-gray-500">
                      {link.isDofollow ? (
                        <span className="flex items-center text-green-600">
                          <Shield className="h-3 w-3 mr-1" />
                          DoFollow
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          NoFollow
                        </span>
                      )}
                      
                      {link.anchorText && (
                        <span className="border-l pl-2">
                          Texte: "{link.anchorText}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default BacklinksAnalysis;
