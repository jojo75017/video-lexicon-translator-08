import { describe, it, expect } from 'vitest';
import { buildGuideImagePrompt, buildOutlinePrompt, parseOutline } from './illustratedGuide';

describe('guides illustrés', () => {
  it('demande exactement le nombre de chapitres choisi', () => {
    expect(buildOutlinePrompt({ title: 'L’aquarium de A à Z', subtitle: '', subject: 'aquarium', audience: '', image_style: 'photo', chapter_count: 14 })).toContain('exactement 14 chapitres');
  });
  it('lit un sommaire JSON', () => {
    expect(parseOutline('{"chapters":[{"title":"Choisir son bac","summary":"s","imagePrompt":"bac"},{"title":""}]}')).toHaveLength(1);
  });
  it('interdit le texte dans les images', () => {
    expect(buildGuideImagePrompt('photo', 'poisson clown')).toContain('AUCUN TEXTE');
    expect(() => buildGuideImagePrompt('photo', ' ')).toThrow();
  });
});
