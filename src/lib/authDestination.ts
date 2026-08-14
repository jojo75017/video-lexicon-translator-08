import { ADMIN_HOME_PATH } from '@/config/adminRoutes';

export type AccessState = 'pending' | 'admin' | 'subscriber' | 'visitor';

export const SUBSCRIBER_HOME_PATH = '/v3';
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