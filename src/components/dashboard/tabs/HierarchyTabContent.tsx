
import React from 'react';

const HierarchyTabContent: React.FC = () => {
  // Sample data for hierarchy visualization
  const sampleHeadings = [
    { level: "h1", text: "Site Web Principal" },
    { level: "h2", text: "À propos de nous" },
    { level: "h3", text: "Notre histoire" },
    { level: "h3", text: "Notre équipe" },
    { level: "h2", text: "Services" },
    { level: "h3", text: "Consultation SEO" },
    { level: "h3", text: "Optimisation de contenu" },
    { level: "h3", text: "Analyse technique" },
    { level: "h2", text: "Blog" },
    { level: "h3", text: "Articles récents" },
    { level: "h3", text: "Catégories" }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md" id="hierarchy" data-section="hierarchy" data-tab-content="hierarchy">
      <h2 className="text-xl font-bold mb-4">Hiérarchie du Site</h2>
      <p className="text-gray-600 mb-6">Visualisez la structure hiérarchique de votre site web pour améliorer l'organisation du contenu.</p>
      
      {/* Hierarchy visualization */}
      <div className="mt-4 p-6 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium mb-4 text-blue-800">Structure des pages</h3>
        <div className="pl-4 border-l-2 border-blue-300 space-y-2">
          {sampleHeadings.map((heading, index) => (
            <div 
              key={index} 
              className={`py-1.5 px-3 rounded-md ${
                heading.level === "h1" ? 'bg-blue-100 font-bold ml-0' : 
                heading.level === "h2" ? 'bg-blue-50 font-semibold ml-6' : 
                heading.level === "h3" ? 'bg-white ml-12' : 
                'bg-gray-50 ml-16'
              }`}
              style={{
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
              }}
            >
              {`${heading.text}`}
            </div>
          ))}
        </div>
      </div>
      
      {/* Site Structure Analysis */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="font-medium mb-3 text-gray-800">Analyse de la structure</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-gray-700">Structure bien organisée</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-gray-700">Utilisation correcte des balises H1-H3</span>
            </li>
            <li className="flex items-start">
              <span className="bg-yellow-100 text-yellow-800 rounded-full p-1 mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                </svg>
              </span>
              <span className="text-gray-700">Profondeur de navigation excessive (>3 niveaux)</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="font-medium mb-3 text-gray-800">Recommandations</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              <span className="text-gray-700">Réduire la profondeur de navigation à 3 niveaux maximum</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              <span className="text-gray-700">Ajouter du fil d'Ariane pour améliorer la navigation</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              <span className="text-gray-700">Créer un plan du site XML pour l'indexation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HierarchyTabContent;
