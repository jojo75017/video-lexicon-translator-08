import { describe, it, expect } from 'vitest';
import { buildGuideImagePrompt, buildOutlinePrompt, parseOutline, parseChapter, stripCadratins, buildChapterPrompt } from './illustratedGuide';

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

describe('ponctuation des chapitres', () => {
  it('interdit le cadratin dans les consignes de rédaction', () => {
    expect(buildChapterPrompt({ title: 'T', subtitle: '', subject: 's', audience: '', image_style: 'photo', chapter_count: 1 }, [{ title: 'C', summary: 'x', text: '', imagePrompt: '' }], 0)).toContain('cadratin');
  });
  it('remplace le cadratin par une virgule dans le texte', () => {
    expect(stripCadratins('Choisissez un bac — jamais trop petit — et placez-le.')).toBe('Choisissez un bac, jamais trop petit, et placez-le.');
  });
  it('garde les intervalles de chiffres lisibles', () => {
    expect(stripCadratins('entre 24 – 26 °C')).toBe('entre 24 à 26 °C');
  });
  it('nettoie le texte du chapitre à l’enregistrement', () => {
    const r = parseChapter('{"text":"Le filtre — essential — tourne sans arrêt.","caption":"Un filtre — vue de dessus"}');
    expect(r.text).not.toContain('—');
    expect(r.caption).not.toContain('—');
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
