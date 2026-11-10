import { describe, expect, it } from 'vitest';
import { savedFlipbookPages } from './flipbookPages';

describe('saved flipbook pages', () => {
  it('keeps the saved album text and illustration', () => {
    expect(savedFlipbookPages([{ title: 'Page 1', content: 'Le renard arrive.', illustration_url: '/renard.jpg' }], [])).toEqual([{ title: 'Page 1', text: 'Le renard arrive.', imageUrl: '/renard.jpg' }]);
  });
  it('matches page images but never uses a cover as an interior image', () => {
    const pages = savedFlipbookPages([{ content: 'Texte' }, { content: 'Suite' }], [{ type: 'front_cover', page: 1, url: '/cover.jpg' }, { type: 'album_page', page: 2, url: '/page2.jpg' }]);
    expect(pages[0].imageUrl).toBeUndefined();
    expect(pages[1].imageUrl).toBe('/page2.jpg');
  });
  it('does not fabricate pages for an empty manuscript', () => {
    expect(savedFlipbookPages([{}], [])).toEqual([]);
  });
});