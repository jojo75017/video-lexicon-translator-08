
import React from 'react';
import HierarchySection from '@/components/seo/HierarchySection';
import ContentHierarchy from '@/components/ContentHierarchy';

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
    { text: "Le SEO est essentiel pour améliorer la visibilité de votre site web...", position: 1.5 },
    { text: "Les mots-clés sont la base de toute stratégie SEO efficace...", position: 2.5 },
    { text: "L'optimisation on-page comprend tous les éléments que vous pouvez contrôler directement...", position: 3.5 },
    { text: "Les meta descriptions doivent être concises et inclure vos mots-clés principaux...", position: 4.5 },
    { text: "Une structure d'URL claire et descriptive aide les moteurs de recherche...", position: 5.5 },
    { text: "Les backlinks de qualité restent un facteur déterminant pour le classement...", position: 6.5 },
  ];
  
  const recommendations = [
    "Assurez-vous d'avoir un seul titre H1 par page pour une meilleure structure",
    "Utilisez des H2 et H3 de manière hiérarchique pour organiser votre contenu",
    "Incluez des mots-clés importants dans vos titres et sous-titres",
    "Gardez une structure cohérente sur l'ensemble de votre site"
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      <HierarchySection isLoading={false} seoAnalysis={{
        h1Count: 1,
        h2Count: 3,
        h3Count: 2,
        wordCount: 450,
        readabilityScore: 75
      }} />
      <ContentHierarchy 
        headings={sampleHeadings}
        paragraphs={sampleParagraphs}
        recommendations={recommendations}
      />
    </div>
  );
};

export default HierarchyTabContent;
