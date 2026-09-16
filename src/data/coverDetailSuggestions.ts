/**
 * Suggestions affichées dans les champs « détails du livre » de l'assistant
 * couverture (/v3/couverture-express).
 *
 * Données statiques d'interface uniquement : aucun appel réseau, aucune
 * écriture en base. L'abonné garde la possibilité d'écrire sa propre valeur.
 */

export type CoverDetailField =
  | 'targetAudience'
  | 'era'
  | 'location'
  | 'focalSubject'
  | 'emotion'
  | 'mustInclude'
  | 'mustAvoid';

const BASE: Record<CoverDetailField, string[]> = {
  targetAudience: [
    'Adultes',
    'Jeunes adultes',
    'Adolescents',
    'Enfants de 3 à 7 ans',
    'Enfants de 8 à 12 ans',
    'Familles',
    'Lecteurs professionnels',
    'Grand public',
  ],
  era: [
    'Aujourd’hui',
    'Années 2000',
    'Années 1980',
    'Années 1940',
    'Début du XXe siècle',
    'XIXe siècle',
    'Moyen Âge',
    'Futur proche',
    'Intemporel',
  ],
  location: [
    'Paris',
    'Une grande ville la nuit',
    'Un village de campagne',
    'Le bord de mer',
    'La montagne',
    'Une forêt',
    'Une maison de famille',
    'Un bureau moderne',
    'Un désert',
    'Une île',
  ],
  focalSubject: [
    'Une femme de dos',
    'Un homme face à l’horizon',
    'Un enfant et son animal',
    'Une silhouette seule dans la lumière',
    'Une clé ancienne',
    'Une lettre manuscrite',
    'Une porte entrouverte',
    'Un objet symbolique seul',
    'Un paysage large sans personnage',
  ],
  emotion: [
    'Curiosité',
    'Tension',
    'Mystère',
    'Nostalgie',
    'Espoir',
    'Tendresse',
    'Confiance',
    'Émerveillement',
    'Sérénité',
  ],
  mustInclude: [
    'Le personnage principal bien visible',
    'Le lieu principal reconnaissable',
    'Un objet symbolique de l’histoire',
    'Une lumière douce et chaude',
    'Un ciel très présent',
    'Beaucoup d’espace libre en haut pour le titre',
  ],
  mustAvoid: [
    'Aucun texte dans l’image',
    'Aucun logo ni filigrane',
    'Aucun bandeau ni encart sombre',
    'Aucun visage reconnaissable',
    'Aucune violence',
    'Aucune arme',
    'Aucun élément moderne',
  ],
};

/** Suggestions ajoutées en tête de liste selon le genre choisi. */
const BY_GENRE: Partial<Record<string, Partial<Record<CoverDetailField, string[]>>>> = {
  thriller: {
    location: ['Une ruelle sous la pluie', 'Un commissariat', 'Un entrepôt abandonné'],
    focalSubject: ['Une silhouette dans le brouillard', 'Une empreinte de pas', 'Une voiture isolée la nuit'],
    emotion: ['Tension', 'Menace sourde', 'Suspense'],
  },
  romance: {
    location: ['Un café parisien', 'Une plage au coucher du soleil', 'Un jardin fleuri'],
    focalSubject: ['Deux silhouettes qui se rapprochent', 'Deux mains qui se touchent', 'Une femme souriante en lumière dorée'],
    emotion: ['Tendresse', 'Émotion amoureuse', 'Espoir'],
  },
  fantasy: {
    era: ['Monde imaginaire', 'Époque médiévale fantastique'],
    location: ['Un château dans les nuages', 'Une forêt enchantée', 'Une cité ancienne'],
    focalSubject: ['Un héros armé d’un bâton de lumière', 'Une créature légendaire', 'Un grimoire ouvert'],
    emotion: ['Émerveillement', 'Épopée'],
  },
  jeunesse: {
    targetAudience: ['Enfants de 3 à 7 ans', 'Enfants de 8 à 12 ans'],
    focalSubject: ['Un enfant joyeux', 'Un animal attachant', 'Un petit héros et son compagnon'],
    emotion: ['Joie', 'Émerveillement', 'Tendresse'],
    mustAvoid: ['Aucune image effrayante', 'Aucun texte dans l’image'],
  },
  developpement: {
    focalSubject: ['Un chemin qui monte vers la lumière', 'Une personne debout face à l’horizon', 'Un symbole simple et fort'],
    emotion: ['Confiance', 'Motivation', 'Sérénité'],
  },
  guide: {
    focalSubject: ['Un objet du sujet traité, bien éclairé', 'Une mise en scène claire et épurée'],
    emotion: ['Clarté', 'Confiance'],
  },
  business: {
    location: ['Un bureau moderne', 'Une skyline urbaine'],
    focalSubject: ['Un graphique stylisé', 'Une personne en tenue professionnelle', 'Un symbole de croissance'],
    emotion: ['Confiance', 'Ambition'],
  },
  cuisine: {
    location: ['Une cuisine chaleureuse', 'Une table dressée', 'Un marché'],
    focalSubject: ['Un plat mis en valeur', 'Des ingrédients frais disposés à plat'],
    emotion: ['Gourmandise', 'Convivialité'],
  },
  biographie: {
    era: ['Années 1950', 'Années 1960', 'Années 1970'],
    location: ['Une maison de famille', 'Un village d’enfance'],
    focalSubject: ['Un portrait de dos ou de profil', 'Une photographie ancienne', 'Un objet souvenir'],
    emotion: ['Nostalgie', 'Émotion sincère', 'Transmission'],
  },
};

/** Liste finale de suggestions pour un champ et un genre. */
export function coverDetailSuggestions(
  field: CoverDetailField,
  genreId: string,
): string[] {
  const extra = BY_GENRE[genreId]?.[field] ?? [];
  return Array.from(new Set([...extra, ...BASE[field]]));
}
