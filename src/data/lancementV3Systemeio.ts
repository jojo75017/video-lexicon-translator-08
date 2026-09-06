/**
 * LANCEMENT V3 — 4 emails à copier dans Systeme.io.
 *
 * Diffusions ponctuelles (broadcast) autour de l'ouverture de la V3 le
 * 1er octobre 2026. Rien n'est envoyé par l'application : on copie l'objet et
 * le texte, on colle dans Systeme.io (contact@ebookstudio-mail.fr).
 *
 * Promesses tenues dans ces textes (aucune invention) :
 * - l'abonné choisit lui-même : il garde son espace habituel (V2) ou passe en V3 ;
 * - les modules payants de la V3 restent visibles mais verrouillés ;
 * - ancien client : 3 modules offerts et −20 % à vie sur Plume et Édition.
 */

import { SITE_ORIGIN } from './externalLinks';

export const LANCEMENT_V3_SENDER = 'contact@ebookstudio-mail.fr';
export const LANCEMENT_V3_TAG = 'CLIENT-V2';
export const LANCEMENT_V3_DATE = '1er octobre 2026';

const link = (path: string, src: string) => `${SITE_ORIGIN}${path}?src=${src}`;

export type LancementV3Email = {
  id: string;
  step: string;
  sendDate: string;
  sendTime: string;
  goal: string;
  subject: string;
  preheader: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  note: string;
};

export const LANCEMENT_V3_EMAILS: LancementV3Email[] = [
  {
    id: 'lancement-v3-j7',
    step: 'J−7',
    sendDate: '24 septembre 2026',
    sendTime: '09 h 00',
    goal: 'Annoncer sans inquiéter',
    subject: 'Dans 7 jours : la nouvelle version d’EbookStudio ouvre',
    preheader: 'Votre espace actuel ne change pas. Vous choisirez vous-même.',
    body: `Bonjour,

Le ${LANCEMENT_V3_DATE}, la nouvelle version d’EbookStudio ouvre pour tous les abonnés.

Une chose d’abord, parce que c’est celle qui compte : votre espace actuel ne disparaît pas. Vous n’avez rien à déplacer, rien à réinstaller, aucun livre à reprendre. Vos projets restent là où ils sont.

Ce que la nouvelle version apporte :
— un espace de travail plus clair, une seule page pour retrouver chaque livre ;
— le studio de couverture : illustration générée, titres et textes modifiables, export prêt pour Kindle ;
— la version longue : plan, chapitres écrits un par un, export Word et PDF ;
— un accompagnement pas à pas pour ne plus se demander « et maintenant, je clique où ? ».

Le 1er octobre, vous aurez simplement deux boutons : rester sur votre espace habituel, ou découvrir la nouvelle version. Vous pourrez revenir en arrière quand vous voulez, autant de fois que vous voulez.

Comme vous êtes déjà client, une chose vous est réservée : 3 modules offerts et −20 % à vie si vous décidez plus tard de prendre un abonnement Plume ou Édition.

Rien à faire aujourd’hui. Je vous réécris la veille de l’ouverture.

Georges Boubet
EbookStudio`,
    ctaLabel: 'Voir ce qui arrive le 1er octobre',
    ctaUrl: link('/v3', 'email-lancement-j7'),
    note: 'Aucune action demandée : cet email sert seulement à ce que personne ne soit surpris.',
  },
  {
    id: 'lancement-v3-j1',
    step: 'J−1',
    sendDate: '30 septembre 2026',
    sendTime: '18 h 00',
    goal: 'Rassurer et préparer le choix',
    subject: 'Demain matin, vous aurez deux boutons',
    preheader: 'Rester sur votre espace habituel, ou découvrir la nouvelle version.',
    body: `Bonjour,

Demain matin, en vous connectant, une page vous demandera simplement où vous voulez travailler :

1. « Continuer sur mon espace habituel » — tout est exactement comme aujourd’hui, vos livres et vos réglages sont intacts.
2. « Découvrir la nouvelle version » — vous entrez dans le nouvel espace, et vous pouvez en ressortir à tout moment.

Trois précisions pour éviter les mauvaises surprises :

— Aucun paiement n’est demandé pour regarder. La nouvelle version s’ouvre, se visite, s’essaie.
— Les modules payants y sont visibles mais verrouillés, avec le prix affiché. Rien ne se déclenche par accident.
— Votre choix n’est jamais définitif : un lien « Mon espace habituel » reste présent en permanence.

Vous êtes déjà client : 3 modules vous sont offerts, et si vous prenez un abonnement Plume ou Édition, c’est −20 % à vie.

À demain.

Georges Boubet
EbookStudio`,
    ctaLabel: 'Voir mon offre client',
    ctaUrl: link('/v3/migration', 'email-lancement-j1'),
    note: 'Envoi le soir, pour que l’email soit en haut de la boîte le matin du lancement.',
  },
  {
    id: 'lancement-v3-j0',
    step: 'J0',
    sendDate: '1er octobre 2026',
    sendTime: '08 h 30',
    goal: 'Ouvrir et faire entrer',
    subject: 'C’est ouvert : votre nouvel espace vous attend',
    preheader: 'Deux boutons, aucun engagement, retour possible à tout moment.',
    body: `Bonjour,

C’est ouvert.

Connectez-vous : la page d’accueil vous propose de rester sur votre espace habituel ou d’entrer dans la nouvelle version. Prenez celle que vous voulez, changez d’avis quand vous voulez.

Si vous entrez dans la nouvelle version, voici l’ordre que je conseille pour la première fois :

1. Ouvrez le studio de couverture et faites générer une illustration. C’est le plus parlant : en une minute vous voyez une vraie couverture.
2. Modifiez le titre, le sous-titre et votre nom directement dessus.
3. Téléchargez le fichier Kindle. Il sort à la bonne taille, prêt à déposer.

Puis allez voir la version longue : elle construit le plan, puis écrit les chapitres un par un, et vous exporte le livre en Word ou en PDF.

Vous êtes déjà client : 3 modules offerts, et −20 % à vie sur Plume et Édition.

Bonne découverte.

Georges Boubet
EbookStudio`,
    ctaLabel: 'Entrer dans la nouvelle version',
    ctaUrl: link('/v3/bienvenue', 'email-lancement-j0'),
    note: 'Le bouton mène à l’écran de choix : l’abonné reste libre de repartir sur son espace habituel.',
  },
  {
    id: 'lancement-v3-j3',
    step: 'J+3',
    sendDate: '4 octobre 2026',
    sendTime: '10 h 00',
    goal: 'Relancer ceux qui n’ont pas encore regardé',
    subject: 'Vous n’avez pas encore ouvert la nouvelle version ?',
    preheader: 'Dix minutes suffisent pour une couverture terminée.',
    body: `Bonjour,

La nouvelle version est ouverte depuis trois jours. Si vous n’y êtes pas encore allé, c’est peut-être pour l’une de ces raisons — voici la réponse à chacune :

« Je n’ai pas le temps. »
Dix minutes suffisent pour une couverture terminée et téléchargée. Rien d’autre à préparer.

« J’ai peur de perdre mon travail. »
Impossible : votre espace habituel reste intact, et il est accessible en un clic depuis la nouvelle version.

« Je ne veux pas payer pour voir. »
Vous n’avez rien à payer pour visiter. Les modules payants sont affichés verrouillés, avec leur prix : rien ne part sans votre accord.

« Je ne sais pas par où commencer. »
Le studio de couverture. Vous cliquez sur générer l’illustration, vous corrigez le titre, vous téléchargez. C’est fini.

Et parce que vous êtes déjà client : 3 modules offerts, puis −20 % à vie si vous prenez Plume ou Édition.

Si quelque chose vous bloque, répondez à cet email : je lis tout.

Georges Boubet
EbookStudio`,
    ctaLabel: 'Ouvrir le studio de couverture',
    ctaUrl: link('/v3/couverture-express', 'email-lancement-j3'),
    note: 'À envoyer de préférence à ceux qui n’ont pas cliqué sur l’email J0.',
  },
];

