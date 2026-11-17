import { describe, expect, it } from 'vitest';
import { sanitizeEditorialContent, buildContinuityMemory } from './editorialSanitizer';

describe('filtre éditorial', () => {
  it('retire les mentions ACTE et Partie', () => {
    expect(sanitizeEditorialContent('ACTE I\nMateo avance.\nPartie 2 : la grotte\nIl s’arrête.')).toBe('Mateo avance.\nIl s’arrête.');
  });
  it('retire les balises non remplacées', () => {
    expect(sanitizeEditorialContent('Écrit par [Nom de l\'auteur].')).toBe('Écrit par.');
  });
  it('retire les consignes IA entre parenthèses', () => {
    expect(sanitizeEditorialContent('Il fuit. (Note : ajouter une scène de tension ici) Elle suit.')).toBe('Il fuit. Elle suit.');
  });
  it('supprime tout tiret cadratin et demi-cadratin', () => {
    const out = sanitizeEditorialContent('— Viens, dit-il.\nLa nuit – froide – tombait.');
    expect(out).not.toMatch(/[—–]/);
  });
  it('la mémoire garde la fin du chapitre précédent', () => {
    const txt = 'Début du chapitre. ' + 'x '.repeat(1000) + 'Diego découvre la grotte.';
    expect(buildContinuityMemory(txt)).toContain('Diego découvre la grotte.');
    expect(buildContinuityMemory(txt)).not.toContain('Début du chapitre');
  });
});
