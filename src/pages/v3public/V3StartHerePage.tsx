import { ArrowRight, ListOrdered, Rocket, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import V3AgentsStartGrid from '@/components/v3public/V3AgentsStartGrid';
import V3StartIdeaCTA from '@/components/v3public/V3StartIdeaCTA';

/** Page « Commence ici » — point d'entrée unique vers tous les agents V3. */
export default function V3StartHerePage() {
  return (
    <div className="v3-dark-page"><div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
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
            to="/v3/lancer"
            className="group flex flex-col justify-between gap-4 rounded-xl border-2 border-primary bg-primary/5 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase text-primary-foreground">
                <Rocket className="h-3.5 w-3.5" /> Le plus rapide
              </span>
              <span className="mt-3 block text-lg font-bold text-foreground">Écrire mon livre maintenant</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                Remplissez votre fiche, comparez 5 propositions fondées sur vos informations, puis choisissez celle à rédiger.
              </span>
            </span>
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
              <Rocket className="h-4 w-4" /> Ouvrir la fiche du livre
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

      {/* Les quatre encarts d'aide au démarrage : Ecoboost, sommaire, niches, discussion libre. */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Si vous ne savez pas par où commencer</h2>
        <V3StartIdeaCTA variant="discreet" />
      </section>

      <section className="rounded-2xl border p-5 md:p-7" style={{ background: '#111827', borderColor: 'rgba(246,189,42,0.3)' }}>
        <h2 className="text-xl font-bold" style={{ color: '#F6BD2A' }}>Tutoriel : bien démarrer en 5 étapes</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-5">
          {[
            ['1. Choisissez votre départ', "Écrire tout de suite, ou commencer par le sommaire IA pour garder la main."],
            ['2. Remplissez la fiche', "Titre, sujet et public : quelques lignes suffisent, l'IA s'occupe du reste."],
            ['3. Laissez écrire', "Les chapitres s'écrivent un par un ; vous pouvez relire et corriger à tout moment."],
            ['4. Habillez le livre', "Créez la couverture et la quatrième dans le studio couverture."],
            ['5. Exportez et publiez', "Récupérez votre livre en Word ou PDF, prêt pour Amazon KDP."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-xl border p-4" style={{ background: '#0F172A', borderColor: '#1F2937' }}>
              <span className="block text-sm font-bold" style={{ color: '#F9FAFB' }}>{t}</span>
              <span className="mt-1 block text-[13px]" style={{ color: '#D1D5DB' }}>{d}</span>
            </li>
          ))}
        </ol>
        <Link to="/v3/tutoriels-v3" className="v3-flat-btn mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold" style={{ background: '#EA580C', color: '#fff' }}>
          Voir tous les tutoriels <ArrowRight className="h-4 w-4" />
        </Link>
      </section>


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
    </div>
  );
}
