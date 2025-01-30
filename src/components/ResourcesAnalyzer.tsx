import React from 'react';
import { Card } from "@/components/ui/card";
import { Resource } from '@/utils/resourceAnalyzer';
import { ExternalLink, FileText, Image as ImageIcon, Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  resources: Resource[];
}

const ResourcesAnalyzer: React.FC<Props> = ({ resources }) => {
  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'script':
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.type === 'image') {
      window.open(resource.url, '_blank', 'width=800,height=600');
    } else {
      window.open(resource.url, '_blank');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiée dans le presse-papier");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Analyse des Ressources</h2>
      <div className="space-y-6">
        {Object.entries(groupedResources).map(([type, resources]) => (
          <div key={type} className="space-y-3">
            <h3 className="font-medium text-lg flex items-center gap-2">
              {getIcon(type)}
              {type}s ({resources.length})
            </h3>
            <div className="grid gap-2">
              {resources.map((resource, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-white/50 hover:bg-white/80 rounded-lg border border-gray-200 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          resource.status === 200 ? 'bg-green-500' : 'bg-red-500'
                        }`} 
                      />
                      <span className="truncate text-sm text-gray-600">
                        {new URL(resource.url).pathname.split('/').pop()}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyUrl(resource.url)}
                        className="text-gray-600"
                      >
                        Copier l'URL
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleResourceClick(resource)}
                        className="gap-2"
                      >
                        Ouvrir
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {resource.size && (
                    <div className="text-sm text-gray-500 mt-2">
                      Taille: {resource.size}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ResourcesAnalyzer;