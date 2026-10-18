import { beforeEach, expect, it, vi } from 'vitest';
import { buildComicScenario } from './comicScenario';
import { comicTextProvider } from '../../../supabase/functions/_shared/comicTextProvider';

const mocks = vi.hoisted(() => ({ invoke: vi.fn(), provider: 'gemini', key: 'test-key', model: 'vendor/chosen-model' }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke: mocks.invoke } } }));
vi.mock('@/services/aiWritingService', () => ({ getProvider: () => mocks.provider, getProviderKey: () => mocks.key, getOpenRouterModel: () => mocks.model }));
const options = { title: 'Test BD', description: 'Une enquête au jardin', genre: 'Aventure', audience: 'Adolescents', heroName: 'Emma', numberOfPages: 3, panelCount: 1 };
const pages = { pages: [1, 2, 3].map(i => ({ panels: [{ description: `Action ${i}`, character: 'Emma', dialogue: '' }] })) };
beforeEach(() => { vi.restoreAllMocks(); mocks.invoke.mockReset(); mocks.provider = 'gemini'; mocks.key = 'test-key'; });

it('transmet la clé actuelle pour le scénario indépendamment des options images', async () => {
  mocks.invoke.mockResolvedValue({ data: { content: JSON.stringify(pages) }, error: null });
  await buildComicScenario({ ...options, openaiApiKey: 'stale-image-key', useOpenAI: false });
  expect(mocks.invoke.mock.calls[0][1].body.userApiKey).toBe('test-key');
  expect(mocks.invoke.mock.calls[0][1].body.provider).toBe('gemini');
});

it('préserve le modèle OpenRouter sélectionné', async () => {
  mocks.provider = 'openrouter';
  mocks.invoke.mockResolvedValue({ data: { content: JSON.stringify(pages) }, error: null });
  await buildComicScenario(options);
  expect(mocks.invoke.mock.calls[0][1].body.model).toBe('vendor/chosen-model');
});

it.each([429, 403, 401, 404, 500])('affiche la raison de l’échec %s sans répéter l’appel', async status => {
  mocks.invoke.mockResolvedValue({ data: null, error: { message: 'non-2xx', context: new Response(JSON.stringify({ error: 'Quota atteint, patienter 20303 secondes.' }), { status }) } });
  await expect(buildComicScenario(options)).rejects.toThrow('Quota atteint, patienter 20303 secondes.');
  expect(mocks.invoke).toHaveBeenCalledTimes(1);
});

it('n’utilise aucune clé serveur ou passerelle si la clé personnelle manque', async () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  const res = await comicTextProvider({ prompt: 'Scénario' }, 'Français');
  expect(res.status).toBe(400);
  expect(fetchMock).not.toHaveBeenCalled();
});

it('route la clé Google vers Gemini et préserve le quota et le délai', async () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ error: { message: 'Quota atteint', details: [{ retryDelay: '20303s' }] } }), { status: 429, headers: { 'Retry-After': '20303' } }));
  const res = await comicTextProvider({ prompt: 'Scénario', userApiKey: 'AIza-test', provider: 'gemini' }, 'Français');
  expect(String(fetchMock.mock.calls[0][0])).toContain('generativelanguage.googleapis.com');
  expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({ 'x-goog-api-key': 'AIza-test' });
  expect(res.status).toBe(429);
  expect(res.headers.get('Retry-After')).toBe('20303');
  expect((await res.json()).error).toBe('Quota atteint');
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it.each([['openai', 'sk-test', 'api.openai.com'], ['claude', 'sk-ant-test', 'api.anthropic.com'], ['openrouter', 'sk-or-test', 'openrouter.ai']])('route %s vers son propre fournisseur sans substitution', async (provider, key, host) => {
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ error: { message: 'Accès refusé' } }), { status: 403 }));
  const res = await comicTextProvider({ prompt: 'Scénario', userApiKey: key, provider, model: 'selected-model' }, 'Français');
  expect(String(fetchMock.mock.calls[0][0])).toContain(host);
  expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body)).model).toBe('selected-model');
  expect(res.status).toBe(403);
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it('arrête une réponse refusée même en HTTP 200', async () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { refusal: 'Refus', content: '' } }] })));
  const res = await comicTextProvider({ prompt: 'Scénario', userApiKey: 'sk-test' }, 'Français');
  expect(res.status).toBe(422);
  expect((await res.json()).stage).toBe('refusal');
  expect(fetchMock).toHaveBeenCalledTimes(1);
});