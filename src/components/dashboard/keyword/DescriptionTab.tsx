
import React, { useEffect, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getExactLength } from "@/utils/seo/generators/description/utils";

interface DescriptionTabProps {
  description: string;
  setDescription: (description: string) => void;
  maxDescriptionLength: number;
  keyword: string;
}

const DescriptionTab = ({ description, setDescription, maxDescriptionLength, keyword }: DescriptionTabProps) => {
  // État local pour suivre la longueur exacte sans espaces supplémentaires
  const [descriptionLength, setDescriptionLength] = useState(0);
  
  // Mettre à jour la longueur à chaque changement de description
  useEffect(() => {
    // Calculer la longueur exacte de la chaîne avec notre utilitaire modifié
    const length = getExactLength(description);
    console.log("Longueur calculée:", length, "Texte réel:", description.length);
    setDescriptionLength(length);
  }, [description]);
  
  return (
    <div className="space-y-4 pt-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">Meta Description</label>
          <span className={`text-xs ${
            descriptionLength > maxDescriptionLength ? 'text-red-500' : 
            descriptionLength > maxDescriptionLength - 20 ? 'text-amber-500' : 'text-gray-500'
          }`}>
            {descriptionLength}/{maxDescriptionLength}
          </span>
        </div>
        <Textarea 
          placeholder="Meta description de votre page. Idéalement entre 120 et 155 caractères."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${
            descriptionLength > maxDescriptionLength ? 'border-red-300 focus:ring-red-500' : ''
          }`}
          rows={3}
        />
        {descriptionLength > maxDescriptionLength && (
          <p className="text-xs text-red-500 mt-1">
            La description dépasse la limite recommandée de {maxDescriptionLength} caractères.
          </p>
        )}
      </div>

      {!keyword.trim() && !description && (
        <Alert className="bg-blue-50 border-blue-100">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Entrez un mot-clé et cliquez sur "Générer" pour obtenir des suggestions de descriptions optimisées.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DescriptionTab;
