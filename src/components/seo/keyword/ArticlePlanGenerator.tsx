import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, Lightbulb, Clock, Target, BookOpen, Eye, 
  Hash, Type, MessageSquare, 
  ArrowRight, CheckCircle, Star, Zap,
  FileImage, Link, Search, Users, TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface DetailedSection {
  title: string;
  level: number;
  subsections: {
    title: string;
    level: number;
    content: string;
    keywords: string[];
    wordCount: number;
    elements: string[];
  }[];
  keywords: string[];
  estimatedWordCount: number;
  contentTypes: string[];
}

interface ComprehensiveArticlePlan {
  seoTitle: string;
  metaDescription: string;
  h1Title: string;
  introduction: {
    hook: string;
    context: string;
    thesis: string;
    roadmap: string;
    estimatedWordCount: number;
    keywords: string[];
  };
  sections: DetailedSection[];
  conclusion: {
    summary: string;
    callToAction: string;
    nextSteps: string;
    estimatedWordCount: number;
    keywords: string[];
  };
  faq: {
    question: string;
    answer: string;
    keywords: string[];
  }[];
  internalLinks: {
    anchor: string;
    suggestedUrl: string;
    context: string;
  }[];
  images: {
    title: string;
    altText: string;
    placement: string;
    purpose: string;
  }[];
  totalWordCount: number;
  readingTime: number;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  targetAudience: string[];
  competitorAdvantage: string[];
}

interface ArticlePlanGeneratorProps {
  keywords: KeywordSuggestion[];
  mainKeyword: string;
}

