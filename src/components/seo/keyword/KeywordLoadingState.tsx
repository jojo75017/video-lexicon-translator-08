
import React from 'react';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface KeywordLoadingStateProps {
  keyword: string;
}

const KeywordLoadingState: React.FC<KeywordLoadingStateProps> = ({ keyword }) => {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Génération en cours...</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-4">
        OpenAI génère des suggestions de mots-clés pour "{keyword}".
        Veuillez patienter un moment.
      </p>
    </Card>
  );
};

export default KeywordLoadingState;
