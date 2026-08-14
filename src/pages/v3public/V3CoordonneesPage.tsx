import { Helmet } from 'react-helmet';
import { IdCard, Lock, Save } from 'lucide-react';
import { toast } from 'sonner';
import BackButton from '@/components/v3/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useSubscriberProfile, { type SubscriberProfile } from '@/hooks/useSubscriberProfile';

const FIELDS: { key: keyof SubscriberProfile; label: string; placeholder?: string; type?: string; full?: boolean }[] = [
  { key: 'first_name', label: 'Prénom' },
  { key: 'last_name', label: 'Nom' },
  { key: 'pen_name', label: 'Nom d’auteur / pseudonyme', placeholder: 'Celui qui figure sur la couverture' },
  { key: 'phone', label: 'Téléphone', type: 'tel' },
  { key: 'address_line', label: 'Adresse', full: true },
  { key: 'postal_code', label: 'Code postal' },
  { key: 'city', label: 'Ville' },
  { key: 'country', label: 'Pays' },
  { key: 'billing_email', label: 'E-mail de facturation', type: 'email' },
];

/** Coordonnées privées de l'abonné. */
export default function V3CoordonneesPage() {
  const { profile, email, userId, loading, saving, update, save } = useSubscriberProfile();

  const handleSave = async () => {
    const res = await save();
    if (res.ok) toast.success('Vos coordonnées sont enregistrées.');
    else toast.error(res.error || "Enregistrement impossible.");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Helmet>
        <title>Mes coordonnées — Ebookstudio</title>
        <meta name="description" content="Renseignez vos coordonnées d'auteur : nom, adresse, téléphone et e-mail de facturation. Informations privées, visibles par vous seul." />
      </Helmet>

      <BackButton to="/v3/fonctionnalites" label="Retour aux fonctionnalités" />

      <header className="mb-6 mt-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          <IdCard className="h-6 w-6" style={{ color: 'var(--v3-emerald)' }} />
          Mes coordonnées
        </h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--v3-muted)' }}>
          Utilisées pour vos factures, vos exports et vos pages auteur. {email && <>Compte : <strong>{email}</strong></>}
        </p>
        <p
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: 'rgba(6,78,59,0.08)', color: 'var(--v3-emerald)' }}
        >
          <Lock className="h-3.5 w-3.5" /> Visible par vous seul
        </p>
      </header>

      {!userId && !loading && (
        <p className="mb-4 rounded-xl bg-white p-4 text-[13.5px]" style={{ border: '1px solid var(--v3-line)', color: 'var(--v3-muted)' }}>
          Connectez-vous pour enregistrer vos coordonnées.
        </p>
      )}

      <div className="rounded-2xl bg-white p-5" style={{ border: '1px solid var(--v3-line)' }}>
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.full ? 'sm:col-span-2' : undefined}>
              <Label htmlFor={f.key} className="text-[13px]">{f.label}</Label>
              <Input
                id={f.key}
                type={f.type ?? 'text'}
                maxLength={200}
                placeholder={f.placeholder}
                disabled={loading}
                value={(profile[f.key] as string) ?? ''}
                onChange={(e) => update(f.key, e.target.value as never)}
                className="mt-1"
              />
            </div>
          ))}
        </div>

        <Button onClick={handleSave} disabled={saving || loading || !userId} className="mt-5 gap-2">
          <Save className="h-4 w-4" /> {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </div>
  );
}
