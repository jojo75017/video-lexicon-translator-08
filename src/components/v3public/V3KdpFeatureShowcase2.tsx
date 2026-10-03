import { BookOpen, Clapperboard, FileText, ListTree, Palette, ShieldCheck } from 'lucide-react';
import bookTypesImg from '@/assets/v3-kdp-book-types.jpg';
import finishedBooksImg from '@/assets/v3-kdp-finished-books.jpg';

const BENEFITS = [
  { icon: FileText, text: 'Des livres à contenu faible, moyen ou riche, selon votre niche.' },
  { icon: BookOpen, text: 'Journaux, agendas et cahiers d’activités prêts à publier.' },
  { icon: Clapperboard, text: 'Livres d’histoires complets et contenu éducatif.' },
  { icon: ListTree, text: 'Plans, chapitres et feuilles de travail générés automatiquement.' },
  { icon: Palette, text: 'Thèmes, styles et nombre de pages personnalisables.' },
  { icon: ShieldCheck, text: 'Vous restez 100 % propriétaire de vos livres.' },
];

/**
 * Encart « Article 02 » — la suite de création de livres par IA.
 * Même famille visuelle que V3KdpFeatureShowcase (carte sombre à liseré orange),
 * mais plus compacte et avec deux photos en vis-à-vis.
 */
export default function V3KdpFeatureShowcase2() {
  return (
    <div className="v3-shell">
      <article
        className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-3xl"
        style={{
          background: 'var(--v3-joy-ink)',
          border: '1px solid var(--v3-joy-orange)',
          boxShadow: '0 24px 50px -32px color-mix(in srgb, var(--v3-joy-ink) 55%, transparent)',
        }}
      >
        <div className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:p-10 lg:py-8">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase"
              style={{ background: 'color-mix(in srgb, var(--v3-joy-orange) 18%, transparent)', color: 'var(--v3-joy-orange)' }}
            >
              Caractéristique 02 <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <h3 className="v3-serif mt-4 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: 'var(--v3-on-emerald)' }}>
              Une suite complète de création de livres par IA
            </h3>
            <ul className="mt-5 space-y-3">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-[14px] leading-6 md:text-[15px]" style={{ color: 'color-mix(in srgb, var(--v3-on-emerald) 90%, transparent)' }}>
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg" style={{ background: 'color-mix(in srgb, var(--v3-joy-orange) 20%, transparent)', color: 'var(--v3-joy-orange)' }} aria-hidden="true">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div
              className="overflow-hidden rounded-2xl p-2"
              style={{ background: 'var(--v3-joy-orange-soft)', border: '1px solid var(--v3-joy-orange)' }}
            >
              <img
                src={bookTypesImg}
                alt="Livre illustré pour enfants, journal guidé et livre de recettes posés sur un bureau en bois à côté d’un ordinateur portable"
                width={1024}
                height={1024}
                loading="lazy"
                className="h-32 w-full rounded-xl object-cover sm:h-36 lg:h-44"
              />
            </div>
            <div
              className="overflow-hidden rounded-2xl p-2"
              style={{ background: 'var(--v3-joy-orange-soft)', border: '1px solid var(--v3-joy-orange)' }}
            >
              <img
                src={finishedBooksImg}
                alt="Mains feuilletant un livre fraîchement imprimé à côté d’une pile de livres terminés"
                width={1024}
                height={1024}
                loading="lazy"
                className="h-32 w-full rounded-xl object-cover sm:h-36 lg:h-44"
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
