import { Helmet } from 'react-helmet';
import { Share2, Lock, Save } from 'lucide-react';
import { toast } from 'sonner';
import BackButton from '@/components/v3/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import useSubscriberProfile, { type SubscriberProfile } from '@/hooks/useSubscriberProfile';

const LINKS: { key: keyof SubscriberProfile; label: string; placeholder: string }[] = [
  { key: 'website_url', label: 'Site web', placeholder: 'https://mon-site.fr' },
  { key: 'amazon_author_url', label: 'Page auteur Amazon', placeholder: 'https://www.amazon.fr/stores/author/...' },
  { key: 'facebook_url', label: 'Facebook', placeholder: 'https://facebook.com/...' },
  { key: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'x_url', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
  { key: 'tiktok_url', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
  { key: 'youtube_url', label: 'YouTube', placeholder: 'https://youtube.com/@...' },
  { key: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
  { key: 'pinterest_url', label: 'Pinterest', placeholder: 'https://pinterest.com/...' },
];

const isValid = (value: string) => !value || /^https?:\/\/[^\s]{4,}$/i.test(value.trim());

/** Réseaux sociaux privés de l'abonné (option d'affichage public). */
export default function V3ReseauxPage() {
  const { profile, userId, loading, saving, update, save } = useSubscriberProfile();

  const handleSave = async () => {
    const invalid = LINKS.find((l) => !isValid((profile[l.key] as string) ?? ''));
    if (invalid) {
      toast.error(`Lien ${invalid.label} invalide : il doit commencer par https://`);
      return;
    }
    const res = await save();
    if (res.ok) toast.success('Vos réseaux sont enregistrés.');
    else toast.error(res.error || 'Enregistrement impossible.');
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Helmet>
        <title>Mes réseaux sociaux — Ebookstudio</title>
        <meta name="description" content="Enregistrez vos liens site web, Instagram, YouTube, LinkedIn et page auteur Amazon. Privés par défaut, affichables sur votre page auteur si vous le décidez." />
      </Helmet>

      <BackButton to="/v3/fonctionnalites" label="Retour aux fonctionnalités" />

      <header className="mb-6 mt-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          <Share2 className="h-6 w-6" style={{ color: 'var(--v3-emerald)' }} />
          Mes réseaux sociaux
        </h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--v3-muted)' }}>
          Vos liens servent à vos pages auteur, vos exports et vos visuels de lancement.
        </p>
        <p
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: 'rgba(6,78,59,0.08)', color: 'var(--v3-emerald)' }}
        >
          <Lock className="h-3.5 w-3.5" /> Privé par défaut — visible par vous seul
        </p>
      </header>

      {!userId && !loading && (
        <p className="mb-4 rounded-xl bg-white p-4 text-[13.5px]" style={{ border: '1px solid var(--v3-line)', color: 'var(--v3-muted)' }}>
          Connectez-vous pour enregistrer vos réseaux.
        </p>
      )}

      <div className="rounded-2xl bg-white p-5" style={{ border: '1px solid var(--v3-line)' }}>
        <div className="grid gap-4 sm:grid-cols-2">
          {LINKS.map((l) => (
            <div key={l.key}>
              <Label htmlFor={l.key} className="text-[13px]">{l.label}</Label>
              <Input
                id={l.key}
                type="url"
                maxLength={300}
                placeholder={l.placeholder}
                disabled={loading}
                value={(profile[l.key] as string) ?? ''}
                onChange={(e) => update(l.key, e.target.value as never)}
                className="mt-1"
              />
            </div>
          ))}
        </div>

        <label className="mt-5 flex items-start gap-3 rounded-xl p-3" style={{ background: 'var(--v3-emerald-50)' }}>
          <Checkbox
            checked={profile.socials_public}
            onCheckedChange={(v) => update('socials_public', v === true)}
            disabled={loading}
          />
          <span className="text-[13px]" style={{ color: 'var(--v3-ink)' }}>
            Autoriser l'affichage de ces liens sur ma page auteur publique
            <span className="block text-[12px]" style={{ color: 'var(--v3-muted)' }}>
              Décoché : personne d'autre que vous ne les voit.
            </span>
          </span>
        </label>

        <Button onClick={handleSave} disabled={saving || loading || !userId} className="mt-5 gap-2">
          <Save className="h-4 w-4" /> {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </div>
  );
}
