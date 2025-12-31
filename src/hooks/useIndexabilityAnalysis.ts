
import { useState } from 'react';
import { toast } from "sonner";
import { analyzeIndexability, generateDownloadableReport, type IndexabilityReport } from '@/utils/seo/indexabilityAnalyzer';

export type IndexabilityResults = IndexabilityReport;

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
        
        // Analyser l'indexabilité avec la nouvelle fonction améliorée
        const indexabilityResults = analyzeIndexability(doc);
        setResults(indexabilityResults);
        
        toast.success("Analyse d'indexabilité terminée avec succès");
        setIsAnalyzing(false);
        return;
      } catch (directError) {
        console.log("Accès direct échoué, tentative via proxy CORS:", directError);
      }
      
      // Si l'accès direct échoue, essayer via un proxy CORS public (sans popup)
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(formattedUrl)}`);

      if (!response.ok) {
        throw new Error(`Proxy error: ${response.status}`);
      }
      
      const html = await response.text();
      
      // Créer un DOM à partir du HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Analyser l'indexabilité avec la nouvelle fonction améliorée
      const indexabilityResults = analyzeIndexability(doc);
      setResults(indexabilityResults);
      
      toast.success("Analyse d'indexabilité terminée avec succès");
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
    toast.info('Proxy automatique', {
      description: "Aucune activation manuelle n'est nécessaire."
    });
  };

  const downloadReport = () => {
    if (!results) return;
    
    const reportContent = generateDownloadableReport(results, url);
    const blob = new Blob([reportContent], { type: 'text/plain; charset=utf-8' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `rapport-indexabilite-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
    
    toast.success("Rapport téléchargé avec succès");
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
    downloadReport,
    resetResults: () => {
      setResults(null);
      setCorsError(false);
    }
  };
};
