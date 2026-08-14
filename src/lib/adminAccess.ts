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
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  // Erreur réseau : statut inconnu (null) pour permettre une nouvelle tentative.
  if (userError) return null;
  if (!user) return false;

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
 * Revalide l'utilisateur puis vérifie le rôle admin en base.
 * Le résultat est mémorisé : un aléa réseau ne fait plus passer un admin
 * pour un simple visiteur. Une seconde tentative est effectuée en cas d'erreur.
 */
export async function getIsCurrentSessionAdmin(): Promise<boolean> {
  if (cachedResult !== null) return cachedResult;
  if (pendingCheck) return pendingCheck;

  pendingCheck = (async () => {
    try {
      let result = await checkOnce();
      if (result === null) {
        // Session peut-être encore en cours de restauration : une seconde chance.
        await new Promise((r) => setTimeout(r, 800));
        result = await checkOnce();
      }
      if (result === null) return false; // inconnu : on n'accorde rien, mais on ne mémorise pas
      publish(result);
      return result;
    } catch (error) {
      console.error('Vérification de la session admin en échec :', error);
      return false;
    } finally {
      pendingCheck = null;
    }
  })();

  return pendingCheck;
}

export function clearAdminCache() {
  pendingCheck = null;
  publish(null);
  try {
    localStorage.removeItem('admin_status_cache_v1');
  } catch {
    // Browser storage may be unavailable.
  }
}
