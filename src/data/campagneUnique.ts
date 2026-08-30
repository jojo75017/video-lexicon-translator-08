/**
 * CAMPAGNE UNIQUE — source de vérité de tous les emails EbookStudio.
 *
 * Toutes les anciennes campagnes (sales, canonical, Brevo, séquences multiples)
 * ont été supprimées. Il n'existe plus qu'une seule séquence, ici.
 *
 * Parcours : email → page cadeau /cadeau (5 niches visibles) → inscription
 * (les bonus se débloquent immédiatement) → bouton Commander (47 € à vie).
 *
 * Règles de rédaction appliquées à chaque email :
 * - un seul lien, répété 2 à 3 fois (texte + bouton) ;
 * - le bénéfice est dans l'objet ;
 * - aucune pièce jointe : le cadeau se consulte sur la page, c'est ce qui crée le clic.
 */

import { SITE_ORIGIN, COMMANDER_URL, commanderUrl } from './externalLinks';

export const CAMPAGNE = {
  id: 'cadeau-5-niches-2026',
  name: 'Campagne unique — 5 niches offertes puis accès à vie 47 €',
  tag: 'PROSPECT-EBS',
  price: '47 €',
  deadline: '30 septembre 2026',
  afterOffer: 'abonnement mensuel sans engagement : 27 €/mois (Plume) ou 47 €/mois (Édition)',
} as const;

/** Page cadeau : c'est le seul lien des trois premiers emails. */
export const CADEAU_PAGE_URL = `${SITE_ORIGIN}/cadeau`;
export const BONUS_PAGE_URL = `${SITE_ORIGIN}/bonus`;

export const cadeauUrl = (src: string) => `${CADEAU_PAGE_URL}?src=${src}`;
export const bonusUrl = (src: string) => `${BONUS_PAGE_URL}?src=${src}`;

/* ------------------------------ LES BONUS ------------------------------ */

export interface CampagneBonus {
  key: string;
  title: string;
  value: string;
  description: string;
  /** Où le bonus se consulte / se télécharge. */
  to: string;
  /** Vrai si le lien est un téléchargement direct (PDF). */
  download?: boolean;
}

/** Bonus débloqués dès l'inscription (plus besoin d'acheter pour les recevoir). */
export const CAMPAGNE_BONUSES: CampagneBonus[] = [
  {
    key: 'niches',
    title: 'Vos 5 niches Amazon rentables',
    value: '47 €',
    description:
      'Cinq niches analysées avec la demande réelle, le mot-clé Amazon exact et le niveau de concurrence. De quoi choisir un sujet qui se vend avant d\'écrire la première ligne.',
    to: '/cadeau',
  },
  {
    key: 'structuration',
    title: 'Le guide pour structurer un ebook',
    value: '27 €',
    description:
      'Comment organiser vos idées en un plan cohérent, chapitre par chapitre, pour ne jamais vous perdre en cours d\'écriture. Exemples concrets inclus.',
    to: '/guide-comprendre-ebook.pdf',
    download: true,
  },
  {
    key: 'anti-plagiat',
    title: 'Le pack anti-plagiat',
    value: '27 €',
    description:
      'La méthode complète pour publier un texte irréprochable et passer les contrôles Amazon sans stress.',
    to: '/pack-anti-plagiat.pdf',
    download: true,
  },
  {
    key: 'kit',
    title: 'Le kit de démarrage guidé',
    value: '37 €',
    description:
      'Votre premier livre du sommaire au fichier prêt pour Amazon, étape par étape, sans rien deviner.',
    to: '/kit-demarrage-ebookstudio-v3.pdf',
    download: true,
  },
  {
    key: 'gemini',
    title: 'Le guide de la clé API Gemini',
    value: '17 €',
    description:
      'Comment obtenir votre clé gratuite en 4 minutes pour générer sans limite. Captures d\'écran incluses.',
    to: '/Guide_Cle_Gemini_API.pdf',
    download: true,
  },
];

export const BONUS_TOTAL_VALUE = '155 €';

/* ----------------------------- LES EMAILS ----------------------------- */

export interface CampagneEmail {
  id: string;
  /** Template utilisé pour le suivi des ouvertures et des clics. */
  template: string;
  /** Délai à régler dans Systeme.io, en jours après l'entrée dans la campagne. */
  delayDays: number;
  subject: string;
  preheader: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  /** Ce que le clic doit produire — sert de repère dans le panneau admin. */
  goal: string;
}

const SIGN = `Georges Boubet
Fondateur d'EbookStudio
boubetgeorges@gmail.com`;

