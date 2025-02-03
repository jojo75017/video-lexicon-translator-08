import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Twitter, Globe } from 'lucide-react';

interface SocialTagsProps {
  socialTags: {
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterCard: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterImage: string | null;
  };
}

const SocialTags = ({ socialTags }: SocialTagsProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Share2 className="h-5 w-5 text-blue-500" />
        Balises Sociales
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Open Graph
          </h4>
          <div className="space-y-2">
            {socialTags.ogTitle && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">og:title</Badge>
                <span className="text-sm">{socialTags.ogTitle}</span>
              </div>
            )}
            {socialTags.ogDescription && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">og:description</Badge>
                <span className="text-sm">{socialTags.ogDescription}</span>
              </div>
            )}
            {socialTags.ogImage && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">og:image</Badge>
                <span className="text-sm">{socialTags.ogImage}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Twitter Cards
          </h4>
          <div className="space-y-2">
            {socialTags.twitterCard && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">twitter:card</Badge>
                <span className="text-sm">{socialTags.twitterCard}</span>
              </div>
            )}
            {socialTags.twitterTitle && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">twitter:title</Badge>
                <span className="text-sm">{socialTags.twitterTitle}</span>
              </div>
            )}
            {socialTags.twitterDescription && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">twitter:description</Badge>
                <span className="text-sm">{socialTags.twitterDescription}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SocialTags;