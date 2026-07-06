/**
 * Mappe une erreur technique brute vers un message FR clair pour l'utilisateur.
 */

/**
 * Détecte si l'erreur correspond au quota gratuit Gemini épuisé (20 req/jour).
 * Dans ce cas l'abonné doit activer la facturation sur son projet Google Cloud.
 */
export function isFreeTierQuotaError(error: any): boolean {
  const raw = (error?.message || error?.toString() || '').toString().toLowerCase();
  if (!raw) return false;
  return (
    raw.includes('free_tier') ||
    raw.includes('freetier') ||
    raw.includes('resource_exhausted') ||
    raw.includes('activez la facturation') ||
    raw.includes('rate_limit: limite gemini') ||
    (raw.includes('429') && raw.includes('gemini'))
  );
}

/**
 * Détecte si l'erreur correspond aux crédits IA (Lovable AI) épuisés — HTTP 402.
 * Dans ce cas l'abonné doit recharger des crédits OU configurer une clé Gemini personnelle.
 */
export function isCreditsExhaustedError(error: any): boolean {
  const raw = (error?.message || error?.toString() || '').toString().toLowerCase();
  if (!raw) return false;
  return (
    raw.includes('402') ||
    raw.includes('credits_exhausted') ||
    raw.includes('crédits épuisés') ||
    raw.includes('credits epuises') ||
    raw.includes('payment_required') ||
    (raw.includes('not enough') && raw.includes('credit'))
  );
}

export function getFriendlyError(error: any, fallback = 'Une erreur est survenue. Réessayez.'): string {
  const raw = (error?.message || error?.toString() || '').toString();
  const msg = raw.toLowerCase();

  if (!raw) return fallback;

  // Quota gratuit Gemini épuisé (20 req/jour) — cas le plus fréquent chez les abonnés
  if (isFreeTierQuotaError(error)) {
    return (
      '🚫 Votre clé Gemini a atteint la limite GRATUITE de 20 générations/jour.\n\n' +
      '✅ Solution (2 min, gratuit) : activez la facturation sur votre projet Google Cloud. ' +
      'Google offre 300$ de crédit gratuit et le coût réel d\'un ebook complet est ~0,01€.\n\n' +
      '👉 Allez sur https://aistudio.google.com/app/apikey → cliquez sur votre clé → "Set up Billing" → liez une carte. ' +
      'Votre clé passe de "Free" à "Paid" (1000 req/min) immédiatement.'
    );
  }

  // Quotas / rate limiting génériques
  if (msg.includes('429') || msg.includes('quota') || msg.includes('rate limit')) {
    return '⚠️ Quota IA atteint. Patientez ~60s puis relancez la génération.';
  }

  // Clé API
  if (msg.includes('401') || msg.includes('403') || msg.includes('invalid') && msg.includes('key') || msg.includes('api key')) {
    return '🔑 Clé API Gemini invalide. Vérifiez votre clé sur aistudio.google.com (format AIza...).';
  }

  // Timeout / réseau
  if (msg.includes('timeout') || msg.includes('aborterror') || msg.includes('aborted') || msg.includes('took too long')) {
    return '⏱️ La génération a pris trop de temps. Vérifiez votre connexion et réessayez.';
  }
  if (msg.includes('network') || msg.includes('failed to fetch') || msg.includes('networkerror')) {
    return '📡 Problème de connexion réseau. Vérifiez votre Internet et réessayez.';
  }

  // Edge functions
  if (msg.includes('failed to send a request to the edge function') || msg.includes('functionsfetcherror')) {
    return '🛠️ Le service de génération est temporairement indisponible. Réessayez dans quelques secondes.';
  }
  if (msg.includes('non-2xx') || msg.includes('500') || msg.includes('502') || msg.includes('503')) {
    return '🛠️ Le service de génération rencontre un souci. Réessayez dans une minute.';
  }

  // Parse JSON
  if (msg.includes('json') && (msg.includes('parse') || msg.includes('unexpected'))) {
    return '🧩 Réponse IA mal formée. Relancez l\'étape, le modèle se corrige généralement au 2ᵉ essai.';
  }

  // Codes internes connus
  if (msg.includes('p3_structure_incomplete')) {
    return 'La structure (étape P3) est incomplète. Relancez P3 puis enchaînez avec P4.';
  }
  if (msg.includes('quota_exceeded')) {
    return 'Vous avez atteint la limite de votre offre. Mettez à niveau votre abonnement pour continuer.';
  }
  if (msg.includes('no_subscription')) {
    return 'Aucun abonnement actif détecté. Activez votre essai gratuit pour générer.';
  }

  // Storage
  if (msg.includes('quotaexceedederror') || msg.includes('localstorage')) {
    return '💾 Espace de sauvegarde local saturé. Une purge automatique a été effectuée - réessayez.';
  }

  // Cancellation utilisateur
  if (msg.includes('user_cancelled') || msg.includes('cancelled by user')) {
    return '⏹️ Génération arrêtée à votre demande.';
  }

  // Fallback : on retourne le message brut s'il est court et lisible, sinon le fallback générique
  if (raw.length < 140 && !/[<>{}]/.test(raw)) return raw;
  return fallback;
}
