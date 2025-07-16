
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ExternalLink, ChevronDown, ChevronRight, FolderTree, Globe, Link2 } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
  const toggleNode = (nodePath: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodePath]: !prev[nodePath]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    
    const processNodes = (nodes: SiteNode[], path = '') => {
      nodes.forEach((node, index) => {
        const nodePath = path ? `${path}-${index}` : `root-${index}`;
        allExpanded[nodePath] = true;
        
        if (node.children && node.children.length > 0) {
          processNodes(node.children, nodePath);
        }
      });
    };
    
    processNodes(structure.children);
    setExpandedNodes(allExpanded);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  const handleLinkClick = (url: string) => {
    try {
      window.open(url, '_blank');
    } catch (error) {
      toast.error("Impossible d'ouvrir ce lien");
    }
  };

  const renderNode = (node: SiteNode, level: number = 0, parentPath: string = '') => {
    const nodePath = parentPath ? `${parentPath}-${node.path}` : `root-${node.path}`;
    const isExpanded = expandedNodes[nodePath] !== false;
    const hasChildren = node.children && node.children.length > 0;
    const isValidUrl = node.path.startsWith('http');
    
    return (
      <div key={nodePath} className="ml-1">
        <div 
          className={`
            flex items-center gap-2 p-2 rounded-md transition-colors
            ${level === 0 ? 'bg-blue-50 border border-blue-100' : ''}
            ${level === 1 ? 'bg-gray-50 border border-gray-100' : ''}
          `}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleNode(nodePath)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <div className="w-4"></div>
          )}
          
          {level === 0 ? (
            <FolderTree className="h-5 w-5 text-blue-600" />
          ) : (
            <Link2 className="h-4 w-4 text-gray-500" />
          )}
          
          <span className="font-medium">{node.name}</span>
          
          {isValidUrl && (
            <button
              onClick={() => handleLinkClick(node.path)}
              className="ml-auto inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-gray-200 ml-4 pl-2 mt-1 space-y-1">
            {node.children.map((child, index) => 
              renderNode(child, level + 1, `${nodePath}-${index}`)
            )}
          </div>
        )}
      </div>
    );
  };

  const totalPages = () => {
    let count = 0;
    
    const countNodes = (nodes: SiteNode[]) => {
      count += nodes.length;
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          countNodes(node.children);
        }
      });
    };
    
    countNodes(structure.children);
    return count;
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5 text-indigo-600" />
          {structure.name}
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={expandAll}
            className="text-xs"
          >
            Tout déplier
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={collapseAll}
            className="text-xs"
          >
            Tout replier
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="bg-indigo-50 px-3 py-1.5 rounded-full text-indigo-700 font-medium">
          {totalPages()} pages
        </div>
        <div className="bg-blue-50 px-3 py-1.5 rounded-full text-blue-700 font-medium">
          {structure.children.length} section(s) principale(s)
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="overflow-x-auto">
        <div className="min-w-[600px] space-y-1">
          {structure.children.map((node, index) => 
            renderNode(node, 0, `root-${index}`)
          )}
        </div>
      </div>
    </Card>
  );
};

export default SiteStructureVisualizer;
