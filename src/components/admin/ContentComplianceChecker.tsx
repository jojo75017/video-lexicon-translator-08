import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const TEAL = '#008296';

interface Finding { line: number; excerpt: string; reason: string; severity: 'high' | 'medium'; }

// Règles déterministes de conformité contenu KDP (langage marketing, liens, mentions interdites)
const RULES: { re: RegExp; reason: string; severity: 'high' | 'medium' }[] = [
  { re: /https?:\/\/|www\.|\.com|\.fr|\.net/i, reason: 'Lien externe / URL — interdit dans le contenu KDP', severity: 'high' },
  { re: /\bbest[\s-]?seller\b|\bn°\s?1\b|\bnuméro\s?1\b|\bmeilleure?\s+vente/i, reason: 'Allégation promotionnelle ("best-seller", "n°1") interdite', severity: 'high' },
  { re: /\bgratuit\b|\bgratuitement\b|\bpromo(tion)?\b|\bréduction\b|\b-\s?\d+\s?%/i, reason: 'Langage promotionnel / prix dans le contenu', severity: 'medium' },
  { re: /\bamazon\b|\bkindle\b|\baudible\b/i, reason: 'Mention d\'Amazon/Kindle dans le corps du livre — à éviter', severity: 'medium' },
  { re: /\bcliquez ici\b|\bclick here\b|\bs'abonner\b|\bsubscribe\b/i, reason: 'Appel à l\'action de type web — interdit', severity: 'high' },
  { re: /\b(facebook|instagram|tiktok|twitter|youtube)\b/i, reason: 'Référence à un réseau social (lien implicite)', severity: 'medium' },
  { re: /\bemail\b|\be-mail\b|@\w+\.\w+/i, reason: 'Adresse email / collecte — vérifier la conformité', severity: 'medium' },
];

const ContentComplianceChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [scanned, setScanned] = useState(false);

  const findings = useMemo<Finding[]>(() => {
    if (!scanned) return [];
    const lines = text.split('\n');
    const out: Finding[] = [];
    lines.forEach((line, i) => {
      RULES.forEach((r) => {
        const m = line.match(r.re);
        if (m) {
          const idx = Math.max(0, (m.index ?? 0) - 20);
          out.push({ line: i + 1, excerpt: line.slice(idx, idx + 60).trim(), reason: r.reason, severity: r.severity });
        }
      });
    });
    return out;
  }, [text, scanned]);

  const run = () => setScanned(true);

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Colle le contenu de ton livre pour détecter les éléments interdits par les règles KDP
        (liens, allégations promotionnelles, mentions Amazon, appels à l'action) avant de soumettre,
        afin d'éviter le blocage de la publication.
      </p>
      <div>
        <Label className="text-xs">Contenu à vérifier</Label>
        <Textarea rows={10} value={text} onChange={(e) => { setText(e.target.value); setScanned(false); }} className="text-xs" placeholder="Colle ton manuscrit ou ta description…" />
      </div>
      <Button onClick={run} style={{ background: TEAL, color: 'white' }}>Analyser la conformité</Button>

      {scanned && (
        findings.length === 0 ? (
          <Card className="border-joy-ink/10"><CardContent className="p-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" style={{ color: '#10B981' }} />
            <span className="text-sm font-medium">Aucun problème détecté — contenu conforme aux règles vérifiées.</span>
          </CardContent></Card>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-semibold">{findings.length} point(s) à corriger</p>
            {findings.map((f, i) => (
              <Card key={i} className="border-joy-ink/10"><CardContent className="p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: f.severity === 'high' ? '#DC2626' : '#FF9E2D' }} />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">Ligne {f.line}</Badge>
                    <span className="text-[10px] font-semibold" style={{ color: f.severity === 'high' ? '#DC2626' : '#FF9E2D' }}>
                      {f.severity === 'high' ? 'Bloquant' : 'À vérifier'}
                    </span>
                  </div>
                  <p className="text-xs text-joy-ink/70">{f.reason}</p>
                  <code className="text-[11px] text-joy-ink/50">…{f.excerpt}…</code>
                </div>
              </CardContent></Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ContentComplianceChecker;
