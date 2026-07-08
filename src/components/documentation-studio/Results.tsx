// Documentation Studio AI — page Résultats (aperçu des livrables + exports)
import React, { useMemo, useState } from 'react';
import { ArrowLeft, Download, Loader2, FileText, CheckCircle2, Lock } from 'lucide-react';
import { DS, EXPORT_FORMATS } from './constants';
import type { DocProject } from './types';
import { AmberButton } from './ui';
import { runExport, type GeneratedDoc } from './exporters';

function renderMarkdown(md: string): React.ReactNode {
  const lines = md.split('\n');
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (k: number) => {
    if (list.length) {
      out.push(<ul key={`ul${k}`} className="list-disc pl-5 my-2 space-y-1">{list.map((li, i) => <li key={i}>{inline(li)}</li>)}</ul>);
      list = [];
    }
  };
  const inline = (t: string): React.ReactNode => {
    const parts = t.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return parts.map((s, i) => s.startsWith('**') && s.endsWith('**') ? <strong key={i}>{s.slice(2, -2)}</strong> : <React.Fragment key={i}>{s}</React.Fragment>);
  };
  lines.forEach((raw, k) => {
    const line = raw.trim();
    if (!line) { flush(k); return; }
    if (/^###\s+/.test(line)) { flush(k); out.push(<h4 key={k} className="font-semibold mt-3 mb-1" style={{ color: DS.AMBER_DEEP }}>{line.replace(/^###\s+/, '')}</h4>); }
    else if (/^##\s+/.test(line)) { flush(k); out.push(<h3 key={k} className="font-semibold text-[15px] mt-4 mb-1" style={{ color: DS.INK }}>{line.replace(/^##\s+/, '')}</h3>); }
    else if (/^#\s+/.test(line)) { flush(k); out.push(<h2 key={k} className="font-bold text-[16px] mt-4 mb-1" style={{ color: DS.INK }}>{line.replace(/^#\s+/, '')}</h2>); }
    else if (/^>\s+/.test(line)) { flush(k); out.push(<blockquote key={k} className="border-l-2 pl-3 my-2 italic" style={{ borderColor: DS.AMBER, color: DS.MUTED }}>{line.replace(/^>\s+/, '')}</blockquote>); }
    else if (/^[-*]\s+/.test(line)) { list.push(line.replace(/^[-*]\s+/, '')); }
    else if (/^---+$/.test(line)) { flush(k); }
    else { flush(k); out.push(<p key={k} className="my-1.5">{inline(line)}</p>); }
  });
  flush(9999);
  return out;
}

export default function Results({
  project, documents, demo, onBack,
}: {
  project: DocProject;
  documents: GeneratedDoc[];
  demo: boolean;
  onBack: () => void;
}) {
  const [active, setActive] = useState(documents[0]?.id || '');
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const current = useMemo(() => documents.find((d) => d.id === active) || documents[0], [active, documents]);

  const doExport = async (format: string) => {
    if (busy) return;
    setErr(''); setBusy(format);
    try { await runExport(format, project, documents); }
    catch (e: any) { setErr(e?.message || 'Export impossible.'); }
    finally { setBusy(null); }
  };

  return (
    <div style={{ fontFamily: DS.SANS }}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <AmberButton variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Retour à l'éditeur</AmberButton>
        <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: '#1f9d6b' }}>
          <CheckCircle2 className="h-4 w-4" /> {documents.length} document{documents.length > 1 ? 's' : ''} généré{documents.length > 1 ? 's' : ''}
        </div>
      </div>

      {demo && (
        <div className="mb-4 flex items-start gap-2 rounded-xl px-4 py-3 text-[13px]" style={{ background: DS.AMBER_SOFT, color: DS.AMBER_DEEP, border: `1px solid ${DS.AMBER}55` }}>
          <Lock className="h-4 w-4 mt-0.5 shrink-0" />
          <span><strong>Aperçu démo.</strong> Voici un extrait généré gratuitement. Débloquez la génération complète de tous vos livrables et les exports (Word, PDF, HTML, Markdown, PowerPoint) avec le pack <strong>Documentation Studio à 197€</strong>.</span>
        </div>
      )}

      {/* Barre d'exports */}
      <div className="rounded-2xl border p-4 mb-4" style={{ borderColor: DS.BORDER, background: DS.CREAM }}>
        <div className="flex items-center gap-2 text-[13px] font-semibold mb-3" style={{ color: DS.INK }}>
          <Download className="h-4 w-4" style={{ color: DS.AMBER_DEEP }} /> Exporter la documentation complète
        </div>
        <div className="flex flex-wrap gap-2">
          {EXPORT_FORMATS.map((f) => (
            <button key={f.id} onClick={() => doExport(f.id)} disabled={!!busy}
              className="flex items-center gap-2 rounded-xl border px-3 py-2 text-[13px] font-medium transition-colors disabled:opacity-50"
              style={{ borderColor: DS.BORDER, background: '#fff', color: DS.INK }}>
              {busy === f.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>{f.icon}</span>}
              {f.label}
            </button>
          ))}
        </div>
        {err && <div className="mt-2 text-[12px] rounded-lg px-3 py-2" style={{ background: '#fdecea', color: '#b4443a' }}>{err}</div>}
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-5">
        {/* Liste des livrables */}
        <nav className="lg:sticky lg:top-4 self-start">
          <ol className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {documents.map((d) => {
              const on = d.id === current?.id;
              return (
                <li key={d.id} className="shrink-0">
                  <button onClick={() => setActive(d.id)}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px]"
                    style={{ background: on ? DS.AMBER : '#fff', color: on ? '#fff' : DS.INK, border: `1px solid ${on ? DS.AMBER : DS.BORDER}` }}>
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="font-medium whitespace-nowrap lg:whitespace-normal">{d.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Aperçu du document */}
        <article className="min-w-0 rounded-2xl border p-6" style={{ borderColor: DS.BORDER, background: '#fff' }}>
          <h2 className="text-xl font-semibold mb-3 pb-2" style={{ fontFamily: DS.SERIF, color: DS.INK, borderBottom: `2px solid ${DS.AMBER}` }}>{current?.label}</h2>
          <div className="text-[14px] leading-relaxed" style={{ color: DS.INK }}>{current && renderMarkdown(current.content)}</div>
        </article>
      </div>
    </div>
  );
}
