import { useEffect, useState } from 'react';
import { Check, Loader2, Plus, RefreshCw, Sparkles, X, ListOrdered, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey } from '@/services/aiWritingService';
import {
  BOOK_BRIEF_EVENT, normalizeOutline, readBookBrief, writeBookBrief,
  type BookBrief, type BriefOutlineChapter,
} from '@/lib/v3/bookBrief';
import { saveOutlineVersion } from '@/lib/v3/genieThread';

type Proposal = { titre: string; objectif: string };

/**
 * « On construit le sommaire ensemble » : le Génie ne propose jamais tout le
 * sommaire d'un coup — 3 chapitres à la fois, que l'auteur garde, reformule
 * ou retire. Le sommaire n'est validé que par l'auteur.
 */
export default function V3OutlineCoBuilder() {
  const [brief, setBrief] = useState<BookBrief>({});
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const sync = () => setBrief(readBookBrief() || {});
    sync();
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);

  const outline = brief.outline || [];
  const target = Math.min(40, Math.max(3, Number(brief.chapters) || 12));

  const patch = (values: Partial<BookBrief>) => {
    const next = { ...(readBookBrief() || {}), ...values };
    setBrief(next);
    writeBookBrief(next);
  };

  const propose = async (extra?: string) => {
    if (!(brief.description || brief.title || '').trim()) {
      toast.info('Dites d’abord au Génie de quoi parle votre livre.');
      return;
    }
    setLoading(true);
    try {
      const provider = getProvider();
      const userApiKey = provider === 'gemini' ? getProviderKey('gemini') : '';
      const { data, error } = await supabase.functions.invoke('v3-genie-brief', {
        body: {
          mode: 'outline-step',
          message: (extra || note || '').trim(),
          userApiKey,
          accepted: outline.map((c) => ({ titre: c.titre, objectif: c.objectif })),
          target,
          bookTitle: brief.title || '',
          bookDescription: brief.description || '',
          tone: brief.tone || '',
          language: brief.language || 'fr',
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const list = Array.isArray((data as any)?.chapters) ? (data as any).chapters : [];
      setProposals(list.map((c: any) => ({ titre: String(c.titre || ''), objectif: String(c.objectif || '') })));
      setQuestion(String((data as any)?.question || ''));
      setNote('');
    } catch (e: any) {
      toast.error(e?.message || 'Le Génie est indisponible pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  const keep = (index: number) => {
    const p = proposals[index];
    if (!p?.titre.trim()) return;
    const next = normalizeOutline([...outline, { numero: 0, titre: p.titre, objectif: p.objectif }] as BriefOutlineChapter[]);
    patch({ outline: next, outlineValidated: false });
    setProposals((prev) => prev.filter((_, i) => i !== index));
  };

  const keepAll = () => {
    const kept = proposals.filter((p) => p.titre.trim());
    if (!kept.length) return;
    const next = normalizeOutline([
      ...outline,
      ...kept.map((p) => ({ numero: 0, titre: p.titre, objectif: p.objectif })),
    ] as BriefOutlineChapter[]);
    patch({ outline: next, outlineValidated: false });
    setProposals([]);
    toast.success(`${kept.length} chapitre(s) ajouté(s) au sommaire.`);
  };

  const drop = (index: number) => setProposals((prev) => prev.filter((_, i) => i !== index));

  const rewrite = (index: number, value: string) =>
    setProposals((prev) => prev.map((p, i) => (i === index ? { ...p, titre: value } : p)));

  const finish = async () => {
    if (outline.length < 3) {
      toast.error('Gardez au moins 3 chapitres avant de terminer le sommaire.');
      return;
    }
    patch({ outline: normalizeOutline(outline), chapters: outline.length, outlineValidated: true });
    toast.success(`Sommaire validé — ${outline.length} chapitres ✓`);
    const saved = await saveOutlineVersion(normalizeOutline(outline), {
      projectId: brief.projectId || null,
      bookTitle: (brief.title || '').trim(),
    });
    if (saved) toast.success(`Version ${saved.version} du sommaire enregistrée.`);
  };

  return (
    <div className="rounded-[22px] border p-4" style={{ borderColor: 'rgba(201,168,76,0.55)', background: '#fff' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="v3-chip v3-chip-orange text-[11px]">
          <ListOrdered className="h-3 w-3" /> On construit le sommaire ensemble
        </span>
        <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
          {outline.length} chapitre(s) gardé(s) sur {target} visés
        </span>
      </div>

      <p className="mt-2 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
        Le Génie propose 3 chapitres à la fois. Vous gardez, reformulez ou retirez — rien n’est
        décidé sans vous, et le sommaire n’est validé que par votre clic.
      </p>

      {proposals.length > 0 && (
        <div className="mt-3 space-y-2">
          {question && (
            <p className="text-[12.5px]" style={{ color: 'var(--v3-ink)' }}>
              <Sparkles className="mr-1 inline h-3.5 w-3.5" style={{ color: '#8a6d1f' }} /> {question}
            </p>
          )}
          {proposals.map((p, i) => (
            <div key={i} className="rounded-2xl border p-2.5" style={{ borderColor: 'rgba(201,168,76,0.45)', background: 'rgba(201,168,76,0.06)' }}>
              <input
                value={p.titre}
                onChange={(e) => rewrite(i, e.target.value)}
                className="w-full rounded-xl border bg-white px-2.5 py-1.5 text-[13px] outline-none"
                style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--v3-ink)' }}
              />
              {p.objectif && (
                <p className="mt-1 text-[11.5px]" style={{ color: 'var(--v3-muted)' }}>{p.objectif}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => keep(i)} className="v3-btn v3-btn-primary text-[11px]">
                  <Check className="h-3 w-3" /> Garder
                </button>
                <button type="button" disabled={loading} onClick={() => propose(`Reformule autrement le chapitre proposé « ${p.titre} ».`)}
                  className="v3-btn v3-btn-outline text-[11px] disabled:opacity-50">
                  <RefreshCw className="h-3 w-3" /> Reformuler
                </button>
                <button type="button" onClick={() => drop(i)} className="v3-btn v3-btn-ghost text-[11px]">
                  <X className="h-3 w-3" /> Retirer
                </button>
              </div>
            </div>
          ))}
          {proposals.length > 1 && (
            <button type="button" onClick={keepAll} className="v3-btn v3-btn-outline text-[11px]">
              <Check className="h-3 w-3" /> Garder ces {proposals.length} chapitres
            </button>
          )}
        </div>
      )}

      <div className="mt-3">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Une précision pour les prochains chapitres (facultatif)…"
          className="w-full rounded-xl border bg-white px-2.5 py-2 text-[12.5px] outline-none"
          style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--v3-ink)' }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => propose()} disabled={loading} className="v3-btn v3-btn-primary text-xs disabled:opacity-50">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          {outline.length === 0 ? 'Proposer les 3 premiers chapitres' : 'Proposer les 3 suivants'}
        </button>
        <button type="button" onClick={() => propose('Réordonne les chapitres déjà gardés et propose la suite logique.')}
          disabled={loading} className="v3-btn v3-btn-outline text-xs disabled:opacity-50">
          <ArrowDown className="h-3.5 w-3.5" /> Suite logique
        </button>
        <button type="button" onClick={finish} disabled={outline.length < 3} className="v3-btn v3-btn-outline text-xs disabled:opacity-50">
          <Check className="h-3.5 w-3.5" /> Terminer et valider le sommaire
        </button>
      </div>
    </div>
  );
}
