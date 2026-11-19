import { describe, it, expect } from 'vitest';
import { detectBookSiteTheme, slugifyTitle } from './themes';

describe('book site themes', () => {
  it('polar gets the detective theme', () => expect(detectBookSiteTheme('Un polar breton')).toBe('policier'));
  it('thriller gets the dark theme', () => expect(detectBookSiteTheme('Un thriller haletant')).toBe('sombre'));
  it('western gets the western theme', () => expect(detectBookSiteTheme('Le Fils d El Cuervo')).toBe('western'));
  it('romance gets the romance theme', () => expect(detectBookSiteTheme('Une romance d été')).toBe('doux'));
  it('children book gets the soft theme', () => expect(detectBookSiteTheme('Conte pour enfants')).toBe('jeunesse'));
  it('guide gets the light theme', () => expect(detectBookSiteTheme('Guide pratique du jardin')).toBe('clair'));
  it('novel gets the literary theme', () => expect(detectBookSiteTheme('Une saga familiale, roman')).toBe('litteraire'));
  it('unknown category is never dark', () => expect(detectBookSiteTheme('Recueil')).toBe('clair'));
  it('slug never takes el-cuervo', () => expect(slugifyTitle('El Cuervo')).not.toBe('el-cuervo'));
  it('slug strips accents', () => expect(slugifyTitle('Le Phare de Kerlann')).toBe('le-phare-de-kerlann'));
});
