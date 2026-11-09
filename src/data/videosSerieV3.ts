// Série officielle des 12 tutoriels vidéo V3 + vidéos de clôture.
// Source unique : utilisée par la page Tutoriels et par le bouton vidéo de chaque atelier.
import v01 from '@/assets/videos/serie/serie-01-cles-api.mp4.asset.json';
import v02 from '@/assets/videos/serie/serie-02-point-depart.mp4.asset.json';
import v03 from '@/assets/videos/serie/serie-03-ecriture-guidee.mp4.asset.json';
import v04 from '@/assets/videos/serie/serie-04-camille.mp4.asset.json';
import v05 from '@/assets/videos/serie/serie-05-studio-pro.mp4.asset.json';
import v06 from '@/assets/videos/serie/serie-06-livres-speciaux.mp4.asset.json';
import v07 from '@/assets/videos/serie/serie-07-couvertures.mp4.asset.json';
import v08 from '@/assets/videos/serie/serie-08-traducteur.mp4.asset.json';
import v09 from '@/assets/videos/serie/serie-09-audio.mp4.asset.json';
import v10 from '@/assets/videos/serie/serie-10-mots-cles.mp4.asset.json';
import v11 from '@/assets/videos/serie/serie-11-audit.mp4.asset.json';
import v12 from '@/assets/videos/serie/serie-12-mes-livres.mp4.asset.json';
import formules from '@/assets/videos/serie/cloture-formules-cadeaux.mp4.asset.json';
import bravo from '@/assets/videos/serie/cloture-bravo-foncez.mp4.asset.json';

export interface VideoSerie {
  num: number;
  titre: string;
  duree: string;
  src: string;
  route: string;
  /** Préfixes d'adresse où le bouton vidéo s'affiche dans l'atelier. */
  ateliers: string[];
}

export const SERIE_V3: VideoSerie[] = [
  { num: 1, titre: 'Connecter vos clés API', duree: '56 s', src: v01.url, route: '/v3/fonctionnalites/cles', ateliers: ['/v3/fonctionnalites/cles', '/v3/parametres'] },
  { num: 2, titre: 'Choisir son point de départ', duree: '47 s', src: v02.url, route: '/v3/commence-ici', ateliers: ['/v3/commence-ici'] },
  { num: 3, titre: 'L’écriture guidée, du plan aux chapitres', duree: '47 s', src: v03.url, route: '/v3/lancer', ateliers: ['/v3/lancer'] },
  { num: 4, titre: 'Je raconte mon livre avec Camille', duree: '46 s', src: v04.url, route: '/v3/create', ateliers: ['/v3/create'] },
  { num: 5, titre: 'Le Studio Pro hybride (Gemini et ChatGPT)', duree: '49 s', src: v05.url, route: '/v3/studio', ateliers: ['/v3/studio'] },
  { num: 6, titre: 'Les 17 livres spéciaux', duree: '49 s', src: v06.url, route: '/v3/livres/roman', ateliers: ['/v3/livres/'] },
  { num: 7, titre: 'Le Studio Couvertures V4', duree: '51 s', src: v07.url, route: '/v3/studio-v4', ateliers: ['/v3/studio-v4'] },
  { num: 8, titre: 'Le Traducteur multilingue KDP', duree: '50 s', src: v08.url, route: '/v3/outils/traduction', ateliers: ['/v3/outils/traduction'] },
  { num: 9, titre: 'Créer un livre audio', duree: '42 s', src: v09.url, route: '/v3/livres-audio', ateliers: ['/v3/livres-audio'] },
  { num: 10, titre: 'Mots-clés KDP et catégories', duree: '45 s', src: v10.url, route: '/v3/kdp/mots-cles', ateliers: ['/v3/kdp/mots-cles'] },
  { num: 11, titre: 'L’audit avant publication KDP', duree: '47 s', src: v11.url, route: '/v3/kdp/fiche-audit', ateliers: ['/v3/kdp/fiche-audit'] },
  { num: 12, titre: 'Mes livres et exports', duree: '41 s', src: v12.url, route: '/v3/mes-livres', ateliers: ['/v3/mes-livres'] },
];

export const CLOTURE_V3 = [
  { titre: 'Vos formules et vos 4 cadeaux de bienvenue', duree: '1 min 05', src: formules.url },
  { titre: 'Bravo, foncez !', duree: '1 min 35', src: bravo.url },
];

/** Vidéo de la série associée à l'atelier ouvert (correspondance la plus précise). */
export function videoPourAtelier(pathname: string): VideoSerie | undefined {
  let best: VideoSerie | undefined; let len = 0;
  for (const v of SERIE_V3) for (const a of v.ateliers) {
    const ok = a.endsWith('/') ? pathname.startsWith(a) : pathname === a || pathname.startsWith(a + '/');
    if (ok && a.length > len) { best = v; len = a.length; }
  }
  return best;
}
