import { describe, expect, it } from 'vitest';
import { fitArtwork, studioCoverSize } from './studioCoverLayout';
import { wrapGeometry } from './paperbackWrapPdf';

describe('Studio album carré', () => {
  it('uses a square canvas for albums', () => expect(studioCoverSize('album')).toEqual({ width: 1600, height: 1600 }));
  it('keeps the existing Kindle size', () => expect(studioCoverSize('kindle')).toEqual({ width: 1600, height: 2560 }));
  it('preserves the entire portrait when imported into a square', () => expect(fitArtwork(1600, 2560, 1600, 1600)).toEqual({ x: 300, y: 0, width: 1000, height: 1600 }));
  it('provides the album trim at 8.5 inches square', () => {
    const geometry = wrapGeometry('8.5x8.5', 54, 'couleur');
    expect(geometry.tw).toBe(8.5);
    expect(geometry.th).toBe(8.5);
  });
});