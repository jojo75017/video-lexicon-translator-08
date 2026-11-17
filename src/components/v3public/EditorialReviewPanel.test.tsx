import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import EditorialReviewPanel from './EditorialReviewPanel';

const state = vi.hoisted(() => ({
  chapters: [{ title: 'Retour', content: 'Il découvre encore la grotte.', id: 'chapter-1' }],
  order: [] as string[], backupFails: false,
  stale: false, filters: [] as [string, unknown][],
}));
vi.mock('@/services/aiWritingService', () => ({ getProvider: () => 'gemini', getActiveAIKey: () => 'test-only', getOpenRouterModel: () => '' }));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() } }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: { getUser: async () => ({ data: { user: { id: 'owner' } } }) },
  functions: { invoke: async (_: string, { body }: any) => ({ data: body.mode === 'corrections'
    ? { corrections: [{ chapitre: 1, extrait: 'découvre encore', remplacement: 'retourne dans', raison: 'Découverte répétée' }] }
    : { score: 70, synthese: 'Continuité à revoir', categories: { evenements: [{ chapitre: 1, probleme: 'Une découverte est répétée.' }] } } }) },
  from: (table: string) => {
    let action = 'read'; let payload: any;
    const chain: any = {
      select: () => chain, eq: (column: string, value: unknown) => { if (action === 'update') state.filters.push([column, value]); return chain; }, order: () => chain, limit: () => chain,
      update: (value: any) => { action = 'update'; payload = value; return chain; },
      insert: (value: any) => { state.order.push('backup'); expect(value.chapters).toEqual(state.chapters); return Promise.resolve({ error: state.backupFails ? new Error('backup failed') : null }); },
      single: async () => ({ data: { chapters: state.chapters, title: 'Livre test', updated_at: '2026-11-17T11:18:00Z' } }),
      then: (resolve: any) => {
        if (action === 'update') { state.order.push('update'); if (!state.stale) state.chapters = payload.chapters; resolve({ data: state.stale ? [] : [{ id: 'book' }] }); }
        else resolve({ data: table === 'ebook_project_versions' ? [{ version_number: 1 }] : [] });
      },
    };
    return chain;
  },
} }));

afterEach(() => { cleanup(); state.chapters = [{ title: 'Retour', content: 'Il découvre encore la grotte.', id: 'chapter-1' }]; state.order = []; state.backupFails = false; state.stale = false; state.filters = []; });

async function prepare() {
  render(<EditorialReviewPanel books={[{ id: 'book', title: 'Livre test' }]} />);
  fireEvent.click(screen.getByRole('button', { name: 'Récupérer ce livre' }));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Lancer la correction éditoriale' })).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: 'Lancer la correction éditoriale' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Préparer les corrections suggérées' }));
  return screen.findByRole('button', { name: /Appliquer les corrections suggérées/ });
}

describe('validation et sauvegarde des corrections', () => {
  it('ne touche pas le livre avant validation et sauvegarde avant le remplacement', async () => {
    const button = await prepare();
    expect(state.order).toEqual([]);
    fireEvent.click(button);
    await waitFor(() => expect(state.order).toEqual(['backup', 'update']));
    expect(state.chapters).toEqual([{ title: 'Retour', content: 'Il retourne dans la grotte.', id: 'chapter-1' }]);
    expect(state.filters).toContainEqual(['updated_at', '2026-11-17T11:18:00Z']);
    expect(state.filters.some(([column]) => column === 'chapters')).toBe(false);
  });
  it('n’écrase jamais le livre quand la sauvegarde originale échoue', async () => {
    state.backupFails = true;
    fireEvent.click(await prepare());
    await waitFor(() => expect(state.order).toEqual(['backup']));
    expect(state.chapters[0].content).toBe('Il découvre encore la grotte.');
  });
  it('refuse une sauvegarde concurrente sans écraser le manuscrit', async () => {
    state.stale = true;
    fireEvent.click(await prepare());
    await waitFor(() => expect(state.order).toEqual(['backup', 'update']));
    expect(state.chapters[0].content).toBe('Il découvre encore la grotte.');
  });
});