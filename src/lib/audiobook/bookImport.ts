import { supabase } from '@/integrations/supabase/client';
import { extractText } from '@/lib/bookperfect/importManuscript';
import { extractTextFromPdf } from '@/lib/import/importFromPdf';

export type AudioBookSource = 'ebook' | 'book' | 'cs' | 'guide' | 'vc';
export type AudioBookOption = { id: string; title: string; source: AudioBookSource; updatedAt: string };
export type AudioBookContent = { title: string; author: string; preface: string; conclusion: string; epilogue: string; manuscript: string };
const record = (v: unknown): Record<string, unknown> => v && typeof v === 'object' ? v as Record<string, unknown> : {};
const text = (v: unknown) => typeof v === 'string' ? v.trim() : '';
const array = (v: unknown): unknown[] => Array.isArray(v) ? v : [];

/** Keep chapter boundaries and every written subsection, without reading images or summaries aloud. */
export function audioBookFromRow(value: unknown, source: AudioBookSource): AudioBookContent {
  const row = record(value);
  const draft = record(row.draft_state);
  const brief = record(draft.brief);
  const chapters = source === 'vc' ? array(row.pauses) : array(row.chapters);
  const manuscript = chapters.map((v, i) => {
    const c = record(v);
    const subs = array(c.subChapters ?? c.subchapters).map(v => {
      const s = record(v);
      return text(s.content) ? `${text(s.title)}\n\n${text(s.content)}` : '';
    }).filter(Boolean);
    const body = [text(c.content ?? c.text ?? c.content_markdown), ...subs];
    if (source === 'vc') body.push(text(c.encart), text(c.question), text(c.answer));
    const content = body.filter(Boolean).join('\n\n');
    return content ? `# ${text(c.title) || `Chapitre ${i + 1}`}\n\n${content}` : '';
  }).filter(Boolean).join('\n\n');
  return {
    title: text(row.title), author: text(row.author_name) || text(brief.author),
    preface: text(row.preface), conclusion: text(row.conclusion),
    epilogue: text(row.epilogue) || text(draft.epilogue), manuscript,
  };
}

export async function listAudioBooks(): Promise<AudioBookOption[]> {
  const { data: auth, error } = await supabase.auth.getUser();
  if (error || !auth.user) throw new Error('Connectez-vous pour retrouver vos livres.');
  const uid = auth.user.id;
  const results = await Promise.all([
    supabase.rpc('list_my_library_books'),
    supabase.from('book_projects').select('id,title,updated_at').eq('user_id', uid).order('updated_at', { ascending: false }),
    supabase.from('cs_projects').select('id,title,updated_at').eq('user_id', uid).order('updated_at', { ascending: false }),
    supabase.from('illustrated_guides').select('id,title,updated_at').eq('user_id', uid).order('updated_at', { ascending: false }),
    supabase.from('vc_books').select('id,title,updated_at').eq('user_id', uid).order('updated_at', { ascending: false }),
  ]);
  const failed = results.find(r => r.error);
  if (failed?.error) throw new Error('Impossible de charger tous vos livres. Réessayez.');
  const sources: AudioBookSource[] = ['ebook', 'book', 'cs', 'guide', 'vc'];
  return results.flatMap((r, i) => array(r.data).map(v => {
    const row = record(v);
    return { id: text(row.id), title: text(row.title), updatedAt: text(row.updated_at), source: sources[i] ?? 'ebook' };
  })).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function loadAudioBook(book: AudioBookOption): Promise<AudioBookContent> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Connectez-vous pour importer ce livre.');
  const uid = auth.user.id;
  let row: unknown;
  if (book.source === 'book') {
    const [chapters, versions] = await Promise.all([
      supabase.from('book_chapters').select('id,title,position').eq('project_id', book.id).eq('user_id', uid).order('position'),
      supabase.from('book_chapter_versions').select('chapter_id,content,version').eq('project_id', book.id).eq('user_id', uid).order('version', { ascending: false }),
    ]);
    if (chapters.error || versions.error) throw new Error('Ce livre ne peut pas être chargé.');
    row = { title: book.title, chapters: (chapters.data ?? []).map(c => ({ ...c, content: versions.data?.find(v => v.chapter_id === c.id)?.content })) };
  } else if (book.source === 'cs') {
    const { data, error } = await supabase.from('cs_chapters').select('chapter_number,title,content_markdown').eq('project_id', book.id).eq('user_id', uid).order('chapter_number');
    if (error) throw new Error('Ce livre ne peut pas être chargé.');
    row = { title: book.title, chapters: data };
  } else if (book.source === 'ebook') {
    const { data, error } = await supabase.from('ebook_projects').select('title,author_name,preface,conclusion,chapters,draft_state').eq('id', book.id).eq('user_id', uid).single();
    if (error) throw new Error('Ce livre ne peut pas être chargé.');
    row = data;
  } else if (book.source === 'guide') {
    const { data, error } = await supabase.from('illustrated_guides').select('title,author_name,chapters').eq('id', book.id).eq('user_id', uid).single();
    if (error) throw new Error('Ce livre ne peut pas être chargé.');
    row = data;
  } else {
    const { data, error } = await supabase.from('vc_books').select('title,author_name,pauses').eq('id', book.id).eq('user_id', uid).single();
    if (error) throw new Error('Ce livre ne peut pas être chargé.');
    row = data;
  }
  const content = audioBookFromRow(row, book.source);
  if (!content.manuscript && !content.preface && !content.conclusion && !content.epilogue) throw new Error(`« ${book.title} » ne contient pas encore de texte rédigé.`);
  return content;
}

export async function importAudioFile(file: File): Promise<AudioBookContent> {
  const raw = file.name.toLowerCase().endsWith('.pdf') ? await extractTextFromPdf(file) : await extractText(file);
  if (!raw.trim()) throw new Error('Ce fichier ne contient pas de texte lisible. Pour un PDF scanné, importez plutôt le fichier Word.');
  return { title: file.name.replace(/\.(docx|txt|md|pdf)$/i, ''), author: '', preface: '', conclusion: '', epilogue: '', manuscript: raw };
}