import { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Copy, Users, Link2, ShieldAlert, Search, Gift, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import BackButton from '@/components/v3/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useReferral } from '@/hooks/useReferral';
import {
  GROUP_SEARCHES,
  GROUP_RULES,
  ACQUISITION_POSTS,
  REFERRAL_MESSAGES,
} from '@/data/acquisitionPlan';

const DONE_KEY = 'v3-acquisition-done';
const GIFT_URL = 'https://ebookstudio.fr/cadeau';

/**
 * Plan d'acquisition 14 jours : groupes Facebook (posts valeur puis offre)
 * et activation de la base existante par le parrainage.
 */
export default function V3AcquisitionPage() {
  const { code } = useReferral();
  const [customLink, setCustomLink] = useState('');
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DONE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch { /* stockage indisponible */ }
  }, []);

  const toggleDone = (day: number) => {
    setDone((cur) => {
      const next = cur.includes(day) ? cur.filter((d) => d !== day) : [...cur, day];
      try { localStorage.setItem(DONE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const shareLink = useMemo(() => {
    if (customLink.trim()) return customLink.trim();
    return code ? `${GIFT_URL}?ref=${code}` : GIFT_URL;
  }, [customLink, code]);

  const fill = (text: string) => text.split('{{LIEN}}').join(shareLink);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(fill(text));
      toast.success('Texte copié.');
    } catch {
      toast.error('Copie impossible : sélectionnez le texte manuellement.');
    }
  };

  const progress = Math.round((done.length / ACQUISITION_POSTS.length) * 100);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Helmet>
        <title>Plan d’acquisition 14 jours — groupes Facebook et parrainage | Ebookstudio</title>
        <meta
          name="description"
          content="Un plan de 14 jours pour trouver des lecteurs : quels groupes Facebook rejoindre, quoi publier chaque jour et comment activer votre base par le parrainage."
        />
      </Helmet>

      <BackButton to="/v3/fonctionnalites" label="Retour aux fonctionnalités" />

      <header className="mb-6 mt-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          <Users className="h-6 w-6" style={{ color: 'var(--v3-emerald)' }} />
          Plan d’acquisition — 14 jours
        </h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--v3-muted)' }}>
          Deux leviers gratuits : les groupes Facebook d’auteurs, et votre base actuelle
          qui invite ses proches. Une action par jour, tout est déjà rédigé.
        </p>
      </header>

      {/* Lien de partage */}
      <section className="mb-6 rounded-2xl bg-white p-5" style={{ border: '1px solid var(--v3-line)' }}>
        <Label htmlFor="acq-link" className="flex items-center gap-2 text-[13px]">
          <Link2 className="h-4 w-4" style={{ color: 'var(--v3-emerald)' }} />
          Le lien inséré dans tous les textes
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          <Input
            id="acq-link"
            value={customLink || shareLink}
            onChange={(e) => setCustomLink(e.target.value)}
            className="flex-1 min-w-[240px]"
          />
          <Button variant="outline" onClick={() => copy(shareLink)} className="gap-2">
            <Copy className="h-4 w-4" /> Copier
          </Button>
        </div>
      </section>

      {/* Étape 1 : trouver les groupes */}
      <section className="mb-6 rounded-2xl bg-white p-5" style={{ border: '1px solid var(--v3-line)' }}>
        <h2 className="flex items-center gap-2 text-[16px] font-bold" style={{ color: 'var(--v3-ink)' }}>
          <Search className="h-5 w-5" style={{ color: 'var(--v3-emerald)' }} />
          Étape 1 — Trouver les bons groupes
        </h2>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--v3-muted)' }}>
          Tapez ces recherches dans Facebook, onglet « Groupes ». Rejoignez ceux de plus de
          2 000 membres où des publications récentes reçoivent des commentaires — un gros groupe
          silencieux ne sert à rien.
        </p>
        <ul className="mt-3 space-y-2">
          {GROUP_SEARCHES.map((g) => (
            <li key={g.query} className="flex flex-wrap items-center gap-2 text-[13.5px]">
              <button
                onClick={() => copy(g.query)}
                className="rounded-lg px-2.5 py-1 font-semibold"
                style={{ background: 'var(--v3-emerald-50)', color: 'var(--v3-emerald)' }}
              >
                {g.query}
              </button>
              <span style={{ color: 'var(--v3-muted)' }}>{g.note}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Règles */}
      <section className="mb-6 rounded-2xl p-5" style={{ background: 'rgba(180,83,9,0.06)', border: '1px solid rgba(180,83,9,0.2)' }}>
        <h2 className="flex items-center gap-2 text-[16px] font-bold" style={{ color: 'var(--v3-ink)' }}>
          <ShieldAlert className="h-5 w-5" style={{ color: 'var(--v3-gold-600)' }} />
          Les règles à ne pas enfreindre
        </h2>
        <ul className="mt-3 space-y-2 text-[13.5px]" style={{ color: 'var(--v3-ink)' }}>
          {GROUP_RULES.map((r) => (
            <li key={r} className="flex gap-2">
              <span style={{ color: 'var(--v3-gold-600)' }}>•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Progression */}
      <div className="mb-5 rounded-xl bg-white p-4" style={{ border: '1px solid var(--v3-line)' }}>
        <div className="flex items-center justify-between text-[13px]">
          <span className="flex items-center gap-2 font-semibold" style={{ color: 'var(--v3-ink)' }}>
            <CalendarDays className="h-4 w-4" style={{ color: 'var(--v3-gold-600)' }} />
            {done.length} / {ACQUISITION_POSTS.length} jours faits
          </span>
          <span style={{ color: 'var(--v3-muted)' }}>{progress} %</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--v3-emerald-50)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'var(--v3-emerald)' }} />
        </div>
      </div>

      {/* Étape 2 : les 14 posts */}
      <h2 className="mb-3 text-[16px] font-bold" style={{ color: 'var(--v3-ink)' }}>
        Étape 2 — Le texte de chaque jour
      </h2>
      <div className="space-y-4">
        {ACQUISITION_POSTS.map((post) => {
          const isDone = done.includes(post.day);
          return (
            <article
              key={post.day}
              className="rounded-2xl bg-white p-5"
              style={{ border: '1px solid var(--v3-line)', opacity: isDone ? 0.72 : 1 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.12em]"
                    style={{ background: 'var(--v3-emerald-50)', color: 'var(--v3-emerald)' }}
                  >
                    Jour {post.day}
                  </span>
                  <h3 className="mt-2 text-[15px] font-bold" style={{ color: 'var(--v3-ink)' }}>
                    {post.theme}
                  </h3>
                </div>
                <label className="flex items-center gap-2 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
                  <Checkbox checked={isDone} onCheckedChange={() => toggleDone(post.day)} />
                  Fait
                </label>
              </div>

              <pre
                className="mt-3 whitespace-pre-wrap rounded-xl p-4 font-sans text-[13.5px] leading-relaxed"
                style={{ background: '#FAFAF7', color: 'var(--v3-ink)' }}
              >
                {post.value}
              </pre>
              <Button variant="outline" className="mt-3 gap-2" onClick={() => copy(post.value)}>
                <Copy className="h-4 w-4" /> Copier le post
              </Button>

              {post.offer && (
                <div className="mt-4 rounded-xl p-4" style={{ background: 'var(--v3-emerald-50)' }}>
                  <p className="text-[12px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--v3-emerald)' }}>
                    À ajouter en commentaire de votre propre post
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed" style={{ color: 'var(--v3-ink)' }}>
                    {fill(post.offer)}
                  </pre>
                  <Button variant="outline" className="mt-3 gap-2" onClick={() => copy(post.offer!)}>
                    <Copy className="h-4 w-4" /> Copier le commentaire
                  </Button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Étape 3 : parrainage */}
      <h2 className="mb-3 mt-8 flex items-center gap-2 text-[16px] font-bold" style={{ color: 'var(--v3-ink)' }}>
        <Gift className="h-5 w-5" style={{ color: 'var(--v3-gold-600)' }} />
        Étape 3 — Activer votre base par le parrainage
      </h2>
      <p className="mb-3 text-[13.5px]" style={{ color: 'var(--v3-muted)' }}>
        Chaque contact existant connaît au moins une personne qui rêve d’écrire un livre.
        Demandez-le simplement : c’est le canal le moins coûteux et le mieux converti.
      </p>
      <div className="space-y-4">
        {REFERRAL_MESSAGES.map((m) => (
          <article key={m.id} className="rounded-2xl bg-white p-5" style={{ border: '1px solid var(--v3-line)' }}>
            <h3 className="text-[15px] font-bold" style={{ color: 'var(--v3-ink)' }}>{m.label}</h3>
            {m.subject && (
              <p className="mt-1 text-[13px]" style={{ color: 'var(--v3-muted)' }}>
                Objet : <strong style={{ color: 'var(--v3-ink)' }}>{m.subject}</strong>
              </p>
            )}
            <pre
              className="mt-3 whitespace-pre-wrap rounded-xl p-4 font-sans text-[13.5px] leading-relaxed"
              style={{ background: '#FAFAF7', color: 'var(--v3-ink)' }}
            >
              {fill(m.body)}
            </pre>
            <Button variant="outline" className="mt-3 gap-2" onClick={() => copy(m.body)}>
              <Copy className="h-4 w-4" /> Copier
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
