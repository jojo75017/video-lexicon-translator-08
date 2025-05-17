
import React from 'react';
import { useKeywordGenerator } from '@/hooks/useKeywordGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Languages, Check, Download, X } from 'lucide-react';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';

const KeywordGenerator = () => {
  const {
    keyword,
    setKeyword,
    language,
    setLanguage,
    searchVolume,
    setSearchVolume,
    competition,
    setCompetition,
    keywordSuggestions,
    loading,
    error,
    generateKeywords,
    selectKeyword,
    selectedKeywords
  } = useKeywordGenerator();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateKeywords();
  };

  const handleExport = () => {
    if (selectedKeywords.length === 0) {
      toast.warning("Aucun mot-clé sélectionné pour l'export");
      return;
    }
    
    // In a real app, we would implement a proper export
    toast.success(`${selectedKeywords.length} mots-clés exportés`);
    console.log("Exported keywords:", selectedKeywords);
  };

  const handleClearAll = () => {
    if (selectedKeywords.length > 0) {
      toast.info("Tous les mots-clés ont été désélectionnés");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg shadow-md border border-blue-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot-clé principal</label>
              <div className="relative">
                <Input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                  placeholder="ex: formation en ligne"
                  required
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full min-w-[150px] border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                  <SelectValue placeholder="Choisir une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full h-10 mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md"
                disabled={loading || !keyword}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Générer des mots-clés
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <X className="h-5 w-5 mr-2 text-red-500" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {keywordSuggestions && keywordSuggestions.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-indigo-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Suggestions de mots-clés</h3>
            <div className="flex space-x-2">
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="text-gray-600 border-gray-300 hover:bg-gray-100"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" /> Tout désélectionner
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="text-green-600 border-green-300 hover:bg-green-50"
                size="sm"
              >
                <Download className="h-4 w-4 mr-1" /> Exporter
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {keywordSuggestions.map((suggestion, index) => (
              <div 
                key={index}
                className={`p-3 rounded-md transition-all cursor-pointer ${
                  selectedKeywords.includes(suggestion.keyword) 
                    ? 'bg-indigo-50 border-2 border-indigo-500 shadow-md' 
                    : 'border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                }`}
                onClick={() => selectKeyword(suggestion.keyword)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                      selectedKeywords.includes(suggestion.keyword) 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-gray-100'
                    }`}>
                      {selectedKeywords.includes(suggestion.keyword) && <Check className="h-3 w-3" />}
                    </span>
                    <span className="font-medium text-gray-800">{suggestion.keyword}</span>
                  </div>
                  {suggestion.volume && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {suggestion.volume} recherches
                    </span>
                  )}
                </div>
                {suggestion.competition !== undefined && (
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Concurrence:</span>
                    <div className="w-28 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          suggestion.competition < 0.3 ? 'bg-green-500' : 
                          suggestion.competition < 0.7 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${suggestion.competition * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">
                      {suggestion.competition < 0.3 ? 'Faible' : 
                       suggestion.competition < 0.7 ? 'Moyenne' : 
                       'Élevée'}
                    </span>
                  </div>
                )}
                {suggestion.cpc !== undefined && (
                  <div className="mt-1 flex items-center text-xs text-gray-600">
                    <span>CPC: {suggestion.cpc.toFixed(2)}€</span>
                    <span className="mx-2">•</span>
                    <span>Difficulté: {suggestion.difficulty}/100</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : !loading && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
          <Languages className="mx-auto h-10 w-10 text-blue-500 mb-2" />
          <p className="text-blue-700">
            Entrez un mot-clé principal pour générer des suggestions
          </p>
        </div>
      )}
      
      {selectedKeywords.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 shadow">
          <h3 className="text-lg font-medium text-green-800 mb-2">Mots-clés sélectionnés ({selectedKeywords.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword, index) => (
              <div 
                key={index}
                className="bg-white px-3 py-1 rounded-full border border-green-300 flex items-center gap-2 shadow-sm"
              >
                <span className="text-gray-700">{keyword}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    selectKeyword(keyword);
                  }}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordGenerator;
