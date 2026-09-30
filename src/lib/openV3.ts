import type { NavigateFunction } from 'react-router-dom';

/**
 * Ouvre la V3 de façon fiable : navigation interne d'abord, puis, si la page
 * n'a pas changé (module V3 qui ne se charge pas, ancienne version en cache),
 * chargement complet de /v3 pour ne jamais laisser un clic sans effet.
 */
export function openV3(navigate: NavigateFunction, path = '/v3') {
  console.info('[openV3] clic, ouverture de', path, 'depuis', window.location.pathname);
  try {
    navigate(path);
  } catch (err) {
    console.error('[openV3] navigation interne impossible', err);
  }
  window.setTimeout(() => {
    if (!window.location.pathname.startsWith('/v3')) {
      console.warn('[openV3] toujours hors V3 après le clic, rechargement complet de', path);
      window.location.assign(path);
    }
  }, 1200);
}
