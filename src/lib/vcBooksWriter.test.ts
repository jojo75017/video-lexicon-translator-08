import { describe, it, expect } from 'vitest';
import { defaultPauseCount, parsePauses, VC_PAUSES_MAX } from './vcBooksWriter';

describe('VC Books writer', () => {
  it('ne dépasse jamais 200 pauses', () => {
    expect(VC_PAUSES_MAX).toBe(200);
    expect(defaultPauseCount(300)).toBe(200);
  });
  it('ignore les pauses sans titre ou texte', () => {
    const out = parsePauses('```json\n{"pauses":[{"title":"A","text":"B","encart":"C"},{"title":"","text":"x"}]}\n```');
    expect(out).toEqual([{ title: 'A', text: 'B', encart: 'C' }]);
  });
});
