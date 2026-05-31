import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Swords, Sparkles, Trophy, ThumbsUp, AlertTriangle, Lightbulb, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Variant {
  label: string;
  hook: string;
  blurb: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
}
interface Report {
  variants: Variant[];
  winner_label: string;
  winner_reason: string;
  global_tips: string[];
}

const ACCENT = '#10B981';

const scoreColor = (s: number) => (s >= 80 ? '#10B981' : s >= 60 ? '#FF9E2D' : '#E94E77');

const DuelBlurb: React.FC = () => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [audience, setAudience] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  const run = async () => {
    if (summary.trim().length < 30 && title.trim().length < 2) {
      toast.error('Renseigne au moins le titre et un résumé du livre.');
      return;
    }
    setLoading(true); setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke('duel-blurb', {
        body: { title: title.trim(), genre: genre.trim(), audience: audience.trim(), summary: summary.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReport(data.report as Report);
    } catch (e: any) {
      toast.error(e?.message || "Échec du duel DUEL.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    toast.success('Copié');
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Titre du livre" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Genre (ex : thriller, dév. perso…)" value={genre} onChange={(e) => setGenre(e.target.value)} />
      </div>
      <Input placeholder="Public cible (optionnel)" value={audience} onChange={(e) => setAudience(e.target.value)} />
      <Textarea
        placeholder="Résumé / contenu du livre…"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={5}
      />
      <Button onClick={run} disabled={loading} style={{ background: ACCENT, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Swords className="h-4 w-4" />}
        <span className="ml-1.5">Lancer le duel des 4e de couverture</span>
      </Button>

      {loading && <p className="text-sm text-joy-ink/60">DUEL rédige et compare les variantes…</p>}

      {report && (
        <div className="space-y-4 text-sm">
          <div className="rounded-xl border p-3" style={{ background: `${ACCENT}10` }}>
            <p className="flex items-center gap-1.5 font-semibold"><Trophy className="h-4 w-4" style={{ color: ACCENT }} /> Variante recommandée : {report.winner_label}</p>
            <p className="mt-1 text-joy-ink/70">{report.winner_reason}</p>
          </div>

          <div className="space-y-3">
            {report.variants.map((v, i) => {
              const isWinner = v.label === report.winner_label;
              return (
                <div key={i} className="rounded-xl border p-3" style={isWinner ? { borderColor: ACCENT, borderWidth: 2 } : undefined}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 font-semibold">
                      {isWinner && <Trophy className="h-4 w-4" style={{ color: ACCENT }} />}
                      {v.label}
                    </span>
                    <Badge style={{ background: `${scoreColor(v.score)}22`, color: scoreColor(v.score) }}>{v.score}/100</Badge>
                  </div>
                  <p className="mt-1.5 font-medium italic">« {v.hook} »</p>
                  <p className="mt-2 whitespace-pre-wrap text-joy-ink/70">{v.blurb}</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold"><ThumbsUp className="h-3.5 w-3.5" style={{ color: ACCENT }} /> Forces</p>
                      <ul className="list-disc space-y-0.5 pl-5 text-joy-ink/70">{v.strengths.map((s, j) => <li key={j}>{s}</li>)}</ul>
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold"><AlertTriangle className="h-3.5 w-3.5" style={{ color: '#FF9E2D' }} /> Faiblesses</p>
                      <ul className="list-disc space-y-0.5 pl-5 text-joy-ink/70">{v.weaknesses.map((s, j) => <li key={j}>{s}</li>)}</ul>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={() => copy(v.blurb)}>
                    <Copy className="h-3.5 w-3.5" /> <span className="ml-1.5">Copier ce blurb</span>
                  </Button>
                </div>
              );
            })}
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold"><Lightbulb className="h-4 w-4" /> Conseils d'optimisation</p>
            <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">{report.global_tips.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuelBlurb;
