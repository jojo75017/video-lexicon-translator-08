/**
 * Pool of varied review templates for audiobook product sheets.
 * 3 reviews are randomly selected per book (seeded by slug/title for consistency).
 */

export interface Review {
  initial: string;
  name: string;
  stars: number;
  text: string;
}

const REVIEW_POOL: Review[] = [
  { initial: 'M', name: 'Marie L.', stars: 5, text: "Excellente qualité audio ! La narration est fluide et agréable. Je recommande vivement." },
  { initial: 'P', name: 'Pierre D.', stars: 5, text: "Parfait pour écouter pendant mes trajets. La voix est très naturelle !" },
  { initial: 'S', name: 'Sophie R.', stars: 4, text: "Très bonne découverte, le contenu est riche et bien structuré." },
  { initial: 'J', name: 'Julien M.', stars: 5, text: "J'ai adoré chaque minute. La qualité sonore est impeccable, bravo !" },
  { initial: 'C', name: 'Camille B.', stars: 5, text: "Un vrai plaisir à écouter. Mon fils de 8 ans en redemande tous les soirs." },
  { initial: 'L', name: 'Laurent F.', stars: 4, text: "Bonne qualité d'écoute, l'histoire est prenante du début à la fin." },
  { initial: 'A', name: 'Amélie T.', stars: 5, text: "Superbe narration ! On se laisse emporter par l'histoire sans effort." },
  { initial: 'N', name: 'Nicolas G.', stars: 5, text: "Le meilleur livre audio que j'ai écouté cette année. Captivant !" },
  { initial: 'E', name: 'Émilie V.', stars: 4, text: "Très agréable à écouter, la voix est douce et le rythme parfait." },
  { initial: 'T', name: 'Thomas H.', stars: 5, text: "Idéal en voiture ! Mes enfants étaient captivés pendant tout le trajet." },
  { initial: 'V', name: 'Valérie C.', stars: 5, text: "J'achète régulièrement ici et je ne suis jamais déçue. Top qualité !" },
  { initial: 'D', name: 'David P.', stars: 4, text: "Bon contenu, narration fluide. J'attends la suite avec impatience." },
  { initial: 'I', name: 'Isabelle K.', stars: 5, text: "Une pépite audio ! Parfait pour le rituel du coucher avec les enfants." },
  { initial: 'F', name: 'François W.', stars: 5, text: "Qualité professionnelle, on oublie que c'est généré par IA. Bluffant !" },
  { initial: 'H', name: 'Hélène A.', stars: 4, text: "Histoire originale et bien racontée. Le format audio est très pratique." },
  { initial: 'R', name: 'Romain J.', stars: 5, text: "Téléchargement rapide, qualité HD impeccable. Très satisfait de mon achat." },
  { initial: 'O', name: 'Olivia N.', stars: 5, text: "Ma fille l'écoute en boucle ! L'histoire est drôle et pleine de rebondissements." },
  { initial: 'B', name: 'Bruno S.', stars: 4, text: "Rapport qualité-prix imbattable pour un livre audio de cette qualité." },
  { initial: 'G', name: 'Géraldine Z.', stars: 5, text: "Le son est cristallin, la narration vivante. Un vrai bonheur à écouter !" },
  { initial: 'Y', name: 'Yann Q.', stars: 5, text: "Acheté pour offrir et le retour est unanime : tout le monde a adoré !" },
];

/**
 * Simple seeded random number generator for consistent review selection per book.
 */
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
}

/**
 * Returns 3 unique reviews from the pool, deterministic based on the seed (slug/title).
 */
export function getRandomReviews(seed: string, count = 3): Review[] {
  const rng = seededRandom(seed || 'default');
  const pool = [...REVIEW_POOL];
  const selected: Review[] = [];
  
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const idx = Math.floor(rng() * pool.length);
    selected.push(pool[idx]);
    pool.splice(idx, 1);
  }
  
  return selected;
}
