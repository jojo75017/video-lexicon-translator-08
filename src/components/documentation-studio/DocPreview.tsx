// Documentation Studio AI — aperçu live du document (colonne droite desktop)
import React from 'react';
import { DS, PRODUCT_TYPES, DOC_TEMPLATES, ALL_DELIVERABLES } from './constants';
import type { DocProject } from './types';

export default function DocPreview({ project }: { project: DocProject }) {
  const type = PRODUCT_TYPES.find((t) => t.id === project.productType);
  const template = DOC_TEMPLATES.find((t) => t.id === project.identity.template);
  const selected = ALL_DELIVERABLES.filter((d) => project.exports.includes(d.id));

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: DS.BORDER, background: '#fff' }}>
      <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-2"
        style={{ background: DS.CREAM, color: DS.MUTED, borderBottom: `1px solid ${DS.BORDER}` }}>
        <span>👁️</span> Aperçu du document
      </div>
      {/* couverture */}
      <div className="p-6 text-center" style={{ background: `linear-gradient(160deg, ${DS.AMBER_SOFT}, #fff)` }}>
        {project.identity.logo || project.project.logo ? (
          <img src={project.identity.logo || project.project.logo} alt="" className="mx-auto h-12 object-contain mb-3" />
        ) : (
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl text-2xl"
            style={{ background: '#fff', border: `1px solid ${DS.BORDER}` }}>{type?.icon || '📘'}</div>
        )}
        <div className="text-[20px] font-semibold leading-tight" style={{ fontFamily: DS.SERIF, color: DS.INK }}>
          {project.project.name || 'Nom du produit'}
        </div>
        {project.project.slogan && <div className="text-[12px] mt-1" style={{ color: DS.AMBER_DEEP }}>{project.project.slogan}</div>}
        <div className="mt-2 flex items-center justify-center gap-2 text-[10px]" style={{ color: DS.MUTED }}>
          {type && <span className="rounded-full px-2 py-0.5" style={{ background: '#fff', border: `1px solid ${DS.BORDER}` }}>{type.label}</span>}
          {project.project.version && <span>v{project.project.version}</span>}
          {template && <span>· Modèle {template.label}</span>}
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-[420px] overflow-auto">
        <PreviewBlock title="Vision" text={project.positioning.vision} />
        <PreviewBlock title="Mission" text={project.positioning.mission} />
        <PreviewBlock title="Public cible" text={project.positioning.audience} />
        <PreviewBlock title="Promesse" text={project.positioning.promise} />

        {project.modules.length > 0 && (
          <div>
            <PreviewLabel>Modules ({project.modules.length})</PreviewLabel>
            <div className="space-y-1">
              {project.modules.map((m) => (
                <div key={m.id} className="text-[12px] flex items-start gap-1.5" style={{ color: DS.INK }}>
                  <span>{m.icon}</span><span className="font-medium">{m.name || 'Module sans nom'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.features.length > 0 && (
          <div>
            <PreviewLabel>Fonctionnalités ({project.features.length})</PreviewLabel>
            <ul className="list-disc pl-4 text-[12px] space-y-0.5" style={{ color: DS.INK }}>
              {project.features.map((f) => <li key={f.id}>{f.name || 'Fonctionnalité'}</li>)}
            </ul>
          </div>
        )}

        {project.agents.length > 0 && (
          <div>
            <PreviewLabel>Agents IA ({project.agents.length})</PreviewLabel>
            <ul className="list-disc pl-4 text-[12px] space-y-0.5" style={{ color: DS.INK }}>
              {project.agents.map((a) => <li key={a.id}>{a.name || 'Agent'}</li>)}
            </ul>
          </div>
        )}

        {selected.length > 0 && (
          <div>
            <PreviewLabel>Livrables sélectionnés ({selected.length})</PreviewLabel>
            <div className="flex flex-wrap gap-1">
              {selected.map((d) => (
                <span key={d.id} className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ background: DS.AMBER_SOFT, color: DS.AMBER_DEEP }}>{d.label}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: DS.AMBER_DEEP }}>{children}</div>;
}
function PreviewBlock({ title, text }: { title: string; text: string }) {
  if (!text?.trim()) return null;
  return (
    <div>
      <PreviewLabel>{title}</PreviewLabel>
      <p className="text-[12px] leading-snug" style={{ color: DS.INK }}>{text}</p>
    </div>
  );
}
