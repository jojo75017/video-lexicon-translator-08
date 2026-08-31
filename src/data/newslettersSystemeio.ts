/**
 * NOUVEAUX EMAILS SYSTEME.IO — newsletters datées de septembre 2026.
 *
 * Différence avec `campagneUnique.ts` :
 * - `campagneUnique.ts` = séquence automatique déclenchée par le tag PROSPECT-EBS
 *   (délais relatifs : J+0, J+1, J+3…).
 * - ce fichier = 5 newsletters envoyées à la liste entière, à des DATES fixes,
 *   en « diffusion » (broadcast) depuis Systeme.io.
 *
 * Chaque email contient de VRAIS boutons HTML (balise <a> stylée, cliquable dans
 * tous les clients mail) : le marqueur [[CTA]] du corps est remplacé par le
 * bouton principal, [[CTA2]] par le bouton secondaire.
 */

import { SITE_ORIGIN, commanderUrl } from './externalLinks';

export const NEWSLETTER_SENDER = 'contact@ebookstudio-mail.fr';
export const NEWSLETTER_TAG = 'PROSPECT-EBS';
export const NEWSLETTER_EXCLUDE_TAG = 'CLIENT-47';
export const NEWSLETTER_DEADLINE = '30 septembre 2026';
export const NEWSLETTER_PRICE = '47 €';

const essai = (src: string) => `${SITE_ORIGIN}/essai?src=${src}`;
const bonus = (src: string) => `${SITE_ORIGIN}/bonus?src=${src}`;
const cadeau = (src: string) => `${SITE_ORIGIN}/cadeau?src=${src}`;

/* ------------------- Traçage des clics Systeme.io ------------------- */

/**
 * Balise de fusion Systeme.io : remplacée par l'email du contact à l'envoi.
 * C'est elle qui permet de savoir QUI a cliqué (et donc combien de prospects
 * uniques ont ouvert /essai ou /commander).
 */
export const SYSTEMEIO_EMAIL_MERGE_TAG = '{{contact.email}}';

const TRACK_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-email-click`;

/** Préfixe utilisé dans `email_clicks.template_name` pour ces newsletters. */
export const NEWSLETTER_TRACK_PREFIX = 'newsletter-';

/** Regroupe une URL de destination en une catégorie lisible dans les stats. */
export function newsletterDestination(url: string): string {
  const path = url.replace(/^https?:\/\/[^/]+/, '');
  if (path.startsWith('/essai')) return '/essai';
  if (path.startsWith('/commander')) return '/commander';
  if (path.startsWith('/cadeau')) return '/cadeau';
  if (path.startsWith('/bonus')) return '/bonus';
  return path.split('?')[0] || '/';
}

/** Ajoute les UTM à la destination finale (lisible dans GA4). */
function withUtm(url: string, campaign: string, slot: string): string {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}utm_source=systemeio&utm_medium=email&utm_campaign=${campaign}&utm_content=${slot}`;
}

/**
 * URL à mettre réellement dans le bouton : passe par la fonction de suivi
 * (enregistre email + newsletter + destination dans `email_clicks`) puis
 * redirige immédiatement vers la page.
 */
export function trackedCtaUrl(
  n: Pick<Newsletter, 'id' | 'number'>,
  cta: NewsletterCta,
  slot: 'cta1' | 'cta2',
): string {
  const dest = withUtm(cta.url, n.id, slot);
  const params = new URLSearchParams({
    s: String(n.number),
    t: `${NEWSLETTER_TRACK_PREFIX}${n.number}-${slot}`,
    u: dest,
  });
  // L'email n'est pas encodé : Systeme.io doit reconnaître la balise de fusion.
  return `${TRACK_ENDPOINT}?e=${SYSTEMEIO_EMAIL_MERGE_TAG}&${params.toString()}`;
}


export interface NewsletterCta {
  label: string;
  url: string;
}

export interface Newsletter {
  id: string;
  /** Numéro d'ordre affiché. */
  number: number;
  /** Date d'envoi à programmer dans Systeme.io. */
  sendDate: string;
  /** ISO pour le tri et le calcul « passé / à venir ». */
  sendIso: string;
  /** Heure conseillée. */
  sendTime: string;
  subject: string;
  preheader: string;
  goal: string;
  cta: NewsletterCta;
  cta2?: NewsletterCta;
  /** Corps en texte brut, avec les marqueurs [[CTA]] / [[CTA2]]. */
  body: string;
  /** Ce qu'il faut savoir avant d'envoyer celui-ci. */
  note: string;
}

