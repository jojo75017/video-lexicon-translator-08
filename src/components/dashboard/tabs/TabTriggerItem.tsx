
import React from 'react';
import { Link } from "react-router-dom";
import { TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { activateSection } from '@/utils/navigationHelpers';

interface TabTriggerItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  isNew?: boolean;
  link?: string;
  highlighted?: boolean;
}

const TabTriggerItem: React.FC<TabTriggerItemProps> = ({ 
  id, 
  icon, 
  label, 
  color, 
  isNew, 
  link, 
  highlighted 
}) => {
  const handleTabClick = (e: React.MouseEvent) => {
    // Prevent default only if it's not a link
    if (!link) {
      e.preventDefault();
    }
    
    console.log(`Tab clicked: ${id}`);
    
    // Set URL hash for better navigation
    if (!link) {
      window.location.hash = id;
      
      // Use our activation function directly
      activateSection(id);
    }
  };

  // Content for badge and icon that's shared between link and tab versions
  const TabContent = () => (
    <div 
      className={`flex items-center gap-1 px-3 py-1.5 rounded-md relative group transition-all duration-200 hover:bg-white ${
        id === 'quora' ? 'bg-[#b92b27]/10' : 
        id === 'signature' ? 'bg-blue-100' :
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {link ? (
            <Link to={link} className="inline-block" onClick={handleTabClick}>
              <TabContent />
            </Link>
          ) : (
            <TabsTrigger 
              value={id}
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              data-value={id}
              data-tab-id={id}
              onClick={handleTabClick}
            >
              <TabContent />
            </TabsTrigger>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Accéder à {label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TabTriggerItem;
