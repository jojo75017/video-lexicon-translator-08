import { beforeEach, describe, expect, it } from 'vitest';
import { readBookBrief, resetBookProject } from './bookBrief';
import { clearWrittenChapters, readWrittenProgress } from './writtenChapters';

describe('Démarrer un nouveau livre', () => {
  beforeEach(() => localStorage.clear());

  it('retire la fiche, le sommaire, les chapitres et la reprise du précédent livre', () => {
    const keys = [
      'v3_create_workflow_config_v2', 'v3_create_wizard_config_v1',
      'v3_create_current_project_id_v1', 'v3_written_chapters_v1',
      'ebook_workflow_progress', 'ebook_workflow_results',
      'ebook_workflow_sync_data', 'edition_book_config_v1',
      'v3_toc_for_workflow_v1', 'v3_wizard_drafts_v1',
    ];
    for (const key of keys) localStorage.setItem(key, JSON.stringify({ title: 'Mon ancien livre' }));
    resetBookProject();
    clearWrittenChapters();
    for (const key of keys) expect(localStorage.getItem(key)).toBeNull();
    expect(readBookBrief()).toBeNull();
    expect(readWrittenProgress()).toEqual({ chapters: [], total: 0, activeIndex: -1 });
  });

  it('conserve les données hors du brouillon et la connexion', () => {
    localStorage.setItem('saved-library-book', 'Livre enregistré');
    localStorage.setItem('auth-session', 'session');
    resetBookProject();
    clearWrittenChapters();
    expect(localStorage.getItem('saved-library-book')).toBe('Livre enregistré');
    expect(localStorage.getItem('auth-session')).toBe('session');
  });
});