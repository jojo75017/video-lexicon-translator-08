
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, AlertCircle, CheckCircle2, AlertTriangle, Globe } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzeIndexability } from '@/utils/seo/indexabilityAnalyzer';

export const IndexabilityAnalyzer = () => {
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [corsError, setCorsError] = useState(false);
  const [results, setResults] = useState<{
    canIndex: boolean;
    indexablePages: number;
    reasons: string[];
    recommendations: string[];
  } | null>(null);

  const handleButtonClick = () => {
    setShowForm(prev => !prev);
    setResults(null);
    setCorsError(false);
  };

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
      // Charger la page via un proxy ou fetch
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
  
  return (
    <>
      <Button 
        onClick={handleButtonClick}
        className="bg-pink-200 hover:bg-pink-300 text-pink-800 border border-pink-300"
      >
        <Search className="mr-2 h-4 w-4" />
        Indexabilité
      </Button>
      
      {showForm && (
        <Card className="mt-4 border border-pink-200">
          <CardHeader className="bg-pink-50 border-b border-pink-100 pb-3">
            <CardTitle className="text-lg text-pink-800">Analyser l'indexabilité</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit}>
              <Alert className="mb-4 bg-pink-50 border-pink-200 text-pink-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  Vérifiez si votre site est correctement indexable par les moteurs de recherche.
                </AlertDescription>
              </Alert>
              
              {corsError && (
                <Alert className="mb-4 border-amber-300 bg-amber-50">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <AlertTitle className="text-amber-800">Activation CORS requise</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    <p className="mb-2">
                      Pour analyser des sites externes, vous devez activer temporairement le proxy CORS.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
                      onClick={handleOpenCorsDemo}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Activer CORS Demo
                    </Button>
                    <p className="mt-2 text-xs">
                      Sur la page qui s'ouvrira, cliquez sur "Request temporary access to the demo server", 
                      puis revenez et essayez à nouveau.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium mb-1">
                    URL du site
                  </label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={handleUrlChange}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="mr-2"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isAnalyzing}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    {isAnalyzing ? 'Analyse en cours...' : 'Analyser'}
                  </Button>
                </div>
              </div>
            </form>
            
            {results && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${results.canIndex ? 'bg-green-100' : 'bg-red-100'}`}>
                    {results.canIndex ? 
                      <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {results.canIndex ? 'Page indexable' : 'Page non indexable'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {results.canIndex 
                        ? `Nous avons détecté environ ${results.indexablePages} pages indexables.` 
                        : 'Les moteurs de recherche ne peuvent pas indexer cette page.'}
                    </p>
                  </div>
                </div>
                
                {results.reasons.length > 0 && (
                  <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                    <h4 className="font-medium text-amber-800 mb-1">Raisons</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {results.reasons.map((reason, index) => (
                        <li key={index} className="text-sm text-amber-700">{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {results.recommendations.length > 0 && (
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-1">Recommandations</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-blue-700">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default IndexabilityAnalyzer;
