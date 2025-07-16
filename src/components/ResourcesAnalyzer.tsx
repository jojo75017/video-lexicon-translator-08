import React from 'react';
import { Card } from "@/components/ui/card";
import { Resource } from '@/utils/resourceAnalyzer';
import { ExternalLink, FileText, Image as ImageIcon, Code, FolderOpen } from 'lucide-react';
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
    try {
      if (resource.type === 'image') {
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(`
            <html>
              <head>
                <title>Aperçu de l'image</title>
                <style>
                  body {
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: #f1f5f9;
                  }
                  img {
                    max-width: 90vw;
                    max-height: 90vh;
                    object-fit: contain;
                  }
                </style>
              </head>
              <body>
                <img src="${resource.url}" alt="Aperçu" />
              </body>
            </html>
          `);
        }
      } else {
        window.open(resource.url, '_blank');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la ressource:', error);
      toast.error("Impossible d'ouvrir cette ressource");
    }
  };

  const copyUrl = (url: string) => {
    try {
      navigator.clipboard.writeText(url);
      toast.success("URL copiée dans le presse-papier");
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      toast.error("Impossible de copier l'URL");
    }
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
                  className="p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all cursor-pointer"
                  onClick={() => handleResourceClick(resource)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          resource.status === 200 ? 'bg-green-500' : 'bg-red-500'
                        }`} 
                      />
                      <span className="truncate text-sm text-gray-600">
                        {resource.url.split('/').pop() || resource.url}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyUrl(resource.url);
                        }}
                        className="text-gray-600"
                      >
                        Copier l'URL
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResourceClick(resource);
                        }}
                        className="gap-2"
                      >
                        Ouvrir
                        <FolderOpen className="h-4 w-4" />
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