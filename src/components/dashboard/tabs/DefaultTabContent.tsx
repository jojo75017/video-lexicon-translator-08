
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
      // Make sure visibility is properly set initially
      // Check if this tab should be visible (depends on if it's the active tab)
      const isActiveTab = window.location.hash === `#${id}` || 
                          document.querySelector(`[data-value="${id}"][data-state="active"]`);
      
      contentRef.current.style.display = isActiveTab ? 'block' : 'none';
      console.log(`DefaultTabContent ${id} mounted with display: ${contentRef.current.style.display}`);
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
