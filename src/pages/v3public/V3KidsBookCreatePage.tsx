import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, Lock, ImageIcon, Check, Download, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  ILLUSTRATION_STYLES,
  buildCharacterBibleText,
  canUseKidsBook,
  KIDS_BOOK_IMAGE_MODEL,
  type KidsBookDraft,
  type KidsStory,
  type IllustrationStyle,
} from '@/config/kidsBookConfig';
import type { V3Plan } from '@/data/v3ToolPlans';

const STORAGE_KEY = 'v3_kids_book_draft_v1';

function loadDraft(): KidsBookDraft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return {
    title: '',
    authorName: '',
    targetAge: '3-6 ans',
    style: 'pixar-3d',
    character: { name: '', age: '4 ans', physical: '', outfit: '' },
    stories: [
      { id: crypto.randomUUID(), title: '', synopsis: '' },
    ],
  };
}

export default function V3KidsBookCreatePage() {
  const nav = useNavigate();
  const [plan, setPlan] = useState<V3Plan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [draft, setDraft] = useState<KidsBookDraft>(loadDraft);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoadingPlan(false); return; }
      const { data: sub } = await (supabase as any)
        .from('subscribers').select('plan_tier').eq('user_id', user.id).maybeSingle();
      const tier = (sub?.plan_tier ?? '').toLowerCase();
      if (tier.includes('auteur') || tier.includes('editeur') || tier.includes('vip')) setPlan('auteur');
      else if (tier.includes('expert') || tier.includes('studio')) setPlan('expert');
      else if (tier) setPlan('debutant');
      setLoadingPlan(false);
    })();
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch { /* noop */ }
  }, [draft]);

  const update = (patch: Partial<KidsBookDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const updateChar = (patch: Partial<KidsBookDraft['character']>) =>
    setDraft((d) => ({ ...d, character: { ...d.character, ...patch } }));

  const addStory = () =>
    setDraft((d) => ({
      ...d,
      stories: [...d.stories, { id: crypto.randomUUID(), title: '', synopsis: '' }],
    }));
  const updateStory = (id: string, patch: Partial<KidsStory>) =>
    setDraft((d) => ({
      ...d,
      stories: d.stories.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  const removeStory = (id: string) =>
    setDraft((d) => ({ ...d, stories: d.stories.filter((s) => s.id !== id) }));

  const generateIllustration = async (story: KidsStory) => {
    if (!draft.character.name || !draft.character.physical) {
      toast.error('Complète d\'abord la bible du personnage (nom + description physique).');
      return;
    }
    if (!story.synopsis) {
      toast.error('Ajoute un synopsis à cette histoire.');
      return;
    }
    setGenerating(story.id);
    try {
      const stylePrompt = ILLUSTRATION_STYLES.find((s) => s.id === draft.style)?.prompt || '';
      const model = KIDS_BOOK_IMAGE_MODEL[plan || 'expert'];
      const { data, error } = await supabase.functions.invoke('agent-illustrator', {
        body: {
          bookId: 'draft',
          storyId: story.id,
          characterBible: buildCharacterBibleText(draft.character),
          scene: story.synopsis,
          stylePrompt,
          model,
        },
      });
      if (error || !data?.url) throw new Error(error?.message || data?.error || 'Génération échouée');
      updateStory(story.id, { illustrationUrl: data.url });
      toast.success('Illustration générée');
    } catch (e: any) {
      toast.error(e.message || 'Erreur de génération');
    } finally {
      setGenerating(null);
    }
  };

  const exportHtml = () => {
    const html = buildAlbumHtml(draft);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(draft.title || 'album').replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Album téléchargé — ouvre-le et imprime en PDF pour KDP.');
  };

  if (loadingPlan) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--v3-emerald,#064e3b)]" />
      </div>
    );
  }

  if (!canUseKidsBook(plan)) {
    return (
      <section className="min-h-[calc(100vh-4rem)] py-16 px-5 bg-[var(--v3-paper,#fbfaf6)]">
        <div className="max-w-2xl mx-auto text-center v3-card p-10">
          <Lock className="w-10 h-10 text-[#C97A14] mx-auto mb-4" />
          <h1 className="v3-serif text-3xl font-bold mb-3">Livre illustré maternelle</h1>
          <p className="text-[var(--v3-muted)] mb-6">
            Ce mode est réservé aux forfaits <strong>Studio (12,99 €)</strong> et <strong>Éditeur (59 €)</strong>.
            Il inclut la génération d'illustrations cohérentes pour ton personnage, page après page.
          </p>
          <Link to="/v3/forfaits">
            <Button className="bg-[#C97A14] hover:bg-[#a8630f] text-white">
              Voir les forfaits Studio & Éditeur
            </Button>
          </Link>
          <div className="mt-6 text-xs text-[var(--v3-muted)]">
            <Link to="/v3/create" className="underline">← Retour à l'écriture classique</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="v3-halo-soft min-h-[calc(100vh-4rem)] py-12 px-5">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => nav('/v3/create')} className="text-sm text-[var(--v3-muted)] hover:text-[var(--v3-ink)] inline-flex items-center gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour à l'écriture classique
        </button>

        <div className="text-center mb-8">
          <span className="v3-chip v3-chip-orange"><Sparkles className="w-3.5 h-3.5" /> Livre illustré maternelle</span>
          <h1 className="v3-serif text-4xl font-bold mt-4">Album jeunesse illustré</h1>
          <p className="text-sm text-[var(--v3-muted)] mt-2 max-w-lg mx-auto">
            Crée un livre d'histoires courtes avec un personnage cohérent d'une page à l'autre.
            Format album carré, compatible KDP.
          </p>
        </div>

        {/* Étape 1 — Livre */}
        <div className="v3-card mb-4">
          <h2 className="font-semibold mb-3">1. Ton livre</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Titre du livre (ex: 5 minutes pour grandir en maternelle)"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
            <input
              value={draft.authorName}
              onChange={(e) => update({ authorName: e.target.value })}
              placeholder="Nom d'auteur (affiché sur la couverture) *"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
            <input
              value={draft.targetAge}
              onChange={(e) => update({ targetAge: e.target.value })}
              placeholder="Âge cible (ex: 3-6 ans)"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
            <select
              value={draft.style}
              onChange={(e) => update({ style: e.target.value as IllustrationStyle })}
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            >
              {ILLUSTRATION_STYLES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          {!draft.authorName && (
            <p className="text-xs text-amber-700 mt-2">⚠️ Le nom d'auteur est obligatoire — il apparaît sur la couverture et la page de titre.</p>
          )}
        </div>

        {/* Étape 2 — Bible personnage */}
        <div className="v3-card mb-4">
          <h2 className="font-semibold mb-1">2. Bible du personnage principal</h2>
          <p className="text-xs text-[var(--v3-muted)] mb-3">
            Plus tu es précis, plus le personnage restera identique d'une image à l'autre.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={draft.character.name}
              onChange={(e) => updateChar({ name: e.target.value })}
              placeholder="Prénom (ex: Jules)"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
            <input
              value={draft.character.age}
              onChange={(e) => updateChar({ age: e.target.value })}
              placeholder="Âge (ex: 4 ans)"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
            <textarea
              value={draft.character.physical}
              onChange={(e) => updateChar({ physical: e.target.value })}
              placeholder="Description physique — cheveux, yeux, morphologie (ex: cheveux bruns bouclés, yeux marron, joues rondes)"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
              rows={2}
            />
            <textarea
              value={draft.character.outfit}
              onChange={(e) => updateChar({ outfit: e.target.value })}
              placeholder="Tenue signature — reprise sur TOUTES les images (ex: t-shirt vert, short bleu, baskets blanches)"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
              rows={2}
            />
            <input
              value={draft.character.personality || ''}
              onChange={(e) => updateChar({ personality: e.target.value })}
              placeholder="Personnalité (optionnel — curieux, maladroit, gentil...)"
              className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
            />
          </div>
        </div>

        {/* Étape 3 — Histoires */}
        <div className="v3-card mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">3. Tes histoires ({draft.stories.length})</h2>
            <Button size="sm" variant="outline" onClick={addStory}>+ Ajouter</Button>
          </div>
          <div className="space-y-4">
            {draft.stories.map((story, idx) => (
              <div key={story.id} className="border rounded-lg p-3 bg-white/60">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-[var(--v3-muted)]">Histoire {idx + 1}</span>
                  <input
                    value={story.title}
                    onChange={(e) => updateStory(story.id, { title: e.target.value })}
                    placeholder="Titre (ex: Oups, encore !)"
                    className="flex-1 px-3 py-2 rounded border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
                  />
                  {draft.stories.length > 1 && (
                    <button
                      onClick={() => removeStory(story.id)}
                      className="text-xs text-red-600 hover:underline"
                    >Retirer</button>
                  )}
                </div>
                <textarea
                  value={story.synopsis}
                  onChange={(e) => updateStory(story.id, { synopsis: e.target.value })}
                  placeholder="Synopsis en 1-2 phrases — ce que le personnage vit dans cette histoire. Sert de scène pour l'illustration."
                  className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#C97A14]/40"
                  rows={2}
                />
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => generateIllustration(story)}
                    disabled={generating === story.id}
                    className="bg-[#C97A14] hover:bg-[#a8630f] text-white"
                  >
                    {generating === story.id ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Génération…</>
                    ) : (
                      <><ImageIcon className="w-3.5 h-3.5 mr-1.5" /> {story.illustrationUrl ? 'Régénérer' : 'Générer l\'illustration'}</>
                    )}
                  </Button>
                  {story.illustrationUrl && (
                    <img src={story.illustrationUrl} alt="" className="w-20 h-20 object-cover rounded border" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Étape 4 — Export */}
        <div className="v3-card mb-8">
          <h2 className="font-semibold mb-2">4. Export album</h2>
          <p className="text-xs text-[var(--v3-muted)] mb-3">
            Télécharge un fichier HTML au format album carré (21,59 × 21,59 cm). Ouvre-le dans Chrome et fais <em>Imprimer → PDF</em> pour un fichier prêt KDP.
          </p>
          <Button onClick={exportHtml} disabled={!draft.title || !draft.authorName}>
            <Download className="w-4 h-4 mr-2" /> Télécharger l'album (HTML)
          </Button>
          {(!draft.title || !draft.authorName) && (
            <p className="text-xs text-amber-700 mt-2">Renseigne le titre et le nom d'auteur pour exporter.</p>
          )}
        </div>

        <div className="text-center text-xs text-[var(--v3-muted)] flex items-center justify-center gap-2">
          <Check className="w-3 h-3 text-green-600" />
          Brouillon sauvegardé automatiquement dans ce navigateur
        </div>
      </div>
    </section>
  );
}

function esc(s: string): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

function buildAlbumHtml(d: KidsBookDraft): string {
  const stories = d.stories.map((s, i) => `
    <section class="page image-page">
      ${s.illustrationUrl ? `<img src="${esc(s.illustrationUrl)}" alt="${esc(s.title)}" />` : `<div class="placeholder">Illustration à générer</div>`}
    </section>
    <section class="page text-page">
      <h2>${i + 1}. ${esc(s.title || 'Histoire')}</h2>
      <p>${esc(s.content || s.synopsis || '')}</p>
    </section>
  `).join('\n');

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(d.title)}</title>
<style>
  @page { size: 21.59cm 21.59cm; margin: 0; }
  body { margin: 0; font-family: 'Georgia', serif; color: #232F3E; }
  .page { width: 21.59cm; height: 21.59cm; page-break-after: always; box-sizing: border-box; display: flex; flex-direction: column; }
  .cover { background: linear-gradient(160deg,#fef3c7,#fde68a); padding: 3cm 2cm; text-align: center; justify-content: center; align-items: center; }
  .cover h1 { font-size: 48pt; margin: 0 0 1cm; line-height: 1.1; }
  .cover .author { font-size: 20pt; margin-top: 2cm; font-style: italic; }
  .title-page { padding: 4cm 2cm; text-align: center; justify-content: center; }
  .title-page h1 { font-size: 36pt; margin: 0; }
  .title-page .author { font-size: 22pt; margin-top: 3cm; }
  .title-page .age { font-size: 14pt; color: #888; margin-top: 1cm; }
  .image-page { padding: 0; }
  .image-page img { width: 100%; height: 100%; object-fit: cover; }
  .image-page .placeholder { flex: 1; display: flex; align-items: center; justify-content: center; background: #f5f5f4; color: #999; font-size: 14pt; }
  .text-page { padding: 3cm 2.5cm; justify-content: center; }
  .text-page h2 { font-size: 26pt; margin: 0 0 1cm; }
  .text-page p { font-size: 18pt; line-height: 1.6; margin: 0; }
</style></head><body>
  <section class="page cover">
    <h1>${esc(d.title)}</h1>
    <div class="author">${esc(d.authorName)}</div>
  </section>
  <section class="page title-page">
    <h1>${esc(d.title)}</h1>
    <div class="author">${esc(d.authorName)}</div>
    <div class="age">${esc(d.targetAge)}</div>
  </section>
  ${stories}
</body></html>`;
}
