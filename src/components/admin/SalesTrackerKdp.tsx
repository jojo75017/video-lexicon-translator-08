import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Trash2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TEAL = '#008296';
const STORAGE = 'kdp_sales_rows';

interface SaleRow { date: string; title: string; royalty: number; }

/** Détecte les colonnes date / titre / royalties dans un CSV KDP exporté. */
function parseCsv(text: string): SaleRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const delim = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(delim).map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  const findIdx = (keys: string[]) => headers.findIndex((h) => keys.some((k) => h.includes(k)));
  const dIdx = findIdx(['date', 'mois', 'month', 'période']);
  const tIdx = findIdx(['titre', 'title', 'asin', 'book']);
  const rIdx = findIdx(['royalt', 'revenu', 'gain', 'earning', 'montant']);
  const rows: SaleRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(delim).map((c) => c.trim().replace(/^"|"$/g, ''));
    const royalty = parseFloat((cells[rIdx] || '0').replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
    rows.push({
      date: cells[dIdx] || `Ligne ${i}`,
      title: cells[tIdx] || 'Titre inconnu',
      royalty,
    });
  }
  return rows.filter((r) => r.royalty !== 0 || r.title !== 'Titre inconnu');
}

const SalesTrackerKdp: React.FC = () => {
  const [csv, setCsv] = useState('');
  const [rows, setRows] = useState<SaleRow[]>([]);

  useEffect(() => {
    try { const s = localStorage.getItem(STORAGE); if (s) setRows(JSON.parse(s)); } catch { /* noop */ }
  }, []);

  const persist = (next: SaleRow[]) => {
    setRows(next);
    try { localStorage.setItem(STORAGE, JSON.stringify(next)); } catch { /* noop */ }
  };

  const importCsv = () => {
    const parsed = parseCsv(csv);
    if (parsed.length === 0) return toast.error('Aucune ligne détectée. Vérifie le format CSV (colonnes date, titre, royalties).');
    persist([...rows, ...parsed]);
    setCsv('');
    toast.success(`${parsed.length} lignes importées ✓`);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setCsv(String(reader.result || ''));
    reader.readAsText(f);
  };

  const byMonth = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      const key = (r.date.match(/\d{4}-\d{2}/) || r.date.match(/\d{2}\/\d{4}/) || [r.date])[0];
      map[key] = (map[key] || 0) + r.royalty;
    });
    return Object.entries(map).map(([month, total]) => ({ month, total: Math.round(total * 100) / 100 }));
  }, [rows]);

  const byTitle = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => { map[r.title] = (map[r.title] || 0) + r.royalty; });
    return Object.entries(map).map(([title, total]) => ({ title, total: Math.round(total * 100) / 100 }))
      .sort((a, b) => b.total - a.total);
  }, [rows]);

  const grand = useMemo(() => Math.round(rows.reduce((s, r) => s + r.royalty, 0) * 100) / 100, [rows]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Importe ton rapport de royalties Amazon KDP (CSV) pour visualiser tes revenus par mois et par titre. Aucune donnée inventée — uniquement tes chiffres réels.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer rounded-md border px-3 py-1.5 hover:bg-joy-cream/40">
          <Upload className="h-3.5 w-3.5" /> Charger un fichier CSV
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={onFile} />
        </label>
        {rows.length > 0 && (
          <Button variant="ghost" size="sm" className="text-red-600 gap-1.5"
            onClick={() => persist([])}><Trash2 className="h-3.5 w-3.5" /> Vider</Button>
        )}
      </div>

      <Textarea rows={5} value={csv} onChange={(e) => setCsv(e.target.value)} className="font-mono text-xs"
        placeholder="Colle ici le contenu CSV (date,titre,royalties)…" />
      <Button onClick={importCsv} disabled={!csv.trim()} style={{ background: TEAL, color: 'white' }}>
        Importer
      </Button>

      {rows.length > 0 && (
        <div className="space-y-4">
          <Card className="border-joy-ink/10"><CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-bold mb-3"><TrendingUp className="h-4 w-4" style={{ color: TEAL }} /> Revenus par mois — total {grand.toLocaleString('fr-FR')} €</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v) => `${v} €`} />
                <Bar dataKey="total" fill={TEAL} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent></Card>

          <Card className="border-joy-ink/10"><CardContent className="p-4">
            <div className="text-sm font-bold mb-3">Revenus par titre</div>
            <ul className="space-y-1.5">
              {byTitle.map((t) => (
                <li key={t.title} className="flex items-center justify-between text-xs border-b border-joy-ink/5 pb-1.5">
                  <span className="truncate pr-2">{t.title}</span>
                  <span className="font-semibold whitespace-nowrap">{t.total.toLocaleString('fr-FR')} €</span>
                </li>
              ))}
            </ul>
          </CardContent></Card>
        </div>
      )}
    </div>
  );
};

export default SalesTrackerKdp;
