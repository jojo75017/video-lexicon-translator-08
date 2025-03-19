
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Globe, Shield, Rocket, ExternalLink, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";

interface SeoAnalysisFormProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  analyzeSite: () => void;
  error: string | null;
  handleActivateProxy: () => void;
}

const SeoAnalysisForm: React.FC<SeoAnalysisFormProps> = ({
  url,
  setUrl,
  isLoading,
  showCorsWarning,
  analyzeSite,
  error,
  handleActivateProxy
}) => {
  const { t } = useTranslation();
  const [examples] = useState([
    'https://www.example.com',
    'https://www.wikipedia.org',
    'https://www.gov.fr'
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("Veuillez entrer une URL à analyser");
      return;
    }
    
    try {
      // Validate URL format
      new URL(url);
      toast.info("Début de l'analyse...", {
        description: "Cette opération peut prendre quelques instants"
      });
      analyzeSite();
    } catch (error) {
      toast.error("URL invalide", {
        description: "Veuillez entrer une URL valide (ex: https://exemple.com)"
      });
    }
  };

  const handleExampleClick = (example: string) => {
    setUrl(example);
  };

  return (
    <Card className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-lg shadow-md border border-indigo-100 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-2 h-8 bg-indigo-600 rounded-full mr-3"></div>
        <h3 className="font-bold text-xl text-gray-800">{t('seo.analyzeWebsite')}</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('seo.enterUrl')}
              className="pl-10 flex-1 h-12 border-gray-300 focus:border-indigo-500 bg-white shadow-sm"
              disabled={isLoading}
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading || !url}
              className="h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white transition-colors disabled:bg-indigo-300 shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  {t('seo.analyzing')}
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  {t('seo.analyze')}
                </>
              )}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-indigo-200 hover:bg-indigo-50 bg-white"
                    onClick={() => window.open('https://developers.google.com/search/docs/fundamentals/seo-starter-guide', '_blank')}
                  >
                    <ExternalLink className="h-5 w-5 text-indigo-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('seo.googleGuide')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-sm text-gray-600">{t('seo.tryExamples')}:</span>
          {examples.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(example)}
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {example.replace('https://', '')}
            </button>
          ))}
        </div>
      </form>
      
      {!url && !isLoading && (
        <div className="mt-4 text-gray-700 bg-blue-50 p-4 rounded-md border border-blue-100 flex items-start">
          <Shield className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">{t('seo.startAnalysis')}</p>
            <p className="text-sm text-blue-700">
              {t('seo.enterUrlDescription')}
            </p>
          </div>
        </div>
      )}
      
      {showCorsWarning && (
        <div className="mt-4 text-amber-700 bg-amber-50 p-4 rounded-md border border-amber-200 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">{t('seo.corsIssue')}</p>
            <p className="text-sm mb-2">
              {t('seo.corsDescription')}
            </p>
            <Button
              onClick={handleActivateProxy}
              variant="outline"
              size="sm"
              className="text-amber-700 border-amber-300 bg-amber-100 hover:bg-amber-200"
            >
              <Shield className="mr-1.5 h-4 w-4" />
              {t('seo.activateProxy')}
            </Button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 text-red-700 bg-red-50 p-4 rounded-md border border-red-200 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">{t('seo.analysisError')}</p>
            <p className="text-sm">{error}</p>
            {error.includes('Failed to fetch') && (
              <>
                <p className="text-sm mt-2 font-medium">Impossible de se connecter au site. Cela peut être dû à plusieurs raisons :</p>
                <ul className="text-sm list-disc pl-5 mt-1">
                  <li>Restrictions CORS du site</li>
                  <li>Le site n'est pas accessible actuellement</li>
                  <li>L'URL entrée est incorrecte</li>
                </ul>
                <Button
                  onClick={handleActivateProxy}
                  variant="outline"
                  size="sm"
                  className="mt-3 text-amber-700 border-amber-300 bg-amber-100 hover:bg-amber-200"
                >
                  <Shield className="mr-1.5 h-4 w-4" />
                  Activer le proxy CORS
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SeoAnalysisForm;
