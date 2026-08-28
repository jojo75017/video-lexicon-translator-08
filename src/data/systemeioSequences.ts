/**
 * Contenu prêt à copier-coller dans Systeme.io.
 *
 * Georges n'a rien à rédiger : objets, corps de messages, liens tracés et
 * délais sont figés ici. Une seule promesse par email, un seul lien principal,
 * un bonus concret à chaque fois — c'est ce qui déclenche le clic.
 *
 * Offre portée par la séquence : dernière offre de lancement à 47 € une fois,
 * accès à vie, V3 incluse d'office, jusqu'au 30 septembre 2026.
 */

import { SITE_ORIGIN, commanderUrl } from './externalLinks';

export const LAUNCH_OFFER = {
  price: '47 €',
  deadline: '30 septembre 2026',
  /** Ce qui remplace l'offre à vie après la deadline. */
  afterOffer: 'abonnement mensuel sans engagement : 27 €/mois (Plume) ou 47 €/mois (Édition)',
  promise: "Accès à vie, V3 incluse d'office le 1er octobre, plus tous les bonus.",
} as const;


export const BONUS_PAGE_URL = `${SITE_ORIGIN}/bonus`;

/** Construit un lien de page bonus tracé par email. */
export const bonusUrl = (src: string) => `${BONUS_PAGE_URL}?src=${src}`;

export interface SequenceBonus {
  key: string;
  title: string;
  value: string;
  description: string;
  /** Où le bonus est réellement livré. */
  to: string;
  /** true = livré dans l'espace membre (nécessite l'accès), false = accessible tout de suite. */
  requiresAccess?: boolean;
}

/** Les bonus offerts avec l'offre de lancement (livrés immédiatement). */
export const LAUNCH_BONUSES: SequenceBonus[] = [
  {
    key: 'niches',
    title: '10 niches Amazon rentables',
    value: '47 €',
    description:
      'Dix niches analysées avec la demande réelle et le niveau de concurrence. De quoi choisir un sujet qui se vend avant même d\'écrire la première ligne.',
    to: '/10-niches-offertes',
  },
  {
    key: 'sommaire',
    title: 'Le Sommaire IA de votre livre',
    value: '27 €',
    description:
      'Vous donnez votre idée, l\'IA vous rend un sommaire complet, chapitre par chapitre, prêt à écrire. C\'est le meneur de tout le système.',
    to: '/essai',
  },
  {
    key: 'couverture',
    title: 'Votre couverture aux dimensions Amazon',
    value: '37 €',
    description:
      'Une couverture générée puis recadrée aux formats exigés par Amazon (Kindle 1600 × 2560, broché prêt à téléverser). Aucun rejet de fichier.',
    to: '/couverture-kdp',
    requiresAccess: true,
  },
  {
    key: 'titres',
    title: '30 titres et sous-titres qui vendent',
    value: '17 €',
    description:
      'Trente modèles de titres testés, à adapter à votre sujet en deux minutes. Le titre fait la moitié des ventes sur Amazon.',
    to: '/kdp-keywords',
    requiresAccess: true,
  },
  {
    key: 'anti-plagiat',
    title: 'Le pack anti-plagiat',
    value: '27 €',
    description:
      'La méthode complète pour publier un texte irréprochable et passer les contrôles Amazon sans stress.',
    to: '/pack-anti-plagiat.pdf',
  },
  {
    key: 'kit',
    title: 'Le kit de démarrage guidé',
    value: '37 €',
    description:
      'Votre premier livre du sommaire au fichier prêt pour Amazon, étape par étape, sans rien deviner.',
    to: '/kit-demarrage-ebookstudio-v3.pdf',
  },
  {
    key: 'gemini',
    title: 'Le guide de la clé API Gemini',
    value: '17 €',
    description:
      'Comment obtenir votre clé gratuite en 4 minutes pour générer sans limite. Captures d\'écran incluses.',
    to: '/Guide_Cle_Gemini_API.pdf',
  },
  {
    key: 'parrainage',
    title: 'Le guide de parrainage',
    value: '27 €',
    description:
      'Comment faire financer votre abonnement par vos parrainages, avec les liens et les messages déjà écrits.',
    to: '/lead-magnets/guide-parrainage-abonnes.pdf',
  },
];

export const BONUS_TOTAL_VALUE = '236 €';

export type SequenceSegment = 'chaud' | 'froid';

export interface SequenceEmail {
  id: string;
  segment: SequenceSegment;
  /** Délai à régler dans Systeme.io, en jours après l'entrée dans la campagne. */
  delayDays: number;
  subject: string;
  preheader: string;
  bonusKey: string;
  /** Corps en texte simple — c'est ce que Georges colle dans Systeme.io. */
  body: string;
  /** Libellé du bouton / lien principal. */
  ctaLabel: string;
  ctaUrl: string;
}

