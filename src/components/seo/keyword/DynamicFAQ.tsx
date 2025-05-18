
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageSquare, FileSearch, Search } from 'lucide-react';

interface DynamicFAQProps {
  keyword: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const DynamicFAQ: React.FC<DynamicFAQProps> = ({ keyword }) => {
  // Génère des questions-réponses dynamiques basées sur le mot-clé
  const generateFAQs = (keyword: string): FAQItem[] => {
    const cleanKeyword = keyword.toLowerCase().trim();
    
    // Questions de base adaptées à tous les mots-clés (maintenant 8 minimum)
    const basicQuestions: FAQItem[] = [
      {
        question: `Comment optimiser mon contenu pour le mot-clé "${keyword}" ?`,
        answer: `Pour optimiser votre contenu pour "${keyword}", commencez par inclure ce mot-clé dans votre titre, méta description, et premiers paragraphes. Utilisez des variantes et synonymes naturellement dans votre texte, créez du contenu approfondi et de qualité qui répond aux questions des utilisateurs, et assurez-vous que votre page se charge rapidement. N'oubliez pas d'utiliser des sous-titres (H2, H3) contenant des mots-clés pertinents.`
      },
      {
        question: `Quelle est la difficulté pour se positionner sur "${keyword}" ?`,
        answer: `La difficulté pour se positionner sur "${keyword}" dépend de plusieurs facteurs, notamment la concurrence existante, l'autorité de votre domaine, et la qualité de votre contenu. Analysez les sites qui se positionnent déjà pour ce mot-clé, évaluez leur autorité de domaine et la qualité de leur contenu. Créez ensuite un contenu plus complet, plus informatif et mieux structuré pour vous démarquer.`
      },
      {
        question: `Comment suivre mon positionnement pour "${keyword}" ?`,
        answer: `Pour suivre votre positionnement sur "${keyword}", utilisez des outils comme Google Search Console, SEMrush, Ahrefs, ou SISTRIX. Ces plateformes vous permettent de surveiller vos positions dans les résultats de recherche au fil du temps, d'analyser les tendances et d'identifier les opportunités d'amélioration. Établissez un suivi régulier (hebdomadaire ou mensuel) pour bien comprendre l'évolution de vos performances.`
      },
      {
        question: `Quels sont les meilleurs outils pour rechercher des mots-clés similaires à "${keyword}" ?`,
        answer: `Pour trouver des mots-clés similaires à "${keyword}", plusieurs outils performants sont disponibles : Google Keyword Planner (gratuit avec un compte Google Ads), SEMrush, Ahrefs, Ubersuggest, ou encore AnswerThePublic. Ces plateformes vous permettent d'identifier les variantes, les questions fréquentes et les termes associés avec leurs volumes de recherche respectifs. N'oubliez pas de consulter également les suggestions automatiques de Google et la section "Les internautes ont également cherché".`
      },
      {
        question: `Comment mesurer le ROI de ma stratégie SEO pour "${keyword}" ?`,
        answer: `Pour mesurer le ROI de votre stratégie SEO sur "${keyword}", commencez par configurer un suivi précis des conversions dans Google Analytics. Calculez ensuite le coût total de votre stratégie SEO (temps, ressources, outils), puis divisez vos revenus attribuables au SEO par ce coût. Utilisez également des KPIs complémentaires comme l'évolution du trafic organique, le taux de conversion des visiteurs venant de recherches organiques, et le classement moyen pour vos mots-clés cibles. Un suivi sur 6 à 12 mois est nécessaire pour obtenir des données fiables.`
      },
      {
        question: `Quelle longueur de contenu est idéale pour se positionner sur "${keyword}" ?`,
        answer: `La longueur idéale pour se positionner sur "${keyword}" dépend du type de requête et de l'intention de recherche. En général, les contenus approfondis de 1500 à 2500 mots se positionnent mieux pour des requêtes informatives. Analysez les pages qui se classent déjà dans le top 10 pour ce mot-clé : leur longueur moyenne peut servir de référence. Cependant, privilégiez toujours la qualité à la quantité - un contenu plus court mais plus pertinent et mieux structuré peut surpasser un contenu long mais de moindre qualité.`
      },
      {
        question: `Comment créer une stratégie de netlinking efficace pour "${keyword}" ?`,
        answer: `Pour une stratégie de netlinking efficace autour de "${keyword}", commencez par créer un contenu de qualité et original. Ensuite, identifiez des sites de qualité dans votre niche et proposez des collaborations : guest posting, interviews d'experts, ou participations à des études. Surveillez les mentions de votre marque pour transformer les citations non liées en backlinks. Utilisez des outils comme HARO pour répondre aux demandes des journalistes. Évitez l'achat de liens à grande échelle et privilégiez les liens naturels et contextuels. La qualité et la pertinence des backlinks sont bien plus importantes que leur quantité.`
      },
      {
        question: `Comment cibler efficacement "${keyword}" sans sur-optimiser mon contenu ?`,
        answer: `Pour cibler "${keyword}" sans sur-optimiser, adoptez une approche naturelle en utilisant des variantes et des synonymes. Structurez votre contenu autour de sujets connexes plutôt que de vous concentrer uniquement sur le mot-clé principal. Utilisez des mots-clés sémantiquement liés, créez un contenu qui répond réellement aux questions des utilisateurs, et respectez les principes d'écriture journalistique. L'optimisation moderne se concentre davantage sur l'intention de recherche et la satisfaction de l'utilisateur que sur la densité de mots-clés. Les contenus naturels et informatifs sont mieux classés que les textes sur-optimisés.`
      }
    ];
    
    // Questions spécifiques selon le type de mot-clé
    let specificQuestions: FAQItem[] = [];
    
    if (cleanKeyword.includes('achat') || cleanKeyword.includes('acheter') || cleanKeyword.includes('prix')) {
      specificQuestions = [
        {
          question: `Quels sont les meilleurs mots-clés transactionnels associés à "${keyword}" ?`,
          answer: `Les meilleurs mots-clés transactionnels associés à "${keyword}" incluent souvent des termes comme "acheter", "prix", "promotion", "pas cher", ou "meilleur". Ciblez ces mots-clés pour attirer des utilisateurs prêts à effectuer un achat. Intégrez-les dans vos pages de produits et optimisez vos calls-to-action pour maximiser les conversions.`
        },
        {
          question: `Comment calculer le ROI d'une campagne SEA pour "${keyword}" ?`,
          answer: `Pour calculer le ROI d'une campagne SEA sur "${keyword}", divisez les profits générés par vos dépenses publicitaires, puis multipliez par 100. Suivez attentivement les conversions, le coût par clic et le taux de conversion pour ajuster votre stratégie. Utilisez des outils comme Google Analytics et Google Ads pour collecter ces données de manière précise.`
        },
        {
          question: `Quelle est la meilleure période pour lancer une campagne sur "${keyword}" ?`,
          answer: `Pour déterminer la meilleure période pour une campagne sur "${keyword}", analysez les tendances saisonnières avec Google Trends. Identifiez les pics d'intérêt annuels et hebdomadaires. Pour les produits ou services liés à ce mot-clé, examinez également vos données historiques de ventes et de trafic. Planifiez votre campagne 2-4 semaines avant les pics de demande anticipés pour maximiser la visibilité pendant la période de recherche active des consommateurs.`
        }
      ];
    } else if (cleanKeyword.includes('comment') || cleanKeyword.includes('guide') || cleanKeyword.includes('tutoriel')) {
      specificQuestions = [
        {
          question: `Quelles sont les questions les plus posées autour de "${keyword}" ?`,
          answer: `Les questions les plus posées autour de "${keyword}" peuvent être découvertes via des outils comme AnswerThePublic, AlsoAsked, ou l'outil de recherche de Google (section "Les internautes ont également demandé"). Créez du contenu qui répond précisément à ces questions pour augmenter votre pertinence aux yeux des moteurs de recherche et attirer un trafic qualifié.`
        },
        {
          question: `Comment structurer un article informatif sur "${keyword}" ?`,
          answer: `Un article informatif sur "${keyword}" devrait commencer par une introduction claire établissant le problème, puis présenter les solutions de façon logique et progressive. Utilisez des sous-titres H2 et H3, des listes à puces, des images explicatives, et des exemples concrets. Concluez avec un résumé des points clés et une invitation à l'action. Cette structure facilite la lecture et améliore votre référencement.`
        },
        {
          question: `Quels formats de contenu sont les plus efficaces pour expliquer "${keyword}" ?`,
          answer: `Les formats les plus efficaces pour expliquer "${keyword}" dépendent de la complexité du sujet. Pour des concepts techniques, les tutoriels vidéo, les infographies étape par étape et les guides illustrés sont particulièrement performants. Les webinaires interactifs et podcasts peuvent approfondir des aspects spécifiques. Pour un contenu exhaustif, combinez plusieurs formats: article détaillé comme contenu principal, complété par des vidéos explicatives courtes et des infographies partageables sur les réseaux sociaux.`
        }
      ];
    } else if (cleanKeyword.includes('vs') || cleanKeyword.includes('comparatif') || cleanKeyword.includes('meilleur')) {
      specificQuestions = [
        {
          question: `Comment créer un comparatif efficace autour de "${keyword}" ?`,
          answer: `Pour créer un comparatif efficace sur "${keyword}", identifiez d'abord les critères de comparaison les plus pertinents pour votre audience. Utilisez des tableaux comparatifs clairs, des listes de pros/cons, et des évaluations objectives. Ajoutez des témoignages ou avis d'utilisateurs pour renforcer la crédibilité, et concluez avec des recommandations personnalisées selon différents profils d'utilisateurs.`
        },
        {
          question: `Quels sont les formats de contenu les plus efficaces pour "${keyword}" ?`,
          answer: `Pour "${keyword}", les formats les plus efficaces incluent les tableaux comparatifs, les infographies, les vidéos de démonstration, et les examens détaillés avec captures d'écran. Les avis basés sur des tests réels et les guides d'achat sont également très appréciés. Diversifiez vos formats de contenu pour maximiser la visibilité et répondre aux différentes préférences de consommation de contenu.`
        },
        {
          question: `Comment rester objectif dans un article comparatif sur "${keyword}" ?`,
          answer: `Pour maintenir l'objectivité dans un comparatif sur "${keyword}", établissez des critères d'évaluation clairs et mesurables avant de commencer votre analyse. Utilisez des données vérifiables plutôt que des opinions subjectives. Présentez les avantages et inconvénients de chaque option de manière équilibrée. Mentionnez transparemment vos méthodes de test et sources d'information. Si possible, incluez des témoignages divers et des avis contradictoires pour offrir une perspective complète aux lecteurs.`
        }
      ];
    }
    
    // Combiner et renvoyer toutes les questions
    return [...basicQuestions, ...specificQuestions];
  };

  const faqs = generateFAQs(keyword);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          FAQ générée pour "{keyword}"
        </CardTitle>
      </CardHeader>
      <CardContent>
        {keyword ? (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Recherchez un mot-clé pour générer une FAQ pertinente</p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
          <p className="flex items-center">
            <FileSearch className="h-4 w-4 mr-2" />
            Questions générées automatiquement basées sur l'analyse des requêtes fréquentes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicFAQ;
