/**
 * Téléchargement local de l'illustration générée (image seule, sans texte).
 *
 * 100 % navigateur : on lit l'URL signée temporaire du fichier privé, on
 * télécharge les octets tels quels, aucun appel IA, aucun crédit, aucune copie
 * publique, aucune écriture en base.
 */
import { getSignedCoverUrl } from '@/lib/coverProjects';

/** Nom de fichier sûr : sans accent, sans espace, sans caractère spécial. */
export function illustrationFileName(title: string | null | undefined, ext: string): string {
  const base = (title ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60);
  return `${base || 'illustration'}-illustration.${ext}`;
}

/**
 * Télécharge l'illustration privée d'un projet.
 * `path` est un chemin de stockage (jamais une URL publique).
 */
export async function downloadIllustration(
  path: string,
  bookTitle?: string | null,
): Promise<string> {
  const url = await getSignedCoverUrl(path, 300);
  if (!url) throw new Error('Image indisponible pour le moment, réessayez.');

  const response = await fetch(url);
  if (!response.ok) throw new Error('Image indisponible pour le moment, réessayez.');
  const blob = await response.blob();

  const ext = (path.split('.').pop() || 'png').toLowerCase().replace('jpeg', 'jpg');
  const fileName = illustrationFileName(bookTitle, ext);

  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = fileName;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);

  return fileName;
}
