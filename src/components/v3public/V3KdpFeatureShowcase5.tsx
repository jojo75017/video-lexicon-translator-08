import { FileText, ListOrdered, Monitor, Printer, Ruler, Sparkles } from 'lucide-react';
import autoFormattingImg from '@/assets/v3-kdp-auto-formatting.jpg';

const BENEFITS = [
  { icon: Monitor, text: 'Mise en page intérieure automatique, adaptée à chaque type de livre.' },
  { icon: FileText, text: 'Fichiers PDF compatibles KDP générés instantanément.' },
  { icon: Printer, text: 'Export aux formats EPUB, DOCX et impression en un clic.' },
  { icon: Ruler, text: 'Numérotation des pages, marges et fonds perdus professionnels automatiques.' },
  { icon: ListOrdered, text: 'Table des matières générée et mise à jour automatiquement.' },
  { icon: Sparkles, text: 'Mise en forme en un clic pour toutes les tailles de livre.' },
];

/**
 * Encart « Caractéristique 05 » — le formatage automatique des livres.
 * Même famille visuelle que les encarts 01 à 04 (carte sombre à liseré orange),
 * compacte, avec une photo en vis-à-vis.
 */
export default function V3KdpFeatureShowcase5() {
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
              Caractéristique 05 <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <h3 className="v3-serif mt-4 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: 'var(--v3-on-emerald)' }}>
              Formatage automatique des livres
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

          <div
            className="overflow-hidden rounded-2xl p-2"
            style={{ background: 'var(--v3-joy-orange-soft)', border: '1px solid var(--v3-joy-orange)' }}
          >
            <img
              src={autoFormattingImg}
              alt="Livre ouvert posé sur un bureau en bois à côté d’un ordinateur portable affichant une mise en page de livre, avec une pile de pages imprimées"
              width={1024}
              height={768}
              loading="lazy"
              className="h-40 w-full rounded-xl object-cover sm:h-48 lg:h-56"
            />
          </div>
        </div>
      </article>
    </div>
  );
}
