
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileSignature } from 'lucide-react';

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
  const navigate = useNavigate();
  
  // Helper function to determine the path for a tab
  const getPath = () => {
    if (link) return link;
    
    const routeMap: Record<string, string> = {
      'hierarchy': '/',  // Changé de '/hierarchy' à '/' pour utiliser la racine
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
      'local-business': '/local-business',
      'translation': '/translation',
      'pinterest': '/pinterest'
    };
    
    return routeMap[id] || '/';
  };

  // Handle click with combined navigation and callback
  const handleClick = (e: React.MouseEvent) => {
    // Prevent default Link behavior so we can handle navigation ourselves
    e.preventDefault();
    
    // Call the onClick handler if provided
    if (onClick) {
      onClick();
    }
    
    // Navigate to the appropriate path
    const path = getPath();
    console.log(`Navigation vers: ${path}`);
    navigate(path);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className="inline-block" 
            data-value={id}
            data-tab-id={id}
            onClick={handleClick}
            aria-label={`Accéder à ${label}`}
          >
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
              <span className="text-gray-700">{icon}</span>
              <span className="font-medium text-sm">{label}</span>
              
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md transition-opacity"></span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Accéder à {label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TabTriggerItem;
