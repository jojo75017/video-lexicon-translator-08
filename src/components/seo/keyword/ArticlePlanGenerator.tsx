
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, Lightbulb, Clock, Target, BookOpen, Eye, 
  Hash, Type, AlignLeft, List, MessageSquare, 
  ArrowRight, CheckCircle, Info, Star, Zap,
  FileImage, Link, Search, Users, TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface DetailedSection {
  title: string;
  level: number; // H2, H3, H4
  subsections: {
    title: string;
    level: number;
    content: string;
    keywords: string[];
    wordCount: number;
    elements: string[]; // listes, images, liens, etc.
  }[];
  keywords: string[];
  estimatedWordCount: number;
  contentTypes: string[]; // paragraphes, listes, images, etc.
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
  structuredData: {
    schema: string;
    elements: string[];
  };
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

  const generateComprehensiveArticlePlan = async () => {
    if (!mainKeyword) {
      toast.error("Veuillez d'abord générer des mots-clés");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simuler une génération de plan d'article détaillé
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const plan: ComprehensiveArticlePlan = {
        seoTitle: `${mainKeyword} : Guide Complet 2024 [+10 Conseils d'Experts]`,
        metaDescription: `Découvrez tout sur ${mainKeyword} avec notre guide expert. Conseils pratiques, comparatifs et stratégies pour réussir en 2024. Guide gratuit de 5000+ mots.`,
        h1Title: `${mainKeyword} : Le Guide Complet pour Maîtriser cette Technique en 2024`,
        
        introduction: {
          hook: `Saviez-vous que 87% des professionnels qui maîtrisent ${mainKeyword} augmentent leurs résultats de 45% en moyenne ?`,
          context: `Dans un monde digital en constante évolution, ${mainKeyword} est devenu un élément crucial pour quiconque souhaite se démarquer et obtenir des résultats exceptionnels.`,
          thesis: `Ce guide complet vous dévoile tout ce que vous devez savoir sur ${mainKeyword}, des bases aux techniques avancées utilisées par les experts.`,
          roadmap: `Vous découvrirez : les fondamentaux, les meilleures pratiques, les outils indispensables, et des stratégies éprouvées pour exceller.`,
          estimatedWordCount: 150,
          keywords: [mainKeyword, ...(keywords.slice(0, 3).map(k => k.keyword))]
        },

        sections: [
          {
            title: `Qu'est-ce que ${mainKeyword} ? [Définition & Fondamentaux]`,
            level: 2,
            keywords: keywords.slice(0, 4).map(k => k.keyword),
            estimatedWordCount: 800,
            contentTypes: ['paragraphes', 'définition encadrée', 'liste à puces', 'schéma explicatif'],
            subsections: [
              {
                title: `Définition complète de ${mainKeyword}`,
                level: 3,
                content: `Explication détaillée du concept avec exemples concrets et analogies pour faciliter la compréhension.`,
                keywords: [mainKeyword, keywords[0]?.keyword || ''],
                wordCount: 200,
                elements: ['définition encadrée', 'exemples concrets', 'analogie']
              },
              {
                title: `Histoire et évolution de ${mainKeyword}`,
                level: 3,
                content: `Retour sur les origines, les moments clés et l'évolution jusqu'à aujourd'hui.`,
                keywords: keywords.slice(1, 3).map(k => k.keyword),
                wordCount: 250,
                elements: ['chronologie', 'dates importantes', 'évolution graphique']
              },
              {
                title: `Pourquoi ${mainKeyword} est-il important aujourd'hui ?`,
                level: 3,
                content: `Analyse des enjeux actuels et de l'importance stratégique dans le contexte moderne.`,
                keywords: keywords.slice(2, 4).map(k => k.keyword),
                wordCount: 200,
                elements: ['statistiques', 'études de cas', 'tendances marché']
              },
              {
                title: `Les différents types de ${mainKeyword}`,
                level: 3,
                content: `Typologie complète avec avantages et inconvénients de chaque approche.`,
                keywords: keywords.slice(3, 5).map(k => k.keyword),
                wordCount: 150,
                elements: ['tableau comparatif', 'liste structurée', 'icônes visuelles']
              }
            ]
          },
          {
            title: `Comment Utiliser ${mainKeyword} : Guide Étape par Étape`,
            level: 2,
            keywords: keywords.slice(4, 8).map(k => k.keyword),
            estimatedWordCount: 1200,
            contentTypes: ['guide pas-à-pas', 'captures d\'écran', 'checklist', 'vidéo tutoriel'],
            subsections: [
              {
                title: `Étape 1 : Préparation et Prérequis`,
                level: 3,
                content: `Liste détaillée de tout ce qu'il faut préparer avant de commencer, outils nécessaires et compétences requises.`,
                keywords: keywords.slice(4, 6).map(k => k.keyword),
                wordCount: 300,
                elements: ['checklist prérequis', 'liste outils', 'estimation temps']
              },
              {
                title: `Étape 2 : Configuration Initiale`,
                level: 3,
                content: `Guide détaillé de configuration avec captures d'écran et points d'attention importants.`,
                keywords: keywords.slice(5, 7).map(k => k.keyword),
                wordCount: 400,
                elements: ['captures écran', 'guide visuel', 'points attention']
              },
              {
                title: `Étape 3 : Mise en Pratique et Optimisation`,
                level: 3,
                content: `Application concrète avec exemples réels et conseils d'optimisation pour de meilleurs résultats.`,
                keywords: keywords.slice(6, 8).map(k => k.keyword),
                wordCount: 350,
                elements: ['exemples concrets', 'conseils optimisation', 'métriques suivi']
              },
              {
                title: `Étape 4 : Mesure et Analyse des Résultats`,
                level: 3,
                content: `Méthodes de mesure, KPIs importants et analyse pour améliorer continuellement.`,
                keywords: keywords.slice(7, 9).map(k => k.keyword),
                wordCount: 150,
                elements: ['tableaux KPIs', 'graphiques analyse', 'outils mesure']
              }
            ]
          },
          {
            title: `Les Meilleures Pratiques et Techniques Avancées`,
            level: 2,
            keywords: keywords.slice(8, 12).map(k => k.keyword),
            estimatedWordCount: 1000,
            contentTypes: ['conseils experts', 'études de cas', 'techniques avancées', 'interviews'],
            subsections: [
              {
                title: `10 Conseils d'Experts pour Exceller`,
                level: 3,
                content: `Compilation des meilleures pratiques partagées par les experts du domaine avec exemples d'application.`,
                keywords: keywords.slice(8, 10).map(k => k.keyword),
                wordCount: 400,
                elements: ['liste numérotée', 'citations experts', 'exemples application']
              },
              {
                title: `Techniques Avancées peu Connues`,
                level: 3,
                content: `Révélation de techniques avancées utilisées par les professionnels mais rarement partagées publiquement.`,
                keywords: keywords.slice(9, 11).map(k => k.keyword),
                wordCount: 350,
                elements: ['techniques secrètes', 'cas d\'usage avancés', 'astuces professionnels']
              },
              {
                title: `Études de Cas et Retours d'Expérience`,
                level: 3,
                content: `Analyse détaillée de cas réels avec résultats chiffrés et leçons apprises.`,
                keywords: keywords.slice(10, 12).map(k => k.keyword),
                wordCount: 250,
                elements: ['tableaux résultats', 'graphiques performance', 'témoignages']
              }
            ]
          },
          {
            title: `Outils et Ressources Indispensables`,
            level: 2,
            keywords: keywords.slice(12, 16).map(k => k.keyword),
            estimatedWordCount: 600,
            contentTypes: ['comparatif outils', 'ressources gratuites', 'recommandations'],
            subsections: [
              {
                title: `Top 10 des Outils Gratuits`,
                level: 3,
                content: `Sélection des meilleurs outils gratuits avec présentation détaillée et mode d'emploi.`,
                keywords: keywords.slice(12, 14).map(k => k.keyword),
                wordCount: 250,
                elements: ['tableau comparatif', 'liens outils', 'notes utilisateurs']
              },
              {
                title: `Outils Premium Recommandés`,
                level: 3,
                content: `Analyse des solutions payantes les plus efficaces avec rapport qualité-prix.`,
                keywords: keywords.slice(13, 15).map(k => k.keyword),
                wordCount: 200,
                elements: ['comparatif prix', 'fonctionnalités détaillées', 'recommandations']
              },
              {
                title: `Ressources et Formations Complémentaires`,
                level: 3,
                content: `Liste de ressources pour approfondir ses connaissances et se perfectionner.`,
                keywords: keywords.slice(14, 16).map(k => k.keyword),
                wordCount: 150,
                elements: ['liens formations', 'livres recommandés', 'communautés actives']
              }
            ]
          },
          {
            title: `Erreurs Courantes et Comment les Éviter`,
            level: 2,
            keywords: keywords.slice(16, 20).map(k => k.keyword),
            estimatedWordCount: 700,
            contentTypes: ['liste erreurs', 'solutions pratiques', 'conseils prévention'],
            subsections: [
              {
                title: `Les 7 Erreurs les Plus Fréquentes`,
                level: 3,
                content: `Identification et explication des erreurs les plus communes avec leurs conséquences.`,
                keywords: keywords.slice(16, 18).map(k => k.keyword),
                wordCount: 300,
                elements: ['liste erreurs', 'conséquences détaillées', 'exemples concrets']
              },
              {
                title: `Solutions et Correctifs Rapides`,
                level: 3,
                content: `Méthodes éprouvées pour corriger rapidement les erreurs et repartir sur de bonnes bases.`,
                keywords: keywords.slice(17, 19).map(k => k.keyword),
                wordCount: 250,
                elements: ['guide dépannage', 'solutions étape par étape', 'temps résolution']
              },
              {
                title: `Prévention et Bonnes Pratiques`,
                level: 3,
                content: `Stratégies préventives pour éviter les pièges courants et maintenir un niveau optimal.`,
                keywords: keywords.slice(18, 20).map(k => k.keyword),
                wordCount: 150,
                elements: ['checklist prévention', 'routine maintenance', 'signaux alarme']
              }
            ]
          }
        ],

        conclusion: {
          summary: `Ce guide complet vous a présenté tous les aspects essentiels de ${mainKeyword}, des fondamentaux aux techniques les plus avancées.`,
          callToAction: `Commencez dès aujourd'hui en appliquant la première technique présentée et observez les résultats rapidement.`,
          nextSteps: `Pour aller plus loin, rejoignez notre communauté d'experts et accédez à des ressources exclusives.`,
          estimatedWordCount: 200,
          keywords: [mainKeyword, ...keywords.slice(0, 2).map(k => k.keyword)]
        },

        faq: [
          {
            question: `Combien de temps faut-il pour maîtriser ${mainKeyword} ?`,
            answer: `En moyenne, 3 à 6 mois de pratique régulière permettent d'acquérir une maîtrise solide des fondamentaux. Les techniques avancées demandent 6 à 12 mois supplémentaires.`,
            keywords: [mainKeyword, 'apprentissage', 'temps']
          },
          {
            question: `${mainKeyword} est-il adapté aux débutants ?`,
            answer: `Absolument ! Ce guide est conçu pour accompagner les débutants étape par étape, avec des explications claires et des exemples concrets.`,
            keywords: [mainKeyword, 'débutant', 'guide']
          },
          {
            question: `Quels sont les coûts associés à ${mainKeyword} ?`,
            answer: `Vous pouvez commencer gratuitement avec les outils présentés dans ce guide. Les solutions premium coûtent entre 20€ et 100€/mois selon vos besoins.`,
            keywords: [mainKeyword, 'coût', 'prix', 'budget']
          },
          {
            question: `Comment mesurer le succès avec ${mainKeyword} ?`,
            answer: `Les principaux indicateurs sont : l'engagement (+30% en moyenne), la conversion (+25%) et le ROI global (+40% sur 6 mois).`,
            keywords: [mainKeyword, 'métrique', 'ROI', 'succès']
          }
        ],

        structuredData: {
          schema: 'Article',
          elements: ['FAQPage', 'HowTo', 'Organization', 'BreadcrumbList']
        },

        internalLinks: [
          { anchor: 'guide débutant', suggestedUrl: '/guide-debutant', context: 'Introduction aux concepts de base' },
          { anchor: 'outils recommandés', suggestedUrl: '/outils-seo', context: 'Section outils et ressources' },
          { anchor: 'études de cas', suggestedUrl: '/etudes-cas', context: 'Exemples concrets d\'application' },
          { anchor: 'formation avancée', suggestedUrl: '/formation-avancee', context: 'Approfondissement des techniques' },
          { anchor: 'communauté experts', suggestedUrl: '/communaute', context: 'Conclusion et next steps' }
        ],

        images: [
          { title: `Schéma explicatif ${mainKeyword}`, altText: `Diagramme montrant le fonctionnement de ${mainKeyword}`, placement: 'Introduction', purpose: 'Illustration concept' },
          { title: `Captures d'écran tutoriel`, altText: `Interface utilisateur pour configurer ${mainKeyword}`, placement: 'Guide étape par étape', purpose: 'Support visuel' },
          { title: `Graphique résultats`, altText: `Graphique montrant les résultats obtenus avec ${mainKeyword}`, placement: 'Études de cas', purpose: 'Preuve performance' },
          { title: `Comparatif outils`, altText: `Tableau comparatif des meilleurs outils pour ${mainKeyword}`, placement: 'Outils et ressources', purpose: 'Aide décision' },
          { title: `Infographie erreurs`, altText: `Infographie listant les erreurs courantes en ${mainKeyword}`, placement: 'Erreurs à éviter', purpose: 'Mémorisation visuelle' }
        ],

        totalWordCount: 5450,
        readingTime: 22,
        difficulty: 'intermédiaire',
        targetAudience: ['Débutants motivés', 'Professionnels', 'Entrepreneurs', 'Étudiants'],
        competitorAdvantage: [
          'Guide le plus complet disponible (5400+ mots)',
          'Techniques exclusives d\'experts',
          'Études de cas réels avec chiffres',
          'Outils gratuits recommandés',
          'FAQ exhaustive basée sur vraies questions'
        ]
      };
      
      setArticlePlan(plan);
      toast.success("Plan d'article complet généré avec succès !");
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
          Générateur de Plan d'Article Détaillé
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!articlePlan && (
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Générer un Plan d'Article Complet</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Créez un plan d'article SEO ultra-détaillé avec titre, méta description, structure complète, 
              FAQ, liens internes et recommandations visuelles pour "{mainKeyword}"
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
                  Générer le Plan Complet
                </>
              )}
            </Button>
          </div>
        )}

        {articlePlan && (
          <div className="space-y-8">
            {/* En-tête avec métriques clés */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Plan d'Article Complet</h2>
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
                  SEO et Métadonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Titre SEO ({articlePlan.seoTitle.length}/60)</label>
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="font-medium text-green-800">{articlePlan.seoTitle}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Meta Description ({articlePlan.metaDescription.length}/160)</label>
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

            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Introduction ({articlePlan.introduction.estimatedWordCount} mots)
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
                  Structure Détaillée de l'Article
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
                          <h4 className="font-medium text-gray-700 mb-2">Mots-clés à intégrer :</h4>
                          <div className="flex flex-wrap gap-1">
                            {section.keywords.map((keyword, keyIndex) => (
                              <Badge key={keyIndex} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">Sous-sections détaillées :</h4>
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
                                  <span className="text-xs font-medium text-gray-700">Éléments visuels :</span>
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
                  Conclusion ({articlePlan.conclusion.estimatedWordCount} mots)
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

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  FAQ Optimisée ({articlePlan.faq.length} questions)
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
              {/* Liens internes */}
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

              {/* Images suggérées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="h-5 w-5 text-green-500" />
                    Images Recommandées
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
                  <Star className="h-5 w-5 text-gold-500" />
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
                Prévisualiser l'Article
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticlePlanGenerator;
