import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, BookMarked } from 'lucide-react';
import { toast } from 'sonner';

const TEAL = '#008296';
const LS_KEY = 'v3_isbn_metadata';

interface TitleMeta {
  id: string;
  title: string;
  subtitle: string;
  isbn: string;
  bisac: string;
  categories: string;
  language: string;
  rights: string;
}

const LANGS = ['Français', 'Anglais', 'Allemand', 'Espagnol', 'Italien'];
const RIGHTS = ['Mondial (tous territoires)', 'Territoires sélectionnés', 'Domaine public'];

const empty = (): TitleMeta => ({
  id: crypto.randomUUID(), title: '', subtitle: '', isbn: '', bisac: '',
  categories: '', language: 'Français', rights: 'Mondial (tous territoires)',
});

const isbnValid = (raw: string) => {
  const digits = raw.replace(/[^0-9Xx]/g, '');
  return digits.length === 0 || digits.length === 10 || digits.length === 13;
};

const IsbnMetadataManager: React.FC = () => {
  const [items, setItems] = useState<TitleMeta[]>([]);

  useEffect(() => {
    try { const raw = localStorage.getItem(LS_KEY); if (raw) setItems(JSON.parse(raw)); } catch { /* noop */ }
  }, []);

  const persist = (next: TitleMeta[]) => {
    setItems(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* noop */ }
  };

  const add = () => persist([...items, empty()]);
  const remove = (id: string) => persist(items.filter((i) => i.id !== id));
  const update = (id: string, patch: Partial<TitleMeta>) =>
    persist(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const save = () => {
    const bad = items.find((i) => !isbnValid(i.isbn));
    if (bad) return toast.error('ISBN invalide (10 ou 13 chiffres).');
    persist(items);
    toast.success('Métadonnées enregistrées ✓');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-joy-ink/70">
          Centralise ISBN, BISAC, catégories, langue et droits pour chacun de tes titres.
        </p>
        <Button onClick={add} size="sm" style={{ background: TEAL, color: 'white' }} className="gap-1.5">
          <Plus className="h-4 w-4" /> Ajouter un titre
        </Button>
      </div>

      {items.length === 0 && (
        <Card className="border-dashed border-joy-ink/20">
          <CardContent className="p-8 text-center text-joy-ink/50 text-sm">
            <BookMarked className="h-8 w-8 mx-auto mb-2 opacity-40" />
            Aucun titre. Clique sur « Ajouter un titre ».
          </CardContent>
        </Card>
      )}

      {items.map((it) => (
        <Card key={it.id} className="border-joy-ink/10">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" style={{ borderColor: TEAL, color: TEAL }}>{it.title || 'Nouveau titre'}</Badge>
              <Button variant="ghost" size="sm" onClick={() => remove(it.id)} className="text-red-500 gap-1.5">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label className="text-xs">Titre</Label><Input value={it.title} onChange={(e) => update(it.id, { title: e.target.value })} /></div>
              <div><Label className="text-xs">Sous-titre</Label><Input value={it.subtitle} onChange={(e) => update(it.id, { subtitle: e.target.value })} /></div>
              <div>
                <Label className="text-xs">ISBN (10 ou 13)</Label>
                <Input value={it.isbn} onChange={(e) => update(it.id, { isbn: e.target.value })}
                  className={!isbnValid(it.isbn) ? 'border-red-400' : ''} placeholder="978-…" />
              </div>
              <div><Label className="text-xs">Code BISAC</Label><Input value={it.bisac} onChange={(e) => update(it.id, { bisac: e.target.value })} placeholder="FIC000000" /></div>
              <div><Label className="text-xs">Catégories</Label><Input value={it.categories} onChange={(e) => update(it.id, { categories: e.target.value })} placeholder="Cat 1, Cat 2" /></div>
              <div>
                <Label className="text-xs">Langue</Label>
                <Select value={it.language} onValueChange={(v) => update(it.id, { language: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{LANGS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Droits</Label>
                <Select value={it.rights} onValueChange={(v) => update(it.id, { rights: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{RIGHTS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {items.length > 0 && (
        <Button onClick={save} style={{ background: TEAL, color: 'white' }} className="gap-1.5">
          <Save className="h-4 w-4" /> Enregistrer
        </Button>
      )}
    </div>
  );
};

export default IsbnMetadataManager;