const SIGN = `Georges Boubet
Fondateur d'EbookStudio
boubetgeorges@gmail.com`;

export const SEQUENCE_EMAILS: SequenceEmail[] = [
  /* ----------------------------- SEGMENT CHAUD ----------------------------- */
  {
    id: 'chaud-1',
    segment: 'chaud',
    delayDays: 0,
    subject: 'Vos 10 niches Amazon, offertes',
    preheader: 'Rien à acheter. Vous cliquez, vous les avez.',
    bonusKey: 'niches',
    ctaLabel: 'Recevoir mes 10 niches',
    ctaUrl: bonusUrl('sio-chaud-1'),
    body: `Bonjour,

Vous avez déjà ouvert un de mes messages, alors je commence par vous donner quelque chose.

Voici 10 niches Amazon rentables, analysées une par une : ce que les gens cherchent vraiment, et à quel point c'est déjà occupé.

C'est offert. Pas de carte bancaire, pas de conditions.

>> Recevoir mes 10 niches : ${bonusUrl('sio-chaud-1')}

Prenez celle qui vous parle. On verra la suite après.

${SIGN}`,
  },
  {
    id: 'chaud-2',
    segment: 'chaud',
    delayDays: 2,
    subject: 'Le sommaire de votre livre, offert',
    preheader: 'Vous donnez votre idée. Vous recevez le plan complet.',
    bonusKey: 'sommaire',
    ctaLabel: 'Construire mon sommaire',
    ctaUrl: bonusUrl('sio-chaud-2'),
    body: `Bonjour,

Ce qui bloque presque tout le monde, ce n'est pas d'écrire. C'est de savoir quoi écrire, et dans quel ordre.

Alors je vous offre le Sommaire IA : vous donnez votre idée en une phrase, l'outil vous rend un sommaire complet, chapitre par chapitre, prêt à écrire.

>> Construire mon sommaire maintenant : ${bonusUrl('sio-chaud-2')}

Vous verrez en trois minutes si votre idée tient debout. C'est déjà énorme.

${SIGN}`,
  },
  {
    id: 'chaud-3',
    segment: 'chaud',
    delayDays: 5,
    subject: 'Votre couverture, offerte aussi',
    preheader: 'Aux dimensions exactes exigées par Amazon.',
    bonusKey: 'couverture',
    ctaLabel: 'Générer ma couverture',
    ctaUrl: bonusUrl('sio-chaud-3'),
    body: `Bonjour,

« C'est trop technique pour moi. » C'est ce qu'on me dit le plus souvent.

Alors testez le point le plus technique de tous : la couverture. Amazon refuse les fichiers mal dimensionnés, et c'est là que la plupart des gens abandonnent.

Chez moi, la couverture est générée puis recadrée automatiquement aux dimensions exactes (Kindle 1600 × 2560, broché prêt à téléverser). Vous n'avez rien à calculer.

>> Générer ma couverture, offerte : ${bonusUrl('sio-chaud-3')}

Si vous y arrivez sans moi, le reste ne vous fera plus peur.

${SIGN}`,
  },
  {
    id: 'chaud-4',
    segment: 'chaud',
    delayDays: 8,
    subject: 'Le 30 septembre, ce tarif disparaît',
    preheader: 'Dernière offre de lancement : 47 € une fois, V3 incluse.',
    bonusKey: 'kit',
    ctaLabel: 'Prendre l\'accès à vie à 47 €',
    ctaUrl: commanderUrl('sio-chaud-4'),
    body: `Bonjour,

Vous avez maintenant vu les trois pièces gratuites : les niches, le sommaire, la couverture.

Voici la dernière chose que j'ai à vous dire, et elle est datée.

Jusqu'au ${LAUNCH_OFFER.deadline}, l'accès complet est à ${LAUNCH_OFFER.price} une fois, à vie. Pas d'abonnement, pas de reconduction.

Et ce qui compte vraiment : la V3 sort le 1er octobre, et vous l'aurez d'office, incluse, sans rien payer de plus. Ceux qui arriveront après le 30 septembre seront en abonnement mensuel.

Avec l'accès, vous recevez aussi tous les bonus : les 10 niches, le sommaire illimité, les couvertures aux formats Amazon, les 30 titres qui vendent, le pack anti-plagiat, le kit de démarrage guidé, le guide de la clé API et le guide de parrainage. ${BONUS_TOTAL_VALUE} de bonus, inclus.

>> Prendre l'accès à vie à ${LAUNCH_OFFER.price} : ${commanderUrl('sio-chaud-4')}

Après le 30 septembre, ce message n'aura plus d'objet. Je ne le renverrai pas.

${SIGN}`,
  },

  /* ----------------------------- SEGMENT FROID ----------------------------- */
  {
    id: 'froid-1',
    segment: 'froid',
    delayDays: 0,
    subject: '30 titres de livres qui vendent',
    preheader: 'Offerts, sans rien en échange.',
    bonusKey: 'titres',
    ctaLabel: 'Recevoir les 30 titres',
    ctaUrl: bonusUrl('sio-froid-1'),
    body: `Bonjour,

Je ne sais pas si mes messages vous intéressent encore, alors je fais court et je donne d'abord.

Voici 30 titres et sous-titres de livres qui fonctionnent sur Amazon, à adapter à votre sujet en deux minutes. Le titre fait la moitié des ventes.

>> Recevoir les 30 titres : ${bonusUrl('sio-froid-1')}

Si ça ne vous parle pas, vous pouvez vous désinscrire en bas de ce message, sans rancune.

${SIGN}`,
  },
  {
    id: 'froid-2',
    segment: 'froid',
    delayDays: 4,
    subject: '10 niches Amazon, analysées',
    preheader: 'Le sujet avant l\'écriture. C\'est là que tout se joue.',
    bonusKey: 'niches',
    ctaLabel: 'Voir les 10 niches',
    ctaUrl: bonusUrl('sio-froid-2'),
    body: `Bonjour,

La raison numéro un pour laquelle un livre ne se vend pas, ce n'est pas le style. C'est le sujet.

Je vous offre 10 niches Amazon analysées : la demande réelle, la concurrence, et pourquoi il reste de la place.

>> Voir les 10 niches : ${bonusUrl('sio-froid-2')}

Lisez-les, même si vous n'écrivez jamais. Vous verrez le marché autrement.

${SIGN}`,
  },
  {
    id: 'froid-3',
    segment: 'froid',
    delayDays: 10,
    subject: 'Dernier message de ma part',
    preheader: 'Le sommaire de votre livre, offert, puis je vous laisse.',
    bonusKey: 'sommaire',
    ctaLabel: 'Construire mon sommaire',
    ctaUrl: bonusUrl('sio-froid-3'),
    body: `Bonjour,

C'est mon dernier message si vous ne réagissez pas, et c'est normal : je préfère écrire à des gens que ça intéresse.

Avant de vous laisser, je vous laisse la pièce la plus utile : le sommaire complet de votre livre, construit par l'IA à partir de votre idée. Offert.

>> Construire mon sommaire : ${bonusUrl('sio-froid-3')}

Et si vous voulez tout : jusqu'au ${LAUNCH_OFFER.deadline}, l'accès complet est à ${LAUNCH_OFFER.price} une fois, à vie, avec la V3 incluse d'office le 1er octobre et ${BONUS_TOTAL_VALUE} de bonus. Après, ce sera un abonnement mensuel.

Merci de m'avoir lu jusqu'ici.

${SIGN}`,
  },
];

