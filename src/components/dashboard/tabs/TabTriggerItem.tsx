
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
      'local-business': '/local-business',
      'translation': '/translation',
      'pinterest': '/pinterest'
    };
    
    return routeMap[id] || '/';
  };

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
    
    // Navigate to the appropriate path for internal links
    const path = getPath();
    console.log(`TabTriggerItem: Navigation vers: ${path}`);
    navigate(path);
    
    // Forcer l'affichage de la section appropriée avec un délai
    setTimeout(() => {
      console.log(`TabTriggerItem: Activation forcée de la section ${id}`);
      
      // Essayer de trouver la section avec plusieurs méthodes
      const sectionByDataAttr = document.querySelector(`[data-section="${id}"]`);
      const sectionById = document.getElementById(id);
      const sectionByTabContent = document.querySelector(`[data-tab-content="${id}"]`);
      
      // Masquer d'abord toutes les sections
      document.querySelectorAll('[data-section], [data-tab-content]').forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Afficher la section trouvée
      if (sectionByDataAttr) {
        console.log(`TabTriggerItem: Affichage forcé de la section par data-section: ${id}`);
        (sectionByDataAttr as HTMLElement).style.display = 'block';
      } else if (sectionById) {
        console.log(`TabTriggerItem: Affichage forcé de la section par id: ${id}`);
        sectionById.style.display = 'block';
      } else if (sectionByTabContent) {
        console.log(`TabTriggerItem: Affichage forcé de la section par data-tab-content: ${id}`);
        (sectionByTabContent as HTMLElement).style.display = 'block';
      } else {
        console.log(`TabTriggerItem: Section non trouvée: ${id}`);
      }
    }, 500);
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
