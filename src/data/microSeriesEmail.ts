import type { LancementV3Email } from '@/data/lancementV3Systemeio';

/** Email de précommande Studio Micro-Séries IA envoyé aux abonnés (Resend, 1 fois par abonné). */
export const MICRO_SERIES_EMAIL: LancementV3Email = {
  id: 'micro-series-precommande',
  step: 'Précommande V4',
  sendDate: '30 septembre 2026',
  sendTime: '20 h 00',
  goal: 'Présenter le Studio Micro-Séries IA en avant-première V4',
  subject: 'Votre livre en série TikTok, Reels et Shorts (avant-première V4)',
  preheader: 'Précommande à 67 € au lieu de 197 €, accès à vie dès la sortie de la V4.',
  body: `Bonjour,

Votre livre est écrit. Maintenant, il faut qu’on le voie.

Aujourd’hui, les lecteurs découvrent les livres sur TikTok, Instagram et YouTube Shorts. Mais transformer un livre en vidéos courtes, épisode par épisode, prend des heures.

C’est pour cela que je prépare le Studio Micro-Séries IA, un module de la future V4 d’EbookStudio.

À partir de votre livre, il vous prépare une vraie mini-série de 3, 5 ou 10 épisodes :
– une accroche forte pour chaque épisode,
– le texte de la voix off,
– le découpage scène par scène,
– les sous-titres prêts pour le montage,
– un storyboard à télécharger.

Vous n’avez plus qu’à monter vos vidéos.

En tant qu’abonné, vous pouvez le réserver dès maintenant à 67 € au lieu de 197 €, en paiement unique. Votre accès à vie s’ouvrira automatiquement à la sortie de la V4.

Ce module est un complément à part : il n’est inclus dans aucun forfait.

À très vite,
Georges — EbookStudio`,
  ctaLabel: 'Je réserve mon Studio Micro-Séries à 67 €',
  ctaUrl: 'https://ebookstudio.fr/v3/offre-micro-series?src=email&t=micro-series',
  note: 'Envoi Resend aux abonnés actifs, anti-doublon.',
};
