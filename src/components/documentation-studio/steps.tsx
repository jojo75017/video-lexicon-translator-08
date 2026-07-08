// Documentation Studio AI — étapes du wizard
import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, Check } from 'lucide-react';
import type { DocProject } from './types';
import { newModule, newFeature, newAgent } from './types';
import {
  DS, PRODUCT_TYPES, DOC_TEMPLATES, DELIVERABLE_GROUPS, EXPORT_FORMATS, MODULE_ICONS, STEPS,
} from './constants';
import { Field, Area, StepIntro } from './ui';

type PatchFn = (updater: (p: DocProject) => DocProject) => void;
interface StepProps { project: DocProject; patch: PatchFn }

/* ============ Étape 0 — Type de produit ============ */
export function StepType({ project, patch }: StepProps) {
  return (
    <div>
      <StepIntro icon={STEPS[0].icon} title={STEPS[0].label} help={STEPS[0].help} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PRODUCT_TYPES.map((t) => {
          const active = project.productType === t.id;
          return (
            <button key={t.id}
              onClick={() => patch((p) => ({ ...p, productType: t.id }))}
              className="text-left rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5"
              style={{
                borderColor: active ? DS.AMBER : DS.BORDER,
                boxShadow: active ? '0 10px 26px -16px rgba(232,149,30,.7)' : 'none',
                background: active ? DS.AMBER_SOFT : '#fff',
              }}>
              <div className="text-2xl mb-1">{t.icon}</div>
              <div className="text-[14px] font-semibold" style={{ color: DS.INK }}>{t.label}</div>
              <div className="text-[11px] mt-0.5" style={{ color: DS.MUTED }}>{t.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============ Étape 1 — Projet ============ */
export function StepProject({ project, patch }: StepProps) {
  const s = project.project;
  const set = (k: keyof typeof s) => (v: string) => patch((p) => ({ ...p, project: { ...p.project, [k]: v } }));
  return (
    <div>
      <StepIntro icon={STEPS[1].icon} title={STEPS[1].label} help={STEPS[1].help} />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Nom du produit" value={s.name} onChange={set('name')} placeholder="Ex. EbookStudio Pro" />
        <Field label="Version" value={s.version} onChange={set('version')} placeholder="1.0" />
        <Field label="Entreprise / éditeur" value={s.company} onChange={set('company')} placeholder="Votre société" />
        <Field label="Site web" value={s.website} onChange={set('website')} placeholder="https://…" />
        <Field label="Slogan" value={s.slogan} onChange={set('slogan')} placeholder="La promesse en une phrase" />
        <Field label="Langue" value={s.language} onChange={set('language')} placeholder="Français" />
        <Field label="Logo (URL)" value={s.logo} onChange={set('logo')} placeholder="https://…/logo.png" hint="Optionnel — collez l'URL de votre logo." />
      </div>
    </div>
  );
}

/* ============ Étape 2 — Positionnement ============ */
export function StepPositioning({ project, patch }: StepProps) {
  const s = project.positioning;
  const set = (k: keyof typeof s) => (v: string) => patch((p) => ({ ...p, positioning: { ...p.positioning, [k]: v } }));
  return (
    <div>
      <StepIntro icon={STEPS[2].icon} title={STEPS[2].label} help={STEPS[2].help} />
      <div className="grid gap-4">
        <Area label="Vision" value={s.vision} onChange={set('vision')} placeholder="Où voulez-vous emmener vos utilisateurs ?" />
        <Area label="Mission" value={s.mission} onChange={set('mission')} placeholder="Ce que votre produit fait concrètement." />
        <Area label="Valeurs" value={s.values} onChange={set('values')} placeholder="Ex. simplicité, transparence, performance" rows={2} />
        <Area label="Public cible" value={s.audience} onChange={set('audience')} placeholder="À qui s'adresse le produit ?" rows={2} />
        <Area label="Problème résolu" value={s.problem} onChange={set('problem')} placeholder="Quel problème réel votre produit règle-t-il ?" />
        <Area label="Promesse unique" value={s.promise} onChange={set('promise')} placeholder="Votre proposition de valeur différenciante." rows={2} />
        <Area label="Avantages clés" value={s.advantages} onChange={set('advantages')} placeholder="Listez les bénéfices principaux." />
      </div>
    </div>
  );
}

/* ============ Étape 3 — Identité visuelle ============ */
export function StepIdentity({ project, patch }: StepProps) {
  const s = project.identity;
  const set = (k: keyof typeof s) => (v: string) => patch((p) => ({ ...p, identity: { ...p.identity, [k]: v } }));
  return (
    <div>
      <StepIntro icon={STEPS[3].icon} title={STEPS[3].label} help={STEPS[3].help} />
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <Field label="Logo (URL)" value={s.logo} onChange={set('logo')} placeholder="https://…/logo.png" />
        <Field label="Couleurs de marque" value={s.colors} onChange={set('colors')} placeholder="Ex. #E8951E, #2A2118" />
        <Field label="Typographies" value={s.typography} onChange={set('typography')} placeholder="Ex. Inter + Instrument Serif" />
        <Field label="Style souhaité" value={s.style} onChange={set('style')} placeholder="Ex. premium, épuré, chaleureux" />
      </div>
      <div className="text-[13px] font-semibold mb-2" style={{ color: DS.INK }}>Modèle de documentation</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DOC_TEMPLATES.map((t) => {
          const active = s.template === t.id;
          return (
            <button key={t.id} onClick={() => set('template')(t.id)}
              className="text-left rounded-2xl border bg-white p-3 transition-all hover:-translate-y-0.5"
              style={{ borderColor: active ? DS.AMBER : DS.BORDER, boxShadow: active ? '0 10px 26px -16px rgba(232,149,30,.7)' : 'none' }}>
              <div className="flex gap-1 mb-2">
                {t.swatch.map((c, i) => <span key={i} className="h-5 w-5 rounded-md border" style={{ background: c, borderColor: DS.BORDER }} />)}
              </div>
              <div className="text-[13px] font-semibold flex items-center gap-1" style={{ color: DS.INK }}>
                {t.label}{active && <Check className="h-3.5 w-3.5" style={{ color: DS.AMBER_DEEP }} />}
              </div>
              <div className="text-[11px]" style={{ color: DS.MUTED }}>{t.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============ util : réordonner ============ */
function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

/* ============ Étape 4 — Modules ============ */
export function StepModules({ project, patch }: StepProps) {
  const set = (id: string, k: string, v: string) =>
    patch((p) => ({ ...p, modules: p.modules.map((m) => (m.id === id ? { ...m, [k]: v } : m)) }));
  return (
    <div>
      <StepIntro icon={STEPS[4].icon} title={STEPS[4].label} help={STEPS[4].help} />
      <div className="space-y-3">
        {project.modules.map((m, i) => (
          <div key={m.id} className="rounded-2xl border bg-white p-4" style={{ borderColor: DS.BORDER }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <select value={m.icon} onChange={(e) => set(m.id, 'icon', e.target.value)}
                  className="rounded-lg border px-2 py-1 text-lg" style={{ borderColor: DS.BORDER }}>
                  {MODULE_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <span className="text-[12px] font-semibold" style={{ color: DS.MUTED }}>Module {i + 1}</span>
              </div>
              <div className="flex gap-1">
                <IconBtn onClick={() => patch((p) => ({ ...p, modules: move(p.modules, i, -1) }))}><ArrowUp className="h-4 w-4" /></IconBtn>
                <IconBtn onClick={() => patch((p) => ({ ...p, modules: move(p.modules, i, 1) }))}><ArrowDown className="h-4 w-4" /></IconBtn>
                <IconBtn onClick={() => patch((p) => ({ ...p, modules: p.modules.filter((x) => x.id !== m.id) }))} danger><Trash2 className="h-4 w-4" /></IconBtn>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Nom" value={m.name} onChange={(v) => set(m.id, 'name', v)} placeholder="Ex. Tableau de bord" />
              <Field label="Public visé" value={m.audience} onChange={(v) => set(m.id, 'audience', v)} placeholder="Ex. administrateurs" />
              <Area label="Description" value={m.description} onChange={(v) => set(m.id, 'description', v)} rows={2} />
              <Area label="Fonction principale" value={m.fonction} onChange={(v) => set(m.id, 'fonction', v)} rows={2} />
              <Field label="Capture (URL)" value={m.capture} onChange={(v) => set(m.id, 'capture', v)} placeholder="https://… (optionnel)" />
            </div>
          </div>
        ))}
      </div>
      <AddRow label="Ajouter un module" onClick={() => patch((p) => ({ ...p, modules: [...p.modules, newModule()] }))} />
    </div>
  );
}

/* ============ Étape 5 — Fonctionnalités ============ */
export function StepFeatures({ project, patch }: StepProps) {
  const set = (id: string, k: string, v: string) =>
    patch((p) => ({ ...p, features: p.features.map((f) => (f.id === id ? { ...f, [k]: v } : f)) }));
  return (
    <div>
      <StepIntro icon={STEPS[5].icon} title={STEPS[5].label} help={STEPS[5].help} />
      <div className="space-y-3">
        {project.features.map((f, i) => (
          <div key={f.id} className="rounded-2xl border bg-white p-4" style={{ borderColor: DS.BORDER }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold" style={{ color: DS.MUTED }}>Fonctionnalité {i + 1}</span>
              <div className="flex gap-1">
                <IconBtn onClick={() => patch((p) => ({ ...p, features: move(p.features, i, -1) }))}><ArrowUp className="h-4 w-4" /></IconBtn>
                <IconBtn onClick={() => patch((p) => ({ ...p, features: move(p.features, i, 1) }))}><ArrowDown className="h-4 w-4" /></IconBtn>
                <IconBtn onClick={() => patch((p) => ({ ...p, features: p.features.filter((x) => x.id !== f.id) }))} danger><Trash2 className="h-4 w-4" /></IconBtn>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Nom" value={f.name} onChange={(v) => set(f.id, 'name', v)} placeholder="Ex. Export automatique" />
              <Field label="Capture (URL)" value={f.capture} onChange={(v) => set(f.id, 'capture', v)} placeholder="https://… (optionnel)" />
              <Area label="Description" value={f.description} onChange={(v) => set(f.id, 'description', v)} rows={2} />
              <Area label="Exemple d'utilisation" value={f.example} onChange={(v) => set(f.id, 'example', v)} rows={2} />
              <Area label="Astuce" value={f.tip} onChange={(v) => set(f.id, 'tip', v)} rows={2} />
            </div>
          </div>
        ))}
      </div>
      <AddRow label="Ajouter une fonctionnalité" onClick={() => patch((p) => ({ ...p, features: [...p.features, newFeature()] }))} />
    </div>
  );
}

/* ============ Étape 6 — Agents IA ============ */
export function StepAgents({ project, patch }: StepProps) {
  const set = (id: string, k: string, v: string) =>
    patch((p) => ({ ...p, agents: p.agents.map((a) => (a.id === id ? { ...a, [k]: v } : a)) }));
  return (
    <div>
      <StepIntro icon={STEPS[6].icon} title={STEPS[6].label} help={STEPS[6].help} />
      <div className="space-y-3">
        {project.agents.map((a, i) => (
          <div key={a.id} className="rounded-2xl border bg-white p-4" style={{ borderColor: DS.BORDER }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold" style={{ color: DS.MUTED }}>Agent {i + 1}</span>
              <IconBtn onClick={() => patch((p) => ({ ...p, agents: p.agents.filter((x) => x.id !== a.id) }))} danger><Trash2 className="h-4 w-4" /></IconBtn>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Nom de l'agent" value={a.name} onChange={(v) => set(a.id, 'name', v)} placeholder="Ex. Copilot" />
              <Field label="Personnalité" value={a.personality} onChange={(v) => set(a.id, 'personality', v)} placeholder="Ex. amical, expert" />
              <Area label="Mission" value={a.mission} onChange={(v) => set(a.id, 'mission', v)} rows={2} />
              <Area label="Compétences" value={a.skills} onChange={(v) => set(a.id, 'skills', v)} rows={2} />
              <Area label="Workflow" value={a.workflow} onChange={(v) => set(a.id, 'workflow', v)} rows={2} />
              <Area label="Cas d'usage" value={a.useCases} onChange={(v) => set(a.id, 'useCases', v)} rows={2} />
              <div className="md:col-span-2">
                <Area label="Prompt système" value={a.systemPrompt} onChange={(v) => set(a.id, 'systemPrompt', v)} rows={3} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddRow label="Ajouter un agent IA" onClick={() => patch((p) => ({ ...p, agents: [...p.agents, newAgent()] }))} />
    </div>
  );
}

/* ============ Étape 7 — Exports ============ */
export function StepExports({ project, patch }: StepProps) {
  const toggle = (id: string) => patch((p) => ({
    ...p,
    exports: p.exports.includes(id) ? p.exports.filter((x) => x !== id) : [...p.exports, id],
  }));
  return (
    <div>
      <StepIntro icon={STEPS[7].icon} title={STEPS[7].label} help={STEPS[7].help} />
      <div className="space-y-5">
        {DELIVERABLE_GROUPS.map((g) => (
          <div key={g.id}>
            <div className="text-[14px] font-semibold mb-2 flex items-center gap-2" style={{ color: DS.INK }}>
              <span>{g.icon}</span> {g.label}
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {g.items.map((it) => {
                const active = project.exports.includes(it.id);
                return (
                  <button key={it.id} onClick={() => toggle(it.id)}
                    className="text-left rounded-xl border bg-white p-3 transition-all flex items-start gap-2.5"
                    style={{ borderColor: active ? DS.AMBER : DS.BORDER, background: active ? DS.AMBER_SOFT : '#fff' }}>
                    <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-md border shrink-0"
                      style={{ borderColor: active ? DS.AMBER : DS.BORDER, background: active ? DS.AMBER : '#fff' }}>
                      {active && <Check className="h-3.5 w-3.5 text-white" />}
                    </span>
                    <span>
                      <span className="text-[13px] font-semibold block" style={{ color: DS.INK }}>{it.label}</span>
                      <span className="text-[11px]" style={{ color: DS.MUTED }}>{it.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="rounded-xl border p-3" style={{ borderColor: DS.BORDER, background: DS.CREAM }}>
          <div className="text-[13px] font-semibold mb-1" style={{ color: DS.INK }}>Formats disponibles à la génération</div>
          <div className="flex flex-wrap gap-2">
            {EXPORT_FORMATS.map((f) => (
              <span key={f.id} className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-medium border"
                style={{ borderColor: DS.BORDER, color: DS.INK, background: '#fff' }}>
                <span>{f.icon}</span> {f.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ helpers UI ============ */
function IconBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-lg border transition-colors hover:bg-[#FFF3DF]"
      style={{ borderColor: DS.BORDER, color: danger ? '#b4443a' : DS.MUTED }}>
      {children}
    </button>
  );
}

function AddRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="mt-3 w-full rounded-2xl border-2 border-dashed py-3 text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors hover:bg-[#FFF3DF]"
      style={{ borderColor: `${DS.AMBER}66`, color: DS.AMBER_DEEP }}>
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

export const STEP_COMPONENTS = [StepType, StepProject, StepPositioning, StepIdentity, StepModules, StepFeatures, StepAgents, StepExports];
