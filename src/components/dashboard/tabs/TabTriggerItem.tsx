
import React from 'react';
import { Link } from "react-router-dom";
import { LucideIcon } from 'lucide-react';
import { TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { showSection } from '@/utils/navigationHelpers';

interface TabTriggerItemProps {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
  isNew?: boolean;
  link?: string;
  highlighted?: boolean;
}

const TabTriggerItem: React.FC<TabTriggerItemProps> = ({ 
  id, 
  icon: Icon, 
  label, 
  color, 
  isNew, 
  link, 
  highlighted 
}) => {
  const handleTabClick = () => {
    console.log(`Tab clicked: ${id}`);
    
    // Give the DOM time to update after the click and then show the section
    setTimeout(() => {
      // Hide all sections first
      const allSections = document.querySelectorAll('[data-section], [data-tab-content]');
      allSections.forEach((section) => {
        (section as HTMLElement).style.display = 'none';
      });
      
      // Show the clicked section
      const sectionToShow = document.getElementById(id) || 
                            document.querySelector(`[data-section="${id}"]`) ||
                            document.querySelector(`[data-tab-content="${id}"]`);
      
      if (sectionToShow) {
        (sectionToShow as HTMLElement).style.display = 'block';
        console.log(`Section ${id} displayed by direct tab click`);
      } else {
        // If section not found, fall back to the helper
        showSection(id);
      }
    }, 100);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {link ? (
          <Link to={link} className="inline-block">
            <div 
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md relative group transition-all duration-200 hover:bg-white cursor-pointer ${
                id === 'quora' ? 'bg-[#b92b27]/10' : 
                id === 'signature' ? 'bg-blue-100' :
                highlighted ? 'bg-purple-100' : ''
              }`}
            >
              <span className="absolute -top-1 -right-1 transform translate-x-1/2 -translate-y-1/2 z-10">
                {isNew && (
                  <Badge variant="default" className="text-[10px] py-0 px-1.5 h-auto bg-[#b92b27] text-white animate-pulse">
                    Nouveau
                  </Badge>
                )}
              </span>
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="font-medium text-sm">{label}</span>
              
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md transition-opacity"></span>
            </div>
          </Link>
        ) : (
          <TabsTrigger 
            value={id}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md relative group transition-all duration-200 hover:bg-white ${
              highlighted ? 'bg-purple-100' : ''
            }`}
            data-value={id}
            data-tab-id={id}
            onClick={handleTabClick}
          >
            <span className="absolute -top-1 -right-1 transform translate-x-1/2 -translate-y-1/2 z-10">
              {isNew && (
                <Badge variant="default" className="text-[10px] py-0 px-1.5 h-auto bg-[#b92b27] text-white">
                  Nouveau
                </Badge>
              )}
            </span>
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="font-medium text-sm">{label}</span>
            
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md transition-opacity"></span>
          </TabsTrigger>
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">Accéder à {label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TabTriggerItem;
