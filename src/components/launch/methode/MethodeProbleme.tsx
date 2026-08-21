import { Frown, Hourglass } from 'lucide-react';

/** Bloc « LE PROBLÈME » : deux profils dans lesquels le lecteur se reconnaît. */
export default function MethodeProbleme() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a6d1f]">Le problème</p>
      <h2 className="v3-serif mt-3 text-2xl font-bold text-[#2A2118] md:text-3xl">
        Tu as un vrai savoir. Mais il n'est pas encore un livre.
      </h2>
      <p className="mt-4 leading-relaxed text-[#5B5245]">
        Tu sais de quoi tu parles. Tes clients te posent toujours les mêmes questions, tu y réponds
        depuis des années. Sauf qu'au moment de le mettre noir sur blanc… quelque chose coince.
      </p>
      <p className="mt-6 font-semibold text-[#2A2118]">Tu te reconnais dans l'un des deux :</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Frown className="h-7 w-7 text-[#008296]" />
          <h3 className="v3-serif mt-3 text-lg font-bold text-[#2A2118]">La page reste blanche</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#5B5245]">
            Tu as ouvert un document. Tu as écrit un titre. Puis trois paragraphes.
            <br />
            Puis plus rien.
            <br />
            Tu ne sais pas dans quel ordre raconter les choses.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Hourglass className="h-7 w-7 text-[#008296]" />
          <h3 className="v3-serif mt-3 text-lg font-bold text-[#2A2118]">Tu sais, mais pas le temps</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#5B5245]">
            Tu pourrais l'écrire seul. Mais le temps manque. Alors tu remets.
            <br />
            Tu veux une méthode, pas un nouveau projet de six mois.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border-l-4 border-[#D4AF37] bg-white p-6 shadow-sm">
        <p className="leading-relaxed text-[#2A2118]">
          Dans les deux cas, ton livre reste dans ta tête. <strong>Il vaut 0 €.</strong>
        </p>
        <p className="mt-3 leading-relaxed text-[#5B5245]">
          Le problème, ce n'est pas ce que tu sais. C'est que personne ne peut le lire.
        </p>
        <p className="mt-3 font-semibold text-[#2A2118]">
          Ce n'est pas un problème de talent. C'est un problème de méthode.
        </p>
      </div>
    </section>
  );
}
