import { V3_PLANS, type V3Plan } from './v3Pricing';

/**
 * Programme Partenaires EbookStudio V3 — SOURCE UNIQUE.
 *
 * Modèle : commission sur le PREMIER paiement de l'abonnement V3 souscrit
 * grâce au lien du partenaire (Plume 27 €/mois ou 270 €/an, Édition 47 €/mois
 * ou 470 €/an). Un seul chiffre à changer : COMMISSION_FIRST_PAYMENT_RATE.
 *
 * Ne pas confondre avec `src/lib/influencerKit.ts`, qui concerne l'ancien
 * programme influenceurs de la V2 (paiement unique) et reste inchangé.
 */

/** Commission versée sur le premier paiement encaissé. */
export const COMMISSION_FIRST_PAYMENT_RATE = 0.15;

/** Ouverture officielle de la V3. */
export const V3_OPENING_LABEL = '1er octobre 2026';

/** Domaine public utilisé dans les liens prêts à copier. */
export const PARTNER_ORIGIN = 'https://ebookstudio.fr';

/** Page publique du programme. */
export const PARTNER_PAGE_PATH = '/partenaires';

/** Page d'atterrissage vers laquelle pointent les liens partenaires. */
export const PARTNER_LANDING_PATH = '/commander';

export const round2 = (n: number): number => Math.round(n * 100) / 100;

export const formatEuro = (n: number): string =>
  n.toLocaleString('fr-FR', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }) + '\u00A0€';

export interface PartnerEarning {
  planId: V3Plan['id'];
  planName: string;
  label: string;
  price: number;
  commission: number;
  /** Mis en avant comme la meilleure commission. */
  highlight: boolean;
}

/** Gains par formule, calculés depuis les tarifs V3 réels. */
export const PARTNER_EARNINGS: PartnerEarning[] = V3_PLANS.flatMap((plan) => [
  {
    planId: plan.id,
    planName: plan.name,
    label: `${plan.name} — mensuel`,
    price: plan.monthlyPrice,
    commission: round2(plan.monthlyPrice * COMMISSION_FIRST_PAYMENT_RATE),
    highlight: false,
  },
  {
    planId: plan.id,
    planName: plan.name,
    label: `${plan.name} — annuel`,
    price: plan.yearlyPrice,
    commission: round2(plan.yearlyPrice * COMMISSION_FIRST_PAYMENT_RATE),
    highlight: plan.id === 'edition',
  },
]);

/** Meilleure commission possible sur une seule vente. */
export const BEST_COMMISSION = Math.max(...PARTNER_EARNINGS.map((e) => e.commission));

/** Commission moyenne réaliste, utilisée par le simulateur. */
export const AVERAGE_COMMISSION = round2(
  PARTNER_EARNINGS.reduce((s, e) => s + e.commission, 0) / PARTNER_EARNINGS.length,
);

/** Construit le lien de suivi d'un partenaire. */
export const buildPartnerLink = (code: string): string =>
  `${PARTNER_ORIGIN}${PARTNER_LANDING_PATH}?ref=${code}`;

/** Réseaux acceptés — pensés pour la niche auto-édition francophone. */
export const PARTNER_PLATFORMS: { value: string; label: string }[] = [
  { value: 'youtube', label: 'Chaîne YouTube' },
  { value: 'blog', label: 'Blog / site' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'groupe', label: 'Groupe Facebook' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'autre', label: 'Autre' },
];

/** Ce que le partenaire reçoit. */
export const PARTNER_BENEFITS: { title: string; detail: string }[] = [
  {
    title: `${Math.round(COMMISSION_FIRST_PAYMENT_RATE * 100)} % de commission`,
    detail: `Sur le premier paiement de chaque abonnement souscrit avec votre lien — jusqu'à ${formatEuro(
      BEST_COMMISSION,
    )} pour une formule annuelle.`,
  },
  {
    title: 'Un lien de suivi personnel',
    detail: 'Créé en une seconde. Chaque clic et chaque vente sont comptés automatiquement.',
  },
  {
    title: 'Un kit prêt à publier',
    detail:
      "Textes de présentation, email pour votre liste, description de vidéo, vidéo de démonstration : vous copiez, vous collez.",
  },
  {
    title: 'Un accès offert à la V3',
    detail: 'Pour tester vous-même le studio avant de le recommander. On ne recommande pas à l\'aveugle.',
  },
];

