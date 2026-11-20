import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BookOpen, CheckCircle2, Download, Loader2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import '@/styles/v3-public.css';
import { BOOK_SITE_BACKGROUNDS } from '@/lib/bookSite/backgrounds';
import type { BookSiteTheme } from '@/lib/bookSite/themes';

type Site = { slug: string; title: string; subtitle: string | null; author_name: string | null; description: string | null; excerpt_title: string | null; excerpt: string | null; cover_url: string | null; theme: string; amazon_kindle_url: string | null; amazon_paperback_url: string | null; user_id: string; published: boolean };
type Reader = { email: string; first_name: string | null; consent_at: string };
const db = supabase as unknown as { from: (t: string) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any

export function BookSiteView({ site, preview = false }: { site: Site; preview?: boolean }) {
  const [email, setEmail] = useState(''); const [firstName, setFirstName] = useState('');
  const [consent, setConsent] = useState(false); const [website, setWebsite] = useState('');
  const [pending, setPending] = useState(false); const [done, setDone] = useState(false); const [error, setError] = useState('');
  const author = site.author_name || 'l’auteur';
  async function subscribe(e: FormEvent) {
    e.preventDefault(); if (pending || preview) return;
    if (!consent) { setError('Veuillez cocher la case de consentement.'); return; }
    setPending(true); setError('');
    const { data, error: err } = await supabase.functions.invoke('book-reader-signup', { body: { book_slug: site.slug, email: email.trim(), first_name: firstName.trim(), consent, website } });
    if (err || !data?.ok) setError(data?.error || 'L’inscription n’a pas pu être enregistrée. Réessayez dans un instant.'); else setDone(true);
    setPending(false);
  }
  return (
    <main className="book-site min-h-screen" data-theme={site.theme}>
      <section className="bs-hero px-5 py-16 md:py-24" style={{ backgroundImage: `url(${BOOK_SITE_BACKGROUNDS[site.theme as BookSiteTheme] || BOOK_SITE_BACKGROUNDS.clair})` }}><div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        {site.cover_url ? <img src={site.cover_url} alt={`Couverture du livre ${site.title}`} className="bs-cover mx-auto w-full max-w-sm rounded-md" />
          : <div className="bs-book mx-auto w-full max-w-sm" role="img" aria-label={`Livre ${site.title}`}>
            <div className="bs-book-front" style={{ backgroundImage: `url(${BOOK_SITE_BACKGROUNDS[site.theme as BookSiteTheme] || BOOK_SITE_BACKGROUNDS.clair})` }}>
              <div className="bs-book-shade" />
              <p className="bs-book-title">{site.title}</p>
              {site.subtitle && <p className="bs-book-sub">{site.subtitle}</p>}
              {site.author_name && <p className="bs-book-author">{site.author_name}</p>}
            </div>
          </div>}
        <div className="bs-hero-panel">
          <h1 className="mb-3 text-4xl font-extrabold leading-tight md:text-5xl">{site.title}</h1>
          {site.subtitle && <p className="bs-sub mb-3 text-xl">{site.subtitle}</p>}
          {site.author_name && <p className="bs-accent mb-5 text-lg font-semibold">{site.author_name}</p>}
          {site.description && <p className="bs-sub mb-8 line-clamp-6 whitespace-pre-line text-lg leading-relaxed">{site.description}</p>}
          <div className="flex flex-wrap gap-3">
            {site.amazon_kindle_url && <a className="bs-btn" href={site.amazon_kindle_url} target="_blank" rel="noopener noreferrer">Acheter le Kindle</a>}
            {site.amazon_paperback_url && <a className="bs-btn-out" href={site.amazon_paperback_url} target="_blank" rel="noopener noreferrer">Acheter le broché</a>}
          </div>
          {site.excerpt && <a href="#lecture" className="bs-accent mt-5 inline-flex items-center gap-2 font-semibold underline"><BookOpen className="h-4 w-4" /> Lire les premières pages</a>}
        </div>
      </div></section>
      {site.excerpt && <section id="lecture" className="bs-muted bs-line border-y px-5 py-12"><div className="mx-auto max-w-3xl">
        <p className="bs-accent mb-3 text-sm font-semibold uppercase tracking-widest">Extrait</p>
        {site.excerpt_title && <h2 className="mb-6 text-3xl font-bold">{site.excerpt_title}</h2>}
        <div className="space-y-5 text-lg leading-loose">{site.excerpt.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div>
      </div></section>}
      <section className="bs-line border-b px-5 py-10 text-center"><div className="mx-auto max-w-3xl">
        <h2 className="mb-2 text-2xl font-bold">📢 Vous aimez ce livre ? Partagez-le avec vos amis !</h2>
        {(() => {
          const url = `https://ebookstudio.fr/livre/${site.slug}`;
          const msg = `Regarde ce livre que je viens de découvrir : « ${site.title} ». Tu peux lire le début gratuitement ici : ${url}`;
          return <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a className="bs-btn" href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a className="bs-btn-out" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a className="bs-btn-out" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer">X</a>
            <button type="button" className="bs-btn-out" onClick={() => void navigator.clipboard.writeText(url)}>Copier le lien</button>
          </div>;
        })()}
      </div></section>
      <section className="mx-auto max-w-3xl px-5 py-14">
        <Mail className="bs-accent mb-4 h-7 w-7" aria-hidden="true" />
        <h2 className="mb-4 text-3xl font-bold">Gardons le contact</h2>
        <p className="bs-sub mb-8 text-lg">Recevez les nouvelles de {author} et soyez informé de ses prochains livres.</p>
        {done ? <p role="status" className="bs-muted flex gap-3 rounded p-5"><CheckCircle2 className="bs-accent" /> Merci, votre inscription est enregistrée.</p> :
          <form onSubmit={subscribe} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">Prénom (facultatif)<input className="block w-full rounded px-3 py-2" maxLength={80} value={firstName} onChange={(e) => setFirstName(e.target.value)} /></label>
              <label className="space-y-2 text-sm font-medium">Adresse e-mail<input className="block w-full rounded px-3 py-2" type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            </div>
            <div hidden aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> J’accepte de recevoir par e-mail les nouvelles et prochains livres de {author}. Je peux retirer mon consentement à tout moment.</label>
            {error && <p role="alert" className="font-semibold">{error}</p>}
            <button type="submit" className="bs-btn" disabled={pending || preview}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />} {preview ? 'Formulaire (aperçu)' : 'Recevoir les nouvelles'}</button>
          </form>}
      </section>
      <footer className="bs-line bs-sub border-t px-5 py-6 text-center text-sm">
        Site créé avec <a href="/essai" className="bs-accent font-semibold">EbookStudio</a>
        <nav className="mt-3 flex flex-wrap justify-center gap-5"><a href="/mentions-legales" className="underline">Mentions légales</a><a href="/politique-confidentialite" className="underline">Politique de confidentialité</a><a href="/cgv" className="underline">CGV</a></nav>
      </footer>
    </main>
  );
}

export default function BookSitePage() {
  const { slug = '' } = useParams();
  const [site, setSite] = useState<Site | null | undefined>(undefined);
  const [readers, setReaders] = useState<Reader[] | null>(null);
  useEffect(() => {
    void (async () => {
      const { data } = await db.from('book_sites').select('*').eq('slug', slug).maybeSingle();
      setSite(data || null);
      const { data: auth } = await supabase.auth.getUser();
      if (data && auth.user?.id === data.user_id) {
        const { data: r } = await db.from('book_reader_signups').select('email,first_name,consent_at').eq('book_slug', slug).order('consent_at', { ascending: false });
        setReaders(r || []);
      }
    })();
  }, [slug]);
  if (site === undefined) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!site) return <div className="flex min-h-screen items-center justify-center p-6 text-center text-lg">Ce site de livre n’existe pas ou n’est pas encore publié.</div>;
  const exportCsv = () => {
    if (!readers) return;
    const cell = (v: string) => `"${v.replace(/^[=+@-]/, "'$&").replace(/"/g, '""')}"`;
    const csv = '\uFEFF' + ['email;prenom;consentement_date', ...readers.map((r) => [r.email, r.first_name || '', r.consent_at].map(cell).join(';'))].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = `lecteurs-${slug}.csv`; a.click();
  };
  return <>
    <Helmet><title>{`${site.title}${site.author_name ? ` | ${site.author_name}` : ''}`}</title><meta name="description" content={(site.description || site.title).slice(0, 155)} /></Helmet>
    {!site.published && <p className="bg-accent p-3 text-center text-sm font-semibold text-accent-foreground">Aperçu privé : ce site n’est pas encore publié.</p>}
    <BookSiteView site={site} />
    {readers && <section className="border-t border-border bg-muted p-6 text-foreground"><div className="mx-auto max-w-3xl"><h2 className="mb-3 text-xl font-semibold">Vos lecteurs inscrits ({readers.length})</h2>
      <button onClick={exportCsv} disabled={!readers.length} className="v3-btn v3-btn-outline text-sm"><Download className="h-4 w-4" /> Exporter les e-mails (CSV)</button>
      <div className="mt-3 max-h-64 overflow-auto text-sm">{readers.map((r) => <p key={r.email} className="border-b border-border py-2">{r.email} · {r.first_name || 'Sans prénom'}</p>)}</div></div></section>}
  </>;
}
