
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, WordPress, Globe } from 'lucide-react';

interface IntegrationConfig {
  type: string;
  url: string;
  apiKey?: string;
}

const SeoIntegrations = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [wpUrl, setWpUrl] = useState('');
  const [semrushKey, setSemrushKey] = useState('');
  const [ahrefsKey, setAhrefsKey] = useState('');

  const handleWordPressConnect = async () => {
    if (!wpUrl) {
      toast.error("Veuillez entrer l'URL de votre site WordPress");
      return;
    }

    try {
      // Vérifier si l'URL est un site WordPress valide
      const response = await fetch(`${wpUrl}/wp-json`);
      const data = await response.json();
      
      if (data) {
        setIntegrations([...integrations, { type: 'wordpress', url: wpUrl }]);
        toast.success("Site WordPress connecté avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors de la connexion au site WordPress. Vérifiez l'URL et assurez-vous que l'API REST est activée.");
    }
  };

  const handleSemrushConnect = () => {
    if (!semrushKey) {
      toast.error("Veuillez entrer votre clé API SEMrush");
      return;
    }
    setIntegrations([...integrations, { type: 'semrush', url: '', apiKey: semrushKey }]);
    toast.success("SEMrush connecté avec succès");
  };

  const handleAhrefsConnect = () => {
    if (!ahrefsKey) {
      toast.error("Veuillez entrer votre clé API Ahrefs");
      return;
    }
    setIntegrations([...integrations, { type: 'ahrefs', url: '', apiKey: ahrefsKey }]);
    toast.success("Ahrefs connecté avec succès");
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Intégrations SEO</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-5 w-5 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Connectez vos outils SEO préférés pour une analyse plus complète</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <WordPress className="h-6 w-6 text-blue-500" />
          <Input 
            placeholder="URL de votre site WordPress"
            value={wpUrl}
            onChange={(e) => setWpUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleWordPressConnect}>
            Connecter WordPress
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Globe className="h-6 w-6 text-green-500" />
          <Input 
            placeholder="Clé API SEMrush"
            value={semrushKey}
            onChange={(e) => setSemrushKey(e.target.value)}
            className="flex-1"
            type="password"
          />
          <Button onClick={handleSemrushConnect}>
            Connecter SEMrush
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Globe className="h-6 w-6 text-orange-500" />
          <Input 
            placeholder="Clé API Ahrefs"
            value={ahrefsKey}
            onChange={(e) => setAhrefsKey(e.target.value)}
            className="flex-1"
            type="password"
          />
          <Button onClick={handleAhrefsConnect}>
            Connecter Ahrefs
          </Button>
        </div>
      </div>

      {integrations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Outils connectés</h3>
          <div className="space-y-2">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                {integration.type === 'wordpress' ? (
                  <WordPress className="h-4 w-4" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
                <span>{integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}</span>
                {integration.url && <span>- {integration.url}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SeoIntegrations;