/** Cibles de démarchage — pour l'espace de recrutement. */
export const PARTNER_TARGET_TYPES: { label: string; where: string; why: string }[] = [
  {
    label: 'Chaînes YouTube auto-édition / KDP francophones',
    where: 'Recherche YouTube : « Amazon KDP français », « auto-édition 2026 », « vivre de ses livres »',
    why: 'Audience déjà convaincue de publier : il ne reste qu\'à montrer l\'outil.',
  },
  {
    label: "Blogs et newsletters d'auteurs indépendants",
    where: 'Recherche Google : « blog auto-édition », « newsletter auteur indépendant »',
    why: 'Un seul email à leur liste peut valoir des mois de publications sociales.',
  },
  {
    label: "Administrateurs de groupes Facebook d'auteurs",
    where: 'Facebook : groupes « auteurs indépendants », « auto-édition francophone »',
    why: 'Contactez l\'admin, jamais le groupe directement : sinon c\'est vu comme du spam.',
  },
  {
    label: 'Podcasts et formateurs en écriture',
    where: 'Recherche podcast : « écrire un livre », « publier son livre »',
    why: 'Ils cherchent en permanence des outils concrets à recommander.',
  },
  {
    label: 'Vos premiers abonnés satisfaits',
    where: 'Vos 21 comptes actuels',
    why: "Le partenaire le plus crédible est celui qui utilise vraiment l'outil.",
  },
];

/** Règles du programme, affichées publiquement. */
export const PARTNER_RULES: string[] = [
  'La commission porte sur le premier paiement encaissé, une fois le délai de remboursement passé.',
  'Aucune commission sur vos propres abonnements ni sur ceux de vos comptes secondaires.',
  'Aucune promesse de revenus, aucun discours « argent facile » : le studio se recommande sur son résultat, pas sur du rêve.',
  'Aucune publicité payante sur la marque EbookStudio ni sur son nom en référencement payant.',
  'Le lien de suivi est personnel et reste actif tant que vous êtes partenaire.',
];

export interface CopyBlock {
  key: string;
  label: string;
  hint?: string;
  body: string;
}

/**
 * Kit partenaire : blocs prêts à copier par le PARTENAIRE.
 * `link` est son propre lien de suivi.
 */
export const buildPartnerKit = (link: string): CopyBlock[] => {
  const plume = V3_PLANS[0];
  const edition = V3_PLANS[1];
  return [
    {
      key: 'presentation',
      label: 'Présentation courte (bio, description, encart)',
      hint: 'À placer en description de vidéo, en bas d\'un article ou dans une bio.',
      body: `EbookStudio V3 — le studio francophone qui accompagne un livre du plan jusqu'au fichier accepté par Amazon KDP : sommaire construit avec vous, écriture chapitre par chapitre avec mémoire du livre, correction en quatre passes, couverture aux gabarits KDP, export PDF/DOCX/EPUB et données KDP prêtes à coller.
${link}`,
    },
    {
      key: 'email',
      label: 'Email à votre liste',
      hint: 'Le format qui convertit le mieux : un problème, une solution, un lien.',
      body: `Objet : l'outil que j'utilise pour finir mes livres

Bonjour,

Vous avez peut-être déjà testé l'IA pour écrire un livre. Le début est enthousiasmant : on tape une idée, du texte apparaît. Puis vient le moment de publier, et là tout se complique — un fichier mal formaté, des chapitres qui se répètent, des données KDP à remplir à la main. Le livre n'existe toujours pas.

EbookStudio V3 est construit pour l'inverse : vous accompagner jusqu'à la fin.

- Le sommaire se construit avec vous, chapitre par chapitre, vous validez.
- Chaque chapitre est écrit séparément, et le studio garde la mémoire du livre : le chapitre douze sait ce qui s'est passé au chapitre trois.
- La correction se fait en quatre passes, comme en maison d'édition.
- La couverture respecte les gabarits Amazon, et les données KDP sont prêtes à coller.

Deux formules : ${plume.name} à ${plume.monthlyPrice} €/mois et ${edition.name} à ${edition.monthlyPrice} €/mois (deux mois offerts en annuel).

Vous pouvez le découvrir ici : ${link}

À bientôt,`,
    },
    {
      key: 'video',
      label: 'Description de vidéo YouTube',
      hint: 'Placez le lien dans les deux premières lignes : c\'est tout ce qui est visible sans cliquer.',
      body: `👉 Découvrir EbookStudio V3 : ${link}

Dans cette vidéo, je montre comment écrire et publier un livre complet sur Amazon KDP avec EbookStudio V3 : construction du sommaire, écriture chapitre par chapitre avec mémoire du livre, correction éditoriale, couverture aux gabarits KDP et export du fichier final.

Formules : ${plume.name} ${plume.monthlyPrice} €/mois · ${edition.name} ${edition.monthlyPrice} €/mois (deux mois offerts sur l'année).

Sommaire :
00:00 Le vrai problème : finir un livre
01:30 Construire le sommaire
03:00 L'écriture avec mémoire du livre
04:15 La correction en quatre passes
05:15 Couverture, export et données KDP`,
    },
    {
      key: 'post',
      label: 'Publication réseaux sociaux',
      hint: 'Sans superlatif ni promesse de revenus : c\'est ce qui passe le mieux dans les groupes d\'auteurs.',
      body: `Le plus dur, quand on écrit un livre, ce n'est pas de trouver l'idée. C'est de le terminer.

Terminer, c'est : un plan qui tient debout, des chapitres qui se souviennent les uns des autres, une langue correcte, une couverture lisible en vignette et des métadonnées propres.

C'est exactement ce que fait EbookStudio V3, du plan jusqu'au fichier accepté par Amazon.

${link}`,
    },
    {
      key: 'answer',
      label: 'Réponse en commentaire ou en message',
      hint: 'Quand on vous demande « tu utilises quoi ? ».',
      body: `J'utilise EbookStudio V3 : le sommaire se construit en dialogue, chaque chapitre est écrit séparément avec la mémoire du livre, et la correction se fait en quatre passes. L'export et les données KDP sont prêts à coller. C'est ici si tu veux voir : ${link}
(lien partenaire, je touche une commission si tu t'abonnes)`,
    },
  ];
};

