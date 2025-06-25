
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { CrawlForm } from '@/components/CrawlForm';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Index = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Analyseur SEO Intelligent
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Analysez et optimisez votre site web avec notre suite d'outils SEO avancés.
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Commencez par analyser un site web pour obtenir des informations détaillées sur ses performances SEO.
          </AlertDescription>
        </Alert>

        <CrawlForm />
      </div>
    </UnifiedDashboard>
  );
};

export default Index;
