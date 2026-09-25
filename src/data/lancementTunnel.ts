// Contenus du tunnel de lancement du 1er octobre 2026.
// Structure : accrocher → projeter → prouver → sécuriser.
// Source unique des textes des pages /lancement, /lancement/offres et /lancement/merci.

export const LANCEMENT_DATE_LABEL = "1er octobre 2026";
export const LANCEMENT_DATE_ISO = "2026-10-01T09:00:00+02:00";

/** Source enregistrée pour les prospects du tunnel. */
export const LANCEMENT_LEAD_SOURCE = "lancement-octobre";

export const LANCEMENT_HERO = {
  eyebrow: `Ouverture le ${LANCEMENT_DATE_LABEL}`,
  title: "Écrivez et publiez votre livre sur Amazon, même en partant d'une page blanche",
  subtitle:
    "EbookStudio vous accompagne de l'idée au livre publié : sommaire, rédaction chapitre par chapitre, correction, couverture, mise en page et fiche de vente. Vous gardez la main sur tout, l'atelier fait le travail pénible.",
  bullets: [
    "Votre livre complet, chapitre après chapitre, sans blocage devant la page blanche",
    "Couverture et mise en page aux normes Amazon KDP, prêtes à envoyer",
    "Correction éditoriale : cohérence, chronologie, répétitions, grammaire, typographie française",
    "Fiche de vente, mots-clés et calendrier de publication",
  ],
  formTitle: "Recevez l'accès au lancement et les 10 niches offertes",
  formNote:
    "Vous recevez immédiatement le document des 10 niches qui vendent, puis l'ouverture des offres.",
};

/** « Est-ce que c'est pour moi ? » */
export const LANCEMENT_POUR_QUI = {
  title: "Est-ce que c'est pour moi ?",
  yes: {
    title: "Oui, si vous vous reconnaissez ici",
    items: [
      "Vous avez une idée de livre et vous n'arrivez pas à la structurer",
      "Vous avez commencé un manuscrit qui dort depuis des mois",
      "Vous voulez publier sur Amazon KDP sans y passer six mois",
      "Vous voulez produire plusieurs livres par an, proprement",
      "Vous écrivez déjà et vous cherchez un atelier qui accélère tout le reste",
    ],
  },
  no: {
    title: "Non, si vous cherchez autre chose",
    items: [
      "Vous voulez un livre publié sans jamais rien relire ni valider",
      "Vous cherchez une promesse de revenus garantis",
      "Vous voulez uniquement un logiciel de traitement de texte",
    ],
  },
};

/** « Qu'est-ce que j'obtiens vraiment ? » */
export const LANCEMENT_OBTENU = {
  title: "Qu'est-ce que j'obtiens vraiment ?",
  intro: "Un atelier complet, en français, du premier mot jusqu'à la page de vente Amazon.",
  blocks: [
    {
      title: "Le livre écrit",
      items: [
        "Fiche du livre puis cinq propositions de sujet enrichies, fidèles à vos informations",
        "Sommaire construit avec vous, chapitre par chapitre",
        "Rédaction guidée, cohérente du début à la fin",
        "Import possible de votre manuscrit existant (DOCX, PDF, lien)",
      ],
    },
    {
      title: "Le livre corrigé",
      items: [
        "Correction éditoriale : sujet, personnages, chronologie, lieux, événements",
        "Incohérences internes, répétitions, grammaire, ponctuation",
        "Typographie française et fluidité de lecture",
        "Votre texte n'est jamais réécrit sans votre accord",
      ],
    },
    {
      title: "Le livre habillé",
      items: [
        "Studio de couverture Kindle et broché, dos calculé",
        "Plusieurs modèles de mise en avant à partir de la même image",
        "Mise en page et exports PDF, DOCX, EPUB, Kindle",
        "Audiolivre et visuels de présentation",
      ],
    },
    {
      title: "Le livre vendu",
      items: [
        "Fiche produit KDP : titre, sous-titre, description, mots-clés",
        "Choix des catégories et analyse de la niche",
        "Calendrier de publication et plan de lancement",
        "Suivi de vos livres dans votre bibliothèque",
      ],
    },
  ],
};

