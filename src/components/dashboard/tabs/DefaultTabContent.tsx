
import React, { useRef, useEffect } from 'react';

interface DefaultTabContentProps {
  id: string;
  label: string;
}

const DefaultTabContent: React.FC<DefaultTabContentProps> = ({ id, label }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentRef.current) {
      // Set initial visibility - hidden by default
      contentRef.current.style.display = 'none';
      
      // Check if this tab should be visible
      const isActiveTab = window.location.hash === `#${id}` || 
                          document.querySelector(`[data-value="${id}"][data-state="active"]`);
      
      if (isActiveTab) {
        contentRef.current.style.display = 'block';
        console.log(`DefaultTabContent ${id} is initially active`);
      }
      
      // Create an observer to watch for tab state changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
            const tab = document.querySelector(`[data-value="${id}"]`);
            if (tab && tab.getAttribute('data-state') === 'active' && contentRef.current) {
              contentRef.current.style.display = 'block';
              console.log(`DefaultTabContent ${id} made visible by observer`);
            } else if (tab && tab.getAttribute('data-state') !== 'active' && contentRef.current) {
              contentRef.current.style.display = 'none';
            }
          }
        });
      });
      
      // Start observing the tab element
      const tabElement = document.querySelector(`[data-value="${id}"]`);
      if (tabElement) {
        observer.observe(tabElement, { attributes: true });
      }
      
      // Now also observe DOM changes for when the tab is clicked directly
      document.addEventListener('click', function(event) {
        const clickedElement = event.target as HTMLElement;
        const closestTab = clickedElement.closest(`[data-value="${id}"]`);
        
        if (closestTab) {
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.style.display = 'block';
              console.log(`DefaultTabContent ${id} made visible by direct click`);
            }
          }, 50);
        }
      });
      
      return () => {
        // Clean up observer and event listener
        observer.disconnect();
        console.log(`DefaultTabContent ${id} unmounted`);
      };
    }
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
