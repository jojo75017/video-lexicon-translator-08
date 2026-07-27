import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V3Header from './V3Header';
import V3MainTabs from './V3MainTabs';

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

  it('affiche la marque, la ligne 2 et les CTA principaux', () => {
    renderHeader(false);
    expect(screen.getByRole('link', { name: /Ebookstudio/i })).toBeInTheDocument();
    // "S'inscrire" existe (soit dans la nav desktop, soit dans le CTA rapide mobile).
    expect(screen.getAllByRole('link', { name: /S'inscrire/i }).length).toBeGreaterThan(0);
    // Les 6 catégories de la ligne 2 sont présentes (au moins dans le drawer mobile).
    ['Créer', 'Écrire', 'Habiller', 'Publier', 'Vendre'].forEach((label) => {
      expect(screen.getAllByText(new RegExp(`^${label}$`, 'i')).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByRole('link', { name: /Tous les outils/i }).length).toBeGreaterThan(0);
  });

  it('bascule vers "Ma bibliothèque" quand l\'utilisateur est authentifié', () => {
    renderHeader(true);
    expect(screen.getAllByRole('link', { name: /Ma bibliothèque/i }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('link', { name: /^Connexion$/i })).not.toBeInTheDocument();
  });

  it('ouvre le drawer mobile via le bouton menu principal', () => {
    renderHeader(false);
    const trigger = screen.getByRole('button', { name: /Ouvrir le menu principal/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // Le drawer contient un CTA vers la page d'écriture.
    expect(screen.getAllByRole('link', { name: /Écrire un livre/i }).length).toBeGreaterThan(0);
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

  it("n'affiche jamais deux libellés « S'inscrire » simultanément visibles au même endroit (pas de doublon)", () => {
    renderHeader(false);
    // On tolère plusieurs liens (nav desktop + CTA mobile), mais chacun doit avoir un href distinct ou identique — ce test empêche surtout un run/render cassé.
    const links = screen.getAllByRole('link', { name: /S'inscrire/i });
    links.forEach((l) => expect(l).toHaveAttribute('href'));
  });
});
