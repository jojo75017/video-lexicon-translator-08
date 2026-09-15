import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Palette, Users, Download } from 'lucide-react';
import { BD_COMIC_OFFER } from '@/data/bdComicOffer';
import studioJeunesseHero from '@/assets/studio-jeunesse-hero.jpg';

interface Props {
  /** Version compacte pour les pages de listes (upsells). */
  compact?: boolean;
}

/** Bandeau « Grande nouveauté V4 » — Studio BD & Jeunesse. */
export default function BdComicNewsBanner({ compact = false }: Props) {
  if (compact) {
    return (
      <Link
        to="/bd-offre"
        className="flex items-center justify-between gap-4 rounded-xl border-2 border-primary bg-card px-5 py-4 transition-transform hover:-translate-y-0.5"
      >
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" /> Grande nouveauté V4
          </span>
          <p className="mt-1 text-sm font-bold">Studio BD &amp; Jeunesse — {BD_COMIC_OFFER.price} € à vie</p>
          <p className="text-xs text-muted-foreground">
            Personnages, planches de BD, histoires illustrées et export KDP.
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
      </Link>
    );
  }

  return (
    <section className="v3-shell">
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          borderColor: 'var(--v3-gold)',
          background: 'var(--v3-ivory)',
          boxShadow: 'var(--v3-shadow-card)',
        }}
      >
        <div className="grid gap-6 p-6 md:grid-cols-[1.4fr,1fr] md:p-8">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
              style={{ background: 'var(--v3-gold-soft)', color: 'var(--v3-gold-600)' }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Grande nouveauté V4
            </span>
            <h2
              className="v3-serif mt-3 text-2xl font-bold sm:text-3xl"
              style={{ color: 'var(--v3-ink)' }}
            >
              Studio BD &amp; Jeunesse : votre atelier de livres pour enfants
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
              Bandes dessinées, coloriages, histoires illustrées et couvertures : vous décrivez votre idée,
              l’IA crée les personnages, écrit l’histoire, illustre chaque case et prépare vos fichiers
              prêts à publier sur Amazon KDP. Aucun talent de dessin nécessaire.
            </p>
            <Link
              to="/bd-offre"
              className="v3-btn v3-btn-gold mt-5 inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold"
            >
              Découvrir l’offre — {BD_COMIC_OFFER.price} € à vie <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-4">
              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--v3-gold-600)' }}
              >
                Pas seulement des livres numériques
              </p>
              <ul className="mt-2 flex flex-wrap gap-2 text-xs">
                {[
                  'Bandes dessinées',
                  'Livres de coloriage',
                  'Histoires illustrées 3-7 et 8-12 ans',
                  'Planches à imprimer',
                  'Supports illustrés pour la classe',
                  'Cadeaux personnalisés',
                  'Séries en plusieurs tomes',
                  'Couvertures et exports KDP',
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-full border px-2.5 py-1"
                    style={{
                      borderColor: 'var(--v3-border)',
                      background: 'var(--v3-paper)',
                      color: 'var(--v3-ink-2)',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="flex flex-col gap-4">
            <div className="relative h-[260px] overflow-hidden rounded-xl md:h-[300px]">
              <img
                src={studioJeunesseHero}
                alt="Main d'enfant choisissant un crayon de couleur dans un pot"
                loading="lazy"
                width={1280}
                height={960}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <ul className="space-y-2 text-sm">
              {[
                { icon: Users, text: 'Personnages cohérents d’une case à l’autre' },
                { icon: Palette, text: 'Planches, coloriages et histoires illustrées' },
                { icon: Download, text: 'Exports PDF et images prêts pour KDP' },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-3 rounded-xl border p-2.5"
                  style={{
                    borderColor: 'var(--v3-border)',
                    background: 'var(--v3-paper)',
                    color: 'var(--v3-ink-2)',
                  }}
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--v3-gold-600)' }} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="border-t px-6 py-6 md:px-8"
          style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="v3-serif text-lg font-bold" style={{ color: 'var(--v3-ink)' }}>
              Zone Kids — jouer et apprendre
            </h3>
            <span
              className="text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'var(--v3-gold-600)' }}
            >
              Inclus dans l’offre {BD_COMIC_OFFER.price} €
            </span>
          </div>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: 'var(--v3-muted)' }}>
            Un espace de jeux pour accompagner vos livres jeunesse : quiz, memory, création
            d’histoires et couleurs.
          </p>
          <div className="mt-5 grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-4"
            style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-border)' }}
          >
            {[
              { title: 'Quiz des animaux', desc: 'Questions illustrées' },
              { title: 'Memory', desc: 'Paires à retrouver' },
              { title: 'Crée ton histoire', desc: 'Récits à composer' },
              { title: 'Jeu des couleurs', desc: 'Palettes à deviner' },
            ].map(({ title, desc }) => (
              <div key={title} className="px-4 py-4" style={{ background: 'var(--v3-ivory)' }}>
                <p className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>
                  {title}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--v3-muted)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
