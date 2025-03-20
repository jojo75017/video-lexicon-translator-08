
import React, { useRef, useEffect } from 'react';

interface DefaultTabContentProps {
  id: string;
  label: string;
}

const DefaultTabContent: React.FC<DefaultTabContentProps> = ({ id, label }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!contentRef.current) return;
      
    // Set initial visibility based on hash or active tab state
    const isActiveTab = window.location.hash === `#${id}` || 
                      document.querySelector(`[data-tab-id="${id}"][data-state="active"]`);
    
    contentRef.current.style.display = isActiveTab ? 'block' : 'none';
    console.log(`DefaultTabContent ${id} initialized with display: ${contentRef.current.style.display}`);
    
    // Watch for direct clicks on tabs
    const handleTabClick = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const thisTab = clickedElement.closest(`[data-tab-id="${id}"]`);
      const isActive = thisTab && thisTab.getAttribute('data-state') === 'active';
      
      if (contentRef.current) {
        contentRef.current.style.display = isActive ? 'block' : 'none';
        console.log(`DefaultTabContent ${id} display set to ${contentRef.current.style.display} by click handler`);
      }
    };
    
    document.addEventListener('click', handleTabClick);
    
    // Watch for hash changes
    const handleHashChange = () => {
      if (window.location.hash === `#${id}` && contentRef.current) {
        contentRef.current.style.display = 'block';
        console.log(`DefaultTabContent ${id} made visible by hash change`);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Check visibility on mount as a fallback
    const checkVisibilityInterval = setInterval(() => {
      const activeTab = document.querySelector(`[data-tab-id="${id}"][data-state="active"]`);
      if (activeTab && contentRef.current && contentRef.current.style.display === 'none') {
        contentRef.current.style.display = 'block';
        console.log(`DefaultTabContent ${id} made visible by interval check`);
      }
    }, 500);
    
    return () => {
      document.removeEventListener('click', handleTabClick);
      window.removeEventListener('hashchange', handleHashChange);
      clearInterval(checkVisibilityInterval);
      console.log(`DefaultTabContent ${id} unmounted`);
    };
  }, [id]);
  
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md" 
      id={id} 
      data-section={id}
      data-tab-content={id}
      ref={contentRef}
    >
      <h2 className="text-xl font-bold mb-4">{label}</h2>
      <p className="text-gray-600">Contenu de {label}</p>
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-500">Le contenu détaillé de cette section sera disponible prochainement.</p>
      </div>
    </div>
  );
};

export default DefaultTabContent;
