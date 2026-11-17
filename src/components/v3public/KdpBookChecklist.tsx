import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Image, ListChecks, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  bookId: string;
  userId: string;
  revision: string;
  coverId?: string;
  onRead: () => void;
  onExport: () => void;
};

export default function KdpBookChecklist({ bookId, userId, revision, coverId, onRead, onExport }: Props) {
  const [open, setOpen] = useState(false);
  const key = `kdp-checklist:${userId}:${bookId}:${revision}`;
  const [checked, setChecked] = useState<boolean[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      return [0, 1, 2, 3].map(i => saved[i] === true);
    } catch { return [false, false, false, false]; }
  });
  const steps = [
    { label: 'Manuscrit finalisé', action: 'Relire le manuscrit', icon: BookOpen, onClick: onRead },
    { label: 'Couverture validée', action: 'Vérifier la couverture', icon: Image, to: coverId ? `/v3/mes-couvertures/${encodeURIComponent(coverId)}` : '/v3/mes-couvertures' },
    { label: 'Fiche Amazon prête', action: 'Ouvrir la fiche Amazon', icon: ListChecks, to: `/v3/donnees-kdp?projectId=${encodeURIComponent(bookId)}` },
    { label: 'Pack complet téléchargé', action: 'Ouvrir le Pack KDP', icon: Package, to: `/v3/donnees-kdp?projectId=${encodeURIComponent(bookId)}#pack-kdp` },
  ];
  const toggle = (index: number, value: boolean) => {
    const next = checked.map((c, i) => i === index ? value : c);
    setChecked(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* Validation remains visible in this session. */ }
  };
  return (
    <section className="w-full border-t border-border pt-3 text-foreground">
      <Button variant="ghost" className="w-full justify-between gap-3 whitespace-normal text-left" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="flex items-center gap-2"><ListChecks className="h-4 w-4 shrink-0" />Préparation Amazon KDP</span>
        <span className="flex items-center gap-2 shrink-0 text-muted-foreground">{checked.filter(Boolean).length}/4 {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
      </Button>
      {open && <div className="mt-3 space-y-3">
        {steps.map(({ label, action, icon: Icon, to, onClick }, index) => (
          <div key={label} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <label className="flex items-center gap-3 text-sm font-semibold text-foreground cursor-pointer">
              <input type="checkbox" checked={checked[index]} onChange={e => toggle(index, e.target.checked)} className="h-4 w-4 accent-primary" />
              <span className="text-foreground">{index + 1}. {label}</span>
            </label>
            {to ? <Button asChild size="sm" variant="outline"><Link to={to}><Icon className="mr-2 h-4 w-4" />{action}</Link></Button>
              : <Button size="sm" variant="outline" onClick={onClick}><Icon className="mr-2 h-4 w-4" />{action}</Button>}
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={onExport}><Package className="mr-2 h-4 w-4" />Exports Word, PDF et EPUB</Button>
        <p className="text-xs text-muted-foreground">Validation personnelle conservée sur cet appareil. Après modification du livre, les étapes sont à revérifier.</p>
      </div>}
    </section>
  );
}