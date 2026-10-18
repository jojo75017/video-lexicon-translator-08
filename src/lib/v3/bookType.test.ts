import { describe, it, expect } from 'vitest';
import { isFictionType, looksLikeFictionOutline, outlineRulesFor } from './bookType';
import { findAvatarCategory } from '@/data/v3BookAvatars';

describe('type de livre', () => {
  it('seul le roman est une fiction', () => {
    expect(isFictionType('roman')).toBe(true);
    expect(isFictionType('guide')).toBe(false);
  });
  it('le guide interdit personnages et intrigue dans le sommaire', () => {
    expect(outlineRulesFor('guide')).toContain('aucun personnage');
    expect(outlineRulesFor('roman')).toBe('');
  });
  it('refuse un sommaire romanesque', () => {
    expect(looksLikeFictionOutline(['L’appel de Montferrand', 'La première fissure', 'La promesse brisée'])).toBe(true);
    expect(looksLikeFictionOutline(['Choisir l’emplacement', 'Préparer la terre', 'Réussir les semis'])).toBe(false);
  });
  it('au moins 3 personas par spécialité', () => {
    for (const c of ['Jardinage, Potager & Nature', 'Maison, Bricolage & Rénovation', 'Maison, Cuisine & Équipements', 'Voyages, Tourisme & Découvertes', 'Aquariophilie & Poissons d’eau douce']) {
      expect(findAvatarCategory(c)?.avatars.length).toBeGreaterThanOrEqual(3);
    }
  });
});
