import { ArrowRight, BookOpenCheck, MousePointerClick, UserRoundSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    icon: UserRoundSearch,
    title: 'Choisissez votre type de livre',
    description: 'Roman, biographie, jeunesse, guide pratique, BD et bien plus encore.',
  },
  {
    icon: MousePointerClick,
    title: 'Trouvez le bon spécialiste',
    description: 'Chaque agent connaît les règles et les attentes propres à votre projet.',
  },
  {
    icon: BookOpenCheck,
    title: 'Commencez votre livre',
    description: 'Vous arrivez directement dans le parcours adapté, sans chercher parmi les outils.',
  },
];

export default function V3StartHereHomeBanner() {
  return (
    <section className="border-y border-border bg-card" aria-labelledby="v3-start-here-title">
      <div className="v3-shell py-8 md:py-10">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
              Votre point de départ
            </span>
            <h2 id="v3-start-here-title" className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
              Vous êtes abonné ? Commencez ici.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Inutile de chercher le bon outil. Indiquez simplement le livre que vous voulez créer :
              EbookStudio vous présente le spécialiste adapté et vous guide dès la première étape.
            </p>
            <Button asChild size="lg" className="mt-5 w-full gap-2 sm:w-auto">
              <Link to="/v3/commence-ici">
                Choisir mon spécialiste
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <ol className="grid gap-3 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="border-l-2 border-primary/40 pl-4">
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-xs font-bold" aria-hidden="true">0{index + 1}</span>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <h3 className="mt-2 text-sm font-bold text-foreground">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}