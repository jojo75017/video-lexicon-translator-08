import { useState } from 'react';
import { Copy, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatVCKdpSheet, VC_BOOKS_KDP_DEFAULT_PRICE_CENTS, type VCKdpSheet } from '@/lib/vcBooksKdpSheet';

interface Props {
  title: string;
  author: string;
  theme: string;
}

export default function V3VCBooksKdpSheet({ title, author, theme }: Props) {
  const [drafts, setDrafts] = useState<Partial<VCKdpSheet>>({});
  const sheet: VCKdpSheet = {
    isbn: '', title, author, theme,
    price: (VC_BOOKS_KDP_DEFAULT_PRICE_CENTS / 100).toFixed(2).replace('.', ','),
    ...drafts,
  };
  const fields: { key: keyof VCKdpSheet; label: string }[] = [
    { key: 'isbn', label: 'ISBN' }, { key: 'title', label: 'Titre' },
    { key: 'author', label: 'Auteur' }, { key: 'theme', label: 'Thème' },
    { key: 'price', label: 'Prix (€)' },
  ];

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copié');
    } catch {
      toast.error('La copie a échoué. Sélectionnez le texte et copiez-le manuellement.');
    }
  }

  return <section aria-labelledby="vc-kdp-heading" className="mt-10 border-t border-border pt-6">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h2 id="vc-kdp-heading" className="v3-serif flex items-center gap-2 text-2xl text-foreground"><FileText className="h-5 w-5 text-primary" />Fiche KDP</h2>
      <Button variant="outline" onClick={() => void copy(formatVCKdpSheet(sheet))}><Copy className="mr-2 h-4 w-4" />Copier toute la fiche</Button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(({ key, label }) => <div key={key} className="min-w-0 space-y-2">
        <Label htmlFor={`vc-kdp-${key}`}>{label}</Label>
        <div className="flex gap-2">
          <Input id={`vc-kdp-${key}`} value={sheet[key]} inputMode={key === 'price' ? 'decimal' : undefined} placeholder={key === 'isbn' ? 'ISBN attribué par KDP ou votre propre ISBN' : undefined} onChange={(event) => setDrafts((previous) => ({ ...previous, [key]: event.target.value }))} />
          <Button variant="outline" size="icon" aria-label={`Copier ${label}`} title={`Copier ${label}`} disabled={!sheet[key].trim()} onClick={() => void copy(sheet[key])} className="shrink-0"><Copy className="h-4 w-4" /></Button>
        </div>
      </div>)}
    </div>
    <p className="mt-4 text-sm text-muted-foreground">ISBN : renseignez celui attribué par KDP pour le broché, ou votre propre ISBN. Le thème sert de repère pour choisir vos catégories.</p>
    <p className="mt-2 text-sm text-muted-foreground">Prix proposé : 12,99 € TTC, modifiable selon votre livre. Le prix se règle dans KDP et n’apparaît jamais sur les images.</p>
  </section>;
}