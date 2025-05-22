
import { useState } from 'react';
import { toast } from "sonner";
import { analyzeIndexability } from '@/utils/seo/indexabilityAnalyzer';

export type IndexabilityResults = {
  canIndex: boolean;
  indexablePages: number;
  reasons: string[];
  recommendations: string[];
};

export const useIndexabilityAnalysis = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [corsError, setCorsError] = useState(false);
  const [results, setResults] = useState<IndexabilityResults | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("Veuillez entrer une URL");
      return;
    }
    
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = `https://${url}`;
      setUrl(formattedUrl);
    }
    
    setIsAnalyzing(true);
    setCorsError(false);
    
    try {
      // Essayer d'abord sans le proxy CORS pour les sites qui le permettent
      try {
        const directResponse = await fetch(formattedUrl);
        const html = await directResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Analyser l'indexabilité
        const indexabilityResults = analyzeIndexability(doc);
        setResults(indexabilityResults);
        
        toast.success("Analyse d'indexabilité terminée");
        setIsAnalyzing(false);
        return;
      } catch (directError) {
        console.log("Accès direct échoué, tentative via proxy CORS:", directError);
      }
      
      // Si l'accès direct échoue, essayer via le proxy CORS
      const response = await fetch(`https://cors-anywhere.herokuapp.com/${formattedUrl}`);
      
      if (response.status === 403 && response.statusText === "Forbidden") {
        throw new Error("CORS error: Access to the resource is forbidden. Please activate CORS demo first.");
      }
      
      const html = await response.text();
      
      // Créer un DOM à partir du HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Analyser l'indexabilité
      const indexabilityResults = analyzeIndexability(doc);
      setResults(indexabilityResults);
      
      toast.success("Analyse d'indexabilité terminée");
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      
      // Vérifier si c'est une erreur CORS
      if (error instanceof Error && 
          (error.message.includes("CORS") || error.message.includes("cors") || 
           error.message.includes("Forbidden") || error.message.includes("403"))) {
        setCorsError(true);
        toast.error("Erreur d'accès CORS", {
          description: "Le proxy CORS est bloqué. Veuillez activer le démo CORS d'abord."
        });
      } else {
        toast.error("Erreur lors de l'analyse. Vérifiez l'URL et réessayez.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenCorsDemo = () => {
    window.open("https://cors-anywhere.herokuapp.com/corsdemo", "_blank");
  };

  return {
    url,
    isAnalyzing,
    corsError,
    results,
    setUrl,
    handleUrlChange,
    handleSubmit,
    handleOpenCorsDemo,
    resetResults: () => {
      setResults(null);
      setCorsError(false);
    }
  };
};
