import { ADMIN_HOME_PATH } from '@/config/adminRoutes';

export type AccessState = 'pending' | 'admin' | 'subscriber' | 'visitor';

/**
 * Les abonnés travaillent sur la V2 : la V3 n'est jamais une destination de
 * connexion. Seule la page « Ancien client V2 » (/v3/migration) leur reste
 * ouverte, via le lien dédié.
 */
export const SUBSCRIBER_HOME_PATH = '/ebook-planner';
export const PUBLIC_HOME_PATH = '/commander';

/** Single routing policy used after authentication and by legacy entry paths. */
export function getHomePath(access: AccessState): string | null {
  if (access === 'pending') return null;
  if (access === 'admin') return ADMIN_HOME_PATH;
  if (access === 'subscriber') return SUBSCRIBER_HOME_PATH;
  return PUBLIC_HOME_PATH;
}

/** Verify the server-backed admin role before choosing a post-login destination. */
export async function getAuthenticatedHomePath(
  checkAdmin: () => Promise<boolean>,
): Promise<string> {
  return (await checkAdmin()) ? ADMIN_HOME_PATH : SUBSCRIBER_HOME_PATH;
}