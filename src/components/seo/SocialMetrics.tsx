
import React from 'react';
import { Card } from "@/components/ui/card";
import { Facebook, MessageSquare, ThumbsUp, Twitter } from "lucide-react";

interface SocialMetricsProps {
  metrics: {
    facebook: {
      shares: number;
      comments: number;
      likes: number;
    };
    twitter: {
      tweets: number;
      retweets: number;
      likes: number;
    };
    pinterest: {
      pins: number;
      saves: number;
    };
    linkedin: {
      shares: number;
    };
  };
}

const SocialMetrics = ({ metrics }: SocialMetricsProps) => {
  const totalFacebookEngagements = 
    metrics.facebook.shares + 
    metrics.facebook.comments + 
    metrics.facebook.likes;
  
  const totalTwitterEngagements = 
    metrics.twitter.tweets + 
    metrics.twitter.retweets + 
    metrics.twitter.likes;
  
  const totalPinterestEngagements = 
    metrics.pinterest.pins + 
    metrics.pinterest.saves;
  
  const totalLinkedInEngagements = metrics.linkedin.shares;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Métriques sociales</h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <Facebook className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Facebook</span>
              <span className="text-sm text-gray-500">
                {totalFacebookEngagements} interactions
              </span>
            </div>
            <div className="flex mt-1 items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center">
                <ThumbsUp className="h-3 w-3 mr-1" />
                {metrics.facebook.likes}
              </span>
              <span className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                {metrics.facebook.comments}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <Twitter className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Twitter</span>
              <span className="text-sm text-gray-500">
                {totalTwitterEngagements} interactions
              </span>
            </div>
            <div className="flex mt-1 items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center">
                <ThumbsUp className="h-3 w-3 mr-1" />
                {metrics.twitter.likes}
              </span>
              <span className="flex items-center">
                {metrics.twitter.retweets} retweets
              </span>
            </div>
          </div>
        </div>
        
        {/* Autres réseaux sociaux ici */}
        
        <div className="pt-2">
          <div className="text-xs text-gray-500 mt-2">
            <div className="flex justify-between mb-1">
              <span>Engagement total</span>
              <span>{totalFacebookEngagements + totalTwitterEngagements + totalPinterestEngagements + totalLinkedInEngagements}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `75%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SocialMetrics;
