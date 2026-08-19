/**
 * File d'attente de correction « maison d'édition » pour les chapitres affichés
 * dans la colonne de droite. Chaque chapitre écrit passe dans la vraie chaîne
 * (4 passes : correction + anti-latin, typographie française, édition, contrôle
 * final avec réparation de la fin de chapitre) — jamais un simple appel unique.
 *
 * Un seul chapitre à la fois, en arrière-plan : la lecture n'est jamais bloquée.
 */
import { proofreadChapter } from '@/lib/correcteur/proofreadBook';
import {
  readWrittenProgress, setChapterCorrection, setChapterStatus, type WrittenChapter,
} from '@/lib/v3/writtenChapters';

const queue: number[] = [];
let running = false;

function isPending(chapter: WrittenChapter): boolean {
  if (!chapter.rawContent || chapter.rawContent.trim().length < 60) return false;
  return chapter.status === 'raw' || chapter.status === 'failed';
}

async function drain() {
  if (running) return;
  running = true;
  try {
    while (queue.length) {
      const index = queue.shift() as number;
      const chapter = readWrittenProgress().chapters.find((c) => c.index === index);
      if (!chapter || !chapter.rawContent.trim()) continue;
      if (chapter.status === 'corrected') continue;

      setChapterStatus(index, 'correcting');
      try {
        const res = await proofreadChapter(chapter.title, chapter.rawContent, 'polish');
        const corrected = String(res?.corrected || '').trim();
        if (!corrected) throw new Error('La correction est revenue vide.');
        setChapterCorrection(index, corrected, res?.corrections?.length || 0);
      } catch (e: any) {
        setChapterStatus(index, 'failed', e?.message || 'Correction impossible pour le moment.');
      }
      // Respiration entre deux chapitres : on évite les limites de débit.
      await new Promise((r) => setTimeout(r, 600));
    }
  } finally {
    running = false;
  }
}

/** Met un chapitre en file de correction (ignoré s'il est déjà corrigé ou en cours). */
export function enqueueChapterCorrection(index: number) {
  const chapter = readWrittenProgress().chapters.find((c) => c.index === index);
  if (!chapter || !isPending(chapter)) return;
  if (queue.includes(index)) return;
  queue.push(index);
  void drain();
}

/** Force la correction d'un chapitre, même déjà corrigé (bouton « Corriger »). */
export function forceChapterCorrection(index: number) {
  setChapterStatus(index, 'raw');
  if (!queue.includes(index)) queue.push(index);
  void drain();
}

/** Met en file tous les chapitres encore bruts ou en échec. */
export function enqueueAllPendingCorrections(): number {
  const pending = readWrittenProgress().chapters.filter(isPending);
  pending.forEach((c) => {
    if (!queue.includes(c.index)) queue.push(c.index);
  });
  void drain();
  return pending.length;
}

/**
 * Corrige tout ce qui reste à traiter. Les chapitres déjà corrigés ne sont
 * jamais refacturés ; leur bouton individuel permet toujours une recorrrection
 * volontaire si l'auteur la demande explicitement.
 */
export function correctWholeBook(): number {
  const chapters = readWrittenProgress().chapters.filter(isPending);
  chapters.forEach((c) => {
    if (!queue.includes(c.index)) queue.push(c.index);
  });
  void drain();
  return chapters.length;
}

export function correctionQueueLength(): number {
  return queue.length + (running ? 1 : 0);
}
