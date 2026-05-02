import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  OFFRES_UI_VERSION,
  OFFRES_VERSION_KEY,
  purgeLegacyOffresCache,
} from "./offresCachePurge";

/**
 * Sets up a mocked window.location whose `replace` we can spy on.
 * jsdom's Location is read-only for `replace`, so we redefine it.
 */
const setupLocation = (href: string) => {
  const url = new URL(href);
  const replace = vi.fn((next: string) => {
    const nextUrl = new URL(next);
    Object.defineProperty(window.location, "href", {
      configurable: true,
      value: nextUrl.toString(),
    });
    Object.defineProperty(window.location, "search", {
      configurable: true,
      value: nextUrl.search,
    });
  });
  Object.defineProperty(window, "location", {
    configurable: true,
    value: {
      href: url.toString(),
      pathname: url.pathname,
      search: url.search,
      origin: url.origin,
      replace,
    },
  });
  return { replace };
};

const installCachesMock = () => {
  const deleteSpy = vi.fn().mockResolvedValue(true);
  const cachesMock = {
    keys: vi.fn().mockResolvedValue(["old-cache-v1", "offres-banners-v2"]),
    delete: deleteSpy,
  };
  Object.defineProperty(window, "caches", {
    configurable: true,
    value: cachesMock,
  });
  return { cachesMock, deleteSpy };
};

const installServiceWorkerMock = () => {
  const unregister = vi.fn().mockResolvedValue(true);
  const getRegistrations = vi.fn().mockResolvedValue([{ unregister }]);
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: { getRegistrations },
  });
  return { unregister, getRegistrations };
};

describe("purgeLegacyOffresCache (anti-cache /offres)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("does nothing when not on /offres", async () => {
    const { replace } = setupLocation("https://app.test/dashboard");
    const result = await purgeLegacyOffresCache();
    expect(result).toBe(false);
    expect(replace).not.toHaveBeenCalled();
    expect(localStorage.getItem(OFFRES_VERSION_KEY)).toBeNull();
  });

  it("purges caches and reloads with ?ui= when stored version is outdated", async () => {
    localStorage.setItem(OFFRES_VERSION_KEY, "offres-banners-v1-legacy");
    const { replace } = setupLocation("https://app.test/offres");
    const { deleteSpy, cachesMock } = installCachesMock();
    const { unregister, getRegistrations } = installServiceWorkerMock();

    const result = await purgeLegacyOffresCache();

    expect(result).toBe(true);
    expect(getRegistrations).toHaveBeenCalledTimes(1);
    expect(unregister).toHaveBeenCalledTimes(1);
    expect(cachesMock.keys).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith("old-cache-v1");
    expect(deleteSpy).toHaveBeenCalledWith("offres-banners-v2");
    expect(localStorage.getItem(OFFRES_VERSION_KEY)).toBe(OFFRES_UI_VERSION);

    expect(replace).toHaveBeenCalledTimes(1);
    const target = new URL(replace.mock.calls[0][0] as string);
    expect(target.pathname).toBe("/offres");
    expect(target.searchParams.get("ui")).toBe(OFFRES_UI_VERSION);
  });

  it("simulates a UI version bump: a fresh visitor on the new variant does NOT reload again", async () => {
    // First visit: legacy -> triggers purge + reload
    localStorage.setItem(OFFRES_VERSION_KEY, "offres-banners-v1-legacy");
    const first = setupLocation("https://app.test/offres");
    installCachesMock();
    installServiceWorkerMock();
    await purgeLegacyOffresCache();
    expect(first.replace).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(OFFRES_VERSION_KEY)).toBe(OFFRES_UI_VERSION);

    // Second visit (after reload): version is now current -> no-op, no stacked reloads
    const second = setupLocation(
      `https://app.test/offres?ui=${OFFRES_UI_VERSION}`,
    );
    const result = await purgeLegacyOffresCache();
    expect(result).toBe(false);
    expect(second.replace).not.toHaveBeenCalled();
  });

  it("does not loop: skips reload when ?ui= already matches current version", async () => {
    // Stored version is stale, but URL already carries the current ui marker.
    // The function still records the new version, but must NOT call replace again.
    localStorage.setItem(OFFRES_VERSION_KEY, "offres-banners-v1-legacy");
    const { replace } = setupLocation(
      `https://app.test/offres?ui=${OFFRES_UI_VERSION}`,
    );
    installCachesMock();
    installServiceWorkerMock();

    const result = await purgeLegacyOffresCache();

    expect(result).toBe(false);
    expect(replace).not.toHaveBeenCalled();
    expect(localStorage.getItem(OFFRES_VERSION_KEY)).toBe(OFFRES_UI_VERSION);
  });
});
