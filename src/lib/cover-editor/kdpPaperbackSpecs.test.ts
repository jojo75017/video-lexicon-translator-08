import { describe, expect, it } from 'vitest';
import {
  KDP_SPINE_TEXT_MIN_PAGES,
  computePaperbackGeometry,
  defaultPaperbackConfig,
  parsePaperbackConfig,
  type KdpPaperbackConfig,
} from './kdpPaperbackSpecs';

const cfg = (patch: Partial<KdpPaperbackConfig> = {}): KdpPaperbackConfig => ({
  ...defaultPaperbackConfig(220),
  ...patch,
});

describe('KDP broché — cas 1 : 6 × 9, 220 pages, N&B papier blanc', () => {
  const { valid, geometry } = computePaperbackGeometry(cfg());

  it('est valide', () => expect(valid).toBe(true));
  it('dos = 0,49544 po', () => expect(geometry!.spineWidthIn).toBeCloseTo(0.49544, 8));
  it('largeur complète = 12,74544 po', () =>
    expect(geometry!.fullWidthIn).toBeCloseTo(12.74544, 8));
  it('hauteur complète = 9,25 po', () => expect(geometry!.fullHeightIn).toBeCloseTo(9.25, 8));
  it('300 DPI ≈ 3824 × 2775 px', () => {
    expect(geometry!.px300.fullWidth).toBe(3824);
    expect(geometry!.px300.fullHeight).toBe(2775);
  });
});

describe('KDP broché — cas 2 : 6 × 9, 220 pages, N&B papier crème', () => {
  const { valid, geometry } = computePaperbackGeometry(cfg({ paper: 'cream' }));

  it('est valide', () => expect(valid).toBe(true));
  it('dos = 0,55 po', () => expect(geometry!.spineWidthIn).toBeCloseTo(0.55, 8));
  it('largeur complète = 12,8 po', () => expect(geometry!.fullWidthIn).toBeCloseTo(12.8, 8));
  it('hauteur complète = 9,25 po', () => expect(geometry!.fullHeightIn).toBeCloseTo(9.25, 8));
  it('300 DPI = 3840 × 2775 px', () => {
    expect(geometry!.px300.fullWidth).toBe(3840);
    expect(geometry!.px300.fullHeight).toBe(2775);
  });
});

describe('Texte sur le dos', () => {
  it('79 pages : texte de dos désactivé', () => {
    const r = computePaperbackGeometry(cfg({ pageCount: 79 }));
    expect(r.valid).toBe(true);
    expect(r.geometry!.spineTextAllowed).toBe(false);
  });

  it('80 pages : texte de dos autorisé', () => {
    const r = computePaperbackGeometry(cfg({ pageCount: KDP_SPINE_TEXT_MIN_PAGES }));
    expect(r.geometry!.spineTextAllowed).toBe(true);
  });
});

describe('Limites et combinaisons', () => {
  it('refuse un nombre de pages inférieur au minimum', () => {
    const r = computePaperbackGeometry(cfg({ pageCount: 12 }));
    expect(r.valid).toBe(false);
    expect(r.issues.some((i) => i.field === 'pages')).toBe(true);
    expect(r.geometry).toBeNull();
  });

  it('refuse un nombre de pages supérieur au maximum', () => {
    const r = computePaperbackGeometry(cfg({ pageCount: 900 }));
    expect(r.valid).toBe(false);
    expect(r.issues.some((i) => i.field === 'pages')).toBe(true);
  });

  it('refuse une combinaison encre/papier interdite (couleur + crème)', () => {
    const r = computePaperbackGeometry(cfg({ ink: 'premium-color', paper: 'cream' }));
    expect(r.valid).toBe(false);
    expect(r.issues.some((i) => i.field === 'inkPaper')).toBe(true);
  });

  it('refuse un format personnalisé hors limites', () => {
    const r = computePaperbackGeometry(
      cfg({ trimId: 'custom', customTrimWidthIn: 12, customTrimHeightIn: 20 }),
    );
    expect(r.valid).toBe(false);
    expect(r.issues.filter((i) => i.field === 'trim').length).toBe(2);
  });

  it('accepte un format personnalisé dans les limites', () => {
    const r = computePaperbackGeometry(
      cfg({ trimId: 'custom', customTrimWidthIn: 7.25, customTrimHeightIn: 10.5 }),
    );
    expect(r.valid).toBe(true);
    expect(r.geometry!.fullHeightIn).toBeCloseTo(10.75, 8);
  });
});

describe('Zones et persistance', () => {
  it('quatrième | dos | première se succèdent sans trou', () => {
    const g = computePaperbackGeometry(cfg()).geometry!;
    expect(g.zones.back.xIn).toBeCloseTo(0.125, 8);
    expect(g.zones.spine.xIn).toBeCloseTo(6.125, 8);
    expect(g.zones.front.xIn).toBeCloseTo(6.62044, 8);
    expect(g.zones.front.xIn + g.zones.front.widthIn + g.bleedIn).toBeCloseTo(g.fullWidthIn, 8);
  });

  it('change le dos après modification du nombre de pages', () => {
    const before = computePaperbackGeometry(cfg({ pageCount: 220 })).geometry!.spineWidthIn;
    const after = computePaperbackGeometry(cfg({ pageCount: 300 })).geometry!.spineWidthIn;
    expect(after).toBeGreaterThan(before);
    expect(after).toBeCloseTo(300 * 0.002252, 8);
  });

  it('restaure exactement une configuration sérialisée', () => {
    const original = cfg({ pageCount: 184, ink: 'premium-color', finish: 'glossy' });
    const restored = parsePaperbackConfig(JSON.parse(JSON.stringify(original)));
    expect(restored).toEqual(original);
    expect(computePaperbackGeometry(restored).geometry!.spineWidthIn).toBeCloseTo(
      184 * 0.002347,
      8,
    );
  });

  it('ne conserve aucune URL et retombe sur les valeurs sûres', () => {
    const restored = parsePaperbackConfig({
      trimId: 6,
      pageCount: 'abc',
      ink: 'https://exemple.test/signed?token=abc',
      paper: 'plastique',
    });
    expect(restored.ink).toBe('bw');
    expect(restored.paper).toBe('white');
    expect(JSON.stringify(restored)).not.toMatch(/https?:\/\//);
  });
});
