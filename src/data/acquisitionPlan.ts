/**
 * Plan d'acquisition 14 jours — groupes Facebook + parrainage.
 * Aucun chiffre de résultat n'est promis : les textes parlent de la méthode.
 * Le jeton {{LIEN}} est remplacé à l'affichage par le lien de partage
 * (lien de parrainage de l'abonné quand il en a un).
 */

export interface GroupSearchTarget {
  /** Requête exacte à taper dans la recherche Facebook (onglet Groupes). */
  query: string;
  /** Ce qu'on cherche dans les résultats. */
  note: string;
}

/** On ne devine pas des noms de groupes : on donne les requêtes qui les trouvent. */
export const GROUP_SEARCHES: GroupSearchTarget[] = [
  { query: 'Amazon KDP francophone', note: 'Le cœur de cible : auteurs qui publient déjà.' },
  { query: 'autoédition auteurs indépendants', note: 'Auteurs bloqués entre manuscrit et publication.' },
  { query: 'écrire un livre entraide', note: 'Beaucoup de débutants, très réceptifs aux méthodes.' },
  { query: 'revenus passifs ebook', note: 'Public business ; parler chiffre d’affaires, pas littérature.' },
  { query: 'auteurs jeunesse album illustré', note: 'Cible parfaite pour le mode livre illustré.' },
  { query: 'freelance rédaction web France', note: 'Ils ont déjà la plume ; il leur manque le produit.' },
  { query: 'business en ligne débutants francophone', note: 'Angle « premier produit numérique ».' },
  { query: 'IA ChatGPT francophone', note: 'Angle outil ; éviter le ton commercial, ils le détectent.' },
];

export const GROUP_RULES: string[] = [
  'Jour 1 à 3 dans un nouveau groupe : on ne poste rien. On commente 5 publications par jour, utilement.',
  'Un lien direct dès le premier post = suppression et souvent bannissement. On attend le 4e jour.',
  'Un seul post promotionnel par semaine et par groupe. Le reste : de la valeur pure.',
  'On répond à TOUS les commentaires dans l’heure : c’est ce qui fait remonter le post.',
  'Quand un groupe interdit les liens : on écrit « lien en commentaire » et on le met soi-même en 1er commentaire.',
  'On rejoint 3 nouveaux groupes par jour maximum, sinon Facebook limite le compte.',
  'On ne copie jamais le même texte dans 5 groupes le même jour : Facebook le marque comme spam.',
];

export interface AcquisitionPost {
  day: number;
  theme: string;
  /** Post « valeur » : aucun lien, il crée la crédibilité. */
  value: string;
  /** Post « offre » : contient {{LIEN}}, à réserver au 4e jour et plus. */
  offer?: string;
}

