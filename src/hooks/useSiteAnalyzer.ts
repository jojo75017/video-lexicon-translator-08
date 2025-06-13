
import { useState } from 'react';
import { AnalysisOptions } from '@/types/seo';

export const useSiteAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCorsWarning, setShowCorsWarning] = useState(false);
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeSite = async (options: AnalysisOptions = {
    includeBacklinks: true,
    includePerformance: true,
    includeMobile: true
  }) => {
    console.log('Analyzing site:', url);
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulation d'analyse
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        url,
        title: 'Site Analysis Results',
        score: 85,
        keywordSuggestions: [
          { keyword: 'seo', volume: 1000, difficulty: 50 },
          { keyword: 'marketing', volume: 800, difficulty: 40 }
        ]
      };
      
      setSeoAnalysis(mockAnalysis);
    } catch (err) {
      setError('Erreur lors de l\'analyse');
      console.error('Erreur analyse:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateProxy = () => {
    console.log('Proxy activated');
    setShowCorsWarning(false);
  };

  return {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    analyzeSite,
    error,
    handleActivateProxy
  };
};
