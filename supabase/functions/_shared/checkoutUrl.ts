// Source unique de vérité pour l'URL publique du tunnel de commande.
// IMPORTANT : ce domaine doit être réellement rattaché au projet Lovable,
// sinon les liens des emails tombent sur la page « Setting up… ».
// `www.ebookstudio.fr` n'est plus connecté → on utilise notify.ebookstudio.fr.
export const SITE_ORIGIN = "https://notify.ebookstudio.fr";
export const CHECKOUT_URL = `${SITE_ORIGIN}/commander`;

export function checkoutUrl(src?: string): string {
  return src ? `${CHECKOUT_URL}?src=${encodeURIComponent(src)}` : CHECKOUT_URL;
}
