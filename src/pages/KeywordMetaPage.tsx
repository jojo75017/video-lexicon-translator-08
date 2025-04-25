
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import KeywordTabContent from '@/components/dashboard/tabs/KeywordTabContent';
import { toast } from 'sonner';
import { OpenAIService } from '@/utils/seo/openaiService';

const KeywordMetaPage = () => {
  const [apiInitialized, setApiInitialized] = useState(false);
  
  // Initialiser les services au chargement de la page
  useEffect(() => {
    // Activer les proxys CORS
    if (!apiInitialized) {
      OpenAIService.enableProxy();
      
      const storedKey = localStorage.getItem('openaiKey');
      console.log("Page KeywordMetaPage chargée, clé API OpenAI:", storedKey ? "trouvée" : "non trouvée");
      
      // Simplement vérifier si une clé existe
      if (storedKey) {
        setApiInitialized(true);
      }
    }
  }, [apiInitialized]);

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
          <h1 className="ml-4 text-xl font-bold">Optimisation Title & Meta</h1>
        </div>
      </header>
      
      <div className="container mx-auto">
        <Card className="p-6 shadow-md">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Optimisation des balises Title & Meta</h2>
              <p className="text-gray-600">
                Améliorez votre référencement en optimisant vos balises title et meta description.
              </p>
            </div>
          </div>
          
          <KeywordTabContent />
        </Card>
      </div>
    </div>
  );
};

export default KeywordMetaPage;
