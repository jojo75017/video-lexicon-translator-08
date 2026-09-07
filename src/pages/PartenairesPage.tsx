import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '@/components/funnel/SeoHead';
import PartnerApplyForm from '@/components/partners/PartnerApplyForm';
import PartnerLinkPanel from '@/components/partners/PartnerLinkPanel';
import {
  AVERAGE_COMMISSION,
  BEST_COMMISSION,
  COMMISSION_FIRST_PAYMENT_RATE,
  PARTNER_BENEFITS,
  PARTNER_EARNINGS,
  PARTNER_FAQ,
  PARTNER_RULES,
  V3_OPENING_LABEL,
  formatEuro,
  round2,
} from '@/data/partnerProgram';

const INK = '#0F342E';
const INK_SOFT = 'rgba(15,52,46,0.72)';
const PAPER = '#F7F5EF';
const IVORY = '#FFFDF8';
const GOLD = '#B08D3F';
const LINE = 'rgba(15,52,46,0.14)';

const STEPS: { n: string; title: string; detail: string }[] = [
  {
    n: '1',
    title: 'Vous testez le studio',
    detail:
      "Un accès complet vous est ouvert. Vous écrivez un livre du début à la fin pour juger par vous-même.",
  },
  {
    n: '2',
    title: 'Vous recevez votre lien',
    detail:
      'Un lien personnel, créé en une seconde. Chaque clic et chaque abonnement souscrit sont comptés.',
  },
  {
    n: '3',
    title: 'Vous en parlez à votre façon',
    detail:
      'Un email, une vidéo, un article, une réponse en commentaire. Le kit fournit les textes ; vous gardez votre ton.',
  },
  {
    n: '4',
    title: 'Vous êtes payé',
    detail: `${Math.round(
      COMMISSION_FIRST_PAYMENT_RATE * 100,
    )} % du premier paiement, dès 30 € de commissions accumulées.`,
  },
];

