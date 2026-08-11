import { useMemo, useState } from 'react';
import { Copy, Check, Gift, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReferral } from '@/hooks/useReferral';
import { Button } from '@/components/ui/button';

/**
 * Kit de parrainage prêt à copier pour les abonnés.
 * Commission de 30 % sur l'offre à vie de 47 € (soit 14,10 € par vente).
 */
const COMMISSION_RATE = 0.3;
const OFFER_PRICE = 47;

const ReferralKitCard = () => {
  const { code, stats, loading } = useReferral();
  const [copied, setCopied] = useState<string | null>(null);

  const link = useMemo(() => {
    if (!code) return '';
    return `https://ebookstudio.fr/commander?ref=${code}&utm_source=parrainage`;
  }, [code]);

  const commission = (OFFER_PRICE * COMMISSION_RATE).toFixed(2).replace('.', ',');

  const posts = useMemo(
    () => [
      {
        label: 'Message court (SMS, WhatsApp)',
        text: `J'écris mes livres et je les publie sur Amazon avec EbookStudio : plan, chapitres, couverture et fichiers prêts pour KDP. L'accès à vie est à 47 € jusqu'au 30 septembre, après ce sera un abonnement mensuel. Le lien : ${link}`,
      },
      {
        label: 'Publication Facebook / groupe KDP',
        text: `Je partage l'outil que j'utilise pour écrire et publier mes livres sur Amazon KDP.\n\nEn pratique : je donne mon sujet, j'obtiens un sommaire que je corrige, les chapitres sont rédigés en français, la couverture est calculée au format exact de KDP (dos compris) et j'exporte un Word + PDF prêts à téléverser.\n\nL'accès à vie est à 47 € jusqu'au 30 septembre (ensuite ce sera un abonnement mensuel). Si ça vous intéresse : ${link}`,
      },
      {
        label: 'Post Pinterest / description courte',
        text: `Écrire un livre et le publier sur Amazon KDP sans savoir écrire ni maquetter : sommaire, chapitres, couverture et fichiers prêts. Accès à vie 47 € jusqu'au 30/09. ${link}`,
      },
    ],
    [link],
  );

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      toast.success('Copié !');
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error('Copie impossible — sélectionnez le texte à la main.');
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 rounded-full bg-primary/10 grid place-items-center">
          <Gift className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Votre kit de parrainage</h2>
          <p className="text-sm text-muted-foreground">
            30 % de commission sur chaque vente, soit <strong>{commission} €</strong> pour l'offre à
            vie à {OFFER_PRICE} €. Votre lien suit automatiquement les personnes que vous envoyez.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement de votre lien…</p>
      ) : !code ? (
        <p className="text-sm text-muted-foreground">
          Votre lien de parrainage n'est pas encore créé. Rechargez la page dans un instant.
        </p>
      ) : (
        <>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Votre lien
            </label>
            <div className="mt-1.5 flex flex-col sm:flex-row gap-2">
              <input
                readOnly
                value={link}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              />
              <Button onClick={() => copy(link, 'link')} className="font-bold">
                {copied === 'link' ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                Copier le lien
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Personnes envoyées', value: stats?.total_referrals ?? 0 },
              { label: 'Ventes confirmées', value: stats?.converted ?? 0 },
              {
                label: 'Commissions à recevoir',
                value: `${Number(stats?.unpaid_commission ?? 0).toFixed(2).replace('.', ',')} €`,
              },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border p-3">
                <div className="text-xl font-black">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <Share2 className="h-4 w-4 text-primary" /> Trois textes prêts à publier
            </h3>
            {posts.map((p, i) => (
              <div key={p.label} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-muted-foreground">{p.label}</span>
                  <Button variant="ghost" size="sm" onClick={() => copy(p.text, `post-${i}`)}>
                    {copied === `post-${i}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-foreground/80">{p.text}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Les commissions sont réglées par virement ou PayPal une fois le délai de garantie de
            30 jours écoulé. Écrivez à contact@ebookstudio.fr pour demander votre versement.
          </p>
        </>
      )}
    </div>
  );
};

export default ReferralKitCard;
