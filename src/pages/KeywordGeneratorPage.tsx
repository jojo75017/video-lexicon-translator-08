
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KeywordDensityAnalyzer from '@/components/seo/KeywordDensityAnalyzer';
import KeywordTrendAnalysis from '@/components/seo/keyword/KeywordTrendAnalysis';
import KeywordQuestions from '@/components/seo/keyword/KeywordQuestions';
import ContentIdeaGenerator from '@/components/seo/keyword/ContentIdeaGenerator';
import { Search, TrendingUp, HelpCircle, FileText } from 'lucide-react';

const KeywordGeneratorPage = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Suite d'Outils SEO
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Analysez vos mots-clés, optimisez votre contenu et générez des idées pour améliorer votre référencement.
          </p>
        </div>

        <Tabs defaultValue="density" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="density" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Densité
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tendances
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contenu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="density" className="mt-6">
            <KeywordDensityAnalyzer />
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <KeywordTrendAnalysis />
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            <KeywordQuestions />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentIdeaGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordGeneratorPage;
