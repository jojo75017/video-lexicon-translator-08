
import React from 'react';
import { Card } from "@/components/ui/card";

const WordCountTabContent = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Analyse des mots-clés</h3>
      <p className="text-sm text-gray-600">
        Examinez la densité et la pertinence des mots-clés dans votre contenu.
      </p>
      <Card className="p-4">
        <p className="text-sm">Analysez un site pour voir les données de mots-clés.</p>
      </Card>
    </div>
  );
};

export default WordCountTabContent;