const SIGN = `Georges Boubet
Fondateur d'EbookStudio
contact@ebookstudio-mail.fr`;

export const NEWSLETTERS: Newsletter[] = [
  {
    id: 'news-1',
    number: 1,
    sendDate: 'Mardi 1er septembre 2026',
    sendIso: '2026-09-01',
    sendTime: '10 h 00',
    subject: 'Votre idée de livre, écrite ce matin',
    preheader: 'Une phrase suffit : vous lisez le titre, le sommaire et le début du chapitre 1.',
    goal: 'Faire générer un livre sur /essai',
    cta: { label: 'Voir mon livre commencer', url: essai('news-1') },
    cta2: { label: 'Écrire mon chapitre 1 gratuitement', url: essai('news-1b') },
    note:
      "Premier contact du mois : aucune vente, on donne. Objectif unique = un clic vers /essai. À envoyer à toute la liste sauf CLIENT-47.",
    body: `Bonjour,

Beaucoup de gens portent une idée de livre depuis des années. Ce qui les arrête n'est presque jamais le manque d'idées : c'est la première page blanche.

Alors ce matin, je vous propose de sauter cette page.

[[CTA]]

Vous écrivez votre idée en une seule phrase, et en deux minutes vous avez sous les yeux :

- le titre et le sous-titre de votre livre,
- le sommaire complet, chapitre par chapitre,
- le début de votre chapitre 1, réellement écrit pour votre sujet.

Ce n'est pas un exemple tout fait. C'est votre idée, votre public, votre ton. Rien à installer, rien à payer, aucun compte à créer pour voir le résultat.

Si le début vous plaît, vous demandez le chapitre 1 en entier : il s'affiche tout de suite et vous le recevez par email pour le garder.

[[CTA2]]

À demain,

${SIGN}`,
  },
  {
    id: 'news-2',
    number: 2,
    sendDate: 'Mardi 8 septembre 2026',
    sendIso: '2026-09-08',
    sendTime: '10 h 00',
    subject: "Ce n'est pas l'écriture qui bloque, c'est le plan",
    preheader: 'Le sommaire complet de votre livre, chapitre par chapitre, à partir d’une phrase.',
    goal: 'Faire générer un sommaire sur /essai',
    cta: { label: 'Obtenir mon sommaire', url: essai('news-2') },
    cta2: { label: 'Voir mes 5 niches Amazon', url: cadeau('news-2') },
    note:
      "Email « utile » : on explique un blocage réel et on donne l'outil. Le second bouton (5 niches) sert de porte de sortie pour ceux qui n'ont pas encore de sujet.",
    body: `Bonjour,

On croit qu'écrire un livre demande du talent. En réalité, cela demande un plan.

Sans plan, on écrit trente pages, on se perd, on relit, on trouve ça mauvais, on abandonne. Avec un plan clair, on avance chapitre par chapitre et le livre se termine tout seul.

[[CTA]]

Donnez votre sujet en une phrase : vous recevez le sommaire complet, chaque chapitre avec son titre et un résumé de deux phrases. Un vrai plan de travail, pas une liste vague.

Vous verrez immédiatement ce qui manque, ce que vous voulez déplacer, ce que vous voulez couper. C'est à cet instant précis qu'un projet devient un livre.

Et si vous n'avez pas encore de sujet, commencez par là : j'ai analysé cinq niches Amazon avec la demande réelle, le mot-clé exact et le niveau de concurrence.

[[CTA2]]

${SIGN}`,
  },
  {
    id: 'news-3',
    number: 3,
    sendDate: 'Mardi 15 septembre 2026',
    sendIso: '2026-09-15',
    sendTime: '10 h 00',
    subject: "J'ai écrit un livre entier hier soir — je vous montre tout",
    preheader: 'Du sommaire à la couverture aux normes Amazon, en une soirée.',
    goal: 'Preuve + clic vers /essai',
    cta: { label: 'Ouvrir mon livre', url: essai('news-3') },
    cta2: { label: 'Récupérer mes bonus', url: bonus('news-3') },
    note:
      "Email de preuve : on raconte le trajet complet, sans vendre encore. Il prépare la newsletter 4 qui annonce le prix.",
    body: `Bonjour,

Hier soir, j'ai pris une idée en une phrase et j'en ai fait un livre complet. Voici le trajet exact, sans rien enlever :

- Le Sommaire IA a rendu un plan chapitre par chapitre, que j'ai corrigé à la main.
- Chaque chapitre a été rédigé séparément, en tenant compte des précédents : pas de contradiction au chapitre 12, pas de répétition du chapitre 3.
- La correction professionnelle a relu l'ensemble : répétitions, fins de chapitres bancales, français propre du début à la fin.
- L'export a sorti un Word et un PDF conformes aux exigences d'Amazon KDP, sommaire compris.
- La couverture a été générée puis recadrée aux dimensions exactes d'Amazon. Aucun fichier refusé.
- La fiche Amazon était prête : titre, description, mots-clés, catégories.

Ce n'est pas une méthode à appliquer « plus tard ». C'est un livre, à la fin de la soirée.

La première étape, celle qui décide de tout, vous pouvez la faire maintenant en deux minutes et sans rien payer.

[[CTA]]

Et vos bonus vous attendent toujours au même endroit, guides et pack anti-plagiat inclus.

[[CTA2]]

${SIGN}`,
  },
  {
    id: 'news-4',
    number: 4,
    sendDate: 'Mardi 22 septembre 2026',
    sendIso: '2026-09-22',
    sendTime: '10 h 00',
    subject: `${NEWSLETTER_PRICE} une fois. Après le ${NEWSLETTER_DEADLINE}, c'est un abonnement`,
    preheader: 'Accès à vie, V3 incluse, un seul paiement — carte ou PayPal.',
    goal: 'Commander (47 € à vie)',
    cta: { label: `Prendre l'accès à vie — ${NEWSLETTER_PRICE}`, url: commanderUrl('news-4') },
    cta2: { label: 'Voir tout ce qui est inclus', url: commanderUrl('news-4b') },
    note:
      "Le seul email de vente franche. Une seule offre, deux boutons vers /commander (carte + PayPal sur la page). Excluez impérativement CLIENT-47.",
    body: `Bonjour,

Je pose le calcul en clair, sans détour.

Aujourd'hui : ${NEWSLETTER_PRICE} une fois. Accès à vie, la V3 incluse d'office, aucun prélèvement mensuel. Un seul règlement, par carte bancaire ou par PayPal.

Après le ${NEWSLETTER_DEADLINE} : l'accès à vie disparaît. L'entrée se fera uniquement par abonnement, 27 €/mois (Plume) ou 47 €/mois (Édition). En deux mois, vous aurez dépassé le prix d'aujourd'hui — et vous continuerez de payer chaque mois.

[[CTA]]

Ce que ce paiement unique ouvre, définitivement :

- le Sommaire IA et la rédaction chapitre par chapitre,
- la correction professionnelle du manuscrit,
- les exports Word et PDF aux normes Amazon KDP,
- les couvertures aux dimensions exactes d'Amazon,
- la fiche produit, le livre audio et la traduction.

Ceux qui entrent avant la date ne repayeront jamais. C'est tout l'intérêt de le faire maintenant.

[[CTA2]]

${SIGN}`,
  },
  {
    id: 'news-5',
    number: 5,
    sendDate: 'Mardi 29 septembre 2026',
    sendIso: '2026-09-29',
    sendTime: '09 h 00',
    subject: 'Dernier rappel : demain, ça ferme',
    preheader: `Dernier jour pour l'accès à vie à ${NEWSLETTER_PRICE}.`,
    goal: 'Commander (dernière chance)',
    cta: { label: `Commander avant demain — ${NEWSLETTER_PRICE}`, url: commanderUrl('news-5') },
    note:
      "Un seul bouton, texte court, aucune distraction. À envoyer le matin ; ne rien renvoyer après le 30 septembre.",
    body: `Bonjour,

C'est mon dernier message sur cette offre.

Demain, ${NEWSLETTER_DEADLINE}, l'accès à vie à ${NEWSLETTER_PRICE} se termine. Ensuite, l'entrée se fait uniquement par abonnement mensuel.

[[CTA]]

Vos bonus restent à vous, ils ne disparaissent pas. Ce qui disparaît, c'est la possibilité de payer une seule fois pour l'atelier complet, mises à jour comprises.

Si vous hésitez encore, répondez simplement à cet email : c'est moi qui lis, et je réponds aujourd'hui.

${SIGN}`,
  },
];

