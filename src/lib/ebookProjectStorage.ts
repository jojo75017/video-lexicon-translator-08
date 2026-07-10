// Simple project saver for the Scolaire & Agenda generators.
// Small payloads are mirrored in localStorage; large autosaves also use
// IndexedDB so long manuscripts do not disappear when localStorage quota is hit.

export interface SavedProject<T> {
  id: string;
  name: string;
  updatedAt: number;
  data: T;
}

const key = (scope: string) => `ebookstudio_projects_${scope}`;
const DB_NAME = 'ebookstudio_native_storage';
const DB_VERSION = 1;
const AUTOSAVE_STORE = 'autosaves';

interface AutosaveEnvelope<T> {
  updatedAt: number;
  data: T;
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

const canUseIndexedDb = () => typeof window !== 'undefined' && 'indexedDB' in window;

const openNativeDb = (): Promise<IDBDatabase | null> => {
  if (!canUseIndexedDb()) return Promise.resolve(null);
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(AUTOSAVE_STORE)) {
        db.createObjectStore(AUTOSAVE_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  });

  return dbPromise;
};

const writeNativeAutosave = async <T,>(scope: string, data: T) => {
  try {
    const db = await openNativeDb();
    if (!db) return;
    const envelope: AutosaveEnvelope<T> = { updatedAt: Date.now(), data };
    await new Promise<void>((resolve) => {
      const tx = db.transaction(AUTOSAVE_STORE, 'readwrite');
      tx.objectStore(AUTOSAVE_STORE).put(envelope, autoKey(scope));
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  } catch {}
};

export const requestPersistentStorage = async (): Promise<boolean> => {
  try {
    if (typeof navigator === 'undefined' || !navigator.storage?.persist) return false;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
};

export const listProjects = <T,>(scope: string): SavedProject<T>[] => {
  try {
    const raw = localStorage.getItem(key(scope));
    return raw ? (JSON.parse(raw) as SavedProject<T>[]) : [];
  } catch {
    return [];
  }
};

export const saveProject = <T,>(scope: string, name: string, data: T, id?: string): SavedProject<T> => {
  const list = listProjects<T>(scope);
  const now = Date.now();
  if (id) {
    const idx = list.findIndex(p => p.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], name, data, updatedAt: now };
      localStorage.setItem(key(scope), JSON.stringify(list));
      return list[idx];
    }
  }
  const project: SavedProject<T> = { id: `${scope}-${now}-${Math.random().toString(36).slice(2, 7)}`, name, data, updatedAt: now };
  list.unshift(project);
  localStorage.setItem(key(scope), JSON.stringify(list.slice(0, 50)));
  return project;
};

export const deleteProject = (scope: string, id: string) => {
  const list = listProjects(scope).filter(p => p.id !== id);
  localStorage.setItem(key(scope), JSON.stringify(list));
};

// Autosave helpers (single slot per scope)
const autoKey = (scope: string) => `ebookstudio_autosave_${scope}`;

// Écrit dans localStorage si possible. En cas d'échec (quota dépassé sur les
// gros manuscrits), on SUPPRIME l'ancienne clé pour ne pas relire une version
// périmée : IndexedDB reste alors la source de vérité.
const writeLocalMirror = <T,>(scope: string, data: T): boolean => {
  try {
    localStorage.setItem(autoKey(scope), JSON.stringify({ updatedAt: Date.now(), data }));
    return true;
  } catch {
    try { localStorage.removeItem(autoKey(scope)); } catch {}
    return false;
  }
};

export const writeAutosave = <T,>(scope: string, data: T) => {
  writeLocalMirror(scope, data);
  void writeNativeAutosave(scope, data);
};
export const readAutosave = <T,>(scope: string): T | null => {
  try {
    const raw = localStorage.getItem(autoKey(scope));
    if (!raw) return null;
    return (JSON.parse(raw) as { data: T }).data;
  } catch {
    return null;
  }
};

export const writeAutosaveAsync = async <T,>(scope: string, data: T): Promise<void> => {
  writeLocalMirror(scope, data);
  await writeNativeAutosave(scope, data);
};

export const readAutosaveAsync = async <T,>(scope: string): Promise<T | null> => {
  // IndexedDB est la source de vérité (localStorage peut être périmé/tronqué
  // si un gros manuscrit a dépassé le quota). On lit d'abord IndexedDB.
  const db = await openNativeDb();
  if (db) {
    const fromDb = await new Promise<T | null>((resolve) => {
      try {
        const tx = db.transaction(AUTOSAVE_STORE, 'readonly');
        const request = tx.objectStore(AUTOSAVE_STORE).get(autoKey(scope));
        request.onsuccess = () => resolve((request.result as AutosaveEnvelope<T> | undefined)?.data ?? null);
        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
    if (fromDb != null) return fromDb;
  }

  // Repli localStorage (petits payloads / navigateurs sans IndexedDB).
  try {
    const raw = localStorage.getItem(autoKey(scope));
    if (raw) return (JSON.parse(raw) as { data: T }).data ?? null;
  } catch {}

  return null;
};

