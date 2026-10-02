import { useEffect, useState } from 'react';
import useIsAdmin from '@/hooks/useIsAdmin';
import { isPreviewingAsSubscriber } from '@/components/v3/V3ContemplationMode';

/**
 * Admin effectif = admin réel ET mode « Voir comme un abonné » désactivé.
 * Sert à masquer les outils d'essai admin (ex. studio de couverture payant)
 * dès que l'admin active l'aperçu abonné.
 */
export default function useEffectiveAdmin() {
  const { isAdmin } = useIsAdmin();
  const [preview, setPreview] = useState(isPreviewingAsSubscriber);

  useEffect(() => {
    const sync = () => setPreview(isPreviewingAsSubscriber());
    window.addEventListener('v3-admin-preview-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('v3-admin-preview-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return { effectiveAdmin: isAdmin === true && !preview };
}
