
import React from 'react';
import { Card } from "@/components/ui/card";
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BrokenLink } from '@/types/seo';

interface BrokenLinksProps {
  brokenLinks?: BrokenLink[];
}

const BrokenLinks = ({ brokenLinks = [] }: BrokenLinksProps) => {
  if (!brokenLinks || brokenLinks.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        Liens Cassés ({brokenLinks.length})
      </h3>

      <div className="space-y-3">
        {brokenLinks.map((link, index) => (
          <Alert key={index} variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span className="font-medium">{link.url}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Status: </span>
                {link.statusCode || link.status || 'Inconnu'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Trouvé dans: </span>
                {link.location || link.text || 'Page principale'}
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </Card>
  );
};

export default BrokenLinks;
