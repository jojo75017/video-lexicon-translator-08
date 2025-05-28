
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { AnalysisOptions, PerformanceData, PageStructure } from '@/types/seo';

export interface AnalysisData {
  title: string;
  description: string;
  url: string;
  keywords: string[];
  competitors: any[];
  backlinks: number;
  socialMetrics: {
    facebook: number;
    twitter: number;
    pinterest: number;
    linkedin: number;
  };
  organicSearch: {
    keywords: string[];
    totalKeywords: number;
    averagePosition: number;
    visibility: number;
  };
  performance?: PerformanceData;
  structure?: PageStructure;
}

const mockAnalysis: AnalysisData = {
  title: 'Example Title',
  description: 'Example Description',
  url: 'https://example.com',
  keywords: ['keyword1', 'keyword2'],
  competitors: [],
  backlinks: 100,
  socialMetrics: {
    facebook: 500,
    twitter: 300,
    pinterest: 200,
    linkedin: 400,
  },
  organicSearch: {
    keywords: ['keyword1', 'keyword2'],
    totalKeywords: 1000,
    averagePosition: 5,
    visibility: 75,
  },
};

async function fetchPageContentWithFirecrawl(url: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Failed to fetch page content:", error);
    return null;
  }
}

function analyzePageContentStructure(htmlContent: string, url: string): any {
  // Basic analysis logic (replace with actual analysis)
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'No Title Found';
  const descriptionMatch = htmlContent.match(/<meta name="description" content="(.*?)"/i);
  const description = descriptionMatch ? descriptionMatch[1] : 'No Description Found';
  const keywords = ['example', 'keywords']; // Replace with actual keyword extraction

  return {
    title,
    description,
    url,
    keywords,
    competitors: [],
    backlinks: 0,
    socialMetrics: { facebook: 0, twitter: 0, pinterest: 0, linkedin: 0 },
    organicSearch: { keywords: [], totalKeywords: 0, averagePosition: 0, visibility: 0 },
  };
}

export const useSiteAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCorsWarning, setShowCorsWarning] = useState(false);
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null);

  const handleActivateProxy = useCallback(() => {
    setShowCorsWarning(false);
    toast.success('Proxy activé');
  }, []);

  const analyzeSite = useCallback(async (siteUrl?: string, options: AnalysisOptions = {}) => {
    const targetUrl = siteUrl || url;
    
    if (!targetUrl) {
      toast.error('Veuillez entrer une URL');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('Starting site analysis for:', targetUrl);
      setProgress(20);

      // Format URL
      const formattedUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
      
      setProgress(40);

      // Use Firecrawl for content analysis
      const htmlContent = await fetchPageContentWithFirecrawl(formattedUrl);
      
      setProgress(60);

      if (!htmlContent) {
        throw new Error('Impossible de récupérer le contenu de la page');
      }

      // Analyze the content
      const analysis = analyzePageContentStructure(htmlContent, formattedUrl);
      
      setProgress(80);

      setAnalysisData(analysis);
      setProgress(100);

      toast.success('Analyse terminée avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }, [url]);

  return {
    isAnalyzing,
    progress,
    analysisData,
    error,
    analyzeSite,
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    handleActivateProxy
  };
};
