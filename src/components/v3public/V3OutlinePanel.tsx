import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown, ArrowUp, Check, ClipboardPaste, ListOrdered, Loader2, MessageSquarePlus,
  Plus, RefreshCw, Sparkles, Wand2, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  callAIWriting, getProvider, getProviderKey, setProvider, validateKeyFormat,
  type AIProvider,
} from '@/services/aiWritingService';

import {
  clearTocForWorkflow, normalizeOutline, parseTocText, readLatestUltimateToc,
  type BookBrief, type BriefOutlineChapter,
} from '@/lib/v3/bookBrief';

type Props = {
  brief: BookBrief;
  onChange: (patch: Partial<BookBrief>) => void;
};

type OutlineMode = 'full' | 'guided';
type Suggestion = { titre: string; objectif?: string };

/**
 * Sommaire du livre — deux modes : proposition complète éditable, ou dialogue
 * chapitre par chapitre avec l'IA. Le sommaire validé pilote le workflow.
 */
export default function V3OutlinePanel({ brief, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [mode, setMode] = useState<OutlineMode>('full');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [guidance, setGuidance] = useState('');
  const [suggesting, setSuggesting] = useState(false);

  const outline = brief.outline || [];
  const validated = Boolean(brief.outlineValidated) && outline.length > 0;
  const target = Math.min(60, Math.max(3, Number(brief.chapters) || 12));


  const applyOutline = (chapters: BriefOutlineChapter[], source: string) => {
    const normalized = normalizeOutline(chapters).slice(0, 60);
    if (!normalized.length) {
      toast.error('Aucun chapitre détecté dans ce sommaire.');
      return;
    }
    onChange({ outline: normalized, chapters: normalized.length, outlineValidated: false });
    toast.success(`${normalized.length} chapitres importés (${source}) — validez le sommaire.`);
  };

  /** Bascule automatiquement sur un provider réellement configuré (clé valide). */
  const resolveProvider = (): AIProvider | null => {
    const current = getProvider();
    const ok = (p: AIProvider) => {
      const k = getProviderKey(p);
      return Boolean(k) && validateKeyFormat(p, k);
    };
    if (ok(current)) return current;
    const alt = (['gemini', 'openrouter', 'openai', 'claude'] as AIProvider[]).find(ok);
    if (alt) {
      setProvider(alt);
      return alt;
    }
    return null;
  };

  const parseChapters = (raw: string, count: number): BriefOutlineChapter[] => {
    let parsed: any = null;
    const cleaned = String(raw || '').replace(/```json|```/gi, '').trim();
    try { parsed = JSON.parse(cleaned); } catch {
      const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) { try { parsed = JSON.parse(match[0]); } catch { /* ignore */ } }
    }
    const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.chapters) ? parsed.chapters : [];
    const seen = new Set<string>();
    const chapters = list
      .map((item: any, index: number) => ({
        numero: index + 1,
        titre: String(item?.titre || item?.title || '').trim(),
        objectif: String(item?.objectif || item?.goal || item?.description || '').trim(),
      }))
      .filter((item: BriefOutlineChapter) => {
        const k = item.titre.toLowerCase();
        if (!k || seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, count);
    // Repli : l'IA a répondu en texte brut (liste de titres) au lieu du JSON.
    if (chapters.length < 3) return parseTocText(cleaned).slice(0, count);
    return chapters;
  };

  /** Repli serveur : génère le sommaire même sans clé personnelle. */
  const generateOnServer = async (count: number): Promise<BriefOutlineChapter[]> => {
    const { data, error } = await supabase.functions.invoke('v3-generate-outline', {
      body: {
        title: (brief.title || '').trim(),
        subtitle: (brief.subtitle || '').trim(),
        category: brief.category || '',
        tone: brief.tone || '',
        description: (brief.description || '').trim(),
        promesseCentrale: (brief.promesseCentrale || '').trim(),
        chapters: count,
      },
    });
    if (error) throw error;
    if ((data as any)?.error) throw new Error((data as any).error);
    const chapters = (data as any)?.chapters;
    if (!Array.isArray(chapters) || chapters.length < 3) {
      throw new Error('Sommaire indisponible pour le moment. Réessaie ou colle le tien.');
    }
    return chapters as BriefOutlineChapter[];
  };

  const generate = async () => {
    const title = (brief.title || '').trim();
    const description = (brief.description || '').trim();
    if (title.length < 3) {
      toast.error('Renseignez d’abord le titre du livre.');
      return;
    }
    const provider = resolveProvider();
    const count = Math.min(60, Math.max(3, Number(brief.chapters) || 12));

    // Aucune clé personnelle : on passe directement par le serveur (aucun blocage).
    if (!provider) {
      setLoading(true);
      try {
        const chapters = await generateOnServer(count);
        onChange({ outline: normalizeOutline(chapters), chapters: chapters.length, outlineValidated: false });
        toast.success(`Sommaire généré (${chapters.length} chapitres) — relisez puis validez-le.`, {
          description: 'Astuce : branchez votre clé Gemini gratuite pour générer plus vite et sans limite.',
        });
      } catch (e: any) {
        console.error('[Sommaire] génération serveur impossible', e);
        toast.error('Génération du sommaire impossible', { description: e?.message || 'Erreur inconnue.' });
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const prompt = `Tu es directeur éditorial KDP. Crée une table des matières professionnelle en français.
Titre : ${title}
Sous-titre : ${(brief.subtitle || '').trim() || 'Non défini'}
Catégorie : ${brief.category || 'Non définie'}
Ton : ${brief.tone || 'Inspirant'}
Synopsis : ${description || 'Non fourni — déduis un fil conducteur cohérent à partir du titre et de la catégorie.'}
Promesse centrale : ${(brief.promesseCentrale || '').trim() || 'Non définie'}
Nombre exact de chapitres : ${count}

Réponds STRICTEMENT en JSON valide, sans markdown, avec ce schéma :
{"chapters":[{"numero":1,"titre":"Titre spécifique non générique","objectif":"Objectif éditorial clair en une phrase"}]}

Règles :
- exactement ${count} chapitres ;
- jamais de titre générique comme "Chapitre 1" ;
- jamais deux titres identiques ;
- titres courts, vendeurs, cohérents avec le synopsis.`;

      const options = { temperature: 0.55, maxTokens: Math.min(12000, 1800 + count * 180) };
      let chapters: BriefOutlineChapter[] = [];
      try {
        chapters = parseChapters(await callAIWriting(prompt, { ...options, jsonMode: true }), count);
      } catch (firstError) {
        console.warn('[Sommaire] échec en mode JSON, nouvelle tentative en texte brut', firstError);
      }
      if (chapters.length < 3) {
        // 2e tentative sans jsonMode : certains providers/modèles refusent responseMimeType.
        const fallbackPrompt = `${prompt}\n\nSi tu ne peux pas produire de JSON, écris simplement une ligne par chapitre au format : Titre — Objectif.`;
        try {
          chapters = parseChapters(await callAIWriting(fallbackPrompt, options), count);
        } catch (secondError) {
          console.warn('[Sommaire] échec avec la clé personnelle, repli serveur', secondError);
        }
      }
      // Dernier repli : le serveur, pour ne jamais bloquer la création du livre.
      if (chapters.length < 3) chapters = await generateOnServer(count);
      onChange({ outline: normalizeOutline(chapters), chapters: chapters.length, outlineValidated: false });
      toast.success(`Sommaire généré (${chapters.length} chapitres) — relisez puis validez-le.`);
    } catch (e: any) {
      console.error('[Sommaire] génération impossible', e);
      toast.error('Génération du sommaire impossible', { description: e?.message || 'Erreur inconnue.' });

    } finally {
      setLoading(false);
    }
  };



  const importUltimate = () => {
    const found = readLatestUltimateToc();
    if (!found) {
      toast.error('Aucun sommaire trouvé. Créez-le dans « Sommaire Ultime » puis « Envoyer vers le workflow ».');
      return;
    }
    applyOutline(found.chapters, found.source);
    clearTocForWorkflow();
  };

  const applyPaste = () => {
    applyOutline(parseTocText(pasteText), 'collage manuel');
    setPasteText('');
    setPasteOpen(false);
  };

  const updateChapter = (index: number, patch: Partial<BriefOutlineChapter>) => {
    const next = outline.map((c, i) => (i === index ? { ...c, ...patch } : c));
    onChange({ outline: next, outlineValidated: false });
  };

  const removeChapter = (index: number) => {
    const next = normalizeOutline(outline.filter((_, i) => i !== index));
    onChange({ outline: next, chapters: next.length, outlineValidated: false });
  };

  const moveChapter = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= outline.length) return;
    const next = [...outline];
    [next[index], next[to]] = [next[to], next[index]];
    onChange({ outline: normalizeOutline(next), outlineValidated: false });
  };

  const addChapter = () => {
    const next = normalizeOutline([...outline, { numero: outline.length + 1, titre: '', objectif: '' }]);
    onChange({ outline: next, chapters: next.length, outlineValidated: false });
  };

  /** Mode dialogue : demande 3 propositions pour le prochain chapitre. */
  const askNextChapter = async () => {
    const title = (brief.title || '').trim();
    if (title.length < 3) {
      toast.error('Renseignez d’abord le titre du livre.');
      return;
    }
    setSuggesting(true);
    setSuggestions([]);
    try {
      const { data, error } = await supabase.functions.invoke('v3-generate-outline', {
        body: {
          step: 'next',
          title,
          subtitle: (brief.subtitle || '').trim(),
          category: brief.category || '',
          tone: brief.tone || '',
          description: (brief.description || '').trim(),
          promesseCentrale: (brief.promesseCentrale || '').trim(),
          chapters: target,
          accepted: outline,
          guidance: guidance.trim(),
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const list = (data as any)?.suggestions as Suggestion[] | undefined;
      if (!Array.isArray(list) || !list.length) throw new Error('Aucune proposition reçue.');
      setSuggestions(list);
    } catch (e: any) {
      console.error('[Sommaire guidé] proposition impossible', e);
      toast.error('Proposition impossible', { description: e?.message || 'Erreur inconnue.' });
    } finally {
      setSuggesting(false);
    }
  };

  const acceptSuggestion = (s: Suggestion) => {
    const next = normalizeOutline([...outline, { numero: outline.length + 1, titre: s.titre, objectif: s.objectif }]);
    onChange({ outline: next, chapters: next.length, outlineValidated: false });
    setSuggestions([]);
    setGuidance('');
    toast.success(`Chapitre ${next.length} ajouté — ${s.titre}`);
  };


  return (
    <div className="rounded-[22px] border p-5" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="v3-chip v3-chip-orange"><ListOrdered className="h-3.5 w-3.5" /> Sommaire du livre</span>
          <p className="mt-2 text-xs" style={{ color: 'var(--v3-muted)' }}>
            Générez-le, importez votre « Sommaire Ultime » ou collez le vôtre, puis validez-le : c’est lui qui pilote le workflow.
          </p>
        </div>
        {validated && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
            style={{ background: 'var(--v3-emerald, #064e3b)', color: '#fff' }}>
            <Check className="h-3.5 w-3.5" /> Sommaire validé — {outline.length} chapitres
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={generate} disabled={loading} className="v3-btn v3-btn-primary disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {outline.length ? 'Régénérer le sommaire' : 'Générer le sommaire'}
        </button>
        <button type="button" onClick={importUltimate} className="v3-btn v3-btn-outline">
          <RefreshCw className="h-4 w-4" /> Importer mon Sommaire Ultime
        </button>
        <button type="button" onClick={() => setPasteOpen((v) => !v)} className="v3-btn v3-btn-outline">
          <ClipboardPaste className="h-4 w-4" /> Coller un sommaire
        </button>
        <Link to="/v3/outils/sommaire-ultime" className="v3-btn v3-btn-ghost text-xs">Ouvrir Sommaire Ultime</Link>
      </div>

      {pasteOpen && (
        <div className="mt-4">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={7}
            placeholder={'Une ligne = un chapitre. Texte, Markdown ou JSON.\nEx : Le déclic — Comprendre pourquoi tout commence ici'}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: '#fff' }}
          />
          <button type="button" onClick={applyPaste} className="v3-btn v3-btn-primary mt-2">
            <Check className="h-4 w-4" /> Importer ces chapitres
          </button>
        </div>
      )}

      {outline.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed px-4 py-6 text-center text-sm" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-muted)' }}>
          Aucun sommaire pour l’instant. Générez-le ou importez-le pour débloquer le workflow.
        </p>
      ) : (
        <>
          <ol className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-2">
            {outline.map((chapter, index) => (
              <li key={index} className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--v3-border)' }}>
                <div className="flex items-start gap-2">
                  <span className="mt-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>
                    Ch. {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <input
                      value={chapter.titre}
                      onChange={(e) => updateChapter(index, { titre: e.target.value })}
                      className="w-full rounded-lg border px-2 py-1.5 text-sm font-bold outline-none"
                      style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: '#fff' }}
                    />
                    <input
                      value={chapter.objectif || ''}
                      onChange={(e) => updateChapter(index, { objectif: e.target.value })}
                      placeholder="Objectif du chapitre (optionnel)"
                      className="mt-1 w-full rounded-lg border px-2 py-1.5 text-xs outline-none"
                      style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-muted)', background: '#fff' }}
                    />
                  </div>
                  <button type="button" onClick={() => removeChapter(index)} title="Supprimer ce chapitre"
                    className="mt-1 rounded-lg border p-1.5" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-muted)' }}>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => {
              onChange({ outlineValidated: true, chapters: outline.length });
              toast.success(`Sommaire validé — ${outline.length} chapitres retenus ✓`);
            }}
            disabled={validated}
            className="v3-btn v3-btn-primary mt-4 w-full justify-center disabled:opacity-60"
          >
            <Check className="h-4 w-4" /> {validated ? 'Sommaire validé' : 'Valider le sommaire'}
          </button>
        </>
      )}
    </div>
  );
}
