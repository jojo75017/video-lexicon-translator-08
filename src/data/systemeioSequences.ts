/**
 * Contenu prêt à copier-coller dans Systeme.io.
 *
 * Georges n'a rien à rédiger : objets, corps de messages, liens tracés et
 * délais sont figés ici.
 *
 * RÈGLE ABSOLUE : les bonus ne sont PAS donnés gratuitement. Ils sont inclus
 * avec l'accès à vie à 47 € et livrés uniquement après l'achat. Les emails
 * décrivent les bonus, en donnent la valeur, mais le seul lien est le lien de
 * commande.
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
  /** Où le bonus est livré, une fois l'accès acheté. */
  to: string;
  /** Toujours vrai : rien n'est livré avant l'achat. */
  requiresAccess?: boolean;
}

/** Les bonus inclus avec l'offre de lancement — livrés APRÈS l'achat. */
export const LAUNCH_BONUSES: SequenceBonus[] = [
  {
    key: 'niches',
    title: '10 niches Amazon rentables',
    value: '47 €',
    description:
      'Dix niches analysées avec la demande réelle et le niveau de concurrence. De quoi choisir un sujet qui se vend avant même d\'écrire la première ligne.',
    to: '/10-niches-offertes',
    requiresAccess: true,
  },
  {
    key: 'sommaire',
    title: 'Le Sommaire IA de votre livre',
    value: '27 €',
    description:
      'Vous donnez votre idée, l\'IA vous rend un sommaire complet, chapitre par chapitre, prêt à écrire. C\'est le meneur de tout le système.',
    to: '/essai',
    requiresAccess: true,
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
    requiresAccess: true,
  },
  {
    key: 'kit',
    title: 'Le kit de démarrage guidé',
    value: '37 €',
    description:
      'Votre premier livre du sommaire au fichier prêt pour Amazon, étape par étape, sans rien deviner.',
    to: '/kit-demarrage-ebookstudio-v3.pdf',
    requiresAccess: true,
  },
  {
    key: 'gemini',
    title: 'Le guide de la clé API Gemini',
    value: '17 €',
    description:
      'Comment obtenir votre clé gratuite en 4 minutes pour générer sans limite. Captures d\'écran incluses.',
    to: '/Guide_Cle_Gemini_API.pdf',
    requiresAccess: true,
  },
  {
    key: 'structuration',
    title: 'Le guide pour structurer un ebook',
    value: '27 €',
    description:
      'Comment organiser vos idées en un plan cohérent, chapitre par chapitre, pour ne jamais vous perdre en cours d\'écriture. Exemples concrets inclus.',
    to: '/guide-comprendre-ebook.pdf',
    requiresAccess: true,
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

/** Rappel des bonus, réutilisé dans plusieurs emails. */
const BONUS_BLOCK = `Ce que vous recevez en même temps que l'accès, sans supplément :

- Les 10 niches Amazon rentables, analysées une par une (valeur 47 €)
- Le Sommaire IA illimité, le cœur du système (valeur 27 €)
- Les couvertures recadrées aux dimensions exactes d'Amazon (valeur 37 €)
- Les 30 titres et sous-titres qui vendent (valeur 17 €)
- Le pack anti-plagiat (valeur 27 €)
- Le kit de démarrage guidé, étape par étape (valeur 37 €)
- Le guide de la clé API Gemini, pour générer sans limite (valeur 17 €)
- Le guide pour structurer un ebook (valeur 27 €)

Soit ${BONUS_TOTAL_VALUE} de bonus, débloqués dans votre espace dès le paiement validé. Ces bonus ne sont pas vendus séparément et ne sont pas distribués en dehors de cette offre.`;

const DEADLINE_BLOCK = `Jusqu'au ${LAUNCH_OFFER.deadline}, l'accès complet est à ${LAUNCH_OFFER.price} une fois, à vie. Un seul paiement, aucune reconduction, aucun prélèvement mensuel. Un seul règlement, par carte ou par PayPal.

À partir du 1er octobre, cette formule disparaît : EbookStudio passe en ${LAUNCH_OFFER.afterOffer}. Ceux qui entrent maintenant ne repayeront jamais.`;

export const SEQUENCE_EMAILS: SequenceEmail[] = [
  /* ----------------------------- SEGMENT CHAUD ----------------------------- */
  {
    id: 'chaud-1',
    segment: 'chaud',
    delayDays: 0,
    subject: 'Votre livre publié sur Amazon avant octobre',
    preheader: "Accès à vie à 47 €, V3 incluse, 236 € de bonus. Jusqu'au 30 septembre.",
    bonusKey: 'niches',
    ctaLabel: "Prendre l'accès à vie à 47 €",
    ctaUrl: commanderUrl('sio-chaud-1'),
    body: `Bonjour,

Vous avez déjà ouvert un de mes messages, donc je vais être direct et complet : voici exactement ce que fait EbookStudio, ce que ça coûte, et pourquoi la date du 30 septembre change tout.

Le problème n'est presque jamais l'idée. Vous en avez une. Ce qui bloque, c'est la chaîne complète : structurer un plan qui tient debout, écrire les chapitres sans se perdre, produire un fichier aux normes Amazon, fabriquer une couverture au bon format, puis remplir la fiche Amazon avec les bons mots-clés. Cinq métiers différents. C'est là que 90 % des projets s'arrêtent.

EbookStudio prend cette chaîne en entier :

1. Vous donnez votre idée en une phrase. Le Sommaire IA vous rend un plan complet, chapitre par chapitre, que vous validez et modifiez librement.
2. La rédaction se fait chapitre par chapitre, sous votre contrôle. Vous relisez, vous corrigez, vous reformulez. Ce n'est pas un texte jeté d'un bloc.
3. La correction professionnelle passe le manuscrit en plusieurs relectures : répétitions, incohérences, fins de chapitres bancales, mots étrangers parasites.
4. L'export sort un Word et un PDF conformes aux exigences d'Amazon KDP, sommaire propre, mise en page respectée.
5. La couverture est générée puis recadrée automatiquement aux dimensions exactes exigées par Amazon. Plus aucun fichier refusé.
6. La fiche Amazon est préparée : titre, description, mots-clés, catégories. C'est l'étape que tout le monde bâcle, et c'est elle qui décide si le livre est vu ou non.

Le résultat n'est pas un conseil ni un cours. C'est un manuscrit complet, une couverture au bon format et une fiche produit prête à publier.

${DEADLINE_BLOCK}

${BONUS_BLOCK}

>> Prendre l'accès à vie à ${LAUNCH_OFFER.price} : ${commanderUrl('sio-chaud-1')}

Et si une question vous retient, répondez simplement à cet email : c'est moi qui lis, et je réponds.

${SIGN}`,
  },
  {
    id: 'chaud-2',
    segment: 'chaud',
    delayDays: 2,
    subject: "D'une phrase d'idée à un manuscrit complet",
    preheader: 'Ce que vous saisissez, ce que vous récupérez. En détail.',
    bonusKey: 'sommaire',
    ctaLabel: "Prendre l'accès à vie à 47 €",
    ctaUrl: commanderUrl('sio-chaud-2'),
    body: `Bonjour,

Hier je vous ai décrit le système. Aujourd'hui je vous montre le trajet exact, ligne par ligne, parce que c'est là qu'on comprend ce qu'on achète.

Ce que vous saisissez au départ : votre sujet, à qui vous vous adressez, le ton que vous voulez, et le nombre de chapitres souhaité. Trois lignes suffisent.

Ce qui se passe ensuite :

- Le Sommaire IA propose un plan structuré : chapitres, sous-parties, progression logique. Vous supprimez ce qui ne vous plaît pas, vous ajoutez ce qui manque, vous réordonnez. Rien n'est figé.
- Chaque chapitre est ensuite rédigé séparément, en tenant compte de ce qui précède. C'est pour ça que le livre ne se contredit pas au chapitre 12 et ne répète pas le chapitre 3.
- Un mode correction relit l'ensemble : suppression des répétitions, fins de chapitres qui se terminent par une vraie phrase, français propre du début à la fin.
- Vous voyez le livre à côté pendant que vous travaillez, et vous modifiez ce que vous voulez à la main. Vous restez l'auteur.
- À la fin, vous exportez : Word et PDF aux normes KDP, couverture au format exact, fiche Amazon prête.

Ce qui compte : vous ne repartez pas avec des fragments. Vous repartez avec un livre.

${DEADLINE_BLOCK}

${BONUS_BLOCK}

>> Prendre l'accès à vie à ${LAUNCH_OFFER.price} : ${commanderUrl('sio-chaud-2')}

Aucune compétence technique n'est requise, même s'il s'agit de votre premier livre.

${SIGN}`,
  },
  {
    id: 'chaud-3',
    segment: 'chaud',
    delayDays: 5,
    subject: "« Je n'écris pas bien », « c'est trop technique »",
    preheader: 'Les trois objections que je reçois le plus, et mes réponses.',
    bonusKey: 'couverture',
    ctaLabel: "Prendre l'accès à vie à 47 €",
    ctaUrl: commanderUrl('sio-chaud-3'),
    body: `Bonjour,

Trois phrases reviennent dans presque tous les messages que je reçois. Je les prends une par une, sans détour.

« Je n'écris pas bien. »
Vous n'avez pas à écrire bien. Vous avez à décider. Le texte est rédigé chapitre par chapitre, puis vous relisez et vous corrigez ce qui ne vous ressemble pas. Beaucoup de gens qui n'avaient jamais écrit une page ont sorti un livre complet de cette façon. Ce qui fait un bon livre, ce n'est pas le style : c'est un plan clair et un sujet utile.

« C'est trop technique pour moi. »
Le point le plus technique de l'autoédition, c'est la couverture : Amazon refuse tout fichier mal dimensionné, et le dos se calcule selon le nombre de pages. Chez moi, la couverture est générée puis recadrée automatiquement aux dimensions exactes (Kindle 1600 × 2560, broché prêt à téléverser). Vous ne calculez rien. Le reste est plus simple que ça.

« Et si ça ne marche pas pour moi ? »
Vous ne pariez pas 47 € sur une promesse : vous les payez pour un outil que vous gardez à vie, avec la V3 incluse d'office le 1er octobre. Et si un point vous bloque, vous répondez à cet email et je vous réponds personnellement. C'est le prix d'un repas au restaurant, pour quelque chose qui reste.

${DEADLINE_BLOCK}

${BONUS_BLOCK}

>> Prendre l'accès à vie à ${LAUNCH_OFFER.price} : ${commanderUrl('sio-chaud-3')}

Si votre objection n'est pas dans la liste, écrivez-la moi. Je préfère une vraie question à un clic forcé.

${SIGN}`,
  },
  {
    id: 'chaud-4',
    segment: 'chaud',
    delayDays: 8,
    subject: 'Le 30 septembre, ce tarif disparaît',
    preheader: "Dernière offre de lancement : 47 € une fois, V3 incluse, 236 € de bonus.",
    bonusKey: 'kit',
    ctaLabel: "Prendre l'accès à vie à 47 €",
    ctaUrl: commanderUrl('sio-chaud-4'),
    body: `Bonjour,

C'est mon dernier message sur cette offre, et il est daté.

Le calcul est simple, je le pose en clair.

Aujourd'hui : ${LAUNCH_OFFER.price} une fois, accès à vie, la V3 complète incluse d'office le 1er octobre, et ${BONUS_TOTAL_VALUE} de bonus débloqués dès le paiement.

À partir du 1er octobre : plus d'accès à vie. EbookStudio passe en ${LAUNCH_OFFER.afterOffer}. En trois mois d'abonnement, vous aurez dépassé le prix d'aujourd'hui — et vous continuerez de payer chaque mois.

Ceux qui entrent avant le ${LAUNCH_OFFER.deadline} ne repayeront jamais. C'est toute la différence, et c'est la seule raison pour laquelle je vous écris encore.

${BONUS_BLOCK}

Un point important, pour être honnête avec vous : ces bonus ne sont pas distribués gratuitement. Ils font partie de l'accès. Vous les trouvez dans votre espace, dès que le paiement est validé.

>> Prendre l'accès à vie à ${LAUNCH_OFFER.price} : ${commanderUrl('sio-chaud-4')}

Paiement unique, carte ou PayPal. Après le ${LAUNCH_OFFER.deadline}, ce message n'aura plus d'objet et je ne le renverrai pas.

${SIGN}`,
  },

  /* ----------------------------- SEGMENT FROID ----------------------------- */
  {
    id: 'froid-1',
    segment: 'froid',
    delayDays: 0,
    subject: 'Votre idée de livre, publiée avant octobre',
    preheader: 'Un seul message pour tout vous expliquer. Accès à vie à 47 €.',
    bonusKey: 'titres',
    ctaLabel: "Prendre l'accès à vie à 47 €",
    ctaUrl: commanderUrl('sio-froid-1'),
    body: `Bonjour,

Je ne sais pas si mes messages vous parlent encore, alors je vous explique tout en une fois, et vous décidez.

EbookStudio sert à une seule chose : transformer une idée de livre en livre réellement publiable sur Amazon. Pas en conseils, pas en formation. En fichier prêt à téléverser.

Concrètement, dans un seul espace :

- Le Sommaire IA construit votre plan complet à partir d'une phrase, et vous le modifiez comme vous voulez.
- Les chapitres sont rédigés un par un, en gardant la cohérence de l'ensemble, sous votre contrôle.
- La correction professionnelle relit le manuscrit : répétitions, incohérences, français propre, fins de chapitres qui se terminent correctement.
- L'export produit un Word et un PDF conformes aux normes Amazon KDP, sommaire compris.
- La couverture est générée puis recadrée aux dimensions exactes exigées par Amazon, dos calculé selon le nombre de pages.
- La fiche Amazon est préparée : titre, description, mots-clés, catégories.

Ce que ça change : un projet qui traîne depuis des mois redevient un livre disponible à la vente.

${DEADLINE_BLOCK}

${BONUS_BLOCK}

>> Prendre l'accès à vie à ${LAUNCH_OFFER.price} : ${commanderUrl('sio-froid-1')}

Si ce sujet ne vous concerne plus, vous pouvez vous désinscrire en bas de ce message, sans rancune.

${SIGN}`,
  },
  {
    id: 'froid-2',
    segment: 'froid',
    delayDays: 4,
    subject: 'La vraie raison pour laquelle un livre ne vend pas',
    preheader: "Ce n'est pas le style. C'est le sujet, et la fiche Amazon.",
    bonusKey: 'niches',
    ctaLabel: "Prendre l'accès à vie à 47 €",
    ctaUrl: commanderUrl('sio-froid-2'),
    body: `Bonjour,

La raison numéro un pour laquelle un livre autoédité ne se vend pas, ce n'est pas le style de l'auteur. C'est le sujet choisi au hasard, et la fiche Amazon remplie à la va-vite.

Un livre bien écrit sur un sujet que personne ne cherche ne vendra rien. Un livre correct sur un sujet demandé, avec le bon titre et les bons mots-clés, trouve ses lecteurs tout seul, mois après mois.

C'est exactement pour ça que l'accès inclut deux choses que les gens négligent :

- 10 niches Amazon analysées : la demande réelle, le niveau de concurrence, et pourquoi il reste de la place. Vous choisissez votre sujet en connaissance de cause, avant d'écrire la première ligne.
- 30 titres et sous-titres qui fonctionnent, plus la préparation complète de la fiche Amazon : titre, description, mots-clés, catégories.

Et entre les deux, tout le reste : le plan, la rédaction chapitre par chapitre, la correction professionnelle, l'export aux normes KDP, la couverture recadrée aux dimensions exactes d'Amazon.

${DEADLINE_BLOCK}

${BONUS_BLOCK}

>> Prendre l'accès à vie à ${LAUNCH_OFFER.price} : ${commanderUrl('sio-froid-2')}

${SIGN}`,
  },
  {
    id: 'froid-3',
    segment: 'froid',
    delayDays: 10,
    subject: 'Dernier message de ma part',
    preheader: "L'offre à vie se termine le 30 septembre. Ensuite, abonnement.",
    bonusKey: 'sommaire',
    ctaLabel: "Prendre l'accès à vie à 47 €",
    ctaUrl: commanderUrl('sio-froid-3'),
    body: `Bonjour,

C'est mon dernier message si vous ne réagissez pas, et c'est normal : je préfère écrire à des gens que ça intéresse.

Avant de vous laisser, je résume une dernière fois, honnêtement.

Ce que vous obtenez : un espace unique qui construit le plan de votre livre, rédige les chapitres sous votre contrôle, corrige le manuscrit, produit les fichiers Word et PDF conformes à Amazon KDP, génère la couverture aux dimensions exactes et prépare la fiche produit. Un livre publiable, pas un cours.

Ce que ça coûte : ${LAUNCH_OFFER.price} une fois, à vie, jusqu'au ${LAUNCH_OFFER.deadline}. Aucun abonnement, aucune reconduction. Paiement unique, carte ou PayPal.

Ce qui change ensuite : le 1er octobre, l'accès à vie disparaît et EbookStudio passe en ${LAUNCH_OFFER.afterOffer}. La V3, elle, est incluse d'office pour ceux qui sont entrés avant.

${BONUS_BLOCK}

>> Prendre l'accès à vie à ${LAUNCH_OFFER.price} : ${commanderUrl('sio-froid-3')}

Si vous ne cliquez pas, aucun souci : je ne vous écrirai plus sur ce sujet. Merci de m'avoir lu jusqu'ici.

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
