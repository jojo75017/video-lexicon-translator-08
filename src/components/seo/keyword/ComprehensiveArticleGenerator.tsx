
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
      tags = ['aquariophilie', 'passion-aquarium', 'profil-aquariophile'];
    } else if (lowerKeyword.includes('seo') || lowerKeyword.includes('référencement')) {
      category = 'Marketing Digital';
      tags = ['seo', 'referencement-naturel', 'optimisation-web'];
    }

    // Introduction détaillée et personnalisée
    const introduction = {
      content: `${keyword} - Cette question révèle bien plus qu'une simple curiosité sur l'aquariophilie. Elle dévoile votre personnalité, vos motivations profondes et votre approche unique de cet art fascinant qu'est l'aquariophilie.

L'aquariophilie ne se résume pas à maintenir des poissons dans un bocal. C'est un univers complexe qui demande patience, connaissances techniques et passion authentique. Chaque aquariophile développe sa propre philosophie, ses préférences et son style unique.

Dans ce guide complet, nous explorerons les différents profils d'aquariophiles, leurs caractéristiques distinctives et leurs approches variées. Vous découvrirez non seulement quel type d'aquariophile vous êtes, mais aussi comment développer vos compétences et approfondir votre passion pour cet art aquatique extraordinaire.

Que vous soyez débutant ou expert confirmé, cette analyse vous permettra de mieux comprendre votre relation avec l'aquariophilie et d'identifier les axes d'amélioration pour enrichir votre expérience et celle de vos pensionnaires aquatiques.`,
      wordCount: 142,
      keywords: [keyword, 'aquariophile', 'aquariophilie', 'passion']
    };

    // Sections principales détaillées
    const sections: ArticleSection[] = [
      {
        level: 2,
        title: `Les Différents Types d'Aquariophiles : Comprendre Votre Profil`,
        content: `L'aquariophilie attire des personnalités très diverses, chacune apportant sa propre vision et ses objectifs spécifiques. Identifier votre profil d'aquariophile vous permet de mieux orienter vos choix et d'optimiser votre approche.

**L'Aquariophile Débutant Passionné** se caractérise par son enthousiasme débordant et sa soif d'apprendre. Il multiplie les lectures, pose mille questions et parfois se précipite dans ses achats. Son aquarium reflète souvent cette période d'apprentissage : quelques erreurs de parcours, mais une motivation intacte qui compense largement les imperfections techniques.

**L'Aquariophile Technicien** privilégie l'aspect scientifique et technique. Il maîtrise parfaitement les paramètres de l'eau, investit dans du matériel haut de gamme et tient des registres précis. Ses aquariums sont des modèles de stabilité et d'équilibre, même si l'aspect esthétique peut parfois passer au second plan.

**L'Aquariophile Artiste** considère l'aquarium comme une œuvre d'art vivante. Il privilégie l'aquascaping, recherche l'harmonie visuelle et crée de véritables paysages aquatiques. Chaque élément est choisi avec soin pour créer une composition équilibrée et esthétiquement remarquable.

**L'Aquariophile Collectionneur** se passionne pour certaines espèces spécifiques. Qu'il s'agisse de cichlidés, de betta ou de crevettes, il développe une expertise pointue sur ses espèces favorites et cherche constamment à enrichir sa collection avec des variétés rares ou des souches particulières.`,
        wordCount: 248,
        keywords: ['types aquariophiles', 'profil', 'débutant', 'technicien', 'artiste', 'collectionneur']
      },
      {
        level: 2,
        title: `Test de Personnalité : Découvrez Votre Style Aquariophile`,
        content: `Pour mieux cerner votre profil d'aquariophile, analysons vos motivations, vos préférences et vos habitudes. Cette auto-évaluation vous aidera à identifier vos forces et les domaines à développer.

**Vos Motivations Principales** révèlent beaucoup sur votre type d'aquariophile. Recherchez-vous la détente et l'apaisement ? Vous êtes probablement un aquariophile contemplatif qui privilégie les bacs communautaires paisibles. Êtes-vous motivé par le défi technique ? Vous tendez vers le profil technicien avec un goût pour les systèmes complexes.

**Votre Approche de l'Achat** en dit long sur votre personnalité. L'achat impulsif caractérise souvent le débutant enthousiaste, tandis que l'achat planifié et recherché révèle un aquariophile expérimenté ou un collectionneur méticuleux.

**Votre Relation aux Paramètres de l'Eau** constitue un excellent indicateur. Testez-vous quotidiennement avec une précision scientifique ? Vous avez l'âme d'un technicien. Vous fiez-vous plutôt à l'observation visuelle et au comportement des poissons ? Vous développez une approche intuitive basée sur l'expérience.

**Votre Gestion du Temps Aquariophile** révèle vos priorités. Passez-vous des heures à observer vos pensionnaires ? Vous êtes probablement un contemplatif. Consacrez-vous plus de temps à l'entretien technique qu'à l'observation ? Votre profil tend vers le technicien méticuleux.

**Votre Approche de la Décoration** distingue clairement l'artiste du technicien. L'harmonie visuelle prime-t-elle sur la fonctionnalité ? Vous avez l'âme d'un aquascaper. La fonction prime-t-elle sur l'esthétique ? Vous privilégiez l'efficacité technique.`,
        wordCount: 287,
        keywords: ['test personnalité', 'style aquariophile', 'motivations', 'habitudes', 'préférences']
      },
      {
        level: 2,
        title: `L'Évolution de l'Aquariophile : Votre Parcours et Progression`,
        content: `L'aquariophilie est un voyage en constante évolution. Votre profil d'aujourd'hui n'est pas figé et se transforme au gré de vos expériences, réussites et parfois échecs qui constituent autant d'apprentissages précieux.

**Les Étapes Classiques de Progression** suivent généralement un schéma prévisible. La phase découverte se caractérise par l'émerveillement et quelques erreurs de débutant. Vient ensuite la phase d'approfondissement où vous développez vos connaissances techniques et affinez vos préférences.

**La Spécialisation Progressive** marque une étape importante dans l'évolution de l'aquariophile. Après avoir exploré différents aspects, vous développez naturellement des affinités particulières : biotopes spécifiques, espèces favorites, techniques privilégiées ou styles d'aquascaping préférés.

**L'Acquisition de l'Expérience** transforme progressivement votre approche. Les réflexes se développent, l'œil s'affine et vous apprenez à détecter les signaux subtils de vos pensionnaires. Cette intuition, fruit de l'expérience, complète et parfois remplace les connaissances purement théoriques.

**La Transmission du Savoir** constitue souvent l'aboutissement naturel du parcours aquariophile. Partager ses connaissances, conseiller les débutants et contribuer à la communauté aquariophile devient une source de satisfaction personnelle enrichissante.

**L'Innovation et l'Expérimentation** caractérisent les aquariophiles expérimentés qui n'hésitent pas à sortir des sentiers battus. Ils testent de nouvelles techniques, explorent des biotopes méconnus ou développent des méthodes originales adaptées à leurs objectifs spécifiques.`,
        wordCount: 267,
        keywords: ['évolution aquariophile', 'progression', 'spécialisation', 'expérience', 'transmission']
      },
      {
        level: 2,
        title: `Votre Environnement Aquariophile : Reflet de Votre Personnalité`,
        content: `L'aménagement de votre espace aquariophile en dit long sur votre personnalité et vos priorités. Chaque choix, du nombre d'aquariums à leur style, révèle des aspects de votre profil d'aquariophile.

**L'Organisation de Votre Espace** reflète votre approche générale. Un seul bac soigneusement entretenu révèle une personnalité perfectionniste qui privilégie la qualité. Plusieurs aquariums indiquent souvent un collectionneur ou un expérimentateur qui aime diversifier ses expériences.

**Le Style de Vos Installations** trahit vos priorités esthétiques et fonctionnelles. Des équipements visibles mais efficaces caractérisent le technicien pratique. Des installations discrètement intégrées révèlent l'artiste soucieux d'harmonie visuelle.

**Votre Approche de l'Aquascaping** constitue un révélateur puissant de personnalité. Les layouts géométriques attirent les esprits méthodiques et structurés. Les compositions naturelles séduisent les personnalités créatives et intuitives.

**La Diversité de Votre Population** indique vos préférences relationnelles. Les bacs communautaires harmonieux révèlent un tempérament diplomate qui privilégie l'équilibre. Les bacs spécialisés pour espèces difficiles trahissent un goût pour les défis techniques.

**Votre Gestion de l'Espace Technique** dévoile votre rapport à la technologie. Une salle technique organisée et étiquetée révèle un esprit méthodique. Un système simple mais efficace indique une approche pragmatique qui privilégie les résultats sur la complexité.`,
        wordCount: 254,
        keywords: ['environnement aquariophile', 'aménagement', 'organisation', 'style', 'aquascaping']
      },
      {
        level: 2,
        title: `Relations Sociales et Communauté : Votre Place dans l'Aquariophilie`,
        content: `Votre façon d'interagir avec la communauté aquariophile révèle des aspects importants de votre personnalité et influence votre évolution dans cette passion partagée.

**Votre Participation aux Forums et Réseaux** indique votre tempérament social. Les contributeurs actifs qui partagent régulièrement leurs expériences révèlent une personnalité généreuse et pédagogue. Les lecteurs silencieux privilégient souvent l'apprentissage discret et l'observation.

**Votre Approche des Bourses et Événements** dévoile vos priorités sociales. Les habitués des bourses qui connaissent tous les vendeurs ont l'âme de collectionneurs sociables. Ceux qui préfèrent les visites de clubs privilégient les échanges techniques approfondis.

**Votre Attitude Face aux Conseils** révèle votre rapport à l'autorité et à l'expertise. Acceptez-vous facilement les suggestions ? Vous avez probablement une personnalité ouverte et humble. Questionnez-vous systématiquement les recommandations ? Vous développez un esprit critique constructif.

**Votre Rôle dans les Discussions** indique votre position naturelle dans les groupes. Êtes-vous celui qui pose les questions ? Vous avez l'âme d'un apprenant curieux. Répondez-vous souvent aux interrogations ? Vous tendez naturellement vers le rôle de mentor.

**Votre Approche du Partage de Connaissances** révèle votre philosophie aquariophile. Le partage généreux caractérise les aquariophiles épanouis qui trouvent du plaisir dans la transmission. La réserve peut indiquer soit une personnalité discrète, soit un manque de confiance en ses compétences.`,
        wordCount: 248,
        keywords: ['relations sociales', 'communauté aquariophile', 'forums', 'bourses', 'partage']
      },
      {
        level: 2,
        title: `Développer Votre Potentiel Aquariophile : Conseils Personnalisés`,
        content: `Une fois votre profil identifié, vous pouvez développer stratégiquement vos compétences et approfondir votre épanouissement dans l'aquariophilie selon vos affinités naturelles.

**Pour l'Aquariophile Débutant**, la priorité consiste à structurer son apprentissage. Rejoignez un club local, trouvez un mentor expérimenté et concentrez-vous sur les bases avant de vous diversifier. Résistez à la tentation d'acheter impulsivement et privilégiez la qualité sur la quantité.

**Pour l'Aquariophile Technicien**, l'enjeu réside dans l'équilibre entre performance technique et plaisir esthétique. Explorez l'aquascaping pour enrichir votre approche. Vos compétences techniques constituent un atout précieux pour expérimenter des biotopes exigeants.

**Pour l'Aquariophile Artiste**, développez vos connaissances techniques pour soutenir vos créations esthétiques. La maîtrise des paramètres de l'eau garantit la pérennité de vos œuvres vivantes. Explorez différents styles d'aquascaping pour enrichir votre palette créative.

**Pour l'Aquariophile Collectionneur**, la networking devient cruciale pour accéder aux espèces rares. Développez vos compétences en reproduction pour contribuer à la préservation des souches. Documentez méticuleusement vos lignées pour apporter une valeur scientifique à votre passion.

**Quel que soit votre profil**, cultivez la curiosité et l'ouverture d'esprit. L'aquariophilie évolue constamment avec de nouvelles techniques, espèces et approches. Restez connecté à la communauté, expérimentez régulièrement et n'hésitez jamais à remettre en question vos habitudes pour progresser continuellement.`,
        wordCount: 267,
        keywords: ['développement potentiel', 'conseils personnalisés', 'progression', 'amélioration', 'épanouissement']
      }
    ];

    // Conclusion détaillée
    const conclusion = {
      content: `${keyword} ne se résume pas à une simple catégorisation, mais révèle la richesse et la diversité de notre communauté passionnée. Chaque profil d'aquariophile apporte sa contribution unique à cet art fascinant.

Que vous vous reconnaissiez dans un profil spécifique ou que vous combiniez plusieurs caractéristiques, l'important réside dans l'épanouissement personnel que vous procure cette passion. L'aquariophilie offre un terrain d'expression illimité pour exprimer votre créativité, vos compétences techniques et votre sensibilité artistique.

Votre évolution en tant qu'aquariophile ne s'arrête jamais. Chaque expérience, réussite ou échec, enrichit votre compréhension et affine votre approche. Embrassez cette progression continue et laissez votre passion vous guider vers de nouveaux horizons aquatiques.

N'oubliez jamais que derrière chaque aquarium se cache une histoire personnelle, des choix réfléchis et une vision unique de l'aquariophilie. Votre profil d'aquariophile reflète votre personnalité, vos valeurs et votre façon d'appréhender ce monde aquatique merveilleux qui nous unit tous.`,
      wordCount: 189,
      keywords: [keyword, 'communauté', 'épanouissement', 'évolution']
    };

    // FAQ spécialisée et pertinente
    const faq: ArticleFAQ[] = [
      {
        question: `Comment identifier précisément mon profil d'aquariophile ?`,
        answer: `L'identification de votre profil se base sur l'observation de vos habitudes, motivations et préférences. Analysez ce qui vous passionne le plus : l'aspect technique, esthétique, la collection d'espèces ou la détente. Vos choix d'équipement, votre gestion du temps et votre interaction avec la communauté révèlent également votre tempérament aquariophile dominant.`,
        keywords: ['identifier profil', 'habitudes', 'motivations', 'tempérament']
      },
      {
        question: `Peut-on appartenir à plusieurs catégories d'aquariophiles simultanément ?`,
        answer: `Absolument ! La plupart des aquariophiles expérimentés combinent plusieurs profils selon leurs projets et leur évolution. Un technicien peut développer sa fibre artistique, tandis qu'un collectionneur peut s'intéresser aux aspects techniques. Cette polyvalence enrichit l'expérience aquariophile et favorise une approche holistique de la passion.`,
        keywords: ['plusieurs profils', 'polyvalence', 'évolution', 'expérience']
      },
      {
        question: `Comment faire évoluer mon profil d'aquariophile vers d'autres domaines ?`,
        answer: `L'évolution naturelle se fait progressivement en explorant de nouveaux aspects. Rejoignez des communautés spécialisées, expérimentez de nouvelles techniques, assistez à des conférences ou bourses. La curiosité et l'ouverture d'esprit constituent les meilleurs moteurs pour développer de nouvelles compétences et enrichir votre profil aquariophile.`,
        keywords: ['évolution profil', 'développement', 'nouvelles techniques', 'curiosité']
      },
      {
        question: `Quel profil d'aquariophile convient le mieux aux débutants ?`,
        answer: `Aucun profil n'est intrinsèquement meilleur pour débuter. L'important est de respecter votre tempérament naturel tout en acquérant les bases essentielles. Un futur artiste doit maîtriser les fondamentaux techniques, tandis qu'un technicien en herbe peut développer sa sensibilité esthétique. L'équilibre et la progression graduelle restent les clés du succès.`,
        keywords: ['profil débutant', 'tempérament', 'bases essentielles', 'progression']
      },
      {
        question: `Comment concilier passion aquariophile et contraintes familiales/professionnelles ?`,
        answer: `L'adaptation de votre approche aquariophile à vos contraintes personnelles est essentielle. Optez pour des systèmes peu exigeants en maintenance si le temps manque, ou automatisez certaines tâches. Impliquez votre famille dans votre passion et organisez votre planning pour préserver des moments dédiés à vos aquariums sans négliger vos autres responsabilités.`,
        keywords: ['concilier passion', 'contraintes', 'organisation', 'équilibre vie']
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
