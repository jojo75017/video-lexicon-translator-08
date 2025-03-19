
import React from 'react';

interface SeoAnalysisFormProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  analyzeSite: () => void;
  error: string | null;
  handleActivateProxy: () => void;
}

const SeoAnalysisForm: React.FC<SeoAnalysisFormProps> = ({
  url,
  setUrl,
  isLoading,
  showCorsWarning,
  analyzeSite,
  error,
  handleActivateProxy
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="font-semibold text-blue-800 mb-2">Analyser un site web</h3>
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Entrez l'URL du site à analyser"
          className="flex-1 p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={analyzeSite}
          disabled={isLoading || !url}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Analyse en cours...' : 'Analyser'}
        </button>
      </div>
      
      {!url && !isLoading && (
        <div className="mt-3 text-gray-700 bg-white p-3 rounded-md border border-gray-200">
          <p className="text-sm">Veuillez entrer l'URL d'un site web pour commencer l'analyse.</p>
        </div>
      )}
      
      {showCorsWarning && (
        <div className="mt-3 text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
          <p className="text-sm">
            Pour analyser des sites externes, vous devez activer le proxy CORS.
            <button
              onClick={handleActivateProxy}
              className="ml-2 text-blue-600 underline"
            >
              Activer le proxy
            </button>
          </p>
        </div>
      )}
      
      {error && (
        <div className="mt-3 text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SeoAnalysisForm;
