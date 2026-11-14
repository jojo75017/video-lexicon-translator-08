import { describe, expect, it } from 'vitest';
import { mergeWritingCharacters, restoreWritingBrief } from './bookDraftRestore';

describe('Saved book handoff to writing', () => {
  it('restores the supplied subtitle, synopsis and all 32 parts instead of legacy empty fields', () => {
    const outline = Array.from({ length: 32 }, (_, index) => ({ numero: index + 1, titre: `Partie ${index + 1}` }));
    const restored = restoreWritingBrief({ id: 'cuervo', title: "Le Fils d'El Cuervo", chapters: [], preface: '', draft_state: { brief: { subtitle: "L’Héritier du Masque", synopsis: '1842, Haute-Californie.', outline, wordsPerChapter: 2300, genre: 'Roman d’aventure historique' } } }, {});
    expect(restored.subtitle).toBe('L’Héritier du Masque');
    expect(restored.description).toBe('1842, Haute-Californie.');
    expect(restored.outline).toHaveLength(32);
    expect(restored.wordsPerChapter).toBe(2300);
    expect(restored.genre).toBe('Roman d’aventure historique');
  });
  it('retains character age and stakes during wizard editing', () => {
    const characters = mergeWritingCharacters([{ name: 'Mateo', age: '21 ans', description: 'Protéger ceux qu’il aime.' }], [{ name: 'Mateo', role: 'Héritier', traits: 'Poète le jour, audacieux la nuit.' }]);
    expect(characters[0].age).toBe('21 ans');
    expect(characters[0].description).toBe('Protéger ceux qu’il aime.');
  });
});