export const CAMPAGNE_EMAILS: CampagneEmail[] = [
  {
    id: 'cadeau-1',
    template: 'cadeau-1',
    delayDays: 0,
    subject: 'Vos 5 niches sont prêtes (ouvrez-les ici)',
    preheader: '5 niches Amazon avec la demande réelle et le mot-clé exact. Rien à télécharger.',
    goal: 'Voir ses 5 niches sur la page',
    ctaLabel: 'Voir mes 5 niches',
    ctaUrl: cadeauUrl('cadeau-1'),
    body: `Bonjour,

Vos 5 niches Amazon sont affichées sur cette page, en clair, sans fichier à télécharger :

>> Voir mes 5 niches : ${cadeauUrl('cadeau-1')}

Pour chacune, vous voyez le sujet exact, le mot-clé Amazon à viser, le niveau de concurrence et le prix constaté. Ce sont des niches où la demande existe déjà : vous n'inventez pas un marché, vous vous placez sur un marché qui achète.

Prenez trois minutes pour les lire et repérez celle qui vous parle. C'est la seule décision importante avant d'écrire.

Sur la même page, vous débloquez aussi vos bonus en laissant votre email : le guide pour structurer un ebook, le pack anti-plagiat, le kit de démarrage et le guide de la clé Gemini. Tout est ouvert immédiatement, sans rien acheter.

>> Ouvrir la page : ${cadeauUrl('cadeau-1')}

${SIGN}`,
  },
  {
    id: 'cadeau-2',
    template: 'cadeau-2',
    delayDays: 1,
    subject: 'La niche n°3 est celle que personne n\'exploite',
    preheader: 'Concurrence faible, demande installée. Elle est toujours sur votre page.',
    goal: 'Revenir sur la page cadeau',
    ctaLabel: 'Revoir mes 5 niches',
    ctaUrl: cadeauUrl('cadeau-2'),
    body: `Bonjour,

Sur les cinq niches que je vous ai données, il y en a une que presque personne ne travaille sérieusement : la troisième.

La demande est installée depuis des années, les lecteurs achètent plusieurs livres sur le sujet, et la concurrence reste faible parce que les auteurs la trouvent moins « excitante » que la romance ou le thriller. C'est exactement pour ça qu'elle est rentable.

>> Revoir mes 5 niches : ${cadeauUrl('cadeau-2')}

Regardez la ligne « mot-clé Amazon » de cette niche. C'est la requête que tapent les lecteurs. Un livre dont le titre et la description reprennent ce mot-clé se retrouve devant eux, pas au fond du catalogue.

Choisissez votre niche aujourd'hui, même si vous n'écrivez pas encore une ligne.

>> Ouvrir la page : ${cadeauUrl('cadeau-2')}

${SIGN}`,
  },
  {
    id: 'cadeau-3',
    template: 'cadeau-3',
    delayDays: 3,
    subject: 'J\'ai écrit un livre entier hier soir, je vous montre',
    preheader: 'Du sommaire au fichier Amazon, sur la même page que vos niches.',
    goal: 'Voir la démonstration puis le bouton Commander',
    ctaLabel: 'Voir comment ça se passe',
    ctaUrl: cadeauUrl('cadeau-3'),
    body: `Bonjour,

Hier soir, j'ai pris une des cinq niches que vous avez reçues et j'en ai fait un livre complet. Voilà le trajet exact :

- J'ai donné le sujet en une phrase. Le Sommaire IA m'a rendu un plan chapitre par chapitre, que j'ai corrigé à la main.
- Chaque chapitre a été rédigé séparément, en tenant compte des précédents : pas de contradiction au chapitre 12, pas de répétition du chapitre 3.
- La correction professionnelle a relu l'ensemble : répétitions, fins de chapitres bancales, français propre du début à la fin.
- L'export a sorti un Word et un PDF conformes aux exigences d'Amazon KDP, sommaire compris.
- La couverture a été générée puis recadrée aux dimensions exactes d'Amazon. Aucun fichier refusé.
- La fiche Amazon était prête : titre, description, mots-clés, catégories.

Ce n'est pas un cours ni une méthode à appliquer plus tard. C'est un livre, à la fin de la soirée.

>> Voir comment ça se passe : ${cadeauUrl('cadeau-3')}

Vos 5 niches sont toujours en haut de cette page, et le bouton pour entrer dans l'atelier est juste en dessous.

${SIGN}`,
  },
  {
    id: 'cadeau-4',
    template: 'cadeau-4',
    delayDays: 5,
    subject: `${CAMPAGNE.price} une fois. Après le ${CAMPAGNE.deadline}, c'est un abonnement`,
    preheader: 'Accès à vie, V3 incluse. Un seul paiement, carte ou PayPal.',
    goal: 'Commander',
    ctaLabel: `Prendre l'accès à vie à ${CAMPAGNE.price}`,
    ctaUrl: commanderUrl('cadeau-4'),
    body: `Bonjour,

Je pose le calcul en clair, sans détour.

Aujourd'hui : ${CAMPAGNE.price} une fois, accès à vie, la V3 incluse d'office, aucun prélèvement mensuel. Un seul règlement, par carte ou par PayPal.

Après le ${CAMPAGNE.deadline} : l'accès à vie disparaît. EbookStudio passe en ${CAMPAGNE.afterOffer}. En trois mois d'abonnement, vous aurez dépassé le prix d'aujourd'hui — et vous continuerez de payer chaque mois.

>> Prendre l'accès à vie à ${CAMPAGNE.price} : ${commanderUrl('cadeau-4')}

Ce que vous ouvrez avec ce paiement : le Sommaire IA, la rédaction chapitre par chapitre, la correction professionnelle, les exports Word et PDF aux normes KDP, les couvertures aux dimensions exactes d'Amazon, la fiche produit, le livre audio et la traduction.

Ceux qui entrent avant la date ne repayeront jamais.

>> Commander maintenant : ${commanderUrl('cadeau-4')}

${SIGN}`,
  },
  {
    id: 'cadeau-5',
    template: 'cadeau-5',
    delayDays: 7,
    subject: 'Dernier rappel : ça ferme ce soir',
    preheader: `Dernier jour pour l'accès à vie à ${CAMPAGNE.price}.`,
    goal: 'Commander',
    ctaLabel: `Commander avant ce soir — ${CAMPAGNE.price}`,
    ctaUrl: commanderUrl('cadeau-5'),
    body: `Bonjour,

C'est mon dernier message sur cette offre.

Ce soir, l'accès à vie à ${CAMPAGNE.price} se termine. Demain, l'entrée se fait uniquement par abonnement mensuel.

>> Commander avant ce soir : ${commanderUrl('cadeau-5')}

Vos 5 niches restent à vous, elles ne disparaissent pas. Ce qui disparaît, c'est la possibilité de payer une seule fois pour l'atelier complet.

Si vous hésitez encore, répondez à cet email : c'est moi qui lis, et je réponds avant ce soir.

>> Dernier lien : ${commanderUrl('cadeau-5')}

${SIGN}`,
  },
];

