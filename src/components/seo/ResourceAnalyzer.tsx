
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, FileText, AlertCircle, Globe, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzeResources, Resource } from '@/utils/resourceAnalyzer';

export const ResourceAnalyzer = () => {
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [corsError, setCorsError] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);

  const handleButtonClick = () => {
    setShowForm(prev => !prev);
    setResources([]);
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
      
      // Analyser les ressources
      const resourcesData = await analyzeResources(doc, formattedUrl);
      setResources(resourcesData);
      
      toast.success(`${resourcesData.length} ressources analysées`);
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
  
  // Calculer des statistiques sur les ressources
  const resourceStats = React.useMemo(() => {
    if (resources.length === 0) return null;
    
    const types: Record<string, number> = {};
    let errorCount = 0;
    
    resources.forEach(resource => {
      // Compter par type
      types[resource.type] = (types[resource.type] || 0) + 1;
      
      // Compter les erreurs
      if (resource.status >= 400) {
        errorCount++;
      }
    });
    
    return {
      total: resources.length,
      byType: types,
      errors: errorCount
    };
  }, [resources]);
  
  return (
    <>
      <Button 
        onClick={handleButtonClick}
        className="bg-purple-200 hover:bg-purple-300 text-purple-800 border border-purple-300"
      >
        <FileText className="mr-2 h-4 w-4" />
        Ressources
      </Button>
      
      {showForm && (
        <Card className="mt-4 border border-purple-200">
          <CardHeader className="bg-purple-50 border-b border-purple-100 pb-3">
            <CardTitle className="text-lg text-purple-800">Analyser les ressources</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit}>
              <Alert className="mb-4 bg-purple-50 border-purple-200 text-purple-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  Analysez les images, scripts et feuilles de style utilisés par votre site pour optimiser les performances.
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
                  <label htmlFor="resource-url" className="block text-sm font-medium mb-1">
                    URL du site
                  </label>
                  <Input
                    id="resource-url"
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
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyse en cours...
                      </>
                    ) : (
                      'Analyser'
                    )}
                  </Button>
                </div>
              </div>
            </form>
            
            {resourceStats && (
              <div className="mt-6 space-y-4">
                <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                  <h3 className="font-medium text-purple-800 mb-2">Résumé des ressources</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded border border-purple-100">
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="text-xl font-semibold">{resourceStats.total}</div>
                    </div>
                    
                    <div className="bg-white p-2 rounded border border-purple-100">
                      <div className="text-sm text-gray-600">Erreurs</div>
                      <div className="text-xl font-semibold text-red-600">{resourceStats.errors}</div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mt-4 mb-2 text-purple-800">Par type</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(resourceStats.byType).map(([type, count]) => (
                      <div key={type} className="bg-white p-2 rounded border border-purple-100">
                        <div className="text-sm text-gray-600 capitalize">{type}</div>
                        <div className="text-lg font-medium">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h4 className="font-medium">Liste des ressources</h4>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="py-2 px-4 text-left">Type</th>
                          <th className="py-2 px-4 text-left">URL</th>
                          <th className="py-2 px-4 text-left">Statut</th>
                          <th className="py-2 px-4 text-left">Taille</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {resources.map((resource, index) => (
                          <tr key={index} className={resource.status >= 400 ? "bg-red-50" : ""}>
                            <td className="py-2 px-4 capitalize">{resource.type}</td>
                            <td className="py-2 px-4 truncate max-w-[200px]" title={resource.url}>
                              {resource.url}
                            </td>
                            <td className="py-2 px-4">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                resource.status >= 400 
                                  ? "bg-red-100 text-red-800" 
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {resource.status}
                              </span>
                            </td>
                            <td className="py-2 px-4">{resource.size || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ResourceAnalyzer;
