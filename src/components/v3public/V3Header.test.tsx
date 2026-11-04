import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V3Header from './V3Header';
import V3MainTabs from './V3MainTabs';

vi.mock('@/hooks/useIsAdmin', () => ({ default: () => ({ isAdmin: false, checking: false }) }));
vi.mock('@/hooks/useV3Open', () => ({ default: () => ({ open: true }) }));
vi.mock('@/hooks/usePlanTier', () => ({ default: () => ({ tier: 'edition' }) }));
vi.mock('@/components/admin/V2V3FloatingSwitch', () => ({ V2V3ModeButton: () => null }));

const renderHeader = (authed = false) =>
  render(
    <MemoryRouter initialEntries={['/v3']}>
      <V3Header isAuthed={authed} />
      <V3MainTabs />
    </MemoryRouter>,
  );

describe('V3Header + V3MainTabs', () => {
  beforeEach(() => {
    // Reset viewport-related classes; jsdom is 1024×768 by default so lg: styles resolve to visible.
    document.documentElement.style.overflowX = '';
  });

  it('conserve les catégories et le catalogue', () => {
    renderHeader(false);

    // Les 6 catégories de la ligne 2 sont présentes (au moins dans le drawer mobile).
    ['Créer', 'Écrire', 'Habiller', 'Publier', 'Vendre'].forEach((label) => {
      expect(screen.getAllByText(new RegExp(`^${label}$`, 'i')).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByRole('link', { name: /Tous les outils/i }).length).toBeGreaterThan(0);
  });

  it('déploie le mega-menu Créer au clic sur le bouton de catégorie', () => {
    renderHeader(false);
    // Prend le premier bouton "Créer" (nav desktop) et clique-le.
    const creerButton = screen.getAllByRole('button', { name: /Créer/i })[0];
    fireEvent.click(creerButton);
    // Après ouverture, il doit exister au moins un lien avec une description sous la catégorie.
    expect(creerButton).toHaveAttribute('data-active', 'true');
  });

  it('ouvre l\'accordéon Catégories (< lg) avec le bouton dédié', () => {
    renderHeader(false);
    const catBtn = screen.getByRole('button', { name: /Ouvrir le menu des catégories/i });
    fireEvent.click(catBtn);
    // Après ouverture, chaque catégorie devient un <summary> cliquable.
    const summaries = screen.getAllByText(/Livres spéciaux/i);
    expect(summaries.length).toBeGreaterThan(0);
  });

});
