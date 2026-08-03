import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Download, ExternalLink } from 'lucide-react';

const LIEN = 'https://www.ebookstudio.fr/commander?src=getresponse';
const TEMPLATE_FILE = '/email-templates/offre-47-getresponse.html';

const FIELDS: Array<{ label: string; value: string }> = [
  { label: 'Nom interne (GetResponse)', value: 'Offre été 47 € — EbookStudio' },
  { label: 'Ligne objet', value: '47 € au lieu de 59 € (jusqu\u2019au 30 septembre)' },
  { label: 'Préheader', value: 'Un paiement unique, aucun abonnement, accès à vie à EbookStudio.' },
  { label: 'Nom de l\u2019expéditeur', value: 'Georges — EbookStudio' },
  { label: 'Texte du bouton', value: 'Je prends l\u2019accès à 47 €' },
  { label: 'Lien du bouton', value: LIEN },
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

  const loadHtml = async () => {
    const res = await fetch(TEMPLATE_FILE);
    if (!res.ok) throw new Error('Template introuvable');
    return res.text();
  };

  const copyHtml = async () => {
    setBusy('copy');
    try {
      await copy(await loadHtml(), 'HTML complet');
    } catch {
      toast.error('Impossible de charger le HTML');
    } finally {
      setBusy(null);
    }
  };

  const downloadHtml = async () => {
    setBusy('dl');
    try {
      const html = await loadHtml();
      const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'offre-47-getresponse.html';
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
            <li>Nouveau message → <strong>Newsletter classique</strong> (pas de test A/B).</li>
            <li>Collez la <strong>ligne objet</strong>, le <strong>préheader</strong> et le <strong>nom d’expéditeur</strong> ci-dessous.</li>
            <li>Conception et contenu → <strong>Coller du HTML</strong> → « Copier tout le HTML » (ou importez le fichier téléchargé).</li>
            <li>Un seul lien dans l’email : <code className="break-all">{LIEN}</code></li>
            <li>Testez le lien, envoyez à toute la liste.</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="bg-card border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold-light text-base">Email offre été 47 € — lien unique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {FIELDS.map((f) => (
            <div key={f.label} className="rounded-lg border border-border/60 bg-background/50 p-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</div>
              <div className="mt-1 flex items-start gap-2">
                <code className="flex-1 break-all text-sm text-foreground">{f.value}</code>
                <Button size="sm" variant="outline" onClick={() => copy(f.value, f.label)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              onClick={copyHtml}
              disabled={busy === 'copy'}
              className="bg-gradient-to-r from-gold to-gold-dark font-semibold text-black hover:opacity-90"
            >
              <Copy className="mr-1 h-3 w-3" /> Copier tout le HTML
            </Button>
            <Button size="sm" variant="outline" onClick={downloadHtml} disabled={busy === 'dl'}>
              <Download className="mr-1 h-3 w-3" /> Télécharger le fichier HTML
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={LIEN} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" /> Tester le lien du bouton
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
