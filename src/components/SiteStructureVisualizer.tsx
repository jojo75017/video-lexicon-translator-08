
import React from 'react';
import { Card } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';
import { toast } from "sonner";

interface SiteNode {
  name: string;
  path: string;
  children: SiteNode[];
}

interface Props {
  structure: {
    name: string;
    children: SiteNode[];
  };
}

const SiteStructureVisualizer: React.FC<Props> = ({ structure }) => {
  const handleLinkClick = (url: string) => {
    try {
      window.open(url, '_blank');
    } catch (error) {
      toast.error("Impossible d'ouvrir ce lien");
    }
  };

  const renderNode = (node: SiteNode, level: number = 0, parentPath: string = '') => {
    const uniqueKey = `${parentPath}-${node.path}`;
    const isValidUrl = node.path.startsWith('http');
    
    return (
      <div key={uniqueKey} className="ml-6">
        <div className="flex items-center gap-2 py-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="font-medium">{node.name}</span>
          {isValidUrl && (
            <button
              onClick={() => handleLinkClick(node.path)}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span className="truncate max-w-[300px]">{node.path}</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          )}
          {!isValidUrl && (
            <span className="text-sm text-gray-500">{node.path}</span>
          )}
        </div>
        {node.children && node.children.length > 0 && (
          <div className="border-l-2 border-gray-200 ml-1">
            {node.children.map((child, index) => 
              renderNode(child, level + 1, uniqueKey + index)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <Card className="p-4 bg-white/50">
          <div className="font-bold text-lg mb-4">{structure.name}</div>
          {structure.children.map((node, index) => 
            renderNode(node, 0, `root-${index}`)
          )}
        </Card>
      </div>
    </div>
  );
};

export default SiteStructureVisualizer;
