import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';
import { FirecrawlCreditsIndicator } from '@/components/ebook/FirecrawlCreditsIndicator';

const KEY = 'v3_author_settings';

type Settings = {
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  amazon: string;
  isPublic: boolean;
};

const empty: Settings = { name: '', slug: '', bio: '', avatar: '', amazon: '', isPublic: false };

const slugify = (s: string) => s
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function V3AuthorSettingsPage() {
  const nav = useNavigate();
  const [s, setS] = useState<Settings>(empty);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { nav('/v3/auth'); return; }
      setEmail(auth.user.email || null);
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) setS({ ...empty, ...JSON.parse(raw) });
      } catch { /* noop */ }
    })();
  }, [nav]);

  const setField = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((prev) => {
    const next = { ...prev, [k]: v };
    if (k === 'name' && !prev.slug) next.slug = slugify(String(v));
    return next;
  });

  const save = () => {
    setSaving(true);
    try {
      const clean = { ...s, slug: slugify(s.slug || s.name) };
      localStorage.setItem(KEY, JSON.stringify(clean));
      setS(clean);
      toast.success('Paramètres enregistrés !');
    } finally { setSaving(false); }
  };

  return (
    <section className="max-w-3xl mx-auto px-5 md:px-8 py-14">
      <h1 className="v3-serif text-4xl font-bold">Paramètres auteur</h1>
      <p className="text-sm text-[var(--v3-muted)] mt-1">{email}</p>

      <div className="v3-card mt-8 space-y-4">
        <Field label="Nom affiché">
          <input value={s.name} onChange={(e) => setField('name', e.target.value)} className="w-full h-11 rounded-lg border border-black/10 px-3 text-sm" placeholder="Ton nom de plume" />
        </Field>
        <Field label="Slug (URL publique)">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--v3-muted)]">/v3/u/</span>
            <input value={s.slug} onChange={(e) => setField('slug', slugify(e.target.value))} className="flex-1 h-11 rounded-lg border border-black/10 px-3 text-sm" placeholder="ton-slug" />
          </div>
          {s.slug && (
            <Link to={`/v3/u/${s.slug}`} className="mt-1 text-xs text-[var(--v3-orange)] inline-flex items-center gap-1">
              Aperçu : /v3/u/{s.slug} <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </Field>
        <Field label="Bio">
          <textarea rows={4} value={s.bio} onChange={(e) => setField('bio', e.target.value)} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" placeholder="Quelques mots sur ton univers…" />
        </Field>
        <Field label="URL avatar">
          <input value={s.avatar} onChange={(e) => setField('avatar', e.target.value)} className="w-full h-11 rounded-lg border border-black/10 px-3 text-sm" placeholder="https://…" />
        </Field>
        <Field label="Lien Amazon">
          <input value={s.amazon} onChange={(e) => setField('amazon', e.target.value)} className="w-full h-11 rounded-lg border border-black/10 px-3 text-sm" placeholder="https://amazon.fr/…" />
        </Field>
        <label className="flex items-center gap-3 pt-2">
          <input type="checkbox" checked={s.isPublic} onChange={(e) => setField('isPublic', e.target.checked)} />
          <span className="text-sm">Rendre ma page auteur publique</span>
        </label>
        <div className="pt-4 flex justify-end">
          <button onClick={save} disabled={saving} className="v3-btn v3-btn-primary">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="v3-serif text-2xl font-bold mb-3">Connecteurs & plafonds</h2>
        <FirecrawlCreditsIndicator />
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--v3-muted)]">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