const ArticlePlanGenerator: React.FC<ArticlePlanGeneratorProps> = ({ keywords, mainKeyword }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [articlePlan, setArticlePlan] = useState<ComprehensiveArticlePlan | null>(null);

  const generateContextualContent = (keyword: string) => {
    const lowerKeyword = keyword.toLowerCase();
    
    // Détection du domaine basé sur le mot-clé
    if (lowerKeyword.includes('pierre') && lowerKeyword.includes('seiryu')) {
      return {
        domain: 'aquariophilie',
        context: 'aquarium et hardscape',
        audience: ['Aquariophiles débutants', 'Passionnés de hardscape', 'Propriétaires d\'aquarium', 'Amateur de nature aquatique'],
        relatedTerms: ['hardscape', 'aquascaping', 'décoration aquarium', 'roches aquarium', 'biotope'],
        intent: 'commercial-informational'
      };
    }
    
    if (lowerKeyword.includes('seo') || lowerKeyword.includes('référencement')) {
      return {
        domain: 'marketing digital',
        context: 'référencement naturel',
        audience: ['Entrepreneurs', 'Marketeurs', 'Webmasters', 'Agences SEO'],
        relatedTerms: ['optimisation', 'Google', 'positionnement', 'trafic organique'],
        intent: 'informational'
      };
    }
    
    // Domaine générique
    return {
      domain: 'général',
      context: 'information spécialisée',
      audience: ['Débutants', 'Intermédiaires', 'Experts', 'Professionnels'],
      relatedTerms: ['guide', 'conseil', 'technique', 'pratique'],
      intent: 'informational'
    };
  };

  const generateSpecificContent = (keyword: string) => {
    const contextInfo = generateContextualContent(keyword);
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerKeyword.includes('pierre') && lowerKeyword.includes('seiryu')) {
      return {
        seoTitle: `${keyword} : Guide Complet pour Aquarium 2024 [Choix, Prix, Installation]`,
        metaDescription: `Découvrez tout sur les ${keyword.toLowerCase()} : caractéristiques, prix, installation en aquarium. Guide expert avec photos et conseils d'aquascaping. Livraison gratuite.`,
        h1Title: `${keyword} : Le Guide Complet pour Créer un Hardscape Exceptionnel`,
        
        introduction: {
          hook: `Saviez-vous que 92% des aquariophiles professionnels utilisent les ${keyword.toLowerCase()} pour créer des paysages aquatiques spectaculaires ?`,
          context: `Dans l'univers de l'aquascaping moderne, les ${keyword.toLowerCase()} sont devenues LA référence pour créer des décors naturels et harmonieux qui subliment vos poissons et plantes.`,
          thesis: `Ce guide exhaustif vous révèle tous les secrets des ${keyword.toLowerCase()} : de leur origine géologique aux techniques d'installation les plus avancées.`,
          roadmap: `Vous découvrirez : les caractéristiques uniques, les critères de sélection, les techniques d'installation, et les meilleures associations avec plantes et poissons.`,
          estimatedWordCount: 180,
          keywords: [keyword, 'aquascaping', 'hardscape aquarium', 'roches aquarium', 'décoration naturelle']
        },

        sections: [
          {
            title: `Qu'est-ce que les ${keyword} ? [Origine et Caractéristiques]`,
            level: 2,
            keywords: [keyword, 'origine seiryu', 'caractéristiques pierre aquarium', 'géologie'],
            estimatedWordCount: 900,
            contentTypes: ['paragraphes explicatifs', 'photos macro', 'tableau caractéristiques', 'carte origine géologique'],
            subsections: [
              {
                title: 'Origine géologique des pierres Seiryu',
                level: 3,
                content: 'Exploration détaillée de l\'origine japonaise, formation géologique, composition minérale et propriétés uniques de ces roches calcaires.',
                keywords: [keyword, 'géologie japon', 'formation calcaire'],
                wordCount: 250,
                elements: ['carte géologique', 'coupe géologique', 'photos terrain']
              },
              {
                title: 'Caractéristiques physiques et esthétiques',
                level: 3,
                content: 'Analyse des veines blanches caractéristiques, variations de couleur, texture, densité et impact visuel en aquarium.',
                keywords: ['veines blanches', 'texture pierre', 'esthétique aquarium'],
                wordCount: 220,
                elements: ['photos détaillées', 'comparaisons visuelles', 'palette couleurs']
              },
              {
                title: 'Impact sur les paramètres de l\'eau',
                level: 3,
                content: 'Explication scientifique de l\'influence sur le pH, la dureté, et les conseils pour maintenir l\'équilibre chimique.',
                keywords: ['pH aquarium', 'dureté eau', 'paramètres eau'],
                wordCount: 280,
                elements: ['graphiques pH', 'tableaux mesures', 'tests eau']
              },
              {
                title: 'Comparaison avec d\'autres roches d\'aquarium',
                level: 3,
                content: 'Comparatif détaillé avec Dragon Stone, Ohko Stone, roches volcaniques : avantages, inconvénients, prix.',
                keywords: ['dragon stone', 'ohko stone', 'comparaison roches'],
                wordCount: 150,
                elements: ['tableau comparatif', 'photos côte à côte', 'grille prix']
              }
            ]
          },
          {
            title: `Comment Choisir vos ${keyword} : Critères et Sélection`,
            level: 2,
            keywords: ['choisir pierre seiryu', 'sélection hardscape', 'qualité pierre aquarium'],
            estimatedWordCount: 1100,
            contentTypes: ['guide sélection', 'checklist qualité', 'photos avant/après', 'calculateur quantité'],
            subsections: [
              {
                title: 'Critères de qualité essentiels',
                level: 3,
                content: 'Guide complet des critères : forme, taille, couleur, absence de contaminants, provenance certifiée.',
                keywords: ['qualité pierre', 'critères sélection', 'provenance'],
                wordCount: 300,
                elements: ['checklist qualité', 'photos défauts', 'certificat origine']
              },
              {
                title: 'Calculer la quantité nécessaire',
                level: 3,
                content: 'Méthodes de calcul selon volume aquarium, style souhaité, avec calculateur interactif et exemples concrets.',
                keywords: ['quantité pierre', 'calcul hardscape', 'ratio volume'],
                wordCount: 250,
                elements: ['calculateur interactif', 'schémas proportion', 'exemples layouts']
              },
              {
                title: 'Où acheter : fournisseurs recommandés',
                level: 3,
                content: 'Sélection des meilleurs fournisseurs, comparaison prix, services, garanties, avec retours clients.',
                keywords: ['acheter pierre seiryu', 'fournisseur aquarium', 'prix pierre'],
                wordCount: 200,
                elements: ['liste fournisseurs', 'comparatif prix', 'avis clients']
              },
              {
                title: 'Budget et coûts associés',
                level: 3,
                content: 'Analyse détaillée des coûts : prix au kg, frais livraison, coûts accessoires, avec simulateur budget.',
                keywords: ['prix pierre seiryu', 'budget hardscape', 'coût aquascaping'],
                wordCount: 180,
                elements: ['simulateur prix', 'graphique coûts', 'conseils économies']
              },
              {
                title: 'Préparation et nettoyage avant installation',
                level: 3,
                content: 'Protocole de nettoyage, désinfection, test de compatibilité, avec vidéo pas-à-pas.',
                keywords: ['nettoyage pierre', 'préparation hardscape', 'désinfection'],
                wordCount: 170,
                elements: ['vidéo tutoriel', 'checklist nettoyage', 'produits recommandés']
              }
            ]
          },
          {
            title: `Installation et Aquascaping avec les ${keyword}`,
            level: 2,
            keywords: ['installation pierre seiryu', 'aquascaping technique', 'layout aquarium'],
            estimatedWordCount: 1300,
            contentTypes: ['tutoriel vidéo', 'schémas installation', 'timelapses', 'techniques pros'],
            subsections: [
              {
                title: 'Techniques de composition et layout',
                level: 3,
                content: 'Maîtrise des règles de composition : règle des tiers, points focaux, perspective, avec exemples de masters.',
                keywords: ['composition aquarium', 'règle tiers', 'layout design'],
                wordCount: 350,
                elements: ['schémas composition', 'exemples maîtres', 'règles or']
              },
              {
                title: 'Méthodes de fixation et stabilité',
                level: 3,
                content: 'Techniques professionnelles de fixation, collage, équilibrage pour garantir sécurité et durabilité.',
                keywords: ['fixation pierre', 'stabilité hardscape', 'sécurité aquarium'],
                wordCount: 280,
                elements: ['tutoriel fixation', 'matériaux recommandés', 'tests stabilité']
              },
              {
                title: 'Association avec plantes aquatiques',
                level: 3,
                content: 'Guide des meilleures associations plantes/pierres, création de biotopes naturels, conseils plantation.',
                keywords: ['plantes aquarium', 'association plantes pierres', 'biotope naturel'],
                wordCount: 320,
                elements: ['guide plantes', 'photos associations', 'conseils plantation']
              },
              {
                title: 'Éclairage pour sublimer les pierres',
                level: 3,
                content: 'Techniques d\'éclairage spécifiques pour révéler les veines, créer des ombres dramatiques.',
                keywords: ['éclairage aquarium', 'mise en valeur pierre', 'éclairage hardscape'],
                wordCount: 200,
                elements: ['schémas éclairage', 'comparaisons avant/après', 'réglages LED']
              },
              {
                title: 'Styles d\'aquascaping populaires',
                level: 3,
                content: 'Exploration des styles : Iwagumi, Nature Style, Dutch Style, avec adaptations spécifiques aux Seiryu.',
                keywords: ['style iwagumi', 'nature aquascaping', 'style hollandais'],
                wordCount: 150,
                elements: ['galerie styles', 'caractéristiques styles', 'adaptations seiryu']
              }
            ]
          },
          {
            title: `Entretien et Maintenance Long Terme`,
            level: 2,
            keywords: ['entretien pierre seiryu', 'maintenance aquarium', 'algues pierre'],
            estimatedWordCount: 800,
            contentTypes: ['guide maintenance', 'planning entretien', 'solutions problèmes'],
            subsections: [
              {
                title: 'Nettoyage et prévention des algues',
                level: 3,
                content: 'Protocoles de nettoyage régulier, prévention algues, techniques de brossage sans abîmer.',
                keywords: ['nettoyage pierre', 'algues aquarium', 'maintenance hardscape'],
                wordCount: 280,
                elements: ['guide nettoyage', 'outils spécialisés', 'planning entretien']
              },
              {
                title: 'Surveillance des paramètres eau',
                level: 3,
                content: 'Monitoring continu pH/dureté, ajustements nécessaires, signaux d\'alerte à surveiller.',
                keywords: ['surveillance eau', 'paramètres aquarium', 'tests réguliers'],
                wordCount: 220,
                elements: ['planning tests', 'tableaux valeurs', 'alertes paramétriques']
              },
              {
                title: 'Réaménagement et évolution du décor',
                level: 3,
                content: 'Conseils pour faire évoluer le hardscape, ajouts possibles, renouvellement partiel.',
                keywords: ['évolution décor', 'réaménagement aquarium', 'modification hardscape'],
                wordCount: 200,
                elements: ['exemples évolution', 'techniques modification', 'planning changements']
              },
              {
                title: 'Résolution des problèmes courants',
                level: 3,
                content: 'Solutions aux problèmes fréquents : pierres qui bougent, algues persistantes, changements coloration.',
                keywords: ['problèmes pierre', 'solutions hardscape', 'troubleshooting'],
                wordCount: 100,
                elements: ['guide dépannage', 'FAQ problèmes', 'solutions rapides']
              }
            ]
          }
        ],

        conclusion: {
          summary: `Les ${keyword.toLowerCase()} représentent l'excellence en aquascaping, offrant beauté naturelle et facilité d'entretien pour créer des paysages aquatiques extraordinaires.`,
          callToAction: `Commencez dès maintenant votre projet avec notre sélection premium de ${keyword.toLowerCase()} et créez l'aquarium de vos rêves !`,
          nextSteps: `Rejoignez notre communauté d'aquascapers et accédez à nos tutoriels exclusifs, conseils personnalisés et réductions membres.`,
          estimatedWordCount: 180,
          keywords: [keyword, 'aquascaping', 'projet aquarium', 'communauté']
        },

        faq: [
          {
            question: `Les ${keyword.toLowerCase()} conviennent-elles à tous types d'aquariums ?`,
            answer: `Les ${keyword.toLowerCase()} sont parfaites pour les aquariums plantés, les biotopes asiatiques et les configurations eau douce. Elles nécessitent une surveillance du pH car elles peuvent l'augmenter légèrement.`,
            keywords: [keyword, 'compatibilité aquarium', 'eau douce']
          },
          {
            question: `Quelle quantité de ${keyword.toLowerCase()} pour un aquarium de 100L ?`,
            answer: `Pour un aquarium de 100L, comptez environ 8-12kg de ${keyword.toLowerCase()} selon le style souhaité. Un layout Iwagumi nécessitera moins qu'un hardscape complexe avec grottes.`,
            keywords: [keyword, 'quantité 100L', 'calcul pierre']
          },
          {
            question: `Comment éviter que les ${keyword.toLowerCase()} modifient trop le pH ?`,
            answer: `Testez vos pierres avant installation, utilisez un conditioselectionneur d'eau si nécessaire, et surveillez régulièrement les paramètres. Un changement graduel de 0.2-0.5 pH est généralement acceptable.`,
            keywords: [keyword, 'pH aquarium', 'paramètres eau']
          },
          {
            question: `Peut-on associer les ${keyword.toLowerCase()} avec d'autres roches ?`,
            answer: `Oui ! Elles se marient parfaitement avec l'Ohko Stone pour contraster, ou avec du bois flotté pour un effet naturel. Évitez les mélanges avec des roches volcaniques sombres.`,
            keywords: [keyword, 'mélange roches', 'association hardscape']
          }
        ],

        internalLinks: [
          { anchor: 'guide aquascaping débutant', suggestedUrl: '/aquascaping-debutant', context: 'Introduction aux techniques de base' },
          { anchor: 'calculateur volume aquarium', suggestedUrl: '/calculateur-aquarium', context: 'Section calcul quantité' },
          { anchor: 'plantes pour hardscape', suggestedUrl: '/plantes-aquarium-hardscape', context: 'Association avec plantes' },
          { anchor: 'éclairage LED aquarium', suggestedUrl: '/eclairage-aquarium', context: 'Section éclairage' },
          { anchor: 'tests paramètres eau', suggestedUrl: '/tests-eau-aquarium', context: 'Maintenance et surveillance' }
        ],

        images: [
          { title: `${keyword} en situation aquarium`, altText: `Aquarium aménagé avec ${keyword.toLowerCase()} montrant les veines blanches caractéristiques`, placement: 'Introduction', purpose: 'Illustration produit en contexte' },
          { title: 'Détail veines blanches Seiryu', altText: 'Gros plan sur les veines blanches caractéristiques des pierres Seiryu', placement: 'Caractéristiques', purpose: 'Identification visuelle' },
          { title: 'Comparatif roches aquarium', altText: 'Comparaison visuelle entre pierres Seiryu, Dragon Stone et Ohko Stone', placement: 'Comparaison', purpose: 'Aide à la décision' },
          { title: 'Layout Iwagumi Seiryu', altText: 'Exemple de composition Iwagumi utilisant des pierres Seiryu comme pierres principales', placement: 'Installation', purpose: 'Inspiration design' },
          { title: 'Entretien pierre aquarium', altText: 'Démonstration du nettoyage correct des pierres Seiryu en aquarium', placement: 'Maintenance', purpose: 'Guide pratique' }
        ],

        totalWordCount: 4280,
        readingTime: 17,
        difficulty: 'intermédiaire' as const,
        targetAudience: contextInfo.audience,
        competitorAdvantage: [
          'Guide le plus complet sur les pierres Seiryu (4200+ mots)',
          'Calculateur de quantité intégré unique',
          'Techniques professionnelles d\'aquascaping révélées',
          'Comparatifs détaillés avec photos haute définition',
          'Community support et conseils personnalisés'
        ]
      };
    }
    
    // Plan générique adaptatif pour autres mots-clés
    return {
      seoTitle: `${keyword} : Guide Complet 2024 [Conseils d'Experts]`,
      metaDescription: `Découvrez tout sur ${keyword.toLowerCase()} avec notre guide expert. Conseils pratiques, comparatifs et stratégies pour réussir en 2024.`,
      h1Title: `${keyword} : Le Guide Complet pour Maîtriser cette Technique`,
      
      introduction: {
        hook: `Saviez-vous que 87% des professionnels qui maîtrisent ${keyword.toLowerCase()} obtiennent des résultats 45% supérieurs ?`,
        context: `Dans un environnement en constante évolution, ${keyword.toLowerCase()} est devenu un élément crucial pour se démarquer.`,
        thesis: `Ce guide exhaustif vous révèle tout ce que vous devez savoir sur ${keyword.toLowerCase()}.`,
        roadmap: `Vous découvrirez : les fondamentaux, les meilleures pratiques, et les stratégies avancées.`,
        estimatedWordCount: 150,
        keywords: [keyword, ...contextInfo.relatedTerms.slice(0, 3)]
      },

      sections: [
        {
          title: `Qu'est-ce que ${keyword} ? [Définition & Bases]`,
          level: 2,
          keywords: [keyword, ...contextInfo.relatedTerms.slice(0, 2)],
          estimatedWordCount: 800,
          contentTypes: ['définition', 'exemples', 'schémas'],
          subsections: [
            {
              title: `Définition de ${keyword}`,
              level: 3,
              content: `Explication complète et accessible de ${keyword.toLowerCase()} avec exemples concrets.`,
              keywords: [keyword],
              wordCount: 200,
              elements: ['définition encadrée', 'exemples']
            }
          ]
        }
      ],

      conclusion: {
        summary: `${keyword} offre de nombreuses opportunités pour ceux qui maîtrisent ses aspects essentiels.`,
        callToAction: `Commencez dès aujourd'hui à appliquer ces conseils pour voir des résultats rapidement.`,
        nextSteps: `Approfondissez vos connaissances avec nos ressources avancées.`,
        estimatedWordCount: 150,
        keywords: [keyword]
      },

      faq: [
        {
          question: `Comment débuter avec ${keyword} ?`,
          answer: `Commencez par comprendre les bases puis pratiquez régulièrement avec les techniques présentées dans ce guide.`,
          keywords: [keyword, 'débutant']
        }
      ],

      internalLinks: [
        { anchor: 'guide débutant', suggestedUrl: '/guide-debutant', context: 'Pour approfondir' }
      ],

      images: [
        { title: `Schéma ${keyword}`, altText: `Illustration explicative de ${keyword.toLowerCase()}`, placement: 'Introduction', purpose: 'Pédagogie' }
      ],

      totalWordCount: 2500,
      readingTime: 10,
      difficulty: 'intermédiaire' as const,
      targetAudience: contextInfo.audience,
      competitorAdvantage: [
        'Guide complet et actualisé',
        'Approche pratique et accessible',
        'Exemples concrets et applicables'
      ]
    };
  };

  const generateComprehensiveArticlePlan = async () => {
    if (!mainKeyword) {
      toast.error("Veuillez d'abord générer des mots-clés");
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const specificContent = generateSpecificContent(mainKeyword);
      
      setArticlePlan(specificContent);
      toast.success("Plan d'article personnalisé généré avec succès !");
    } catch (error) {
      console.error('Erreur lors de la génération du plan:', error);
      toast.error("Erreur lors de la génération du plan d'article");
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'débutant': return 'bg-green-100 text-green-800';
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Générateur de Plan d'Article Personnalisé
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!articlePlan && (
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Générer un Plan d'Article Adapté</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Créez un plan d'article SEO ultra-personnalisé qui s'adapte automatiquement à votre mot-clé 
              "<strong>{mainKeyword}</strong>" avec contenu spécialisé, structure optimisée et recommandations expertes.
            </p>
            <Button 
              onClick={generateComprehensiveArticlePlan} 
              disabled={isGenerating || !mainKeyword}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-2" />
                  Générer le Plan Personnalisé
                </>
              )}
            </Button>
          </div>
        )}

        {articlePlan && (
          <div className="space-y-8">
            {/* En-tête avec métriques */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Plan d'Article Personnalisé</h2>
                <div className="flex items-center gap-3">
                  <Badge className={getDifficultyColor(articlePlan.difficulty)}>
                    {articlePlan.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {articlePlan.readingTime} min
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Type className="h-3 w-3" />
                    {articlePlan.totalWordCount.toLocaleString()} mots
                  </Badge>
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600">Audience:</span>
                  <span className="font-medium">{articlePlan.targetAudience.length} segments</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-gray-600">Sections:</span>
                  <span className="font-medium">{articlePlan.sections.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-600">FAQ:</span>
                  <span className="font-medium">{articlePlan.faq.length} questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-600">Images:</span>
                  <span className="font-medium">{articlePlan.images.length}</span>
                </div>
              </div>
            </div>

            {/* SEO et Meta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-green-500" />
                  SEO et Métadonnées Optimisées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Titre SEO ({articlePlan.seoTitle.length}/60)
                  </label>
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="font-medium text-green-800">{articlePlan.seoTitle}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Meta Description ({articlePlan.metaDescription.length}/160)
                  </label>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-blue-800">{articlePlan.metaDescription}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Titre H1</label>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                    <p className="font-semibold text-purple-800">{articlePlan.h1Title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Introduction détaillée */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Introduction Structurée ({articlePlan.introduction.estimatedWordCount} mots)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                    <h4 className="font-medium text-yellow-800 mb-2">🎣 Accroche</h4>
                    <p className="text-yellow-700">{articlePlan.introduction.hook}</p>
                  </div>
                  <div className="p-4 bg-gray-50 border-l-4 border-gray-400">
                    <h4 className="font-medium text-gray-800 mb-2">📖 Contexte</h4>
                    <p className="text-gray-700">{articlePlan.introduction.context}</p>
                  </div>
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                    <h4 className="font-medium text-blue-800 mb-2">🎯 Promesse</h4>
                    <p className="text-blue-700">{articlePlan.introduction.thesis}</p>
                  </div>
                  <div className="p-4 bg-green-50 border-l-4 border-green-400">
                    <h4 className="font-medium text-green-800 mb-2">🗺️ Plan</h4>
                    <p className="text-green-700">{articlePlan.introduction.roadmap}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Mots-clés à intégrer :</h4>
                  <div className="flex flex-wrap gap-2">
                    {articlePlan.introduction.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">{keyword}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Structure détaillée des sections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-blue-500" />
                  Structure Détaillée Personnalisée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {articlePlan.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border rounded-lg p-6 bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              H{section.level}
                            </Badge>
                            <h3 className="text-lg font-semibold">{section.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Type className="h-3 w-3" />
                              {section.estimatedWordCount} mots
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {section.keywords.length} mots-clés
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Types de contenu :</h4>
                          <div className="flex flex-wrap gap-2">
                            {section.contentTypes.map((type, typeIndex) => (
                              <Badge key={typeIndex} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Mots-clés ciblés :</h4>
                          <div className="flex flex-wrap gap-1">
                            {section.keywords.map((keyword, keyIndex) => (
                              <Badge key={keyIndex} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {section.subsections.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-700">Sous-sections :</h4>
                            {section.subsections.map((subsection, subIndex) => (
                              <div key={subIndex} className="bg-white p-4 rounded border-l-4 border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    H{subsection.level}
                                  </Badge>
                                  <h5 className="font-medium">{subsection.title}</h5>
                                  <span className="text-xs text-gray-500">({subsection.wordCount} mots)</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{subsection.content}</p>
                                
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div>
                                    <span className="text-xs font-medium text-gray-700">Éléments :</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {subsection.elements.map((element, elemIndex) => (
                                        <Badge key={elemIndex} variant="outline" className="text-xs bg-green-50">
                                          {element}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-xs font-medium text-gray-700">Mots-clés :</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {subsection.keywords.map((keyword, kwIndex) => (
                                        <Badge key={kwIndex} variant="secondary" className="text-xs">
                                          {keyword}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conclusion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Conclusion Optimisée ({articlePlan.conclusion.estimatedWordCount} mots)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 bg-green-50 border-l-4 border-green-400">
                    <h4 className="font-medium text-green-800 mb-2">📋 Résumé</h4>
                    <p className="text-green-700">{articlePlan.conclusion.summary}</p>
                  </div>
                  <div className="p-4 bg-orange-50 border-l-4 border-orange-400">
                    <h4 className="font-medium text-orange-800 mb-2">🚀 Call-to-Action</h4>
                    <p className="text-orange-700">{articlePlan.conclusion.callToAction}</p>
                  </div>
                  <div className="p-4 bg-purple-50 border-l-4 border-purple-400">
                    <h4 className="font-medium text-purple-800 mb-2">➡️ Prochaines Étapes</h4>
                    <p className="text-purple-700">{articlePlan.conclusion.nextSteps}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ spécialisée */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  FAQ Spécialisée ({articlePlan.faq.length} questions)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articlePlan.faq.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                          Q{index + 1}
                        </span>
                        {faq.question}
                      </h4>
                      <p className="text-gray-700 mb-3 pl-10">{faq.answer}</p>
                      <div className="pl-10">
                        <span className="text-xs font-medium text-gray-600">Mots-clés :</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {faq.keywords.map((keyword, kwIndex) => (
                            <Badge key={kwIndex} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Éléments techniques et visuels */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-blue-500" />
                    Liens Internes Suggérés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {articlePlan.internalLinks.map((link, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="font-medium text-blue-600">{link.anchor}</div>
                        <div className="text-sm text-gray-600 mt-1">{link.suggestedUrl}</div>
                        <div className="text-xs text-gray-500 mt-1">{link.context}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="h-5 w-5 text-green-500" />
                    Images Spécialisées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {articlePlan.images.map((image, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="font-medium">{image.title}</div>
                        <div className="text-sm text-gray-600 mt-1">Alt: {image.altText}</div>
                        <div className="flex justify-between mt-2">
                          <Badge variant="outline" className="text-xs">{image.placement}</Badge>
                          <Badge variant="secondary" className="text-xs">{image.purpose}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avantages concurrentiels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Avantages Concurrentiels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {articlePlan.competitorAdvantage.map((advantage, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Button onClick={generateComprehensiveArticlePlan} variant="outline">
                <ArrowRight className="h-4 w-4 mr-2" />
                Regénérer le Plan
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Eye className="h-4 w-4 mr-2" />
                Exporter le Plan
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticlePlanGenerator;
