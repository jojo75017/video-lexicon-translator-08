import { BookOpen, Euro, Sparkles } from 'lucide-react';
import childrenReading from '@/assets/v3-kdp-children-reading.jpg';
import familyReading from '@/assets/v3-kdp-family-reading.jpg';

export default function V3KdpOpportunity() {
  return (
    <section
      className="border-b"
      style={{ background: 'var(--v3-joy-cream)', borderColor: 'var(--v3-joy-orange-soft)' }}
      aria-labelledby="kdp-opportunity-title"
    >
      <div className="v3-shell py-10 md:py-14">
        <div className="mx-auto max-w-5xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase"
            style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
          >
            <Euro className="h-3.5 w-3.5" /> Publier sur Amazon KDP
          </span>
          <h2 id="kdp-opportunity-title" className="v3-serif mt-4 text-3xl font-semibold md:text-4xl" style={{ color: 'var(--v3-joy-ink)' }}>
            Amazon verse chaque mois des millions d’euros de royalties aux auteurs
          </h2>
          <p className="mt-3 text-base font-semibold md:text-lg" style={{ color: 'var(--v3-gold)' }}>
            Construisez votre place avec EbookStudio.
          </p>
        </div>

        <div className="mt-9 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div className="relative mx-auto w-full max-w-xl pb-10 sm:pb-14">
            <div className="mr-10 overflow-hidden rounded-lg ring-4" style={{ borderColor: 'var(--v3-joy-orange-soft)' }}>
              <img
                src={childrenReading}
                alt="Des enfants découvrent ensemble un livre illustré"
                loading="lazy"
                width={1200}
                height={912}
                className="aspect-[4/3] h-auto w-full object-cover"
              />
            </div>
            <div
              className="ml-12 -mt-16 overflow-hidden rounded-lg ring-4 sm:ml-24 sm:-mt-24"
              style={{ borderColor: 'var(--v3-joy-yellow-soft)' }}
            >
              <img
                src={familyReading}
                alt="Une mère et sa fille partagent un moment de lecture"
                loading="lazy"
                width={1200}
                height={912}
                className="aspect-[4/3] h-auto w-full object-cover"
              />
            </div>
            <span
              className="absolute bottom-3 left-2 grid h-12 w-12 place-items-center rounded-full"
              style={{ background: 'var(--v3-joy-orange)', color: 'var(--v3-joy-ink)' }}
              aria-hidden="true"
            >
              <BookOpen className="h-6 w-6" />
            </span>
          </div>

          <div>
            <p className="text-base leading-7 md:text-lg" style={{ color: 'var(--v3-joy-muted)' }}>
              Enseignants, parents, indépendants, passionnés ou parfaits débutants : chacun peut transformer une expérience, une idée ou une passion en un livre qui lui ressemble.
            </p>
            <p className="mt-5 text-base leading-7 md:text-lg" style={{ color: 'var(--v3-joy-muted)' }}>
              EbookStudio vous guide de la première idée jusqu’à la publication : structure, rédaction, correction, couverture, mise en page et préparation de votre fiche Amazon KDP.
            </p>
            <div className="mt-6 flex items-start gap-3 border-l-4 pl-4" style={{ borderColor: 'var(--v3-joy-orange)' }}>
              <Sparkles className="mt-1 h-5 w-5 shrink-0" style={{ color: 'var(--v3-gold)' }} />
              <p className="v3-serif text-xl font-semibold leading-8 md:text-2xl" style={{ color: 'var(--v3-joy-ink)' }}>
                Votre expérience mérite de devenir un livre : EbookStudio vous aide à lui donner une forme professionnelle, prête à rencontrer ses lecteurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}