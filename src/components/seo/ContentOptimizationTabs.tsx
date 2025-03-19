
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  BookOpen,
  FileText,
  Layers,
  Search,
  Wand2
} from 'lucide-react';
import MetaContentGenerator from './MetaContentGenerator';

interface Performance {
  score: number;
  metrics: {
    textLength: number;
    readingTime: number;
    density: number;
    // Remove mediaCount since it doesn't exist in the type
  };
}

interface Content {
  title: string;
  meta: string;
  headings: string[];
  body: string;
  performance: Performance;
}

interface ContentOptimizationTabsProps {
  content?: Content;
}

const ContentOptimizationTabs: React.FC<ContentOptimizationTabsProps> = ({ content }) => {
  // Sample Content if none is provided
  const sampleContent: Content = content || {
    title: "Guide complet sur l'optimisation SEO pour les débutants",
    meta: "Découvrez les meilleures pratiques SEO pour améliorer votre classement dans les moteurs de recherche. Guide pas à pas pour débutants.",
    headings: [
      "Les fondamentaux du SEO",
      "Optimisation on-page",
      "Optimisation off-page",
      "Analyse technique",
      "Mesurer vos résultats"
    ],
    body: "Le SEO (Search Engine Optimization) est un ensemble de techniques visant à améliorer la visibilité d'un site web dans les résultats des moteurs de recherche. Une bonne stratégie SEO combine des éléments techniques, du contenu de qualité et une stratégie de liens externes...",
    performance: {
      score: 78,
      metrics: {
        textLength: 1250,
        readingTime: 5,
        density: 2.3,
      }
    }
  };

  const activeContent = content || sampleContent;

  return (
    <Tabs defaultValue="generator" className="space-y-4">
      <TabsList className="grid grid-cols-6 h-auto p-1">
        <TabsTrigger value="generator" className="flex items-center gap-2 py-2">
          <Wand2 className="h-4 w-4" />
          <span className="hidden sm:inline">Générateur IA</span>
        </TabsTrigger>
        <TabsTrigger value="structure" className="flex items-center gap-2 py-2">
          <Layers className="h-4 w-4" />
          <span className="hidden sm:inline">Structure</span>
        </TabsTrigger>
        <TabsTrigger value="keywords" className="flex items-center gap-2 py-2">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Mots-clés</span>
        </TabsTrigger>
        <TabsTrigger value="readability" className="flex items-center gap-2 py-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Lisibilité</span>
        </TabsTrigger>
        <TabsTrigger value="seo" className="flex items-center gap-2 py-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">SEO</span>
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center gap-2 py-2">
          <BarChart className="h-4 w-4" />
          <span className="hidden sm:inline">Performance</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="generator" className="space-y-4">
        <MetaContentGenerator />
      </TabsContent>

      <TabsContent value="structure" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Structure du Contenu</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-2">TITRE</h4>
              <p className="text-lg font-medium">{activeContent.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-full max-w-md bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (activeContent.title.length / 60) * 100)}%` }}></div>
                </div>
                <span className="text-xs font-medium">{activeContent.title.length} / 60</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-2">META DESCRIPTION</h4>
              <p className="text-sm">{activeContent.meta}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-full max-w-md bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: `${Math.min(100, (activeContent.meta.length / 160) * 100)}%` }}></div>
                </div>
                <span className="text-xs font-medium">{activeContent.meta.length} / 160</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-2">STRUCTURE DES TITRES</h4>
              <div className="space-y-2">
                {activeContent.headings.map((heading, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-md">H{index + 2}</div>
                    <p className="text-sm">{heading}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="keywords" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Analyse des Mots-clés</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-gray-500 mb-2">MOTS-CLÉS PRINCIPAUX</h4>
              <div className="flex flex-wrap gap-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">SEO</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">optimisation</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">moteurs de recherche</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">débutants</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">classement</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-gray-500 mb-2">DENSITÉ DE MOTS-CLÉS</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">SEO</span>
                    <span className="text-sm font-medium">3.2%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">optimisation</span>
                    <span className="text-sm font-medium">2.1%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">débutants</span>
                    <span className="text-sm font-medium">1.4%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="readability" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Analyse de Lisibilité</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h4 className="font-medium text-sm text-gray-500 mb-2">SCORE FLESCH</h4>
              <div className="text-2xl font-bold">72</div>
              <p className="text-sm text-green-600">Relativement facile à lire</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h4 className="font-medium text-sm text-gray-500 mb-2">TEMPS DE LECTURE</h4>
              <div className="text-2xl font-bold">{activeContent.performance.metrics.readingTime} min</div>
              <p className="text-sm text-gray-600">Environ {activeContent.performance.metrics.textLength} mots</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h4 className="font-medium text-sm text-gray-500 mb-2">PHRASES COMPLEXES</h4>
              <div className="text-2xl font-bold">14%</div>
              <p className="text-sm text-yellow-600">Acceptable</p>
            </div>
          </div>
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm text-gray-500 mb-2">SUGGESTIONS D'AMÉLIORATION</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 text-lg">•</span>
                <span>Certaines phrases sont trop longues. Essayez de les diviser en phrases plus courtes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 text-lg">•</span>
                <span>Ajoutez plus de sous-titres pour améliorer la scannabilité du contenu.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 text-lg">•</span>
                <span>Bon usage des listes à puces pour présenter les informations.</span>
              </li>
            </ul>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="seo" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Analyse SEO</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-24 h-24" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eaeaea"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2"
                  strokeDasharray={`${activeContent.performance.score}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{activeContent.performance.score}</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Score SEO</h4>
              <p className="text-sm text-gray-600 mb-2">Votre contenu est bien optimisé pour les moteurs de recherche.</p>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    activeContent.performance.score >= 80 ? 'bg-green-500' : 
                    activeContent.performance.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} 
                  style={{ width: `${activeContent.performance.score}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-gray-500 mb-2">POINTS FORTS</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Le titre contient le mot-clé principal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Bonne structure avec des sous-titres hiérarchiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Longueur de contenu adéquate pour le sujet</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-gray-500 mb-2">AMÉLIORATIONS POSSIBLES</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 text-lg">•</span>
                  <span>Ajoutez plus de liens internes vers d'autres contenus</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 text-lg">•</span>
                  <span>Optimisez les attributs ALT des images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 text-lg">•</span>
                  <span>Augmentez la densité du mot-clé principal à 2-3%</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance du Contenu</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h4 className="font-medium text-sm text-gray-500 mb-2">LONGUEUR</h4>
              <div className="text-2xl font-bold">{activeContent.performance.metrics.textLength}</div>
              <p className="text-sm text-green-600">Mots au total</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h4 className="font-medium text-sm text-gray-500 mb-2">DENSITÉ</h4>
              <div className="text-2xl font-bold">{activeContent.performance.metrics.density}%</div>
              <p className="text-sm text-yellow-600">Mots-clés principaux</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h4 className="font-medium text-sm text-gray-500 mb-2">MÉDIAS</h4>
              <div className="text-2xl font-bold">3</div>
              <p className="text-sm text-green-600">Images et vidéos</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-sm text-gray-500 mb-2">ENGAGEMENT PRÉVU</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <div className="text-center">
                  <h5 className="text-xs text-gray-500">TEMPS SUR PAGE</h5>
                  <p className="text-lg font-bold">3:42</p>
                </div>
                <div className="text-center">
                  <h5 className="text-xs text-gray-500">TX. REBOND</h5>
                  <p className="text-lg font-bold">45%</p>
                </div>
                <div className="text-center">
                  <h5 className="text-xs text-gray-500">PARTAGES SOC.</h5>
                  <p className="text-lg font-bold">32</p>
                </div>
                <div className="text-center">
                  <h5 className="text-xs text-gray-500">CTR ESTIMÉ</h5>
                  <p className="text-lg font-bold">3.8%</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ContentOptimizationTabs;
