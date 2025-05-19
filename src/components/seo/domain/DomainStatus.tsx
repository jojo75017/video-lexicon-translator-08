
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Check, X, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface DomainStatusProps {
  domain: string;
  isAvailable: boolean | null;
  isChecking: boolean;
}

export const DomainStatus: React.FC<DomainStatusProps> = ({ domain, isAvailable, isChecking }) => {
  const estimateTraffic = () => {
    // In a real application, this would call an API to get traffic data
    toast.info(`Estimation du trafic pour ${domain} en cours...`);
    setTimeout(() => {
      const estimatedVisits = Math.floor(Math.random() * 5000) + 1000;
      toast.success(`Trafic estimé pour ${domain}: ${estimatedVisits.toLocaleString()} visites/mois`);
    }, 1500);
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        <span className="ml-3 text-green-700">Vérification de la disponibilité...</span>
      </div>
    );
  }
  
  if (isAvailable === null) {
    return null;
  }
  
  return isAvailable ? (
    <Alert className="bg-green-50 text-green-800 border-green-200">
      <div className="flex flex-col w-full">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="ml-2">
            <AlertTitle className="font-medium">Domaine disponible!</AlertTitle>
            <AlertDescription>
              Le domaine <strong>{domain}</strong> est actuellement disponible à l'enregistrement.
            </AlertDescription>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
            onClick={estimateTraffic}
          >
            <TrendingUp className="h-4 w-4" />
            Estimer le trafic potentiel
          </Button>
        </div>
      </div>
    </Alert>
  ) : (
    <Alert className="bg-red-50 text-red-800 border-red-200">
      <X className="h-5 w-5 text-red-600" />
      <AlertTitle className="font-medium">Domaine non disponible</AlertTitle>
      <AlertDescription>
        Le domaine <strong>{domain}</strong> est déjà enregistré ou réservé.
      </AlertDescription>
    </Alert>
  );
};

export default DomainStatus;
