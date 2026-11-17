import { describe, it, expect } from 'vitest';
import { edgeFunctionError } from './edgeFunctionError';

describe('messages de refus de la relecture', () => {
  it('affiche le message 402 plutôt que non-2xx', async () => {
    const error = { message: 'Edge Function returned a non-2xx status code', context: new Response(JSON.stringify({ error: 'Crédits insuffisants chez OpenRouter.' }), { status: 402 }) };
    expect(await edgeFunctionError(error)).toBe('Crédits insuffisants chez OpenRouter.');
    expect(error.context.bodyUsed).toBe(false);
  });
  it('préserve un refus 403 et accepte les erreurs renvoyées directement', async () => {
    expect(await edgeFunctionError({ context: new Response(JSON.stringify({ error: 'Accès refusé.' }), { status: 403 }) })).toBe('Accès refusé.');
    expect(await edgeFunctionError(null, { error: 'Clé manquante.' })).toBe('Clé manquante.');
  });
});