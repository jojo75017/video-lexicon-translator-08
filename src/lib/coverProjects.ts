/**
 * Couche d'accès isolée aux projets de couverture (étape 1).
 *
 * Règles strictes :
 *  - table `cover_projects` protégée par RLS (`user_id = auth.uid()`) ;
 *  - fichiers dans le bucket PRIVÉ `covers`, toujours sous `<user_id>/…` ;
 *  - aucune URL publique persistée : uniquement des chemins + URL signées temporaires ;
 *  - aucun repli sur l'email : sans session authentifiée, l'opération est refusée ;
 *  - aucun champ ISBN, aucun appel IA (donc aucun crédit consommé).
 *
 * Ce module n'est branché sur aucune interface à ce stade.
 */
import { supabase } from '@/integrations/supabase/client';

export const COVERS_BUCKET = 'covers';
export const COVER_SCHEMA_VERSION = 1;

/** Durée de validité par défaut des URL signées (1 h). */
export const SIGNED_URL_TTL_SECONDS = 3600;

export type CoverType = 'ebook' | 'paperback' | 'hardcover';

export interface CoverProject {
  id: string;
  user_id: string;
  project_name: string;
  book_title: string | null;
  cover_type: CoverType;
  format_id: string;
  page_count: number | null;
  fabric_json: unknown | null;
  illustration_path: string | null;
  thumbnail_path: string | null;
  /** Étape 4B — configuration KDP broché (pouces = source de vérité). */
  kdp_config: unknown | null;
  kdp_geometry: unknown | null;
  kdp_rules_version: string | null;
  schema_version: number;
  created_at: string;
  updated_at: string;
}

export interface CoverProjectInput {
  project_name: string;
  book_title?: string | null;
  cover_type: CoverType;
  format_id: string;
  page_count?: number | null;
  fabric_json?: unknown | null;
  illustration_path?: string | null;
  thumbnail_path?: string | null;
  kdp_config?: unknown | null;
  kdp_geometry?: unknown | null;
  kdp_rules_version?: string | null;
}

export class CoverAuthRequiredError extends Error {
  constructor() {
    super('Connexion requise : impossible d’enregistrer une couverture sans session authentifiée.');
    this.name = 'CoverAuthRequiredError';
  }
}

/** Identifiant du propriétaire — jamais l'email, jamais de repli localStorage. */
export async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  const userId = data?.user?.id;
  if (error || !userId) throw new CoverAuthRequiredError();
  return userId;
}

/* ------------------------------------------------------------------ */
/* CRUD                                                               */
/* ------------------------------------------------------------------ */

export async function listCoverProjects(): Promise<CoverProject[]> {
  await requireUserId();
  const { data, error } = await supabase
    .from('cover_projects')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as CoverProject[];
}

export async function getCoverProject(id: string): Promise<CoverProject | null> {
  await requireUserId();
  const { data, error } = await supabase
    .from('cover_projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as CoverProject) ?? null;
}

export async function createCoverProject(input: CoverProjectInput): Promise<CoverProject> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from('cover_projects')
    .insert({
      user_id: userId,
      project_name: input.project_name,
      book_title: input.book_title ?? null,
      cover_type: input.cover_type,
      format_id: input.format_id,
      page_count: input.page_count ?? null,
      fabric_json: (input.fabric_json ?? null) as never,
      illustration_path: input.illustration_path ?? null,
      thumbnail_path: input.thumbnail_path ?? null,
      schema_version: COVER_SCHEMA_VERSION,
    } as never)
    .select('*')
    .single();
  if (error) throw error;
  return data as unknown as CoverProject;
}

export async function updateCoverProject(
  id: string,
  patch: Partial<CoverProjectInput>,
): Promise<CoverProject> {
  await requireUserId();
  const { data, error } = await supabase
    .from('cover_projects')
    .update(patch as never)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as unknown as CoverProject;
}

export async function deleteCoverProject(id: string): Promise<void> {
  await requireUserId();

  // Nettoyage des fichiers privés associés avant suppression de la ligne.
  const project = await getCoverProject(id);
  const paths = [project?.illustration_path, project?.thumbnail_path].filter(
    (p): p is string => Boolean(p),
  );
  if (paths.length) {
    await supabase.storage.from(COVERS_BUCKET).remove(paths);
  }

  const { error } = await supabase.from('cover_projects').delete().eq('id', id);
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/* Fichiers privés (bucket `covers`)                                  */
/* ------------------------------------------------------------------ */

const extensionFor = (contentType: string): string =>
  (contentType.split('/')[1] || 'png').replace('jpeg', 'jpg');

/**
 * Envoie un fichier dans `covers/<user_id>/<projectId>/<kind>-<timestamp>.<ext>`.
 * Retourne le CHEMIN de stockage (jamais une URL).
 */
export async function uploadCoverFile({
  projectId,
  kind,
  blob,
}: {
  projectId: string;
  kind: 'illustration' | 'thumbnail';
  blob: Blob;
}): Promise<string> {
  const userId = await requireUserId();
  const contentType = blob.type || 'image/png';
  const path = `${userId}/${projectId}/${kind}-${Date.now()}.${extensionFor(contentType)}`;

  const { error } = await supabase.storage
    .from(COVERS_BUCKET)
    .upload(path, blob, { contentType, upsert: false });
  if (error) throw error;

  return path;
}

/** URL signée temporaire pour afficher ou télécharger un fichier privé. */
export async function getSignedCoverUrl(
  path: string,
  expiresInSeconds: number = SIGNED_URL_TTL_SECONDS,
): Promise<string | null> {
  if (!path) return null;
  await requireUserId();
  const { data, error } = await supabase.storage
    .from(COVERS_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export async function removeCoverFile(path: string): Promise<boolean> {
  if (!path) return false;
  await requireUserId();
  const { error } = await supabase.storage.from(COVERS_BUCKET).remove([path]);
  return !error;
}