export const ACQUISITION_POSTS: AcquisitionPost[] = [
  {
    day: 1,
    theme: 'Se présenter sans vendre',
    value:
      "Bonjour à tous, je me présente : Georges. J'accompagne des auteurs francophones qui veulent publier sur Amazon KDP sans y passer six mois.\n\nJe ne viens rien vendre ici. Je vais partager ce que j'observe concrètement : ce qui bloque les gens, et ce qui débloque.\n\nPremière observation, et elle surprend : ce n'est presque jamais l'écriture qui fait abandonner. C'est le moment où il faut transformer un texte en fichier accepté par Amazon.\n\nEt vous, à quelle étape vous êtes bloqué en ce moment ?",
  },
  {
    day: 2,
    theme: 'Le vrai point de blocage',
    value:
      "Trois raisons pour lesquelles un manuscrit ne devient jamais un livre publié :\n\n1. Le plan est trop vague. « 10 chapitres sur la confiance en soi » n'est pas un plan, c'est une intention. Un plan, c'est une promesse par chapitre.\n\n2. La correction est repoussée. On relit son propre texte, on ne voit plus rien, on abandonne.\n\n3. Le fichier Amazon. Marges, sommaire cliquable, dos de couverture au bon format… c'est là que la plupart des gens s'arrêtent.\n\nLaquelle des trois vous parle le plus ?",
  },
  {
    day: 3,
    theme: 'Méthode offerte',
    value:
      "La méthode du « chapitre-promesse », que j'utilise pour tous les plans de livres :\n\nPour chaque chapitre, écrivez une seule phrase : « À la fin de ce chapitre, le lecteur saura ___ et pourra ___ ».\n\nSi vous n'arrivez pas à remplir les deux trous, le chapitre n'a pas sa place. Vous venez d'éliminer 30 % du remplissage inutile de votre livre.\n\nFaites l'exercice sur votre projet en cours et dites-moi combien de chapitres survivent. Chez la plupart des gens, c'est violent.",
  },
  {
    day: 4,
    theme: 'Premier post avec lien',
    value:
      "Choisir sa niche avant d'écrire change tout : c'est la différence entre un livre qui se vend pendant 3 ans et un livre que personne ne cherche.\n\nCe que je regarde pour valider une niche : une demande constante toute l'année, moins de 300 concurrents sur le mot-clé principal, un prix moyen au-dessus de 6 €, et des avis clients qui se plaignent d'un manque précis.",
    offer:
      "J'ai réuni 10 niches analysées avec ces critères dans un pack gratuit — mots-clés, prix pratiqués et angle à prendre pour chacune.\n\nC'est offert, sans rien acheter : {{LIEN}}\n\n(Si le lien est interdit ici, dites-le moi et je le retire.)",
  },
  {
    day: 5,
    theme: 'Le mythe des 300 pages',
    value:
      "« Mon livre est trop court pour être vendu. »\n\nNon. Sur Amazon, un guide pratique de 80 pages qui résout un problème précis se vend mieux qu'un pavé de 300 pages qui parle de tout.\n\nLe lecteur n'achète pas des pages. Il achète une transformation, le plus vite possible.\n\nÉcrivez court, écrivez utile, publiez. Vous ferez le tome 2 après.",
  },
  {
    day: 6,
    theme: 'Erreur de couverture',
    value:
      "Test à faire maintenant : réduisez votre couverture à la taille d'une vignette de 150 pixels, comme sur mobile.\n\nSi vous ne lisez plus le titre, votre couverture est morte. C'est à cette taille que 80 % des acheteurs la découvrent.\n\nRègles qui sauvent : 5 mots maximum sur la couverture, un contraste franc, et une police lisible même floue. Le reste est décoratif.",
  },
  {
    day: 7,
    theme: 'Question ouverte',
    value:
      "Question honnête au groupe : combien de manuscrits avez-vous en cours, jamais terminés ?\n\nMoi j'en ai eu trois avant de comprendre que le problème n'était pas la motivation, mais l'absence de méthode entre « j'ai une idée » et « c'est en ligne ».\n\nDites votre chiffre en commentaire. On va voir qu'on est nombreux.",
  },
  {
    day: 8,
    theme: 'Deuxième post avec lien',
    value:
      "Ce qu'on oublie systématiquement avant de cliquer sur « Publier » sur KDP :\n\n— Le sommaire cliquable (sans lui, Amazon dégrade l'expérience Kindle)\n— Les 7 mots-clés : ce sont 7 phrases de recherche, pas 7 mots\n— Deux catégories bien choisies valent mieux que dix au hasard\n— La description avec un peu de mise en forme HTML, pas un bloc de texte\n— Le prix : entre 2,99 € et 9,99 € pour toucher les 70 % de royalties",
    offer:
      "J'ai mis cette checklist complète dans le kit de démarrage gratuit, avec le pack de 10 niches : {{LIEN}}",
  },
  {
    day: 9,
    theme: 'Preuve par la méthode',
    value:
      "Ordre dans lequel je travaille un livre, et il n'est pas intuitif :\n\n1. La niche et le lecteur cible\n2. Le titre et la promesse\n3. Le plan chapitre par chapitre\n4. SEULEMENT après : l'écriture\n5. La correction en 4 passages (structure, style, orthographe, fin de chapitre)\n6. La mise en forme et les métadonnées\n\nCommencer par l'étape 4 est l'erreur la plus commune. C'est comme construire les murs avant les fondations.",
  },
  {
    day: 10,
    theme: 'Objection prix',
    value:
      "« L'IA écrit mal. »\n\nOui, quand on lui demande « écris-moi un chapitre ». Elle produit alors du texte lisse et vide.\n\nNon, quand on lui donne une bible du livre, la mémoire des chapitres précédents, un angle et une contrainte de style. Là, elle rédige à partir de VOTRE matière.\n\nLa différence n'est pas l'outil. C'est ce qu'on lui donne à manger.",
  },
  {
    day: 11,
    theme: 'Format court',
    value:
      "Trois titres qui ne se vendent pas, et leur correction :\n\n« Le pouvoir des habitudes » → trop vague, déjà pris → « 21 jours pour tenir une habitude, même quand la motivation tombe »\n\n« Mon parcours » → personne ne vous connaît → « J'ai tout perdu à 42 ans : le plan que j'ai suivi pour repartir »\n\n« Guide de la nutrition » → concurrence énorme → « Manger équilibré en 15 minutes quand on travaille en horaires décalés »\n\nUn bon titre contient un problème et une contrainte.",
  },
  {
    day: 12,
    theme: 'Troisième post avec lien',
    value:
      "Beaucoup me demandent combien de temps prend un livre. Réponse honnête : le temps que vous mettez à décider de la niche.\n\nUne fois la niche et le plan fixés, la rédaction est la partie la plus rapide. C'est l'indécision qui coûte des mois.",
    offer:
      "Si vous voulez sauter cette étape d'indécision, j'offre 10 niches déjà analysées : {{LIEN}}",
  },
  {
    day: 13,
    theme: 'Retour d’expérience',
    value:
      "Ce que m'ont dit les auteurs qui ont enfin publié, tous sans exception :\n\n« Je n'aurais jamais dû attendre d'être prêt. »\n\nLe premier livre n'est pas là pour être parfait. Il est là pour exister, pour vous apprendre le processus, et pour rendre le deuxième trois fois plus rapide.\n\nPubliez le premier. Perfectionnez le troisième.",
  },
  {
    day: 14,
    theme: 'Bilan et invitation',
    value:
      "Deux semaines que je partage ici ce que j'observe sur l'autoédition francophone. Merci pour les échanges, certains commentaires valaient à eux seuls un chapitre.\n\nRécapitulatif de ce qui revient le plus :\n— On écrit avant d'avoir validé la niche\n— On veut un livre long au lieu d'un livre utile\n— On abandonne à l'étape technique, à deux doigts de la ligne d'arrivée",
    offer:
      "Tout ce que j'ai partagé est réuni dans le pack gratuit (10 niches + checklist de publication) : {{LIEN}}",
  },
];