/** Version HTML simple (sans image, sans CSS externe) pour Systeme.io. */
export function emailToHtml(email: CampagneEmail): string {
  const paragraphs = email.body
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('>>')) {
        return `<p style="margin:28px 0;"><a href="${email.ctaUrl}" style="display:inline-block;background:#0f6b5c;color:#ffffff;padding:14px 24px;border-radius:8px;font-weight:700;text-decoration:none;">${email.ctaLabel}</a></p>`;
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed
          .split('\n')
          .map((line) => line.replace(/^-\s*/, '').trim())
          .filter(Boolean)
          .map((line) => `<li style="margin:0 0 8px;line-height:1.6;">${line}</li>`)
          .join('');
        return `<ul style="margin:0 0 16px;padding-left:20px;">${items}</ul>`;
      }
      return `<p style="margin:0 0 16px;line-height:1.65;">${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');

  return `<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1f2937;max-width:560px;margin:0 auto;">
${paragraphs}
</div>`;
}

/** Étapes de paramétrage côté Systeme.io — une seule campagne, un seul tag. */
export const SYSTEMEIO_SETUP_STEPS: string[] = [
  `Dans Systeme.io, ouvrez Contacts puis Tags et créez le tag « ${CAMPAGNE.tag} » (un seul tag pour toute la campagne).`,
  'Allez dans Emails puis Campagnes et créez une campagne nommée « EbookStudio — 5 niches puis accès à vie ».',
  'Ajoutez 5 emails dans l\'ordre, avec ces délais : 0 jour, 1 jour, 3 jours, 5 jours, 7 jours.',
  'Pour chaque email : collez l\'objet, puis le corps (bouton « Copier le texte » ou « Copier le HTML » pour la version avec bouton).',
  `Dans Automatisations, créez une règle : déclencheur « Tag ajouté » = ${CAMPAGNE.tag} → action « Inscrire à la campagne ».`,
  'Envoyez-vous un test sur boubetgeorges@gmail.com avant d\'activer la règle.',
  'Activez la règle : les nouveaux inscrits partent automatiquement, sans action de votre part.',
];

/* ------------- Compatibilité avec les tableaux de bord admin ------------- */

/** Campagne active exposée aux panneaux de performance et à /gestion-prospects. */
export const ACTIVE_EMAIL_CAMPAIGN = {
  id: CAMPAGNE.id,
  name: CAMPAGNE.name,
  status: 'active' as const,
  sendingBlocked: false,
  price: CAMPAGNE.price,
  afterOffer: CAMPAGNE.afterOffer,
  deadline: CAMPAGNE.deadline,
  checkoutUrl: COMMANDER_URL,
  steps: CAMPAGNE_EMAILS.map((email, index) => ({
    step: index + 1,
    delay: email.delayDays === 0 ? 'immédiat' : `J+${email.delayDays}`,
    label: `E${index + 1} — ${email.goal}`,
    template: email.template,
    subject: email.subject,
  })),
} as const;

/** Tout ce qui ne fait pas partie de la campagne unique est archivé. */
export const isArchivedEmailTemplate = (template?: string | null) => {
  const value = (template || '').toLowerCase();
  if (!value) return false;
  return !CAMPAGNE_EMAILS.some((email) => value.startsWith(email.template));
};
