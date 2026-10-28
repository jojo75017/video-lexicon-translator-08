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

import { buildSheetPrompt, parseSheet } from './illustratedGuide';
describe('fiche remplie par l’IA depuis le titre', () => {
  it('demande une description d’environ 150 mots et 3 catégories', () => {
    const p = buildSheetPrompt('L’aquarium de A à Z');
    expect(p).toContain('150 mots');
    expect(p).toContain('3 catégories');
  });
  it('refuse une fiche sans description', () => {
    expect(() => parseSheet('{"subtitle":"x","description":""}')).toThrow();
  });
});

import { isTransientOverload } from './illustratedGuide';
describe('surcharge du moteur IA', () => {
  it('relance seulement les surcharges temporaires', () => {
    expect(isTransientOverload('This model is currently experiencing high demand. Please try again later.')).toBe(true);
    expect(isTransientOverload('Clé API invalide')).toBe(false);
  });
});
