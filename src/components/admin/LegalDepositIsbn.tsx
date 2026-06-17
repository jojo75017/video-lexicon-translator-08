import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, FileText, Library } from 'lucide-react';
import { toast } from 'sonner';

const BLEU = '#1D4ED8';
const LS_KEY = 'v3_isbn_registry';

interface IsbnEntry {
  id: string;
  title: string;
  collection: string;
  isbn: string;
  format: string;
  legalDeposit: boolean;
}

/**
 * Dépôt Légal & ISBN — registre persistant des ISBN par titre/collection
 * + rappel des étapes du dépôt légal BNF.
 */
const LegalDepositIsbn: React.FC = () => {
  const [entries, setEntries] = useState<IsbnEntry[]>([]);
  const [draft, setDraft] = useState<Omit<IsbnEntry, 'id'>>({
    title: '', collection: '', isbn: '', format: 'EPUB', legalDeposit: false,
  });

  useEffect(() => {
    try { const r = localStorage.getItem(LS_KEY); if (r) setEntries(JSON.parse(r)); } catch {}
  }, []);

  const persist = (next: IsbnEntry[]) => {
    setEntries(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  };

  const add = () => {
    if (!draft.title.trim()) return toast.error('Titre requis.');
    persist([...entries, { ...draft, id: crypto.randomUUID() }]);
    setDraft({ title: '', collection: '', isbn: '', format: 'EPUB', legalDeposit: false });
    toast.success('Titre ajouté au registre ✓');
  };

  const toggleDeposit = (id: string) =>
    persist(entries.map((e) => (e.id === id ? { ...e, legalDeposit: !e.legalDeposit } : e)));

  const remove = (id: string) => persist(entries.filter((e) => e.id !== id));

  return (
    <div className="space-y-5">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <Library className="h-4 w-4" style={{ color: BLEU }} />
        Gérez vos ISBN par titre et par collection, et suivez le dépôt légal BNF.
      </p>

      <Card className="border-joy-ink/10">
        <CardContent className="p-4 space-y-2 text-xs leading-relaxed text-joy-ink/80">
          <p className="font-semibold flex items-center gap-1.5" style={{ color: BLEU }}>
            <FileText className="h-4 w-4" /> Mémo dépôt légal (France)
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>L'ISBN n'est pas obligatoire sur Amazon, mais l'est pour la diffusion wide (libraires, Fnac…).</li>
            <li>En France, l'ISBN s'obtient auprès de l'AFNIL (un par format : EPUB, broché, relié…).</li>
            <li>Le dépôt légal numérique se fait via la BnF (DLN) ; le dépôt légal imprimé par envoi d'exemplaires.</li>
            <li>Conservez un ISBN distinct par format et par édition révisée majeure.</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
        <div><Label className="text-xs">Collection</Label><Input value={draft.collection} onChange={(e) => setDraft({ ...draft, collection: e.target.value })} /></div>
        <div><Label className="text-xs">ISBN</Label><Input value={draft.isbn} onChange={(e) => setDraft({ ...draft, isbn: e.target.value })} placeholder="978-…" /></div>
        <div><Label className="text-xs">Format</Label><Input value={draft.format} onChange={(e) => setDraft({ ...draft, format: e.target.value })} placeholder="EPUB, Broché…" /></div>
      </div>
      <Button onClick={add} style={{ background: BLEU, color: 'white' }} className="gap-1.5">
        <Plus className="h-4 w-4" /> Ajouter au registre
      </Button>

      {entries.length > 0 && (
        <div className="space-y-2">
          {entries.map((e) => (
            <Card key={e.id} className="border-joy-ink/10">
              <CardContent className="p-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex-1">
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-joy-ink/60">
                    {e.collection ? `${e.collection} · ` : ''}{e.format}{e.isbn ? ` · ISBN ${e.isbn}` : ''}
                  </p>
                </div>
                <button onClick={() => toggleDeposit(e.id)}
                  className="px-2 py-1 rounded text-[11px] font-medium"
                  style={{ background: e.legalDeposit ? BLEU : '#e5e7eb', color: e.legalDeposit ? 'white' : '#374151' }}>
                  {e.legalDeposit ? 'Dépôt légal ✓' : 'Dépôt à faire'}
                </button>
                <button onClick={() => remove(e.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LegalDepositIsbn;
