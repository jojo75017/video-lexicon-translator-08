
import React from 'react';
import SeoStructure from '@/components/seo/SeoStructure';
import HierarchySection from '@/components/seo/HierarchySection';

const HierarchyTabContent: React.FC = () => {
  // Sample data for hierarchy visualization
  const sampleHeadings = [
    { level: 1, text: "Site Web Principal" },
    { level: 2, text: "À propos de nous" },
    { level: 3, text: "Notre histoire" },
    { level: 3, text: "Notre équipe" },
    { level: 2, text: "Services" },
    { level: 3, text: "Consultation SEO" },
    { level: 3, text: "Optimisation de contenu" },
    { level: 3, text: "Analyse technique" },
    { level: 2, text: "Blog" },
    { level: 3, text: "Articles récents" },
    { level: 3, text: "Catégories" }
  ];

  // Sample data for SEO analysis
  const seoAnalysisData = {
    h1Count: 1,
    h2Count: 4,
    h3Count: 8,
    wordCount: 1250,
    readabilityScore: 72,
    hierarchy: [
      {
        text: "Optimisation SEO pour les entreprises locales",
        tagName: 'h1',
        position: 0,
        children: [
          {
            text: "Stratégies efficaces pour le référencement local",
            tagName: 'h2',
            position: 1,
            children: [
              {
                text: "Optimisation de Google My Business",
                tagName: 'h3',
                position: 2,
                children: [
                  {
                    text: "Pour les entreprises locales, Google My Business est un outil essentiel pour améliorer la visibilité dans les recherches locales et sur Google Maps.",
                    tagName: 'p',
                    position: 3,
                    children: []
                  }
                ]
              },
              {
                text: "Création de contenu local pertinent",
                tagName: 'h3',
                position: 4,
                children: [
                  {
                    text: "Le contenu localisé aide à cibler les clients dans votre zone géographique et à répondre à leurs besoins spécifiques.",
                    tagName: 'p',
                    position: 5,
                    children: []
                  }
                ]
              }
            ]
          },
          {
            text: "Techniques d'optimisation on-page",
            tagName: 'h2',
            position: 6,
            children: [
              {
                text: "Structure des balises de titre",
                tagName: 'h3',
                position: 7,
                children: [
                  {
                    text: "Une hiérarchie claire des titres améliore la lisibilité et aide les moteurs de recherche à comprendre la structure de votre contenu.",
                    tagName: 'p',
                    position: 8,
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    headings: [
      { text: "Optimisation SEO pour les entreprises locales", level: 1, position: 0 },
      { text: "Stratégies efficaces pour le référencement local", level: 2, position: 1 },
      { text: "Optimisation de Google My Business", level: 3, position: 2 },
      { text: "Création de contenu local pertinent", level: 3, position: 4 },
      { text: "Techniques d'optimisation on-page", level: 2, position: 6 },
      { text: "Structure des balises de titre", level: 3, position: 7 }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md" id="hierarchy" data-section="hierarchy" data-tab-content="hierarchy">
      <h2 className="text-xl font-bold mb-4">Hiérarchie du Contenu</h2>
      <p className="text-gray-600 mb-6">Analysez l'organisation et la structure de votre contenu pour optimiser l'expérience utilisateur et le référencement.</p>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Section hiérarchie générale */}
        <HierarchySection 
          isLoading={false} 
          seoAnalysis={seoAnalysisData} 
          onAnalyze={() => console.log("Analyse demandée")}
        />
        
        {/* Visualisation de la structure des titres */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Structure SEO détaillée</h3>
          <SeoStructure 
            h1Count={seoAnalysisData.h1Count}
            h2Count={seoAnalysisData.h2Count}
            h3Count={seoAnalysisData.h3Count}
            imgCount={12}
            headings={seoAnalysisData.headings}
            showHeadingsList={true}
            hierarchy={seoAnalysisData.hierarchy}
          />
        </div>
        
        {/* Hierarchy visualization with sample data */}
        <div className="mt-4 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium mb-4 text-blue-800">Structure des pages</h3>
          <div className="pl-4 border-l-2 border-blue-300 space-y-2">
            {sampleHeadings.map((heading, index) => (
              <div 
                key={index} 
                className={`py-1.5 px-3 rounded-md ${
                  heading.level === 1 ? 'bg-blue-100 font-bold ml-0' : 
                  heading.level === 2 ? 'bg-blue-50 font-semibold ml-6' : 
                  heading.level === 3 ? 'bg-white ml-12' : 
                  'bg-gray-50 ml-16'
                }`}
                style={{
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                }}
              >
                {heading.text}
              </div>
            ))}
          </div>
        </div>
        
        {/* Recommandations pour la hiérarchie */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Recommandations pour la hiérarchie</h3>
          <div className="space-y-4">
            <div className="flex items-start p-3 bg-green-50 rounded-md">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-green-800">Bonne utilisation du H1</h4>
                <p className="text-sm text-green-700">Votre page contient une seule balise H1, ce qui est optimal pour le SEO.</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-green-50 rounded-md">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-green-800">Structure logique des sous-titres</h4>
                <p className="text-sm text-green-700">La hiérarchie H2-H3 est bien structurée et suit une progression logique.</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-amber-50 rounded-md">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-amber-800">Opportunité d'amélioration</h4>
                <p className="text-sm text-amber-700">Certaines sections pourraient bénéficier de sous-titres H4 pour une meilleure organisation du contenu détaillé.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchyTabContent;
