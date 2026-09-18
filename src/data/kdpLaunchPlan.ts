/**
 * Plan de lancement 30 jours — libellés et structure partagés.
 * Page : /v3/kdp/lancement (« ebookstudio_lancement »).
 */

export interface LaunchDay {
  jour: number;
  action: string;
  canal: string;
  duree: string;
  texte: string;
}

export interface LaunchWeek {
  titre: string;
  jours: LaunchDay[];
}

export interface LaunchPlan {
  semaines: LaunchWeek[];
  objectifs: string[];
}

export interface LaunchBrief {
  titre: string;
  sousTitre: string;
  type: string;
  genre: string;
  resume: string;
  dateSortie: string;
  prix: string;
  format: string;
  audience: string;
  lienVente: string;
}

export const LAUNCH_BRIEF_VIDE: LaunchBrief = {
  titre: '',
  sousTitre: '',
  type: 'Non-fiction / Guide pratique',
  genre: '',
  resume: '',
  dateSortie: '',
  prix: '',
  format: 'Kindle',
  audience: '',
  lienVente: '',
};

export const LAUNCH_BOOK_TYPES = [
  'Roman',
  'Non-fiction / Guide pratique',
  'Jeunesse',
  'BD / Album illustré',
  'Cahier / Carnet',
  'Autre',
] as const;

export const LAUNCH_FORMATS = ['Kindle', 'Broché', 'Relié'] as const;

export const LAUNCH_WEEKS = [
  { titre: 'Préparer', jours: 'Jours 1 à 7' },
  { titre: 'Faire parler', jours: 'Jours 8 à 14' },
  { titre: 'Vendre', jours: 'Jours 15 à 21' },
  { titre: 'Installer la durée', jours: 'Jours 22 à 30' },
] as const;

export const RESUME_LIMIT = 500;
