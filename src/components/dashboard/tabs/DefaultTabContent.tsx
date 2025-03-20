
import React, { useRef } from 'react';

interface DefaultTabContentProps {
  id: string;
  label: string;
}

const DefaultTabContent: React.FC<DefaultTabContentProps> = ({ id, label }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md" 
      id={id} 
      data-section={id}
      data-tab-content={id}
      ref={contentRef}
      style={{ display: 'none' }} // Initially hidden
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
