import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import V3AgentsStartGrid from '@/components/v3public/V3AgentsStartGrid';

/** Page « Commence ici » — point d'entrée unique vers tous les agents V3. */
export default function V3StartHerePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Commence ici
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Choisissez votre agent, il écrit votre livre
        </h1>
        <p className="max-w-2xl text-[14.5px] text-muted-foreground">
          Chaque agent est spécialisé dans un type de livre : roman, cuisine, voyage, enfants,
          coloriage, BD, atlas, jeux, agenda… Cliquez sur son encart, vous arrivez directement
          sur son atelier et vous commencez.
        </p>
      </header>

      <Link
        to="/v3/create?sommaire=ia"
        className="group grid gap-5 overflow-hidden rounded-lg border-2 border-primary bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-[auto_1fr_auto] md:items-center"
      >
        <span className="grid h-16 w-16 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-8 w-8" />
        </span>
        <span>
          <span className="mb-2 inline-flex rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase text-primary-foreground">
            Commencez par ici
          </span>
          <span className="block text-xl font-bold text-foreground">Sommaire IA — le meneur de votre livre</span>
          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
            Donnez vos idées dans le dialogue : l’IA les corrige, construit le récit avec vous et prépare le sommaire qui guidera ensuite tout le workflow.
          </span>
        </span>
        <span className="inline-flex items-center gap-2 font-semibold text-primary">
          Construire mon livre <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>

      <V3AgentsStartGrid />
    </div>
  );
}
