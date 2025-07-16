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
    { id: 'sport', name: 'Sport & Fitness', icon: '⚽', color: 'bg-green-600' },
    { id: 'peche', name: 'Pêche', icon: '🎣', color: 'bg-teal-500' },
    { id: 'aquariophilie', name: 'Aquariophilie', icon: '🐠', color: 'bg-blue-600' }
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

    setIsGenerating(true);
    
    try {
      // Utiliser les templates selon la thématique
      const templates = titleTemplates[selectedThematic] || titleTemplates.technologie;
      
      // Fonction pour générer le slug (raccourci)
      const generateSlug = (title: string, keyword: string) => {
        // Créer un slug plus court basé sur le mot-clé principal et quelques mots-clés du titre
        const titleWords = title
          .toLowerCase()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[çc]/g, 'c')
          .replace(/[^a-z0-9\s-]/g, '')
          .split(' ')
          .filter(word => word.length > 2)
          .slice(0, 4); // Prendre seulement les 4 premiers mots significatifs
        
        return [keyword.toLowerCase().replace(/\s+/g, '-'), ...titleWords]
          .join('-')
          .replace(/-+/g, '-')
          .substring(0, 50); // Limiter à 50 caractères maximum
      };

      // Fonction pour générer la meta description (155 caractères max)
      const generateMetaDescription = (title: string, thematic: string, keyword: string) => {
        const descriptions = {
          'technologie': `Découvrez ${keyword} et révolutionnez votre approche tech. Guide complet avec conseils d'experts pour optimiser vos résultats.`,
          'sante': `Tout sur ${keyword} pour améliorer votre santé. Conseils médicaux validés et solutions naturelles efficaces à appliquer.`,
          'finance': `Investir dans ${keyword} en 2024 : stratégies gagnantes, conseils d'experts et analyses de marché pour maximiser vos gains.`,
          'marketing': `Boostez votre marketing avec ${keyword}. Stratégies éprouvées pour augmenter vos conversions et multiplier votre ROI.`,
          'lifestyle': `${keyword} tendance 2024 : guide complet pour adopter le style parfait. Conseils d'experts et inspirations mode.`,
          'education': `Maîtrisez ${keyword} rapidement avec notre formation complète. Méthodes éprouvées et ressources gratuites incluses.`,
          'voyage': `Voyager à ${keyword} : guide complet avec conseils pratiques, bons plans et destinations incontournables à découvrir.`,
          'cuisine': `Recettes ${keyword} authentiques et modernes. Techniques de chef et secrets culinaires révélés par les experts.`,
          'immobilier': `Investissement ${keyword} 2024 : analyse de marché, conseils d'experts et opportunités rentables à saisir maintenant.`,
          'sport': `Programme ${keyword} efficace : techniques d'experts, nutrition optimale et résultats garantis en quelques semaines.`
        };
        
        const baseDesc = descriptions[thematic] || `Découvrez tout sur ${keyword} avec notre guide complet. Conseils d'experts et solutions pratiques.`;
        return baseDesc.substring(0, 155); // Limiter à 155 caractères
      };

      // Fonction pour générer le title tag (60 caractères max)
      const generateTitleTag = (title: string, keyword: string) => {
        if (title.length <= 60) return title;
        
        // Si trop long, créer une version plus courte en gardant le mot-clé
        const shortTitle = `${keyword} : Guide Complet 2024`;
        return shortTitle.length <= 60 ? shortTitle : keyword.substring(0, 57) + '...';
      };

      // Générer des variantes avec le mot-clé
      const generatedVariants = templates.map((template, index) => {
        const title = template.replace(/{keyword}/g, keyword);
        const selectedThematicData = thematics.find(t => t.id === selectedThematic);
        
        return {
          id: index + 1,
          title: title,
          titleTag: generateTitleTag(title, keyword),
          metaDescription: generateMetaDescription(title, selectedThematic, keyword),
          keyword: keyword,
          category: selectedThematicData?.name || 'Général',
          slug: generateSlug(title, keyword),
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
          titleTag: `${keyword} 2024 : Nouveautés et Évolutions`,
          metaDescription: `Découvrez les dernières évolutions de ${keyword} en 2024. Tendances, innovations et prédictions d'experts.`,
          keyword: keyword,
          category: thematics.find(t => t.id === selectedThematic)?.name || 'Général',
          slug: generateSlug(`${keyword} 2024 nouveautes evolutions`, keyword),
          searchVolume: Math.floor(Math.random() * 5000) + 1000,
          difficulty: Math.floor(Math.random() * 80) + 20,
          ctr: (Math.random() * 12 + 3).toFixed(1),
          type: 'Actualité',
          angle: 'Prédiction'
        },
        {
          id: 7,
          title: `${keyword} : Erreurs fatales que 90% font`,
          titleTag: `${keyword} : Top 10 Erreurs à Éviter Absolument`,
          metaDescription: `Évitez les erreurs courantes avec ${keyword}. Guide pratique pour optimiser vos résultats et éviter les pièges.`,
          keyword: keyword,
          category: thematics.find(t => t.id === selectedThematic)?.name || 'Général',
          slug: generateSlug(`${keyword} erreurs fatales eviter`, keyword),
          searchVolume: Math.floor(Math.random() * 8000) + 500,
          difficulty: Math.floor(Math.random() * 70) + 15,
          ctr: (Math.random() * 18 + 5).toFixed(1),
          type: 'Problème/Solution',
          angle: 'Erreurs'
        },
        {
          id: 8,
          title: `Avis ${keyword} : Test complet et honnête`,
          titleTag: `Avis ${keyword} 2024 : Test Complet et Objectif`,
          metaDescription: `Test complet de ${keyword} : avantages, inconvénients et recommandations d'experts. Avis objectif et détaillé.`,
          keyword: keyword,
          category: thematics.find(t => t.id === selectedThematic)?.name || 'Général',
          slug: generateSlug(`avis ${keyword} test complet honnete`, keyword),
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

  const generateImagePrompts = (titleData: any) => {
    const imagePrompts = [
      {
        prompt: `Photo professionnelle haute résolution montrant ${titleData.keyword} en action, style moderne et épuré, éclairage naturel, composition équilibrée, arrière-plan flou`,
        alt: `Image professionnelle illustrant ${titleData.keyword} - Guide complet ${new Date().getFullYear()}`
      },
      {
        prompt: `Infographie moderne et colorée expliquant les concepts clés de ${titleData.keyword}, design flat, icônes vectorielles, palette de couleurs harmonieuse, typographie lisible`,
        alt: `Infographie explicative sur ${titleData.keyword} - Conseils et bonnes pratiques`
      }
    ];

    const promptText = `# Prompts pour Images SEO - ${titleData.title}

## 🖼️ Image 1 - Photo principale
**Prompt :** ${imagePrompts[0].prompt}
**Balise Alt :** ${imagePrompts[0].alt}
**Utilisation :** Image d'en-tête de l'article

## 🖼️ Image 2 - Infographie
**Prompt :** ${imagePrompts[1].prompt}
**Balise Alt :** ${imagePrompts[1].alt}
**Utilisation :** Support visuel dans le contenu

## 📋 Instructions techniques
- **Format recommandé :** JPG pour les photos, PNG pour les infographies
- **Dimensions :** 1200x630px (ratio 1.91:1) pour un partage social optimal
- **Poids :** Maximum 200KB après compression
- **Nom de fichier :** ${titleData.slug}-image-1.jpg / ${titleData.slug}-infographie.png

## 🔍 Optimisation SEO des images
- Utilisez les balises alt fournies pour améliorer l'accessibilité
- Intégrez le mot-clé "${titleData.keyword}" dans le nom du fichier
- Ajoutez un titre descriptif à vos images
- Compressez vos images pour améliorer la vitesse de chargement

## 💡 Conseils de création
- Assurez-vous que les images sont en haute résolution
- Utilisez des couleurs cohérentes avec votre charte graphique
- Vérifiez que le texte sur les infographies reste lisible sur mobile
- Testez vos images sur différents appareils`;

    navigator.clipboard.writeText(promptText);
    toast.success('Prompts d\'images copiés dans le presse-papiers !');
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

                        {/* Éléments SEO */}
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-gray-900 mb-3">🔍 Éléments SEO :</h4>
                          <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="font-medium text-gray-700">Balise Title :</label>
                                <div className="mt-1 p-2 bg-white rounded border text-gray-800">
                                  {titleData.titleTag}
                                </div>
                              </div>
                              <div>
                                <label className="font-medium text-gray-700">Mot-clé principal :</label>
                                <div className="mt-1 p-2 bg-white rounded border text-gray-800">
                                  {titleData.keyword}
                                </div>
                              </div>
                              <div>
                                <label className="font-medium text-gray-700">Catégorie :</label>
                                <div className="mt-1 p-2 bg-white rounded border text-gray-800">
                                  {titleData.category}
                                </div>
                              </div>
                              <div>
                                <label className="font-medium text-gray-700">Slug URL :</label>
                                <div className="mt-1 p-2 bg-white rounded border text-gray-800 font-mono text-xs">
                                  {titleData.slug}
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="font-medium text-gray-700">Meta Description :</label>
                              <div className="mt-1 p-2 bg-white rounded border text-gray-800">
                                {titleData.metaDescription}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Proposition d'article */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">📝 Proposition d'article :</h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <p><strong>Introduction :</strong> Contextualiser le sujet avec des statistiques actuelles sur {titleData.keyword}.</p>
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
                          variant="outline"
                          size="sm"
                          onClick={() => generateImagePrompts(titleData)}
                          className="bg-orange-50 hover:bg-orange-100 text-orange-700"
                        >
                          🖼️
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            const articleOutline = `=== ARTICLE SEO COMPLET ===

TITRE H1: ${titleData.title}
BALISE TITLE: ${titleData.titleTag}
META DESCRIPTION: ${titleData.metaDescription}
MOT-CLÉ PRINCIPAL: ${titleData.keyword}
CATÉGORIE: ${titleData.category}
SLUG URL: ${titleData.slug}

=== STRUCTURE D'ARTICLE ===

1. Introduction (150 mots)
   - Hook avec statistique sur ${titleData.keyword}
   - Problématique principale
   - Annonce du plan

2. Contexte et enjeux actuels (300 mots)
   - État du marché ${titleData.keyword}
   - Défis rencontrés
   - Opportunités

3. Solutions pratiques (400 mots)
   - Méthodes éprouvées
   - Étapes détaillées
   - Conseils d'experts

4. Exemples concrets (300 mots)
   - Études de cas
   - Témoignages
   - Résultats chiffrés

5. FAQ (200 mots)
   - 5-8 questions fréquentes
   - Réponses complètes

6. Conclusion avec CTA (100 mots)
   - Récapitulatif des points clés
   - Appel à l'action

=== SEO INFO ===
Volume de recherche: ${titleData.searchVolume.toLocaleString()}/mois
Difficulté: ${titleData.difficulty}/100
CTR estimé: ${titleData.ctr}%
Type de contenu: ${titleData.type}
Angle: ${titleData.angle}`;
                            navigator.clipboard.writeText(articleOutline);
                            toast.success('Plan d\'article SEO complet copié !');
                          }}
                        >
                          📋 Plan SEO
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const promptMarkdown = `# Prompt de Génération d'Article SEO

## Informations SEO de base
- **Titre H1** : ${titleData.title}
- **Title Tag** : ${titleData.titleTag}
- **Meta Description** : ${titleData.metaDescription}
- **Mot-clé principal** : ${titleData.keyword}
- **Catégorie** : ${titleData.category}
- **Slug URL** : ${titleData.slug}
- **Volume de recherche** : ${titleData.searchVolume.toLocaleString()}/mois
- **Difficulté SEO** : ${titleData.difficulty}/100
- **Type de contenu** : ${titleData.type}

## Instructions de rédaction

### Objectif principal
Créer un article SEO optimisé de 1500-2000 mots sur le sujet "${titleData.title}" qui se positionne dans les premiers résultats Google pour le mot-clé "${titleData.keyword}".

### Ton et style
- **Ton** : ${selectedThematic === 'technologie' ? 'Expert et accessible' : selectedThematic === 'sante' ? 'Professionnel et rassurant' : selectedThematic === 'finance' ? 'Technique et fiable' : selectedThematic === 'marketing' ? 'Dynamique et orienté résultats' : selectedThematic === 'lifestyle' ? 'Inspirant et moderne' : selectedThematic === 'education' ? 'Pédagogique et encourageant' : selectedThematic === 'voyage' ? 'Enthousiaste et informatif' : selectedThematic === 'cuisine' ? 'Chaleureux et passionné' : selectedThematic === 'immobilier' ? 'Professionnel et conseil' : 'Motivant et technique'}
- **Public cible** : ${selectedThematic === 'technologie' ? 'Professionnels et passionnés de tech' : selectedThematic === 'sante' ? 'Personnes soucieuses de leur bien-être' : selectedThematic === 'finance' ? 'Investisseurs et épargnants' : selectedThematic === 'marketing' ? 'Entrepreneurs et marketeurs' : selectedThematic === 'lifestyle' ? 'Lecteurs intéressés par les tendances' : selectedThematic === 'education' ? 'Apprenants et professionnels en formation' : selectedThematic === 'voyage' ? 'Voyageurs et passionnés de découverte' : selectedThematic === 'cuisine' ? 'Amateurs de cuisine et gastronomes' : selectedThematic === 'immobilier' ? 'Investisseurs et futurs propriétaires' : 'Pratiquants et passionnés de sport'}

### Structure détaillée

#### 1. Introduction (150-200 mots)
- **Hook accrocheur** : Commencer par une statistique surprenante ou une question qui interpelle
- **Problématique** : Identifier le problème ou besoin principal lié à "${titleData.keyword}"
- **Promesse de valeur** : Expliquer ce que le lecteur va apprendre
- **Plan de l'article** : Annoncer les sections principales
- **Intégration du mot-clé** : Utiliser "${titleData.keyword}" naturellement dans les 100 premiers mots

#### 2. Contexte et enjeux (300-400 mots)
- **État actuel** : Panorama du marché/secteur de "${titleData.keyword}"
- **Tendances 2024** : Évolutions récentes et futures
- **Défis principaux** : Obstacles que rencontrent les utilisateurs
- **Opportunités** : Potentiel et bénéfices à saisir
- **Données chiffrées** : Statistiques récentes et sources fiables

#### 3. Solutions pratiques (400-500 mots)
- **Méthode principale** : Approche recommandée pour "${titleData.keyword}"
- **Étapes détaillées** : Guide pas-à-pas avec actions concrètes
- **Conseils d'experts** : Bonnes pratiques et recommandations
- **Outils recommandés** : Ressources utiles et logiciels
- **Erreurs à éviter** : Pièges courants et comment les contourner

#### 4. Exemples et études de cas (300-400 mots)
- **Cas pratique 1** : Exemple concret d'application réussie
- **Cas pratique 2** : Situation différente avec résultats mesurables
- **Témoignages** : Retours d'expérience authentiques
- **Résultats chiffrés** : ROI, économies, gains de temps, etc.
- **Leçons apprises** : Enseignements clés à retenir

#### 5. FAQ (200-250 mots)
Répondre aux 6-8 questions les plus fréquentes sur "${titleData.keyword}" :
- Questions débutants (2-3 questions)
- Questions techniques (2-3 questions)
- Questions sur les coûts/prix (1-2 questions)
- Questions sur les résultats/délais (1-2 questions)

#### 6. Conclusion et appel à l'action (100-150 mots)
- **Récapitulatif** : Points clés essentiels à retenir
- **Prochaines étapes** : Actions concrètes pour le lecteur
- **CTA principal** : Invitation claire et motivante
- **Ressources bonus** : Liens vers contenus complémentaires

### Optimisations SEO obligatoires

#### Mots-clés
- **Principal** : "${titleData.keyword}" (densité 1-2%, variations naturelles)
- **Secondaires** : Intégrer 5-7 mots-clés sémantiquement liés
- **Longue traîne** : Questions et expressions naturelles des utilisateurs

#### Structure technique
- **Balises H2-H6** : Hiérarchie claire avec mots-clés
- **Méta-données** : Title et description fournis ci-dessus
- **Liens internes** : 3-5 liens vers contenus connexes
- **Liens externes** : 2-3 liens vers sources authorités

#### Expérience utilisateur
- **Lisibilité** : Phrases courtes, paragraphes aérés
- **Éléments visuels** : Suggestions pour images/infographies
- **Temps de lecture** : 8-12 minutes (optimal pour l'engagement)
- **Call-to-action** : Boutons et liens clairs

### Éléments de crédibilité
- **Sources fiables** : Citer études, recherches, experts reconnus
- **Données récentes** : Informations de 2024 ou très récentes
- **Expertise** : Démontrer une connaissance approfondie du sujet
- **Transparence** : Mentionner limites et nuances quand approprié

### Checklist finale
- [ ] Mot-clé principal dans le titre H1
- [ ] Meta description attractive et informative
- [ ] Structure H2-H6 optimisée
- [ ] Densité de mots-clés appropriée
- [ ] Liens internes et externes pertinents
- [ ] Appel à l'action clair
- [ ] Contenu unique et de valeur
- [ ] Lisibilité optimale
- [ ] Sources et données vérifiées

**Longueur cible** : 1500-2000 mots
**Objectif de positionnement** : Top 3 Google pour "${titleData.keyword}"
**Public** : ${selectedThematic === 'technologie' ? 'Professionnels et passionnés de technologie' : selectedThematic === 'sante' ? 'Personnes intéressées par leur santé et bien-être' : selectedThematic === 'finance' ? 'Investisseurs, épargnants et professionnels financiers' : selectedThematic === 'marketing' ? 'Entrepreneurs, marketeurs et dirigeants' : selectedThematic === 'lifestyle' ? 'Lecteurs intéressés par les tendances lifestyle' : selectedThematic === 'education' ? 'Apprenants, formateurs et professionnels en développement' : selectedThematic === 'voyage' ? 'Voyageurs, touristes et passionnés de découverte' : selectedThematic === 'cuisine' ? 'Amateurs de cuisine, chefs et gourmets' : selectedThematic === 'immobilier' ? 'Investisseurs immobiliers et futurs propriétaires' : 'Sportifs, coachs et passionnés de fitness'}`;

                            navigator.clipboard.writeText(promptMarkdown);
                            toast.success('Prompt markdown complet copié !');
                          }}
                        >
                          📝 Prompt
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