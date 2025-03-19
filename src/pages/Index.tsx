
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FeatureGrid from '@/components/dashboard/FeatureGrid';
import TabNavigation from '@/components/dashboard/TabNavigation';
import SeoActionButtons from '@/components/dashboard/SeoActionButtons';
import LocalBusinessSection from '@/components/LocalBusinessSection';
import SignatureGenerator from '@/components/signature/SignatureGenerator';
import { KeywordSuggestion } from '@/types/seo';
import { toast } from "sonner";
import PageHeader from '@/components/dashboard/PageHeader';
import InfoCards from '@/components/seo/InfoCards';
import AnalysisSections from '@/components/seo/AnalysisSections';
import StructureSection from '@/components/seo/StructureSection';
import HierarchySection from '@/components/seo/HierarchySection';
import BacklinkSection from '@/components/seo/BacklinkSection';
import MetricsSection from '@/components/seo/MetricsSection';
import AdvancedSection from '@/components/seo/AdvancedSection';
import IntegrationsSection from '@/components/seo/IntegrationsSection';
import QuoraButton from '@/components/seo/buttons/QuoraButton';
import ContentOptimizationButton from '@/components/seo/buttons/ContentOptimizationButton';
import AiSearchButton from '@/components/seo/buttons/AiSearchButton';
import EnhancedAnalytics from '@/components/seo/EnhancedAnalytics';
import ContentOptimizationTabs from '@/components/seo/ContentOptimizationTabs';
import AiSearchTab from '@/components/seo/AiSearchTab';
import { Search } from 'lucide-react';

