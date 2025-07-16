
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock } from "lucide-react";
import { toast } from "sonner";

interface DomainAvailabilityCheckerProps {
  domain?: string;
}

const DomainAvailabilityChecker: React.FC<DomainAvailabilityCheckerProps> = ({ domain }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{[key: string]: boolean} | null>(null);
  
  const extensions = ['.com', '.fr', '.org', '.net', '.eu', '.co.uk', '.de', '.es'];
  
  const checkAvailability = async () => {
    if (!domain) {
      toast.error("Aucun domaine à vérifier");
      return;
    }
    
    setIsChecking(true);
    
    // Simulation de vérification de disponibilité
    setTimeout(() => {
      const results: {[key: string]: boolean} = {};
      extensions.forEach(ext => {
        results[ext] = Math.random() > 0.6; // 40% de chance d'être disponible
      });
      setAvailability(results);
      setIsChecking(false);
      toast.success("Vérification terminée");
    }, 2000);
  };
  
  if (!domain) {
    return (
      <div className="bg-purple-50 p-6 rounded-lg text-center">
        <Check className="h-12 w-12 mx-auto text-purple-600 mb-3" />
        <h3 className="text-lg font-medium text-purple-800">Vérification de disponibilité</h3>
        <p className="text-purple-700 mt-2">
          Entrez un nom de domaine pour vérifier sa disponibilité avec différentes extensions.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Check className="h-5 w-5 text-purple-600" />
            Disponibilité pour {domain}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button 
              onClick={checkAvailability}
              disabled={isChecking}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isChecking ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Vérifier la disponibilité
                </>
              )}
            </Button>
          </div>
          
          {availability && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {extensions.map(ext => (
                <div 
                  key={ext}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    availability[ext] 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <span className="text-sm font-medium">{domain}{ext}</span>
                  {availability[ext] ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {availability && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Cette vérification est une simulation. 
                Pour une vérification réelle, utilisez un service de registrar de domaines.
              </p>
            </div>
          )}
          
          {isChecking && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700"></div>
              <span className="ml-3 text-purple-700">Vérification en cours...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainAvailabilityChecker;
