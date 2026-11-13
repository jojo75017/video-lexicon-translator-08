import { describe, it, expect } from 'vitest';
import { wrapGeometry } from './paperbackWrapPdf';
describe('wrapGeometry KDP', () => {
  it('6x9, 200 pages blanc : dos 0,4504 po, largeur 12,7004 po', () => {
    const g = wrapGeometry('6x9', 200, 'blanc');
    expect(g.spine).toBeCloseTo(0.4504, 4); expect(g.width).toBeCloseTo(12.7004, 4); expect(g.height).toBeCloseTo(9.25, 4);
  });
  it('texte sur le dos seulement à partir de 79 pages', () => {
    expect(wrapGeometry('6x9', 78, 'creme').spineText).toBe(false);
    expect(wrapGeometry('6x9', 79, 'creme').spineText).toBe(true);
  });
});
