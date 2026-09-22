import { ArrowRight, ListOrdered, Rocket, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import V3AgentsStartGrid from '@/components/v3public/V3AgentsStartGrid';
import V3WelcomeVideo from '@/components/v3public/V3WelcomeVideo';

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

      {/* Choix de départ impossible à manquer : écrire tout de suite ou passer par le sommaire. */}
      <section className="rounded-2xl border-2 border-primary/40 bg-card p-5 shadow-sm md:p-7">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">Par quoi voulez-vous commencer ?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Deux façons d’écrire votre livre. Choisissez, vous pourrez tout modifier ensuite.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Link
            to="/v3/create?ecrire=1"
            className="group flex flex-col justify-between gap-4 rounded-xl border-2 border-primary bg-primary/5 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase text-primary-foreground">
                <Rocket className="h-3.5 w-3.5" /> Le plus rapide
              </span>
              <span className="mt-3 block text-lg font-bold text-foreground">Écrire mon livre maintenant</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                Les agents écrivent tout : titre, sommaire, chapitres, relecture. Vous corrigez après si vous voulez.
              </span>
            </span>
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
              <Rocket className="h-4 w-4" /> Lancer l’écriture
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/v3/create?sommaire=1"
            className="group flex flex-col justify-between gap-4 rounded-xl border-2 border-border bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
          >
            <span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-3 py-1 text-[11px] font-bold uppercase text-primary">
                <ListOrdered className="h-3.5 w-3.5" /> Je garde la main
              </span>
              <span className="mt-3 block text-lg font-bold text-foreground">Commencer par le sommaire IA</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                Vous construisez les chapitres avec l’IA, puis les agents rédigent votre plan à la lettre.
              </span>
            </span>
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-bold text-primary">
              <ListOrdered className="h-4 w-4" /> Ouvrir le sommaire
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      <V3WelcomeVideo />


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
