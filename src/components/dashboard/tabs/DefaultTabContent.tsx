
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
                      document.querySelector(`[data-value="${id}"][data-state="active"]`);
    
    contentRef.current.style.display = isActiveTab ? 'block' : 'none';
    console.log(`DefaultTabContent ${id} initialized with display: ${contentRef.current.style.display}`);
    
    // Create a mutation observer to watch for tab state changes on all tabs
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
          const target = mutation.target as HTMLElement;
          const isThisTab = target.getAttribute('data-value') === id;
          const isActive = target.getAttribute('data-state') === 'active';
          
          if (isThisTab && isActive && contentRef.current) {
            contentRef.current.style.display = 'block';
            console.log(`DefaultTabContent ${id} made visible by observer`);
          } else if (isThisTab && !isActive && contentRef.current) {
            contentRef.current.style.display = 'none';
          }
        }
      });
    });
    
    // Watch for direct clicks on tabs
    const handleTabClick = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const thisTab = clickedElement.closest(`[data-value="${id}"]`);
      
      if (thisTab && contentRef.current) {
        // Short delay to allow the tab state to update
        setTimeout(() => {
          contentRef.current.style.display = 'block';
          console.log(`DefaultTabContent ${id} made visible by click handler`);
        }, 50);
      }
    };
    
    document.addEventListener('click', handleTabClick);
    
    // Start observing all tab triggers
    const allTabTriggers = document.querySelectorAll('[data-value]');
    allTabTriggers.forEach(trigger => {
      observer.observe(trigger, { attributes: true });
    });
    
    // Watch for hash changes
    const handleHashChange = () => {
      if (window.location.hash === `#${id}` && contentRef.current) {
        contentRef.current.style.display = 'block';
        console.log(`DefaultTabContent ${id} made visible by hash change`);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleTabClick);
      window.removeEventListener('hashchange', handleHashChange);
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
