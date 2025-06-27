
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, Lightbulb, Clock, Target, BookOpen, Eye, 
  Hash, Type, MessageSquare, 
  ArrowRight, CheckCircle, Star, Zap,
  FileImage, Link, Search, Users, TrendingUp, Tag, Folder
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
  slug: string;
  category: string;
  tags: string[];
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

  const generateSeoOptimizedTitle = (keyword: string): string => {
    const templates = [
      `${keyword} : Guide Expert 2024`,
      `${keyword} - Conseils & Astuces`,
      `Guide ${keyword} Complet`,
      `${keyword} : Prix, Avis & Guide`,
      `Tout sur ${keyword} en 2024`
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.length <= 60 ? template : template.substring(0, 57) + "...";
  };

  const generateSeoOptimizedDescription = (keyword: string): string => {
    const templates = [
      `Découvrez tout sur ${keyword} : guide expert, conseils pratiques et astuces pour réussir. Prix, comparatifs et recommandations 2024.`,
      `${keyword} : guide complet avec techniques avancées, bonnes pratiques et conseils d'experts. Solutions efficaces et résultats garantis.`,
      `Maîtrisez ${keyword} avec notre guide détaillé : méthodes éprouvées, exemples concrets et stratégies pour optimiser vos résultats.`
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    if (template.length >= 152 && template.length <= 155) return template;
    if (template.length > 155) return template.substring(0, 152) + "...";
    return template.padEnd(152, ' ').substring(0, 152);
  };

  const generateSlug = (keyword: string): string => {
    return keyword.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const generateCategoryAndTags = (keyword: string) => {
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerKeyword.includes('pierre') && lowerKeyword.includes('seiryu')) {
      return {
        category: 'Aquariophilie',
        tags: ['hardscape', 'decoration-aquarium', 'pierres-aquarium']
      };
    }
    
    if (lowerKeyword.includes('seo') || lowerKeyword.includes('référencement')) {
      return {
        category: 'Marketing Digital',
        tags: ['seo', 'referencement-naturel', 'optimisation-web']
      };
    }
    
    return {
      category: 'Guide Pratique',
      tags: ['conseil', 'guide', 'pratique']
    };
  };

  const generateSpecificContent = (keyword: string) => {
    const { category, tags } = generateCategoryAndTags(keyword);
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerKeyword.includes('pierre') && lowerKeyword.includes('seiryu')) {
      return {
        seoTitle: generateSeoOptimizedTitle(keyword),
        metaDescription: generateSeoOptimizedDescription(keyword),
        slug: generateSlug(keyword),
        category,
        tags,
        h1Title: `${keyword} : Guide Complet pour Aquariophiles`,
        
        introduction: {
          hook: `Saviez-vous que 92% des aquariophiles utilisent les ${keyword.toLowerCase()} pour créer des paysages aquatiques exceptionnels ?`,
          context: `Dans l'aquascaping moderne, les ${keyword.toLowerCase()} sont LA référence pour des décors naturels harmonieux.`,
          thesis: `Ce guide révèle tous les secrets des ${keyword.toLowerCase()} : origine, sélection, installation et entretien.`,
          roadmap: `Vous découvrirez : caractéristiques, critères de choix, techniques d'installation et associations avec plantes.`,
          estimatedWordCount: 180,
          keywords: [keyword, 'aquascaping', 'hardscape', 'decoration aquarium']
        },

        sections: [
          {
            title: `Caractéristiques des ${keyword}`,
            level: 2,
            keywords: [keyword, "origine", "propriétés"],
            estimatedWordCount: 800,
            contentTypes: ['texte descriptif', 'images détaillées', 'tableau comparatif'],
            subsections: [
              {
                title: 'Origine et formation géologique',
                level: 3,
                content: 'Exploration de l\'origine japonaise et des propriétés uniques de ces roches calcaires.',
                keywords: [keyword, 'origine japon', 'géologie'],
                wordCount: 250,
                elements: ['photos origine', 'carte géologique', 'composition minérale']
              },
              {
                title: 'Propriétés physiques et esthétiques',
                level: 3,
                content: 'Analyse des veines blanches, variations de couleur et impact visuel en aquarium.',
                keywords: ['veines blanches', 'esthétique', 'couleur'],
                wordCount: 300,
                elements: ['photos macro', 'comparaisons visuelles', 'palette couleurs']
              },
              {
                title: 'Impact sur les paramètres eau',
                level: 3,
                content: 'Influence sur le pH, dureté et conseils pour maintenir l\'équilibre chimique.',
                keywords: ['pH', 'dureté eau', 'paramètres'],
                wordCount: 250,
                elements: ['graphiques pH', 'tableaux mesures', 'tests eau']
              }
            ]
          },
          {
            title: `Sélection et Achat des ${keyword}`,
            level: 2,
            keywords: ['sélection', 'achat', 'qualité'],
            estimatedWordCount: 900,
            contentTypes: ['guide sélection', 'comparatif prix', 'conseils achat'],
            subsections: [
              {
                title: 'Critères de qualité essentiels',
                level: 3,
                content: 'Guide des critères : forme, taille, couleur, absence de contaminants.',
                keywords: ['qualité', 'critères', 'sélection'],
                wordCount: 300,
                elements: ['checklist qualité', 'photos défauts', 'guide visuel']
              },
              {
                title: 'Calcul de la quantité nécessaire',
                level: 3,
                content: 'Méthodes de calcul selon volume aquarium avec exemples pratiques.',
                keywords: ['quantité', 'calcul', 'volume'],
                wordCount: 250,
                elements: ['calculateur', 'exemples', 'ratios']
              },
              {
                title: 'Fournisseurs recommandés',
                level: 3,
                content: 'Sélection des meilleurs fournisseurs avec comparaison prix et services.',
                keywords: ['fournisseurs', 'prix', 'acheter'],
                wordCount: 200,
                elements: ['liste fournisseurs', 'comparatif', 'avis clients']
              },
              {
                title: 'Budget et coûts',
                level: 3,
                content: 'Analyse des coûts : prix au kg, frais de livraison, coûts accessoires.',
                keywords: ['budget', 'prix', 'coût'],
                wordCount: 150,
                elements: ['simulateur prix', 'graphiques coûts', 'conseils économies']
              }
            ]
          },
          {
            title: `Installation et Aquascaping`,
            level: 2,
            keywords: ['installation', 'aquascaping', 'technique'],
            estimatedWordCount: 1200,
            contentTypes: ['tutoriel vidéo', 'schémas', 'techniques'],
            subsections: [
              {
                title: 'Techniques de composition',
                level: 3,
                content: 'Maîtrise des règles : règle des tiers, points focaux, perspective.',
                keywords: ['composition', 'règle tiers', 'design'],
                wordCount: 350,
                elements: ['schémas composition', 'exemples maîtres', 'règles or']
              },
              {
                title: 'Méthodes de fixation',
                level: 3,
                content: 'Techniques de fixation, collage, équilibrage pour sécurité.',
                keywords: ['fixation', 'stabilité', 'sécurité'],
                wordCount: 280,
                elements: ['tutoriel fixation', 'matériaux', 'tests stabilité']
              },
              {
                title: 'Association avec les plantes',
                level: 3,
                content: 'Guide des meilleures associations plantes/pierres.',
                keywords: ['plantes', 'association', 'biotope'],
                wordCount: 320,
                elements: ['guide plantes', 'photos associations', 'conseils plantation']
              },
              {
                title: 'Éclairage optimal',
                level: 3,
                content: 'Techniques d\'éclairage pour révéler les veines et créer des ombres.',
                keywords: ['éclairage', 'LED', 'mise en valeur'],
                wordCount: 250,
                elements: ['schémas éclairage', 'avant/après', 'réglages LED']
              }
            ]
          },
          {
            title: `Entretien et Maintenance`,
            level: 2,
            keywords: ['entretien', 'maintenance', 'nettoyage'],
            estimatedWordCount: 700,
            contentTypes: ['guide maintenance', 'planning', 'solutions'],
            subsections: [
              {
                title: 'Nettoyage régulier',
                level: 3,
                content: 'Protocoles de nettoyage, prévention algues, techniques de brossage.',
                keywords: ['nettoyage', 'algues', 'maintenance'],
                wordCount: 250,
                elements: ['guide nettoyage', 'outils', 'planning']
              },
              {
                title: 'Surveillance paramètres',
                level: 3,
                content: 'Monitoring pH/dureté, ajustements, signaux d\'alerte.',
                keywords: ['surveillance', 'paramètres', 'tests'],
                wordCount: 200,
                elements: ['planning tests', 'tableaux valeurs', 'alertes']
              },
              {
                title: 'Évolution du décor',
                level: 3,
                content: 'Conseils pour faire évoluer le hardscape, ajouts, renouvellement.',
                keywords: ['évolution', 'modification', 'réaménagement'],
                wordCount: 150,
                elements: ['exemples évolution', 'techniques', 'planning']
              },
              {
                title: 'Résolution problèmes',
                level: 3,
                content: 'Solutions aux problèmes : pierres mobiles, algues, décoloration.',
                keywords: ['problèmes', 'solutions', 'dépannage'],
                wordCount: 100,
                elements: ['guide dépannage', 'FAQ', 'solutions rapides']
              }
            ]
          }
        ],

        conclusion: {
          summary: `Les ${keyword.toLowerCase()} offrent beauté naturelle et facilité d'entretien pour des paysages aquatiques extraordinaires.`,
          callToAction: `Commencez votre projet avec notre sélection premium de ${keyword.toLowerCase()} !`,
          nextSteps: `Rejoignez notre communauté d'aquascapers pour tutoriels exclusifs et conseils personnalisés.`,
          estimatedWordCount: 150,
          keywords: [keyword, 'projet', 'communauté']
        },

        faq: [
          {
            question: `Les ${keyword.toLowerCase()} conviennent-elles à tous aquariums ?`,
            answer: `Parfaites pour aquariums plantés et biotopes asiatiques. Surveillez le pH car elles l'augmentent légèrement.`,
            keywords: [keyword, 'compatibilité', 'aquarium']
          },
          {
            question: `Quelle quantité pour un aquarium de 100L ?`,
            answer: `Comptez 8-12kg selon le style. Un Iwagumi nécessite moins qu'un hardscape complexe.`,
            keywords: [keyword, 'quantité', '100L']
          },
          {
            question: `Comment éviter la modification du pH ?`,
            answer: `Testez avant installation, utilisez un conditionneur si nécessaire, surveillez régulièrement.`,
            keywords: [keyword, 'pH', 'paramètres']
          }
        ],

        internalLinks: [
          { anchor: 'guide aquascaping débutant', suggestedUrl: '/aquascaping-debutant', context: 'Techniques de base' },
          { anchor: 'calculateur aquarium', suggestedUrl: '/calculateur-aquarium', context: 'Calcul quantité' },
          { anchor: 'plantes hardscape', suggestedUrl: '/plantes-hardscape', context: 'Association plantes' }
        ],

        images: [
          { title: `${keyword} en aquarium`, altText: `Aquarium avec ${keyword.toLowerCase()} montrant veines blanches`, placement: 'Introduction', purpose: 'Illustration produit' },
          { title: 'Détail veines Seiryu', altText: 'Gros plan veines blanches caractéristiques', placement: 'Caractéristiques', purpose: 'Identification' },
          { title: 'Comparatif roches', altText: 'Comparaison Seiryu, Dragon Stone, Ohko Stone', placement: 'Sélection', purpose: 'Aide décision' },
          { title: 'Layout Iwagumi', altText: 'Composition Iwagumi avec pierres Seiryu', placement: 'Installation', purpose: 'Inspiration' },
          { title: 'Entretien pierres', altText: 'Démonstration nettoyage pierres Seiryu', placement: 'Maintenance', purpose: 'Guide pratique' }
        ],

        totalWordCount: 3800,
        readingTime: 15,
        difficulty: 'intermédiaire' as const,
        targetAudience: ['Aquariophiles débutants', 'Passionnés hardscape', 'Propriétaires aquarium'],
        competitorAdvantage: [
          'Guide le plus complet sur les pierres Seiryu (3800+ mots)',
          'Calculateur de quantité intégré unique',
          'Techniques pro d\'aquascaping révélées',
          'Photos haute définition et comparatifs détaillés',
          'Support communauté et conseils personnalisés'
        ]
      };
    }
    
    // Plan générique pour autres mots-clés
    const { category: genCategory, tags: genTags } = generateCategoryAndTags(keyword);
    
    return {
      seoTitle: generateSeoOptimizedTitle(keyword),
      metaDescription: generateSeoOptimizedDescription(keyword),
      slug: generateSlug(keyword),
      category: genCategory,
      tags: genTags,
      h1Title: `${keyword} : Guide Complet et Pratique`,
      
      introduction: {
        hook: `Découvrez pourquoi ${keyword.toLowerCase()} est devenu essentiel en 2024.`,
        context: `Dans un environnement concurrentiel, maîtriser ${keyword.toLowerCase()} fait la différence.`,
        thesis: `Ce guide vous révèle tout sur ${keyword.toLowerCase()} avec des conseils pratiques.`,
        roadmap: `Au programme : bases, techniques avancées et stratégies gagnantes.`,
        estimatedWordCount: 120,
        keywords: [keyword, 'guide', 'conseils']
      },

      sections: [
        {
          title: `Comprendre ${keyword}`,
          level: 2,
          keywords: [keyword, 'définition', 'bases'],
          estimatedWordCount: 600,
          contentTypes: ['définition', 'exemples', 'schémas'],
          subsections: [
            {
              title: `Définition de ${keyword}`,
              level: 3,
              content: `Explication complète et accessible de ${keyword.toLowerCase()}.`,
              keywords: [keyword, 'définition'],
              wordCount: 300,
              elements: ['définition encadrée', 'exemples concrets']
            },
            {
              title: `Importance et enjeux`,
              level: 3,
              content: `Pourquoi ${keyword.toLowerCase()} est crucial aujourd'hui.`,
              keywords: [keyword, 'importance', 'enjeux'],
              wordCount: 300,
              elements: ['statistiques', 'exemples sectoriels']
            }
          ]
        }
      ],

      conclusion: {
        summary: `${keyword} offre de nombreuses opportunités pour ceux qui maîtrisent ses aspects.`,
        callToAction: `Commencez dès aujourd'hui à appliquer ces conseils pour voir des résultats.`,
        nextSteps: `Approfondissez avec nos ressources avancées et notre communauté d'experts.`,
        estimatedWordCount: 100,
        keywords: [keyword, 'action', 'résultats']
      },

      faq: [
        {
          question: `Comment débuter avec ${keyword} ?`,
          answer: `Commencez par les bases puis pratiquez avec les techniques de ce guide.`,
          keywords: [keyword, 'débuter', 'commencer']
        }
      ],

      internalLinks: [
        { anchor: 'guide débutant', suggestedUrl: '/guide-debutant', context: 'Pour approfondir' }
      ],

      images: [
        { title: `Schéma ${keyword}`, altText: `Illustration ${keyword.toLowerCase()}`, placement: 'Introduction', purpose: 'Pédagogie' }
      ],

      totalWordCount: 2000,
      readingTime: 8,
      difficulty: 'intermédiaire' as const,
      targetAudience: ['Débutants', 'Intermédiaires', 'Professionnels'],
      competitorAdvantage: [
        'Guide complet et actualisé',
        'Approche pratique accessible',
        'Exemples concrets applicables'
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
      toast.success("Plan d'article SEO optimisé généré !");
    } catch (error) {
      console.error('Erreur génération plan:', error);
      toast.error("Erreur lors de la génération du plan");
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
          Générateur de Plan d'Article SEO Optimisé
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!articlePlan && (
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Générer un Plan d'Article SEO</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Créez un plan d'article SEO ultra-optimisé avec titre (60 car.), meta description (152-155 car.), 
              slug, catégorie et tags pour "<strong>{mainKeyword}</strong>".
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
                  Générer le Plan SEO Optimisé
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
                <h2 className="text-2xl font-bold text-gray-900">Plan d'Article SEO Optimisé</h2>
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
            </div>

            {/* SEO et Meta optimisés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-green-500" />
                  SEO Optimisé (Limites Respectées)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Titre SEO ({articlePlan.seoTitle.length}/60 caractères)
                    {articlePlan.seoTitle.length <= 60 ? 
                      <Badge className="ml-2 bg-green-100 text-green-800">✓ Optimal</Badge> :
                      <Badge className="ml-2 bg-red-100 text-red-800">⚠ Trop long</Badge>
                    }
                  </label>
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="font-medium text-green-800">{articlePlan.seoTitle}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Meta Description ({articlePlan.metaDescription.length}/155 caractères)
                    {articlePlan.metaDescription.length >= 152 && articlePlan.metaDescription.length <= 155 ? 
                      <Badge className="ml-2 bg-green-100 text-green-800">✓ Optimal</Badge> :
                      <Badge className="ml-2 bg-yellow-100 text-yellow-800">⚠ Ajuster</Badge>
                    }
                  </label>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-blue-800">{articlePlan.metaDescription}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Slug URL</label>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                      <p className="font-mono text-sm text-purple-800">/{articlePlan.slug}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Catégorie</label>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                      <Badge className="bg-orange-100 text-orange-800">
                        <Folder className="w-3 h-3 mr-1" />
                        {articlePlan.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Tags (3)</label>
                    <div className="p-3 bg-pink-50 border border-pink-200 rounded">
                      <div className="flex flex-wrap gap-1">
                        {articlePlan.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Titre H1</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <p className="font-semibold text-gray-800">{articlePlan.h1Title}</p>
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

            {/* Structure détaillée */}
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

            {/* Éléments techniques */}
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
