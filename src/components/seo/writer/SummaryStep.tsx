
import React from 'react';

interface SummaryStepProps {
  selectedKeyword: string;
  language: string;
  wordCount: number;
}

const SummaryStep: React.FC<SummaryStepProps> = ({
  selectedKeyword,
  language,
  wordCount,
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Récapitulatif</h4>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>Mot-clé : {selectedKeyword}</li>
          <li>Langue : {language === 'fr' ? 'Français' : language === 'en' ? 'Anglais' : 'Espagnol'}</li>
          <li>Nombre de mots : {wordCount}</li>
        </ul>
      </div>
    </div>
  );
};

export default SummaryStep;
