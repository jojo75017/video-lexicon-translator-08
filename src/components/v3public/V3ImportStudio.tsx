import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FileType2, Globe, Mic, ClipboardPaste, Loader2, Upload, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { importManuscript } from '@/lib/bookperfect/importManuscript';
import { importFromPdf } from '@/lib/import/importFromPdf';
import { importFromUrl } from '@/lib/import/importFromUrl';
import { importFromMediaFile } from '@/lib/import/importFromMedia';
import { buildManuscriptFromText } from '@/lib/import/buildManuscriptFromText';
import type { Manuscript } from '@/lib/bookperfect/types';
import { savePendingManuscript } from '@/lib/import/pendingManuscript';
import heroImage from '@/assets/v3/import-hero.jpg';

type Source = 'doc' | 'pdf' | 'url' | 'media' | 'paste';

const SOURCES: { id: Source; icon: any; title: string; desc: string; formats: string }[] = [
  { id: 'doc',   icon: FileText,      title: 'Document texte',     desc: 'Roman, essai, mémoire déjà rédigé.',           formats: '.docx · .md · .txt' },
  { id: 'pdf',   icon: FileType2,     title: 'Fichier PDF',        desc: 'Ancien livre, thèse, rapport à convertir.',    formats: '.pdf (texte, non scanné)' },
  { id: 'url',   icon: Globe,         title: 'Article web',        desc: 'Blog, Medium, Substack, LinkedIn…',            formats: 'https://…' },
  { id: 'media', icon: Mic,           title: 'Audio ou vidéo',     desc: 'Conférence, podcast, note vocale transcrite.', formats: '.mp3 · .m4a · .wav · .mp4 (≤ 20 Mo)' },
  { id: 'paste', icon: ClipboardPaste, title: 'Coller du texte',   desc: 'Notes, brouillon, transcription existante.',   formats: 'Texte libre' },
];

const WIZARD_CFG_KEY = 'edition_book_config_v1';
const IMPORTED_KEY = 'v3_imported_manuscript_v1';

function persistManuscript(m: Manuscript) {
  try {
    const summary = m.rawText.slice(0, 800).replace(/\s+/g, ' ').trim();
    const prev = JSON.parse(localStorage.getItem(WIZARD_CFG_KEY) || '{}');
    localStorage.setItem(WIZARD_CFG_KEY, JSON.stringify({
      ...prev,
      title: prev.title || m.title,
      description: prev.description || summary,
      numberOfChapters: Math.max(prev.numberOfChapters || 0, m.chapters.length),
    }));
    localStorage.setItem(IMPORTED_KEY, JSON.stringify({
      id: m.id, title: m.title, fileName: m.fileName,
      chapters: m.chapters.length, wordCount: m.wordCount, pageEstimate: m.pageEstimate, importedAt: m.importedAt,
    }));
  } catch { /* ignore */ }
  // Conservé pour « Corriger mon livre » : le texte complet, chapitre par chapitre.
  savePendingManuscript(m);
  toast.success(`Importé : ${m.chapters.length} chapitre(s), ${m.wordCount.toLocaleString('fr-FR')} mots.`);
}


