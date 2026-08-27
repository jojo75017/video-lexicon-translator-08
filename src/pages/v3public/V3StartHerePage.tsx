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

      <V3AgentsStartGrid />
    </div>
  );
}