const Index = () => {
  const {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    siteStructure,
    analyzeSite,
    error,
    setSeoAnalysis
  } = useSiteAnalyzer();

  const [comparisonSite, setComparisonSite] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    intro: string;
    sections: Array<{ heading: string; content: string; }>;
  } | null>(null);
  const [contentKeyword, setContentKeyword] = useState('boutique en ligne');
  const [mockContentIdeas, setMockContentIdeas] = useState([
    {
      title: "CELINE: BOUTIQUE EN LIGNE OFFICIELLE FRANCE",
      url: "celine.com",
      visits: 10717,
      backlinks: 1603,
      socialShares: {
        facebook: 646,
        pinterest: 1781,
        reddit: 0
      }
    },
    {
      title: "Boutique en ligne officielle Harley-Davidson",
      url: "harley-davidson.com",
      visits: 8325,
      backlinks: 8924,
      socialShares: {
        facebook: 21194,
        pinterest: 92,
        reddit: 0
      }
    },
    {
      title: "Linge de table haut de gamme • Boutique en ligne",
      url: "beauville.com",
      visits: 588,
      backlinks: 10,
      socialShares: {
        facebook: 11849,
        pinterest: 17,
        reddit: 0
      }
    }
  ]);

  const handleGeneratedKeywords = (keywords: KeywordSuggestion[]) => {
    setGeneratedKeywords(keywords);
    if (seoAnalysis) {
      setSeoAnalysis({
        ...seoAnalysis,
        keywordSuggestions: keywords
      });
    }
  };

  const handleContentGenerated = (content: { title: string; intro: string; sections: Array<{ heading: string; content: string; }> }) => {
    setGeneratedContent(content);
    toast.success("Contenu généré avec succès !");
  };

  const handleActivateProxy = () => {
    window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank');
  };

  const handleContentKeywordChange = (newKeyword: string) => {
    setContentKeyword(newKeyword);
    setMockContentIdeas([
      {
        title: `${newKeyword} - Résultat Populaire #1`,
        url: "example1.com",
        visits: Math.floor(Math.random() * 15000),
        backlinks: Math.floor(Math.random() * 1000),
        socialShares: {
          facebook: Math.floor(Math.random() * 5000),
          pinterest: Math.floor(Math.random() * 2000),
          reddit: Math.floor(Math.random() * 100)
        }
      },
      {
        title: `${newKeyword} - Guide Complet`,
        url: "example2.com",
        visits: Math.floor(Math.random() * 15000),
        backlinks: Math.floor(Math.random() * 1000),
        socialShares: {
          facebook: Math.floor(Math.random() * 5000),
          pinterest: Math.floor(Math.random() * 2000),
          reddit: Math.floor(Math.random() * 100)
        }
      },
      {
        title: `Meilleurs conseils pour ${newKeyword}`,
        url: "example3.com",
        visits: Math.floor(Math.random() * 15000),
        backlinks: Math.floor(Math.random() * 1000),
        socialShares: {
          facebook: Math.floor(Math.random() * 5000),
          pinterest: Math.floor(Math.random() * 2000),
          reddit: Math.floor(Math.random() * 100)
        }
      }
    ]);
    toast.success(`Recherche d'idées de contenu pour "${newKeyword}"`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader 
          title="Tableau de bord SEO"
          description="Analysez et optimisez votre présence en ligne avec nos outils avancés"
          icon={<Search className="h-6 w-6 text-blue-600" />}
        />
        
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <DashboardHeader />
            <div className="flex flex-wrap gap-2">
              <ContentOptimizationButton />
              <AiSearchButton />
              <QuoraButton />
            </div>
          </div>
          
          <FeatureGrid />
          <SeoActionButtons />
          <InfoCards />
          
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <Tabs defaultValue="seo" className="space-y-6">
              <TabNavigation />
    
              <TabsContent value="seo" className="space-y-6">
                <AnalysisSections 
                  url={url}
                  setUrl={setUrl}
                  isLoading={isLoading}
                  showCorsWarning={showCorsWarning}
                  seoAnalysis={seoAnalysis}
                  setSeoAnalysis={setSeoAnalysis}
                  comparisonSite={comparisonSite}
                  setComparisonSite={setComparisonSite}
                  generatedKeywords={generatedKeywords}
                  setGeneratedKeywords={setGeneratedKeywords}
                  generatedContent={generatedContent}
                  setGeneratedContent={setGeneratedContent}
                  contentKeyword={contentKeyword}
                  mockContentIdeas={mockContentIdeas}
                  analyzeSite={analyzeSite}
                  error={error}
                  handleActivateProxy={handleActivateProxy}
                  handleContentKeywordChange={handleContentKeywordChange}
                  handleGeneratedKeywords={handleGeneratedKeywords}
                  handleContentGenerated={handleContentGenerated}
                />
              </TabsContent>
    
              <TabsContent value="structure">
                <StructureSection 
                  isLoading={isLoading}
                  siteStructure={siteStructure}
                />
              </TabsContent>
    
              <TabsContent value="hierarchy">
                <HierarchySection 
                  isLoading={isLoading}
                  seoAnalysis={seoAnalysis}
                />
              </TabsContent>
    
              <TabsContent value="backlinks">
                <BacklinkSection 
                  isLoading={isLoading}
                  seoAnalysis={seoAnalysis}
                />
              </TabsContent>
    
              <TabsContent value="metrics">
                <MetricsSection 
                  isLoading={isLoading}
                  seoAnalysis={seoAnalysis}
                />
              </TabsContent>
    
              <TabsContent value="analytics">
                <EnhancedAnalytics />
              </TabsContent>
    
              <TabsContent value="advanced">
                <AdvancedSection 
                  isLoading={isLoading}
                  seoAnalysis={seoAnalysis}
                />
              </TabsContent>
    
              <TabsContent value="integrations">
                <IntegrationsSection />
              </TabsContent>
    
              <TabsContent value="signature">
                <Card className="p-6">
                  <SignatureGenerator />
                </Card>
              </TabsContent>

              <TabsContent value="airesearch">
                <AiSearchTab />
              </TabsContent>
              
              <TabsContent value="optimize">
                <ContentOptimizationTabs />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="glass-card-v2 p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gradient-to-r from-indigo-600 to-purple-600">Nouvelles fonctionnalités</h2>
              <div className="flex gap-2">
                <ContentOptimizationButton />
                <AiSearchButton />
                <QuoraButton />
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Nos nouvelles intégrations vous permettent d'optimiser votre contenu, de faire des recherches IA, et de préparer rapidement des questions pour Quora afin d'améliorer votre visibilité et votre autorité dans votre domaine.
            </p>
          </div>
          
          <LocalBusinessSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
