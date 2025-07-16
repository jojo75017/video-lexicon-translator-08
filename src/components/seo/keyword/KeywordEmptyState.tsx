
import React from 'react';
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const KeywordEmptyState: React.FC = () => {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-4">
        Entrez un mot-clé principal et cliquez sur "Générer" pour obtenir des suggestions de mots-clés pertinents
        pour votre contenu SEO.
      </p>
    </Card>
  );
};

export default KeywordEmptyState;
