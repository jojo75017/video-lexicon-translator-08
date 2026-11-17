import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import KdpBookChecklist from './KdpBookChecklist';

afterEach(() => { cleanup(); localStorage.clear(); });
const show = (revision = 'first', userId = 'owner') => {
  render(<MemoryRouter><KdpBookChecklist bookId="book-8" userId={userId} revision={revision} onRead={vi.fn()} onExport={vi.fn()} /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /Préparation Amazon KDP/ }));
};
describe('validations KDP personnelles', () => {
  it('conserve les quatre validations pour ce compte et ce livre uniquement', () => {
    show();
    const checks = screen.getAllByRole('checkbox');
    expect(checks).toHaveLength(4);
    fireEvent.click(checks[0]);
    cleanup(); show();
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked();
    cleanup(); show('first', 'other-owner');
    expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();
  });
  it('remet les validations à vérifier après modification du livre', () => {
    show(); fireEvent.click(screen.getAllByRole('checkbox')[0]);
    cleanup(); show('new-revision');
    expect(screen.getAllByRole('checkbox').every(c => !(c as HTMLInputElement).checked)).toBe(true);
  });
  it('ouvre la fiche et le pack du livre choisi sans génération', () => {
    show();
    expect(screen.getByRole('link', { name: 'Ouvrir la fiche Amazon' })).toHaveAttribute('href', '/v3/donnees-kdp?projectId=book-8');
    expect(screen.getByRole('link', { name: 'Ouvrir le Pack KDP' })).toHaveAttribute('href', '/v3/donnees-kdp?projectId=book-8#pack-kdp');
  });
});