
import React from 'react';

interface DefaultTabContentProps {
  id: string;
  label: string;
}

const DefaultTabContent: React.FC<DefaultTabContentProps> = ({ id, label }) => {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md" 
      id={id} 
      data-section={id}
      data-tab-content={id}
    >
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></span>
        {label}
      </h2>
      <p className="text-gray-600">Contenu détaillé pour {label}</p>
      
      <div className="mt-6 p-5 bg-gray-50 rounded-md border border-gray-100">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Informations importantes</h3>
        <p className="text-gray-600 mb-4">
          Cette section vous permet d'analyser et d'optimiser les aspects liés à {label.toLowerCase()} de votre site web.
        </p>
        <div className="flex items-center bg-blue-50 p-3 rounded-md border border-blue-100">
          <div className="text-blue-700 text-sm">
            <span className="font-medium">Conseil Pro:</span> Consultez régulièrement cette section pour suivre l'évolution de vos performances.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultTabContent;
