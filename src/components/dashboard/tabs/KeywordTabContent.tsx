
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Tag, Search } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';

const maxTitleLength = 60;
const maxDescriptionLength = 155;

// Définition des suggestions de mots-clés par défaut - maintenant plus diversifiées
const defaultSuggestions: KeywordSuggestion[] = [
  // Voyage
  { 
    keyword: "voyage en finlande", 
    volume: 1200, 
    difficulty: 32, 
    cpc: 1.5, 
    competition: 0.4, 
    relevance: 95,
    suggestedTitle: "Voyage en Finlande : Guide Complet des Activités et Sites Incontournables",
    suggestedDescription: "Découvrez la Finlande avec notre guide de voyage : aurores boréales, lac, saunas et nature préservée. Conseils pratiques et itinéraires pour un séjour inoubliable."
  },
  { 
    keyword: "circuits corse", 
    volume: 880, 
    difficulty: 28, 
    cpc: 2.2, 
    competition: 0.3, 
    relevance: 90,
    suggestedTitle: "Circuits en Corse : Itinéraires Pour Découvrir l'Île de Beauté",
    suggestedDescription: "Planifiez votre circuit en Corse avec nos itinéraires personnalisés : plages paradisiaques, montagnes majestueuses et villages authentiques. Guide complet pour tous les budgets."
  },
  
  // Aquariophilie
  { 
    keyword: "aquarium eau douce", 
    volume: 590, 
    difficulty: 15, 
    cpc: 0.8, 
    competition: 0.2, 
    relevance: 85,
    suggestedTitle: "Aquarium Eau Douce : Guide Complet pour Débutants et Confirmés",
    suggestedDescription: "Découvrez comment créer et entretenir un magnifique aquarium d'eau douce. Conseils sur les poissons, plantes, filtration et maintenance pour un écosystème équilibré."
  },
  { 
    keyword: "poisson betta", 
    volume: 740, 
    difficulty: 45, 
    cpc: 3.1, 
    competition: 0.5, 
    relevance: 93,
    suggestedTitle: "Poisson Betta : Guide d'Entretien et Conseils pour un Habitat Idéal",
    suggestedDescription: "Apprenez à prendre soin de votre poisson Betta : alimentation, qualité d'eau, environnement adapté et astuces pour assurer sa santé et sa longévité dans votre aquarium."
  },
];

