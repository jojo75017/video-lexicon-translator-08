
import React, { useState } from 'react';
import { useKeywordGenerator } from '@/hooks/useKeywordGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Languages } from 'lucide-react';
import { KeywordSuggestion } from '@/types/seo/Keyword';

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

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot-clé principal</label>
              <div className="relative">
                <Input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 border border-gray-300 rounded-md"
                  placeholder="ex: formation en ligne"
                  required
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full min-w-[150px] border border-gray-300 rounded-md">
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
                className="w-full h-10 mt-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                disabled={loading || !keyword}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  'Générer des mots-clés'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      {keywordSuggestions && keywordSuggestions.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Suggestions de mots-clés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {keywordSuggestions.map((suggestion, index) => (
              <div 
                key={index}
                className={`p-3 rounded-md border transition-all cursor-pointer 
                  ${selectedKeywords.includes(suggestion.keyword) 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'}`}
                onClick={() => selectKeyword(suggestion.keyword)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{suggestion.keyword}</span>
                  {suggestion.volume && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {suggestion.volume} recherches
                    </span>
                  )}
                </div>
                {suggestion.competition && (
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Concurrence:</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          suggestion.competition < 0.3 ? 'bg-green-500' : 
                          suggestion.competition < 0.7 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${suggestion.competition * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : !loading && (
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
          <Languages className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-600">
            Entrez un mot-clé principal pour générer des suggestions
          </p>
        </div>
      )}
      
      {selectedKeywords.length > 0 && (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h3 className="text-lg font-medium mb-2">Mots-clés sélectionnés ({selectedKeywords.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword, index) => (
              <div 
                key={index}
                className="bg-white px-3 py-1 rounded-full border border-amber-300 flex items-center gap-2"
              >
                <span>{keyword}</span>
                <button 
                  onClick={() => selectKeyword(keyword)}
                  className="text-red-500 hover:text-red-700"
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
