
import React from 'react';
import HierarchySection from '@/components/seo/HierarchySection';
import ContentHierarchy from '@/components/ContentHierarchy';
import { Card } from '@/components/ui/card';

const HierarchyTabContent: React.FC = () => {
  // Sample data for hierarchy demonstration
  const sampleHeadings = [
    { text: "Introduction au SEO", level: 1, position: 1 },
    { text: "Importance des mots-clés", level: 2, position: 2 },
    { text: "Optimisation on-page", level: 2, position: 3 },
    { text: "Meta descriptions", level: 3, position: 4 },
    { text: "Structure des URLs", level: 3, position: 5 },
    { text: "Stratégies de backlinks", level: 2, position: 6 },
  ];
  
  const sampleParagraphs = [
    { text: "Le SEO est essentiel pour améliorer la visibilité de votre site web dans les résultats de recherche. Une bonne stratégie SEO permet d'attirer un trafic qualifié et d'augmenter votre notoriété en ligne.", position: 1.5 },
    { text: "Les mots-clés sont la base de toute stratégie SEO efficace. Ils doivent être choisis en fonction de votre secteur d'activité, de votre public cible et de vos objectifs commerciaux.", position: 2.5 },
    { text: "L'optimisation on-page comprend tous les éléments que vous pouvez contrôler directement sur votre site web, comme le contenu, les balises HTML et la structure de l'information.", position: 3.5 },
    { text: "Les meta descriptions doivent être concises et inclure vos mots-clés principaux. Elles apparaissent dans les résultats de recherche et influencent le taux de clics sur votre site.", position: 4.5 },
    { text: "Une structure d'URL claire et descriptive aide les moteurs de recherche à comprendre le contenu de vos pages et améliore l'expérience utilisateur.", position: 5.5 },
    { text: "Les backlinks de qualité restent un facteur déterminant pour le classement dans les moteurs de recherche. Privilégiez la qualité à la quantité pour une stratégie durable.", position: 6.5 },
  ];
  
  const recommendations = [
    "Assurez-vous d'avoir un seul titre H1 par page pour une meilleure structure",
    "Utilisez des H2 et H3 de manière hiérarchique pour organiser votre contenu",
    "Incluez des mots-clés importants dans vos titres et sous-titres",
    "Gardez une structure cohérente sur l'ensemble de votre site"
  ];

  return (
    <div 
      className="grid grid-cols-1 gap-6" 
      id="hierarchy" 
      data-section="hierarchy" 
      data-tab-content="hierarchy"
    >
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="w-1 h-6 bg-purple-600 rounded-full mr-3"></span>
          Analyse de la hiérarchie de contenu
        </h2>
        <p className="text-gray-600 mb-6">
          La hiérarchie de votre contenu est essentielle pour le référencement de votre site. Une structure bien organisée aide les moteurs de recherche à comprendre votre contenu et améliore l'expérience utilisateur.
        </p>
        
        <HierarchySection isLoading={false} seoAnalysis={{
          h1Count: 1,
          h2Count: 3,
          h3Count: 2,
          wordCount: 450,
          readabilityScore: 75
        }} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></span>
          Structure détaillée
        </h2>
        <ContentHierarchy 
          headings={sampleHeadings}
          paragraphs={sampleParagraphs}
          recommendations={recommendations}
        />
      </div>
    </div>
  );
};

export default HierarchyTabContent;
