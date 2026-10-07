import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, PenLine, Compass, Lightbulb, Feather, Palette, LayoutTemplate, LayoutGrid,
  BookOpen, BookMarked, Image as ImageIcon, AudioLines, Tags, Gift, Target, Sparkles, Info,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useV3Entitlement } from '@/hooks/useV3Entitlement';
import { V3_AGENTS } from '@/data/v3Agents';
import AgentPortrait from './AgentPortrait';

const STEPS = [
  { n: 1, title: 'Idée et niche', icon: Lightbulb, to: '/v3/kdp/radar-niches' },
  { n: 2, title: 'Écriture', icon: Feather, to: '/v3/create' },
  { n: 3, title: 'Couverture', icon: Palette, to: '/v3/mes-couvertures' },
  { n: 4, title: 'Mise en page Kindle et broché', icon: LayoutTemplate, to: '/v3/outils/editeur' },
  { n: 5, title: 'Voir tous les outils', icon: LayoutGrid, to: '/v3/outils' },
];

const PILLS = [
  { label: 'Kindle', icon: BookOpen, to: '/v3/outils/editeur' },
  { label: 'Livre broché', icon: BookMarked, to: '/v3/outils/editeur' },
  { label: 'Couverture', icon: ImageIcon, to: '/v3/mes-couvertures' },
  { label: 'Livre audio', icon: AudioLines, to: '/v3/outils/audiobook' },
  { label: 'Métadonnées', icon: Tags, to: '/v3/kdp/fiche-audit' },
];

const SHORTCUTS = [
  { label: 'Kit de démarrage', icon: Gift, to: '/v3/kit-demarrage' },
  { label: '10 niches rentables', icon: Target, to: '/10-niches-offertes' },
  { label: 'Nouveautés', icon: Sparkles, to: '/v3/nouveautes' },
];

type Book = { id: string; title: string | null; updated_at: string };

const card = 'rounded-3xl bg-white p-5 md:p-6';
const cardStyle = { border: '2px solid var(--v3-joy-orange-soft)' };

