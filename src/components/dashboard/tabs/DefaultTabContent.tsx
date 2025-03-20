
import React, { useRef, useEffect } from 'react';

interface DefaultTabContentProps {
  id: string;
  label: string;
}

const DefaultTabContent: React.FC<DefaultTabContentProps> = ({ id, label }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // This effect ensures the content has the right visibility status
  useEffect(() => {
    if (contentRef.current) {
      // Initially hide all tab content
      contentRef.current.style.display = 'none';
      
      // Check if this tab should be visible (depends on if it's the active tab)
      const isActiveTab = window.location.hash === `#${id}` || 
                          document.querySelector(`[data-value="${id}"][data-state="active"]`);
      
      if (isActiveTab) {
        contentRef.current.style.display = 'block';
        console.log(`DefaultTabContent ${id} is active and visible`);
      }
    }
    
    return () => {
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
