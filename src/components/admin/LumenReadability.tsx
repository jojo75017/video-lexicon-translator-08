import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Gauge, Sparkles, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface Issue { type: string; excerpt: string; suggestion: string; severity: string; }
interface Report {
  readability_score: number;
  readability_label: string;
  avg_sentence_length: number;
  rhythm: string;
  tone: string;
  strengths: string[];
  issues: Issue[];
  suggestions: string[];
}

const sevColor = (s: string) => {
  const v = s.toLowerCase();
  if (v.includes('élev') || v.includes('haut') || v.includes('high')) return '#E94E77';
  if (v.includes('moy') || v.includes('med')) return '#FF9E2D';
  return '#10B981';
};

const LumenReadability: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  const run = async () => {
    if (text.trim().length < 50) { toast.error('Colle un texte à analyser (min. 50 caractères).'); return; }
    setLoading(true); setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke('lumen-readability', { body: { text: text.trim() } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReport(data.report as Report);
    } catch (e: any) {
      toast.error(e?.message || "Échec de l'audit LUMEN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Colle un chapitre ou un extrait à auditer…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
      />
      <Button onClick={run} disabled={loading} style={{ background: '#10B981', color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Auditer la lisibilité</span>
      </Button>

      {loading && <p className="text-sm text-joy-ink/60">LUMEN analyse le rythme et la lisibilité…</p>}

      {report && (
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl border p-3 text-center">
              <Gauge className="mx-auto h-5 w-5" style={{ color: '#10B981' }} />
              <div className="mt-1 text-2xl font-bold" style={{ color: '#10B981' }}>{report.readability_score}</div>
              <div className="text-joy-ink/60">{report.readability_label}</div>
            </div>
            <div className="flex-1 rounded-xl border p-3">
              <p><span className="font-medium">Phrases :</span> {report.avg_sentence_length} mots en moyenne</p>
              <p className="mt-1"><span className="font-medium">Ton :</span> {report.tone}</p>
              <p className="mt-1 text-joy-ink/70"><span className="font-medium text-joy-ink/80">Rythme :</span> {report.rhythm}</p>
            </div>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold"><CheckCircle2 className="h-4 w-4" style={{ color: '#10B981' }} /> Points forts</p>
            <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">
              {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold"><AlertTriangle className="h-4 w-4" style={{ color: '#FF9E2D' }} /> Problèmes détectés</p>
            <div className="space-y-2">
              {report.issues.map((it, i) => (
                <div key={i} className="rounded-lg border p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{it.type}</span>
                    <Badge style={{ background: `${sevColor(it.severity)}22`, color: sevColor(it.severity) }}>{it.severity}</Badge>
                  </div>
                  <p className="mt-1 italic text-joy-ink/60">« {it.excerpt} »</p>
                  <p className="mt-1 text-joy-ink/70"><span className="font-medium text-joy-ink/80">Suggestion :</span> {it.suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold"><Lightbulb className="h-4 w-4" /> Conseils globaux</p>
            <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">
              {report.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LumenReadability;