/** « Pourquoi EbookStudio et pas un autre ? » */
export const LANCEMENT_POURQUOI = {
  title: "Pourquoi EbookStudio et pas un autre ?",
  items: [
    {
      title: "Un atelier, pas un robot à texte",
      body: "Chaque étape est guidée et validée par vous : sujet, sommaire, chapitres, corrections, couverture. Vous restez l'auteur de votre livre.",
    },
    {
      title: "Pensé pour Amazon KDP",
      body: "Formats, dos de couverture, fiche produit, mots-clés et catégories suivent les exigences réelles de la plateforme.",
    },
    {
      title: "Tout en français",
      body: "Interface, textes générés et corrections en français soigné : typographie, ponctuation et fluidité comprises.",
    },
    {
      title: "Un interlocuteur, pas un service anonyme",
      body: "Georges vous répond par email et fait évoluer l'atelier avec les retours des auteurs qui l'utilisent chaque jour.",
    },
  ],
};

/** « Qu'est-ce qui m'empêche d'acheter maintenant ? » */
export const LANCEMENT_OBJECTIONS = [
  {
    objection: "C'est trop cher",
    answer:
      "Un seul livre confié à un prestataire (couverture, correction, mise en page) coûte largement plus qu'un abonnement mensuel ici. Et vous pouvez arrêter quand vous voulez : l'abonnement se résilie en un clic, sans engagement.",
  },
  {
    objection: "Je n'ai pas le temps",
    answer:
      "C'est exactement le problème que l'atelier règle : vous avancez par sessions courtes, chapitre par chapitre, et vous retrouvez votre travail exactement où vous l'avez laissé.",
  },
  {
    objection: "Et si ça ne marche pas pour moi ?",
    answer:
      "Vous commencez par un mois, vous écrivez un premier livre et vous jugez sur le résultat. Si l'atelier ne vous convient pas, vous résiliez avant la période suivante.",
  },
  {
    objection: "Je ne suis pas à l'aise avec la technique",
    answer:
      "Chaque écran vous dit quoi faire, dans l'ordre. Aucune installation, rien à configurer : votre navigateur suffit.",
  },
  {
    objection: "Je n'ai pas d'idée de livre",
    answer:
      "L'atelier commence justement par là : vous donnez vos informations réelles et il vous propose cinq sujets enrichis parmi lesquels choisir ou ajuster.",
  },
];

export const LANCEMENT_FAQ = [
  {
    q: "Quand mon accès est-il ouvert ?",
    a: `Les offres s'ouvrent le ${LANCEMENT_DATE_LABEL}. Dès votre paiement confirmé, vous recevez par email votre code d'accès personnel et votre espace est disponible immédiatement.`,
  },
  {
    q: "Puis-je payer en plusieurs fois ?",
    a: "L'abonnement mensuel étale déjà le coût. PayPal peut aussi proposer ses propres facilités de paiement selon votre éligibilité.",
  },
  {
    q: "Puis-je résilier ?",
    a: "Oui, à tout moment, depuis votre espace. Votre accès reste actif jusqu'à la fin de la période déjà réglée.",
  },
  {
    q: "Mes livres m'appartiennent-ils ?",
    a: "Entièrement. Vous publiez sous votre nom, sur le compte KDP de votre choix, et vous percevez vos droits d'auteur directement.",
  },
  {
    q: "Le mensuel ou l'annuel ?",
    a: "L'annuel revient à dix mois payés : deux mois offerts. Le mensuel convient si vous préférez tester d'abord.",
  },
];

export const LANCEMENT_GARANTIES = [
  "Sans engagement : résiliation en un clic",
  "Paiement sécurisé par carte ou PayPal",
  "Vos livres et vos textes restent votre propriété",
  "Support par email, réponse sous 24 h",
];