export default function PartenairesPage() {
  const [sales, setSales] = useState(5);
  const projected = useMemo(() => round2(sales * AVERAGE_COMMISSION), [sales]);
  const ratePct = Math.round(COMMISSION_FIRST_PAYMENT_RATE * 100);

  return (
    <div className="min-h-screen" style={{ background: PAPER, color: INK }}>
      <SeoHead
        title={`Programme partenaires EbookStudio — ${ratePct} % par abonnement`}
        description={`Recommandez EbookStudio V3 à votre audience d'auteurs et touchez ${ratePct} % du premier paiement, jusqu'à ${formatEuro(
          BEST_COMMISSION,
        )} par abonnement. Accès d'essai offert, kit de textes prêt à publier.`}
        canonical="/partenaires"
      />

      {/* Bandeau */}
      <header
        className="border-b"
        style={{ background: INK, borderColor: GOLD, color: IVORY }}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <Link to="/" className="text-sm font-bold tracking-wide">
            EbookStudio
          </Link>
          <span className="text-xs" style={{ color: 'rgba(255,253,248,0.75)' }}>
            Programme partenaires · Ouverture de la V3 le {V3_OPENING_LABEL}
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: LINE }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{ background: `linear-gradient(180deg, ${GOLD}22, transparent)` }}
        />
        <div className="relative mx-auto max-w-5xl px-5 py-14 md:py-20">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: GOLD }}
          >
            Programme partenaires
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            Votre audience écrit des livres.
            <br />
            Nous les menons jusqu'à la publication.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: INK_SOFT }}>
            EbookStudio V3 accompagne un livre du sommaire jusqu'au fichier accepté par Amazon KDP.
            Si vous parlez à des auteurs — chaîne, blog, newsletter, groupe, podcast — vous touchez{' '}
            <strong>{ratePct} % du premier paiement</strong> de chaque abonnement souscrit avec
            votre lien, soit jusqu'à <strong>{formatEuro(BEST_COMMISSION)}</strong> par vente.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#candidature"
              className="rounded-md px-6 py-3 text-sm font-semibold transition hover:opacity-90"
              style={{ background: GOLD, color: '#FFFFFF' }}
            >
              Devenir partenaire
            </a>
            <a
              href="#gains"
              className="rounded-md border px-6 py-3 text-sm font-semibold transition hover:bg-white"
              style={{ borderColor: INK, color: INK }}
            >
              Voir les commissions
            </a>
          </div>

          <p className="mt-6 text-xs" style={{ color: 'rgba(15,52,46,0.55)' }}>
            Aucun frais, aucun engagement. Vous n'avez pas besoin de montrer votre visage.
          </p>
        </div>
      </section>

      {/* Ce que vous recevez */}
      <section className="border-b" style={{ borderColor: LINE }}>
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="text-2xl font-bold md:text-3xl">Ce que vous recevez</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PARTNER_BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-lg border p-5"
                style={{ background: IVORY, borderColor: LINE }}
              >
                <h3 className="font-bold" style={{ color: INK }}>
                  {b.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: INK_SOFT }}>
                  {b.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commissions */}
      <section id="gains" className="border-b" style={{ borderColor: LINE }}>
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="text-2xl font-bold md:text-3xl">Les commissions, en clair</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: INK_SOFT }}>
            {ratePct} % du premier paiement encaissé. Les formules annuelles rapportent le plus,
            parce que le premier paiement y couvre l'année entière.
          </p>

          <div
            className="mt-8 overflow-hidden rounded-lg border"
            style={{ background: IVORY, borderColor: LINE }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(15,52,46,0.05)' }}>
                  <th className="px-4 py-3 text-left font-semibold">Formule souscrite</th>
                  <th className="px-4 py-3 text-right font-semibold">Prix</th>
                  <th className="px-4 py-3 text-right font-semibold">Votre commission</th>
                </tr>
              </thead>
              <tbody>
                {PARTNER_EARNINGS.map((e) => (
                  <tr
                    key={e.label}
                    className="border-t"
                    style={{
                      borderColor: LINE,
                      background: e.highlight ? `${GOLD}14` : undefined,
                    }}
                  >
                    <td className="px-4 py-3">
                      {e.label}
                      {e.highlight && (
                        <span
                          className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                          style={{ background: GOLD, color: '#FFFFFF' }}
                        >
                          la plus rentable
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right" style={{ color: INK_SOFT }}>
                      {formatEuro(e.price)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold">{formatEuro(e.commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Simulateur */}
          <div
            className="mt-6 rounded-lg border p-6"
            style={{ background: IVORY, borderColor: GOLD }}
          >
            <label className="block text-sm font-semibold">
              Si {sales} personne{sales > 1 ? 's' : ''} de votre audience s'abonne
              {sales > 1 ? 'nt' : ''}
            </label>
            <input
              type="range"
              min={1}
              max={40}
              value={sales}
              onChange={(e) => setSales(Number(e.target.value))}
              className="mt-3 w-full accent-[#B08D3F]"
              aria-label="Nombre d'abonnements générés"
            />
            <p className="mt-3 text-2xl font-bold" style={{ color: INK }}>
              ≈ {formatEuro(projected)}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'rgba(15,52,46,0.6)' }}>
              Estimation sur la base d'une commission moyenne de {formatEuro(AVERAGE_COMMISSION)},
              toutes formules confondues. Ce n'est pas une promesse de revenus : le résultat dépend
              entièrement de votre audience.
            </p>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-b" style={{ borderColor: LINE }}>
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="text-2xl font-bold md:text-3xl">Comment ça se passe</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-lg border p-5"
                style={{ background: IVORY, borderColor: LINE }}
              >
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: INK, color: IVORY }}
                >
                  {s.n}
                </span>
                <h3 className="mt-3 font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: INK_SOFT }}>
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidature + espace partenaire */}
      <section id="candidature" className="border-b" style={{ borderColor: LINE }}>
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="text-2xl font-bold md:text-3xl">Rejoindre le programme</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: INK_SOFT }}>
            Si vous avez déjà un compte EbookStudio, votre lien se crée directement ci-dessous.
            Sinon, envoyez votre candidature : je vous ouvre un accès d'essai.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <PartnerApplyForm />
            <PartnerLinkPanel />
          </div>
        </div>
      </section>

      {/* Règles */}
      <section className="border-b" style={{ borderColor: LINE }}>
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="text-2xl font-bold md:text-3xl">Les règles, sans petites lignes</h2>
          <ul className="mt-6 space-y-3">
            {PARTNER_RULES.map((r) => (
              <li key={r} className="flex gap-3 text-sm leading-relaxed" style={{ color: INK_SOFT }}>
                <span style={{ color: GOLD }}>—</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="text-2xl font-bold md:text-3xl">Questions fréquentes</h2>
          <div className="mt-8 space-y-4">
            {PARTNER_FAQ.map((f) => (
              <div
                key={f.q}
                className="rounded-lg border p-5"
                style={{ background: IVORY, borderColor: LINE }}
              >
                <h3 className="font-bold">{f.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: INK_SOFT }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#candidature"
              className="inline-block rounded-md px-8 py-3.5 text-sm font-semibold transition hover:opacity-90"
              style={{ background: GOLD, color: '#FFFFFF' }}
            >
              Devenir partenaire
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t" style={{ background: INK, borderColor: GOLD, color: IVORY }}>
        <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-4 px-5 py-8 text-xs">
          <p style={{ color: 'rgba(255,253,248,0.7)' }}>
            © {new Date().getFullYear()} EbookStudio — Programme partenaires
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/mentions-legales" className="hover:underline">
              Mentions légales
            </Link>
            <Link to="/cgv" className="hover:underline">
              CGV
            </Link>
            <Link to="/politique-confidentialite" className="hover:underline">
              Confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