/* --------------------------- Rendu HTML --------------------------- */

function button(cta: NewsletterCta, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
  <tr>
    <td align="center" bgcolor="#0f6b5c" style="border-radius:10px;">
      <a href="${href}" target="_blank" style="display:inline-block;padding:16px 30px;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;background-color:#0f6b5c;">${cta.label}</a>
    </td>
  </tr>
</table>`;
}

/** HTML prêt à coller dans Systeme.io (mode « Code HTML »), boutons réels inclus. */
export function newsletterToHtml(n: Newsletter): string {
  const blocks = n.body
    .split('\n\n')
    .map((raw) => {
      const block = raw.trim();
      if (block === '[[CTA]]') return button(n.cta, trackedCtaUrl(n, n.cta, 'cta1'));
      if (block === '[[CTA2]]')
        return n.cta2 ? button(n.cta2, trackedCtaUrl(n, n.cta2, 'cta2')) : '';
      if (block.startsWith('- ')) {
        const items = block
          .split('\n')
          .map((line) => line.replace(/^-\s*/, '').trim())
          .filter(Boolean)
          .map((line) => `<li style="margin:0 0 8px;line-height:1.6;">${line}</li>`)
          .join('');
        return `<ul style="margin:0 0 18px;padding-left:22px;">${items}</ul>`;
      }
      return `<p style="margin:0 0 18px;line-height:1.7;">${block.replace(/\n/g, '<br />')}</p>`;
    })
    .filter(Boolean)
    .join('\n');

  return `<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1f2937;max-width:580px;margin:0 auto;padding:8px;">
${blocks}
</div>`;
}

/** Version texte : les marqueurs deviennent « libellé : url » (URL tracée). */
export function newsletterToText(n: Newsletter): string {
  return n.body
    .replace('[[CTA]]', `>> ${n.cta.label} : ${trackedCtaUrl(n, n.cta, 'cta1')}`)
    .replace(
      '[[CTA2]]',
      n.cta2 ? `>> ${n.cta2.label} : ${trackedCtaUrl(n, n.cta2, 'cta2')}` : '',
    );
}


/** Mode d'emploi affiché au-dessus des newsletters. */
export const NEWSLETTER_HOWTO: Array<{ title: string; detail: string }> = [
  {
    title: '1. Où coller ces emails dans Systeme.io',
    detail:
      'Menu Emails → Newsletters → « Créer une newsletter ». Ce sont des diffusions ponctuelles, pas la campagne automatique : la campagne (tag PROSPECT-EBS) reste en place et tourne en parallèle.',
  },
  {
    title: '2. Destinataires',
    detail:
      `Ciblez le tag ${NEWSLETTER_TAG} et excluez le tag ${NEWSLETTER_EXCLUDE_TAG} (les acheteurs ne doivent jamais recevoir un email de vente). Expéditeur : ${NEWSLETTER_SENDER}.`,
  },
  {
    title: '3. Comment garder les vrais boutons',
    detail:
      'Dans l\'éditeur, ajoutez un bloc « Texte », ouvrez l\'affichage du code source (icône < >), puis collez le HTML copié ici. Les boutons sont de véritables liens cliquables, testés sur Gmail, Outlook et Apple Mail. Si vous collez la version texte, les liens apparaissent en clair : c\'est le repli, moins performant.',
  },
  {
    title: '4. Programmation',
    detail:
      'Pour chaque newsletter, choisissez « Programmer » et saisissez la date et l\'heure indiquées sur la fiche. Les cinq peuvent être programmées d\'avance le même jour.',
  },
  {
    title: '5. Avant d\'envoyer',
    detail:
      'Utilisez « Envoyer un test » vers boubetgeorges@gmail.com, cliquez sur chaque bouton dans l\'email reçu et vérifiez que la page s\'ouvre bien. Vérifiez aussi le pied de page EbookStudio (pas celui hérité d\'un autre site).',
  },
  {
    title: '6. Ce qu\'on regarde ensuite',
    detail:
      'Le taux de clic compte plus que le taux d\'ouverture. Newsletters 1 à 3 : on veut des clics vers la page d\'essai. Newsletters 4 et 5 : on veut des commandes. Si la 4 ne convertit pas, c\'est le prix ou la date limite qu\'il faut réexpliquer, pas l\'email qu\'il faut rallonger.',
  },
];
