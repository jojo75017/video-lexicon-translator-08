import { describe, it, expect, vi } from 'vitest';
vi.mock('@/integrations/supabase/client', () => ({ supabase: {} }));
vi.mock('@/lib/bookperfect/importManuscript', () => ({ extractText: vi.fn() }));
vi.mock('@/lib/import/importFromPdf', () => ({ extractTextFromPdf: vi.fn() }));
import { audioBookFromRow, importAudioFile } from './bookImport';
import { extractText } from '@/lib/bookperfect/importManuscript';
import { extractTextFromPdf } from '@/lib/import/importFromPdf';
import { parseManuscript } from '@/lib/manuscriptParser';

describe('Reprise audio V2 dans V3', () => {
  it('conserve auteur, préface, conclusion, épilogue et sous-chapitres', () => {
    const book = audioBookFromRow({ title: 'Mon livre', author_name: 'Georges', preface: 'Avant', conclusion: 'Fin', draft_state: { epilogue: 'Après' }, chapters: [
      { title: 'Le départ', content: 'Premier texte.', subChapters: [{ title: 'La gare', content: 'Suite du texte.' }] },
      { title: 'Le retour', content: 'Deuxième texte.' },
    ] }, 'ebook');
    expect(book.author).toBe('Georges'); expect(book.preface).toBe('Avant');
    expect(book.conclusion).toBe('Fin'); expect(book.epilogue).toBe('Après');
    expect(book.manuscript).toContain('Suite du texte.');
    expect(parseManuscript(book.manuscript).map(c => c.title)).toEqual(['Le départ', 'Le retour']);
  });
  it('reprend le texte des guides sans lire les liens des images', () => {
    const book = audioBookFromRow({ chapters: [{ title: 'Potager', text: 'Semer les graines.', imageUrl: 'https://image', summary: 'Résumé' }] }, 'guide');
    expect(book.manuscript).toBe('# Potager\n\nSemer les graines.');
  });
  it('reprend les pauses avec question et réponse', () => {
    const book = audioBookFromRow({ pauses: [{ title: 'Pause', text: 'Texte.', encart: 'Note.', question: 'Pourquoi ?', answer: 'Voici pourquoi.' }] }, 'vc');
    expect(book.manuscript).toContain('Pourquoi ?\n\nVoici pourquoi.');
  });
  it('importe le texte des fichiers Word et PDF', async () => {
    vi.mocked(extractText).mockResolvedValue('Chapitre 1\n\nTexte Word.');
    vi.mocked(extractTextFromPdf).mockResolvedValue('Chapitre 1\n\nTexte PDF.');
    expect((await importAudioFile(new File([''], 'Livre.docx'))).manuscript).toContain('Texte Word.');
    expect((await importAudioFile(new File([''], 'Livre.pdf'))).manuscript).toContain('Texte PDF.');
  });
  it('refuse un PDF sans texte au lieu de vider le studio silencieusement', async () => {
    vi.mocked(extractTextFromPdf).mockResolvedValue('');
    await expect(importAudioFile(new File([''], 'Scan.pdf'))).rejects.toThrow('texte lisible');
  });
});