/** Version HTML simple (sans image, sans CSS externe) pour Systeme.io. */
export function emailToHtml(email: SequenceEmail): string {
  const paragraphs = email.body
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('>>')) {
        const label = email.ctaLabel;
        return `<p style="margin:28px 0;"><a href="${email.ctaUrl}" style="display:inline-block;background:#0f6b5c;color:#ffffff;padding:14px 24px;border-radius:8px;font-weight:700;text-decoration:none;">${label}</a></p>`;
      }
      return `<p style="margin:0 0 16px;line-height:1.65;">${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');

  return `<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1f2937;max-width:560px;margin:0 auto;">
${paragraphs}
</div>`;
}

/** Étapes de paramétrage côté Systeme.io. */
export const SYSTEMEIO_SETUP_STEPS: string[] = [
  "Dans Systeme.io, ouvrez Contacts puis Tags et vérifiez que les tags « seq-chaud » et « seq-froid » existent (ils sont créés automatiquement par la synchronisation).",
  "Allez dans Emails puis Campagnes et créez une campagne nommée « Lancement 47 € — chauds ».",
  "Ajoutez 4 emails à cette campagne, dans l'ordre, en réglant les délais : 0 jour, 2 jours, 5 jours, 8 jours.",
  "Pour chaque email : collez l'objet, puis collez le corps (bouton « Copier le texte » ou « Copier le HTML » si vous préférez la version avec bouton).",
  "Créez une seconde campagne « Lancement 47 € — froids » avec 3 emails aux délais 0, 4 et 10 jours.",
  "Dans Automatisations, créez une règle : déclencheur « Tag ajouté » = seq-chaud → action « Inscrire à la campagne » = Lancement 47 € — chauds. Répétez pour seq-froid.",
  "Envoyez-vous un test sur boubetgeorges@gmail.com avant d'activer les règles.",
  "Activez les deux règles. Les contacts tagués partent automatiquement, sans action de votre part.",
];
