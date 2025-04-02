
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquareText, Send, Copy, Sparkles, RefreshCw } from "lucide-react";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const QuoraButton = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quoraQuestion, setQuoraQuestion] = useState("");
  const [quoraAnswer, setQuoraAnswer] = useState("");
  const [toneStyle, setToneStyle] = useState("expert");

  // Liste de questions populaires sur Quora
  const popularQuestions = [
    "Comment voyager pas cher en Europe ?",
    "Quelles sont les meilleures astuces pour économiser sur les billets d'avion ?",
    "Comment organiser un voyage à petit budget ?",
    "Quels sont les meilleurs outils pour trouver des hébergements économiques ?",
    "Comment profiter pleinement d'un voyage sans se ruiner ?"
  ];

  // Schema de validation pour le formulaire
  const formSchema = z.object({
    question: z.string().min(5, {
      message: "La question doit contenir au moins 5 caractères.",
    }),
    category: z.string().optional(),
    tags: z.string().optional(),
  });

  // Configuration du formulaire avec react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      category: "",
      tags: "",
    },
  });

  // Fonction pour gérer la soumission du formulaire
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Votre question a été créée !");
    setOpen(false);
  };

  // Fonction pour générer une réponse avec l'IA
  const generateAnswer = () => {
    if (!quoraQuestion) {
      toast.error("Veuillez d'abord sélectionner une question");
      return;
    }

    setIsGenerating(true);
    
    // Simuler la génération d'une réponse IA
    setTimeout(() => {
      const answers = generateRelevantAnswer(quoraQuestion, toneStyle);
      setQuoraAnswer(answers);
      setIsGenerating(false);
      toast.success("Réponse générée avec succès !");
    }, 2000);
  };

  // Fonction pour générer des réponses pertinentes en fonction de la question
  const generateRelevantAnswer = (question: string, style: string): string => {
    // Extraire les mots-clés de la question pour personnaliser la réponse
    const questionLower = question.toLowerCase();
    let topic = "";
    
    if (questionLower.includes("voyage") || questionLower.includes("europe") || 
        questionLower.includes("billet") || questionLower.includes("avion") || 
        questionLower.includes("hébergement") || questionLower.includes("budget")) {
      topic = "voyage";
    } else if (questionLower.includes("marketing") || questionLower.includes("digital") || 
               questionLower.includes("entreprise") || questionLower.includes("stratégie")) {
      topic = "marketing";
    } else if (questionLower.includes("santé") || questionLower.includes("bien-être") || 
               questionLower.includes("alimentation") || questionLower.includes("fitness")) {
      topic = "santé";
    } else {
      topic = "général";
    }
    
    // Générer des réponses d'au moins 500 caractères
    if (topic === "voyage") {
      if (style === "expert") {
        return `En tant qu'expert en voyages avec plus de 15 ans d'expérience et ayant visité 67 pays, je peux affirmer que voyager à petit budget en Europe est tout à fait possible avec les bonnes stratégies.

Voici 5 conseils essentiels basés sur mon expérience professionnelle et mes recherches approfondies:

1. **Planifiez hors saison** - Les prix peuvent être jusqu'à 40% moins élevés en basse saison (octobre-novembre, janvier-mars). Les températures restent agréables dans le sud de l'Europe, notamment en Espagne, Portugal et Grèce. La Sicile en novembre offre encore des journées à 20°C avec très peu de touristes.

2. **Utilisez les bonnes applications** - Skyscanner pour surveiller les vols (configurez des alertes de prix), Hostelworld pour les auberges, et Rome2Rio pour comparer tous les modes de transport. TooGoodToGo vous permet d'économiser sur la nourriture tout en réduisant le gaspillage alimentaire.

3. **Exploitez les transports locaux** - Les pass ferroviaires comme l'Interrail offrent un excellent rapport qualité-prix pour des trajets multiples. Dans les grandes villes, les cartes de transport hebdomadaires sont généralement beaucoup plus avantageuses que les tickets individuels. À Berlin, par exemple, la carte hebdomadaire coûte l'équivalent de 3,5 jours de tickets individuels.

4. **Alternez hébergements économiques et confortables** - Combinez 3-4 nuits en auberge avec une nuit en hôtel pour vous ressourcer. Les auberges avec cuisine vous permettent d'économiser considérablement sur les repas. Les réservations directes sont souvent moins chères que via les plateformes.

5. **Ciblez les expériences gratuites** - La plupart des grandes villes européennes proposent des visites guidées gratuites (pourboire apprécié) et des entrées gratuites dans les musées certains jours. Rome offre l'entrée gratuite au Colisée le premier dimanche du mois. Les marchés locaux offrent une immersion culturelle authentique sans frais.

Un budget quotidien de 50-70€ est parfaitement réaliste en adoptant ces stratégies, incluant l'hébergement, la nourriture et quelques activités.`;
      } else if (style === "conversational") {
        return `Ah, voyager en Europe sans se ruiner, c'est tout un art! 😊 Je t'assure que c'est possible, j'ai fait l'Europe avec seulement 35€/jour l'année dernière pendant 3 mois, et voici comment j'ai réussi ce tour de force:

• Sois ultra-flexible sur les dates! J'ai trouvé un vol Paris-Lisbonne à 19€ en partant un mardi de novembre. Les comparateurs comme Kiwi ou Skyscanner sont tes meilleurs amis, mais configure des alertes au moins 2-3 mois à l'avance.

• Les auberges ne sont pas aussi terribles qu'on le pense! À Prague, j'ai trouvé des dortoirs super propres à partir de 15€/nuit avec petit-déj inclus. Le bonus? J'y ai rencontré Sara et Miguel qui m'ont hébergé gratuitement quand je suis passé dans leur ville quelques semaines plus tard!

• La nourriture: les marchés locaux sont vraiment tes meilleurs alliés. À Barcelone, je me régalais pour 5-7€ par repas avec des produits frais. Et n'oublie pas les happy hours! À Budapest, les bières à 1,50€ entre 17h et 19h, ça change tout.

• Transport: marche, marche, marche! Les plus belles découvertes se font à pied. À Lisbonne, j'ai exploré tous les quartiers sans jamais prendre le métro. Sinon, les cartes hebdomadaires sont généralement plus avantageuses, et n'hésite pas avec le stop dans les régions rurales - j'ai fait tout le sud du Portugal comme ça!

• Pour les activités, n'oublie pas que beaucoup de musées ont des jours gratuits. Et les "free walking tours" sont parfaits - tu donnes ce que tu veux à la fin. À Berlin, j'ai eu un guide passionnant pendant 3h pour seulement 10€ de pourboire.

Le secret? Être spontané et parler aux locaux. Mon meilleur plan à Séville? C'est le serveur du café qui me l'a soufflé. Tu prépares un voyage bientôt? N'hésite pas si tu veux plus de détails sur une destination en particulier!`;
      } else {
        return `Il y a six mois, Marie, 28 ans, est partie explorer l'Europe avec seulement 1200€ en poche pour un mois entier. Impossible? C'est ce que pensaient ses amis qui dépensent habituellement cette somme pour une simple semaine de vacances.

Son premier choc: en arrivant à Porto, elle a découvert que son auberge à 14€/nuit était en réalité un magnifique bâtiment historique avec petit-déjeuner inclus et une terrasse sur le toit offrant une vue panoramique sur le Douro. "Je n'aurais jamais cru possible de trouver un tel endroit pour ce prix," m'a-t-elle confié.

Le deuxième jour, elle a rencontré Thomas, un local qui lui a montré comment manger comme un Portugais: acheter du pain frais, du fromage et des fruits au marché pour moins de 5€ par jour. "Les restaurants touristiques coûtaient cinq fois plus cher et étaient bien moins authentiques," explique Marie.

Sa plus grande économie? Marie a utilisé BlaBlaCar pour se déplacer entre les villes, divisant par trois le coût des transports. "J'ai voyagé de Porto à Lisbonne pour 12€, contre 45€ en train. Et en prime, j'ai rencontré Carolina, qui m'a invitée à un concert gratuit le soir même!"

L'expérience la plus mémorable de Marie n'a rien coûté: une randonnée au lever du soleil sur les falaises de Lagos avec un groupe de voyageurs rencontrés à son auberge. "Nous avons partagé un petit-déjeuner improvisé face à l'océan. Ce moment valait tous les restaurants étoilés du monde."

À la fin de son voyage, Marie avait visité 6 pays et il lui restait même 150€. La clé? "S'adapter aux rythmes locaux, éviter les pièges à touristes, et surtout, être ouverte aux rencontres qui transforment un simple voyage en aventure inoubliable."

Aujourd'hui, Marie aide d'autres voyageurs à planifier des aventures similaires. "Le voyage économique n'est pas un voyage au rabais," insiste-t-elle. "C'est souvent l'expérience la plus authentique et enrichissante qu'on puisse vivre."`;
      }
    } else if (topic === "marketing") {
      if (style === "expert") {
        return `En tant que stratège en marketing digital avec plus de 12 ans d'expérience auprès de multinationales et startups, je peux affirmer que le marketing digital a radicalement transformé le paysage commercial.

Voici 5 éléments clés à considérer basés sur des données récentes et mon expertise:

1. **L'évolution du comportement des consommateurs** - Selon les dernières études McKinsey, 75% du parcours d'achat se déroule désormais en ligne avant tout contact avec un commercial. Cela signifie qu'une présence digitale optimisée n'est plus optionnelle mais essentielle. Les entreprises doivent développer un écosystème numérique complet intégrant site web, médias sociaux et contenu de valeur.

2. **La personnalisation à grande échelle** - Les technologies actuelles permettent de personnaliser l'expérience utilisateur de manière significative. Nos tests A/B récents ont démontré qu'une personnalisation ciblée peut augmenter les taux de conversion de 28% à 49%. Cette personnalisation doit être basée sur des données comportementales réelles et non sur de simples données démographiques.

3. **Le marketing de contenu stratégique** - Le contenu reste roi, mais sa nature évolue. Les formats longs (guides de plus de 2000 mots) et le contenu vidéo génèrent respectivement 55% et 87% plus d'engagement que les formats courts. Une stratégie de contenu efficace doit couvrir l'intégralité du funnel, de la sensibilisation à la fidélisation.

4. **L'intelligence artificielle comme multiplicateur d'efficacité** - Les outils d'IA permettent aujourd'hui d'optimiser chaque aspect du marketing: prédiction des comportements, personnalisation automatisée, et analyse de données à grande échelle. Mes équipes ont réalisé des gains d'efficacité de 40% en intégrant ces technologies aux processus existants.

5. **L'importance croissante des métriques d'engagement** - Au-delà des conversions directes, les métriques d'engagement (temps passé sur page, profondeur de scroll, micro-conversions) sont devenues essentielles. Nos analyses démontrent qu'une augmentation de 15% de ces métriques corrèle avec une hausse de 23% du revenu à long terme.

Pour mettre en œuvre ces principes, je recommande une approche intégrée combinant données analytiques robustes et créativité stratégique. Cette dualité est essentielle pour se démarquer dans un environnement digital saturé.`;
      } else if (style === "conversational") {
        return `Hey! Le marketing digital, c'est un peu comme apprendre à faire du vélo... au milieu d'une autoroute en constante évolution! 🚴‍♀️💨

J'ai commencé ma carrière il y a 8 ans dans une petite agence, et je peux te dire que TOUT a changé depuis. Tu te souviens quand on pensait qu'avoir une page Facebook suffisait? Ahh, la belle époque simple!

Aujourd'hui, laisse-moi te raconter comment on s'en sort dans cette jungle digitale:

• Les algorithmes des réseaux sociaux sont devenus super capricieux! Sur Instagram, nos posts organiques touchaient 15% de nos abonnés en 2018, maintenant c'est à peine 3%... Du coup, on a complètement changé notre approche: moins de contenu mais BEAUCOUP plus qualitatif. Résultat? Nos 3 dernières vidéos ont fait un carton malgré l'algorithme.

• Le contenu éphémère (Stories, Reels) marche tellement mieux que le contenu permanent maintenant. Chez mon dernier client, on a fait +240% d'engagement en passant la moitié du budget sur ce format. C'est dingue, non?

• Pour le SEO, fini le temps où on pouvait se contenter de mots-clés basiques. Google est devenu super intelligent avec l'IA. Mon conseil? Pense "intention de recherche" plutôt que mots-clés. Quand on a reformulé notre contenu comme ça, notre trafic organique a bondi de 78% en 4 mois!

• La data, c'est le nouveau pétrole, mais attention à l'indigestion! On collectait TELLEMENT de données qu'on ne savait plus quoi en faire. Maintenant, on se concentre sur 5-6 KPIs vraiment importants et ça a complètement clarifié notre stratégie.

• L'authentique gagne TOUJOURS. Notre campagne avec des vrais clients (pas des mannequins parfaits) a généré 3 fois plus de conversions que nos jolies pubs léchées.

Tu vois, le marketing digital c'est moins une question de budget que d'intelligence et d'adaptation. Une bonne idée bien exécutée peut faire des miracles, même avec des moyens limités. Alors, sur quel aspect tu galères le plus actuellement?`;
      } else {
        return `Sarah s'est réveillée en sursaut à 3h du matin, fixant le plafond de sa chambre. Demain, elle présenterait la nouvelle stratégie marketing digital de sa startup à des investisseurs potentiels. Après trois ans de croissance modeste, c'était leur chance de décoller - ou de s'écraser.

Six mois plus tôt, sa société "GreenHome" proposant des produits écologiques pour la maison stagnait à 10,000€ de ventes mensuelles. "Nous avons un bon produit, pourquoi personne ne nous trouve?" se lamentait-elle lors d'un dîner avec Marc, un ami d'université devenu consultant en marketing digital.

"Vous êtes invisibles," avait répondu Marc sans détour. "Vous essayez de vendre sans raconter pourquoi vous existez." Cette conversation fut l'étincelle qui changea tout.

Le lendemain, Sarah rassembla son équipe de quatre personnes. "Nous allons tout changer," annonça-t-elle. "Plus de publicités génériques sur des produits écologiques. Nous allons raconter notre histoire."

Leur première action fut de créer une série de vidéos "Derrière GreenHome" montrant leur atelier, leurs fournisseurs locaux, et les problèmes environnementaux qu'ils combattaient. La première vidéo, tournée avec un simple smartphone, raconta comment le fondateur avait développé leur produit phare après avoir découvert que sa fille était allergique aux produits ménagers conventionnels.

Contre toute attente, la vidéo fut vue 50,000 fois en une semaine. "Les gens ne s'intéressent pas à ce que vous vendez, mais à pourquoi vous le vendez," se rappela Sarah des paroles de Marc.

Dans les mois suivants, ils abandonnèrent les publicités génériques pour créer une communauté engagée. Chaque client recevait une carte personnalisée expliquant l'impact environnemental de son achat. Ils lancèrent un blog documentant leurs défis et réussites.

Résultat? Les ventes triplèrent en quatre mois. Plus impressionnant encore, leur coût d'acquisition client chuta de 80% - les clients satisfaits devenant leurs meilleurs ambassadeurs.

Maintenant, face aux investisseurs, Sarah ne présenterait pas une simple stratégie marketing, mais une transformation complète de l'approche commerciale de l'entreprise. "Notre succès ne vient pas de ce que nous vendons," conclut-elle dans ses notes, "mais de la connexion authentique que nous avons créée."`;
      }
    } else if (topic === "santé") {
      if (style === "expert") {
        return `En tant que spécialiste en médecine préventive et nutrition avec plus de 15 ans d'expérience clinique, je tiens à souligner l'importance d'une approche holistique de la santé basée sur des données scientifiques récentes.

Voici 5 principes fondamentaux étayés par la recherche actuelle:

1. **L'inflammation chronique comme facteur clé** - Les études récentes publiées dans le New England Journal of Medicine démontrent que l'inflammation chronique de bas grade est impliquée dans 7 des 10 principales causes de mortalité dans les pays développés. Une alimentation anti-inflammatoire riche en polyphénols (fruits colorés, légumes, thé vert) et acides gras oméga-3 (poissons gras, graines de lin) peut réduire les marqueurs inflammatoires de 29% en moyenne selon une méta-analyse de 2023.

2. **L'importance du microbiote intestinal** - Les recherches du Human Microbiome Project révèlent que notre microbiote intestinal contient plus de 1000 espèces bactériennes différentes qui influencent notre immunité, notre métabolisme et même notre santé mentale. L'intégration quotidienne d'aliments fermentés (yogourt, kéfir, choucroute) et de fibres prébiotiques (légumineuses, bananes vertes, oignons) améliore significativement la diversité microbienne en 4-6 semaines.

3. **Le sommeil comme pilier fondamental** - Les recherches de l'Université de Berkeley démontrent qu'une seule nuit de sommeil insuffisant (<6 heures) augmente de 30% les marqueurs de stress et réduit de 70% l'activité des cellules immunitaires. Pour optimiser la qualité du sommeil, l'exposition à la lumière naturelle le matin, la réduction de l'exposition aux écrans 90 minutes avant le coucher et le maintien d'une température ambiante de 18-19°C sont des facteurs déterminants.

4. **L'exercice physique personnalisé** - Les données de l'American College of Sports Medicine indiquent que l'exercice physique régulier réduit le risque de mortalité toutes causes confondues de 30-40%. La combinaison d'activités aérobiques (150 minutes/semaine), de renforcement musculaire (2 séances/semaine) et d'exercices de mobilité (2-3 séances/semaine) offre les bénéfices les plus complets. La personnalisation selon l'âge, les antécédents et les objectifs individuels reste cruciale.

5. **La gestion du stress chronique** - Les études en psycho-neuro-immunologie démontrent que le stress chronique compromet virtuellement tous les systèmes physiologiques. Les techniques de respiration profonde, la méditation de pleine conscience et la cohérence cardiaque (6 respirations par minute) pratiquées 10-15 minutes quotidiennement réduisent significativement le cortisol salivaire et améliorent la variabilité cardiaque, marqueur clé de résilience physiologique.

L'intégration de ces cinq principes dans un programme personnalisé constitue une approche scientifiquement validée pour optimiser la santé à long terme et prévenir les pathologies chroniques.`;
      } else if (style === "conversational") {
        return `Salut! Tu sais, je me suis toujours passionné pour le bien-être, mais c'est quand j'ai frôlé le burn-out il y a 3 ans que j'ai VRAIMENT commencé à comprendre ce que "prendre soin de sa santé" signifie réellement! 💆‍♂️

Avant, j'étais dans le camp "pas le temps pour ça" - tu connais sûrement: sandwich devant l'ordi, 5h de sommeil par nuit, et café comme groupe alimentaire principal... 😅 Et puis, BAM! Mon corps m'a envoyé un message très clair (sous forme de fatigue chronique et d'anxiété) que je ne pouvais plus ignorer.

Ce qui m'a le plus surpris dans mon cheminement vers une meilleure santé:

• Le sommeil change TOUT. Quand j'ai commencé à vraiment respecter 7-8h par nuit (chambre fraîche, téléphone dans une autre pièce), ma concentration, mon humeur et même ma digestion se sont améliorées en à peine deux semaines! J'ai littéralement l'impression d'être plus intelligent quand je dors bien.

• La nutrition, c'est pas qu'une histoire de calories. J'ai arrêté de compter et commencé à ÉCOUTER mon corps. Maintenant je mange principalement des aliments non transformés, beaucoup de légumes colorés, et j'ai découvert que certains aliments (comme les produits laitiers dans mon cas) me donnent un brouillard mental. C'est fou comme on peut se sentir différent!

• Le mouvement vs l'exercice - grosse nuance! Avant je pensais que si je ne faisais pas 1h intense au gym, ça ne comptait pas. Maintenant, je marche 30 minutes le matin, je fais 10 minutes de yoga avant de dormir, et je prends les escaliers. Résultat? Je me sens mieux qu'avec mes anciennes séances "no pain, no gain".

• La santé mentale est INDISSOCIABLE de la santé physique. Méditer 10 minutes par jour a plus impacté ma tension artérielle que mes efforts sportifs! Et garder un journal de gratitude chaque soir a réellement modifié ma perception du stress quotidien.

• L'hydratation - tellement basique mais tellement négligé! Depuis que je commence ma journée avec un grand verre d'eau et que j'ai ma bouteille toujours avec moi, mes maux de tête ont disparu et ma peau est métamorphosée.

Le secret? Les petits changements constants plutôt que les grands bouleversements temporaires. J'ai mis ces habitudes en place une par une, sur plusieurs mois. Et toi, par quelle petite habitude tu pourrais commencer dès demain?`;
      } else {
        return `Le réveil de Mathieu sonna à 5h30 comme chaque matin depuis six mois. Mais contrairement à l'année précédente, il se leva sans effort, sans cette sensation de lutte contre son propre corps. À 42 ans, il se sentait plus énergique qu'à 30 ans.

Dix-huit mois plus tôt, lors de son bilan annuel, son médecin n'avait pas mâché ses mots: "Hypertension, pré-diabète, surpoids... Si vous continuez ainsi, nous parlons de médicaments à vie dans moins de cinq ans."

Cette phrase avait résonné comme un coup de tonnerre pour cet entrepreneur qui avait sacrifié sa santé sur l'autel de la réussite professionnelle. Cette nuit-là, fixant le plafond de sa chambre, Mathieu pensa à son père, emporté par une crise cardiaque à 58 ans.

"Je ne prendrai pas le même chemin," se promit-il.

Sa transformation commença modestement: remplacer l'ascenseur par les escaliers dans son immeuble de cinq étages. Les premiers jours, il arrivait essoufflé, le visage rouge. Après deux semaines, il montait sans pause. Petit changement, première victoire.

Enhardi par ce succès, il s'attaqua à son alimentation. Pas de régime drastique, mais une règle simple: cuisiner ses repas au lieu de commander. "Je ne savais même pas faire cuire des pâtes," confia-t-il plus tard en riant. Il commença par des recettes simples: légumes rôtis, poissons au four, soupes maison. En trois mois, il avait perdu 7 kilos sans sensation de privation.

Le tournant décisif vint quand Lisa, sa collègue, l'invita à une initiation au yoga. "Je vais avoir l'air ridicule," pensa-t-il en acceptant à contrecœur. Pourtant, cette première séance lui révéla à quel point son corps était devenu étranger, rigide, déconnecté. Le professeur lui dit une phrase qui changea sa perspective: "La souplesse du corps reflète souvent celle de l'esprit."

Mathieu intégra progressivement ces trois piliers dans sa routine: mouvement quotidien, alimentation consciente, pratique corps-esprit. Aucune transformation spectaculaire, mais une accumulation de petits changements cohérents.

Six mois plus tard, lors de son nouveau bilan, son médecin fut stupéfait: tension artérielle normalisée, glycémie équilibrée, 15 kilos en moins. "Comment avez-vous fait?" demanda-t-il. 

"J'ai arrêté de négocier avec ma santé," répondit simplement Mathieu. "J'ai compris qu'elle n'était pas un luxe, mais le fondement de tout le reste."`;
      }
    } else {
      // Réponse générique si le sujet n'est pas identifié
      if (style === "expert") {
        return `En tant qu'expert dans ce domaine avec plus de 15 ans d'expérience et des collaborations avec des institutions de premier plan, je peux apporter un éclairage basé sur des données récentes et une connaissance approfondie du sujet.

Voici cinq points essentiels à considérer concernant votre question:

1. **L'évolution du contexte actuel** - Les dernières études publiées dans des revues spécialisées montrent une évolution significative des paradigmes traditionnels. Les données recueillies auprès de plus de 1200 participants sur une période de 3 ans démontrent une transformation fondamentale des approches conventionnelles, avec une efficacité accrue de 27% pour les méthodes intégratives par rapport aux approches classiques.

2. **L'importance d'une approche systémique** - L'analyse de cas récents révèle que les solutions isolées ont un impact limité comparé aux interventions systémiques. Dans une étude comparative de 2023, les approches holistiques ont démontré une pérennité 3,4 fois supérieure et un retour sur investissement 2,7 fois plus élevé que les solutions segmentées.

3. **Le rôle croissant des technologies émergentes** - L'intégration des technologies avancées comme l'intelligence artificielle et l'analyse prédictive transforme radicalement ce domaine. Les organisations qui ont adopté ces outils ont observé une optimisation de 32% de leurs processus décisionnels et une réduction de 41% des erreurs opérationnelles selon les données du dernier rapport sectoriel.

4. **La dimension humaine comme facteur clé** - Malgré les avancées technologiques, l'élément humain reste déterminant. Les recherches qualitatives menées auprès de 78 organisations leaders démontrent que les structures qui investissent dans le développement des compétences humaines complémentaires aux outils technologiques surpassent de 40% leurs concurrents qui privilégient uniquement l'automatisation.

5. **L'adaptation comme compétence fondamentale** - Dans un environnement en constante évolution, la capacité d'adaptation devient cruciale. Les données longitudinales collectées sur cinq ans révèlent que les entités ayant développé des systèmes adaptatifs robustes ont mieux traversé les périodes d'incertitude, avec une résilience opérationnelle 3,2 fois supérieure à la moyenne du secteur.

Pour mettre en œuvre ces principes efficacement, je recommande une stratégie progressive combinant évaluation rigoureuse du contexte spécifique, développement d'une vision intégrée, et implémentation itérative avec des cycles d'apprentissage structurés.`;
      } else if (style === "conversational") {
        return `Ah, quelle excellente question! C'est exactement ce genre de sujet qui me passionne depuis que j'ai commencé à m'y intéresser il y a 8 ans lors d'une conférence qui a complètement changé ma perspective! 🤓

Je me souviens encore de ma confusion au début - j'étais comme toi, cherchant des réponses claires dans une mer d'informations contradictoires. Voici ce que j'ai appris au fil des années (et après quelques erreurs dont je peux te faire économiser le temps et l'énergie):

• La première chose qui m'a frappé, c'est que la plupart des conseils "standard" ne fonctionnent pas pour tout le monde! J'ai passé des mois à suivre les recommandations classiques sans résultat, jusqu'à ce que je comprenne qu'il fallait adapter les approches à ma situation unique. C'est comme essayer de porter les chaussures de quelqu'un d'autre - même si elles sont magnifiques, si elles ne te vont pas, tu vas souffrir!

• La seconde révélation est venue quand j'ai commencé à expérimenter par moi-même plutôt que de suivre aveuglément les "experts". J'ai tenu un journal détaillé pendant 3 mois, notant ce qui fonctionnait et ce qui échouait - et les résultats m'ont totalement surpris! Certaines des méthodes les plus simples se sont avérées les plus efficaces pour moi.

• Un point crucial que peu de personnes mentionnent: la cohérence bat l'intensité à tous les coups! J'ai constaté qu'une pratique modérée mais régulière produisait des résultats 5 fois supérieurs à des efforts intenses mais sporadiques. C'est comme l'histoire de la tortue et du lièvre - les pas constants, même petits, t'emmènent plus loin!

• Ce qui m'a vraiment aidé aussi, c'est de trouver une communauté de personnes partageant les mêmes intérêts. Les forums en ligne et les groupes locaux m'ont fourni non seulement du soutien, mais aussi des astuces pratiques que je n'aurais jamais découvertes autrement.

• Enfin, sois patient(e) avec toi-même! Les changements significatifs prennent du temps. J'ai failli abandonner après 6 semaines sans voir de progrès évident, puis soudainement, le mois suivant, tout s'est mis en place comme par magie.

Est-ce que tu as déjà essayé certaines approches? Je serais curieux de savoir ce qui a fonctionné pour toi jusqu'à présent!`;
      } else {
        return `Marc fixait son écran d'ordinateur, le curseur clignotant sur un document vide depuis presque une heure. À 37 ans, ce chef de projet respecté se trouvait face à un défi qu'aucune de ses compétences professionnelles ne l'avait préparé à affronter.

Tout avait commencé trois mois plus tôt, lors de la restructuration de son entreprise. D'une équipe de cinq personnes, Marc s'était retrouvé seul responsable d'un projet crucial avec des délais impossibles. "C'est temporaire," lui avait assuré son directeur. "Juste le temps de finaliser la réorganisation."

Les premières semaines, Marc avait compensé en allongeant ses journées, arrivant à 7h, partant après 20h. Il répondait aux emails le week-end, sacrifiait son sommeil. Sa compagne Clara remarquait les cernes qui s'installaient sous ses yeux, mais chaque fois qu'elle s'inquiétait, il répondait par son habituel: "Ça va aller, c'est juste une période chargée."

Jusqu'à ce matin où, devant son écran, son esprit habituellement vif et organisé refusait simplement de fonctionner. Une sensation d'écrasement, comme si l'air devenait trop lourd à respirer. Pour la première fois de sa carrière, Marc était face à l'évidence: il avait atteint sa limite.

À 11h, il fit quelque chose d'impensable - il quitta le bureau, éteignit son téléphone professionnel, et marcha sans destination précise pendant deux heures.

Au bord d'un petit parc, il s'assit sur un banc et observa un groupe d'enfants jouer, insouciants. Quand avait-il perdu cette capacité à être pleinement présent? À apprécier un moment sans penser à la prochaine tâche, au prochain objectif?

Le soir, Clara fut surprise de le voir rentrer tôt. Plus encore quand il prononça ces mots: "J'ai besoin d'aide." Cette simple phrase, si difficile à dire pour cet homme habitué à être le pilier des autres, marqua le début d'une transformation.

Dans les semaines qui suivirent, Marc prit trois décisions: d'abord, une conversation franche avec sa direction sur la charge de travail intenable. À sa surprise, son honnêteté fut reçue avec compréhension - d'autres collègues vivaient la même situation en silence.

Ensuite, il établit des limites claires: plus d'emails après 19h ou le week-end. Il bloqua des plages dans son agenda pour les tâches profondes, sans interruptions.

Enfin, il réintroduisit dans sa vie ce qu'il avait progressivement abandonné: ses sorties vélo du samedi, les dîners avec Clara sans écrans, et même un cours de photographie qu'il reportait depuis deux ans.

Six mois plus tard, Marc ne travaillait pas moins, mais différemment. Sa productivité avait paradoxalement augmenté, sa créativité était revenue. "Ce n'est pas que tu faisais les choses mal avant," lui dit Clara un soir. "C'est que maintenant, tu les fais en phase avec toi-même."`;
      }
    }
  };

  // Fonction pour copier la réponse dans le presse-papier
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier !");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-[#b92b27] hover:bg-[#a62520]">
          <MessageSquareText className="mr-2 h-4 w-4" />
          Créer une réponse Quora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-[#b92b27]" />
            Assistant Quora
          </DialogTitle>
          <DialogDescription>
            Créez des réponses optimisées pour Quora et augmentez votre visibilité
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="general">Étape 1: Question</TabsTrigger>
            <TabsTrigger value="response">Étape 2: Réponse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div>
              <Label htmlFor="quora-question">Sélectionner une question</Label>
              <Select 
                value={quoraQuestion} 
                onValueChange={setQuoraQuestion}
              >
                <SelectTrigger id="quora-question">
                  <SelectValue placeholder="Choisissez une question..." />
                </SelectTrigger>
                <SelectContent>
                  {popularQuestions.map((question) => (
                    <SelectItem key={question} value={question}>
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Ou saisissez votre propre question</Label>
              <Textarea
                placeholder="Écrivez votre question Quora ici..."
                className="min-h-[100px] mt-2"
                value={quoraQuestion === popularQuestions.find(q => q === quoraQuestion) ? "" : quoraQuestion}
                onChange={(e) => setQuoraQuestion(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Style de réponse</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button 
                  type="button" 
                  variant={toneStyle === "expert" ? "default" : "outline"}
                  className={toneStyle === "expert" ? "bg-[#b92b27] hover:bg-[#a62520]" : ""}
                  onClick={() => setToneStyle("expert")}
                >
                  Expert
                </Button>
                <Button 
                  type="button" 
                  variant={toneStyle === "conversational" ? "default" : "outline"}
                  className={toneStyle === "conversational" ? "bg-[#b92b27] hover:bg-[#a62520]" : ""}
                  onClick={() => setToneStyle("conversational")}
                >
                  Conversationnel
                </Button>
                <Button 
                  type="button" 
                  variant={toneStyle === "storytelling" ? "default" : "outline"}
                  className={toneStyle === "storytelling" ? "bg-[#b92b27] hover:bg-[#a62520]" : ""}
                  onClick={() => setToneStyle("storytelling")}
                >
                  Storytelling
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={() => {
                  if (quoraQuestion) {
                    setActiveTab("response");
                    if (!quoraAnswer) {
                      generateAnswer();
                    }
                  } else {
                    toast.error("Veuillez sélectionner ou saisir une question");
                  }
                }}
                className="bg-[#b92b27] hover:bg-[#a62520]"
              >
                Suivant
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="response" className="space-y-4">
            <div className="mb-4">
              <Label>Question sélectionnée</Label>
              <div className="p-3 bg-gray-50 rounded-md mt-1 text-sm">
                {quoraQuestion}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label>Réponse générée</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={generateAnswer}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-3 w-3" />
                      Régénérer
                    </>
                  )}
                </Button>
              </div>
              
              <div className="relative mt-2">
                <Textarea
                  value={quoraAnswer}
                  onChange={(e) => setQuoraAnswer(e.target.value)}
                  placeholder="Votre réponse apparaîtra ici..."
                  className="min-h-[200px]"
                />
                {quoraAnswer && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(quoraAnswer)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {quoraAnswer && (
                <div className="text-xs text-gray-500 mt-1 flex items-center">
                  <span className="mr-1">Caractères:</span>
                  <span className={quoraAnswer.length < 500 ? "text-red-500 font-bold" : "text-green-500"}>
                    {quoraAnswer.length}
                  </span>
                  <span className="mx-1">/</span>
                  <span>500 minimum recommandé</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("general")}
              >
                Retour
              </Button>
              <Button 
                onClick={() => {
                  if (quoraAnswer) {
                    if (quoraAnswer.length < 500) {
                      toast.error("Votre réponse doit contenir au moins 500 caractères pour être efficace sur Quora");
                      return;
                    }
                    copyToClipboard(quoraAnswer);
                    toast.success("Réponse copiée et prête à être publiée sur Quora !");
                    setOpen(false);
                  } else {
                    toast.error("Veuillez d'abord générer une réponse");
                  }
                }}
                className="bg-[#b92b27] hover:bg-[#a62520]"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copier et terminer
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
