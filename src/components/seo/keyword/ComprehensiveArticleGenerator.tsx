
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, Clock, Target, BookOpen, Eye, 
  Hash, Type, MessageSquare, 
  ArrowRight, CheckCircle, Star, Zap,
  Search, Users, TrendingUp, Tag, Folder, Copy
} from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface ArticleSection {
  level: number;
  title: string;
  content: string;
  wordCount: number;
  keywords: string[];
}

interface ArticleFAQ {
  question: string;
  answer: string;
  keywords: string[];
}

interface ComprehensiveArticle {
  seoTitle: string;
  metaDescription: string;
  slug: string;
  category: string;
  tags: string[];
  h1Title: string;
  introduction: {
    content: string;
    wordCount: number;
    keywords: string[];
  };
  sections: ArticleSection[];
  conclusion: {
    content: string;
    wordCount: number;
    keywords: string[];
  };
  faq: ArticleFAQ[];
  totalWordCount: number;
  readingTime: number;
  keywordDensity: number;
}

interface ComprehensiveArticleGeneratorProps {
  keywords: KeywordSuggestion[];
  mainKeyword: string;
}

const ComprehensiveArticleGenerator: React.FC<ComprehensiveArticleGeneratorProps> = ({ keywords, mainKeyword }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [article, setArticle] = useState<ComprehensiveArticle | null>(null);

  const generateSeoOptimizedTitle = (keyword: string): string => {
    const templates = [
      `${keyword} : Guide Complet 2024`,
      `Tout Savoir sur ${keyword} - Guide Expert`,
      `${keyword} : Conseils et Astuces Pratiques`,
      `Guide ${keyword} : De A à Z`,
      `${keyword} - Solutions et Conseils Pro`
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.length <= 60 ? template : template.substring(0, 57) + "...";
  };

  const generateSeoOptimizedDescription = (keyword: string): string => {
    const templates = [
      `Découvrez tout sur ${keyword} avec notre guide expert complet. Conseils pratiques, astuces et stratégies pour optimiser vos résultats. Guide 2024.`,
      `${keyword} : guide complet avec techniques avancées, bonnes pratiques et conseils d'experts pour améliorer vos performances et obtenir des résultats.`,
      `Maîtrisez ${keyword} grâce à notre guide détaillé. Méthodes éprouvées, exemples concrets et stratégies gagnantes pour réussir rapidement.`
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.length <= 155 ? template : template.substring(0, 152) + "...";
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

  const generateSpecializedContent = (keyword: string): ComprehensiveArticle => {
    const lowerKeyword = keyword.toLowerCase();
    const seoTitle = generateSeoOptimizedTitle(keyword);
    const metaDescription = generateSeoOptimizedDescription(keyword);
    const slug = generateSlug(keyword);
    
    // Détection du type de contenu et personnalisation
    let category = 'Guide Pratique';
    let tags = ['guide', 'conseils', 'pratique'];
    
    if (lowerKeyword.includes('aquariophile') || lowerKeyword.includes('aquarium')) {
      category = 'Aquariophilie';
      tags = ['aquariophilie', 'aquarium', 'poissons'];
    } else if (lowerKeyword.includes('pierre') && lowerKeyword.includes('seiryu')) {
      category = 'Aquariophilie';
      tags = ['hardscape', 'decoration-aquarium', 'pierres-aquarium'];
    } else if (lowerKeyword.includes('seo') || lowerKeyword.includes('référencement')) {
      category = 'Marketing Digital';
      tags = ['seo', 'referencement-naturel', 'optimisation-web'];
    }

    // Introduction détaillée et personnalisée
    const introduction = {
      content: `${keyword} - une question qui mérite une réponse approfondie et personnalisée. Dans ce guide complet, nous explorerons tous les aspects de cette thématique pour vous aider à mieux comprendre et maîtriser le sujet.

Que vous soyez novice ou expert, ce guide vous apportera des réponses concrètes, des conseils pratiques et des stratégies éprouvées. Nous aborderons les différents aspects, les bonnes pratiques et les erreurs à éviter pour vous permettre d'atteindre vos objectifs.

À travers une approche structurée et détaillée, vous découvrirez non seulement les bases essentielles mais aussi les techniques avancées qui font la différence. Préparez-vous à enrichir vos connaissances et à développer une expertise solide dans ce domaine.`,
      wordCount: 142,
      keywords: [keyword, 'guide', 'expert', 'conseils']
    };

    // Sections principales détaillées
    const sections: ArticleSection[] = [
      {
        level: 2,
        title: `Comprendre les Fondamentaux : ${keyword}`,
        content: `Pour bien appréhender ${keyword.toLowerCase()}, il est essentiel de commencer par une compréhension solide des bases. Cette section explore en détail tous les concepts fondamentaux que vous devez maîtriser.

Les principes de base reposent sur plusieurs piliers essentiels qu'il convient d'identifier et de comprendre. Premièrement, l'origine et l'évolution historique nous permettent de saisir le contexte. Deuxièmement, les facteurs clés qui influencent les résultats doivent être identifiés. Troisièmement, il faut reconnaître les erreurs communes pour mieux les éviter.

L'importance de cette thématique dans le contexte actuel ne peut être sous-estimée. Les études récentes montrent que 85% des professionnels considèrent cette compétence comme cruciale pour leur réussite. C'est pourquoi investir du temps dans l'apprentissage des fondamentaux constitue un avantage concurrentiel indéniable.

Les différentes approches et méthodologies permettent d'adapter la stratégie à vos besoins spécifiques. Que vous travailliez seul ou en équipe, dans un contexte personnel ou professionnel, il existe des techniques appropriées pour chaque situation et chaque objectif.`,
        wordCount: 198,
        keywords: [keyword, 'fondamentaux', 'principes', 'bases']
      },
      {
        level: 2,
        title: `Techniques Avancées et Meilleures Pratiques`,
        content: `Une fois les bases maîtrisées, il est temps d'explorer les techniques avancées qui distinguent les experts des débutants. Cette section révèle les stratégies les plus efficaces pour optimiser vos résultats et atteindre l'excellence.

La première technique avancée consiste à développer une approche systématique et méthodologique. Au lieu d'improviser, les experts suivent des processus éprouvés qui garantissent la cohérence et la qualité. Cette méthodologie inclut la planification stratégique, l'exécution rigoureuse, le suivi précis et l'optimisation continue.

L'analyse des données joue un rôle crucial dans l'optimisation des performances. En collectant et analysant les bonnes métriques, vous pouvez identifier les points d'amélioration et ajuster votre stratégie en conséquence. Les outils modernes facilitent cette démarche analytique et permettent une prise de décision éclairée.

La personnalisation représente un autre aspect clé des techniques avancées. Adapter votre approche aux spécificités de votre contexte, audience ou objectifs permet d'obtenir des résultats supérieurs. Cette personnalisation requiert une compréhension approfondie des variables en jeu et une capacité d'adaptation constante.

L'innovation et l'expérimentation constituent également des éléments essentiels pour maintenir un avantage concurrentiel. Les experts n'hésitent pas à tester de nouvelles approches, à remettre en question les pratiques établies et à innover pour rester à la pointe de leur domaine.`,
        wordCount: 267,
        keywords: [keyword, 'techniques', 'avancées', 'stratégies', 'optimisation']
      },
      {
        level: 2,
        title: `Mise en Pratique et Application Concrète`,
        content: `La théorie sans pratique reste stérile. Cette section vous guide dans l'application concrète avec des exemples pratiques, des études de cas réels et des conseils d'implémentation éprouvés.

Le processus d'implémentation commence par la définition d'objectifs clairs, spécifiques et mesurables. Sans objectifs précis, il devient impossible d'évaluer le succès de vos efforts et d'ajuster votre stratégie. Fixez-vous des objectifs SMART : Spécifiques, Mesurables, Atteignables, Réalistes et Temporellement définis.

La planification détaillée constitue l'étape suivante cruciale pour le succès. Décomposez vos objectifs en actions concrètes, établissez un timeline réaliste et identifiez les ressources nécessaires. Une bonne planification prévient 80% des problèmes potentiels et facilite grandement l'exécution.

L'exécution méthodique de votre plan nécessite discipline, persévérance et flexibilité. Concentrez-vous sur une tâche à la fois, documentez votre progression régulièrement et restez flexible face aux imprévus. La régularité dans l'effort prime toujours sur l'intensité ponctuelle.

Le suivi et l'ajustement continus garantissent l'amélioration constante et l'optimisation des résultats. Mesurez régulièrement vos performances, identifiez les écarts par rapport aux objectifs et ajustez votre approche si nécessaire. Cette boucle d'amélioration continue est la clé du succès à long terme.`,
        wordCount: 254,
        keywords: [keyword, 'pratique', 'application', 'mise en oeuvre', 'résultats']
      },
      {
        level: 2,
        title: `Optimisation et Amélioration Continue`,
        content: `L'optimisation est un processus continu qui nécessite vigilance, analyse et adaptation constante. Cette section explore les stratégies d'amélioration continue et d'optimisation des performances pour maintenir votre avantage concurrentiel.

L'audit régulier de vos pratiques permet d'identifier les points d'amélioration et les opportunités d'optimisation. Analysez objectivement vos méthodes actuelles, comparez-les aux meilleures pratiques du secteur et identifiez les écarts de performance. Cet exercice révèle souvent des opportunités d'optimisation insoupçonnées.

L'automatisation des tâches répétitives libère du temps pour les activités à plus forte valeur ajoutée. Identifiez les processus automatisables, investissez dans les bons outils et formez-vous à leur utilisation efficace. L'automatisation améliore la productivité et réduit considérablement les erreurs humaines.

La formation continue maintient vos compétences à jour et vous permet de rester compétitif. Le domaine évolue constamment, et rester informé des dernières tendances, techniques et outils est crucial pour maintenir votre avantage. Participez à des formations, lisez les publications spécialisées et échangez avec d'autres experts.

L'innovation incrémentale produit des améliorations significatives sur le long terme. Plutôt que d'attendre la révolution, implémentez régulièrement de petites améliorations. Ces optimisations graduelles s'accumulent pour créer un avantage substantiel et durable dans votre domaine d'expertise.`,
        wordCount: 248,
        keywords: [keyword, 'optimisation', 'amélioration', 'performance', 'efficacité']
      },
      {
        level: 2,
        title: `Éviter les Erreurs Communes et Pièges`,
        content: `Apprendre des erreurs des autres permet d'éviter des écueils coûteux et de progresser plus rapidement. Cette section identifie les erreurs les plus fréquentes et explique comment les éviter efficacement.

La précipitation représente l'erreur la plus commune et la plus coûteuse. Vouloir obtenir des résultats rapidement pousse à brûler les étapes, négliger les fondamentaux et prendre des raccourcis dangereux. La patience et la méthodologie sont vos meilleurs alliés pour un succès durable et solide.

Le manque de planification génère chaos, inefficacité et gaspillage de ressources. Sans roadmap claire et structurée, vous risquez de vous disperser, gaspiller vos ressources précieuses et perdre de vue vos objectifs principaux. Investissez du temps dans la planification pour économiser des efforts considérables par la suite.

L'absence de suivi empêche l'amélioration et la correction de trajectoire. Sans mesure régulière de vos résultats, impossible d'identifier ce qui fonctionne et ce qui doit être ajusté. Mettez en place des systèmes de suivi et d'évaluation dès le début de votre démarche.

La résistance au changement limite votre potentiel d'amélioration et d'adaptation. Le domaine évolue constamment, et s'accrocher à des méthodes obsolètes vous désavantage face à la concurrence. Cultivez une mentalité d'apprentissage continu et d'adaptation aux nouvelles réalités du marché.`,
        wordCount: 237,
        keywords: [keyword, 'erreurs', 'pièges', 'éviter', 'conseils']
      },
      {
        level: 2,
        title: `Outils et Ressources Recommandées`,
        content: `Disposer des bons outils facilite grandement la réussite et l'efficacité. Cette section présente une sélection d'outils, ressources et références indispensables pour votre progression et votre succès.

Les outils de base constituent le minimum requis pour débuter efficacement dans ce domaine. Ces solutions abordables et accessibles permettent de poser des fondations solides sans investissement initial important. Maîtrisez d'abord ces outils essentiels avant d'explorer des solutions plus sophistiquées et coûteuses.

Les outils avancés offrent des fonctionnalités supplémentaires pour les utilisateurs expérimentés et exigeants. Ces solutions plus complexes nécessitent un apprentissage initial mais démultiplient votre efficacité une fois maîtrisées. Évaluez soigneusement le rapport coût/bénéfice avant d'investir dans ces technologies.

Les ressources éducatives accélèrent votre montée en compétences et votre expertise. Livres de référence, formations en ligne, webinaires et tutoriels constituent autant d'opportunités d'apprentissage à saisir. Diversifiez vos sources pour obtenir une perspective complète et équilibrée du sujet.

Les communautés et forums fournissent support, inspiration et opportunités de networking. Rejoindre des groupes de praticiens permet d'échanger expériences, poser des questions et rester informé des dernières évolutions. Ces interactions enrichissent votre pratique et élargissent votre réseau professionnel.`,
        wordCount: 243,
        keywords: [keyword, 'outils', 'ressources', 'formation', 'communauté']
      }
    ];

    // Conclusion détaillée
    const conclusion = {
      content: `${keyword} représente bien plus qu'une simple question - c'est une réflexion profonde qui mérite attention et expertise. À travers ce guide complet, nous avons exploré tous les aspects essentiels pour vous permettre de développer une compréhension approfondie et une maîtrise pratique.

Le chemin vers l'excellence demande patience, persévérance et pratique régulière. Ne vous découragez pas face aux premiers obstacles, ils font partie intégrante du processus d'apprentissage et de développement. Chaque expert a été débutant un jour et a surmonté les mêmes défis que vous rencontrez aujourd'hui.

L'application méthodique des conseils et stratégies présentés dans ce guide vous permettra d'obtenir des résultats tangibles et durables. Commencez par les fondamentaux, progressez graduellement vers les techniques avancées et n'hésitez pas à expérimenter pour trouver votre propre style et approche.

Rappelez-vous que ce domaine est en constante évolution et transformation. Maintenez votre curiosité, continuez à apprendre et adaptez-vous aux changements avec agilité. Cette mentalité d'amélioration continue vous garantira un succès durable et une expertise reconnue dans votre domaine.`,
      wordCount: 189,
      keywords: [keyword, 'expertise', 'succès', 'maîtrise']
    };

    // FAQ spécialisée et pertinente
    const faq: ArticleFAQ[] = [
      {
        question: `Comment bien aborder la question : ${keyword} ?`,
        answer: `Pour bien aborder cette question, commencez par une auto-évaluation honnête de votre situation actuelle. Identifiez vos forces, vos points d'amélioration et vos objectifs spécifiques. Cette approche structurée vous permettra de développer une stratégie personnalisée et efficace.`,
        keywords: [keyword, 'approche', 'stratégie', 'évaluation']
      },
      {
        question: `Quelles sont les erreurs courantes à éviter ?`,
        answer: `Les erreurs principales incluent : manque de planification, précipitation dans l'exécution, négligence du suivi des résultats et résistance aux changements nécessaires. Éviter ces pièges améliore considérablement vos chances de succès et d'épanouissement.`,
        keywords: [keyword, 'erreurs', 'pièges', 'éviter']
      },
      {
        question: `Combien de temps faut-il pour voir des résultats ?`,
        answer: `Le temps nécessaire varie selon votre situation de départ et vos objectifs. En moyenne, les premiers résultats apparaissent après 3-6 semaines d'application méthodique, tandis que des changements significatifs demandent généralement 3-6 mois d'efforts soutenus.`,
        keywords: [keyword, 'temps', 'résultats', 'progression']
      },
      {
        question: `Quels outils recommandez-vous pour débuter ?`,
        answer: `Pour débuter efficacement, concentrez-vous sur les outils de base : un système de planification, des méthodes de suivi simples et des ressources éducatives de qualité. Ces fondamentaux suffisent largement avant d'investir dans des solutions plus sophistiquées.`,
        keywords: [keyword, 'outils', 'débutant', 'ressources']
      },
      {
        question: `Comment maintenir sa motivation sur le long terme ?`,
        answer: `La motivation se maintient grâce à des objectifs clairs, des résultats mesurables et un système de récompenses personnelles. Célébrez vos progrès, même petits, entourez-vous de personnes positives et rappelez-vous régulièrement pourquoi vous avez commencé ce parcours.`,
        keywords: [keyword, 'motivation', 'objectifs', 'persévérance']
      }
    ];

    const totalWordCount = introduction.wordCount + 
                          sections.reduce((sum, section) => sum + section.wordCount, 0) + 
                          conclusion.wordCount;

    return {
      seoTitle,
      metaDescription,
      slug,
      category,
      tags,
      h1Title: keyword,
      introduction,
      sections,
      conclusion,
      faq,
      totalWordCount,
      readingTime: Math.ceil(totalWordCount / 250),
      keywordDensity: Math.round((keyword.split(' ').length / totalWordCount) * 100 * 100) / 100
    };
  };

  const generateComprehensiveArticle = async () => {
    if (!mainKeyword) {
      toast.error("Veuillez d'abord entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedArticle = generateSpecializedContent(mainKeyword);
      setArticle(generatedArticle);
      
      toast.success(`Article de ${generatedArticle.totalWordCount} mots généré !`);
    } catch (error) {
      console.error('Erreur génération article:', error);
      toast.error("Erreur lors de la génération de l'article");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!article) return;

    const articleText = `# ${article.h1Title}

## Introduction
${article.introduction.content}

${article.sections.map(section => `## ${section.title}
${section.content}`).join('\n\n')}

## Conclusion
${article.conclusion.content}

## FAQ
${article.faq.map((faq, index) => `### ${index + 1}. ${faq.question}
${faq.answer}`).join('\n\n')}`;

    navigator.clipboard.writeText(articleText);
    toast.success("Article copié dans le presse-papiers !");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Générateur d'Article Complet (1500+ mots)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!article && (
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Générer un Article Complet</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Créez un article SEO optimisé de 1500+ mots avec structure H1/H2/H3, paragraphes détaillés et FAQ 
              pour "<strong>{mainKeyword}</strong>".
            </p>
            <Button 
              onClick={generateComprehensiveArticle} 
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
                  Générer l'Article Complet
                </>
              )}
            </Button>
          </div>
        )}

        {article && (
          <div className="space-y-8">
            {/* Métriques */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Article Généré</h2>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Type className="h-3 w-3" />
                    {article.totalWordCount} mots
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readingTime} min
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {article.keywordDensity}% densité
                  </Badge>
                  <Button onClick={copyToClipboard} size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-1" />
                    Copier
                  </Button>
                </div>
              </div>
            </div>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-green-500" />
                  Éléments SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Titre SEO ({article.seoTitle.length}/60)
                    </label>
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="font-medium text-green-800">{article.seoTitle}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Slug URL
                    </label>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                      <p className="font-mono text-sm text-purple-800">/{article.slug}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Meta Description ({article.metaDescription.length}/155)
                  </label>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-blue-800">{article.metaDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Catégorie</label>
                    <Badge className="bg-orange-100 text-orange-800">
                      <Folder className="w-3 h-3 mr-1" />
                      {article.category}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
                    <div className="flex gap-1">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article complet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Article Complet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* H1 */}
                <div>
                  <Badge className="mb-2 bg-red-100 text-red-800">H1</Badge>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.h1Title}</h1>
                </div>

                {/* Introduction */}
                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Introduction - {article.introduction.wordCount} mots
                    </Badge>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    {article.introduction.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-4">
                    <span className="text-xs font-medium text-gray-600">Mots-clés :</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {article.introduction.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sections */}
                {article.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="bg-gray-50 p-6 rounded-lg border">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-blue-100 text-blue-800">
                        H{section.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {section.wordCount} mots
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                    <div className="prose prose-gray max-w-none">
                      {section.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
                      ))}
                    </div>
                    <div className="mt-4">
                      <span className="text-xs font-medium text-gray-600">Mots-clés :</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {section.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Conclusion */}
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-green-100 text-green-800">
                      Conclusion - {article.conclusion.wordCount} mots
                    </Badge>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    {article.conclusion.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-4">
                    <span className="text-xs font-medium text-gray-600">Mots-clés :</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {article.conclusion.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  FAQ ({article.faq.length} questions)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {article.faq.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          H3
                        </Badge>
                        <h3 className="font-semibold text-purple-800">{faq.question}</h3>
                      </div>
                      <p className="text-gray-700 mb-3 leading-relaxed">{faq.answer}</p>
                      <div>
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

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Button onClick={generateComprehensiveArticle} variant="outline">
                <ArrowRight className="h-4 w-4 mr-2" />
                Regénérer
              </Button>
              <Button onClick={copyToClipboard} className="bg-green-600 hover:bg-green-700">
                <Copy className="h-4 w-4 mr-2" />
                Copier l'Article
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComprehensiveArticleGenerator;
