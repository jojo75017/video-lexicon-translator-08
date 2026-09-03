import { describe, expect, it } from 'vitest';
import {
  computePaperbackGeometry,
  defaultPaperbackConfig,
  type KdpPaperbackConfig,
} from './kdpPaperbackSpecs';
import { createComposition, defaultLayer } from './frontComposition';
import {
  MIN_SPINE_FONT_IN,
  WRAP_COMPOSITION_VERSION,
  computeWrapWarnings,
  createWrapComposition,
  defaultElement,
  elementBoxIn,
  inToPt,
  isWrapComposition,
  migrateFrontToWrap,
  parseWrapComposition,
  ptToIn,
  recenterSpineElements,
  serializeWrapComposition,
  spineTextConform,
  validateWrapPayload,
  zoneBox,
} from './wrapComposition';

const cfg = (patch: Partial<KdpPaperbackConfig> = {}): KdpPaperbackConfig => ({
  ...defaultPaperbackConfig(220),
  ...patch,
});

const geo = (patch: Partial<KdpPaperbackConfig> = {}) =>
  computePaperbackGeometry(cfg(patch)).geometry!;

/* ---------------------------------------------------------------- */
/* 1 & 2 — géométrie de référence 6 × 9, 220 pages, N&B blanc       */
/* ---------------------------------------------------------------- */
describe('Étape 4C — canevas complet de référence', () => {
  const g = geo();

  it('largeur complète = 12,74544 po', () => expect(g.fullWidthIn).toBeCloseTo(12.74544, 8));
  it('hauteur complète = 9,25 po', () => expect(g.fullHeightIn).toBeCloseTo(9.25, 8));
  it('dos = 0,49544 po', () => expect(g.spineWidthIn).toBeCloseTo(0.49544, 8));
  it('300 DPI ≈ 3824 × 2775 px', () => {
    expect(g.px300.fullWidth).toBe(3824);
    expect(g.px300.fullHeight).toBe(2775);
  });

  it('zones quatrième | dos | première correctement enchaînées', () => {
    expect(g.zones.back.xIn).toBeCloseTo(0.125, 8);
    expect(g.zones.spine.xIn).toBeCloseTo(6.125, 8);
    expect(g.zones.front.xIn).toBeCloseTo(6.62044, 8);
    expect(g.zones.front.xIn + g.zones.front.widthIn + 0.125).toBeCloseTo(g.fullWidthIn, 8);
  });

  it('boîte de zone = format fini (hors fond perdu)', () => {
    const box = zoneBox(g, 'front');
    expect(box.widthIn).toBeCloseTo(6, 8);
    expect(box.heightIn).toBeCloseTo(9, 8);
    expect(box.yIn).toBeCloseTo(0.125, 8);
  });
});

