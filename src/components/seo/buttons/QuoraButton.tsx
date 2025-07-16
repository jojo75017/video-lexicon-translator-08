
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuoraQuestionForm from './QuoraQuestionForm';
import QuoraAnswerForm from './QuoraAnswerForm';
import { useQuoraHooks } from './QuoraHooks';
import { getResponseForQuestion } from './QuoraConstants';
import { MessageCircle, Copy, Download, Share2, ExternalLink, ThumbsUp, BookOpen, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const QuoraButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { activeTab, setActiveTab, askForm, answerForm } = useQuoraHooks();
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');
  const [includeReferences, setIncludeReferences] = useState(true);
  const [includePersonalTouch, setIncludePersonalTouch] = useState(true);
  const [wordCount, setWordCount] = useState<'normal' | 'long'>('long');
  const [responseStyle, setResponseStyle] = useState<'analytical' | 'narrative' | 'instructional'>('analytical');
  const [expertiseLevel, setExpertiseLevel] = useState<number[]>([80]);
  const [includeFAQ, setIncludeFAQ] = useState(true);
  const [includeStatistics, setIncludeStatistics] = useState(true);
  const [toneStyle, setToneStyle] = useState<'professional' | 'conversational' | 'provocative'>('professional');

  const handleQuoraSubmit = async (data: any) => {
    try {
      setIsGenerating(true);
      console.log("Question posée:", data.question);
      
      // Stocker la question pour éviter les réponses dupliquées
      setLastQuestion(data.question);
      
      // Analyser les mots-clés importants de la question
      const keywordsExtracted = extractKeywords(data.question);
      
      // Générer une réponse personnalisée basée sur la question et les options configurées
      let answer = generateFormattedResponse(
        data.question, 
        keywordsExtracted, 
        responseStyle, 
        expertiseLevel[0], 
        includeFAQ, 
        includeStatistics,
        toneStyle
      );
      
      // Ajouter des références si l'option est activée
      if (includeReferences) {
        answer += "\n\n**Sources et références:**\n";
        answer += generateReferences(keywordsExtracted, data.question);
      }
      
      // Ajouter une touche personnelle si l'option est activée
      if (includePersonalTouch) {
        answer += "\n\n**Mon expérience personnelle:** " + generatePersonalInsight(keywordsExtracted, data.question, toneStyle);
      }
      
      // Ajouter une conclusion forte et un appel à l'action
      answer += generateConclusion(keywordsExtracted, toneStyle);
      
      // Simuler un délai de traitement
      setTimeout(() => {
        setGeneratedAnswer(answer);
        setIsGenerating(false);
        toast.success('Réponse générée avec succès !');
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse:", error);
      setIsGenerating(false);
      toast.error("Une erreur s'est produite lors de la génération de la réponse");
    }
  };

  // Extraire les mots-clés importants de la question
  const extractKeywords = (question: string) => {
    // Simplification pour l'exemple - à améliorer selon besoin
    const stopWords = ["le", "la", "les", "un", "une", "des", "de", "du", "et", "est", "sont", "comment", "pourquoi", "quoi", "qui"];
    const words = question.toLowerCase().split(/\s+/);
    return words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .map(word => word.replace(/[.,?!;:()]/g, ''))
      .filter(word => word.length > 0);
  };

  // Générer une réponse formatée selon les paramètres choisis
  const generateFormattedResponse = (
    question: string, 
    keywords: string[], 
    style: string, 
    expertise: number,
    includeFAQ: boolean,
    includeStats: boolean,
    tone: string
  ) => {
    let baseResponse = getResponseForQuestion(question);
    
    // Mettre en gras tous les mots-clés dans la réponse
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      baseResponse = baseResponse.replace(regex, `**${keyword}**`);
    });

    // Adapter le style de réponse
    if (style === 'analytical') {
      baseResponse = formatAnalyticalResponse(baseResponse, keywords, expertise);
    } else if (style === 'narrative') {
      baseResponse = formatNarrativeResponse(baseResponse, keywords, expertise);
    } else if (style === 'instructional') {
      baseResponse = formatInstructionalResponse(baseResponse, keywords, expertise);
    }
    
    // Ajouter des statistiques si demandé
    if (includeStats) {
      baseResponse += "\n\n**Statistiques importantes:**\n\n";
      baseResponse += generateStatistics(keywords, question);
    }
    
    // Ajouter une section FAQ si demandée
    if (includeFAQ) {
      baseResponse += "\n\n**Questions fréquemment posées:**\n\n";
      baseResponse += generateFAQSection(keywords, question);
    }
    
    return baseResponse;
  };
  
  // Formater en style analytique
  const formatAnalyticalResponse = (response: string, keywords: string[], expertise: number) => {
    // Augmenter la sophistication selon le niveau d'expertise
    const sophisticatedWords = [
      "paradigme", "axiomatique", "ontologie", "épistémologie", "heuristique",
      "systémique", "pragmatique", "méthodologie", "conceptualisation", "paradigmatique"
    ];
    
    let enhancedResponse = `## Analyse approfondie sur ${keywords.slice(0, 3).join(', ')}\n\n`;
    enhancedResponse += "Dans cette analyse détaillée, nous examinerons les aspects fondamentaux et les implications stratégiques de ce sujet.\n\n";
    enhancedResponse += response;
    
    // Ajouter des termes sophistiqués selon le niveau d'expertise
    if (expertise > 70) {
      const numTerms = Math.floor((expertise - 70) / 10) + 1;
      const selectedTerms = sophisticatedWords.slice(0, numTerms);
      enhancedResponse = enhancedResponse.replace(/\.(.*?)\./g, (match) => {
        const term = selectedTerms[Math.floor(Math.random() * selectedTerms.length)];
        return match.replace('.', `. Cette approche ${term} suggère que `);
      });
    }
    
    return enhancedResponse;
  };
  
  // Formater en style narratif
  const formatNarrativeResponse = (response: string, keywords: string[], expertise: number) => {
    let storyResponse = `## Mon parcours avec ${keywords.slice(0, 2).join(' et ')}\n\n`;
    storyResponse += `Il y a quelques années, j'ai commencé à explorer le domaine de ${keywords[0] || 'ce sujet'}. Ce que j'ai découvert a profondément transformé ma perspective.\n\n`;
    storyResponse += response.replace(/est/g, "était").replace(/sont/g, "étaient");
    
    // Ajouter des éléments narratifs
    storyResponse += `\n\nAu fil de mon parcours, j'ai réalisé que la maîtrise de ${keywords[0] || 'ce domaine'} nécessite bien plus que des connaissances théoriques. Elle demande une pratique constante et une remise en question permanente.`;
    
    return storyResponse;
  };
  
  // Formater en style instructif
  const formatInstructionalResponse = (response: string, keywords: string[], expertise: number) => {
    let instructionResponse = `## Guide pratique: ${keywords.slice(0, 3).join(', ')}\n\n`;
    instructionResponse += "Suivez ces étapes concrètes pour maîtriser ce sujet:\n\n";
    
    // Transformer la réponse en étapes numérotées
    const paragraphs = response.split('\n\n');
    instructionResponse += paragraphs.map((para, index) => {
      return `### Étape ${index + 1}: ${para.split(' ').slice(0, 5).join(' ')}...\n\n${para}`;
    }).join('\n\n');
    
    // Ajouter une section "À éviter"
    instructionResponse += "\n\n### Erreurs courantes à éviter:\n\n";
    instructionResponse += `1. **Négliger les fondamentaux de ${keywords[0] || 'ce sujet'}** - Prenez le temps de maîtriser les concepts de base.\n`;
    instructionResponse += `2. **Trop se concentrer sur les tendances** - Les principes fondamentaux restent constants malgré l'évolution des pratiques.\n`;
    instructionResponse += `3. **Ne pas mesurer les résultats** - Établissez des métriques claires pour évaluer votre progression.`;
    
    return instructionResponse;
  };
  
  // Générer une section statistiques pertinentes
  const generateStatistics = (keywords: string[], question: string) => {
    const stats = [
      `• **${Math.floor(Math.random() * 40) + 60}%** des professionnels considèrent que la maîtrise de ${keywords[0] || 'ce domaine'} est essentielle pour réussir.\n`,
      `• Une étude récente de ${getRandomUniversity()} a montré une augmentation de **${Math.floor(Math.random() * 30) + 20}%** des performances après l'application des principes de ${keywords[1] || 'ce concept'}.\n`,
      `• En moyenne, les organisations investissent **${Math.floor(Math.random() * 15) + 5}%** de leur budget dans l'amélioration de leurs compétences en ${keywords[0] || 'ce domaine'}.\n`,
      `• **${Math.floor(Math.random() * 500) + 500}** nouvelles études ont été publiées sur ce sujet au cours des 12 derniers mois.\n`,
      `• Le temps moyen nécessaire pour développer une expertise dans ce domaine est de **${Math.floor(Math.random() * 5) + 2} ans** avec une pratique régulière.\n`
    ];
    
    // Sélectionner aléatoirement 3 statistiques
    const shuffled = [...stats].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).join('');
  };
  
  // Générer une section FAQ
  const generateFAQSection = (keywords: string[], question: string) => {
    const faqs = [
      `**Q: Comment commencer avec ${keywords[0] || 'ce sujet'} sans expérience préalable?**\n\nR: Commencez par les ressources fondamentales et progressez graduellement. Des plateformes comme Coursera et Udemy proposent d'excellents cours d'introduction.\n\n`,
      `**Q: Quels outils sont indispensables pour ${keywords.slice(0, 2).join(' et ')}?**\n\nR: Cela dépend de votre contexte spécifique, mais généralement, ${getRandomTools(keywords)} sont considérés comme essentiels.\n\n`,
      `**Q: Combien de temps faut-il pour voir des résultats tangibles?**\n\nR: Avec une pratique régulière, vous pouvez constater des améliorations dans les 3-6 mois, mais une maîtrise complète nécessite généralement 1-2 ans d'application constante.\n\n`,
      `**Q: Comment mesurer efficacement les progrès dans ce domaine?**\n\nR: Établissez des KPIs clairs au début de votre parcours, comme ${getRandomKPIs(keywords)}, et suivez leur évolution mensuellement.\n\n`,
      `**Q: Quelles sont les tendances émergentes à surveiller?**\n\nR: Les innovations en ${keywords[0] || 'ce domaine'} incluent ${getRandomTrends(keywords)}. Restez informé en suivant les publications spécialisées.\n\n`
    ];
    
    // Sélectionner aléatoirement 2-3 FAQs
    const numFaqs = Math.floor(Math.random() * 2) + 2; // 2 ou 3
    const shuffled = [...faqs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numFaqs).join('');
  };
  
  // Générer des références académiques et professionnelles
  const generateReferences = (keywords: string[], question: string) => {
    const currentYear = new Date().getFullYear();
    const references = [
      `1. ${getRandomAuthor()}, (${currentYear}). "**Principes avancés de ${keywords[0] || 'ce domaine'}**". Journal of ${getRandomJournal()}. vol. ${Math.floor(Math.random() * 20) + 1}, pp. ${Math.floor(Math.random() * 100) + 100}-${Math.floor(Math.random() * 100) + 200}.\n`,
      `2. ${getRandomAuthor()} & ${getRandomAuthor()}, (${currentYear-1}). "**${keywords[1] || 'Ce sujet'} dans un contexte contemporain**". Edition ${getRandomPublisher()}, ${Math.floor(Math.random() * 300) + 200} pages.\n`,
      `3. ${getRandomOrganization()}, (${currentYear-2}). "**Rapport annuel sur les tendances en ${keywords[0] || 'ce domaine'}**". Disponible sur: www.${keywords[0] || 'organisation'}-research.org/trends.\n`,
      `4. ${getRandomUniversity()} Research Group, (${currentYear}). "**Étude comparative: ${keywords.slice(0, 2).join(' vs ')}**". Conference on ${getRandomConference()}, pp. ${Math.floor(Math.random() * 50) + 10}-${Math.floor(Math.random() * 50) + 60}.\n`,
      `5. ${getRandomAuthor()}, ${getRandomAuthor()}, & ${getRandomAuthor()}, (${currentYear-1}). "**Méthodologies innovantes pour ${keywords[0] || 'ce domaine'}**". ${getRandomPublisher()} Academic Press, DOI: 10.${Math.floor(Math.random() * 10000) + 1000}/${Math.floor(Math.random() * 10000) + 1000}.\n`
    ];
    
    // Sélectionner aléatoirement 3-4 références
    const numRefs = Math.floor(Math.random() * 2) + 3; // 3 ou 4
    const shuffled = [...references].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numRefs).join('');
  };
  
  // Générer un insight personnel
  const generatePersonalInsight = (keywords: string[], question: string, tone: string) => {
    let insights = [];
    
    if (tone === 'professional') {
      insights = [
        `Au cours de mes ${Math.floor(Math.random() * 10) + 5} années d'expérience dans ce domaine, j'ai constaté que l'aspect le plus sous-estimé de ${keywords[0] || 'ce sujet'} est sa dimension stratégique à long terme. Cette perspective m'a permis de développer une approche particulièrement efficace, centrée sur ${keywords[1] || 'les fondamentaux'} plutôt que sur les tendances éphémères.`,
        `Ma pratique professionnelle m'a enseigné que la véritable valeur de ${keywords[0] || 'ce domaine'} réside dans sa capacité à transformer fondamentalement les résultats lorsqu'il est appliqué avec rigueur et constance. J'ai personnellement observé des améliorations de performance de l'ordre de ${Math.floor(Math.random() * 30) + 40}% en adoptant cette philosophie.`,
        `Ce qui distingue les experts des simples praticiens dans ce domaine, c'est leur capacité à voir au-delà des applications immédiates pour comprendre les implications systémiques de ${keywords[0] || 'ce concept'}. Cette vision holistique, que j'ai développée au fil des années, transforme radicalement l'efficacité des stratégies mises en œuvre.`
      ];
    } else if (tone === 'conversational') {
      insights = [
        `Je me souviens encore de ma première expérience avec ${keywords[0] || 'ce sujet'} - j'étais complètement perdu ! Ce n'est qu'après avoir fait l'erreur de ${getRandomMistake(keywords)} que j'ai vraiment compris l'importance d'une approche structurée. Aujourd'hui, je commence toujours par établir un cadre clair avant de me lancer.`,
        `Un jour, un mentor m'a dit quelque chose que je n'ai jamais oublié à propos de ${keywords[0] || 'ce domaine'} : "La maîtrise ne vient pas de la connaissance, mais de l'application constante." Cette phrase a changé ma façon d'aborder chaque nouveau projet, et les résultats parlent d'eux-mêmes !`,
        `La plus grande leçon que j'ai apprise sur ${keywords[0] || 'ce sujet'} est venue d'un échec cuisant. J'avais négligé l'importance de ${keywords[1] || 'cet aspect'} et tout s'est effondré. Cette expérience m'a enseigné qu'il n'y a pas de raccourcis vers l'excellence dans ce domaine.`
      ];
    } else if (tone === 'provocative') {
      insights = [
        `Contrairement à ce que la plupart des "experts" vous diront, ${keywords[0] || 'ce domaine'} n'est pas une science exacte. J'ai délibérément ignoré les "règles" établies et j'ai obtenu des résultats que mes collègues plus orthodoxes considéraient comme impossibles. Parfois, il faut oser remettre en question le consensus.`,
        `La vérité que personne n'ose dire sur ${keywords[0] || 'ce sujet'}, c'est que 80% des pratiques communément acceptées sont basées sur des traditions dépassées plutôt que sur des preuves concrètes. Mon approche non-conventionnelle a provoqué des critiques, mais également des résultats indéniables.`,
        `J'ai appris à mes dépens que le conformisme est l'ennemi de l'innovation dans ${keywords[0] || 'ce domaine'}. Lorsque j'ai cessé de suivre aveuglément les "meilleures pratiques" et commencé à tester mes propres hypothèses, j'ai découvert des approches radicalement plus efficaces que j'applique maintenant systématiquement.`
      ];
    }
    
    // Sélectionner aléatoirement un insight
    return insights[Math.floor(Math.random() * insights.length)];
  };
  
  // Générer une conclusion forte
  const generateConclusion = (keywords: string[], tone: string) => {
    let conclusions = [];
    
    if (tone === 'professional') {
      conclusions = [
        `\n\n## Pour aller plus loin\n\nPour approfondir votre compréhension de ${keywords[0] || 'ce sujet'}, je vous recommande d'explorer les ressources suivantes:\n\n• ${getRandomBookTitle(keywords)}\n• Le cours "${keywords[0] || 'Ce domaine'} - Applications avancées" sur ${getRandomPlatform()}\n• Les publications récentes de ${getRandomOrganization()} sur ce sujet\n\nN'hésitez pas à me contacter si vous avez des questions plus spécifiques sur l'application de ces concepts dans votre contexte particulier.`,
        `\n\n## Perspectives d'avenir\n\nLes tendances émergentes dans le domaine de ${keywords[0] || 'ce sujet'} suggèrent une évolution vers ${getRandomTrends(keywords)}. Se tenir informé de ces développements sera crucial pour maintenir un avantage compétitif dans les années à venir.\n\nJe reste à votre disposition pour approfondir certains aspects particuliers qui vous intéresseraient.`,
        `\n\n## Application pratique\n\nPour transformer ces connaissances en résultats tangibles, commencez par implémenter ${keywords[1] || 'ces concepts'} dans un projet pilote. Mesurez rigoureusement les résultats et ajustez votre approche en fonction des données recueillies. Cette méthodologie itérative est la clé d'une amélioration continue dans ce domaine.`
      ];
    } else {
      conclusions = [
        `\n\n## La prochaine étape pour vous\n\nMaintenant que vous avez une compréhension approfondie de ${keywords[0] || 'ce sujet'}, je vous encourage à passer à l'action. Commencez petit, restez constant, et n'hésitez pas à partager vos expériences - nous avons tous à apprendre les uns des autres dans ce domaine passionnant!`,
        `\n\n## Un dernier conseil\n\nRappelez-vous que la maîtrise de ${keywords[0] || 'ce domaine'} est un marathon, pas un sprint. Célébrez vos petites victoires, apprenez de vos erreurs, et gardez toujours une curiosité insatiable. C'est cette mentalité de croissance qui fait la différence entre les amateurs et les véritables experts.`,
        `\n\n## Réflexion finale\n\nLe monde de ${keywords[0] || 'ce sujet'} est en constante évolution, et c'est ce qui le rend si fascinant. Restez ouvert aux nouvelles idées, mais ancrez-les dans les principes fondamentaux que nous avons explorés. Cette approche équilibrée vous servira bien, quelles que soient les tendances qui émergeront dans les années à venir.`
      ];
    }
    
    // Sélectionner aléatoirement une conclusion
    return conclusions[Math.floor(Math.random() * conclusions.length)];
  };

  // Fonctions utilitaires pour générer du contenu aléatoire
  const getRandomJournal = () => {
    const journals = [
      "Digital Marketing", "Consumer Psychology", "SEO Research", "Business Innovation", 
      "Applied Technology", "Data Science", "Market Analysis", "Contemporary Management",
      "Strategic Planning", "Organizational Studies", "Behavioral Economics", "Information Systems"
    ];
    return journals[Math.floor(Math.random() * journals.length)];
  };

  const getRandomBookTitle = (keywords: string[]) => {
    const titles = [
      `Maîtriser l'art de ${keywords[0] || 'ce domaine'}`, 
      `${keywords[0] || 'Ce sujet'}: Principes et applications avancées`, 
      `Le guide complet de l'expertise en ${keywords[0] || 'ce domaine'}`, 
      `${keywords[0] || 'Ce domaine'}: Fondamentaux et innovations`,
      `Méthodologies disruptives: Repenser ${keywords[0] || 'ce sujet'}`,
      `L'avenir de ${keywords[0] || 'ce domaine'}: Tendances et perspectives`
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const getRandomAuthor = () => {
    const authors = [
      "Dr. Sophie Martin", "Prof. Thomas Dubois", "Jean-Philippe Laurent", 
      "Marie Leclerc, Ph.D.", "Alexandre Moreau", "Dr. Claire Fontaine",
      "Prof. Marc Legrand", "Dr. Isabelle Rousseau", "François Mercier, MBA",
      "Prof. Émilie Dupont", "Dr. Laurent Bernard", "Sylvie Lefevre, Ph.D."
    ];
    return authors[Math.floor(Math.random() * authors.length)];
  };

  const getRandomResearchTitle = () => {
    const titles = [
      "Analyse comparative des approches modernes", 
      "Étude longitudinale sur l'efficacité des méthodes", 
      "Impact des nouvelles technologies sur les paradigmes traditionnels", 
      "Perspectives d'évolution dans un contexte globalisé",
      "Méta-analyse des facteurs de succès dans les cas d'implémentation",
      "Cadre conceptuel pour l'évaluation des approches innovantes"
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const getRandomPersonalInsight = () => {
    const insights = [
      "la théorie ne remplace jamais l'expérience terrain",
      "les solutions les plus simples sont souvent les plus efficaces",
      "l'adaptabilité est plus importante que la perfection initiale",
      "écouter véritablement les besoins spécifiques fait toute la différence",
      "combiner des approches traditionnelles avec des innovations ciblées donne les meilleurs résultats",
      "la mesure rigoureuse des résultats est essentielle à l'amélioration continue",
      "la cohérence dans l'application des principes est plus importante que les actions ponctuelles",
      "l'excellence provient de l'itération constante plutôt que de la recherche de la perfection dès le départ"
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };
  
  const getRandomMistake = (keywords: string[]) => {
    const mistakes = [
      `négliger l'importance de la recherche préliminaire`,
      `me précipiter dans l'implémentation sans plan clair`,
      `ignorer les retours d'expérience de mes pairs`,
      `suivre aveuglément les tendances sans évaluer leur pertinence`,
      `sous-estimer le temps nécessaire à la maîtrise des fondamentaux`,
      `trop me concentrer sur la théorie au détriment de la pratique`
    ];
    return mistakes[Math.floor(Math.random() * mistakes.length)];
  };
  
  const getRandomUniversity = () => {
    const universities = [
      "l'Université de la Sorbonne",
      "HEC Paris",
      "l'École Polytechnique",
      "Sciences Po",
      "l'Université Paris-Saclay",
      "l'INSEAD",
      "l'Université de Strasbourg",
      "l'École Normale Supérieure"
    ];
    return universities[Math.floor(Math.random() * universities.length)];
  };
  
  const getRandomPublisher = () => {
    const publishers = [
      "Éditions Dunod",
      "Eyrolles",
      "Pearson France",
      "Presses Universitaires de France",
      "Éditions Vuibert",
      "Éditions O'Reilly",
      "Éditions Gallimard",
      "Éditions Economica"
    ];
    return publishers[Math.floor(Math.random() * publishers.length)];
  };
  
  const getRandomConference = () => {
    const conferences = [
      "Advanced Business Strategies",
      "Digital Transformation",
      "Applied Research Methods",
      "Contemporary Marketing",
      "Organizational Excellence",
      "Innovation Management",
      "Strategic Leadership",
      "Future of Work"
    ];
    return conferences[Math.floor(Math.random() * conferences.length)];
  };
  
  const getRandomOrganization = () => {
    const organizations = [
      "l'Institut McKinsey Global",
      "la Harvard Business Review",
      "le MIT Technology Review",
      "l'OCDE",
      "le Boston Consulting Group",
      "Forrester Research",
      "Gartner Research",
      "la Fondation pour l'Innovation"
    ];
    return organizations[Math.floor(Math.random() * organizations.length)];
  };
  
  const getRandomTools = (keywords: string[]) => {
    const tools = [
      "Tableau, Power BI et Looker",
      "Python, R et SPSS",
      "Asana, Trello et Monday",
      "Adobe Creative Cloud, Figma et Sketch",
      "JIRA, GitLab et GitHub",
      "Salesforce, HubSpot et Marketo",
      "Google Analytics, SEMrush et Ahrefs",
      "Slack, Microsoft Teams et Zoom"
    ];
    return tools[Math.floor(Math.random() * tools.length)];
  };
  
  const getRandomKPIs = (keywords: string[]) => {
    const kpis = [
      "le taux de conversion, le temps d'engagement et la valeur vie client",
      "le ROI, le coût d'acquisition et le taux de rétention",
      "la croissance organique, le taux de rebond et les conversions secondaires",
      "la productivité des équipes, le NPS et la satisfaction client",
      "la qualité des leads, le taux de clics et la notoriété de marque",
      "le temps de cycle, la vélocité des équipes et la réduction des erreurs"
    ];
    return kpis[Math.floor(Math.random() * kpis.length)];
  };
  
  const getRandomTrends = (keywords: string[]) => {
    const trends = [
      "l'intégration de l'intelligence artificielle, l'automatisation avancée et l'analyse prédictive",
      "les approches centrées utilisateur, la personnalisation en temps réel et l'éthique des données",
      "les méthodologies agiles, le développement piloté par les tests et l'intégration continue",
      "l'approche mobile-first, l'accessibilité universelle et l'optimisation multiplateforme",
      "l'économie de l'attention, le marketing de contenu et l'engagement communautaire",
      "la durabilité environnementale, la responsabilité sociale et la transparence"
    ];
    return trends[Math.floor(Math.random() * trends.length)];
  };
  
  const getRandomPlatform = () => {
    const platforms = [
      "Coursera",
      "Udemy",
      "LinkedIn Learning",
      "edX",
      "OpenClassrooms",
      "FUN MOOC",
      "Khan Academy",
      "MasterClass"
    ];
    return platforms[Math.floor(Math.random() * platforms.length)];
  };

  const handleDownloadMarkdown = () => {
    if (!generatedAnswer) return;
    
    const blob = new Blob([generatedAnswer], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reponse-quora-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Réponse téléchargée en format Markdown");
  };

  const handleShareResponse = () => {
    if (!generatedAnswer) return;
    
    // Utiliser l'API Web Share si disponible
    if (navigator.share) {
      navigator.share({
        title: 'Ma réponse Quora',
        text: generatedAnswer
      }).then(() => {
        toast.success("Réponse partagée avec succès");
      }).catch((error) => {
        console.error("Erreur lors du partage:", error);
        toast.error("Erreur lors du partage");
      });
    } else {
      // Fallback si l'API Web Share n'est pas disponible
      navigator.clipboard.writeText(generatedAnswer);
      toast.success("Réponse copiée dans le presse-papiers pour partage");
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        className="flex flex-row items-center gap-2 py-3 px-4 text-center border-red-500 text-red-500 hover:bg-red-50 w-full"
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="h-5 w-5" />
        <span>Assistant Quora</span>
        <Badge variant="outline" className="ml-2 bg-red-50">Perfectionné</Badge>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#b92b27]">
              <MessageCircle className="h-5 w-5" />
              Assistant Quora
              <Badge variant="outline" className="ml-2 text-xs">v3.0</Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="ask">Poser une question</TabsTrigger>
                <TabsTrigger value="answer">Répondre à une question</TabsTrigger>
              </TabsList>
              
              <div className="mb-6">
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-600" />
                    Paramètres avancés de réponse
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <Switch 
                            id="include-references" 
                            checked={includeReferences} 
                            onCheckedChange={setIncludeReferences}
                          />
                          <Label htmlFor="include-references" className="text-sm text-gray-800">Inclure des références</Label>
                        </div>
                        <Badge variant="outline" className="bg-white text-red-600 border-red-200">Crédibilité +20%</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <Switch 
                            id="include-personal" 
                            checked={includePersonalTouch} 
                            onCheckedChange={setIncludePersonalTouch}
                          />
                          <Label htmlFor="include-personal" className="text-sm text-gray-800">Ajouter une touche personnelle</Label>
                        </div>
                        <Badge variant="outline" className="bg-white text-red-600 border-red-200">Authenticité +15%</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <Switch 
                            id="include-faq" 
                            checked={includeFAQ} 
                            onCheckedChange={setIncludeFAQ}
                          />
                          <Label htmlFor="include-faq" className="text-sm text-gray-800">Section FAQ</Label>
                        </div>
                        <Badge variant="outline" className="bg-white text-red-600 border-red-200">Exhaustivité +18%</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <Switch 
                            id="include-stats" 
                            checked={includeStatistics} 
                            onCheckedChange={setIncludeStatistics}
                          />
                          <Label htmlFor="include-stats" className="text-sm text-gray-800">Ajouter des statistiques</Label>
                        </div>
                        <Badge variant="outline" className="bg-white text-red-600 border-red-200">Persuasion +22%</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="expertise-level" className="text-sm text-gray-800 mb-2 block">Niveau d'expertise</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Standard</span>
                          <Slider
                            id="expertise-level"
                            defaultValue={expertiseLevel}
                            max={100}
                            step={10}
                            onValueChange={setExpertiseLevel}
                            className="flex-1"
                          />
                          <span className="text-xs text-gray-500">Expert</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-800 mb-2 block">Style de réponse</Label>
                        <RadioGroup value={responseStyle} onValueChange={(value: any) => setResponseStyle(value)} className="flex space-x-2">
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="analytical" id="analytical" />
                            <Label htmlFor="analytical" className="text-xs">Analytique</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="narrative" id="narrative" />
                            <Label htmlFor="narrative" className="text-xs">Narratif</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="instructional" id="instructional" />
                            <Label htmlFor="instructional" className="text-xs">Instructif</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-800 mb-2 block">Ton</Label>
                        <RadioGroup value={toneStyle} onValueChange={(value: any) => setToneStyle(value)} className="flex space-x-2">
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="professional" id="professional" />
                            <Label htmlFor="professional" className="text-xs">Professionnel</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="conversational" id="conversational" />
                            <Label htmlFor="conversational" className="text-xs">Conversationnel</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="provocative" id="provocative" />
                            <Label htmlFor="provocative" className="text-xs">Provocateur</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <TabsContent value="ask">
                <QuoraQuestionForm onSubmit={handleQuoraSubmit} loading={isGenerating} />
                
                {generatedAnswer && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium">Réponse générée</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedAnswer);
                            toast.success("Réponse copiée dans le presse-papiers");
                          }}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleDownloadMarkdown}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleShareResponse}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Partager
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded border text-gray-700 whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                      {generatedAnswer}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100 text-sm text-blue-800">
                      <p className="font-medium mb-1 flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        Conseils pour maximiser votre impact sur Quora:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Publiez votre réponse tôt le matin ou en début de soirée pour plus de visibilité</li>
                        <li>Engagez-vous avec les commentaires pour améliorer votre positionnement algorithmique</li>
                        <li>Ajoutez 1-2 images pertinentes pour améliorer l'engagement visuel</li>
                        <li>Intégrez vos liens de manière naturelle pour maximiser les clics</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open("https://quora.com", "_blank")}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ouvrir Quora
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`https://quora.com/search?q=${encodeURIComponent(lastQuestion)}`, "_blank")}
                        className="flex items-center gap-1"
                      >
                        <BookOpen className="h-4 w-4" />
                        Rechercher sur Quora
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Action pour planifier la publication
                          toast.success("Fonctionnalité de planification à venir");
                        }}
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-4 w-4" />
                        Planifier
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="answer">
                <QuoraAnswerForm onSubmit={handleQuoraSubmit} loading={isGenerating} />
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuoraButton;
