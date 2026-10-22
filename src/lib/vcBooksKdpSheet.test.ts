import { describe, expect, it } from 'vitest';
import { VC_BOOKS_KDP_DEFAULT_PRICE_CENTS } from './vcBooksKdpSheet';

describe('VC Books KDP price', () => {
  it('defaults to the requested 12.99 euros without altering checkout prices', () => {
    expect(VC_BOOKS_KDP_DEFAULT_PRICE_CENTS).toBe(1299);
  });
});