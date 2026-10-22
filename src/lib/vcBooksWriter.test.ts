import { describe, it, expect } from 'vitest';
import { defaultPauseCount, parsePauses, VC_PAUSES_MAX } from './vcBooksWriter';

describe('VC Books writer', () => {
  it('ne dépasse jamais 200 pauses', () => {
    expect(VC_PAUSES_MAX).toBe(200);
    expect(defaultPauseCount(300)).toBe(200);
  });
  it('ignore les pauses sans titre ou texte', () => {
    const out = parsePauses('```json\n{"pauses":[{"title":"A","text":"B","encart":"C"},{"title":"","text":"x"}]}\n```');
    expect(out).toMatchObject([{ title: 'A', text: 'B', encart: 'C' }]);
  });
});

import { pauseKind } from './vcBooksWriter';
import { buildVCBlocks } from './vcBooksExport';
describe('VC Books modèle Petit Cabinet', () => {
  it('60 % de curiosités puis des jeux', () => {
    expect(pauseKind(59, 100)).toBe('curiosite');
    expect(pauseKind(60, 100)).toBe('jeu');
  });
  it('numérote PAUSE 001 / 100 et regroupe les réponses par dix', () => {
    const pauses = Array.from({ length: 100 }, (_, i) => ({ title: `T${i}`, text: 'a', encart: 'e', question: 'q', answer: `r${i}` }));
    const blocks = buildVCBlocks({ title: 'L', subtitle: '', author_name: 'G', format: '6x9', pauses });
    const texts = blocks.map((b) => ('text' in b ? b.text : ''));
    expect(texts).toContain('PAUSE 001 / 100');
    expect(texts).toContain('Les réponses de 91 à 100');
    expect(texts).toContain('Réponse 61 dans la partie Réponses.');
  });
});