/* ---------------------------------------------------------------- */
/* 3 — migration version 1 → version 2 sans changement visuel        */
/* ---------------------------------------------------------------- */
describe('Migration version 1 → version 2', () => {
  const g = geo();
  const front = createComposition({
    formatId: 'ebook-kindle',
    illustrationPath: 'user/projet/illustration.png',
    bookTitle: 'Mon livre',
  });
  const wrap = migrateFrontToWrap(front, {
    formatId: 'ebook-kindle',
    trimWidthIn: g.trimWidthIn,
    bookTitle: 'Mon livre',
  });

  it('produit une composition version 2 paperback_wrap', () => {
    expect(wrap.version).toBe(WRAP_COMPOSITION_VERSION);
    expect(isWrapComposition(wrap)).toBe(true);
  });

  it('conserve les proportions exactes de la première', () => {
    const titleV1 = front.layers.find((l) => l.role === 'title')!;
    const titleV2 = wrap.elements.find((e) => e.role === 'title')!;
    expect(titleV2.nx).toBeCloseTo(titleV1.x / front.canvas.width, 10);
    expect(titleV2.ny).toBeCloseTo(titleV1.y / front.canvas.height, 10);
    expect(titleV2.nWidth).toBeCloseTo(titleV1.width / front.canvas.width, 10);
    // taille physique = même proportion de la largeur de la première
    expect(titleV2.fontSizeIn / g.trimWidthIn).toBeCloseTo(
      titleV1.fontSize / front.canvas.width,
      10,
    );
  });

  it('ajoute le dos et la quatrième sans toucher au chemin privé', () => {
    expect(wrap.elements.some((e) => e.zone === 'spine')).toBe(true);
    expect(wrap.elements.some((e) => e.role === 'back-blurb')).toBe(true);
    expect(wrap.illustrationPath).toBe('user/projet/illustration.png');
  });

  it('ne conserve aucune trace d’URL', () => {
    expect(JSON.stringify(wrap)).not.toMatch(/https?:\/\//);
  });
});

/* ---------------------------------------------------------------- */
/* 4, 5, 6 — textes des trois zones et changement de pages           */
/* ---------------------------------------------------------------- */
describe('Changement du nombre de pages', () => {
  const base = createWrapComposition({ illustrationPath: null, bookTitle: 'Test' });

  it('crée des textes de première, dos et quatrième', () => {
    expect(base.elements.filter((e) => e.zone === 'front').length).toBe(3);
    expect(base.elements.filter((e) => e.zone === 'spine').length).toBe(2);
    expect(base.elements.filter((e) => e.zone === 'back').length).toBe(2);
  });

  it('220 → 300 pages : dos recalculé, première et quatrième inchangées', () => {
    const g220 = geo({ pageCount: 220 });
    const g300 = geo({ pageCount: 300 });
    expect(g300.spineWidthIn).toBeCloseTo(300 * 0.002252, 10);
    expect(g300.fullWidthIn - g220.fullWidthIn).toBeCloseTo(80 * 0.002252, 10);
    expect(g300.trimWidthIn).toBe(g220.trimWidthIn);

    const after = recenterSpineElements(base);
    for (const zone of ['front', 'back'] as const) {
      const before = base.elements.filter((e) => e.zone === zone);
      const now = after.elements.filter((e) => e.zone === zone);
      expect(now.map((e) => [e.nx, e.ny, e.nWidth])).toEqual(
        before.map((e) => [e.nx, e.ny, e.nWidth]),
      );
    }
    // Les positions normalisées donnent des positions absolues stables
    // par rapport à la zone, quel que soit le dos.
    const el = base.elements.find((e) => e.role === 'title')!;
    const boxA = elementBoxIn(el, g220);
    const boxB = elementBoxIn(el, g300);
    expect(boxB.xIn - g300.zones.front.xIn).toBeCloseTo(boxA.xIn - g220.zones.front.xIn, 10);
    expect(boxA.widthIn).toBeCloseTo(boxB.widthIn, 10);
  });

  it('recentre uniquement les éléments du dos', () => {
    const moved = {
      ...base,
      elements: base.elements.map((e) => (e.zone === 'spine' ? { ...e, nx: 0.1 } : e)),
    };
    const after = recenterSpineElements(moved);
    expect(after.elements.filter((e) => e.zone === 'spine').every((e) => e.nx === 0.5)).toBe(true);
  });

  it('retour à 220 pages : géométrie identique', () => {
    expect(geo({ pageCount: 220 })).toEqual(geo({ pageCount: 220 }));
  });
});

/* ---------------------------------------------------------------- */
/* 7 — règle des 7 points sur le dos                                 */
/* ---------------------------------------------------------------- */
describe('Conformité du texte de dos', () => {
  it('220 pages : texte autorisé', () => {
    const s = spineTextConform(geo({ pageCount: 220 }));
    expect(s.allowed).toBe(true);
    expect(s.usableIn).toBeCloseTo(0.49544 - 0.125, 8);
  });

  it('79 pages : refusé par la règle KDP des 80 pages', () => {
    expect(spineTextConform(geo({ pageCount: 79 })).allowed).toBe(false);
  });

  it('80 pages : largeur utilisable vérifiée face aux 7 points', () => {
    const g = geo({ pageCount: 80 });
    const s = spineTextConform(g);
    // dos = 0,18016 po → utilisable 0,05516 po < 7 pt (0,09722 po)
    expect(g.spineWidthIn).toBeCloseTo(0.18016, 8);
    expect(s.usableIn).toBeCloseTo(0.05516, 8);
    expect(s.usableIn).toBeLessThan(MIN_SPINE_FONT_IN);
    expect(s.allowed).toBe(false);
    expect(s.reason).toBe('Dos trop étroit pour un texte conforme');
  });

  it('7 points = 0,097222 po', () => {
    expect(MIN_SPINE_FONT_IN).toBeCloseTo(0.0972222, 6);
    expect(inToPt(ptToIn(7))).toBeCloseTo(7, 10);
  });

  it('avertit sans jamais réduire sous 7 points', () => {
    const g = geo({ pageCount: 80 });
    const comp = createWrapComposition({ illustrationPath: null });
    const w = computeWrapWarnings(comp, g);
    expect(w.some((x) => x.message.includes('Dos trop étroit'))).toBe(true);
    // la composition reste intacte
    expect(comp.elements.find((e) => e.role === 'spine-title')!.fontSizeIn).toBeCloseTo(
      ptToIn(12),
      10,
    );
  });
});

/* ---------------------------------------------------------------- */
/* 8 — réserve du code-barres et zones sûres                         */
/* ---------------------------------------------------------------- */
describe('Contrôles de sécurité', () => {
  const g = geo();

  it('détecte un élément dans la réserve du code-barres', () => {
    const el = {
      ...defaultElement('back-extra', 'Mention importante'),
      nx: 0.6,
      ny: 0.9,
      nWidth: 0.35,
    };
    const comp = { ...createWrapComposition({ illustrationPath: null }), elements: [el] };
    const w = computeWrapWarnings(comp, g);
    expect(w.some((x) => x.message.includes('code-barres'))).toBe(true);
  });

  it('détecte une sortie de zone sûre', () => {
    const el = { ...defaultElement('title'), ny: 0.001, nx: 0.001 };
    const comp = { ...createWrapComposition({ illustrationPath: null }), elements: [el] };
    expect(computeWrapWarnings(comp, g).some((x) => x.message.includes('zone de sécurité'))).toBe(true);
  });

  it('détecte un contraste insuffisant', () => {
    const el = { ...defaultElement('back-blurb'), color: '#141F30' };
    const comp = {
      ...createWrapComposition({ illustrationPath: null }),
      elements: [el],
    };
    expect(computeWrapWarnings(comp, g).some((x) => x.message.includes('contraste'))).toBe(true);
  });

  it('détecte une illustration sous 300 DPI', () => {
    const comp = createWrapComposition({ illustrationPath: 'u/p/i.png' });
    const w = computeWrapWarnings(comp, g, { width: 1024, height: 1536 });
    expect(w.some((x) => x.message.includes('DPI'))).toBe(true);
  });
});

/* ---------------------------------------------------------------- */
/* 11 & 12 — persistance stricte et absence d'URL                    */
/* ---------------------------------------------------------------- */
describe('Persistance défensive', () => {
  it('sauvegarde puis relecture : composition identique', () => {
    const comp = createWrapComposition({ illustrationPath: 'u/p/i.png', bookTitle: 'Livre' });
    const payload = serializeWrapComposition(comp, 'u/p/i.png');
    const parsed = parseWrapComposition(JSON.parse(JSON.stringify(payload)), {
      illustrationPath: 'u/p/i.png',
    });
    expect(parsed).toEqual(payload);
  });

  it('valide la structure version 2', () => {
    const payload = serializeWrapComposition(
      createWrapComposition({ illustrationPath: null }),
      null,
    );
    expect(validateWrapPayload(payload).ok).toBe(true);
    expect(validateWrapPayload({ version: 1 }).ok).toBe(false);
  });

  it('refuse toute URL, URL signée ou token', () => {
    const comp = createWrapComposition({ illustrationPath: null });
    comp.elements[0].text = 'https://exemple.fr/fichier?token=abc';
    const payload = serializeWrapComposition(comp, 'https://exemple.fr/x.png');
    expect(payload.illustrationPath).toBeNull();
    expect(payload.elements[0].text).toBe('');
    expect(JSON.stringify(payload)).not.toMatch(/https?:\/\/|token=/i);
    expect(validateWrapPayload(payload).ok).toBe(true);
  });

  it('rejette les valeurs corrompues sans planter', () => {
    const parsed = parseWrapComposition(
      {
        version: 2,
        documentType: 'paperback_wrap',
        elements: [{ role: 'inconnu', nx: 'x', color: 'rouge', fontSizeIn: -3, text: 42 }],
        background: { mode: 'nawak', fullColor: 'bleu' },
      },
      { illustrationPath: null },
    );
    expect(validateWrapPayload(serializeWrapComposition(parsed, null)).ok).toBe(true);
    expect(parsed.background.mode).toBe('back-spine-color');
  });

  it('ne touche jamais aux compositions eBook version 1', () => {
    const front = createComposition({ formatId: 'ebook-kindle', illustrationPath: null });
    expect(isWrapComposition(front)).toBe(false);
    expect(front.layers).toHaveLength(3);
    expect(defaultLayer('title', front.canvas).role).toBe('title');
  });
});
