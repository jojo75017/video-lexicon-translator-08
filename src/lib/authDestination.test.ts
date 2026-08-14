import { describe, expect, it, vi } from 'vitest';
import { getAuthenticatedHomePath, getHomePath } from './authDestination';

describe('auth destination policy', () => {
  it('keeps routing pending until the role check finishes', () => {
    expect(getHomePath('pending')).toBeNull();
  });

  it('sends administrators only to the admin dashboard', () => {
    expect(getHomePath('admin')).toBe('/admin');
  });

  it('keeps subscribers in V3 and visitors on the public offer', () => {
    expect(getHomePath('subscriber')).toBe('/v3');
    expect(getHomePath('visitor')).toBe('/commander');
  });

  it('checks the backend role before resolving a signed-in destination', async () => {
    expect(await getAuthenticatedHomePath(vi.fn().mockResolvedValue(true))).toBe('/admin');
    expect(await getAuthenticatedHomePath(vi.fn().mockResolvedValue(false))).toBe('/v3');
  });
});