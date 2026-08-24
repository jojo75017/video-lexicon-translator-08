/**
 * Modules non inclus dans l'essai gratuit 7 jours.
 * Source unique utilisée par les cadenas de la barre latérale et la grille
 * des fonctionnalités (le blocage réel est fait par `TrialGate` sur les routes).
 */
export const TRIAL_LOCKED_PATHS = [
  '/v3/cover-studio-pro',
  '/v3/outils/audiobook',
  '/v3/outils/traduction',
  '/v3/outils/humanizer',
  '/v3/outils/mockup-3d',
  '/v3/outils/royalties',
  '/v3/outils/ams-keywords',
  '/v3/outils/espion-concurrents',
  '/v3/outils/categories',
  '/v3/donnees-kdp',
  '/v3/studio',
  '/v3/biographie',
  '/v3/create/illustre',
  '/v3/livres',
  '/v3/posts',
  '/v3/acquisition',
  '/v3/avis',
  '/v3/gallery',
  '/v3/auteur',
];

export function isTrialLockedPath(to: string): boolean {
  const path = (to.split('?')[0] || '').replace(/\/+$/, '');
  return TRIAL_LOCKED_PATHS.some((p) => path === p || path.startsWith(p + '/'));
}
