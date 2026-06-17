import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

const BLEU = '#1D4ED8';
const LS_KEY = 'v3_catalog_dashboard';

const CHANNELS = ['Amazon', 'Kobo', 'Apple', 'Google', 'Fnac'] as const;
type Channel = typeof CHANNELS[number];

interface CatalogTitle {
  id: string;
  title: string;
  collection: string;
  isbn: string;
  legalDeposit: boolean;
  channels: Record<Channel, boolean>;
}

const emptyChannels = (): Record<Channel, boolean> =>
  Object.fromEntries(CHANNELS.map((c) => [c, false])) as Record<Channel, boolean>;

/**
 * Tableau de Bord Catalogue — vue d'ensemble éditeur : titres, collections,
 * statut de diffusion par canal, ISBN et dépôt légal.
 */
const CatalogDashboard: React.FC = () => {
  const [titles, setTitles] = useState<CatalogTitle[]>([]);
  const [draft, setDraft] = useState({ title: '', collection: '', isbn: '' });

  useEffect(() => {
    try { const r = localStorage.getItem(LS_KEY); if (r) setTitles(JSON.parse(r)); } catch {}
  }, []);

  const persist = (next: CatalogTitle[]) => {
    setTitles(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  };

  const add = () => {
    if (!draft.title.trim()) return toast.error('Titre requis.');
    persist([...titles, { id: crypto.randomUUID(), ...draft, legalDeposit: false, channels: emptyChannels() }]);
    setDraft({ title: '', collection: '', isbn: '' });
  };

  const toggleChannel = (id: string, ch: Channel) =>
    persist(titles.map((t) => (t.id === id ? { ...t, channels: { ...t.channels, [ch]: !t.channels[ch] } } : t)));
  const toggleDeposit = (id: string) =>
    persist(titles.map((t) => (t.id === id ? { ...t, legalDeposit: !t.legalDeposit } : t)));
  const remove = (id: string) => persist(titles.filter((t) => t.id !== id));

  const totalSlots = titles.length * CHANNELS.length;
  const liveSlots = titles.reduce((n, t) => n + CHANNELS.filter((c) => t.channels[c]).length, 0);
  const coverage = totalSlots ? Math.round((liveSlots / totalSlots) * 100) : 0;

  return (
    <div className="space-y-5">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <LayoutGrid className="h-4 w-4" style={{ color: BLEU }} />
        Pilotez tout votre catalogue : diffusion par canal, ISBN et dépôt légal en un coup d'œil.
      </p>

      {titles.length > 0 && (
        <Card className="border-joy-ink/10"><CardContent className="p-3 flex items-center justify-between text-xs">
          <span>{titles.length} titre{titles.length > 1 ? 's' : ''} au catalogue</span>
          <span style={{ color: BLEU }}>Couverture diffusion : {coverage}%</span>
        </CardContent></Card>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label className="text-xs">Titre *</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
        <div><Label className="text-xs">Collection</Label><Input value={draft.collection} onChange={(e) => setDraft({ ...draft, collection: e.target.value })} /></div>
        <div><Label className="text-xs">ISBN</Label><Input value={draft.isbn} onChange={(e) => setDraft({ ...draft, isbn: e.target.value })} /></div>
      </div>
      <Button onClick={add} style={{ background: BLEU, color: 'white' }} className="gap-1.5">
        <Plus className="h-4 w-4" /> Ajouter un titre
      </Button>

      {titles.length > 0 && (
        <div className="space-y-2">
          {titles.map((t) => (
            <Card key={t.id} className="border-joy-ink/10">
              <CardContent className="p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{t.title}</p>
                    <p className="text-joy-ink/60">{t.collection || '—'}{t.isbn ? ` · ${t.isbn}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleDeposit(t.id)}
                      className="px-2 py-1 rounded text-[10px] font-medium"
                      style={{ background: t.legalDeposit ? BLEU : '#e5e7eb', color: t.legalDeposit ? 'white' : '#374151' }}>
                      {t.legalDeposit ? 'DL ✓' : 'DL'}
                    </button>
                    <button onClick={() => remove(t.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CHANNELS.map((c) => (
                    <button key={c} onClick={() => toggleChannel(t.id, c)}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                      style={t.channels[c]
                        ? { background: BLEU, color: 'white', borderColor: BLEU }
                        : { background: 'transparent', color: '#64748b', borderColor: '#cbd5e1' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogDashboard;
