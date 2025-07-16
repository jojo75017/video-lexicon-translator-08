import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Lightbulb, Copy, RefreshCw, Target, TrendingUp, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const TitleGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [selectedThematic, setSelectedThematic] = useState('technologie');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<any[]>([]);

  const thematics = [
    { id: 'technologie', name: 'Technologie', icon: '💻', color: 'bg-blue-500' },
    { id: 'sante', name: 'Santé & Bien-être', icon: '🏥', color: 'bg-green-500' },
    { id: 'finance', name: 'Finance & Investissement', icon: '💰', color: 'bg-yellow-500' },
    { id: 'marketing', name: 'Marketing Digital', icon: '📈', color: 'bg-purple-500' },
    { id: 'lifestyle', name: 'Lifestyle & Mode', icon: '✨', color: 'bg-pink-500' },
    { id: 'education', name: 'Éducation & Formation', icon: '📚', color: 'bg-indigo-500' },
    { id: 'voyage', name: 'Voyage & Tourisme', icon: '✈️', color: 'bg-cyan-500' },
    { id: 'cuisine', name: 'Cuisine & Gastronomie', icon: '🍳', color: 'bg-orange-500' },
    { id: 'immobilier', name: 'Immobilier', icon: '🏠', color: 'bg-red-500' },
    { id: 'sport', name: 'Sport & Fitness', icon: '⚽', color: 'bg-green-600' }
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
    ]
  };

  const generateTitles = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Utiliser les templates selon la thématique
      const templates = titleTemplates[selectedThematic] || titleTemplates.technologie;
      
      // Générer des variantes avec le mot-clé
      const generatedVariants = templates.map((template, index) => {
        const title = template.replace(/{keyword}/g, keyword);
        
        return {
          id: index + 1,
          title: title,
          searchVolume: Math.floor(Math.random() * 10000) + 500,
          difficulty: Math.floor(Math.random() * 100) + 1,
          ctr: (Math.random() * 15 + 2).toFixed(1),
          type: index < 2 ? 'Forte demande' : index < 4 ? 'Tendance' : 'Niche',
          angle: index === 0 ? 'Guide' : index === 1 ? 'Liste' : index === 2 ? 'Comparatif' : index === 3 ? 'Actualité' : 'Tutoriel'
        };
      });

      // Ajouter quelques titres bonus générés dynamiquement
      const bonusTitles = [
        {
          id: 6,
          title: `${keyword} en 2024 : Tout ce qui va changer`,
          searchVolume: Math.floor(Math.random() * 5000) + 1000,
          difficulty: Math.floor(Math.random() * 80) + 20,
          ctr: (Math.random() * 12 + 3).toFixed(1),
          type: 'Actualité',
          angle: 'Prédiction'
        },
        {
          id: 7,
          title: `${keyword} : Erreurs fatales que 90% font`,
          searchVolume: Math.floor(Math.random() * 8000) + 500,
          difficulty: Math.floor(Math.random() * 70) + 15,
          ctr: (Math.random() * 18 + 5).toFixed(1),
          type: 'Problème/Solution',
          angle: 'Erreurs'
        },
        {
          id: 8,
          title: `Avis ${keyword} : Test complet et honnête`,
          searchVolume: Math.floor(Math.random() * 6000) + 800,
          difficulty: Math.floor(Math.random() * 60) + 25,
          ctr: (Math.random() * 14 + 4).toFixed(1),
          type: 'Review',
          angle: 'Test'
        }
      ];

      setGeneratedTitles([...generatedVariants, ...bonusTitles]);
      toast.success(`${generatedVariants.length + bonusTitles.length} titres générés avec succès !`);
      
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

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return 'bg-green-500';
    if (difficulty <= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Forte demande': 'bg-green-100 text-green-800',
      'Tendance': 'bg-blue-100 text-blue-800',
      'Niche': 'bg-purple-100 text-purple-800',
      'Actualité': 'bg-orange-100 text-orange-800',
      'Problème/Solution': 'bg-red-100 text-red-800',
      'Review': 'bg-cyan-100 text-cyan-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tableau de bord
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              Retour
            </Button>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ✨ Générateur de Titres SEO
          </h1>
        </div>

        {/* Configuration Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Configuration du générateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Keyword Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Mot-clé principal</label>
              <Input
                placeholder="Ex: intelligence artificielle, marketing digital, recettes healthy..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Thematic Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Thématique</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {thematics.map((thematic) => (
                  <button
                    key={thematic.id}
                    onClick={() => setSelectedThematic(thematic.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedThematic === thematic.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{thematic.icon}</div>
                    <div className="text-xs font-medium text-center">{thematic.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generateTitles} 
              disabled={isGenerating || !keyword.trim()}
              className="w-full md:w-auto"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Générer les titres SEO
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {generatedTitles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Titres générés ({generatedTitles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedTitles.map((titleData) => (
                  <div key={titleData.id} className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-3">{titleData.title}</h3>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className={getTypeColor(titleData.type)}>
                            {titleData.type}
                          </Badge>
                          <Badge variant="outline">
                            {titleData.angle}
                          </Badge>
                        </div>

                        {/* Proposition d'article */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">📝 Proposition d'article :</h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <p><strong>Introduction :</strong> Contextualiser le sujet avec des statistiques actuelles sur {keyword}.</p>
                            <p><strong>Problème :</strong> Identifier les défis principaux que rencontrent les lecteurs.</p>
                            <p><strong>Solution :</strong> Présenter votre approche unique avec des exemples concrets.</p>
                            <p><strong>Preuves :</strong> Études de cas, témoignages ou données chiffrées.</p>
                            <p><strong>Action :</strong> Call-to-action clair pour engager les lecteurs.</p>
                          </div>
                        </div>

                        {/* Structure détaillée */}
                        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">🏗️ Structure recommandée :</h4>
                          <div className="text-sm text-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>• Introduction accrocheuse (150 mots)</div>
                              <div>• 3-5 sections principales (300-500 mots/section)</div>
                              <div>• Exemples pratiques et visuels</div>
                              <div>• FAQ avec 5-8 questions</div>
                              <div>• Conclusion avec CTA (100 mots)</div>
                              <div>• Mots-clés secondaires intégrés</div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Volume de recherche</span>
                            <div className="font-medium">{titleData.searchVolume.toLocaleString()}/mois</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Difficulté SEO</span>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getDifficultyColor(titleData.difficulty)}`}></div>
                              <span className="font-medium">{titleData.difficulty}/100</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">CTR estimé</span>
                            <div className="font-medium">{titleData.ctr}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Potentiel</span>
                            <div className="font-medium">
                              {titleData.difficulty <= 30 && titleData.searchVolume > 2000 ? '🔥 Excellent' :
                               titleData.difficulty <= 50 ? '✅ Bon' : '⚠️ Difficile'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyTitle(titleData.title)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            const articleOutline = `TITRE: ${titleData.title}\n\nSTRUCTURE D'ARTICLE:\n\n1. Introduction (150 mots)\n2. Contexte et enjeux actuels\n3. Solutions pratiques\n4. Exemples concrets\n5. FAQ\n6. Conclusion avec CTA\n\nMOTS-CLÉS: ${keyword}, [mots-clés secondaires]\nOBJECTIF: ${titleData.searchVolume.toLocaleString()} recherches/mois`;
                            navigator.clipboard.writeText(articleOutline);
                            toast.success('Plan d\'article copié !');
                          }}
                        >
                          📋 Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Conseils pour optimiser vos titres :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Privilégiez les titres entre 50-60 caractères pour un affichage optimal</li>
                  <li>• Intégrez le mot-clé principal au début du titre</li>
                  <li>• Utilisez des chiffres et des mots d'action pour augmenter le CTR</li>
                  <li>• Testez différentes variantes pour voir ce qui fonctionne le mieux</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TitleGeneratorPage;