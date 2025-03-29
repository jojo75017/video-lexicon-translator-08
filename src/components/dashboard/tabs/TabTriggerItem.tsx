
import React from 'react';
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TabTriggerItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  isNew?: boolean;
  link?: string;
  highlighted?: boolean;
  onClick?: () => void;
}

const TabTriggerItem: React.FC<TabTriggerItemProps> = ({ 
  id, 
  icon, 
  label, 
  color, 
  isNew, 
  link, 
  highlighted,
  onClick
}) => {
  // Contenu pour badge et icône partagé entre les versions de lien et d'onglet
  const TabContent = () => (
    <div 
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md relative group transition-all duration-200 hover:bg-white ${
        id === 'quora' ? 'bg-[#b92b27]/10' : 
        id === 'signature' ? 'bg-blue-100' :
        id === 'local-business' ? 'bg-indigo-100' :
        highlighted ? 'bg-purple-100' : ''
      }`}
    >
      <span className="absolute -top-1 -right-1 transform translate-x-1/2 -translate-y-1/2 z-10">
        {isNew && (
          <Badge variant="default" className="text-[10px] py-0 px-1.5 h-auto bg-[#b92b27] text-white">
            Nouveau
          </Badge>
        )}
      </span>
      {icon}
      <span className="font-medium text-sm">{label}</span>
      
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md transition-opacity"></span>
    </div>
  );

  // Obtenir le chemin correct pour la navigation
  const getPath = () => {
    if (link) return link;
    
    const routeMap: Record<string, string> = {
      'hierarchy': '/hierarchy',
      'wordcount': '/wordcount',
      'suggestions': '/suggestions',
      'seo': '/seo',
      'structure': '/structure',
      'backlinks': '/backlinks',
      'performance': '/performance',
      'metrics': '/metrics',
      'analytics': '/analytics',
      'signature': '/signature',
      'quora': '/quora',
      'local-business': '/local-business'
    };
    
    return routeMap[id] || '/';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            to={getPath()} 
            className="inline-block" 
            data-value={id}
            data-tab-id={id}
            onClick={onClick}
          >
            <TabContent />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Accéder à {label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TabTriggerItem;