const KeywordTabContent: React.FC = () => {
  // États pour gérer les inputs et les données
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState('title');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Fonction pour générer des suggestions
  const generateSuggestions = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulation d'une API pour générer des suggestions
    setTimeout(() => {
      // Utiliser les suggestions par défaut et les personnaliser avec le mot-clé saisi
      const suggestions: KeywordSuggestion[] = defaultSuggestions.map(suggestion => ({
        ...suggestion,
        keyword: suggestion.keyword.includes(keyword.toLowerCase()) 
          ? suggestion.keyword 
          : `${keyword} ${suggestion.keyword}`,
        suggestedTitle: suggestion.suggestedTitle?.replace("Marketing Digital", keyword) || `${keyword} : Guide Complet`,
        suggestedDescription: suggestion.suggestedDescription?.replace("marketing digital", keyword.toLowerCase()) || `Découvrez tout sur ${keyword}`
      }));
      
      setGeneratedKeywords(suggestions);
      setIsGenerating(false);
      toast.success("Suggestions générées avec succès");
    }, 1500);
  };
  
  // Fonction pour insérer le titre suggéré
  const handleInsertTitle = (suggestion: string) => {
    setTitle(suggestion.substring(0, maxTitleLength));
    setActiveTab('title');
    toast.info(`Titre mis à jour avec "${suggestion.substring(0, 20)}..."`);
  };
  
  // Fonction pour insérer la description suggérée
  const handleInsertDescription = (suggestion: string) => {
    setDescription(suggestion.substring(0, maxDescriptionLength));
    setActiveTab('description');
    toast.info(`Description mise à jour avec "${suggestion.substring(0, 20)}..."`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Générateur de Title & Meta Description
          </h2>
          
          {/* Formulaire pour le mot-clé */}
          <div className="space-y-4">
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                Mot-clé principal
              </label>
              <div className="flex gap-2">
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Entrez votre mot-clé principal"
                  className="flex-1"
                />
                <Button 
                  onClick={generateSuggestions}
                  disabled={isGenerating || !keyword.trim()}
                >
                  {isGenerating ? 'Génération...' : 'Générer'}
                </Button>
              </div>
            </div>
          </div>

          {/* Onglets pour le titre et la description */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="title" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Title Tag
              </TabsTrigger>
              <TabsTrigger value="description" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Meta Description
              </TabsTrigger>
            </TabsList>
            
            {/* Contenu de l'onglet Title */}
            <TabsContent value="title" className="space-y-4 pt-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title Tag
                  </label>
                  <span className={`text-xs ${title.length > maxTitleLength ? 'text-red-500' : 'text-gray-500'}`}>
                    {title.length}/{maxTitleLength}
                  </span>
                </div>
                <Textarea
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entrez votre balise title ici"
                  className="min-h-[100px]"
                />
              </div>
              
              {/* Prévisualisation du titre */}
              {title && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Prévisualisation dans Google:</h3>
                  <div className="border border-gray-200 rounded-md p-3 bg-white">
                    <div className="text-blue-600 text-lg truncate">{title}</div>
                    <div className="text-green-700 text-xs">www.votresite.com › page</div>
                    <div className="text-gray-600 text-sm line-clamp-2 mt-1">
                      {description || "Votre description apparaîtra ici..."}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Conseils pour les titres */}
              <Alert variant="default" className="bg-blue-50 border-blue-100">
                <AlertDescription className="text-xs text-blue-800">
                  <strong>Conseils:</strong> Utilisez votre mot-clé principal en début de titre et gardez une longueur entre 50-60 caractères pour éviter la troncature.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            {/* Contenu de l'onglet Description */}
            <TabsContent value="description" className="space-y-4 pt-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Meta Description
                  </label>
                  <span className={`text-xs ${description.length > maxDescriptionLength ? 'text-red-500' : 'text-gray-500'}`}>
                    {description.length}/{maxDescriptionLength}
                  </span>
                </div>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Entrez votre meta description ici"
                  className="min-h-[120px]"
                />
              </div>
              
              {/* Prévisualisation de la description */}
              {description && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Prévisualisation dans Google:</h3>
                  <div className="border border-gray-200 rounded-md p-3 bg-white">
                    <div className="text-blue-600 text-lg truncate">{title || "Titre de votre page"}</div>
                    <div className="text-green-700 text-xs">www.votresite.com › page</div>
                    <div className="text-gray-600 text-sm line-clamp-2 mt-1">{description}</div>
                  </div>
                </div>
              )}
              
              {/* Conseils pour les descriptions */}
              <Alert variant="default" className="bg-blue-50 border-blue-100">
                <AlertDescription className="text-xs text-blue-800">
                  <strong>Conseils:</strong> Incluez un appel à l'action et maintenez une longueur entre 120-155 caractères. Intégrez naturellement votre mot-clé principal.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {/* Affichage des suggestions de mots-clés */}
      {generatedKeywords.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Tag className="h-4 w-4 mr-2 text-blue-600" />
            Suggestions pour "{keyword}"
          </h2>
          
          <div className="space-y-4">
            {generatedKeywords.map((kw, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-md font-medium">{kw.keyword}</h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {kw.volume} recherches
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Difficulté: {kw.difficulty}/100
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      CPC: {kw.cpc.toFixed(2)}€
                    </Badge>
                  </div>
                </div>
                
                {kw.suggestedTitle && (
                  <div className="mb-2">
                    <p className="text-sm font-medium mb-1">Title suggéré:</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className="text-sm bg-gray-100 p-2 rounded flex-1">{kw.suggestedTitle}</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleInsertTitle(kw.suggestedTitle || '')}
                      >
                        Utiliser
                      </Button>
                    </div>
                  </div>
                )}
                
                {kw.suggestedDescription && (
                  <div>
                    <p className="text-sm font-medium mb-1">Description suggérée:</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className="text-sm bg-gray-100 p-2 rounded flex-1">{kw.suggestedDescription}</p>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleInsertDescription(kw.suggestedDescription || '')}
                      >
                        Utiliser
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Message quand aucune suggestion n'est disponible */}
      {keyword && generatedKeywords.length === 0 && !isGenerating && (
        <Card className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Aucune suggestion disponible</h3>
          <p className="text-gray-500 mb-4">Générez des suggestions pour obtenir des recommendations de title et meta description.</p>
          <Button onClick={generateSuggestions} disabled={isGenerating}>
            Générer des suggestions
          </Button>
        </Card>
      )}
    </div>
  );
};

export default KeywordTabContent;
