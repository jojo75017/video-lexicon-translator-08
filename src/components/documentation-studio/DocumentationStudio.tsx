// Documentation Studio AI — conteneur principal (wizard + score + estimation + Copilot)
import React, { useState } from 'react';
import { Sparkles, Loader2, RotateCcw, ChevronLeft, ChevronRight, Lock, Wand2, Gauge, Clock, FileStack } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import useV3Entitlement from '@/hooks/useV3Entitlement';
import { DS, STEPS, PRODUCT_TYPES } from './constants';
import { useDocProject } from './useDocProject';
import { STEP_COMPONENTS } from './steps';
import { AmberButton } from './ui';
import { newModule, newFeature, newAgent } from './types';
import DocPreview from './DocPreview';
import Copilot from './Copilot';
import Results from './Results';
import type { GeneratedDoc } from './exporters';

export default function DocumentationStudio() {
  const { project, patch, reset, scoreDetail, estimation } = useDocProject();
  const { hasFull, isAdmin } = useV3Entitlement();
  const unlocked = hasFull || isAdmin;

  const [step, setStep] = useState(0);
  const Current = STEP_COMPONENTS[step];

  // Génération des livrables
  const [view, setView] = useState<'editor' | 'results'>('editor');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [docs, setDocs] = useState<GeneratedDoc[]>([]);
  const [demoResult, setDemoResult] = useState(false);

  const runGenerate = async () => {
    if (generating || project.exports.length === 0) return;
    setGenError('');
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('documentation-studio-generate', {
        body: { project, deliverables: project.exports },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const documents = (data as any)?.documents as GeneratedDoc[];
      if (!documents?.length) throw new Error('Aucun document généré.');
      setDocs(documents);
      setDemoResult(Boolean((data as any)?.demo));
      setView('results');
    } catch (e: any) {
      setGenError(e?.message || 'Génération indisponible pour le moment.');
    } finally {
      setGenerating(false);
    }
  };

  if (view === 'results') {
    return <Results project={project} documents={docs} demo={demoResult} onBack={() => setView('editor')} />;
  }

  // Génération intelligente
  const [smartOpen, setSmartOpen] = useState(false);
  const [smartText, setSmartText] = useState('');
  const [smartLoading, setSmartLoading] = useState(false);
  const [smartError, setSmartError] = useState('');

  const runAutofill = async () => {
    if (smartText.trim().length < 15 || smartLoading) return;
    setSmartError('');
    setSmartLoading(true);
    try {
      const productType = PRODUCT_TYPES.find((t) => t.id === project.productType)?.label || 'produit numérique';
      const { data, error } = await supabase.functions.invoke('documentation-studio-assist', {
        body: { action: 'autofill', description: smartText, productType },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      applyAutofill((data as any).data);
      setSmartOpen(false);
    } catch (e: any) {
      setSmartError(e?.message || 'Génération indisponible pour le moment.');
    } finally {
      setSmartLoading(false);
    }
  };

  const applyAutofill = (d: any) => {
    if (!d || typeof d !== 'object') return;
    patch((p) => {
      const np = structuredClone(p);
      if (d.project) {
        np.project.name = d.project.name || np.project.name;
        np.project.slogan = d.project.slogan || np.project.slogan;
        np.project.company = d.project.company || np.project.company;
      }
      if (d.positioning) {
        for (const k of ['vision', 'mission', 'values', 'audience', 'problem', 'promise', 'advantages'] as const) {
          if (d.positioning[k]) (np.positioning as any)[k] = d.positioning[k];
        }
      }
      if (Array.isArray(d.modules)) {
        np.modules = d.modules.slice(0, 8).map((m: any) => ({ ...newModule(), name: m.name || '', description: m.description || '', fonction: m.fonction || '', audience: m.audience || '', icon: m.icon || '📦' }));
      }
      if (Array.isArray(d.features)) {
        np.features = d.features.slice(0, 10).map((f: any) => ({ ...newFeature(), name: f.name || '', description: f.description || '', example: f.example || '', tip: f.tip || '' }));
      }
      if (Array.isArray(d.agents)) {
        np.agents = d.agents.slice(0, 4).map((a: any) => ({ ...newAgent(), name: a.name || '', mission: a.mission || '', personality: a.personality || '', skills: a.skills || '', workflow: a.workflow || '', systemPrompt: a.systemPrompt || '', useCases: a.useCases || '' }));
      }
      return np;
    });
  };

  return (
    <div style={{ fontFamily: DS.SANS }}>
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2" style={{ fontFamily: DS.SERIF, color: DS.INK }}>
            <span>📚</span> Documentation Studio AI
          </h2>
          <p className="text-[13px]" style={{ color: DS.MUTED }}>
            Générez toute la documentation de votre produit numérique — sans jamais être perdu.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AmberButton variant="ghost" onClick={() => { if (confirm('Réinitialiser tout le projet ?')) { reset(); setStep(0); } }}>
            <RotateCcw className="h-4 w-4" /> Réinitialiser
          </AmberButton>
          <AmberButton onClick={() => setSmartOpen((v) => !v)}>
            <Sparkles className="h-4 w-4" /> Génération intelligente
          </AmberButton>
        </div>
      </div>

      {/* Bannière offre pour non-débloqués */}
      {!unlocked && (
        <div className="mb-4 flex items-start gap-2 rounded-xl px-4 py-3 text-[13px]"
          style={{ background: DS.AMBER_SOFT, color: DS.AMBER_DEEP, border: `1px solid ${DS.AMBER}55` }}>
          <Lock className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            <strong>Version démo.</strong> Explorez librement l'assistant et une génération courte gratuite.
            Débloquez la génération complète et tous les exports avec le pack <strong>Documentation Studio à 197€</strong>.
          </span>
        </div>
      )}

      {/* Panneau Génération intelligente */}
      {smartOpen && (
        <div className="mb-4 rounded-2xl border p-4" style={{ borderColor: `${DS.AMBER}66`, background: '#fff' }}>
          <div className="flex items-center gap-2 text-[14px] font-semibold mb-1" style={{ color: DS.INK }}>
            <Wand2 className="h-4 w-4" style={{ color: DS.AMBER_DEEP }} /> Décrivez votre produit en quelques phrases
          </div>
          <p className="text-[12px] mb-2" style={{ color: DS.MUTED }}>
            L'IA remplira automatiquement le positionnement, les modules et les fonctionnalités. Vous pourrez tout corriger ensuite.
          </p>
          <textarea value={smartText} onChange={(e) => setSmartText(e.target.value)} rows={4}
            placeholder="Ex. Un SaaS qui aide les créateurs à publier des ebooks sur Amazon KDP grâce à l'IA…"
            className="w-full rounded-xl border px-3 py-2 text-[14px] outline-none focus:border-[#E8951E] resize-y"
            style={{ borderColor: DS.BORDER, color: DS.INK }} />
          {smartError && <div className="mt-2 text-[12px] rounded-lg px-3 py-2" style={{ background: '#fdecea', color: '#b4443a' }}>{smartError}</div>}
          <div className="mt-2 flex justify-end">
            <AmberButton onClick={runAutofill} disabled={smartLoading || smartText.trim().length < 15}>
              {smartLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Génération…</> : <><Sparkles className="h-4 w-4" /> Générer le brouillon</>}
            </AmberButton>
          </div>
        </div>
      )}

      {/* Barre de score */}
      <ScoreBar detail={scoreDetail} />

      <div className="grid lg:grid-cols-[220px_1fr_320px] gap-5 mt-4">
        {/* Navigation des étapes */}
        <nav className="lg:sticky lg:top-4 self-start">
          <ol className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {STEPS.map((s, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <li key={s.key} className="shrink-0">
                  <button onClick={() => setStep(i)}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] transition-colors"
                    style={{
                      background: active ? DS.AMBER : done ? DS.AMBER_SOFT : '#fff',
                      color: active ? '#fff' : DS.INK,
                      border: `1px solid ${active ? DS.AMBER : DS.BORDER}`,
                    }}>
                    <span>{s.icon}</span>
                    <span className="font-medium whitespace-nowrap lg:whitespace-normal">{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Contenu de l'étape */}
        <div className="min-w-0">
          <div className="rounded-2xl border p-5" style={{ borderColor: DS.BORDER, background: '#fff' }}>
            <Current project={project} patch={patch} />
          </div>

          {step === STEPS.length - 1 && <EstimationCard estimation={estimation} unlocked={unlocked} />}

          <div className="mt-4 flex items-center justify-between">
            <AmberButton variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ChevronLeft className="h-4 w-4" /> Précédent
            </AmberButton>
            {step < STEPS.length - 1 ? (
              <AmberButton onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
                Suivant <ChevronRight className="h-4 w-4" />
              </AmberButton>
            ) : (
              <AmberButton onClick={runGenerate} disabled={estimation.deliverables === 0 || generating}
                title={estimation.deliverables === 0 ? 'Sélectionnez au moins un livrable' : undefined}>
                {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Génération…</> : <><FileStack className="h-4 w-4" /> Générer la documentation</>}
              </AmberButton>
            )}
          </div>
          {genError && <div className="mt-3 text-[12px] rounded-lg px-3 py-2" style={{ background: '#fdecea', color: '#b4443a' }}>{genError}</div>}
          {generating && <p className="mt-2 text-[12px]" style={{ color: DS.MUTED }}>L'IA rédige vos documents un par un… cela peut prendre jusqu'à une minute.</p>}

        {/* Aperçu (desktop) */}
        <aside className="hidden lg:block lg:sticky lg:top-4 self-start">
          <DocPreview project={project} />
        </aside>
      </div>

      <Copilot project={project} />
    </div>
  );
}

function ScoreBar({ detail }: { detail: { score: number; items: { label: string; ok: boolean; hint?: string }[] } }) {
  const [open, setOpen] = useState(false);
  const color = detail.score >= 80 ? '#1f9d6b' : detail.score >= 50 ? DS.AMBER_DEEP : '#c0663a';
  const missing = detail.items.filter((i) => !i.ok && i.hint);
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: DS.BORDER, background: '#fff' }}>
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-3">
        <Gauge className="h-5 w-5" style={{ color }} />
        <div className="flex-1">
          <div className="flex items-center justify-between text-[13px] font-semibold" style={{ color: DS.INK }}>
            <span>Score de complétude</span><span style={{ color }}>{detail.score}%</span>
          </div>
          <div className="mt-1.5 h-2 rounded-full" style={{ background: DS.CREAM }}>
            <div className="h-2 rounded-full transition-all" style={{ width: `${detail.score}%`, background: color }} />
          </div>
        </div>
      </button>
      {open && missing.length > 0 && (
        <ul className="mt-3 space-y-1 text-[12px]" style={{ color: DS.MUTED }}>
          {missing.map((m) => <li key={m.label} className="flex items-start gap-1.5"><span>•</span><span>{m.hint}</span></li>)}
        </ul>
      )}
      {open && missing.length === 0 && (
        <p className="mt-3 text-[12px]" style={{ color: '#1f9d6b' }}>Tout est complet — prêt pour la génération ✨</p>
      )}
    </div>
  );
}

function EstimationCard({ estimation, unlocked }: { estimation: { deliverables: number; pages: number; words: number; minutes: number }; unlocked: boolean }) {
  return (
    <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: DS.BORDER, background: DS.CREAM }}>
      <div className="flex items-center gap-2 text-[13px] font-semibold mb-3" style={{ color: DS.INK }}>
        <Clock className="h-4 w-4" style={{ color: DS.AMBER_DEEP }} /> Estimation avant génération
      </div>
      <div className="grid grid-cols-4 gap-3 text-center">
        <Stat value={estimation.deliverables} label="documents" />
        <Stat value={estimation.pages} label="pages" />
        <Stat value={estimation.words.toLocaleString('fr-FR')} label="mots" />
        <Stat value={`~${estimation.minutes} min`} label="génération" />
      </div>
      {!unlocked && (
        <p className="mt-3 text-[11px]" style={{ color: DS.AMBER_DEEP }}>
          🔓 La génération complète et les exports (Word, PDF, HTML, Markdown, PowerPoint) sont inclus dans le pack 197€.
        </p>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl bg-white py-2" style={{ border: `1px solid ${DS.BORDER}` }}>
      <div className="text-[18px] font-bold" style={{ color: DS.INK, fontFamily: DS.SERIF }}>{value}</div>
      <div className="text-[10px]" style={{ color: DS.MUTED }}>{label}</div>
    </div>
  );
}
