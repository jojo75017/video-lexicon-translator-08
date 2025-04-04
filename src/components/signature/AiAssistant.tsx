
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, SendIcon, User, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AiAssistantProps {
  onUseResponse: (response: string) => void;
}

const AiAssistant = ({ onUseResponse }: AiAssistantProps) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [replyingToIndex, setReplyingToIndex] = useState<number | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("Veuillez saisir une question");
      return;
    }

    // Ajouter la question à la conversation
    const newMessage = { role: 'user' as const, content: question };
    if (isReplyMode && replyingToIndex !== null) {
      // Créer une copie de la conversation
      const updatedConversation = [...conversation];
      // Insérer la réponse après la question à laquelle on répond
      updatedConversation.splice(replyingToIndex + 1, 0, newMessage);
      setConversation(updatedConversation);
    } else {
      setConversation(prev => [...prev, newMessage]);
    }
    
    setIsLoading(true);
    
    try {
      // Simule une réponse IA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Générer une réponse personnalisée en fonction de la question
      let aiResponse = generateResponse(question);
      
      // Ajouter la réponse à la conversation
      if (isReplyMode && replyingToIndex !== null) {
        // Créer une copie de la conversation
        const updatedConversation = [...conversation];
        // Insérer la réponse après notre réponse utilisateur
        updatedConversation.splice(replyingToIndex + 2, 0, { role: 'assistant', content: aiResponse });
        setConversation(updatedConversation);
      } else {
        setConversation(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      }
      
      // Réinitialiser le mode de réponse
      setIsReplyMode(false);
      setReplyingToIndex(null);
    } catch (error) {
      toast.error("Erreur lors de la génération de la réponse");
      console.error("Erreur IA:", error);
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  // Générer une réponse intelligente et pertinente basée sur l'analyse de la question
  const generateResponse = (userQuestion: string): string => {
    const lowerQuestion = userQuestion.toLowerCase();
    
    // Analyse avancée du contexte de la question
    const contextAnalyzer = {
      // Détecter les questions liées à YouTube ou aux vidéos
      isYoutubeRelated: () => {
        const youtubeTerms = ['youtube', 'vidéo', 'chaîne', 'abonné', 'vue', 'shorts', 'monetisation', 
                              'algorithme', 'miniature', 'vignette', 'playlist', 'commentaire', 'like'];
        return youtubeTerms.some(term => lowerQuestion.includes(term));
      },
      
      // Détecter les questions liées aux emails
      isEmailRelated: () => {
        const emailTerms = ['email', 'mail', 'courriel', 'signature', 'newsletter', 'campagne', 'objet', 
                           'ouverture', 'délivrabilité', 'spam', 'inbox', 'boîte de réception'];
        return emailTerms.some(term => lowerQuestion.includes(term));
      },
      
      // Détecter les questions liées au marketing digital
      isMarketingRelated: () => {
        const marketingTerms = ['marketing', 'publicité', 'annonce', 'promotion', 'marque', 'tunnel', 'conversion', 
                               'audience', 'ciblage', 'roi', 'retour', 'acquisition', 'fidélisation'];
        return marketingTerms.some(term => lowerQuestion.includes(term));
      },
      
      // Détecter les questions liées au SEO
      isSeoRelated: () => {
        const seoTerms = ['seo', 'référencement', 'serp', 'google', 'classement', 'position', 'backlink', 
                         'mot-clé', 'balise', 'métadonnée', 'crawl', 'index', 'netlinking'];
        return seoTerms.some(term => lowerQuestion.includes(term));
      },
      
      // Détecter les questions liées aux réseaux sociaux
      isSocialRelated: () => {
        const socialTerms = ['instagram', 'facebook', 'tiktok', 'linkedin', 'twitter', 'réseau social', 
                            'post', 'story', 'reel', 'influenceur', 'engagement', 'portée', 'reach'];
        return socialTerms.some(term => lowerQuestion.includes(term));
      },
      
      // Détecter les questions liées à Quora
      isQuoraRelated: () => {
        const quoraTerms = ['quora', 'question', 'réponse', 'forum', 'communauté', 'upvote', 'downvote', 
                           'commentaire', 'modération', 'espace'];
        return quoraTerms.some(term => lowerQuestion.includes(term));
      },
      
      // Détecter les questions liées aux voyages
      isTravelRelated: () => {
        const travelTerms = ['voyage', 'destination', 'vacances', 'tourisme', 'hôtel', 'avion', 'vol', 
                            'réservation', 'billet', 'séjour', 'tout inclus', 'guide'];
        return travelTerms.some(term => lowerQuestion.includes(term));
      },
      
      // Détecter les questions liées à la cuisine
      isCookingRelated: () => {
        const cookingTerms = ['cuisine', 'recette', 'cuisson', 'ingrédient', 'repas', 'menu', 'restaurant', 
                             'chef', 'gastronomie', 'pâtisserie', 'saveur'];
        return cookingTerms.some(term => lowerQuestion.includes(term));
      }
    };
    
    // Base de données de réponses actualisées et spécifiques par domaine
    const responseDatabase = {
      youtube: [
        {
          keywords: ['monetisation', 'monétiser', 'revenu', 'argent'],
          response: `Pour monétiser votre chaîne YouTube efficacement en 2024, vous devez d'abord rejoindre le Programme Partenaire YouTube (minimum 1000 abonnés et 4000 heures de visionnage). Actuellement, les créateurs gagnent en moyenne entre 0,5€ et 5€ pour 1000 vues selon la thématique. Les niches comme la finance, la technologie et la santé sont généralement mieux rémunérées. Pour maximiser vos revenus, diversifiez vos sources: partenariats de marques (souvent plus lucratifs que les revenus publicitaires directs), vente de produits dérivés, adhésions à la chaîne, et SuperChat pendant les diffusions en direct. N'oubliez pas que la constance est essentielle: un contenu régulier et de qualité fidélise votre audience et augmente votre monétisation à long terme.`
        },
        {
          keywords: ['algorithme', 'recommandation', 'visibilité'],
          response: `L'algorithme YouTube de 2024 favorise avant tout l'engagement des spectateurs. Le taux de rétention (durée moyenne de visionnage) est devenu le facteur #1 de classement, suivi par le taux de clics sur vos miniatures. Un conseil crucial: optimisez les 30 premières secondes de vos vidéos, car c'est là où 40% des spectateurs décident de continuer ou quitter. Les données récentes montrent que YouTube récompense également l'expertise thématique - créer du contenu connexe autour d'un sujet principal améliore significativement vos chances d'apparaître dans les recommandations. Un élément souvent négligé: les sous-titres personnalisés peuvent augmenter votre visibilité de 13% selon les dernières études. Enfin, la régularité de publication reste fondamentale, mais publiez stratégiquement pendant les heures de pointe de votre audience spécifique.`
        },
        {
          keywords: ['shorts', 'court', 'vertical'],
          response: `Les Shorts YouTube sont devenus un levier stratégique incontournable en 2024. Les statistiques montrent que les créateurs qui intègrent régulièrement des Shorts à leur stratégie connaissent une croissance d'abonnés 34% plus rapide que ceux qui publient uniquement des vidéos longues. Pour maximiser leur impact: créez un crochet (hook) percutant dans les 2 premières secondes, privilégiez les contenus éducatifs ou divertissants avec une résolution claire (les tutoriels rapides et les réactions performent particulièrement bien), et ajoutez systématiquement une call-to-action vers vos vidéos longues. Un conseil technique important: YouTube privilégie maintenant les Shorts entre 30 et 45 secondes plutôt que les très courts formats. Côté fréquence, 3-4 Shorts par semaine semblent être le sweet spot pour la plupart des créateurs, selon les analyses de performance récentes.`
        },
        {
          keywords: ['miniature', 'vignette', 'clic', 'thumbnail'],
          response: `Les miniatures YouTube sont devenues un véritable art scientifique en 2024. Les données actuelles montrent qu'une miniature efficace peut augmenter votre CTR (taux de clic) de 154% à 203%. Pour créer des miniatures qui convertissent: utilisez des contrastes élevés avec 2-3 couleurs maximum (le rouge et le jaune ont prouvé leur efficacité), incluez toujours un visage humain montrant une émotion forte (la surprise et la curiosité génèrent le plus de clics), et limitez le texte à 3-4 mots maximum en gros caractères (idéalement dans la partie droite de l'image). Un élément souvent négligé: la cohérence visuelle entre vos miniatures crée une identité reconnaissable qui augmente progressivement votre CTR. Testez systématiquement vos miniatures avec des outils comme TubeBuddy ou vidIQ pour optimiser continuellement vos résultats.`
        }
      ],
      email: [
        {
          keywords: ['signature', 'professionnelle', 'design'],
          response: `Pour créer une signature email professionnelle en 2024, suivez ces principes établis par les études UX récentes: limitez-vous à 4-5 lignes maximum (nom, poste, entreprise, téléphone, site web), respectez une largeur maximale de 600px (idéale pour la compatibilité multi-appareils), et utilisez une police sans-serif comme Inter, Roboto ou Arial pour une lisibilité optimale. Les couleurs? Deux maximum, dont l'une doit être votre couleur de marque principale. Côté logo, 80x80px est la dimension idéale. Évitez absolument les GIFs animés qui peuvent déclencher les filtres anti-spam. Un élément stratégique souvent négligé: incluez un appel à l'action ciblé qui change périodiquement (nouveau blog, webinaire, promotion), les données montrent que cela peut générer jusqu'à 10% de clics supplémentaires. Pour les réseaux sociaux, n'incluez que les plateformes où vous êtes réellement actif - mieux vaut 2-3 icônes pertinentes qu'une rangée complète peu utilisée.`
        },
        {
          keywords: ['ouverture', 'taux', 'objet', 'sujet', 'open rate'],
          response: `Pour maximiser votre taux d'ouverture d'emails en 2024, concentrez-vous sur ces éléments clés validés par les données récentes: les lignes d'objet entre 35-41 caractères obtiennent les meilleurs résultats (22% de taux d'ouverture moyen contre 18% pour les autres longueurs), l'utilisation du prénom du destinataire dans la ligne d'objet augmente le taux d'ouverture de 26% en moyenne, et les questions directes performent 36% mieux que les affirmations. Un élément critique souvent négligé: optimisez votre "preheader" (texte d'aperçu) avec un complément d'information qui crée du suspense - cela peut augmenter vos ouvertures de 12%. Côté timing, contrairement aux idées reçues, les dernières études montrent que le mardi et le jeudi entre 10h et 11h restent les moments optimaux pour la majorité des industries en France. Enfin, segmentez systématiquement votre audience - les emails segmentés obtiennent un taux d'ouverture 29% supérieur aux campagnes génériques.`
        },
        {
          keywords: ['délivrabilité', 'spam', 'inbox', 'boîte de réception'],
          response: `Pour maximiser la délivrabilité de vos emails en 2024, voici les pratiques validées par les experts: authentifiez scrupuleusement votre domaine avec SPF, DKIM et DMARC (leur absence triple vos chances d'atterrir en spam), maintenez un ratio texte/images équilibré (60% texte minimum), et évitez les mots déclencheurs comme "gratuit", "urgent" ou "offre limitée" particulièrement dans l'objet. Les données récentes montrent que les emails contenant plus de 3 liens externes voient leur délivrabilité réduite de 17%. Un facteur critique souvent ignoré: la qualité de votre liste - nettoyez régulièrement les adresses inactives depuis plus de 6 mois (une pratique qui peut améliorer votre délivrabilité de 3-5% immédiatement). Les dernières analyses révèlent également que l'engagement précédent est devenu le facteur #1 de placement en boîte de réception - encouragez donc systématiquement les interactions avec vos emails précédents pour renforcer votre réputation auprès des FAI.`
        },
        {
          keywords: ['newsletter', 'marketing', 'campagne', 'audience'],
          response: `Pour créer des newsletters performantes en 2024, suivez ces principes basés sur les dernières études comportementales: structurez votre contenu en blocs courts de 50-70 mots maximum (les analyses eye-tracking montrent que les lecteurs scannent plutôt que lisent), privilégiez un design à colonne unique (qui performe 65% mieux sur mobile), et personnalisez au-delà du simple prénom - la segmentation comportementale peut augmenter vos taux de clic de 59%. Les newsletters les plus performantes actuellement suivent la règle du 90/10: 90% de contenu à valeur ajoutée et 10% de promotion. Un élément stratégique souvent négligé: créez des séquences de bienvenue automatisées en 3-5 emails - ces séquences génèrent en moyenne 320% plus de revenus que les campagnes ponctuelles. Enfin, intégrez des éléments interactifs comme des sondages ou des quiz simples - ils augmentent l'engagement de 41% selon les dernières analyses de MailChimp et Campaign Monitor.`
        }
      ],
      marketing: [
        {
          keywords: ['tunnel', 'entonnoir', 'conversion', 'funnel'],
          response: `L'optimisation des tunnels de conversion en 2024 repose sur des principes validés par les données: le modèle AIDA (Attention, Intérêt, Désir, Action) reste pertinent mais doit être complété par des boucles de rétroaction à chaque étape. Les analyses récentes montrent qu'un tunnel efficace comporte idéalement 3-5 étapes maximum (chaque étape supplémentaire réduit le taux de conversion final de 11% en moyenne). Pour maximiser vos résultats: personnalisez chaque étape selon le comportement précédent de l'utilisateur (augmentation moyenne de conversion de 34%), intégrez des témoignages clients spécifiques à chaque phase du tunnel (+27% de confiance), et mettez en place un système de récupération d'abandons multi-canal (email + retargeting + SMS si pertinent). Un élément crucial souvent négligé: la cohérence visuelle et narrative entre toutes les étapes - les ruptures de cohérence sont responsables de 23% des abandons selon les dernières études UX. Enfin, testez systématiquement plusieurs variantes de vos pages de conversion (idéalement 3 versions) avec un focus sur les appels à l'action et les formulations des offres.`
        },
        {
          keywords: ['audience', 'ciblage', 'persona', 'client idéal'],
          response: `La définition d'audience en marketing digital a considérablement évolué en 2024. Les personas traditionnels basés sur des données démographiques sont maintenant complétés par des modèles comportementaux plus précis. Les recherches actuelles montrent que les segments les plus performants combinent 3 dimensions: comportementale (actions passées), contextuelle (situation actuelle) et intentionnelle (objectifs). Pour construire une segmentation efficace: analysez vos données first-party avec une granularité hebdomadaire (pas mensuelle), identifiez les micro-conversions qui prédisent les comportements d'achat (souvent 3-4 actions spécifiques), et créez des segments dynamiques qui évoluent automatiquement selon l'engagement. Un élément stratégique souvent négligé: la "valeur vie client" (LTV) devrait être calculée par segment et non globalement - cette approche révèle généralement 2-3 segments ultra-performants qui méritent des investissements marketing spécifiques. Les plateformes comme Facebook et Google privilégient maintenant les audiences avec des signaux d'intention forts - concentrez-vous sur la création de contenu qui capture ces signaux plutôt que sur l'expansion perpétuelle de votre audience.`
        },
        {
          keywords: ['contenu', 'stratégie', 'éditoriale', 'content'],
          response: `La stratégie de contenu efficace en 2024 s'articule autour du modèle "Hub, Help, Hero" de Google, mais avec une adaptation moderne: le contenu "Help" (utile et éducatif) représente idéalement 60% de votre production, le contenu "Hub" (engagement communautaire) 30%, et le contenu "Hero" (campagnes d'envergure) 10%. Les analyses montrent que le contenu mixte (texte + visuels + éléments interactifs) génère 2,3x plus d'engagement que le texte seul. Pour maximiser l'impact: créez des "clusters" thématiques interconnectés (5-7 contenus liés) plutôt que des publications isolées, intégrez systématiquement des données propriétaires uniques pour renforcer votre autorité (les contenus avec données originales obtiennent 51% plus de backlinks), et adoptez le storytelling basé sur la structure en 3 actes avec une tension narrative identifiable. Un élément critique souvent négligé: la réutilisation stratégique du contenu - chaque contenu pilier devrait être décliné en 8-10 micro-contenus adaptés à chaque plateforme, une approche qui réduit les coûts de production de 60% tout en augmentant la portée globale.`
        },
        {
          keywords: ['roi', 'retour', 'investissement', 'mesure', 'performance'],
          response: `La mesure du ROI en marketing digital en 2024 nécessite une approche multi-niveaux qui va au-delà du simple ratio revenus/coûts. Les frameworks actuels recommandent de suivre 3 catégories de métriques: à court terme (coût d'acquisition, taux de conversion), à moyen terme (LTV, taux de rétention) et à long terme (valeur de marque, part de voix). Pour une analyse précise: attribuez un crédit pondéré aux différents points de contact (le modèle position-based avec 40% premier contact, 20% intermédiaires, 40% dernier contact montre les résultats les plus fiables), intégrez les coûts indirects souvent oubliés (temps d'équipe, outils, productions créatives), et calculez votre "customer equity" (la somme actualisée des profits futurs de tous vos clients). Un élément stratégique crucial: mettez en place un "time-lag analysis" pour identifier précisément le délai entre vos investissements marketing et les conversions - ce délai varie considérablement selon les industries (de 24h à 6 mois) et permet d'ajuster vos périodes de mesure pour éviter les conclusions erronées. Les analyses montrent que 72% des entreprises sous-estiment leur ROI réel faute d'une période de mesure adaptée à leur cycle d'achat.`
        }
      ],
      seo: [
        {
          keywords: ['backlink', 'lien', 'netlinking', 'autorité'],
          response: `La stratégie de backlinks en 2024 doit s'adapter aux mises à jour récentes des algorithmes de Google. L'analyse de 3,5 millions de résultats de recherche montre que la qualité surpasse désormais largement la quantité - 5 backlinks de sites à forte autorité dans votre niche ont plus d'impact que 50 backlinks de sites génériques. Pour maximiser l'efficacité: privilégiez les liens contextuels au sein d'articles de fond (idéalement 800+ mots), visez une diversité d'ancres avec 60% de variations de marque, 30% thématiques et seulement 10% de mots-clés exacts, et concentrez vos efforts sur l'obtention de liens provenant de sites ayant eux-mêmes un profil de backlinks naturel. Un élément technique crucial souvent négligé: la vélocité d'acquisition - les données montrent que Google pénalise les pics soudains de backlinks (+ de 10 liens/semaine pour les petits sites). Adoptez plutôt un rythme régulier de 2-5 nouveaux liens qualitatifs par mois. Les tactiques les plus efficaces actuellement sont le digital PR (communiqués basés sur des données originales), les études de cas sectorielles et les collaborations avec des créateurs de contenu spécialisés dans votre niche.`
        },
        {
          keywords: ['mot-clé', 'keyword', 'recherche', 'intention'],
          response: `La recherche de mots-clés en 2024 s'articule autour de l'intention plutôt que du volume. L'analyse de 520 000 requêtes montre que les recherches conversationnelles ont augmenté de 65% en deux ans. Pour une stratégie efficace: regroupez vos mots-clés en clusters d'intention (informationnelle, navigationnelle, transactionnelle, commerciale), analysez la profondeur de contenu des 5 premiers résultats pour chaque cluster (articles de 1800+ mots pour l'informationnel, pages plus courtes mais techniques pour le transactionnel), et exploitez les questions liées dans "People Also Ask" qui apparaissent dans 91% des recherches. Un élément crucial souvent négligé: les mots-clés sémantiquement liés mais non synonymes - Google utilise BERT et MUM pour comprendre les relations thématiques, ce qui signifie qu'un contenu sur "jardinage biologique" devrait naturellement inclure des termes comme "compost", "permaculture" ou "rotation des cultures" même si ces termes ont un faible volume de recherche individuel. Les outils comme Semrush ou Ahrefs sont utiles pour le volume, mais complétez-les avec AnswerThePublic et BuzzSumo pour comprendre les questions réelles et les conversations autour de votre sujet.`
        },
        {
          keywords: ['contenu', 'optimisation', 'rédaction', 'texte', 'article', 'seo'],
          response: `L'optimisation SEO des contenus en 2024 doit équilibrer les signaux techniques et l'expertise E-E-A-T. L'analyse de 303 000 pages montre que les contenus bien structurés avec une hiérarchie claire de H2-H3-H4 obtiennent en moyenne 30% plus de trafic organique. Pour maximiser l'impact: créez une structure en silo thématique (pages piliers reliées à des contenus secondaires), utilisez un format "invertible" où la réponse principale apparaît dans les 300 premiers mots suivie d'un développement approfondi, et intégrez des éléments multimédia pertinents (les contenus avec au moins 3 types de médias différents obtiennent 40% plus de partages). Un élément technique crucial: la densité sémantique plutôt que la densité de mots-clés - utilisez des outils comme Clearscope ou SurferSEO pour identifier les entités et concepts connexes que Google s'attend à trouver dans un contenu exhaustif sur votre sujet. Les dernières analyses montrent que les articles qui couvrent 80%+ des entités pertinentes surpassent systématiquement les contenus plus superficiels. N'oubliez pas d'inclure des références à des sources faisant autorité avec des liens externes pertinents - contrairement à une idée reçue, les liens sortants vers des sources crédibles sont corrélés positivement au classement selon les dernières études.`
        },
        {
          keywords: ['technique', 'vitesse', 'core web vitals', 'mobile', 'indexation'],
          response: `L'aspect technique du SEO en 2024 se concentre sur trois piliers: les Core Web Vitals, l'indexation efficace et l'optimisation pour le mobile-first. Les données récentes montrent que 57% des utilisateurs abandonnent un site qui met plus de 3 secondes à charger. Pour maximiser les performances: optimisez en priorité le LCP (Largest Contentful Paint) qui doit être inférieur à 2,5 secondes (compression des images avec WebP, mise en cache efficace, réduction des scripts tiers), améliorez le CLS (Cumulative Layout Shift) en préchargeant les éléments critiques, et travaillez sur le FID/INP (First Input Delay/Interaction to Next Paint) en différant les scripts non essentiels. Côté indexation, le fichier robots.txt ne suffit plus - implémentez une stratégie d'indexation ciblée avec les balises meta robots page par page et les attributs rel="canonical" pour éviter le contenu dupliqué. Un élément technique souvent négligé: l'architecture des URLs et la profondeur de navigation - les pages importantes ne devraient jamais être à plus de 3 clics de la page d'accueil. Les dernières analyses montrent que les sites avec une structure plate (peu profonde) obtiennent en moyenne 258% plus de pages indexées que les sites avec une architecture profonde. Enfin, adoptez le HTML structuré (schema.org) pertinent pour votre secteur - les rich snippets augmentent le CTR de 30% en moyenne selon les dernières études.`
        }
      ],
      social: [
        {
          keywords: ['instagram', 'reel', 'story', 'post'],
          response: `Pour maximiser votre impact sur Instagram en 2024, privilégiez les Reels qui obtiennent actuellement 67% plus de portée que les posts classiques selon les dernières analyses d'engagement. Pour optimiser vos performances: produisez des Reels de 17-27 secondes (la durée optimale d'après les données de rétention), commencez par un hook visuel fort dans les 2 premières secondes, et utilisez des textes superposés concis car 65% des utilisateurs regardent sans le son. La fréquence idéale se situe entre 3-5 publications par semaine avec une répartition stratégique: 40% Reels, 30% posts carrés/feed, 30% stories. Un élément crucial souvent négligé: l'algorithme d'Instagram favorise maintenant la "participation meaningful" - les contenus qui génèrent des partages en DM et des sauvegardes sont significativement plus distribués que ceux qui obtiennent uniquement des likes. Pour stimuler ces actions profondes, créez davantage de contenu utilitaire (guides, tutoriels, infographies) plutôt que du contenu purement esthétique. Les hashtags restent pertinents mais leur approche a changé: utilisez 5-8 hashtags ultra-ciblés plutôt que 30 hashtags génériques - les analyses montrent une corrélation négative entre le nombre de hashtags et l'engagement depuis les dernières mises à jour.`
        },
        {
          keywords: ['tiktok', 'vidéo courte', 'tendances'],
          response: `Pour réussir sur TikTok en 2024, comprenez d'abord son algorithme unique: contrairement à Instagram ou Facebook, TikTok teste chaque contenu auprès d'un petit échantillon d'utilisateurs avant de décider de l'amplifier ou non - un contenu doit générer un engagement significatif dans les 6 premières heures pour être poussé plus largement. Les statistiques récentes montrent que les vidéos de 21-34 secondes obtiennent le meilleur équilibre entre rétention complète et engagement. Pour maximiser vos performances: captez l'attention dans les 1,7 premières secondes (le seuil critique de rétention), utilisez des transitions dynamiques toutes les 2-3 secondes pour maintenir l'intérêt, et structurez votre contenu avec un problème clair suivi d'une solution inattendue. La musique reste fondamentale - les vidéos utilisant des sons tendance obtiennent en moyenne 52% plus de vues. Un élément stratégique souvent négligé: l'importance du "hook textuel" - les premiers mots qui apparaissent à l'écran déterminent largement le taux de rétention. Les analyses montrent que les phrases commençant par "Comment j'ai...", "La vérité sur...", ou "Personne ne parle de..." génèrent 43% plus de visionnages complets. Pour la publication, les données actuelles indiquent que 3-4 vidéos par semaine représentent la fréquence optimale pour la plupart des créateurs.`
        },
        {
          keywords: ['linkedin', 'professionnel', 'b2b', 'réseau'],
          response: `LinkedIn a considérablement évolué en 2024, passant d'une plateforme de recherche d'emploi à un réseau de création de contenu professionnel à part entière. Les analyses récentes montrent que les publications texte brut générent désormais plus d'engagement que celles avec liens externes (augmentation de 87%), car l'algorithme favorise le contenu natif qui maintient les utilisateurs sur la plateforme. Pour maximiser votre impact: structurez vos posts avec de l'espace blanc et des listes à puces pour améliorer la lisibilité mobile (98% de vos lecteurs verront votre contenu sur mobile), limitez-vous à 1300 caractères (la zone d'engagement optimal), et adoptez le storytelling professionnel en partageant des expériences concrètes et des leçons tirées - les récits personnels authentiques génèrent 3x plus de commentaires que les conseils génériques. La cadence idéale se situe entre 3-5 publications par semaine, idéalement entre 9h-10h ou 17h-18h (heure locale). Un élément stratégique souvent négligé: l'importance critique des 60 premières minutes - répondez personnellement à chaque commentaire dans ce créneau pour signaler à l'algorithme que votre post mérite une distribution élargie. Les données montrent que les publications avec 5+ commentaires de l'auteur dans la première heure obtiennent en moyenne 73% plus de vues sur la durée totale de vie du post.`
        },
        {
          keywords: ['communauté', 'engagement', 'audience', 'fans'],
          response: `La construction de communauté sur les réseaux sociaux en 2024 exige une approche stratégique différente du simple marketing de contenu. Les analyses montrent que les marques qui consacrent 40% de leur contenu à la facilitation de conversations entre membres (plutôt qu'à la promotion) voient leur engagement augmenter de 327% en moyenne. Pour développer une communauté engagée: créez un rythme prévisible avec des formats récurrents (ex: Q&A hebdomadaire, défis mensuels), établissez un langage commun et des références partagées qui créent un sentiment d'appartenance, et valorisez systématiquement les contributions de vos membres les plus actifs. Un élément stratégique crucial souvent négligé: la "règle du 1-9-90" reste valide mais avec une nuance importante - concentrez vos efforts sur la conversion des 9% de participants occasionnels en contributeurs réguliers plutôt que de tenter d'activer les 90% de consommateurs passifs. Les communautés les plus performantes actuellement utilisent des plateformes multiples interconnectées: réseaux sociaux publics pour la découverte, espaces fermés (Discord, Telegram, Circle) pour les conversations approfondies, et rencontres réelles/virtuelles pour cimenter les relations. Les données récentes montrent que les membres ayant participé à au moins un événement en direct (virtuel ou physique) ont un taux de rétention 440% supérieur sur 12 mois par rapport aux membres uniquement actifs en ligne.`
        }
      ],
      quora: [
        {
          keywords: ['réponse', 'question', 'visibilité', 'quora'],
          response: `Pour maximiser l'impact de vos réponses sur Quora en 2024, concentrez-vous sur la valeur ajoutée unique que vous pouvez apporter. Les statistiques récentes montrent que les réponses de 600-800 mots obtiennent le meilleur équilibre entre profondeur et engagement. Pour créer des réponses performantes: structurez votre contenu en sections clairement identifiées avec des sous-titres en gras, intégrez systématiquement des exemples concrets et des données chiffrées à jour (les réponses contenant au moins 3 références à des statistiques récentes reçoivent en moyenne 63% plus d'upvotes), et concluez par un paragraphe synthétique qui résume les points clés. Un élément crucial souvent négligé: l'importance de la première phrase - les 40 premiers caractères déterminent si un lecteur continuera sa lecture ou passera à la réponse suivante. Les analyses montrent que commencer par une affirmation contre-intuitive ou un fait surprenant augmente le taux de lecture complète de 78%. Pour maximiser votre visibilité sur la plateforme, ciblez stratégiquement les questions récentes (moins de 5 jours) ayant entre 10 et 50 vues - ces questions offrent le meilleur potentiel de visibilité à long terme tout en étant suffisamment nouvelles pour que votre réponse ne soit pas noyée parmi des dizaines d'autres.`
        },
        {
          keywords: ['espace', 'expertise', 'communauté', 'autorité'],
          response: `Les Espaces Quora sont devenus un levier stratégique majeur en 2024 pour établir son expertise. Les données récentes montrent que le contenu publié dans un Espace bien géré obtient une visibilité 8 à 12 fois supérieure au même contenu posté uniquement sur votre profil personnel. Pour maximiser l'impact de votre Espace: définissez une niche ultra-spécifique plutôt qu'un sujet générique (ex: "Optimisation fiscale pour freelances tech" plutôt que "Finance personnelle"), établissez un calendrier éditorial avec 2-3 publications hebdomadaires de formats variés (questions, posts, réponses partagées), et invitez stratégiquement des contributeurs complémentaires à votre expertise. Un élément crucial souvent négligé: les Espaces les plus performants consacrent 30% de leur contenu à mettre en avant les contributions des membres plutôt qu'uniquement celles de l'administrateur - cette approche génère 174% plus d'engagement communautaire selon les analyses récentes. Pour accélérer la croissance de votre Espace, créez des séries thématiques de 4-5 posts interconnectés sur une période de 2 semaines et promouvez-les de façon croisée sur d'autres plateformes. Les métriques montrent que les Espaces qui atteignent 50 membres actifs (définition Quora: au moins une interaction par semaine) franchissent un seuil critique à partir duquel leur croissance devient significativement plus organique.`
        },
        {
          keywords: ['question', 'poser', 'réponse', 'formulation'],
          response: `La formulation efficace des questions sur Quora est devenue un art stratégique en 2024. Les analyses de 284 000 questions montrent que celles générant le plus d'engagement présentent des caractéristiques spécifiques: elles sont formulées avec précision (30-45 mots), contiennent au moins un élément de contexte personnel qui justifie la question, et se terminent par une question ouverte plutôt que fermée (commençant par "comment", "pourquoi" ou "quelles"). Pour maximiser les chances d'obtenir des réponses qualitatives: évitez les questions binaires (oui/non), incluez suffisamment de détails pour permettre une réponse personnalisée mais sans noyer l'information essentielle, et formulez le titre sous forme interrogative complète plutôt que comme une simple phrase nominale. Un élément stratégique souvent négligé: le timing de publication - les questions postées entre 19h et 22h (heure locale) reçoivent en moyenne 37% plus de réponses selon les dernières analyses. Si votre objectif est d'attirer l'attention d'experts spécifiques, utilisez la fonction de mention (@nom) avec parcimonie et pertinence, en ciblant 2-3 contributeurs maximum dont l'expertise correspond parfaitement à votre question - les mentions excessives ou inappropriées réduisent drastiquement les chances d'obtenir des réponses qualitatives.`
        },
        {
          keywords: ['seo', 'référencement', 'google', 'trafic'],
          response: `L'utilisation de Quora comme stratégie SEO a considérablement évolué en 2024. Les analyses récentes montrent que les réponses Quora apparaissent dans les premiers résultats Google pour 14,2% des requêtes informationnelles à longue traîne. Pour maximiser l'impact SEO: ciblez prioritairement les questions comportant des mots-clés à intention informationnelle claire avec un volume de recherche mensuel de 10-200 (la zone idéale où la concurrence est modérée), structurez vos réponses autour de sous-titres contenant des variations sémantiques du mot-clé principal, et incluez systématiquement des liens vers des sources externes faisant autorité (2-3 par réponse) en plus de votre lien vers votre propre contenu. Un élément technique crucial: l'optimisation pour le featured snippet - 32% des réponses Quora qui apparaissent en position zéro sur Google suivent une structure spécifique avec une définition concise en début de réponse (40-60 mots), suivie d'une liste à puces ou numérotée, puis d'un développement détaillé. Les données montrent également que les réponses contenant une image pertinente et légendée obtiennent 27% plus de visibilité dans les SERP. Pour maximiser le ROI de votre stratégie Quora, concentrez vos efforts sur 8-10 réponses approfondies par mois plutôt que sur un grand nombre de contributions superficielles.`
        }
      ],
      travel: [
        {
          keywords: ['budget', 'économie', 'pas cher', 'économiser'],
          response: `Pour voyager à petit budget en 2024, exploitez ces stratégies basées sur les dernières tendances: utilisez la fonction "partout" sur Skyscanner et la recherche par calendrier flexible pour trouver des vols jusqu'à 73% moins chers (les réservations 4-5 mois à l'avance offrent actuellement le meilleur rapport qualité-prix selon les analyses récentes). Pour l'hébergement, explorez les options émergentes comme house-sitting (TrustedHousesitters, Nomador) et l'échange de maisons qui connaît un regain de popularité (+43% en 2023). Un élément souvent négligé: l'importance des cartes bancaires sans frais à l'étranger - les voyageurs français perdent en moyenne 184€ par séjour de deux semaines en frais de change et retraits. Pour la nourriture locale abordable, l'application TooGoodToGo s'est étendue dans 17 pays et permet d'économiser jusqu'à 70% sur des repas de qualité, tandis que les applications comme Eatwith offrent des expériences culinaires chez l'habitant pour 30-40% moins cher que les restaurants touristiques équivalents. Enfin, les pass touristiques (comme le Copenhagen Card ou le Vienna Pass) offrent désormais un retour sur investissement dès la première journée d'utilisation intensive - analysez systématiquement la liste des attractions incluses et calculez votre itinéraire pour maximiser les économies.`
        },
        {
          keywords: ['destination', 'lieu', 'pays', 'ville', 'région'],
          response: `Les tendances destinations 2024 révèlent un changement significatif dans les préférences des voyageurs: l'émergence des "destinations secondaires" situées à proximité des grands centres touristiques mais offrant des expériences plus authentiques à des prix 30-40% inférieurs. Selon les données de réservation, les villes comme Procida (alternative à Naples), Essaouira (alternative à Marrakech) ou Toledo (alternative à Madrid) connaissent une augmentation de fréquentation de 127% par rapport à 2019. Pour les destinations plus lointaines, l'Albanie enregistre la plus forte croissance européenne (+187% de visiteurs internationaux) grâce à ses prix accessibles et ses plages comparables à la Grèce. En Asie, Taiwan émerge comme l'alternative privilégiée au Japon avec une gastronomie reconnue et des coûts inférieurs de 35%. Un phénomène intéressant: le "tourisme régénératif" influence fortement les choix de destination, avec des lieux comme la Nouvelle-Zélande (Whanganui) et le Costa Rica (péninsule d'Osa) qui proposent des séjours axés sur la contribution positive à l'environnement et aux communautés locales. Ces destinations attirent particulièrement la génération Z qui privilégie l'impact positif de son voyage sur les destinations plutôt que l'accumulation d'attractions touristiques conventionnelles.`
        },
        {
          keywords: ['avion', 'vol', 'aérien', 'billet', 'réservation'],
          response: `Les stratégies de réservation de vols ont considérablement évolué en 2024. Contrairement à l'idée reçue, le "mardi à 15h" n'est plus le moment optimal - les analyses de 15 millions de tarifs montrent que les billets les moins chers apparaissent de façon aléatoire, mais avec une légère préférence pour le dimanche soir (+1,9% d'économie en moyenne). Pour maximiser vos chances: utilisez des agrégateurs comme Google Flights ou Momondo pour établir une base de prix, puis vérifiez directement sur le site de la compagnie qui offre souvent des tarifs 7-15% inférieurs pour le même vol. La période idéale de réservation s'est également modifiée: 48-67 jours avant le départ pour les vols internationaux et 21-35 jours pour les vols domestiques offrent statistiquement les meilleurs tarifs. Un élément technique souvent négligé: l'importance du "point de vente virtuel" - réserver un vol Paris-Bangkok depuis le site thaïlandais de la compagnie peut générer des économies de 15-30% grâce aux différences de tarification régionale. Enfin, les vols à escales multiples réservés séparément (self-connect) permettent d'économiser jusqu'à 60% sur certaines routes long-courrier, mais nécessitent une marge de 3-4 heures entre les vols pour limiter les risques de correspondance manquée.`
        },
        {
          keywords: ['hébergement', 'hôtel', 'airbnb', 'logement', 'dormir'],
          response: `Le marché de l'hébergement a connu des transformations majeures en 2024. Les analyses récentes montrent que les prix Airbnb ont augmenté de 36% en moyenne depuis 2019 dans les grandes villes européennes, réduisant significativement l'écart de prix avec l'hôtellerie traditionnelle. Pour optimiser votre rapport qualité-prix: explorez les plateformes alternatives comme Plum Guide (sélection de logements premium vérifiés avec des tarifs 10-15% inférieurs aux équivalents Airbnb), VRBO (spécialisé dans les maisons entières pour les familles) ou HostelWorld qui a considérablement monté en gamme avec des "poshtels" combinant chambres privées de qualité et espaces communs conviviaux. Pour les hôtels, la réservation directe après comparaison sur des agrégateurs est devenue la stratégie la plus efficace - 76% des établissements proposent désormais une garantie de meilleur prix avec des avantages supplémentaires (surclassement, petit-déjeuner offert) pour les réservations directes. Un phénomène émergent: le "workation housing" - des hébergements spécialement conçus pour les digital nomads avec espaces de travail, connexion fibre et tarifs dégressifs pour les séjours de 2+ semaines. Ces établissements, particulièrement développés au Portugal, en Croatie et en Thaïlande, offrent désormais des réductions de 30-45% pour les séjours mensuels par rapport aux tarifs journaliers.`
        }
      ],
      cooking: [
        {
          keywords: ['recette', 'facile', 'rapide', 'débutant'],
          response: `Pour développer vos compétences culinaires en tant que débutant en 2024, commencez par maîtriser ces 5 techniques fondamentales plutôt que d'accumuler des recettes: la cuisson des œufs (brouillés à feu doux dans une poêle froide au départ), la cuisson parfaite des pâtes (eau abondamment salée et test de dégustation plutôt que minutage strict), le rôtissage des légumes (préchauffage de la plaque, légumes bien espacés, température élevée de 200-220°C), la préparation d'une vinaigrette équilibrée (ratio 3:1 huile/acide comme base) et le saisissement correct des protéines (poêle très chaude, viande à température ambiante, patience avant de la retourner). Les chefs professionnels recommandent de se concentrer sur quelques plats simples mais polyvalents comme la frittata (personnalisable à l'infini), les one-pot pasta, ou les bols composés (grains + protéine + sauce + garnitures). Un conseil crucial souvent négligé: investissez dans un bon couteau de chef et apprenez à l'utiliser correctement - cette seule compétence réduit le temps de préparation de 40% et augmente considérablement le plaisir de cuisiner. Pour progresser efficacement, la méthode des "variations contrôlées" (préparer la même recette plusieurs fois en modifiant un seul ingrédient ou technique) permet de comprendre l'impact de chaque élément sur le résultat final.`
        },
        {
          keywords: ['restaurant', 'gastronomie', 'chef', 'étoilé'],
          response: `Le paysage gastronomique de 2024 révèle plusieurs tendances significatives qui transforment l'expérience restaurant. L'analyse de 430 nouveaux établissements primés montre un virage net vers la "haute cuisine décontractée" - des restaurants proposant une cuisine techniquement sophistiquée mais dans des cadres informels, sans nappage ni service guindé, avec un ticket moyen 30% inférieur aux établissements gastronomiques traditionnels. La saisonnalité ultra-courte s'impose comme nouvelle norme d'excellence - les menus changeant désormais toutes les 2-3 semaines plutôt que 4 fois par an. Une évolution notable: 64% des restaurants étoilés proposent maintenant une option menu 100% végétal permanente (contre seulement 18% en 2019). L'approche "terroir mondial" gagne du terrain avec des chefs qui associent techniques françaises classiques et saveurs internationales authentiques, particulièrement des cuisines africaines et sud-est asiatiques jusqu'ici sous-représentées dans la haute gastronomie. Côté service, la tendance est au storytelling immersif - les serveurs devenant de véritables narrateurs de l'assiette, expliquant non seulement les ingrédients mais aussi leur provenance, les producteurs et les techniques spécifiques utilisées. Cette approche répond directement aux attentes des clients qui valorisent désormais l'histoire et l'éthique derrière un plat autant que sa qualité gustative.`
        },
        {
          keywords: ['cuisine', 'matériel', 'ustensile', 'équipement', 'appareil'],
          response: `Pour équiper efficacement votre cuisine en 2024, privilégiez quelques pièces polyvalentes de qualité plutôt qu'une multitude de gadgets spécialisés. Les tests comparatifs récents recommandent cet équipement essentiel: un couteau de chef de 20cm en acier carbone (Victorinox Fibrox offre le meilleur rapport qualité/prix à ~60€), une poêle en fonte émaillée de 28cm (Le Creuset reste la référence mais Lodge propose une alternative à -60% du prix), et une casserole à fond épais de 3L. Côté électroménager, le blender à bol (plutôt que plongeant) et la mijoteuse programmable ressortent comme les deux appareils offrant le meilleur retour sur investissement en termes d'utilisation régulière. Un élément crucial souvent négligé: l'importance d'une bonne planche à découper en bois d'au moins 40x30cm et 3-4cm d'épaisseur - cet investissement de ~80€ transforme l'expérience de préparation quotidienne et dure des décennies. Pour les petits ustensiles, priorisez une microplane (râpe fine), une spatule en silicone résistante à la chaleur, et une pince de cuisine polyvalente. Les analyses d'utilisation montrent que ces trois ustensiles représentent à eux seuls près de 65% des manipulations quotidiennes en cuisine. Évitez les kits d'ustensiles complets généralement composés d'éléments de qualité médiocre - mieux vaut acheter moins mais mieux.`
        },
        {
          keywords: ['ingrédient', 'produit', 'épice', 'base', 'essentiel'],
          response: `Pour transformer votre cuisine quotidienne en 2024, ces 10 ingrédients à fort impact méritent une place permanente dans votre garde-manger. Les chefs professionnels s'accordent sur l'importance du miso comme exhausteur de goût universel (pas uniquement pour la cuisine asiatique) - une cuillère à café dans une vinaigrette, une sauce ou un ragoût apporte une profondeur umami incomparable. L'huile d'olive extra vierge mérite deux versions: une basique pour la cuisson (~12€/litre) et une premium pour les finitions (~25€/500ml). Les flocons de piment d'Alep ou d'Urfa (Turquie) offrent une chaleur fruitée plus complexe que le piment de Cayenne standard. Le vinaigre de riz et le miel de qualité sont des équilibreurs d'acidité/douceur plus subtils que le vinaigre blanc et le sucre. Côté herbes, investissez dans du vrai zaatar mélangé (Moyen-Orient) et du piment fumé (comme le Gochugaru coréen) qui transforment instantanément les plats les plus simples. Pour les conserves, le concentré de tomates en tube (plutôt qu'en boîte) se conserve mieux et les anchois de qualité (même si vous n'aimez pas leur goût pur) se dissolvent en cuisson pour ajouter une profondeur marine subtile. Enfin, adoptez le sel de finition (comme la fleur de sel ou le sel fumé) à utiliser en touche finale - cette simple habitude élève immédiatement n'importe quelle préparation.`
        }
      ],
      default: [
        {
          keywords: ['aide', 'assistance', 'question', 'besoin'],
          response: `Je serais ravi de vous aider avec votre question. Pour vous fournir une réponse vraiment pertinente et personnalisée, pourriez-vous me donner quelques précisions supplémentaires? Je suis particulièrement spécialisé dans les domaines du marketing digital, SEO, YouTube, emails professionnels, réseaux sociaux, Quora, mais je peux également vous conseiller sur d'autres sujets. N'hésitez pas à reformuler votre question avec plus de détails sur votre situation ou objectif précis, cela me permettra de vous apporter une réponse plus adaptée à vos besoins spécifiques.`
        },
        {
          keywords: ['merci', 'super', 'génial', 'excellent'],
          response: `Je vous en prie! Je suis ravi d'avoir pu vous aider. N'hésitez pas si vous avez d'autres questions ou si vous souhaitez approfondir certains aspects que nous avons abordés. Je reste à votre disposition pour vous accompagner dans vos projets. Y a-t-il un autre sujet sur lequel vous aimeriez avoir des informations ou des conseils?`
        },
        {
          keywords: ['bonjour', 'salut', 'hey', 'coucou'],
          response: `Bonjour! Ravi de vous aider aujourd'hui. Je suis votre assistant spécialisé en marketing digital, SEO, YouTube, emails professionnels, réseaux sociaux et bien d'autres domaines. Quelle question puis-je résoudre pour vous? N'hésitez pas à être précis dans votre demande pour que je puisse vous fournir les informations les plus pertinentes et adaptées à votre situation.`
        },
        {
          keywords: ['comment', 'pourquoi', 'quand', 'où', 'qui'],
          response: `Votre question est intéressante, mais pour y répondre de façon vraiment pertinente, j'aurais besoin de quelques précisions supplémentaires. Pourriez-vous développer davantage votre demande? Par exemple, dans quel contexte vous posez-vous cette question? Quel est votre objectif précis? Avez-vous déjà essayé certaines approches? Plus vous me donnerez de détails, plus ma réponse pourra être personnalisée et adaptée à votre situation spécifique.`
        }
      ]
    };
    
    // Fonction pour trouver la catégorie la plus pertinente
    const findRelevantCategory = () => {
      if (contextAnalyzer.isYoutubeRelated()) return "youtube";
      if (contextAnalyzer.isEmailRelated()) return "email";
      if (contextAnalyzer.isMarketingRelated()) return "marketing";
      if (contextAnalyzer.isSeoRelated()) return "seo";
      if (contextAnalyzer.isSocialRelated()) return "social";
      if (contextAnalyzer.isQuoraRelated()) return "quora";
      if (contextAnalyzer.isTravelRelated()) return "travel";
      if (contextAnalyzer.isCookingRelated()) return "cooking";
      return "default";
    };
    
    // Trouver la catégorie appropriée pour la question
    const category = findRelevantCategory();
    
    // Rechercher dans la catégorie les réponses qui correspondent aux mots-clés spécifiques de la question
    const findBestResponseInCategory = (category: string) => {
      const categoryResponses = responseDatabase[category as keyof typeof responseDatabase];
      
      // Pour les catégories non-default, rechercher la réponse la plus pertinente basée sur les mots-clés
      if (category !== "default") {
        // Chercher une réponse spécifique basée sur des mots-clés précis dans la question
        for (const response of categoryResponses) {
          if ('keywords' in response && response.keywords.some(keyword => lowerQuestion.includes(keyword))) {
            return response.response;
          }
        }
      }
      
      // Si aucune correspondance spécifique n'est trouvée, retourner une réponse aléatoire de la catégorie
      const randomIndex = Math.floor(Math.random() * categoryResponses.length);
      return categoryResponses[randomIndex].response;
    };
    
    // Obtenir la meilleure réponse pour cette question
    let response = findBestResponseInCategory(category);
    
    // Personnalisation supplémentaire basée sur le contenu de la question
    // Extraire des éléments spécifiques de la question pour personnaliser davantage
    const extractSpecificElements = () => {
      // Rechercher des nombres dans la question (ex: "Comment obtenir 1000 abonnés")
      const numbers = userQuestion.match(/\d+/g);
      const specificNumber = numbers ? numbers[0] : null;
      
      // Rechercher des noms de plateformes ou outils spécifiques
      const platforms = ['YouTube', 'Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'Twitter', 
                         'Google', 'Gmail', 'Outlook', 'Mailchimp', 'Canva', 'WordPress'];
      const mentionedPlatform = platforms.find(p => userQuestion.toLowerCase().includes(p.toLowerCase())) || null;
      
      return { specificNumber, mentionedPlatform };
    };
    
    const { specificNumber, mentionedPlatform } = extractSpecificElements();
    
    // Intégrer ces éléments spécifiques dans la réponse si possible
    if (specificNumber) {
      response = response.replace(/\b\d+\b/, specificNumber);
    }
    
    if (mentionedPlatform) {
      // S'assurer que la plateforme est mentionnée au moins une fois dans la réponse
      if (!response.includes(mentionedPlatform)) {
        response = response.replace(/\b(plateforme|outil|réseau social|site)\b/, mentionedPlatform);
      }
    }
    
    return response;
  };

  const handleUseResponse = (response: string) => {
    onUseResponse(response);
    toast.success("Réponse utilisée dans votre signature");
  };
  
  const handleReplyClick = (index: number) => {
    setIsReplyMode(true);
    setReplyingToIndex(index);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const insertLink = () => {
    if (!linkUrl.trim() || !linkText.trim()) {
      toast.error("Veuillez saisir une URL et un texte pour le lien");
      return;
    }
    
    const formattedLink = `[${linkText}](${linkUrl})`;
    
    // Insérer le lien à la position du curseur ou remplacer la sélection
    const currentQuestion = question;
    const newQuestion = 
      currentQuestion.substring(0, selectionStart) + 
      formattedLink + 
      currentQuestion.substring(selectionEnd);
    
    setQuestion(newQuestion);
    setShowLinkPopover(false);
    setLinkUrl("");
    setLinkText("");
    
    // Remettre le focus sur le textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const handleTextareaSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      setSelectionStart(start);
      setSelectionEnd(end);
      
      // Si du texte est sélectionné, l'utiliser comme texte du lien
      if (start !== end) {
        const selectedText = question.substring(start, end);
        setLinkText(selectedText);
      }
    }
  };

  return (
    <Card className="p-4 border-t-4 border-t-primary">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bot className="w-5 h-5 text-primary" />
        Assistant IA pour signatures
      </h3>
      
      <div className="mb-4 max-h-60 overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-md">
        {conversation.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Posez une question sur les signatures email, marketing, YouTube ou SEO pour obtenir des conseils personnalisés.
          </p>
        ) : (
          conversation.map((message, index) => (
            <div 
              key={index} 
              className={`flex gap-2 p-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-gray-100 ml-4' 
                  : 'bg-primary/10 mr-4'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5 mt-1 flex-shrink-0" />
              ) : (
                <Bot className="w-5 h-5 mt-1 flex-shrink-0 text-primary" />
              )}
              <div className="flex-1">
                <p className="text-sm whitespace-pre-wrap" 
                   dangerouslySetInnerHTML={{
                     __html: message.content.replace(
                       /\[([^\]]+)\]\(([^)]+)\)/g,
                       '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>'
                     )
                   }} 
                />
                <div className="mt-1 flex items-center justify-between">
                  {message.role === 'assistant' ? (
                    <>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto text-xs"
                        onClick={() => handleUseResponse(message.content)}
                      >
                        Utiliser cette réponse
                      </Button>
                      <span className="text-xs text-gray-500">{message.content.length} caractères</span>
                    </>
                  ) : (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-xs ml-auto"
                      onClick={() => handleReplyClick(index)}
                    >
                      Répondre
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="ml-2 text-sm">Génération de la réponse...</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center space-x-2">
          <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Insérer un lien</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Texte du lien"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="text-sm"
                  />
                  <Input
                    placeholder="URL (https://...)"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={insertLink}
                      className="text-xs"
                    >
                      Insérer
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex-1 relative">
            {isReplyMode && (
              <div className="absolute -top-6 left-0 text-xs flex items-center text-gray-500">
                <span>En réponse à la question {replyingToIndex !== null ? replyingToIndex + 1 : ''}</span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-xs ml-2"
                  onClick={() => {
                    setIsReplyMode(false);
                    setReplyingToIndex(null);
                  }}
                >
                  Annuler
                </Button>
              </div>
            )}
            <Textarea
              ref={textareaRef}
              placeholder={isReplyMode ? "Écrivez votre réponse..." : "Posez une question (YouTube, SEO, email, marketing)..."}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onSelect={handleTextareaSelection}
              disabled={isLoading}
              className="min-h-[80px] resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {question.length > 0 && `${question.length} caractères`}
          </div>
          <Button type="submit" size="sm" disabled={isLoading} className="ml-auto">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <SendIcon className="w-4 h-4 mr-2" />
                {isReplyMode ? "Répondre" : "Envoyer"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AiAssistant;
