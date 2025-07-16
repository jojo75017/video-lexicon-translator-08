
import React from 'react';

interface ComparisonSectionProps {
  comparisonSite: string;
  setComparisonSite: (site: string) => void;
  isLoading: boolean;
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  comparisonSite,
  setComparisonSite,
  isLoading
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-3">Analyse comparative</h3>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          value={comparisonSite}
          onChange={(e) => setComparisonSite(e.target.value)}
          placeholder="URL du site concurrent à comparer"
          className="flex-1 p-2 border border-gray-300 rounded-md"
        />
        <button
          disabled={isLoading || !comparisonSite}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-300"
        >
          Comparer
        </button>
      </div>
      
      <p className="text-sm text-gray-600">
        Comparez votre site avec vos concurrents pour identifier les opportunités d'amélioration.
      </p>
    </div>
  );
};

export default ComparisonSection;
