
import React from 'react';
import { Globe } from "lucide-react";

export const DomainWelcomeScreen: React.FC = () => {
  return (
    <div className="bg-green-50 p-6 rounded-lg text-center">
      <Globe className="h-12 w-12 mx-auto text-green-600 mb-3" />
      <h3 className="text-lg font-medium text-green-800">Vérification de disponibilité de domaine</h3>
      <p className="text-green-700 mt-2">
        Entrez un nom de domaine ci-dessus pour vérifier sa disponibilité et obtenir des suggestions alternatives.
      </p>
    </div>
  );
};

export default DomainWelcomeScreen;