/**
 * Messages de démarchage — utilisés par VOUS pour recruter des partenaires.
 * `kitUrl` est la page publique du programme.
 */
export const buildOutreachMessages = (kitUrl: string): CopyBlock[] => {
  const rate = Math.round(COMMISSION_FIRST_PAYMENT_RATE * 100);
  return [
    {
      key: 'youtube',
      label: 'Email à une chaîne YouTube',
      hint: 'Court, concret, sans flatterie excessive. Le lien tient en une ligne.',
      body: `Objet : partenariat — outil d'écriture et de publication KDP (${rate} % de commission)

Bonjour,

Je suis Georges Boubet, auteur sur Amazon KDP. J'ai développé EbookStudio, un studio francophone qui accompagne un livre du sommaire jusqu'au fichier accepté par KDP : écriture chapitre par chapitre avec mémoire du livre, correction en quatre passes, couverture aux gabarits Amazon, données KDP prêtes à coller.

La version 3 ouvre le ${V3_OPENING_LABEL}, en abonnement (27 € et 47 € par mois).

Je cherche deux ou trois partenaires dont l'audience publie déjà sur KDP. La proposition est simple : ${rate} % de commission sur le premier paiement de chaque abonnement souscrit via votre lien, soit jusqu'à ${formatEuro(
        BEST_COMMISSION,
      )} par vente en formule annuelle. Je vous ouvre un accès complet gratuit pour que vous testiez avant de décider — je ne vous demande pas de recommander à l'aveugle.

Le détail est ici : ${kitUrl}

Si le sujet ne colle pas à votre ligne, dites-le moi simplement, je n'insisterai pas.

Bien à vous,
Georges Boubet`,
    },
    {
      key: 'newsletter',
      label: 'Email à un blog / une newsletter',
      body: `Objet : un outil à tester pour vos lecteurs auteurs

Bonjour,

Je lis votre travail sur l'auto-édition. Je vous écris parce que j'ai construit un outil qui répond à la question que vos lecteurs se posent tous : comment finir et publier réellement un livre.

EbookStudio V3 (ouverture le ${V3_OPENING_LABEL}) construit le sommaire avec l'auteur, écrit les chapitres un par un en gardant la mémoire du livre, corrige en quatre passes, produit la couverture aux gabarits KDP et les données de publication.

Je vous propose un accès complet gratuit pour l'essayer. Si le résultat vous convainc, il existe un programme partenaire à ${rate} % de commission sur le premier paiement (jusqu'à ${formatEuro(
        BEST_COMMISSION,
      )} par abonnement annuel) : ${kitUrl}

Et si ça ne vous convainc pas, votre retour m'intéresse quand même.

Bien cordialement,
Georges Boubet`,
    },
    {
      key: 'groupe',
      label: 'Message à un administrateur de groupe Facebook',
      hint: 'On écrit à l\'admin, jamais au groupe. Toujours demander l\'autorisation.',
      body: `Bonjour,

Vous administrez un groupe d'auteurs indépendants, donc je vous écris à vous plutôt que de publier dans le groupe — je ne veux pas passer pour du démarchage sauvage.

Je suis auteur KDP et j'ai développé EbookStudio, un studio francophone qui mène un livre du sommaire au fichier accepté par Amazon. La version 3 ouvre le ${V3_OPENING_LABEL}.

Deux questions :
1. Accepteriez-vous que je propose un accès gratuit aux membres qui voudraient le tester ?
2. Si l'outil vous paraît utile, un programme partenaire existe (${rate} % de commission sur le premier paiement) : ${kitUrl}

Si la réponse est non aux deux, aucun souci, je n'en reparlerai pas.

Georges Boubet`,
    },
    {
      key: 'relance',
      label: 'Relance à 5 jours (sans réponse)',
      hint: 'Une seule relance. Au-delà, on passe à la cible suivante.',
      body: `Objet : petite relance — partenariat EbookStudio

Bonjour,

Je me permets un seul message de relance, au cas où le précédent serait passé inaperçu.

La proposition tient en deux lignes : accès complet gratuit à EbookStudio V3 pour le tester, et ${rate} % de commission sur le premier paiement si vous décidez de le recommander. Le détail : ${kitUrl}

Sans réponse de votre part, je ne vous écrirai plus — bonne continuation dans tous les cas.

Georges Boubet`,
    },
    {
      key: 'abonnes-tous',
      label: 'Email à TOUS vos abonnés actuels (à copier dans Systeme.io)',
      hint: "L'envoi se fait depuis Systeme.io, jamais depuis l'application. Un seul email, une seule idée : leur lien.",
      body: `Objet : votre lien de parrainage EbookStudio est prêt

Bonjour,

Vous utilisez déjà EbookStudio. Il arrive donc souvent qu'on vous demande avec quoi vous écrivez vos livres. À partir d'aujourd'hui, cette réponse peut vous rapporter quelque chose.

Le programme de parrainage est ouvert : ${rate} % de commission sur le premier paiement de chaque abonnement souscrit avec votre lien, soit jusqu'à ${formatEuro(
        BEST_COMMISSION,
      )} pour une formule annuelle. Aucune démarche compliquée, aucun engagement.

Vous créez votre lien en une minute ici : ${kitUrl}

Vous y trouverez aussi des textes prêts à copier : un email pour votre liste, une description de vidéo, une publication courte, une réponse à donner en commentaire. Vous copiez, vous collez, votre lien est déjà dedans.

La version 3 ouvre le ${V3_OPENING_LABEL} : c'est le meilleur moment pour en parler.

À très vite,
Georges`,
    },
    {
      key: 'abonne',
      label: 'Message individuel à un abonné satisfait',
      body: `Bonjour,

Vous utilisez EbookStudio et j'ai le sentiment que le studio vous sert vraiment — c'est exactement le profil que je cherche.

Si vous en parlez déjà autour de vous, autant que cela vous rapporte quelque chose : le programme partenaire verse ${rate} % de commission sur le premier paiement de chaque abonnement souscrit avec votre lien, jusqu'à ${formatEuro(
        BEST_COMMISSION,
      )} pour une formule annuelle.

Vous obtenez votre lien en une minute ici : ${kitUrl}

Aucune obligation, évidemment.

Georges`,
    },
  ];
};

