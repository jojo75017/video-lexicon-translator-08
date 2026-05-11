// Simple localStorage-based project saver for the Scolaire & Agenda generators.

export interface SavedProject<T> {
  id: string;
  name: string;
  updatedAt: number;
  data: T;
}

const key = (scope: string) => `ebookstudio_projects_${scope}`;

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
export const writeAutosave = <T,>(scope: string, data: T) => {
  try { localStorage.setItem(autoKey(scope), JSON.stringify({ updatedAt: Date.now(), data })); } catch {}
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