export interface ReferralMessage {
  id: string;
  label: string;
  channel: 'email' | 'sms' | 'whatsapp';
  subject?: string;
  body: string;
}

/** Messages pour activer la base existante en parrainage. */
export const REFERRAL_MESSAGES: ReferralMessage[] = [
  {
    id: 'email-parrainage',
    label: 'Email à la base actuelle',
    channel: 'email',
    subject: 'Vous connaissez quelqu’un qui veut écrire un livre ?',
    body:
      "Bonjour {{PRENOM}},\n\nUne demande simple, et vous pouvez y répondre en 30 secondes.\n\nVous connaissez sûrement une personne qui répète depuis des années qu'elle aimerait écrire un livre, sans jamais s'y mettre.\n\nTransférez-lui simplement ce lien : {{LIEN}}\n\nElle y trouvera, gratuitement et sans rien acheter, un pack de 10 niches rentables analysées et la checklist complète de publication sur Amazon KDP.\n\nC'est tout. Pas de formulaire compliqué, pas d'engagement pour elle.\n\nMerci sincèrement,\nGeorges",
  },
  {
    id: 'whatsapp-proche',
    label: 'Message WhatsApp à un proche',
    channel: 'whatsapp',
    body:
      "Salut ! Tu m'avais parlé d'écrire un livre un jour. Je suis tombé sur ça : 10 niches déjà analysées + la checklist pour publier sur Amazon, c'est offert. Jette un œil : {{LIEN}}",
  },
  {
    id: 'sms-relance',
    label: 'SMS court de relance',
    channel: 'sms',
    body:
      "Le pack de 10 niches Amazon KDP est encore offert cette semaine : {{LIEN}} — Georges",
  },
];
