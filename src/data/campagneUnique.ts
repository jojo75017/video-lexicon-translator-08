/**
 * CAMPAGNE UNIQUE — source de vérité de tous les emails EbookStudio.
 *
 * Toutes les anciennes campagnes (sales, canonical, Brevo, séquences multiples)
 * ont été supprimées. Il n'existe plus qu'une seule séquence, ici.
 *
 * Parcours : email → page d'essai /essai (idée → titre, sommaire, début du
 * chapitre 1) → mur email (chapitre complet) → bouton Commander (47 € à vie).
 * Les 5 niches restent accessibles en second lien depuis /essai et /bonus.
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

/** Page d'essai : c'est le seul lien des trois premiers emails. */
export const ESSAI_PAGE_URL = `${SITE_ORIGIN}/essai`;
export const essaiUrl = (src: string) => `${ESSAI_PAGE_URL}?src=${src}`;
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
    subject: 'Donnez votre idée, je vous rends le chapitre 1',
    preheader: 'Une phrase suffit. Vous lisez le début de votre livre dans deux minutes.',
    goal: "Générer son livre sur la page d'essai",
    ctaLabel: 'Voir mon livre commencer',
    ctaUrl: essaiUrl('cadeau-1'),
    body: `Bonjour,

Je vous propose quelque chose de très simple : écrivez votre idée de livre en une phrase, et je vous rends le début de ce livre.

>> Voir mon livre commencer : ${essaiUrl('cadeau-1')}

Vous n'avez rien à installer, rien à payer, et vous n'avez même pas besoin de créer un compte pour voir le résultat. Vous tapez votre idée, et en deux minutes vous avez sous les yeux :

- le titre et le sous-titre de votre livre,
- le sommaire complet, chapitre par chapitre,
- le début de votre chapitre 1, réellement écrit pour votre sujet.

Ce n'est pas une démonstration avec un livre d'exemple. C'est votre idée, votre public, votre ton. Beaucoup de gens hésitent pendant des mois parce qu'ils n'arrivent pas à imaginer leur livre. Là, vous le voyez.

Si le début vous plaît, vous demandez le chapitre 1 en entier : il s'affiche immédiatement et vous le recevez par email pour le garder.

>> Écrire mon chapitre 1 gratuitement : ${essaiUrl('cadeau-1')}

${SIGN}`,
  },
  {
    id: 'cadeau-2',
    template: 'cadeau-2',
    delayDays: 1,
    subject: 'Votre sommaire complet en 2 minutes',
    preheader: 'Le plan chapitre par chapitre de votre livre, écrit à partir de votre idée.',
    goal: "Générer son sommaire sur la page d'essai",
    ctaLabel: 'Obtenir mon sommaire',
    ctaUrl: essaiUrl('cadeau-2'),
    body: `Bonjour,

Ce qui bloque la plupart des auteurs, ce n'est pas l'écriture. C'est le plan.

On a une idée, on sent qu'il y a un livre dedans, mais on ne sait pas par quoi commencer, dans quel ordre, ni combien de chapitres il faut. Alors on repousse. Parfois pendant des années.

>> Obtenir mon sommaire : ${essaiUrl('cadeau-2')}

Donnez votre idée en une phrase sur cette page, et vous recevez le sommaire complet de votre livre : chaque chapitre avec son titre et un résumé de deux phrases. Un vrai plan de travail, pas une liste vague.

Vous verrez tout de suite si l'ordre vous convient, ce qui manque, ce que vous voulez déplacer. C'est à ce moment-là qu'un livre devient réel.

Et pendant que vous lisez le sommaire, le chapitre 1 s'écrit à côté. Gratuitement, sans carte bancaire.

>> Voir mon sommaire et mon chapitre 1 : ${essaiUrl('cadeau-2')}

${SIGN}`,
  },
  {
    id: 'cadeau-3',
    template: 'cadeau-3',
    delayDays: 3,
    subject: "Votre livre existe déjà, il attend juste que vous l'ouvriez",
    preheader: 'Titre, sommaire, chapitre 1 écrit pour votre idée. Deux minutes.',
    goal: "Générer son livre sur la page d'essai",
    ctaLabel: 'Ouvrir mon livre',
    ctaUrl: essaiUrl('cadeau-3'),
    body: `Bonjour,

Hier soir, j'ai pris une idée simple, une seule phrase, et j'en ai fait un livre complet. Voilà le trajet exact :

- J'ai donné le sujet en une phrase. Le Sommaire IA m'a rendu un plan chapitre par chapitre, que j'ai corrigé à la main.
- Chaque chapitre a été rédigé séparément, en tenant compte des précédents : pas de contradiction au chapitre 12, pas de répétition du chapitre 3.
- La correction professionnelle a relu l'ensemble : répétitions, fins de chapitres bancales, français propre du début à la fin.
- L'export a sorti un Word et un PDF conformes aux exigences d'Amazon KDP, sommaire compris.
- La couverture a été générée puis recadrée aux dimensions exactes d'Amazon. Aucun fichier refusé.
- La fiche Amazon était prête : titre, description, mots-clés, catégories.

Ce n'est pas un cours ni une méthode à appliquer plus tard. C'est un livre, à la fin de la soirée.

Et la première étape, celle qui décide de tout, vous pouvez la faire maintenant en deux minutes et sans rien payer : votre titre, votre sommaire, votre chapitre 1.

>> Ouvrir mon livre : ${essaiUrl('cadeau-3')}

Lisez le début. Si ce que vous lisez ressemble à votre livre, la suite se joue en un clic.

>> Commencer maintenant : ${essaiUrl('cadeau-3')}

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
  'Expéditeur : contact@ebookstudio-mail.fr (domaine déjà vérifié dans Systeme.io). Ne touchez pas au DNS de ebookstudio.fr.',
  'Réglages → Pied de page : remplacez le pied de page hérité (trafic-affiliation.com) par « EbookStudio — Georges Boubet — contact@ebookstudio-mail.fr » suivi du lien de désinscription Systeme.io.',
  `Contacts → Tags : créez « ${CAMPAGNE.tag} » (entrée dans la campagne) et « CLIENT-47 » (acheteurs, posé automatiquement par l'application).`,
  'Emails → Campagnes : créez « EbookStudio — 5 niches puis accès à vie » avec 5 emails aux délais 0, 1, 3, 5 et 7 jours.',
  'Pour chaque email : collez l\'objet, puis le corps (bouton « Copier le texte » ou « Copier le HTML » pour la version avec bouton).',
  `Automatisations → règle 1 : déclencheur « Tag ajouté » = ${CAMPAGNE.tag} → action « Inscrire à la campagne ».`,
  'Automatisations → règle 2 : déclencheur « Tag ajouté » = CLIENT-47 → action « Désinscrire de la campagne » (l\'acheteur ne reçoit plus les emails de vente).',
  'Envoyez-vous un test sur boubetgeorges@gmail.com, puis activez les deux règles.',
  'Aucun envoi de masse ne part de l\'application : Resend (offre gratuite) ne sert plus qu\'aux emails de service (codes d\'accès, confirmations de paiement).',
];


/* ------------- Compatibilité avec les tableaux de bord admin ------------- */

/** Campagne active exposée aux panneaux de performance et à /gestion-prospects. */
export const ACTIVE_EMAIL_CAMPAIGN = {
  id: CAMPAGNE.id,
  name: CAMPAGNE.name,
  status: 'active' as const,
  // Plus aucun envoi de masse depuis l'application : tout part de Systeme.io.
  sendingBlocked: true,
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
