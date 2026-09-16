/**
 * AVANT-PREMIÈRE V3 — l'email à copier dans Systeme.io.
 *
 * Un seul message : « venez voir la V3 en vidéo ». Le lecteur arrive sur la
 * page vitrine /avant-premiere (lien court /r/apv3, clics comptés), regarde la
 * visite, laisse son email pour être prévenu le 1er octobre — et trouve
 * l'offre 47 € en second, sous le bouton.
 *
 * Rien n'est envoyé par l'application : on copie l'objet et le texte, on colle
 * dans Systeme.io (contact@ebookstudio-mail.fr).
 */

import { SITE_ORIGIN } from './externalLinks';
import type { LancementV3Email } from './lancementV3Systemeio';

export const AVANT_PREMIERE_URL = `${SITE_ORIGIN}/r/apv3`;

/** Trois objets au choix — testez-en un, gardez le meilleur. */
export const AVANT_PREMIERE_SUBJECTS = [
  'La V3 en avant-première (5 minutes de visite)',
  'Je vous ouvre les portes de la V3 avant tout le monde',
  'Regardez la V3 avant son ouverture du 1er octobre',
];

export const AVANT_PREMIERE_EMAIL: LancementV3Email = {
  id: 'avant-premiere-v3',
  step: 'Avant-première',
  sendDate: 'Quand vous voulez, avant le 1er octobre 2026',
  sendTime: '09 h 00',
  goal: 'Faire voir la V3, récolter les inscriptions',
  subject: AVANT_PREMIERE_SUBJECTS[0],
  preheader: 'La visite en vidéo, puis votre email pour être prévenu à l’ouverture.',
  body: `Bonjour,

La nouvelle version d’EbookStudio ouvre le 1er octobre 2026. Avant cela, je voulais que vous la voyiez de vos yeux.

J’ai préparé une page d’avant-première : une visite filmée de 5 minutes, en français et sous-titrée. Vous y verrez, dans l’ordre :

— le sommaire de votre livre construit avec vous, question par question ;
— les chapitres écrits, puis relus et corrigés automatiquement avant l’export ;
— les couvertures Kindle, broché et relié, avec les textes modifiables ;
— le studio jeunesse et bande dessinée ;
— les fichiers qui sortent prêts pour Amazon.

Vous n’avez rien à installer et rien à payer pour regarder. Si la V3 vous intéresse, laissez simplement votre email en bas de la page : vous recevrez un seul message, le jour de l’ouverture.

Et si vous ne voulez pas attendre, l’accès à vie reste à 47 € jusqu’au 30 septembre 2026. Le lien est juste sous le bouton d’inscription.

Bonne visite,
Georges`,
  ctaLabel: 'Voir la V3 en avant-première',
  ctaUrl: AVANT_PREMIERE_URL,
  note: 'À envoyer à toute la liste. Aucun paiement au bout du lien : la page montre la vidéo, propose la liste d’attente, puis l’offre 47 € en second.',
};
