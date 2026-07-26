import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBookPerfectAccess } from '@/hooks/useBookPerfectAccess';

/**
 * Contrôle d'accès BookPerfect AI.
 * - Accès (admin / Pack Pro V3 / achat) → affiche le module.
 * - Sinon → redirection vers la page d'offres.
 */
export function BookPerfectGate({ children }: { children: React.ReactNode }) {
  const { loading, hasAccess } = useBookPerfectAccess();

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Chargement de BookPerfect AI…
      </main>
    );
  }

  if (!hasAccess) {
    return <Navigate to="/offres" replace />;
  }

  return <>{children}</>;
}

export default BookPerfectGate;
