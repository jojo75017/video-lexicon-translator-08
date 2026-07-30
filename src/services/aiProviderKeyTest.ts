import { type AIProvider, PROVIDER_LABELS, sanitizeKey, validateKeyFormat } from '@/services/aiWritingService';

export type ProviderKeyTestResult = {
  ok: boolean;
  extra?: string;
  error?: string;
};

export async function testAIProviderKey(provider: AIProvider, rawKey: string): Promise<ProviderKeyTestResult> {
  const key = sanitizeKey(rawKey || '');
  if (!key) return { ok: false, error: 'Saisissez d’abord la clé.' };
  if (!validateKeyFormat(provider, key)) {
    return { ok: false, error: `Format de clé ${PROVIDER_LABELS[provider]} invalide.` };
  }

  try {
    let ok = false;
    let extra = '';

    if (provider === 'gemini') {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`);
      const body = r.ok ? '' : await r.text().catch(() => '');
      const explicitlyInvalid = /API_KEY_INVALID|API key not valid|API_KEY_SERVICE_BLOCKED/i.test(body);
      // 429 = clé reconnue mais quota atteint. Certains nouveaux formats AQ.*
      // ne sont pas vérifiables par l'endpoint models : seul un rejet explicite
      // de Google permet alors de les déclarer invalides.
      ok = r.ok || r.status === 429 || (/^AQ\./i.test(key) && !explicitlyInvalid);
      if (!r.ok && ok && /^AQ\./i.test(key)) extra = ' (nouveau format accepté)';
    } else if (provider === 'openai') {
      const r = await fetch('https://api.openai.com/v1/models', { headers: { Authorization: `Bearer ${key}` } });
      ok = r.ok || r.status === 429;
    } else if (provider === 'claude') {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }],
        }),
      });
      ok = r.ok || r.status === 429;
    } else if (provider === 'openrouter') {
      const r = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: { Authorization: `Bearer ${key}` },
      });
      ok = r.ok;
      if (ok) {
        const j = await r.json().catch(() => ({}));
        const credits = j?.data?.limit_remaining ?? j?.data?.usage;
        if (credits != null) extra = ` (crédits: ${credits})`;
      }
    }

    return ok
      ? { ok: true, extra }
      : { ok: false, error: `Clé ${PROVIDER_LABELS[provider]} rejetée.` };
  } catch {
    return { ok: false, error: 'Erreur réseau lors du test.' };
  }
}