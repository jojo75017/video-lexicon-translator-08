import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

const PARTS = [
  { id: 'review', label: 'Appel à laisser un avis Amazon' },
  { id: 'also', label: '« Du même auteur » (autres titres)' },
  { id: 'bio', label: 'Bio de l’auteur + lien newsletter' },
  { id: 'next', label: 'Teaser du prochain livre' },
];

const BackMatterBuilder: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [otherBooks, setOtherBooks] = useState('');
  const [newsletter, setNewsletter] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({ review: true, also: true, bio: true, next: false });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const run = async () => {
    if (!title.trim() || !author.trim()) return toast.error('Titre et auteur requis.');
    const chosen = PARTS.filter((p) => selected[p.id]).map((p) => p.label);
    if (chosen.length === 0) return toast.error('Sélectionne au moins une section.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Rédige les "pages de fin" (back matter) d'un livre, en français, prêtes à coller en fin d'ebook.
Titre : "${title}"
Auteur : "${author}"
${otherBooks ? `Autres titres de l'auteur : ${otherBooks}` : ''}
${newsletter ? `Lien newsletter : ${newsletter}` : ''}

Génère ces sections, chacune avec un titre clair et un texte chaleureux et professionnel :
${chosen.map((c) => `- ${c}`).join('\n')}

Format : texte simple avec titres en Markdown (##). Pas de placeholder du type [insérer ici] : utilise les informations fournies.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère les pages de fin de ton ebook (avis, du même auteur, bio + newsletter…) en quelques secondes.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Auteur *</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div><Label className="text-xs">Autres titres</Label><Input value={otherBooks} onChange={(e) => setOtherBooks(e.target.value)} placeholder="Titre A, Titre B" /></div>
        <div><Label className="text-xs">Lien newsletter</Label><Input value={newsletter} onChange={(e) => setNewsletter(e.target.value)} placeholder="https://…" /></div>
      </div>

      <div className="flex flex-wrap gap-3">
        {PARTS.map((p) => (
          <label key={p.id} className="flex items-center gap-2 text-xs cursor-pointer">
            <Checkbox checked={!!selected[p.id]} onCheckedChange={() => toggle(p.id)} />
            {p.label}
          </label>
        ))}
      </div>

      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer les pages de fin</span>
      </Button>

      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={14} value={output} onChange={(e) => setOutput(e.target.value)} className="font-mono text-xs" />
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
            <Copy className="h-3.5 w-3.5" /> Copier
          </Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default BackMatterBuilder;
