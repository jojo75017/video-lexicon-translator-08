import React from 'react';
import { Card } from "@/components/ui/card";

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
  const renderNode = (node: SiteNode, level: number = 0) => {
    return (
      <div key={node.path} className="ml-6">
        <div className="flex items-center gap-2 py-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="font-medium">{node.name}</span>
          <span className="text-sm text-gray-500">{node.path}</span>
        </div>
        {node.children && node.children.length > 0 && (
          <div className="border-l-2 border-gray-200 ml-1">
            {node.children.map(child => renderNode(child, level + 1))}
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
          {structure.children.map(node => renderNode(node))}
        </Card>
      </div>
    </div>
  );
};

export default SiteStructureVisualizer;