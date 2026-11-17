import { describe, it, expect } from 'vitest';
import { applyEditorialPatches } from './editorialCorrections';

describe('corrections éditoriales validées', () => {
  it('ne change que le passage choisi et conserve les chapitres et métadonnées', () => {
    const original = [{ title: 'Découverte', content: 'Il trouve la grotte.', id: 'a' }, { titre: 'Retour', contenu: 'Il découvre encore la grotte.', id: 'b' }];
    const result = applyEditorialPatches(original, [{ chapitre: 2, extrait: 'découvre encore', remplacement: 'retourne dans' }]);
    expect(result).toEqual([original[0], { titre: 'Retour', contenu: 'Il retourne dans la grotte.', id: 'b' }]);
    expect(original[1].contenu).toBe('Il découvre encore la grotte.');
  });
  it('refuse une citation répétée plutôt que modifier le mauvais passage', () => {
    expect(() => applyEditorialPatches([{ content: 'La grotte. La grotte.' }], [{ chapitre: 1, extrait: 'La grotte.', remplacement: 'Le refuge.' }])).toThrow('ambigu');
  });
  it('refuse les citations absentes, les chapitres inexistants et les remplacements vides', () => {
    for (const patch of [{ chapitre: 1, extrait: 'absent', remplacement: 'texte' }, { chapitre: 8, extrait: 'texte', remplacement: 'suite' }, { chapitre: 1, extrait: 'texte', remplacement: '' }]) {
      expect(() => applyEditorialPatches([{ content: 'texte' }], [patch])).toThrow();
    }
  });
  it('refuse les corrections qui se chevauchent', () => {
    expect(() => applyEditorialPatches([{ content: 'Il découvre la grotte.' }], [{ chapitre: 1, extrait: 'découvre la grotte', remplacement: 'retourne au refuge' }, { chapitre: 1, extrait: 'la grotte', remplacement: 'le refuge' }])).toThrow();
  });
});