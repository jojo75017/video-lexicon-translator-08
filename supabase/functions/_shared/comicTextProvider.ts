/** BD text only: selected BYOK provider, no shared-key or paid fallback. */
export async function comicTextProvider(body: Record<string, unknown>, systemPrompt: string, maxTokens = 6000) {
  const json = (data: unknown, status = 200, extra: Record<string, string> = {}) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...extra } });
  if (typeof body.prompt !== 'string' || !body.prompt.trim() || body.prompt.length > 100000) {
    return json({ error: 'Demande de scénario manquante ou trop longue.' }, 400);
  }
  const rawKey = body.userApiKey ?? body.userGeminiApiKey ?? body.openaiApiKey;
  const key = typeof rawKey === 'string' ? rawKey.trim() : '';
  if (!key) return json({ error: 'Enregistrez votre clé de rédaction dans « Choisir mon IA · Clés API » avant de générer le scénario.' }, 400);
  const provider = key.startsWith('sk-or-') ? 'openrouter' : key.startsWith('sk-ant-') ? 'claude' : key.startsWith('sk-') ? 'openai' : 'gemini';
  if (body.provider && body.provider !== provider) return json({ error: 'La clé ne correspond pas au moteur de rédaction sélectionné.' }, 400);
  const defaults = { gemini: 'gemini-flash-latest', openai: 'gpt-4o-mini', claude: 'claude-3-5-sonnet-20241022', openrouter: 'google/gemini-2.5-flash-lite' };
  const model = typeof body.model === 'string' && body.model.trim() ? body.model.trim() : defaults[provider];
  if (!/^[a-zA-Z0-9._:/-]{1,200}$/.test(model)) return json({ error: 'Modèle de rédaction invalide.' }, 400);
  const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: body.prompt }];
  const url = provider === 'gemini' ? `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`
    : provider === 'claude' ? 'https://api.anthropic.com/v1/messages'
    : provider === 'openrouter' ? 'https://openrouter.ai/api/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (provider === 'gemini') headers['x-goog-api-key'] = key;
  else if (provider === 'claude') { headers['x-api-key'] = key; headers['anthropic-version'] = '2023-06-01'; }
  else headers.Authorization = `Bearer ${key}`;
  const payload = provider === 'gemini'
    ? { system_instruction: { parts: [{ text: systemPrompt }] }, contents: [{ role: 'user', parts: [{ text: body.prompt }] }], generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7, responseMimeType: 'application/json' } }
    : provider === 'claude' ? { model, system: systemPrompt, messages: messages.slice(1), max_tokens: maxTokens }
    : { model, messages, max_tokens: maxTokens };
  try {
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload), signal: AbortSignal.timeout(maxTokens > 6000 ? 145000 : 120000) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = typeof data?.error?.message === 'string' ? data.error.message.split(key).join('[clé masquée]') : `Erreur ${provider} (${response.status}).`;
      const retryAfter = response.headers.get('Retry-After');
      const delay = data?.error?.details?.find((d: { retryDelay?: string }) => d.retryDelay)?.retryDelay;
      return json({ error: message, provider, retryAfter: retryAfter || delay }, response.status, retryAfter ? { 'Retry-After': retryAfter } : {});
    }
    const content = provider === 'gemini' ? data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('')
      : provider === 'claude' ? data.content?.map((p: { text?: string }) => p.text || '').join('') : data.choices?.[0]?.message?.content;
    if (data.promptFeedback?.blockReason || data.choices?.[0]?.message?.refusal || data.stop_reason === 'refusal' || data.candidates?.[0]?.finishReason === 'SAFETY') {
      return json({ error: 'Le fournisseur IA a refusé cette demande de scénario.', stage: 'refusal' }, 422);
    }
    if (typeof content !== 'string' || !content.trim()) return json({ error: 'Le fournisseur IA n’a renvoyé aucun scénario.', stage: 'empty_response' }, 422);
    return json({ content, provider, model });
  } catch {
    return json({ error: 'Le fournisseur IA ne répond pas ou la génération a dépassé le délai autorisé.' }, 504);
  }
}