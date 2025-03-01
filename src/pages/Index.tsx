
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader />
        <LocalBusinessSection />
        <DashboardHeader />
        <SeoActionButtons />

        <div className="mb-12">
          <FeatureGrid />
          <InfoCards />
        </div>

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
            />
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
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
