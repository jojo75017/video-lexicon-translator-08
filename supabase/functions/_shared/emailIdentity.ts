/**
 * Identité d'envoi unique pour tous les emails du projet.
 *
 * - `FROM_CAMPAIGN` / `FROM_APP` : le domaine `ebookstudio.fr` est déjà
 *   authentifié (SPF `include:amazonses.com` + DKIM `resend._domainkey`) et
 *   possède l'historique d'envoi. On ne change pas d'expéditeur juste avant
 *   une campagne : un domaine neuf repart d'une réputation à zéro.
 * - `REPLY_TO` : les réponses arrivent sur la boîte support, relevée
 *   quotidiennement. `DIRECT_EMAIL` reste l'adresse personnelle citée dans
 *   les signatures.
 */

export const FROM_CAMPAIGN = "Georges Boubet <noreply@ebookstudio.fr>";
export const FROM_APP = "EbookStudio <noreply@ebookstudio.fr>";
export const REPLY_TO = "support@georgesboubet.com";
export const DIRECT_EMAIL = "boubetgeorges@gmail.com";