export default function V3ImportStudio() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Source>('doc');
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState<Manuscript | null>(null);
  const [urlValue, setUrlValue] = useState('');
  const [pasteValue, setPasteValue] = useState('');
  const [pasteTitle, setPasteTitle] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  const runFile = useCallback(async (file: File, kind: 'doc' | 'pdf' | 'media') => {
    setLoading(true);
    try {
      const m = kind === 'pdf'
        ? await importFromPdf(file)
        : kind === 'media'
          ? await importFromMediaFile(file)
          : await importManuscript(file);
      persistManuscript(m);
      setImported(m);
    } catch (e: any) {
      toast.error(e?.message || "Import impossible.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const runUrl = useCallback(async () => {
    if (!urlValue.trim()) return;
    setLoading(true);
    try {
      const m = await importFromUrl(urlValue.trim());
      persistManuscript(m);
      setImported(m);
    } catch (e: any) {
      toast.error(e?.message || "Impossible d'importer cet article.");
    } finally { setLoading(false); }
  }, [urlValue, navigate]);

  const runPaste = useCallback(async () => {
    if (!pasteValue.trim() || pasteValue.trim().length < 200) {
      toast.error('Collez au moins 200 caractères.');
      return;
    }
    setLoading(true);
    try {
      const m = await buildManuscriptFromText(pasteValue, (pasteTitle || 'texte-colle') + '.md', pasteTitle || undefined);
      persistManuscript(m);
      setImported(m);
    } catch (e: any) {
      toast.error(e?.message || 'Import impossible.');
    } finally { setLoading(false); }
  }, [pasteValue, pasteTitle, navigate]);

  return (
    <section className="v3-import-studio">
      {/* Hidden inputs */}
      <input ref={fileRef}  type="file" accept=".docx,.md,.txt,.rtf" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) runFile(f, 'doc'); e.target.value = ''; }} />
      <input ref={pdfRef}   type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) runFile(f, 'pdf'); e.target.value = ''; }} />
      <input ref={mediaRef} type="file" accept="audio/*,video/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) runFile(f, 'media'); e.target.value = ''; }} />

      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[1.15fr_1fr] items-start">
        {/* LEFT — content */}
        <div>
          <span className="v3-eyebrow inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Importer un contenu existant
          </span>
          <h1 className="v3-serif text-4xl md:text-5xl font-bold mt-4 leading-tight text-[var(--v3-ink,#0a1f18)]">
            Donnez une seconde vie à vos contenus.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--v3-muted,#4b5b55)] max-w-xl">
            Article de blog, PDF, conférence, brouillon Word ou simple texte collé : nous transformons n'importe quelle
            source en manuscrit structuré, prêt pour les 15 agents de rédaction.
          </p>

          {/* Cards */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {SOURCES.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(s.id)}
                  className={`text-left rounded-2xl border p-4 transition-all ${
                    isActive
                      ? 'border-[var(--v3-gold,#c9a84c)] bg-[var(--v3-gold-soft,#f5f0e0)] shadow-[0_10px_30px_-16px_rgba(201,168,76,0.6)]'
                      : 'border-[var(--v3-line,rgba(6,78,59,0.12))] bg-white hover:border-[var(--v3-gold,#c9a84c)]/60 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-[var(--v3-emerald,#064e3b)] text-[var(--v3-gold,#c9a84c)]' : 'bg-[var(--v3-emerald,#064e3b)]/8 text-[var(--v3-emerald,#064e3b)]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="v3-serif text-lg font-semibold text-[var(--v3-ink,#0a1f18)]">{s.title}</div>
                      <div className="text-[13px] text-[var(--v3-muted,#4b5b55)] leading-snug">{s.desc}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--v3-gold,#c9a84c)] font-medium">{s.formats}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active panel */}
          <div className="mt-6 rounded-2xl border border-[var(--v3-line,rgba(6,78,59,0.12))] bg-white p-6">
            {loading && (
              <div className="flex items-center gap-3 text-sm text-[var(--v3-emerald,#064e3b)]">
                <Loader2 className="w-4 h-4 animate-spin" /> Traitement en cours, cela peut prendre quelques secondes…
              </div>
            )}

            {!loading && active === 'doc' && (
              <div className="text-center py-4">
                <p className="text-sm text-[var(--v3-muted)] mb-4">Glissez-déposez ou choisissez un fichier <b>.docx</b>, <b>.md</b> ou <b>.txt</b>.</p>
                <button onClick={() => fileRef.current?.click()} className="v3-btn-primary inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Choisir un document
                </button>
              </div>
            )}

            {!loading && active === 'pdf' && (
              <div className="text-center py-4">
                <p className="text-sm text-[var(--v3-muted)] mb-4">Extraction du texte de votre PDF (les PDF scannés ne sont pas supportés).</p>
                <button onClick={() => pdfRef.current?.click()} className="v3-btn-primary inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Choisir un PDF
                </button>
              </div>
            )}

            {!loading && active === 'url' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[var(--v3-ink)]">Adresse de l'article</label>
                <input
                  type="url" value={urlValue} onChange={(e) => setUrlValue(e.target.value)}
                  placeholder="https://exemple.com/mon-article"
                  className="w-full rounded-xl border border-[var(--v3-line)] px-4 py-3 text-sm outline-none focus:border-[var(--v3-gold)]"
                />
                <button onClick={runUrl} disabled={!urlValue.trim()} className="v3-btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                  <Globe className="w-4 h-4" /> Importer l'article
                </button>
              </div>
            )}

            {!loading && active === 'media' && (
              <div className="text-center py-4">
                <p className="text-sm text-[var(--v3-muted)] mb-4">Transcription automatique via IA (max 20 Mo). Formats : mp3, m4a, wav, mp4…</p>
                <button onClick={() => mediaRef.current?.click()} className="v3-btn-primary inline-flex items-center gap-2">
                  <Mic className="w-4 h-4" /> Choisir un fichier audio/vidéo
                </button>
              </div>
            )}

            {!loading && active === 'paste' && (
              <div className="space-y-3">
                <input
                  type="text" value={pasteTitle} onChange={(e) => setPasteTitle(e.target.value)}
                  placeholder="Titre (facultatif)"
                  className="w-full rounded-xl border border-[var(--v3-line)] px-4 py-2.5 text-sm outline-none focus:border-[var(--v3-gold)]"
                />
                <textarea
                  value={pasteValue} onChange={(e) => setPasteValue(e.target.value)}
                  rows={8}
                  placeholder="Collez votre texte ici (200 caractères minimum). Les lignes commençant par ## ou « Chapitre X » sont détectées automatiquement."
                  className="w-full rounded-xl border border-[var(--v3-line)] px-4 py-3 text-sm outline-none focus:border-[var(--v3-gold)] font-mono"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--v3-muted)]">{pasteValue.trim().length.toLocaleString('fr-FR')} caractères</span>
                  <button onClick={runPaste} disabled={pasteValue.trim().length < 200} className="v3-btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                    <ClipboardPaste className="w-4 h-4" /> Importer ce texte
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Que faire de ce manuscrit ? */}
          {imported && (
            <div className="mt-5 rounded-2xl border border-[var(--v3-gold,#c9a84c)] bg-[var(--v3-gold-soft,#f5f0e0)] p-5">
              <div className="v3-serif text-lg font-semibold text-[var(--v3-ink,#0a1f18)]">
                « {imported.title} » est prêt
              </div>
              <div className="text-[13px] text-[var(--v3-muted,#4b5b55)] mt-1">
                {imported.chapters.length} chapitre(s) · {imported.wordCount.toLocaleString('fr-FR')} mots · ≈ {imported.pageEstimate} pages.
                Choisissez la suite :
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => navigate('/v3/corriger')} className="v3-btn-primary inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Corriger ce manuscrit
                </button>
                <button onClick={() => navigate('/v3/create')} className="v3-btn-outline inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Rédiger / enrichir avec l'IA
                </button>
              </div>
            </div>
          )}



          {/* Trust bar */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[var(--v3-muted,#4b5b55)]">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--v3-gold,#c9a84c)]" /> 5 formats acceptés</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--v3-gold,#c9a84c)]" /> Vos fichiers ne sont pas conservés</span>
            <span className="inline-flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[var(--v3-gold,#c9a84c)]" /> Limite 20 Mo par média</span>
          </div>
        </div>

        {/* RIGHT — hero */}
        <div className="relative md:sticky md:top-24">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--v3-line,rgba(6,78,59,0.12))] shadow-[0_30px_60px_-30px_rgba(6,78,59,0.35)]">
            <img
              src={heroImage} alt="Auteur écrivant son livre dans une bibliothèque premium"
              width={1024} height={1280}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--v3-emerald,#064e3b)]/85 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--v3-gold,#c9a84c)] mb-1">EbookStudio · V3</div>
              <div className="v3-serif text-2xl font-semibold leading-snug">De la source brute au livre publié.</div>
              <div className="text-[13px] mt-1 opacity-90">15 agents IA restructurent, enrichissent et polissent votre contenu.</div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--v3-gold,#c9a84c)] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
