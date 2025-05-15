
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Map, FileBarChart, Download, Link2, ListFilter, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import useKeywordGenerator from '@/hooks/useKeywordGenerator';
import KeywordForm from './keyword/KeywordForm';
import KeywordTable from './keyword/KeywordTable';
import KeywordVisualizations from './keyword/KeywordVisualizations';
import KeywordGroups from './keyword/KeywordGroups';
import ContentIdeas from './keyword/ContentIdeas';
import WordCloud from './keyword/WordCloud';

const KeywordGenerator = () => {
  const {
    // État du formulaire
    keyword,
    setKeyword,
    language,
    setLanguage,
    niche,
    setNiche,
    objective,
    setObjective,
    region,
    setRegion,
    
    // État des résultats
    isLoading,
    keywordResults,
    activeTab,
    setActiveTab,
    
    // Actions
    generateKeywordResults,
    handleExport,
    getAllKeywords
  } = useKeywordGenerator();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
            <Search className="h-5 w-5 text-indigo-600" />
            Générateur de Mots-Clés SEO
          </CardTitle>
          <p className="text-sm text-indigo-600">
            Générez une stratégie de mots-clés complète et visuelle pour votre contenu
          </p>
        </CardHeader>
        <CardContent>
          <KeywordForm 
            keyword={keyword}
            onKeywordChange={setKeyword}
            language={language}
            onLanguageChange={setLanguage}
            niche={niche}
            onNicheChange={setNiche}
            objective={objective}
            onObjectiveChange={setObjective}
            region={region}
            onRegionChange={setRegion}
            isLoading={isLoading}
            onSubmit={generateKeywordResults}
          />
        </CardContent>
      </Card>

      {keywordResults && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Résultats pour "{keyword}"</h2>
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter CSV
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <FileBarChart className="h-4 w-4" />
                <span className="hidden md:inline">Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="longtail" className="flex items-center gap-1">
                <ListFilter className="h-4 w-4" />
                <span className="hidden md:inline">Longue traîne</span>
              </TabsTrigger>
              <TabsTrigger value="intent" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden md:inline">Intentions</span>
              </TabsTrigger>
              <TabsTrigger value="visualization" className="flex items-center gap-1">
                <Map className="h-4 w-4" />
                <span className="hidden md:inline">Visualisation</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-1">
                <Link2 className="h-4 w-4" />
                <span className="hidden md:inline">Idées de contenu</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Onglet Vue d'ensemble */}
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mots-clés principaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <KeywordTable 
                    keywords={keywordResults.mainKeywords} 
                    title="Mots-clés principaux"
                  />

                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-4">Champ sémantique</h3>
                    <div className="flex flex-wrap gap-2">
                      {keywordResults.semantic.map((word, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-4">Sites concurrents</h3>
                    <div className="space-y-3">
                      {keywordResults.competitors.map((competitor, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="font-medium">{competitor.name}</p>
                            <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                              {competitor.url}
                            </a>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={
                              competitor.strength > 75 
                                ? "bg-red-100 text-red-800 border-red-200" 
                                : competitor.strength > 50 
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                                : "bg-green-100 text-green-800 border-green-200"
                            }
                          >
                            Force {competitor.strength}/100
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Onglet Longue traîne */}
            <TabsContent value="longtail" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mots-clés longue traîne et questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-md font-medium mb-3">Longue traîne</h3>
                      <div className="space-y-2">
                        {keywordResults.longTail.map((kw, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-md">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">{kw.keyword}</p>
                              <Badge variant="outline" className={
                                kw.difficulty < 30 ? "bg-green-100 text-green-800 border-green-200" :
                                kw.difficulty < 60 ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                                "bg-red-100 text-red-800 border-red-200"
                              }>
                                {kw.difficulty < 30 ? "Facile" : kw.difficulty < 60 ? "Moyen" : "Difficile"}
                              </Badge>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-500">
                              <span>{kw.volume?.toLocaleString()} recherches/mois</span>
                              <span>CPC: {kw.cpc?.toLocaleString(undefined, {style: 'currency', currency: 'EUR', minimumFractionDigits: 2})}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium mb-3">Questions fréquentes</h3>
                      <div className="space-y-2">
                        {keywordResults.questions.map((kw, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-md border border-blue-100">
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-blue-800">{kw.keyword}</p>
                              <Badge variant="outline" className={
                                kw.difficulty < 30 ? "bg-green-100 text-green-800 border-green-200" :
                                kw.difficulty < 60 ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                                "bg-red-100 text-red-800 border-red-200"
                              }>
                                {kw.difficulty < 30 ? "Facile" : kw.difficulty < 60 ? "Moyen" : "Difficile"}
                              </Badge>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-blue-600">
                              <span>{kw.volume?.toLocaleString()} recherches/mois</span>
                              <span>CPC: {kw.cpc?.toLocaleString(undefined, {style: 'currency', currency: 'EUR', minimumFractionDigits: 2})}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-3">Mots-clés liés</h3>
                    <div className="space-y-2">
                      {keywordResults.related.map((kw, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{kw.keyword}</p>
                            <Badge variant="outline" className={
                              kw.difficulty < 30 ? "bg-green-100 text-green-800 border-green-200" :
                              kw.difficulty < 60 ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                              "bg-red-100 text-red-800 border-red-200"
                            }>
                              {kw.difficulty < 30 ? "Facile" : kw.difficulty < 60 ? "Moyen" : "Difficile"}
                            </Badge>
                          </div>
                          <div className="flex justify-between mt-2 text-sm text-gray-500">
                            <span>{kw.volume?.toLocaleString()} recherches/mois</span>
                            <span>CPC: {kw.cpc?.toLocaleString(undefined, {style: 'currency', currency: 'EUR', minimumFractionDigits: 2})}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Onglet Intentions */}
            <TabsContent value="intent" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Regroupement par intention de recherche</CardTitle>
                </CardHeader>
                <CardContent>
                  <KeywordGroups byIntent={keywordResults.byIntent} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Onglet Visualisation */}
            <TabsContent value="visualization" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visualisation des données</CardTitle>
                </CardHeader>
                <CardContent>
                  <KeywordVisualizations 
                    mainKeywords={keywordResults.mainKeywords} 
                    allKeywords={getAllKeywords()} 
                  />
                  
                  {/* Nuage de mots-clés */}
                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-3">Nuage de mots-clés</h3>
                    <WordCloud keywords={getAllKeywords()} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Onglet Idées de contenu */}
            <TabsContent value="content" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Idées de contenu</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContentIdeas 
                    contentIdeas={keywordResults.contentIdeas}
                    relatedKeywords={[...keywordResults.mainKeywords, ...keywordResults.related]
                      .map(kw => kw.keyword)}
                  />
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-md font-medium mb-3">Architecture de cocon sémantique</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md font-medium text-center">
                        {keyword}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        {keywordResults.mainKeywords.slice(0, 3).map((kw, i) => (
                          <div key={i} className="p-2 bg-blue-50 text-blue-700 rounded-md text-center">
                            {kw.keyword}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        {[
                          ...keywordResults.longTail,
                          ...keywordResults.questions
                        ].slice(0, 8).map((kw, i) => (
                          <div key={i} className="p-2 bg-gray-100 text-gray-700 rounded-md text-center text-sm">
                            {kw.keyword}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-md font-medium mb-3">FAQ optimisée SEO</h3>
                    <div className="space-y-3">
                      {keywordResults.questions.map((question, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          <p className="font-medium">{question.keyword} ?</p>
                          <p className="text-sm text-gray-600 mt-2">
                            Répondez à cette question en utilisant les mots-clés suivants : {
                              [
                                keyword, 
                                keywordResults.semantic[index % keywordResults.semantic.length]
                              ].join(', ')
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {!keywordResults && !isLoading && (
        <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Générateur de stratégie de mots-clés</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Saisissez votre mot-clé principal ci-dessus pour générer une stratégie de mots-clés complète avec volume de recherche, difficulté, concurrence et suggestions de contenu.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["voyage au Japon", "formation SEO", "acheter meuble design", "apprendre la guitare", "recette gâteau chocolat"].map((suggestion, i) => (
                <Badge 
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-indigo-50"
                  onClick={() => {
                    setKeyword(suggestion);
                    toast.info(`Mot-clé "${suggestion}" sélectionné. Cliquez sur Générer pour lancer l'analyse.`);
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeywordGenerator;
