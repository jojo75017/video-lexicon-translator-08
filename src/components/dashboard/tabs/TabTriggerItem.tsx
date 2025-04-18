
import React from 'react';
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
  // Handle click with combined navigation and callback
  const handleClick = (e: React.MouseEvent) => {
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`TabTriggerItem: Clic sur ${id}`);
    
    // Call the onClick handler if provided
    if (onClick) {
      onClick();
    }
    
    // Si c'est un lien externe, ouvrir dans un nouvel onglet
    if (link && (link.startsWith('http://') || link.startsWith('https://'))) {
      window.open(link, '_blank');
      return;
    }
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
