import { describe, it, expect } from 'vitest';
import { V3_EXTRA_CATEGORIES, findAvatarCategory } from './v3BookAvatars';

describe('5 spécialités ajoutées', () => {
  const expected: Record<string, string> = {
    'Maison, Bricolage & Rénovation': 'expert-bricolage',
    'Jardinage, Potager & Nature': 'expert-jardinage',
    'Maison, Cuisine & Équipements': 'expert-maison-cuisine',
    'Voyages, Tourisme & Découvertes': 'expert-voyages',
    'Aquariophilie & Poissons d’eau douce': 'expert-aquariophilie',
  };
  it('chaque catégorie présélectionne son expert', () => {
    expect(V3_EXTRA_CATEGORIES).toHaveLength(5);
    for (const c of V3_EXTRA_CATEGORIES) expect(findAvatarCategory(c)?.avatars[0].id).toBe(expected[c]);
  });
  it('les anciennes catégories gardent leur univers', () => {
    expect(findAvatarCategory('Voyage / Guide')?.id).toBe('carnets');
    expect(findAvatarCategory('Cuisine / Recettes')?.id).not.toBe('maison-cuisine');
    expect(findAvatarCategory('Romance')?.id).toBe('romance');
  });
});
