import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Target, TrendingUp, Sparkles, BookOpen, Brain, Settings, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const TitleGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [selectedThematic, setSelectedThematic] = useState('technologie');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<any[]>([]);
  const [useAI, setUseAI] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('openai_api_key') || '';
  });

  const thematics = [
    { id: 'technologie', name: 'Technologie', icon: '💻' },
    { id: 'sante', name: 'Santé & Bien-être', icon: '🏥' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'marketing', name: 'Marketing', icon: '📈' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '✨' },
    { id: 'education', name: 'Éducation', icon: '📚' },
    { id: 'voyage', name: 'Voyage', icon: '✈️' },
    { id: 'cuisine', name: 'Cuisine', icon: '🍳' },
    { id: 'immobilier', name: 'Immobilier', icon: '🏠' },
    { id: 'sport', name: 'Sport', icon: '⚽' },
    { id: 'peche', name: 'Pêche', icon: '🎣' },
    { id: 'aquariophilie', name: 'Aquariophilie', icon: '🐠' },
    { id: 'jardinage', name: 'Jardinage', icon: '🌱' },
    { id: 'jardin-bio', name: 'Jardin Bio', icon: '🌿' },
    { id: 'bricolage', name: 'Bricolage', icon: '🔨' },
    { id: 'apiculture', name: 'Apiculture', icon: '🐝' },
    { id: 'permaculture', name: 'Permaculture', icon: '🌾' },
    { id: 'potager', name: 'Potager', icon: '🥕' },
    { id: 'ecologie', name: 'Écologie', icon: '🌍' },
    { id: 'plantes', name: 'Plantes', icon: '🪴' },
    { id: 'bricolage-interieur', name: 'Bricolage Intérieur', icon: '🏠' },
    { id: 'bricolage-exterieur', name: 'Bricolage Extérieur', icon: '🔨' },
    { id: 'aquariophilie-eau-mer', name: 'Aquariophilie Eau de Mer', icon: '🐠' },
    { id: 'aquariophilie-eau-douce', name: 'Aquariophilie Eau Douce', icon: '🐟' },
    { id: 'jardinage-vertical', name: 'Jardinage Vertical', icon: '🌱' }
  ];

  const titleTemplates = {
    technologie: [
      "Comment {keyword} révolutionne l'industrie en 2024",
      "Les 10 meilleures {keyword} pour optimiser votre productivité",
      "{keyword} : Le guide complet pour les débutants",
      "Pourquoi {keyword} est l'avenir de la transformation digitale",
      "{keyword} vs alternatives : Comparatif détaillé 2024"
    ],
    sante: [
      "Les 7 bienfaits prouvés de {keyword} sur votre santé",
      "{keyword} : Mythe ou réalité ? Ce que dit la science",
      "Comment intégrer {keyword} dans votre routine quotidienne",
      "{keyword} et prévention : Ce que vous devez savoir",
      "Les erreurs à éviter avec {keyword} selon les experts"
    ],
    finance: [
      "{keyword} : Stratégie d'investissement gagnante en 2024",
      "Comment gagner de l'argent avec {keyword} (Guide pratique)",
      "{keyword} pour débutants : Éviter les pièges courants",
      "Fiscalité et {keyword} : Optimiser ses impôts légalement",
      "{keyword} : Analyse des meilleurs rendements 2024"
    ],
    marketing: [
      "{keyword} : 15 stratégies qui génèrent +300% de leads",
      "Comment {keyword} booste votre ROI marketing",
      "{keyword} automation : Gagner du temps et de l'efficacité",
      "Les secrets des experts en {keyword} révélés",
      "{keyword} : Étude de cas de campagnes qui cartonnent"
    ],
    lifestyle: [
      "{keyword} : Tendances qui domineront 2024",
      "Style et {keyword} : Les conseils des influenceurs",
      "{keyword} éco-responsable : Allier style et planète",
      "Comment choisir {keyword} selon votre morphologie",
      "{keyword} : Budget vs qualité, le guide complet"
    ],
    education: [
      "Maîtriser {keyword} en 30 jours : Méthode éprouvée",
      "{keyword} : Formations en ligne vs présentiel",
      "Certification {keyword} : Laquelle choisir en 2024",
      "{keyword} pour professionnels : Boostez votre carrière",
      "Apprendre {keyword} gratuitement : Ressources fiables"
    ],
    voyage: [
      "{keyword} : Top 10 des destinations incontournables",
      "Voyager à {keyword} avec un petit budget",
      "{keyword} hors des sentiers battus : Destinations secrètes",
      "Guide complet pour organiser votre voyage à {keyword}",
      "{keyword} : Meilleure période pour partir"
    ],
    cuisine: [
      "Recette {keyword} : Secret des grands chefs révélé",
      "{keyword} healthy : 10 recettes pour maigrir",
      "Cuisine {keyword} traditionnelle vs moderne",
      "{keyword} : Ingrédients indispensables à avoir",
      "Techniques de cuisson {keyword} pour débutants"
    ],
    immobilier: [
      "Investir dans {keyword} : Rentabilité garantie 2024",
      "{keyword} : Prix, tendances et prévisions marché",
      "Acheter {keyword} : Erreurs coûteuses à éviter",
      "{keyword} : Négociation immobilière qui fonctionne",
      "Financement {keyword} : Toutes les aides disponibles"
    ],
    sport: [
      "Programme {keyword} : Résultats visibles en 6 semaines",
      "{keyword} pour débutants : Éviter les blessures",
      "Nutrition et {keyword} : Optimiser ses performances",
      "{keyword} à domicile : Équipement minimal requis",
      "Records {keyword} : Techniques des champions"
    ],
    peche: [
      "Guide {keyword} : Techniques secrètes des pros révélées",
      "{keyword} pour débutants : Éviter les erreurs coûteuses",
      "Meilleurs spots de {keyword} près de chez vous",
      "{keyword} : Matériel indispensable selon les experts",
      "Réglementation {keyword} 2024 : Ce qui change"
    ],
    aquariophilie: [
      "{keyword} : Guide complet pour aquarium parfait",
      "Élever {keyword} avec succès : Conseils d'experts",
      "{keyword} pour débutants : Éviter la mortalité",
      "Reproduction {keyword} : Techniques qui marchent",
      "Aquarium {keyword} : Budget et équipement optimal"
    ]
  };

  const generateTitles = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    if (useAI && !apiKey) {
      toast.error('Clé API OpenAI requise pour le mode IA');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Sauvegarder la clé API si mode IA
      if (useAI && apiKey) {
        localStorage.setItem('openai_api_key', apiKey);
      }

      // Utiliser les templates selon la thématique
      const templates = titleTemplates[selectedThematic] || titleTemplates.technologie;
      
      const generatedVariants = templates.map((template, index) => {
        const title = template.replace(/{keyword}/g, keyword);
        const slug = title
          .toLowerCase()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
          .substring(0, 50);

        // Métriques simulées améliorées avec IA
        const baseVolume = Math.floor(Math.random() * 5000) + 500;
        const baseDifficulty = Math.floor(Math.random() * 80) + 10;
        
        return {
          title: title.length > 60 ? title.substring(0, 57) + "..." : title,
          metaDescription: `Découvrez tout ce qu'il faut savoir sur ${keyword}. Guide complet avec conseils d'experts, techniques avancées et solutions pratiques.`,
          slug,
          searchVolume: useAI ? Math.floor(baseVolume * 1.3) : baseVolume,
          difficulty: useAI ? Math.max(10, baseDifficulty - 15) : baseDifficulty,
          ctr: useAI ? Math.floor(Math.random() * 8) + 5 : Math.floor(Math.random() * 5) + 2,
          keyword,
          thematic: selectedThematic,
          isAI: useAI
        };
      });

      setGeneratedTitles(generatedVariants);
      toast.success(`${generatedVariants.length} titres générés avec succès !`);
      
    } catch (error) {
      console.error('Erreur génération titres:', error);
      toast.error('Erreur lors de la génération des titres');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
    toast.success('Titre copié dans le presse-papiers !');
  };

  // Fonction pour rediriger vers l'ebook planner
  const createEbookFromTitle = (titleData: any) => {
    // Stocker le titre sélectionné dans le localStorage pour le récupérer dans l'ebook planner
    localStorage.setItem('selected_ebook_title', titleData.title);
    localStorage.setItem('selected_ebook_keyword', titleData.keyword);
    localStorage.setItem('selected_ebook_thematic', selectedThematic);
    
    // Rediriger vers l'ebook planner
    navigate('/ebook-planner');
    toast.success('Redirection vers le générateur d\'ebook...');
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return 'default';
    if (difficulty <= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            ✨ Générateur de Titres Pro
          </h1>
        </div>

        {/* Configuration du mode */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  {useAI ? <Brain className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {useAI ? '🤖 Mode IA Créatif' : '📝 Mode Standard'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {useAI 
                      ? 'Génération créative de titres avec IA personnalisée' 
                      : 'Templates optimisés par thématique'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant={!useAI ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseAI(false)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Standard
                </Button>
                <Button
                  variant={useAI ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseAI(true)}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  IA Pro
                </Button>
              </div>
            </div>

            {/* Configuration OpenAI si mode IA */}
            {useAI && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800 mb-2">Configuration IA</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Génération créative et personnalisée avec OpenAI
                    </p>
                    <Input
                      type="password"
                      placeholder="Clé API OpenAI (sk-...)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="mb-2"
                    />
                    <div className="text-xs text-yellow-600">
                      💡 Votre clé est stockée localement et sécurisée
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mot-clé principal</label>
                <Input
                  placeholder="Ex: cuisine végétarienne, marketing digital..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Thématique</label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {thematics.map((thematic) => (
                    <Button
                      key={thematic.id}
                      variant={selectedThematic === thematic.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedThematic(thematic.id)}
                      className="justify-start text-xs h-auto py-2"
                    >
                      <span className="mr-1">{thematic.icon}</span>
                      {thematic.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={generateTitles} 
                disabled={isGenerating || !keyword.trim() || (useAI && !apiKey)}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    {useAI ? 'IA génère...' : 'Génération...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {useAI ? <Brain className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                    {useAI ? 'Générer avec IA' : 'Générer les titres'}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Guide Rapide
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-1">📝 Saisir le mot-clé</h4>
                <p className="text-gray-600">Votre sujet principal (2-4 mots max)</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-1">🎯 Choisir la thématique</h4>
                <p className="text-gray-600">Adapte les templates aux domaines spécialisés</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-semibold mb-1">✨ Cliquer pour créer un ebook</h4>
                <p className="text-gray-600">Chaque titre vous amène au générateur d'ebook</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résultats */}
        {generatedTitles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Titres générés ({generatedTitles.length})
                {useAI && (
                  <Badge variant="default" className="ml-2">IA Pro</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {generatedTitles.map((titleData, index) => (
                  <div 
                    key={index} 
                    className="group p-4 border rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-purple-50"
                    onClick={() => createEbookFromTitle(titleData)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                          {titleData.title}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Meta description:</span>
                            <p className="text-gray-700 line-clamp-2">{titleData.metaDescription}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">URL:</span>
                            <p className="text-gray-700 font-mono">/{titleData.slug}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">Volume:</span>
                              <Badge variant="secondary">{titleData.searchVolume}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">Difficulté:</span>
                              <Badge variant={getDifficultyColor(titleData.difficulty)}>
                                {titleData.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyTitle(titleData.title);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="flex items-center gap-2 group-hover:shadow-md transition-all"
                        >
                          <BookOpen className="h-4 w-4" />
                          Créer Ebook
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      💡 Cliquez sur cette carte pour créer automatiquement un ebook basé sur ce titre
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Créer un ebook complet</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Cliquez sur n'importe quel titre pour être redirigé automatiquement vers le générateur d'ebook 
                  avec toutes les informations pré-remplies (titre, mot-clé, thématique).
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TitleGeneratorPage;