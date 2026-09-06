import { supabase } from '@/integrations/supabase/client';
import { V3_LAUNCH_UNLOCKED } from '@/config/v3Launch';
import { SUBSCRIBER_HOME_PATH } from '@/lib/authDestination';

/**
 * Ouverture de la V3 : pilotée en base (`launch_settings.v3_open`) pour pouvoir
 * ouvrir ou refermer la V3 sans republier le site. La constante
 * `V3_LAUNCH_UNLOCKED` ne sert plus que de valeur de repli si la lecture échoue.
 */
export type V3OpenState = boolean | null; // null = encore inconnu

/** Écran de choix « ma V2 ou la V3 » proposé à l'abonné après l'ouverture. */
export const SUBSCRIBER_CHOICE_PATH = '/v3/bienvenue';

const LS_CHOICE_KEY = 'ebookstudio_espace_choisi';

export type SpaceChoice = 'v2' | 'v3';

export function getSpaceChoice(): SpaceChoice | null {
  try {
    const raw = localStorage.getItem(LS_CHOICE_KEY);
    return raw === 'v2' || raw === 'v3' ? raw : null;
  } catch {
    return null;
  }
}

export function setSpaceChoice(choice: SpaceChoice) {
  try {
    localStorage.setItem(LS_CHOICE_KEY, choice);
  } catch {
    /* ignore */
  }
}

export function clearSpaceChoice() {
  try {
    localStorage.removeItem(LS_CHOICE_KEY);
  } catch {
    /* ignore */
  }
}

/** Lit l'interrupteur d'ouverture. Repli sur la constante en cas d'erreur. */
export async function fetchV3Open(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('launch_settings')
      .select('value')
      .eq('key', 'v3_open')
      .maybeSingle();
    if (error || !data) return V3_LAUNCH_UNLOCKED;
    const value = data.value as { enabled?: boolean } | null;
    return value?.enabled === true;
  } catch {
    return V3_LAUNCH_UNLOCKED;
  }
}

/**
 * Destination d'un abonné après connexion :
 * - V3 fermée → sa V2, comme aujourd'hui ;
 * - V3 ouverte → écran de choix, ou directement l'espace déjà choisi.
 */
export async function resolveSubscriberDestination(): Promise<string> {
  const open = await fetchV3Open();
  if (!open) return SUBSCRIBER_HOME_PATH;
  const choice = getSpaceChoice();
  if (choice === 'v2') return SUBSCRIBER_HOME_PATH;
  if (choice === 'v3') return '/v3';
  return SUBSCRIBER_CHOICE_PATH;
}
