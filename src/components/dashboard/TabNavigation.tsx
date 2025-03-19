import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Search, Globe, Database, Link2, ChartBar, Settings, Hash, Pen, 
  FileText, Book, BarChart2, ExternalLink, Rocket, Zap, 
  Layers, Lightbulb, FileCode, Bell, UserPlus, MessageSquareText,
  Gauge, BarChart, Newspaper, Award, Target, Boxes, BrainCircuit, Signature, FileCheck
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import HierarchySection from '@/components/seo/HierarchySection';
import ContentHierarchy from '@/components/ContentHierarchy';

const TabNavigation = () => {
  const tabs = [
    // Analyses principales
    { id: 'seo', icon: Search, label: 'SEO', color: 'text-blue-600', group: 'main' },
    { id: 'structure', icon: Globe, label: 'Structure', color: 'text-indigo-600', group: 'main' },
    { id: 'hierarchy', icon: Database, label: 'Hiérarchie', color: 'text-violet-600', group: 'main' },
    { id: 'backlinks', icon: Link2, label: 'Backlinks', color: 'text-pink-600', group: 'main' },
    
    // Métriques et données
    { id: 'metrics', icon: ChartBar, label: 'Métriques', color: 'text-fuchsia-600', group: 'metrics' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics', color: 'text-green-600', group: 'metrics', isNew: true },
    { id: 'keywords', icon: FileText, label: 'Mots-clés', color: 'text-amber-600', group: 'metrics' },
    { id: 'performance', icon: Gauge, label: 'Performance', color: 'text-indigo-500', group: 'metrics' },
    
    // Contenu
    { id: 'content', icon: Book, label: 'Contenu', color: 'text-orange-600', group: 'content' },
    { id: 'optimize', icon: Zap, label: 'Optimisation', color: 'text-blue-600', group: 'content', isNew: true },
    { id: 'ideas', icon: Lightbulb, label: 'Idées', color: 'text-yellow-600', group: 'content' },
    { id: 'quora', icon: MessageSquareText, label: 'Quora', color: 'text-[#b92b27]', group: 'content', isNew: true, link: '/QuoraPage' },
    { id: 'airesearch', icon: BrainCircuit, label: 'Recherche IA', color: 'text-purple-700', group: 'content', isNew: true, highlighted: true },
    
    // New Tab for Word Count Analysis
    { id: 'wordcount', icon: FileCheck, label: '500 Mots', color: 'text-green-700', group: 'content', isNew: true, highlighted: true },
    
    // Technique
    { id: 'advanced', icon: Settings, label: 'Avancé', color: 'text-rose-600', group: 'tech' },
    { id: 'code', icon: FileCode, label: 'Code', color: 'text-slate-600', group: 'tech' },
    { id: 'integrations', icon: Hash, label: 'Intégrations', color: 'text-purple-600', group: 'tech' },
    
    // Marketing
    { id: 'alerts', icon: Bell, label: 'Alertes', color: 'text-red-600', group: 'marketing' },
    { id: 'social', icon: UserPlus, label: 'Social', color: 'text-blue-500', group: 'marketing' },
    { id: 'reports', icon: BarChart, label: 'Rapports', color: 'text-emerald-600', group: 'marketing' },
    { id: 'trends', icon: Target, label: 'Tendances', color: 'text-cyan-600', group: 'marketing' },
    
    // Autres outils
    { id: 'signature', icon: Signature, label: 'Signature', color: 'text-blue-600', group: 'other', link: '/SignaturePage' },
    { id: 'external', icon: ExternalLink, label: 'Externe', color: 'text-teal-600', group: 'other' },
  ];

  const groupedTabs = {
    main: tabs.filter(tab => tab.group === 'main'),
    metrics: tabs.filter(tab => tab.group === 'metrics'),
    content: tabs.filter(tab => tab.group === 'content'),
    tech: tabs.filter(tab => tab.group === 'tech'),
    marketing: tabs.filter(tab => tab.group === 'marketing'),
    other: tabs.filter(tab => tab.group === 'other'),
  };

  const groupLabels = {
    main: "Analyses",
    metrics: "Données",
    content: "Contenu",
    tech: "Technique",
    marketing: "Marketing",
    other: "Outils"
  };
  
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
    <TooltipProvider>
      <Tabs defaultValue="wordcount" className="w-full">
        <div className="w-full flex flex-col overflow-hidden justify-between bg-white shadow-md rounded-lg p-3 mb-6 border border-gray-100">
          <div className="grid grid-cols-6 gap-2 text-xs font-medium text-gray-500 mb-2 px-2">
            {Object.entries(groupLabels).map(([key, label]) => (
              <div key={key} className="flex items-center justify-center">
                {label}
              </div>
            ))}
          </div>
          
          <TabsList className="flex overflow-x-auto justify-between bg-gray-50 rounded-md p-2">
            {Object.entries(groupedTabs).map(([groupName, groupTabs], groupIndex) => (
              <div key={groupName} className="flex-1 flex flex-col items-center min-w-fit">
                <div className="flex flex-wrap gap-1 justify-center">
                  {groupTabs.map(({ id, icon: Icon, label, color, isNew, link, highlighted }) => (
                    <Tooltip key={id}>
                      <TooltipTrigger asChild>
                        {link ? (
                          <Link to={link} className="inline-block">
                            <div 
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-md relative group transition-all duration-200 hover:bg-white cursor-pointer ${
                                id === 'quora' ? 'bg-[#b92b27]/10' : 
                                id === 'signature' ? 'bg-blue-100' :
                                highlighted ? 'bg-purple-100' : ''
                              }`}
                            >
                              <span className="absolute -top-1 -right-1 transform translate-x-1/2 -translate-y-1/2 z-10">
                                {isNew && (
                                  <Badge variant="default" className="text-[10px] py-0 px-1.5 h-auto bg-[#b92b27] text-white animate-pulse">
                                    Nouveau
                                  </Badge>
                                )}
                              </span>
                              <Icon className={`w-4 h-4 ${color}`} />
                              <span className="font-medium text-sm">{label}</span>
                              
                              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md transition-opacity"></span>
                            </div>
                          </Link>
                        ) : (
                          <TabsTrigger 
                            value={id}
                            data-value={id}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md relative group transition-all duration-200 hover:bg-white ${
                              highlighted ? 'bg-purple-100' : ''
                            }`}
                          >
                            <span className="absolute -top-1 -right-1 transform translate-x-1/2 -translate-y-1/2 z-10">
                              {isNew && (
                                <Badge variant="default" className="text-[10px] py-0 px-1.5 h-auto bg-[#b92b27] text-white">
                                  Nouveau
                                </Badge>
                              )}
                            </span>
                            <Icon className={`w-4 h-4 ${color}`} />
                            <span className="font-medium text-sm">{label}</span>
                            
                            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md transition-opacity"></span>
                          </TabsTrigger>
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Accéder à {label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </TabsList>
        </div>
        
        {/* Tab content sections */}
        <TabsContent value="hierarchy" className="mt-2">
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
        </TabsContent>
        
        <TabsContent value="wordcount" className="mt-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Analyse de contenu - 500 mots</h2>
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Objectif 500 mots</h3>
                <p className="text-gray-700 mb-4">
                  L'objectif de cette section est de vous aider à créer un contenu optimal de 500 mots.
                  Les articles de cette longueur sont idéaux pour de nombreux cas d'utilisation, notamment :
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Articles de blog courts</li>
                  <li>Pages de description de produit</li>
                  <li>Résumés et introductions</li>
                  <li>Contenu pour les réseaux sociaux</li>
                  <li>Newsletters et emails</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">Outil de comptage</h3>
                  <textarea 
                    className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Collez votre texte ici pour analyser le nombre de mots..."
                  ></textarea>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Mots: <span className="font-semibold">0</span> / 500
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Analyser
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">Recommandations</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-800">Structure idéale pour 500 mots</h4>
                      <ul className="mt-2 text-sm text-blue-700 space-y-1">
                        <li>• Introduction (50-75 mots)</li>
                        <li>• 3-4 sections principales (300-350 mots)</li>
                        <li>• Conclusion (50-75 mots)</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-amber-50 rounded-md">
                      <h4 className="font-medium text-amber-800">Éléments à inclure</h4>
                      <ul className="mt-2 text-sm text-amber-700 space-y-1">
                        <li>• 1 titre H1 principal</li>
                        <li>• 3-4 sous-titres H2</li>
                        <li>• 1-2 mots-clés principaux (densité 1-2%)</li>
                        <li>• 2-3 mots-clés secondaires</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-md">
                      <h4 className="font-medium text-green-800">Conseils d'optimisation</h4>
                      <ul className="mt-2 text-sm text-green-700 space-y-1">
                        <li>• Phrases de 15-20 mots en moyenne</li>
                        <li>• Paragraphes de 2-3 phrases</li>
                        <li>• Inclure une liste à puces ou numérotée</li>
                        <li>• Utilisez des transitions entre les paragraphes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Exemples de contenu de 500 mots</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-blue-700">Article de blog</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Un article de blog de 500 mots couvre un sujet spécifique avec une introduction claire, 
                      3-4 points clés et une conclusion avec un appel à l'action.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-blue-700">Description de produit</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Une description de produit de 500 mots présente les caractéristiques, avantages, 
                      spécifications et témoignages d'utilisateurs.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-blue-700">Article d'actualité</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Un article d'actualité de 500 mots couvre les points essentiels (qui, quoi, où, quand, pourquoi)
                      avec des citations et un contexte pertinent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="seo" className="mt-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
            <p className="text-gray-600">Contenu de l'analyse SEO</p>
          </div>
        </TabsContent>
        
        <TabsContent value="structure" className="mt-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Structure du Site</h2>
            <p className="text-gray-600">Contenu de l'analyse de structure</p>
          </div>
        </TabsContent>
        
        <TabsContent value="backlinks" className="mt-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Analyse des Backlinks</h2>
            <p className="text-gray-600">Contenu de l'analyse des backlinks</p>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Métriques</h2>
            <p className="text-gray-600">Contenu des métriques</p>
          </div>
        </TabsContent>
        
        {/* Add default content for other tabs */}
        {tabs.filter(tab => !['seo', 'structure', 'hierarchy', 'backlinks', 'metrics', 'wordcount'].includes(tab.id) && !tab.link).map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">{tab.label}</h2>
              <p className="text-gray-600">Contenu de {tab.label} (à venir)</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </TooltipProvider>
  );
};

export default TabNavigation;
