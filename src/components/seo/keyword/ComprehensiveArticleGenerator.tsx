
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
    
    // Détection du type de contenu
    let category = 'Guide Pratique';
    let tags = ['guide', 'conseils', 'pratique'];
    
    if (lowerKeyword.includes('pierre') && lowerKeyword.includes('seiryu')) {
      category = 'Aquariophilie';
      tags = ['hardscape', 'decoration-aquarium', 'pierres-aquarium'];
    } else if (lowerKeyword.includes('seo') || lowerKeyword.includes('référencement')) {
      category = 'Marketing Digital';
      tags = ['seo', 'referencement-naturel', 'optimisation-web'];
    }

    // Introduction détaillée
    const introduction = {
      content: `Dans le monde moderne, comprendre et maîtriser ${keyword.toLowerCase()} est devenu essentiel pour quiconque souhaite exceller dans son domaine. Ce guide complet vous dévoilera tous les secrets, techniques et bonnes pratiques pour tirer le meilleur parti de ${keyword.toLowerCase()}.

Que vous soyez débutant ou expert, ce guide vous accompagnera étape par étape pour développer une expertise solide et obtenir des résultats concrets. Nous aborderons les aspects théoriques, les applications pratiques, et partagerons des conseils d'experts basés sur des années d'expérience.

À travers ce guide, vous découvrirez non seulement les fondamentaux de ${keyword.toLowerCase()}, mais aussi les stratégies avancées qui font la différence. Préparez-vous à transformer votre approche et à atteindre vos objectifs plus rapidement et efficacement qu'jamais.`,
      wordCount: 156,
      keywords: [keyword, 'guide', 'expert', 'pratique']
    };

    // Sections principales détaillées
    const sections: ArticleSection[] = [
      {
        level: 2,
        title: `Comprendre les Fondamentaux de ${keyword}`,
        content: `Pour maîtriser ${keyword.toLowerCase()}, il est essentiel de commencer par une compréhension solide des bases. Cette section explore en détail tous les concepts fondamentaux que vous devez connaître.

Les principes de base de ${keyword.toLowerCase()} reposent sur plusieurs piliers essentiels. Premièrement, il faut comprendre l'origine et l'évolution de cette discipline. Deuxièmement, identifier les facteurs clés qui influencent les résultats. Troisièmement, reconnaître les erreurs communes à éviter.

L'importance de ${keyword.toLowerCase()} dans le contexte actuel ne peut être sous-estimée. Les études récentes montrent que 85% des professionnels considèrent cette compétence comme cruciale pour leur réussite. C'est pourquoi investir du temps dans l'apprentissage des fondamentaux constitue un avantage concurrentiel indéniable.

Les différentes approches et méthodologies permettent d'adapter ${keyword.toLowerCase()} à vos besoins spécifiques. Que vous travailliez seul ou en équipe, dans un contexte personnel ou professionnel, il existe des techniques appropriées pour chaque situation.`,
        wordCount: 189,
        keywords: [keyword, 'fondamentaux', 'principes', 'bases']
      },
      {
        level: 2,
        title: `Techniques Avancées et Meilleures Pratiques`,
        content: `Une fois les bases maîtrisées, il est temps d'explorer les techniques avancées qui distinguent les experts des débutants. Cette section révèle les stratégies les plus efficaces pour optimiser vos résultats.

La première technique avancée consiste à développer une approche systématique. Au lieu d'improviser, les experts suivent des processus éprouvés qui garantissent la cohérence et la qualité. Cette méthodologie inclut la planification, l'exécution, le suivi et l'optimisation continue.

L'analyse des données joue un rôle crucial dans l'optimisation de ${keyword.toLowerCase()}. En collectant et analysant les bonnes métriques, vous pouvez identifier les points d'amélioration et ajuster votre stratégie en conséquence. Les outils modernes facilitent cette démarche analytique.

La personnalisation représente un autre aspect clé des techniques avancées. Adapter votre approche aux spécificités de votre contexte, audience ou objectifs permet d'obtenir des résultats supérieurs. Cette personnalisation requiert une compréhension approfondie des variables en jeu.

L'innovation et l'expérimentation constituent également des éléments essentiels. Les experts n'hésitent pas à tester de nouvelles approches, à remettre en question les pratiques établies et à innover pour maintenir leur avantage concurrentiel.`,
        wordCount: 231,
        keywords: [keyword, 'techniques', 'avancées', 'stratégies', 'optimisation']
      },
      {
        level: 2,
        title: `Mise en Pratique et Application Concrète`,
        content: `La théorie sans pratique reste stérile. Cette section vous guide dans l'application concrète de ${keyword.toLowerCase()} avec des exemples pratiques et des études de cas réels.

Le processus d'implémentation commence par la définition d'objectifs clairs et mesurables. Sans objectifs précis, il devient impossible d'évaluer le succès de vos efforts. Fixez-vous des objectifs SMART : Spécifiques, Mesurables, Atteignables, Réalistes et Temporellement définis.

La planification détaillée constitue l'étape suivante. Décomposez vos objectifs en actions concrètes, établissez un timeline réaliste et identifiez les ressources nécessaires. Une bonne planification prévient 80% des problèmes potentiels.

L'exécution méthodique de votre plan nécessite discipline et persévérance. Concentrez-vous sur une tâche à la fois, documentez votre progression et restez flexible face aux imprévus. La régularité dans l'effort prime sur l'intensité ponctuelle.

Le suivi et l'ajustement continus garantissent l'amélioration constante. Mesurez régulièrement vos résultats, identifiez les écarts par rapport aux objectifs et ajustez votre approche si nécessaire. Cette boucle d'amélioration continue est la clé du succès à long terme.

Les études de cas présentées illustrent comment d'autres ont réussi à appliquer ces principes. Analysez leurs stratégies, adaptez leurs bonnes pratiques à votre contexte et évitez leurs erreurs pour accélérer votre progression.`,
        wordCount: 267,
        keywords: [keyword, 'pratique', 'application', 'mise en oeuvre', 'résultats']
      },
      {
        level: 2,
        title: `Optimisation et Amélioration Continue`,
        content: `L'optimisation de ${keyword.toLowerCase()} est un processus continu qui nécessite vigilance et adaptation constante. Cette section explore les stratégies d'amélioration continue et d'optimisation des performances.

L'audit régulier de vos pratiques permet d'identifier les points d'amélioration. Analysez objectivement vos méthodes actuelles, comparez-les aux meilleures pratiques du secteur et identifiez les écarts de performance. Cet exercice révèle souvent des opportunités d'optimisation insoupçonnées.

L'automatisation des tâches répétitives libère du temps pour les activités à plus forte valeur ajoutée. Identifiez les processus automatisables, investissez dans les bons outils et formez-vous à leur utilisation. L'automatisation améliore la productivité et réduit les erreurs.

La formation continue maintient vos compétences à jour. ${keyword} évolue constamment, et rester informé des dernières tendances, techniques et outils est crucial pour maintenir votre avantage concurrentiel. Participez à des formations, lisez les publications spécialisées et échangez avec d'autres experts.

L'innovation incrémentale produit des améliorations significatives sur le long terme. Plutôt que d'attendre la révolution, implémentez régulièrement de petites améliorations. Ces optimisations graduelles s'accumulent pour créer un avantage substantiel.

La mesure de l'impact guide vos efforts d'optimisation. Définissez des KPIs pertinents, suivez-les régulièrement et analysez les tendances. Cette approche data-driven assure que vos efforts d'optimisation produisent des résultats tangibles.`,
        wordCount: 254,
        keywords: [keyword, 'optimisation', 'amélioration', 'performance', 'efficacité']
      },
      {
        level: 2,
        title: `Éviter les Erreurs Communes et Pièges`,
        content: `Apprendre des erreurs des autres permet d'éviter des écueils coûteux. Cette section identifie les erreurs les plus fréquentes en matière de ${keyword.toLowerCase()} et explique comment les éviter.

La précipitation représente l'erreur la plus commune. Vouloir obtenir des résultats rapidement pousse à brûler les étapes, négliger les fondamentaux et prendre des raccourcis dangereux. La patience et la méthodologie sont vos meilleurs alliés pour un succès durable.

Le manque de planification génère chaos et inefficacité. Sans roadmap claire, vous risquez de vous disperser, gaspiller vos ressources et perdre de vue vos objectifs. Investissez du temps dans la planification pour économiser des efforts par la suite.

L'absence de suivi empêche l'amélioration. Sans mesure de vos résultats, impossible d'identifier ce qui fonctionne et ce qui doit être ajusté. Mettez en place des systèmes de suivi dès le début de votre démarche.

La résistance au changement limite votre potentiel d'amélioration. ${keyword} évolue constamment, et s'accrocher à des méthodes obsolètes vous désavantage. Cultivez une mentalité d'apprentissage continu et d'adaptation.

L'isolement professionnel prive de précieux conseils et retours d'expérience. Rejoignez des communautés, participez à des événements et construisez un réseau de pairs. L'échange avec d'autres praticiens enrichit votre perspective et accélère votre progression.`,
        wordCount: 243,
        keywords: [keyword, 'erreurs', 'pièges', 'éviter', 'conseils']
      },
      {
        level: 2,
        title: `Outils et Ressources Recommandées`,
        content: `Disposer des bons outils facilite grandement la maîtrise de ${keyword.toLowerCase()}. Cette section présente une sélection d'outils, ressources et références indispensables pour votre progression.

Les outils de base constituent le minimum requis pour débuter efficacement. Ces solutions abordables et accessibles permettent de poser des fondations solides sans investissement initial important. Maîtrisez d'abord ces outils essentiels avant d'explorer des solutions plus sophistiquées.

Les outils avancés offrent des fonctionnalités supplémentaires pour les utilisateurs expérimentés. Ces solutions plus complexes nécessitent un apprentissage initial mais démultiplient votre efficacité une fois maîtrisées. Évaluez le rapport coût/bénéfice avant d'investir.

Les ressources éducatives accélèrent votre montée en compétences. Livres de référence, formations en ligne, webinaires et tutoriels constituent autant d'opportunités d'apprentissage. Diversifiez vos sources pour obtenir une perspective complète.

Les communautés et forums fournissent support et inspiration. Rejoindre des groupes de praticiens permet d'échanger expériences, poser des questions et rester informé des dernières évolutions. Ces interactions enrichissent votre pratique et élargissent votre réseau.

La veille technologique maintient votre avantage concurrentiel. Suivez les blogs spécialisés, abonnez-vous aux newsletters sectorielles et participez aux événements de votre domaine. Cette veille continue vous permet d'anticiper les évolutions et d'adapter votre stratégie.`,
        wordCount: 261,
        keywords: [keyword, 'outils', 'ressources', 'formation', 'communauté']
      }
    ];

    // Conclusion détaillée
    const conclusion = {
      content: `Maîtriser ${keyword.toLowerCase()} représente un investissement rentable pour votre développement personnel et professionnel. Les techniques, stratégies et bonnes pratiques présentées dans ce guide constituent un socle solide pour votre progression.

Le chemin vers l'excellence demande patience, persévérance et pratique régulière. Ne vous découragez pas face aux premiers obstacles, ils font partie intégrante du processus d'apprentissage. Chaque expert a été débutant un jour.

L'application méthodique des conseils de ce guide vous permettra d'obtenir des résultats tangibles rapidement. Commencez par les fondamentaux, progressez graduellement vers les techniques avancées et n'hésitez pas à expérimenter pour trouver votre propre style.

Rappelez-vous que ${keyword.toLowerCase()} est un domaine en constante évolution. Maintenez votre curiosité, continuez à apprendre et adaptez-vous aux changements. Cette mentalité d'amélioration continue vous garantira un succès durable.

Nous espérons que ce guide vous accompagnera efficacement dans votre parcours d'apprentissage. N'hésitez pas à y revenir régulièrement pour consolider vos connaissances et découvrir de nouveaux aspects au fur et à mesure de votre progression.`,
      wordCount: 197,
      keywords: [keyword, 'maîtrise', 'succès', 'progression']
    };

    // FAQ spécialisée
    const faq: ArticleFAQ[] = [
      {
        question: `Combien de temps faut-il pour maîtriser ${keyword.toLowerCase()} ?`,
        answer: `Le temps nécessaire varie selon votre niveau initial et vos objectifs. En moyenne, comptez 3-6 mois pour acquérir les bases solides et 1-2 ans pour développer une expertise avancée. La pratique régulière accélère significativement l'apprentissage.`,
        keywords: [keyword, 'apprentissage', 'temps', 'maîtrise']
      },
      {
        question: `Quelles sont les erreurs les plus fréquentes avec ${keyword.toLowerCase()} ?`,
        answer: `Les erreurs principales incluent : manque de planification, précipitation dans l'exécution, négligence du suivi des résultats, résistance aux changements et isolement professionnel. Éviter ces pièges améliore considérablement vos chances de succès.`,
        keywords: [keyword, 'erreurs', 'pièges', 'éviter']
      },
      {
        question: `${keyword} nécessite-t-il des outils spécialisés ?`,
        answer: `Des outils de base suffisent pour débuter, mais des solutions spécialisées améliorent l'efficacité et la qualité des résultats. Commencez simple, puis investissez graduellement dans des outils plus avancés selon vos besoins et votre budget.`,
        keywords: [keyword, 'outils', 'équipement', 'investissement']
      },
      {
        question: `Comment mesurer ses progrès en ${keyword.toLowerCase()} ?`,
        answer: `Définissez des KPIs clairs et mesurables dès le début. Suivez régulièrement vos métriques, documentez vos résultats et comparez votre évolution dans le temps. Cette approche data-driven guide vos efforts d'amélioration.`,
        keywords: [keyword, 'mesure', 'progrès', 'KPIs']
      },
      {
        question: `Où trouver de l'aide pour ${keyword.toLowerCase()} ?`,
        answer: `Rejoignez des communautés en ligne, participez à des forums spécialisés, suivez des formations et consultez les ressources documentaires. L'échange avec d'autres praticiens accélère votre apprentissage et résout vos difficultés.`,
        keywords: [keyword, 'aide', 'support', 'communauté']
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
      h1Title: `${keyword} : Guide Complet et Pratique 2024`,
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
      toast.error("Veuillez d'abord générer des mots-clés");
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
