import React from 'react';
import { Card } from "@/components/ui/card";
import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { SocialMetrics as SocialMetricsType } from '@/types/seo';

interface SocialMetricsProps {
  metrics: SocialMetricsType;
}

const SocialMetrics = ({ metrics }: SocialMetricsProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Share2 className="h-5 w-5 text-blue-500" />
        Métriques Sociales
      </h3>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Facebook</span>
          </div>
          <div className="text-sm space-y-1">
            <p>Partages: {metrics.facebook.shares}</p>
            <p>J'aimes: {metrics.facebook.likes}</p>
            <p>Commentaires: {metrics.facebook.comments}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-blue-400" />
            <span className="font-medium">Twitter</span>
          </div>
          <div className="text-sm space-y-1">
            <p>Partages: {metrics.twitter.shares}</p>
            <p>J'aimes: {metrics.twitter.likes}</p>
            <p>Réponses: {metrics.twitter.replies}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-700" />
            <span className="font-medium">LinkedIn</span>
          </div>
          <div className="text-sm space-y-1">
            <p>Partages: {metrics.linkedin.shares}</p>
            <p>Engagements: {metrics.linkedin.engagements}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SocialMetrics;