/** Questions fréquentes des partenaires. */
export const PARTNER_FAQ: { q: string; a: string }[] = [
  {
    q: 'Quand suis-je payé ?',
    a: 'Une fois le premier paiement encaissé et le délai de remboursement écoulé. Le versement se fait par virement ou PayPal, sur demande, dès 30 € de commissions accumulées.',
  },
  {
    q: 'Faut-il être abonné pour devenir partenaire ?',
    a: "Non. Mais un accès complet vous est offert pour tester le studio : recommander un outil qu'on n'a jamais ouvert ne fonctionne pas, et se voit tout de suite.",
  },
  {
    q: 'Combien de temps mon lien reste-t-il valable ?',
    a: 'Le clic est attribué à votre lien pendant 30 jours. Si la personne s\'abonne dans ce délai, la commission est pour vous.',
  },
  {
    q: 'Puis-je parler du studio sans montrer mon visage ?',
    a: 'Oui. Un email, un article, une capture d\'écran ou un enregistrement d\'écran suffisent. Le kit est conçu pour ça.',
  },
  {
    q: 'Que se passe-t-il si la personne demande un remboursement ?',
    a: "La commission n'est pas due, puisqu'elle porte sur un paiement réellement conservé. C'est la contrepartie d'un programme honnête.",
  },
];
