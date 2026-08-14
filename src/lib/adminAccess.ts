import { supabase } from '@/integrations/supabase/client';

let pendingCheck: Promise<boolean> | null = null;
/** Résultat mémorisé pour la session en cours (null = inconnu). */
let cachedResult: boolean | null = null;

type Listener = (isAdmin: boolean | null) => void;
const listeners = new Set<Listener>();

function publish(value: boolean | null) {
  cachedResult = value;
  listeners.forEach((fn) => {
    try { fn(value); } catch { /* un abonné en erreur ne bloque pas les autres */ }
  });
}

/** Statut connu sans requête (null si la vérification n'a pas encore abouti). */
export function getCachedAdminStatus(): boolean | null {
  return cachedResult;
}

/** S'abonner aux changements de statut admin. Renvoie la fonction de désabonnement. */
export function subscribeAdminStatus(fn: Listener): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

async function checkOnce(): Promise<boolean | null> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) return null;
  if (!session) return false;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  // Erreur réseau : statut inconnu (null) pour permettre une nouvelle tentative.
  if (userError) return null;
  // Une session existe mais l'utilisateur n'est pas encore restauré : ne jamais
  // mémoriser ce décalage transitoire comme un refus administrateur définitif.
  if (!user) return null;

  const { data: roleResult, error: roleError } = await supabase.rpc('has_role', {
    _user_id: user.id,
    _role: 'admin',
  });
  if (roleError) {
    console.error('Vérification du rôle admin en échec :', roleError);
    return null;
  }
  return roleResult === true;
}

/**
 * Résout le statut admin en distinguant clairement les trois états :
 * `true` (admin confirmé), `false` (confirmé non-admin), `null` (inconnu).
 * Un `true` confirmé n'est jamais rétrogradé pendant la session.
 */
export async function resolveAdminStatus(): Promise<boolean | null> {
  if (cachedResult === true) return true;
  if (pendingCheck) return pendingCheck;

  pendingCheck = (async () => {
    try {
      let result = await checkOnce();
      // Session peut-être encore en cours de restauration : 2 nouvelles chances.
      for (let attempt = 0; attempt < 2 && result === null; attempt++) {
        await new Promise((r) => setTimeout(r, 700));
        result = await checkOnce();
      }
      if (result === null) return null; // inconnu : on ne conclut rien
      publish(result);
      return result;
    } catch (error) {
      console.error('Vérification de la session admin en échec :', error);
      return null;
    } finally {
      pendingCheck = null;
    }
  })();

  return pendingCheck;
}

/**
 * Variante booléenne pour les appelants qui ne savent pas gérer l'inconnu :
 * un statut inconnu n'accorde aucun droit, mais n'est jamais mémorisé.
 */
export async function getIsCurrentSessionAdmin(): Promise<boolean> {
  return (await resolveAdminStatus()) === true;
}

/** À réserver à la déconnexion : efface un statut admin confirmé. */
export function clearAdminCache() {
  pendingCheck = null;
  publish(null);
  try {
    localStorage.removeItem('admin_status_cache_v1');
  } catch {
    // Browser storage may be unavailable.
  }
}

