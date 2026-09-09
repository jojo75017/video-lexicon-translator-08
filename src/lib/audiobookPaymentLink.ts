/**
 * Le lien de paiement d'un livre audio est visible par tous les visiteurs de la
 * page publique. On n'y accepte donc jamais une adresse e-mail : uniquement une
 * adresse web (https://…) ou un identifiant paypal.me.
 */
export function sanitizePaypalLink(raw: string): { value: string | null; error?: string } {
  const value = (raw || '').trim();
  if (!value) return { value: null };
  if (value.includes('@')) {
    return {
      value: null,
      error: "Votre page de vente est publique : n'y mettez pas votre adresse e-mail PayPal. Utilisez votre lien paypal.me (par exemple https://paypal.me/votrenom).",
    };
  }
  if (/\s/.test(value)) {
    return { value: null, error: 'Ce lien de paiement contient des espaces : collez le lien complet.' };
  }
  return { value };
}
