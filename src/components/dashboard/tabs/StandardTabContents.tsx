
import React from 'react';
import BacklinkSection from '@/components/seo/BacklinkSection';
import AdvancedSection from '@/components/seo/AdvancedSection';
import IntegrationsSection from '@/components/seo/IntegrationsSection';
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import StructureSection from '@/components/seo/StructureSection';
import HierarchySection from '@/components/seo/HierarchySection';
import SeoStructure from '@/components/seo/SeoStructure';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';

export const SeoTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="seo" data-section="seo" data-tab-content="seo">
    <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
    <p className="text-gray-600">Contenu de l'analyse SEO</p>
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-500">Cette section vous permet d'analyser les performances SEO de votre site.</p>
    </div>
  </div>
);

export const StructureTabContent: React.FC = () => {
  // Sample structure data
  const sampleStructure = {
    name: "Mon Site Web",
    children: [
      {
        name: "Page d'accueil",
        path: "/",
        children: [
          {
            name: "À propos",
            path: "/about",
            children: [
              { name: "Notre équipe", path: "/about/team", children: [] },
              { name: "Notre histoire", path: "/about/history", children: [] }
            ]
          },
          {
            name: "Services",
            path: "/services",
            children: [
              { name: "Consultation SEO", path: "/services/seo", children: [] },
              { name: "Développement web", path: "/services/web-dev", children: [] },
              { name: "Marketing digital", path: "/services/digital-marketing", children: [] }
            ]
          },
          {
            name: "Blog",
            path: "/blog",
            children: [
              { name: "Articles SEO", path: "/blog/seo", children: [] },
              { name: "Actualités", path: "/blog/news", children: [] },
              { name: "Tutoriels", path: "/blog/tutorials", children: [] }
            ]
          },
          {
            name: "Contact",
            path: "/contact",
            children: []
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md" id="structure" data-section="structure" data-tab-content="structure">
      <h2 className="text-xl font-bold mb-4">Structure du Site</h2>
      <p className="text-gray-600 mb-6">Examinez l'architecture et l'organisation des pages de votre site web pour optimiser la navigation et le référencement.</p>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Section structure principale */}
        <StructureSection isLoading={false} siteStructure={sampleStructure} />
        
        {/* Visualisateur de structure de site */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Visualisation de la structure</h3>
          <SiteStructureVisualizer structure={sampleStructure} />
        </div>
        
        {/* Analyse technique */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Analyse technique</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Profondeur du site</h4>
              <p className="text-sm text-gray-600">Profondeur maximale: <span className="font-semibold">3 niveaux</span></p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Recommandé: maximum 3-4 niveaux</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Breadcrumbs (fil d'Ariane)</h4>
              <p className="text-sm text-gray-600">Statut: <span className="font-semibold text-green-600">Détecté</span></p>
              <p className="text-xs text-gray-500 mt-1">Facilite la navigation et améliore le SEO</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Plan du site XML</h4>
              <p className="text-sm text-gray-600">Statut: <span className="font-semibold text-amber-600">Non détecté</span></p>
              <p className="text-xs text-gray-500 mt-1">Important pour l'indexation par les moteurs de recherche</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Structure des URLs</h4>
              <p className="text-sm text-gray-600">Qualité: <span className="font-semibold text-green-600">Bonne</span></p>
              <p className="text-xs text-gray-500 mt-1">URLs lisibles et descriptives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HierarchyTabContent: React.FC = () => {
  // Données d'exemple pour l'analyse de la hiérarchie
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
              },
              {
                text: "Optimisation des métadonnées",
                tagName: 'h3',
                position: 9,
                children: [
                  {
                    text: "Les balises meta title et description bien rédigées augmentent les taux de clics dans les résultats de recherche.",
                    tagName: 'p',
                    position: 10,
                    children: []
                  }
                ]
              }
            ]
          },
          {
            text: "Analyse de la concurrence locale",
            tagName: 'h2',
            position: 11,
            children: [
              {
                text: "Étude des mots-clés concurrentiels",
                tagName: 'h3',
                position: 12,
                children: [
                  {
                    text: "Identifier les mots-clés utilisés par vos concurrents permet de développer une stratégie plus efficace.",
                    tagName: 'p',
                    position: 13,
                    children: []
                  }
                ]
              }
            ]
          },
          {
            text: "Mesure des performances",
            tagName: 'h2',
            position: 14,
            children: [
              {
                text: "Outils d'analyse pour le SEO local",
                tagName: 'h3',
                position: 15,
                children: [
                  {
                    text: "Utilisez des outils comme Google Analytics et Search Console pour suivre les performances de votre stratégie SEO locale.",
                    tagName: 'p',
                    position: 16,
                    children: []
                  }
                ]
              },
              {
                text: "Suivi du classement local",
                tagName: 'h3',
                position: 17,
                children: [
                  {
                    text: "Surveillez votre position dans les résultats de recherche locaux pour mesurer l'efficacité de vos efforts.",
                    tagName: 'p',
                    position: 18,
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
      { text: "Structure des balises de titre", level: 3, position: 7 },
      { text: "Optimisation des métadonnées", level: 3, position: 9 },
      { text: "Analyse de la concurrence locale", level: 2, position: 11 },
      { text: "Étude des mots-clés concurrentiels", level: 3, position: 12 },
      { text: "Mesure des performances", level: 2, position: 14 },
      { text: "Outils d'analyse pour le SEO local", level: 3, position: 15 },
      { text: "Suivi du classement local", level: 3, position: 17 }
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

export const BacklinksTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="backlinks" data-section="backlinks" data-tab-content="backlinks">
    <h2 className="text-xl font-bold mb-4">Analyse des Backlinks</h2>
    <p className="text-gray-600">Examinez les liens entrants vers votre site</p>
    <div className="mt-4">
      <BacklinkSection isLoading={false} seoAnalysis={null} />
    </div>
  </div>
);

export const MetricsTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="metrics" data-section="metrics" data-tab-content="metrics">
    <h2 className="text-xl font-bold mb-4">Métriques</h2>
    <p className="text-gray-600">Statistiques détaillées de performance</p>
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-700 mb-2">Visiteurs</h3>
          <p className="text-3xl font-bold text-blue-600">1,245</p>
          <p className="text-sm text-gray-500 mt-1">+12% depuis le mois dernier</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-700 mb-2">Pages vues</h3>
          <p className="text-3xl font-bold text-green-600">3,872</p>
          <p className="text-sm text-gray-500 mt-1">+8% depuis le mois dernier</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-700 mb-2">Taux de rebond</h3>
          <p className="text-3xl font-bold text-orange-600">42%</p>
          <p className="text-sm text-gray-500 mt-1">-3% depuis le mois dernier</p>
        </div>
      </div>
    </div>
  </div>
);

export const AdvancedTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="advanced" data-section="advanced" data-tab-content="advanced">
    <h2 className="text-xl font-bold mb-4">Options avancées</h2>
    <p className="text-gray-600">Accédez aux fonctionnalités avancées pour optimiser votre site</p>
    <div className="mt-4">
      <AdvancedSection isLoading={false} seoAnalysis={null} />
    </div>
  </div>
);

export const IntegrationsTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md" id="integrations" data-section="integrations" data-tab-content="integrations">
    <h2 className="text-xl font-bold mb-4">Intégrations</h2>
    <p className="text-gray-600">Connectez vos outils préférés pour une analyse complète</p>
    <div className="mt-4">
      <IntegrationsSection />
    </div>
  </div>
);
