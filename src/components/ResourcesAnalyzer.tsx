import React from 'react';
import { Card } from "@/components/ui/card";
import { Resource } from '@/utils/resourceAnalyzer';

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

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Analyse des Ressources</h2>
      <div className="space-y-6">
        {Object.entries(groupedResources).map(([type, resources]) => (
          <div key={type}>
            <h3 className="font-medium text-lg mb-2">{type}s ({resources.length})</h3>
            <div className="space-y-2">
              {resources.map((resource, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-white/50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        resource.status === 200 ? 'bg-green-500' : 'bg-red-500'
                      }`} 
                    />
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {resource.url}
                    </a>
                  </div>
                  {resource.size && (
                    <div className="text-sm text-gray-500 mt-1">
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