export default function V3SubscriberHome({ user }: { user: any }) {
  const { hasBase, hasFull, isAdmin } = useV3Entitlement() as any;
  const [books, setBooks] = useState<Book[] | null>(null);

  const meta = user?.user_metadata ?? {};
  const fullName: string = meta.first_name || meta.full_name || meta.name || '';
  const prenom = fullName.trim().split(/\s+/)[0] || (user?.email ?? '').split('@')[0];
  const niveau = isAdmin ? 'Administrateur' : hasFull ? 'Édition' : hasBase ? 'Plume' : 'Abonné';

  useEffect(() => {
    if (window.location.hash !== '#nouveau-livre') return;
    const t = setTimeout(() => document.getElementById('nouveau-livre')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    let cancelled = false;
    supabase
      .from('ebook_projects')
      .select('id,title,updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(3)
      .then(({ data }) => { if (!cancelled) setBooks((data as Book[]) ?? []); });
    return () => { cancelled = true; };
  }, [user.id]);

  return (
    <section style={{ background: 'var(--v3-joy-cream)', borderBottom: '1px solid var(--v3-joy-orange-soft)' }}>
      <div className="v3-shell space-y-8 py-8 md:py-12">
        {/* a) Bienvenue */}
        <div className="text-center">
          <span
            className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
          >
            Niveau {niveau}
          </span>
          <h1 className="v3-serif mt-3 text-2xl font-semibold md:text-4xl" style={{ color: 'var(--v3-joy-ink)' }}>
            Bienvenue dans votre maison d'édition IA{prenom ? `, ${prenom}` : ''}
          </h1>
        </div>

        {/* b) Deux boutons + robots */}
        <div id="nouveau-livre" className="flex flex-col items-stretch justify-center gap-3 sm:flex-row scroll-mt-28">
          <Link
            to="/v3/create"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: '#1C1C1C', color: '#FFFFFF', border: '2px solid #1C1C1C' }}
          >
            <PenLine className="h-5 w-5" /> Créer un nouveau livre
          </Link>
          <Link
            to="/v3/commence-ici"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: '#FFFFFF', color: '#1C1C1C', border: '2px solid #1C1C1C' }}
          >
            <Compass className="h-5 w-5" /> Commence ici
          </Link>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2">
          <ul className="flex gap-3">
            {V3_AGENTS.map((a) => (
              <li key={a.id} className="w-24 shrink-0 sm:w-28">
                <Link to={a.route} className="group block text-center" title={a.role}>
                  <div className="aspect-square overflow-hidden rounded-2xl bg-white transition-transform group-hover:-translate-y-1" style={cardStyle}>
                    <AgentPortrait id={a.id} name={a.name} />
                  </div>
                  <p className="mt-1.5 truncate text-xs font-bold" style={{ color: 'var(--v3-joy-ink)' }}>{a.name}</p>
                  <p className="truncate text-[11px]" style={{ color: 'var(--v3-joy-muted)' }}>{a.role}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* c) Reprendre */}
          <div className={card} style={cardStyle}>
            <h2 className="v3-serif text-xl font-semibold" style={{ color: 'var(--v3-joy-ink)' }}>Reprendre où j'en étais</h2>
            {books === null ? (
              <p className="mt-3 text-sm" style={{ color: 'var(--v3-joy-muted)' }}>Chargement…</p>
            ) : books.length === 0 ? (
              <div className="mt-3 text-sm" style={{ color: 'var(--v3-joy-muted)' }}>
                Vous n'avez pas encore de livre en cours. Lancez votre premier livre dès maintenant !
                <div className="mt-3">
                  <Link to="/v3/create" className="v3-btn v3-joy-cta">Créer mon premier livre <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </div>
            ) : (
              <ul className="mt-3 space-y-2">
                {books.map((b, i) => {
                  const t = [
                    { bg: 'rgba(29,78,216,0.07)', bd: '#1D4ED8', btn: '#1D4ED8', btnFg: '#ffffff' },
                    { bg: '#ffffff', bd: '#1e3a8a', btn: '#ffffff', btnFg: '#1e3a8a' },
                    { bg: 'rgba(220,38,38,0.07)', bd: '#DC2626', btn: '#DC2626', btnFg: '#ffffff' },
                  ][i % 3];
                  return (
                  <li key={b.id} className="flex items-center justify-between gap-3 rounded-2xl border px-3 py-3" style={{ background: t.bg, borderColor: `${t.bd}66` }}>
                    <div className="min-w-0">
                      <p className="truncate font-semibold" style={{ color: 'var(--v3-joy-ink)' }}>{b.title || 'Livre sans titre'}</p>
                      <p className="text-xs" style={{ color: 'var(--v3-joy-muted)' }}>
                        Modifié le {new Date(b.updated_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Link
                      to={`/v3/book/${b.id}`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                      style={{ background: t.btn, border: `1.5px solid ${t.bd}`, color: t.btnFg }}
                    >
                      <span style={{ color: t.btnFg }}>Continuer</span> <ArrowRight className="h-4 w-4" style={{ color: t.btnFg }} />
                    </Link>
                  </li>
                  );
                })}
              </ul>
            )}
            {books !== null && books.length > 0 && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--v3-joy-muted)' }}>
                <AudioLines className="h-3.5 w-3.5" style={{ color: 'var(--v3-joy-orange-600)' }} />
                Bon à savoir : une fois terminé, vous pouvez aussi le faire en{' '}
                <Link to="/v3/version-audio" className="font-semibold underline underline-offset-2" style={{ color: 'var(--v3-joy-orange-600)' }}>version audio</Link>.
              </p>
            )}
          </div>

          {/* d) Parcours */}
          <div className={card} style={cardStyle}>
            <h2 className="v3-serif text-xl font-semibold" style={{ color: 'var(--v3-joy-ink)' }}>Votre parcours en 5 étapes</h2>
            <ol className="mt-3 space-y-2">
              {STEPS.map(({ n, title, icon: Icon, to }) => (
                <li key={n}>
                  <Link to={to} className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-[var(--v3-joy-cream)]">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black text-white" style={{ background: n % 2 ? 'var(--v3-joy-orange)' : 'var(--v3-joy-yellow)' }}>{n}</span>
                    <Icon className="h-4 w-4 shrink-0" style={{ color: 'var(--v3-joy-orange-600)' }} />
                    <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--v3-joy-ink)' }}>{title}</span>
                    <ArrowRight className="h-4 w-4 opacity-40 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] font-medium" style={{ color: 'var(--v3-joy-muted)' }}>
              <Info className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--v3-joy-orange-600)' }} />
              <span>Pour les nouveaux : ils seront mis au fur et à mesure.</span>
              <Link to="/v3/tutoriels-v3" className="font-semibold underline underline-offset-2" style={{ color: 'var(--v3-joy-orange-600)' }}>Voir les tutoriels</Link>
            </p>
          </div>
        </div>

        {/* Bande fine — raccourci vers les studios et compléments */}
        <a
          href="#v3-upsells"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('v3-upsells')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-full px-5 py-2.5 text-center text-[13px] font-semibold transition-transform hover:-translate-y-0.5"
          style={{ background: 'var(--v3-joy-orange-soft)', border: '1px solid var(--v3-joy-orange)', color: 'var(--v3-joy-orange-600)' }}
        >
          <span aria-hidden>✨</span>
          <span className="hidden sm:inline">Studios et compléments : BD &amp; Jeunesse, Couvertures, Micro-séries, Audio…</span>
          <span className="sm:hidden font-bold">Studios et compléments</span>
          <span aria-hidden>→ Voir les options</span>
        </a>

        {/* Pastilles + e) Raccourcis */}
        <div className="flex flex-wrap justify-center gap-2">
          {PILLS.map(({ label, icon: Icon, to }, i) => {
            const c = ['#0F766E', '#1D4ED8', '#EC4899', '#0891B2', '#9333EA'][i % 5];
            return (
              <Link key={label} to={to} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-transform hover:-translate-y-0.5" style={{ background: c, border: `1px solid ${c}`, color: '#ffffff' }}>
                <Icon className="h-3.5 w-3.5" style={{ color: '#ffffff' }} /> <span style={{ color: '#ffffff' }}>{label}</span>
              </Link>
            );
          })}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {SHORTCUTS.map(({ label, icon: Icon, to }, i) => {
            const t = [
              { bg: '#1D4ED8', fg: '#ffffff', bd: '#1D4ED8' },
              { bg: '#ffffff', fg: '#1e3a8a', bd: '#1e3a8a' },
              { bg: '#DC2626', fg: '#ffffff', bd: '#DC2626' },
            ][i % 3];
            return (
              <Link key={label} to={to} className={`${card} flex items-center gap-3 transition-transform hover:-translate-y-0.5`} style={{ background: t.bg, border: `2px solid ${t.bd}`, color: t.fg }}>
                <Icon className="h-5 w-5" style={{ color: t.fg }} />
                <span className="flex-1 font-semibold" style={{ color: t.fg }}>{label}</span>
                <ArrowRight className="h-4 w-4" style={{ color: t.fg }} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
