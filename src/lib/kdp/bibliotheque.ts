/**
 * Bibliothèque de livres KDP (par ASIN) — stockage local uniquement.
 * Sert de source unique aux pages de l'espace KDP : on enregistre un livre une fois,
 * puis on le réutilise partout sans recoller son ASIN.
 */
import { fetchAmazonBook } from '@/components/admin/market/marketShared';

export const BIBLIO_KEY = 'v3:kdp:bibliotheque:livres';

export type StatutLivre = 'mien' | 'concurrent';

export interface LivreBiblio {
  id: string;
  asin: string;
  marketplace: string;
  titre: string;
  auteur: string;
  description: string;
  genre: string;
  prix: number | null;
  note: number | null;
  avis: number | null;
  bsr: number | null;
  pages: number | null;
  categories: string[];
  etiquette: string;
  statut: StatutLivre;
  enCours: boolean;
  ajouteLe: string;
  majLe: string;
}

/** Vignette de couverture Amazon dérivée de l'ASIN (aucune donnée inventée : simple adresse d'image). */
export const couvertureAmazon = (asin: string): string =>
  `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`;

export const lienAmazon = (livre: LivreBiblio): string => {
  const domaines: Record<string, string> = {
    fr: 'amazon.fr', us: 'amazon.com', uk: 'amazon.co.uk', de: 'amazon.de', es: 'amazon.es', it: 'amazon.it',
  };
  return `https://www.${domaines[livre.marketplace] || 'amazon.fr'}/dp/${livre.asin}`;
};

export const estAsin = (valeur: string): boolean => /^[A-Z0-9]{10}$/.test(valeur.trim().toUpperCase());

export function listerLivres(): LivreBiblio[] {
  try {
    const brut = localStorage.getItem(BIBLIO_KEY);
    const liste = brut ? JSON.parse(brut) : [];
    return Array.isArray(liste) ? (liste as LivreBiblio[]) : [];
  } catch {
    return [];
  }
}

export function ecrireLivres(liste: LivreBiblio[]): LivreBiblio[] {
  const propre = liste.slice(0, 200);
  try { localStorage.setItem(BIBLIO_KEY, JSON.stringify(propre)); } catch { /* stockage indisponible */ }
  return propre;
}

export function livreEnCours(): LivreBiblio | null {
  const liste = listerLivres();
  return liste.find((l) => l.enCours) ?? liste.find((l) => l.statut === 'mien') ?? liste[0] ?? null;
}

export function mesLivres(): LivreBiblio[] {
  return listerLivres().filter((l) => l.statut === 'mien');
}

export function mesConcurrents(): LivreBiblio[] {
  return listerLivres().filter((l) => l.statut === 'concurrent');
}

/** Ajoute (ou met à jour) un livre à partir de son ASIN, en lisant sa vraie fiche Amazon. */
export async function ajouterParAsin(
  asinBrut: string,
  marketplace: string,
  options: { statut?: StatutLivre; etiquette?: string } = {},
): Promise<LivreBiblio> {
  const asin = asinBrut.trim().toUpperCase();
  if (!estAsin(asin)) throw new Error('Un ASIN contient exactement 10 caractères (lettres et chiffres).');

  const donnees = await fetchAmazonBook(asin, marketplace);
  const maintenant = new Date().toISOString();
  const existant = listerLivres().find((l) => l.asin === asin && l.marketplace === marketplace);

  const livre: LivreBiblio = {
    id: existant?.id ?? `${asin}-${marketplace}`,
    asin,
    marketplace,
    titre: donnees.title || asin,
    auteur: donnees.author || '',
    description: donnees.description || '',
    genre: (donnees.categories || [])[0] || existant?.genre || '',
    prix: donnees.price ?? null,
    note: donnees.rating ?? null,
    avis: donnees.reviews ?? null,
    bsr: donnees.bsr ?? null,
    pages: donnees.pages ?? null,
    categories: donnees.categories || [],
    etiquette: options.etiquette ?? existant?.etiquette ?? '',
    statut: options.statut ?? existant?.statut ?? 'mien',
    enCours: existant?.enCours ?? false,
    ajouteLe: existant?.ajouteLe ?? maintenant,
    majLe: maintenant,
  };

  const suite = [livre, ...listerLivres().filter((l) => l.id !== livre.id)];
  ecrireLivres(suite);
  return livre;
}

export function majLivre(id: string, champs: Partial<LivreBiblio>): LivreBiblio[] {
  return ecrireLivres(
    listerLivres().map((l) => (l.id === id ? { ...l, ...champs, majLe: new Date().toISOString() } : l)),
  );
}

export function marquerEnCours(id: string): LivreBiblio[] {
  return ecrireLivres(listerLivres().map((l) => ({ ...l, enCours: l.id === id })));
}

export function supprimerLivre(id: string): LivreBiblio[] {
  return ecrireLivres(listerLivres().filter((l) => l.id !== id));
}

/** Rafraîchit les données Amazon d'un livre déjà enregistré. */
export async function actualiserLivre(id: string): Promise<LivreBiblio[]> {
  const livre = listerLivres().find((l) => l.id === id);
  if (!livre) throw new Error('Livre introuvable dans votre bibliothèque.');
  await ajouterParAsin(livre.asin, livre.marketplace, { statut: livre.statut, etiquette: livre.etiquette });
  return listerLivres();
}

/** Résumé texte de la bibliothèque, utilisé comme contexte du robot Biblio. */
export function resumeBibliotheque(liste = listerLivres()): string {
  if (liste.length === 0) return 'La bibliothèque de l’auteur est vide : aucun livre enregistré pour le moment.';
  return liste
    .map((l, i) => {
      const details = [
        l.auteur ? `auteur : ${l.auteur}` : '',
        l.genre ? `catégorie : ${l.genre}` : '',
        l.prix != null ? `prix affiché : ${l.prix} €` : '',
        l.note != null ? `note : ${l.note}/5` : '',
        l.avis != null ? `avis : ${l.avis}` : '',
        l.bsr != null ? `rang de vente relevé : ${l.bsr}` : '',
        l.etiquette ? `étiquette de l’auteur : ${l.etiquette}` : '',
        l.statut === 'concurrent' ? 'enregistré comme livre concurrent' : 'livre de l’auteur',
      ].filter(Boolean).join(' · ');
      return `${i + 1}. « ${l.titre} » (ASIN ${l.asin}, marché ${l.marketplace.toUpperCase()}) — ${details}`;
    })
    .join('\n');
}

export function exporterJson(liste = listerLivres()): string {
  return JSON.stringify(liste, null, 2);
}

export function importerJson(texte: string): LivreBiblio[] {
  const brut = JSON.parse(texte);
  if (!Array.isArray(brut)) throw new Error('Fichier illisible : une liste de livres était attendue.');
  const valides = (brut as LivreBiblio[]).filter((l) => l && typeof l.asin === 'string' && estAsin(l.asin));
  if (valides.length === 0) throw new Error('Aucun livre valide trouvé dans ce fichier.');
  const existants = listerLivres();
  const fusion = [...valides, ...existants.filter((e) => !valides.some((v) => v.id === e.id))];
  return ecrireLivres(fusion);
}
