import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V3KdpLancementPage from './V3KdpLancementPage';

const mocks = vi.hoisted(() => ({ writing: vi.fn(), books: vi.fn(), configured: vi.fn() }));
vi.mock('@/services/aiWritingService', () => ({ callAIWriting: mocks.writing, isAIConfigured: mocks.configured }));
vi.mock('@/lib/cover-editor/myBooks', () => ({ listMyBooks: mocks.books }));
vi.mock('@/components/admin/market/marketShared', () => ({ MARKETPLACES: [], fetchAmazonBook: vi.fn() }));

describe('Plan de lancement depuis le livre', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mocks.configured.mockReturnValue(true);
    mocks.books.mockResolvedValue([
      { id: 'guide', kind: 'ebook', title: 'Mon potager', subtitle: 'Cultiver sur un balcon', synopsis: 'Un guide de culture en pots.', genre: '' },
      { id: 'roman', kind: 'book', title: 'Le phare', subtitle: '', synopsis: '', genre: '' },
    ]);
    mocks.writing.mockResolvedValue(JSON.stringify({ semaines: [{ titre: 'Préparer', jours: [{ jour: 1, action: 'Préparer la fiche Amazon', canal: 'Amazon', duree: '30 min', texte: '' }] }], objectifs: [] }));
  });

  it('utilise titre, sous-titre et résumé du livre sans exiger de sujet', async () => {
    render(<MemoryRouter><V3KdpLancementPage /></MemoryRouter>);
    fireEvent.change(await screen.findByLabelText('Choisir un livre Ebookstudio'), { target: { value: 'ebook:guide' } });
    fireEvent.click(screen.getByRole('button', { name: 'Créer mon plan de lancement' }));
    await waitFor(() => expect(mocks.writing).toHaveBeenCalledOnce());
    const prompt = mocks.writing.mock.calls[0][0];
    expect(prompt).toContain('Titre : Mon potager');
    expect(prompt).toContain('Sous-titre : Cultiver sur un balcon');
    expect(prompt).toContain('Résumé : Un guide de culture en pots.');
    await waitFor(() => expect(JSON.parse(localStorage.getItem('v3:kdp:lancement:plans') || '[]')[0].brief.genre).toBe(''));
  });

  it('ne conserve pas les informations du livre précédent quand on change de livre', async () => {
    render(<MemoryRouter><V3KdpLancementPage /></MemoryRouter>);
    const selector = await screen.findByLabelText('Choisir un livre Ebookstudio');
    fireEvent.change(selector, { target: { value: 'ebook:guide' } });
    fireEvent.change(selector, { target: { value: 'book:roman' } });
    fireEvent.click(screen.getByRole('button', { name: 'Créer mon plan de lancement' }));
    await waitFor(() => expect(mocks.writing).toHaveBeenCalledOnce());
    expect(mocks.writing.mock.calls[0][0]).toContain('Titre : Le phare');
    expect(mocks.writing.mock.calls[0][0]).not.toContain('culture en pots');
    expect(mocks.writing.mock.calls[0][0]).not.toContain('Cultiver sur un balcon');
  });
});