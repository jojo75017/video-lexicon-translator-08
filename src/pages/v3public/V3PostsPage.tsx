import { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Copy, Check, Megaphone, Link2, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import BackButton from '@/components/v3/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useReferral } from '@/hooks/useReferral';
import {
  V3_SOCIAL_POSTS,
  SOCIAL_CHANNELS,
  type SocialChannel,
} from '@/data/v3SocialPosts';

const DONE_KEY = 'v3-posts-done';
const GIFT_URL = 'https://ebookstudio.fr/cadeau';

/**
 * Onglet « Posts » : 30 jours de publications prêtes à copier-coller
 * (Facebook / LinkedIn / Reels), avec le lien de partage de l'abonné.
 * Aucun identifiant de réseau social n'est demandé ni stocké.
 */
export default function V3PostsPage() {
  const { code, getReferralLink } = useReferral();
  const [channel, setChannel] = useState<SocialChannel>('facebook');
  const [customLink, setCustomLink] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
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
    // On envoie toujours vers la page cadeau : c'est l'entrée qui convertit,
    // avec le code de parrainage de l'abonné quand il en a un.
    return code ? `${GIFT_URL}?ref=${code}` : GIFT_URL;
  }, [customLink, code]);

  const buildText = (day: number) => {
    const post = V3_SOCIAL_POSTS.find((p) => p.day === day)!;
    const body = post[channel].split('{{LIEN}}').join(shareLink);
    const tags = channel === 'linkedin'
      ? post.hashtags.map((h) => `#${h}`).join(' ')
      : post.hashtags.map((h) => `#${h}`).join(' ');
    return `${body}\n\n${tags}`;
  };

  const copy = async (day: number) => {
    try {
      await navigator.clipboard.writeText(buildText(day));
      setCopied(`${day}-${channel}`);
      toast.success('Texte copié — collez-le sur votre réseau.');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error('Copie impossible : sélectionnez le texte manuellement.');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Lien copié.');
    } catch {
      toast.error('Copie impossible.');
    }
  };

  const progress = Math.round((done.length / V3_SOCIAL_POSTS.length) * 100);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Helmet>
        <title>Posts — 30 jours de publications prêtes | Ebookstudio</title>
        <meta
          name="description"
          content="30 jours de publications prêtes à copier-coller pour Facebook, LinkedIn et Reels, avec votre lien de partage : faites connaître vos livres sans budget publicitaire."
        />
      </Helmet>

      <BackButton to="/v3/fonctionnalites" label="Retour aux fonctionnalités" />

      <header className="mb-6 mt-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          <Megaphone className="h-6 w-6" style={{ color: 'var(--v3-emerald)' }} />
          Posts — 30 jours prêts à publier
        </h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--v3-muted)' }}>
          Un post par jour, déjà rédigé. Vous choisissez le réseau, vous copiez, vous collez.
          Deux minutes par jour suffisent.
        </p>
        <p className="mt-3 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
          Aucun mot de passe Facebook ou LinkedIn n'est demandé : la publication reste dans vos mains,
          votre compte n'est jamais exposé.
        </p>
      </header>

      {/* Lien de partage */}
      <section className="mb-5 rounded-2xl bg-white p-5" style={{ border: '1px solid var(--v3-line)' }}>
        <Label htmlFor="share-link" className="flex items-center gap-2 text-[13px]">
          <Link2 className="h-4 w-4" style={{ color: 'var(--v3-emerald)' }} />
          Le lien inséré dans vos posts
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          <Input
            id="share-link"
            value={customLink || shareLink}
            onChange={(e) => setCustomLink(e.target.value)}
            className="flex-1 min-w-[240px]"
          />
          <Button variant="outline" onClick={copyLink} className="gap-2">
            <Copy className="h-4 w-4" /> Copier le lien
          </Button>
        </div>
        <p className="mt-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
          {code
            ? 'Votre lien de parrainage est utilisé automatiquement : les inscriptions vous sont attribuées.'
            : 'Lien par défaut : la page cadeau. Activez votre parrainage pour suivre vos inscriptions.'}
        </p>
      </section>

      {/* Choix du réseau */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SOCIAL_CHANNELS.map((c) => (
          <button
            key={c.id}
            onClick={() => setChannel(c.id)}
            className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition"
            style={
              channel === c.id
                ? { background: 'var(--v3-emerald)', color: '#fff' }
                : { background: '#fff', color: 'var(--v3-muted)', border: '1px solid var(--v3-line)' }
            }
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="mb-5 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
        {SOCIAL_CHANNELS.find((c) => c.id === channel)?.hint}
      </p>

      {/* Progression */}
      <div className="mb-5 rounded-xl bg-white p-4" style={{ border: '1px solid var(--v3-line)' }}>
        <div className="flex items-center justify-between text-[13px]">
          <span className="flex items-center gap-2 font-semibold" style={{ color: 'var(--v3-ink)' }}>
            <CalendarDays className="h-4 w-4" style={{ color: 'var(--v3-gold-600)' }} />
            {done.length} / {V3_SOCIAL_POSTS.length} publiés
          </span>
          <span style={{ color: 'var(--v3-muted)' }}>{progress} %</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--v3-emerald-50)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'var(--v3-emerald)' }} />
        </div>
      </div>

      {/* Calendrier */}
      <div className="space-y-4">
        {V3_SOCIAL_POSTS.map((post) => {
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
                  <h2 className="mt-2 text-[15px] font-bold" style={{ color: 'var(--v3-ink)' }}>
                    {post.theme}
                  </h2>
                </div>
                <label className="flex items-center gap-2 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
                  <Checkbox checked={isDone} onCheckedChange={() => toggleDone(post.day)} />
                  Publié
                </label>
              </div>

              <pre
                className="mt-3 whitespace-pre-wrap rounded-xl p-4 text-[13.5px] leading-relaxed"
                style={{ background: '#FAFAFA', color: 'var(--v3-ink)', fontFamily: 'inherit' }}
              >
                {buildText(post.day)}
              </pre>

              <Button onClick={() => copy(post.day)} className="mt-3 gap-2">
                {copied === `${post.day}-${channel}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === `${post.day}-${channel}` ? 'Copié' : 'Copier ce post'}
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
