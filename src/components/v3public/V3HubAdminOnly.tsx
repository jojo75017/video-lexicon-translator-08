import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useIsAdmin';

/** L'ancien Hub V3 est réservé aux admins ; les clients sont redirigés vers la page actuelle équivalente. */
function targetFor(search: string): string {
  const p = new URLSearchParams(search);
  const tab = p.get('tab');
  if (p.get('module') === 'cover-studio-pro' || tab === 'cover-pro') return '/v3/studio-v4';
  if (tab === 'export') return '/v3/library';
  if (tab === 'outils' || tab === 'documentation') return '/v3/outils';
  return '/v3';
}

export default function V3HubAdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin } = useIsAdmin();
  const { search } = useLocation();
  if (isAdmin === null) return null;
  if (!isAdmin) return <Navigate to={targetFor(search)} replace />;
  return <>{children}</>;
}
