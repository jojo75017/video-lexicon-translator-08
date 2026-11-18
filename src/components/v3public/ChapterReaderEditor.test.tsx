import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChapterReaderEditor from './ChapterReaderEditor';

const state = vi.hoisted(() => ({ writes: [] as Record<string, unknown>[][], fail: false }));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  from: () => ({ update: ({ chapters }: { chapters: Record<string, unknown>[] }) => ({
    eq: async () => {
      if (!state.fail) state.writes.push(structuredClone(chapters));
      return { error: state.fail ? { message: 'Save failed' } : null };
    },
  }) }),
} }));

beforeEach(() => { state.writes = []; state.fail = false; vi.spyOn(window, 'confirm').mockReturnValue(true); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function openBook() {
  render(<ChapterReaderEditor book={{ id: 'book', title: 'Test book', chapters: [
    { title: 'One', content: 'Original one', imageUrl: 'private-image' },
    { titre: 'Two', contenu: 'Original two' },
    { title: 'Three', content: 'Original three' },
  ] }} onClose={vi.fn()} onSaved={vi.fn()} />);
}
function edit(text: string) {
  fireEvent.click(screen.getByRole('button', { name: 'Modifier ce chapitre' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Texte du chapitre' }), { target: { value: text } });
}
async function save() {
  fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
  await screen.findByRole('button', { name: 'Modifier ce chapitre' });
}

describe('saved chapter protection', () => {
  it.each(['cancel', 'switch'])('preserves chapter 1 after discarding chapter 2 by %s and saving chapter 3', async (discard) => {
    openBook();
    edit('Saved correction one');
    await save();
    fireEvent.click(screen.getByRole('button', { name: '2. Two' }));
    edit('Discard this change');
    if (discard === 'cancel') fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));
    fireEvent.click(screen.getByRole('button', { name: '3. Three' }));
    edit('Saved correction three');
    await save();
    expect(state.writes[1]).toEqual([
      { title: 'One', content: 'Saved correction one', imageUrl: 'private-image' },
      { titre: 'Two', contenu: 'Original two' },
      { title: 'Three', content: 'Saved correction three' },
    ]);
    fireEvent.click(screen.getByRole('button', { name: '1. One' }));
    expect(screen.getByText('Saved correction one')).toBeInTheDocument();
  });
  it('does not treat a failed save as the saved version', async () => {
    openBook();
    state.fail = true;
    edit('Not saved');
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(screen.getByText('Original one')).toBeInTheDocument();
    expect(state.writes).toEqual([]);
  });
});