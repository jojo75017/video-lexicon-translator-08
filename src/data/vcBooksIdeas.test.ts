import { describe, expect, it } from 'vitest';
import {
  formatVCBookCategories,
  parseVCBookCategories,
  VC_BOOKS_CATEGORIES,
  VC_BOOKS_TITLE_IDEAS,
} from './vcBooksIdeas';

describe('vcBooksIdeas', () => {
  it('propose au moins 10 idées de titres avec sous-titre', () => {
    expect(VC_BOOKS_TITLE_IDEAS.length).toBeGreaterThanOrEqual(10);
    for (const idea of VC_BOOKS_TITLE_IDEAS) {
      expect(idea.title.trim().length).toBeGreaterThan(3);
      expect(idea.subtitle.trim().length).toBeGreaterThan(3);
    }
  });

  it('contient l’idée de records absurdes en premier', () => {
    expect(VC_BOOKS_TITLE_IDEAS[0].title).toBe('Le Grand Livre des records absurdes');
    expect(VC_BOOKS_TITLE_IDEAS[0].subtitle).toBe('Des records véridiques qui font sourire');
  });

  it('propose les catégories KDP attendues', () => {
    expect(VC_BOOKS_CATEGORIES).toContain('Humour pour enfants');
    expect(VC_BOOKS_CATEGORIES).toContain('Curiosités et faits étonnants');
    expect(VC_BOOKS_CATEGORIES.length).toBeGreaterThanOrEqual(8);
  });

  it('sait lire et réécrire les catégories enregistrées', () => {
    expect(parseVCBookCategories('Humour pour enfants, Records et choses incroyables')).toEqual([
      'Humour pour enfants',
      'Records et choses incroyables',
    ]);
    expect(parseVCBookCategories(null)).toEqual([]);
    expect(formatVCBookCategories(['A', 'B'])).toBe('A, B');
  });
});
