import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, Loader2, ExternalLink, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const SITE = 'https://ebookstudio.fr';

type Status = 'idle' | 'checking' | 'ok' | 'error';

interface Props {
  /** URL du fichier MP3 enregistrée dans les réglages de lancement. */
  mp3Url: string;
}

/**
 * Écran de vérification : affiche l'URL exacte utilisée par le bouton
 * « Écouter le message » dans les emails et le lien MP3 de secours,
 * avec un test de disponibilité avant tout envoi.
 */
export function AdminLaunchLinkCheck({ mp3Url }: Props) {
  const audioPage = `${SITE}/message`;
  const mp3 = mp3Url.trim();
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const rows = [
    { key: 'page', label: 'Bouton « Écouter le message » (emails)', url: audioPage },
    { key: 'mp3', label: 'Lien de secours — fichier MP3', url: mp3 },
  ];

  const check = async () => {
    for (const r of rows) {
      if (!r.url) {
        setStatus((s) => ({ ...s, [r.key]: 'error' }));
        continue;
      }
      setStatus((s) => ({ ...s, [r.key]: 'checking' }));
      try {
        const res = await fetch(r.url, { method: 'GET', mode: 'cors' });
        setStatus((s) => ({ ...s, [r.key]: res.ok ? 'ok' : 'error' }));
      } catch {
        // Certains hébergeurs bloquent CORS : on ne peut pas conclure, on invite au test manuel.
        setStatus((s) => ({ ...s, [r.key]: 'idle' }));
        toast.info(`Impossible de tester ${r.url} automatiquement — ouvrez-le manuellement.`);
      }
    }
  };

  const copy = async (key: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(key);
    toast.success('URL copiée.');
    setTimeout(() => setCopied(null), 1500);
  };

  const badge = (s: Status | undefined) => {
    if (s === 'checking') return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    if (s === 'ok') return <span className="text-xs font-semibold text-emerald-600">Accessible</span>;
    if (s === 'error') return <span className="text-xs font-semibold text-destructive">Injoignable</span>;
    return <span className="text-xs text-muted-foreground">À tester</span>;
  };

  return (
    <Card className="rounded-2xl border-[#D4AF37]/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
          Vérification des liens avant envoi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Voici les URL exactes insérées dans les emails. Testez-les avant chaque envoi : si la page
          affiche « Page introuvable », publiez le site pour mettre la version en ligne à jour.
        </p>

        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.key} className="rounded-xl border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{r.label}</p>
                {badge(status[r.key])}
              </div>
              <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                {r.url || 'Aucune URL enregistrée'}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
                  disabled={!r.url}
                  onClick={() => void copy(r.key, r.url)}
                >
                  {copied === r.key ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  Copier
                </Button>
                {r.url && (
                  <Button size="sm" variant="outline" className="rounded-lg" asChild>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ouvrir
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button className="rounded-xl" onClick={() => void check()}>
          Tester les deux liens
        </Button>
      </CardContent>
    </Card>
  );
}

export default AdminLaunchLinkCheck;
