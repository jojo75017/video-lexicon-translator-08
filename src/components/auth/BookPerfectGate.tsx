import React from 'react';
import { useBookPerfectAccess } from '@/hooks/useBookPerfectAccess';
import BookPerfectSalesPage from '@/pages/BookPerfectSalesPage';

/**
 * Contrôle d'accès BookPerfect AI.
 * - Accès (admin / Pack Pro V3 / achat) → affiche le module.
 * - Sinon → page de vente (upsell 97€, lancement 67€).
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
    return <BookPerfectSalesPage />;
  }

  return <>{children}</>;
}

export default BookPerfectGate;
