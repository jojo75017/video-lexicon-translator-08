// Documentation Studio AI — Copilot flottant (assiste sans jamais remplacer l'utilisateur)
import React, { useState } from 'react';
import { Bot, X, Send, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DS } from './constants';
import type { DocProject } from './types';

function buildContext(p: DocProject): string {
  return [
    `Produit: ${p.project.name} (${p.productType || 'type non défini'})`,
    p.project.slogan && `Slogan: ${p.project.slogan}`,
    p.positioning.vision && `Vision: ${p.positioning.vision}`,
    p.positioning.audience && `Public: ${p.positioning.audience}`,
    p.positioning.problem && `Problème: ${p.positioning.problem}`,
    p.modules.length && `Modules: ${p.modules.map((m) => m.name).join(', ')}`,
    p.features.length && `Fonctionnalités: ${p.features.map((f) => f.name).join(', ')}`,
  ].filter(Boolean).join('\n');
}

const SUGGESTIONS = [
  'Améliore ma vision et ma mission',
  'Propose 3 fonctionnalités que j\'oublie souvent',
  'Rends ma promesse plus percutante',
];

export default function Copilot({ project }: { project: DocProject }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [error, setError] = useState('');

  const ask = async (question: string) => {
    if (!question.trim() || loading) return;
    setError('');
    setMessages((m) => [...m, { role: 'user', text: question }]);
    setQ('');
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('documentation-studio-assist', {
        body: { action: 'copilot', question, context: buildContext(project) },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setMessages((m) => [...m, { role: 'ai', text: (data as any).text || '' }]);
    } catch (e: any) {
      setError(e?.message || 'Le Copilot est momentanément indisponible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full text-white shadow-lg transition-transform hover:scale-105"
          style={{ background: DS.AMBER, boxShadow: '0 12px 30px -10px rgba(232,149,30,.8)' }}
          title="Documentation Copilot">
          <Bot className="h-6 w-6" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 z-40 flex w-[92vw] max-w-sm flex-col rounded-2xl border bg-white shadow-2xl"
          style={{ borderColor: DS.BORDER, maxHeight: '70vh' }}>
          <div className="flex items-center justify-between px-4 py-3 rounded-t-2xl"
            style={{ background: DS.AMBER_SOFT, borderBottom: `1px solid ${DS.BORDER}` }}>
            <div className="flex items-center gap-2 text-[14px] font-semibold" style={{ color: DS.INK }}>
              <Bot className="h-4 w-4" style={{ color: DS.AMBER_DEEP }} /> Documentation Copilot
            </div>
            <button onClick={() => setOpen(false)} className="text-[--muted]" style={{ color: DS.MUTED }}><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-[12px]" style={{ color: DS.MUTED }}>
                  Je vous aide à rédiger — je propose, j'améliore, mais vous gardez le contrôle. Essayez :
                </p>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => ask(s)}
                    className="block w-full text-left rounded-xl border px-3 py-2 text-[12px] transition-colors hover:bg-[#FFF3DF]"
                    style={{ borderColor: DS.BORDER, color: DS.INK }}>
                    <Sparkles className="inline h-3 w-3 mr-1" style={{ color: DS.AMBER_DEEP }} />{s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`rounded-xl px-3 py-2 text-[12.5px] leading-snug whitespace-pre-wrap ${m.role === 'user' ? 'ml-6' : 'mr-6'}`}
                style={m.role === 'user'
                  ? { background: DS.AMBER, color: '#fff' }
                  : { background: DS.CREAM, color: DS.INK, border: `1px solid ${DS.BORDER}` }}>
                {m.text}
              </div>
            ))}
            {loading && <div className="flex items-center gap-2 text-[12px]" style={{ color: DS.MUTED }}><Loader2 className="h-4 w-4 animate-spin" /> Le Copilot réfléchit…</div>}
            {error && <div className="text-[12px] rounded-lg px-3 py-2" style={{ background: '#fdecea', color: '#b4443a' }}>{error}</div>}
          </div>
          <div className="p-2 border-t" style={{ borderColor: DS.BORDER }}>
            <div className="flex items-center gap-2">
              <input value={q} onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && ask(q)}
                placeholder="Demandez une amélioration…"
                className="flex-1 rounded-xl border px-3 py-2 text-[13px] outline-none focus:border-[#E8951E]"
                style={{ borderColor: DS.BORDER, color: DS.INK }} />
              <button onClick={() => ask(q)} disabled={loading || !q.trim()}
                className="grid h-9 w-9 place-items-center rounded-xl text-white disabled:opacity-40"
                style={{ background: DS.AMBER }}><Send className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