/** Texte complet prêt à coller (objet exclu). */
export function lancementV3ToText(email: LancementV3Email): string {
  return `${email.body}\n\n${email.ctaLabel} : ${email.ctaUrl}`;
}

export const LANCEMENT_V3_HOWTO: Array<{ title: string; detail: string }> = [
  {
    title: '1. Créez la diffusion dans Systeme.io',
    detail:
      'Emails → Diffusions → Nouvelle diffusion. Expéditeur : ' +
      LANCEMENT_V3_SENDER +
      '. Cible : vos clients actuels (tag ' +
      LANCEMENT_V3_TAG +
      ').',
  },
  {
    title: '2. Copiez l’objet, puis le texte',
    detail:
      'Les deux boutons de chaque carte ci-dessous remplissent l’objet et le corps. Ne modifiez pas les promesses : elles correspondent à ce que l’application fait réellement.',
  },
  {
    title: '3. Ajoutez le bouton',
    detail:
      'Insérez un bouton avec le libellé indiqué et collez l’adresse fournie dans le champ URL.',
  },
  {
    title: '4. Programmez à la date et à l’heure indiquées',
    detail:
      'Les quatre emails s’enchaînent autour du ' +
      LANCEMENT_V3_DATE +
      ' : J−7, J−1, le jour même, puis trois jours après.',
  },
  {
    title: '5. Vérifiez l’interrupteur d’ouverture',
    detail:
      'L’email du 1er octobre ne doit partir que si la nouvelle version est bien ouverte dans le panneau « Lancement V3 ».',
  },
];
