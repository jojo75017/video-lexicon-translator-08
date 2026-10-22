import { describe, expect, it } from 'vitest';
import { buildVCImagePrompt, type VCImageBrief } from './vcBooksImages';

const brief: VCImageBrief = { kind: 'cover', scene: 'Un poulpe curieux avec un livre', title: 'Curiosités', subtitle: '', author: 'Georges', withText: false };
describe('VC Books image brief', () => {
  it('rejects an empty scene instead of requesting invented artwork', () => {
    expect(() => buildVCImagePrompt({ ...brief, scene: ' ' })).toThrow();
  });
  it('requires a title when cover typography is requested', () => {
    expect(() => buildVCImagePrompt({ ...brief, withText: true, title: '' })).toThrow();
  });
  it('uses monochrome and no typography for interior illustrations', () => {
    const prompt = buildVCImagePrompt({ ...brief, kind: 'interior', withText: false });
    expect(prompt).toContain('noir et blanc uniquement');
    expect(prompt).toContain('AUCUN TEXTE');
  });
});