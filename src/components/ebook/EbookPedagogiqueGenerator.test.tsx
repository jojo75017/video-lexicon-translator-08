import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import EbookPedagogiqueGenerator from './EbookPedagogiqueGenerator';

const state = vi.hoisted(() => ({ rows: [] as Record<string, unknown>[], inserts: 0, updates: 0, lookupError: false }));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('@/lib/ebookProjectStorage', () => ({
  writeAutosave: vi.fn(),
  readAutosaveAsync: async () => ({ bookTitle: 'Learning book', bookSubtitle: 'A practical guide', chapters: [
    { id: 'chapter-1', title: 'First steps', intro: 'Original lesson', subSections: [], callouts: [], tables: [] },
  ] }),
}));
vi.mock('./EbookProjectsPanel', () => ({ EbookProjectsPanel: () => null }));
vi.mock('./EbookSettingsPanel', () => ({ EbookSettingsPanel: () => null, loadTypography: () => ({}), getOpenRouterKey: () => '' }));
vi.mock('@/lib/ebookDocxExporter', () => ({ exportEbookToDocx: vi.fn() }));
vi.mock('@/lib/ebookPdfExporter', () => ({ exportEbookToPdf: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: { getUser: async () => ({ data: { user: { id: 'owner' } } }) },
  from: () => {
    const filters: [string, unknown][] = [];
    const chain = {
      select: () => chain,
      eq: (key: string, value: unknown) => { filters.push([key, value]); return chain; },
      order: () => chain, limit: () => chain,
      maybeSingle: async () => ({ data: state.rows.find(row => filters.every(([k, v]) => row[k] === v)) ?? null,
        error: state.lookupError ? { message: 'Lookup failed' } : null }),
      insert: async (payload: Record<string, unknown>) => {
        state.inserts++; state.rows.push({ ...payload, id: `book-${state.inserts}` }); return { error: null };
      },
      update: (payload: Record<string, unknown>) => ({ eq: async (_key: string, id: unknown) => {
        state.updates++; state.rows = state.rows.map(row => row.id === id ? { ...row, ...payload } : row); return { error: null };
      } }),
    };
    return chain;
  },
} }));

beforeEach(() => { state.rows = []; state.inserts = 0; state.updates = 0; state.lookupError = false; });
afterEach(cleanup);

async function saveBook() {
  const button = await screen.findByRole('button', { name: 'Sauvegarder dans ma bibliothèque' });
  fireEvent.click(button);
  await waitFor(() => expect(button).toBeEnabled());
}
describe('learning book library save', () => {
  it('updates the same subtitled book on repeated saves, including after reopening', async () => {
    render(<EbookPedagogiqueGenerator />);
    await saveBook();
    await saveBook();
    cleanup();
    render(<EbookPedagogiqueGenerator />);
    await saveBook();
    expect(state.inserts).toBe(1);
    expect(state.updates).toBe(2);
    expect(state.rows).toHaveLength(1);
    expect(state.rows[0].title).toBe('Learning book — A practical guide');
  });
  it('does not insert a duplicate when the existing-book lookup fails', async () => {
    state.lookupError = true;
    render(<EbookPedagogiqueGenerator />);
    await saveBook();
    expect(state.inserts).toBe(0);
    expect(state.updates).toBe(0);
  });
});