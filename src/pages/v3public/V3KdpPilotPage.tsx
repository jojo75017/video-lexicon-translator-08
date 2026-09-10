import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Target, ExternalLink, Copy, Check, Info, LineChart } from 'lucide-react';
import { toast } from 'sonner';
import { BackButton } from '@/components/v3/BackButton';
import KdpPilotPromoBanner from '@/components/ebook/KdpPilotPromoBanner';
import { KDP_PILOT_GO_PATH, KDP_PILOT_PROMO_CODE } from '@/data/externalLinks';

const USAGES = [
  {
    icon: LineChart,
    title: 'L’historique de votre classement',
    text: 'Vous voyez jour après jour comment votre livre monte ou descend dans le classement Amazon, au lieu de deviner.',
  },
  {
    icon: TrendingUp,
    title: 'Les ventes estimées',
    text: 'Une estimation du nombre de ventes derrière une position, pour savoir si une niche vaut vraiment le travail.',
  },
  {
    icon: Target,
    title: 'Vos concurrents suivis',
    text: 'Vous surveillez les livres qui occupent votre niche : prix, position, régularité des ventes.',
  },
  {
    icon: BarChart3,
    title: 'Le bon moment pour ajuster',
    text: 'Titre, couverture, description, prix : vous savez quand agir parce que vous voyez l’effet de chaque changement.',
  },
];

/**
 * Page dédiée KDP Pilot — outil partenaire payant, indépendant d'EbookStudio.
 * Regroupe le bandeau existant, le code abonné et les explications, pour ne plus
 * surcharger l'accueil V3.
 */
export default function V3KdpPilotPage() {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(KDP_PILOT_PROMO_CODE);
      setCopied(true);
      toast.success('Code copié : ' + KDP_PILOT_PROMO_CODE);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Copie impossible — notez le code : ' + KDP_PILOT_PROMO_CODE);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 space-y-6">
      <BackButton />

      <header className="space-y-2">
        <span
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ borderColor: 'rgba(201,168,76,0.45)', background: 'rgba(201,168,76,0.12)', color: '#8a6d1f' }}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Outil partenaire — pour aller plus loin
        </span>
        <h1 className="v3-serif text-[26px] md:text-[32px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
          KDP Pilot — suivez vos ventes réelles sur Amazon
        </h1>
        <p className="text-[15px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
          EbookStudio vous aide à écrire et à publier. KDP Pilot vous aide à comprendre ce qui se passe
          <strong> après</strong> la publication : classement, ventes estimées, concurrence de votre niche.
          En tant qu’abonné EbookStudio, vous bénéficiez d’une réduction négociée.
        </p>
      </header>

      {/* Code abonné */}
      <section
        className="rounded-[20px] border p-5 md:p-6"
        style={{ borderColor: 'rgba(13,122,95,0.28)', background: 'linear-gradient(120deg, rgba(13,122,95,0.06), rgba(201,168,76,0.12))' }}
      >
        <h2 className="v3-serif text-[19px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
          Votre code abonné EbookStudio
        </h2>
        <p className="mt-1 text-[13.5px]" style={{ color: 'var(--v3-muted)' }}>
          15 % de réduction sur le premier mois ou la première année. À saisir dans le champ
          « code promo » de KDP Pilot, au moment du paiement.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className="rounded-xl border px-5 py-3 text-[20px] font-bold tracking-[0.16em]"
            style={{ borderColor: 'rgba(201,168,76,0.55)', background: '#fff', color: 'var(--v3-ink)' }}
          >
            {KDP_PILOT_PROMO_CODE}
          </span>
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-[13.5px] font-semibold text-white transition hover:opacity-90"
            style={{ background: '#0d7a5f' }}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Code copié' : 'Copier le code'}
          </button>
          <a
            href={KDP_PILOT_GO_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[13.5px] font-bold transition hover:-translate-y-0.5"
            style={{ background: '#c9a84c', color: '#1a1408' }}
          >
            Découvrir KDP Pilot <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Bandeau détaillé existant */}
      <KdpPilotPromoBanner variant="light" />

      {/* À quoi ça sert */}
      <section className="space-y-3">
        <h2 className="v3-serif text-[21px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
          À quoi ça sert, concrètement
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {USAGES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-[18px] border p-4"
              style={{ borderColor: 'rgba(13,122,95,0.18)', background: '#fffdf8' }}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: '#0d7a5f' }} />
                <h3 className="text-[14.5px] font-bold" style={{ color: 'var(--v3-ink)' }}>
                  {title}
                </h3>
              </div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Transparence */}
      <section
        className="rounded-[18px] border p-4 md:p-5"
        style={{ borderColor: 'rgba(0,0,0,0.10)', background: 'rgba(0,0,0,0.03)' }}
      >
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--v3-muted)' }} />
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
            En toute transparence : KDP Pilot est un service <strong>indépendant et payant</strong>, qui n’est
            pas inclus dans votre abonnement EbookStudio. Nous avons négocié une réduction pour nos abonnés et
            notre lien est un lien partenaire. Vous pouvez très bien publier sans cet outil : il s’adresse à
            celles et ceux qui veulent piloter leurs ventes de près.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 pt-1">
        <Link
          to="/v3/recherche"
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13.5px] font-semibold"
          style={{ borderColor: 'rgba(13,122,95,0.3)', color: 'var(--v3-ink)' }}
        >
          Studio Recherche KDP (inclus)
        </Link>
        <Link
          to="/v3/mes-livres"
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13.5px] font-semibold"
          style={{ borderColor: 'rgba(13,122,95,0.3)', color: 'var(--v3-ink)' }}
        >
          Mes livres
        </Link>
      </div>
    </div>
  );
}
