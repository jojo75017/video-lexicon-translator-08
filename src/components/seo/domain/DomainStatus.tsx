
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, X } from "lucide-react";

interface DomainStatusProps {
  domain: string;
  isAvailable: boolean | null;
  isChecking: boolean;
}

export const DomainStatus: React.FC<DomainStatusProps> = ({ domain, isAvailable, isChecking }) => {
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
      <Check className="h-5 w-5 text-green-600" />
      <AlertTitle className="font-medium">Domaine disponible!</AlertTitle>
      <AlertDescription>
        Le domaine <strong>{domain}</strong> est actuellement disponible à l'enregistrement.
      </AlertDescription>
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
