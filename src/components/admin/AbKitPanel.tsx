import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Download, ExternalLink } from 'lucide-react';

interface Variant {
  id: 'a' | 'b';
  label: string;
  interne: string;
  objet: string;
  preheader: string;
  expediteur: string;
  bouton: string;
  lien: string;
  file: string;
}

const VARIANTS: Variant[] = [
  {
    id: 'a',
    label: 'Variante A — offre directe',
    interne: 'Offre été 47 € — Variante A',
    objet: '47 € au lieu de 59 € (jusqu\u2019au 30 septembre)',
    preheader: 'Un paiement unique, aucun abonnement, accès à vie à EbookStudio.',
    expediteur: 'Georges — EbookStudio',
    bouton: 'Je prends l\u2019accès à 47 €',
    lien: 'https://www.ebookstudio.fr/commander?src=email-ab-47-a',
    file: '/email-templates/ab-ete-47-getresponse-A.html',
  },
  {
    id: 'b',
    label: 'Variante B — histoire de Marie',
    interne: 'Offre été 47 € — Variante B',
    objet: 'Elle ne savait pas écrire. Elle a quand même publié.',
    preheader: 'Marie est partie d\u2019une simple idée et a obtenu son livre prêt pour Amazon KDP.',
    expediteur: 'Georges — EbookStudio',
    bouton: 'Voir l\u2019offre et commencer',
    lien: 'https://www.ebookstudio.fr/commander?src=email-ab-47-b',
    file: '/email-templates/ab-ete-47-getresponse-B.html',
  },
];

const FIELDS: Array<{ key: keyof Variant; label: string }> = [
  { key: 'interne', label: 'Nom interne (GetResponse)' },
  { key: 'objet', label: 'Ligne objet' },
  { key: 'preheader', label: 'Préheader' },
  { key: 'expediteur', label: 'Nom de l\u2019expéditeur' },
  { key: 'bouton', label: 'Texte du bouton' },
  { key: 'lien', label: 'Lien du bouton' },
];

export default function AbKitPanel() {
  const [busy, setBusy] = useState<string | null>(null);

  const copy = async (value: string, what: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${what} copié`);
    } catch {
      toast.error('Copie impossible — sélectionnez le texte manuellement');
    }
  };

  const loadHtml = async (v: Variant) => {
    const res = await fetch(v.file);
    if (!res.ok) throw new Error('Template introuvable');
    return res.text();
  };

  const copyHtml = async (v: Variant) => {
    setBusy(`copy-${v.id}`);
    try {
      await copy(await loadHtml(v), 'HTML complet');
    } catch {
      toast.error('Impossible de charger le HTML');
    } finally {
      setBusy(null);
    }
  };

  const downloadHtml = async (v: Variant) => {
    setBusy(`dl-${v.id}`);
    try {
      const html = await loadHtml(v);
      const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `ab-ete-47-variante-${v.id.toUpperCase()}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Fichier HTML téléchargé');
    } catch {
      toast.error('Impossible de télécharger le HTML');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-gradient-gold text-lg">Comment remplir GetResponse</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Nouveau message → <strong>Test A/B</strong> → tester « Ligne objet ».</li>
            <li>Collez <strong>Ligne objet</strong> de A dans le champ A, celle de B dans le champ B.</li>
            <li>Nom de l’expéditeur + préheader : copiez les champs ci-dessous.</li>
            <li>Conception et contenu → <strong>Coller du HTML</strong> → « Copier tout le HTML » (ou importez le fichier téléchargé).</li>
            <li>Vérifiez que le bouton pointe bien sur le lien affiché ci-dessous, puis envoyez.</li>
          </ol>
        </CardContent>
      </Card>

      {VARIANTS.map((v) => (
        <Card key={v.id} className="bg-card border-gold/30">
          <CardHeader>
            <CardTitle className="text-gold-light text-base">{v.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {FIELDS.map((f) => (
              <div key={f.key} className="rounded-lg border border-border/60 bg-background/50 p-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</div>
                <div className="mt-1 flex items-start gap-2">
                  <code className="flex-1 break-all text-sm text-foreground">{v[f.key] as string}</code>
                  <Button size="sm" variant="outline" onClick={() => copy(v[f.key] as string, f.label)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                size="sm"
                onClick={() => copyHtml(v)}
                disabled={busy === `copy-${v.id}`}
                className="bg-gradient-to-r from-gold to-gold-dark font-semibold text-black hover:opacity-90"
              >
                <Copy className="mr-1 h-3 w-3" /> Copier tout le HTML
              </Button>
              <Button size="sm" variant="outline" onClick={() => downloadHtml(v)} disabled={busy === `dl-${v.id}`}>
                <Download className="mr-1 h-3 w-3" /> Télécharger le fichier HTML
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={v.lien} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-3 w-3" /> Tester le lien du bouton
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
