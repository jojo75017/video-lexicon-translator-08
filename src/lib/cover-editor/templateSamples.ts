/**
 * Exemples de démonstration de la galerie de modèles.
 *
 * La galerie est un catalogue d'inspiration : chaque vignette montre un exemple
 * propre à son univers (titre, sous-titre et auteur fictifs), jamais le livre de
 * l'abonné. Le livre de l'abonné ne reçoit le style du modèle qu'au moment où
 * il clique sur « Appliquer ».
 *
 * 100 % local : aucun appel IA, aucun crédit, aucune écriture en base.
 */
import type { CoverGenre } from '@/lib/cover-editor/coverTemplates';

export interface TemplateSample {
  title: string;
  subtitle: string;
  author: string;
}

/** Un exemple crédible par univers, en français, sans donnée réelle. */
export const TEMPLATE_SAMPLES: Record<CoverGenre, TemplateSample> = {
  roman: {
    title: 'Les Flammes du Passé',
    subtitle: 'Roman',
    author: 'Hélène Mercier',
  },
  thriller: {
    title: 'Le Dernier Témoin',
    subtitle: 'Thriller',
    author: 'Paul Nérac',
  },
  romance: {
    title: 'Un Été à Sète',
    subtitle: 'Romance',
    author: 'Camille Ferrand',
  },
  fantasy: {
    title: 'Le Royaume des Cendres',
    subtitle: 'Le cycle des Terres Hautes · Tome I',
    author: 'Aurèle Vasseur',
  },
  developpement: {
    title: 'Reprendre sa Vie en Main',
    subtitle: 'Sept habitudes pour avancer chaque jour',
    author: 'Sophie Delmas',
  },
  guide: {
    title: 'Réussir son Entretien',
    subtitle: 'La méthode complète en sept étapes',
    author: 'Marc Lavigne',
  },
  business: {
    title: 'Vendre sans Forcer',
    subtitle: 'La méthode des indépendants qui durent',
    author: 'Antoine Berger',
  },
  jeunesse: {
    title: 'Léo et la Lune',
    subtitle: 'Une histoire du soir',
    author: 'Clara Bonnet',
  },
  cuisine: {
    title: 'Douceurs du Dimanche',
    subtitle: 'Quarante recettes simples et gourmandes',
    author: 'Julie Rousset',
  },
  biographie: {
    title: 'Une Vie en Chemin',
    subtitle: 'Récit',
    author: 'Georges Mallet',
  },
};

export const sampleForGenre = (genre: CoverGenre): TemplateSample =>
  TEMPLATE_SAMPLES[genre] ?? TEMPLATE_SAMPLES.roman;
