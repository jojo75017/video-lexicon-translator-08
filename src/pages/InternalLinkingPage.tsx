
import React, { useState } from 'react';
import { ArrowLeft, FileText, Globe, Loader2, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { analyzeWebsiteKeywords } from '@/utils/seo/keywordExtractor';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';

const InternalLinkingPage = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);

  const analyzeKeywords = async () => {
    if (!urlInput.trim()) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Prétraiter l'URL pour s'assurer qu'elle a un protocole
      let processedUrl = urlInput.trim();
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
      }

      toast.info("Extraction des mots-clés en cours...");
      const extractedKeywords = await analyzeWebsiteKeywords(processedUrl);
      
      if (extractedKeywords.length > 0) {
        setKeywords(extractedKeywords);
        toast.success(`${extractedKeywords.length} mots-clés extraits avec succès`);
      } else {
        toast.warning("Aucun mot-clé significatif trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de l'extraction des mots-clés:", error);
      toast.error("L'extraction des mots-clés a échoué", {
        description: "Vérifiez que l'URL est valide et accessible"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold">Analyse de mots-clés</h1>
        </div>
      </header>
      
      <div className="container mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <KeyRound className="h-6 w-6 mr-2 text-blue-600" />
            Extraire les mots-clés d'un site web
          </h2>
          <p className="text-gray-600 mb-6">
            Analysez n'importe quel site web pour identifier ses mots-clés principaux et créer du contenu optimisé.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="url-input" className="text-sm font-medium text-gray-700">
                URL du site à analyser
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="url-input"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://exemple.com"
                    className="pl-10"
                    disabled={isAnalyzing}
                  />
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  onClick={analyzeKeywords}
                  disabled={isAnalyzing || !urlInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Extraire les mots-clés
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {keywords.length > 0 && (
            <div className="mt-8">
              <KeywordSuggestions 
                generatedKeywords={keywords} 
                onGenerateClick={analyzeKeywords} 
              />
            </div>
          )}

          {!keywords.length && !isAnalyzing && (
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-blue-800 mt-6">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                </svg>
                Entrez l'URL d'un site web pour extraire automatiquement ses mots-clés principaux.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InternalLinkingPage;
