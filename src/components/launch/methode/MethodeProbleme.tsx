import { Frown, Hourglass } from 'lucide-react';

/** Bloc « LE PROBLÈME » : deux profils dans lesquels le lecteur se reconnaît. */
export default function MethodeProbleme() {
  return (
    <section className="ds-section mx-auto max-w-4xl px-5">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--ds-gold)]">Le problème</p>
      <h2 className="mt-3 text-2xl font-bold md:text-3xl">
        Vous avez un vrai savoir. Mais il n'est pas encore un livre.
      </h2>
      <p className="mt-4 leading-relaxed text-[var(--ds-text-muted)]">
        Vous savez de quoi vous parlez. Vos clients vous posent toujours les mêmes questions, vous y
        répondez depuis des années. Sauf qu'au moment de le mettre noir sur blanc… quelque chose coince.
      </p>
      <p className="mt-6 font-semibold text-[var(--ds-text)]">Vous vous reconnaissez dans l'un des deux ?</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="ds-card p-6">
          <Frown className="h-7 w-7" style={{ color: 'var(--ds-orange)' }} />
          <h3 className="mt-3 text-lg font-bold">La page reste blanche</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ds-text-muted)]">
            Vous avez ouvert un document. Vous avez écrit un titre. Puis trois paragraphes.
            <br />
            Puis plus rien.
            <br />
            Vous ne savez pas dans quel ordre raconter les choses.
          </p>
        </div>
        <div className="ds-card p-6">
          <Hourglass className="h-7 w-7" style={{ color: 'var(--ds-orange)' }} />
          <h3 className="mt-3 text-lg font-bold">Vous savez, mais pas le temps</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ds-text-muted)]">
            Vous pourriez l'écrire seul. Mais le temps manque. Alors vous remettez.
            <br />
            Vous voulez une méthode, pas un nouveau projet de six mois.
          </p>
        </div>
      </div>

      <div
        className="mt-8 rounded-2xl border-l-4 p-6"
        style={{ background: 'var(--ds-surface)', borderColor: 'var(--ds-gold)' }}
      >
        <p className="leading-relaxed text-[var(--ds-text)]">
          Dans les deux cas, votre livre reste dans votre tête. <strong>Il vaut 0 €.</strong>
        </p>
        <p className="mt-3 leading-relaxed text-[var(--ds-text-muted)]">
          Le problème, ce n'est pas ce que vous savez. C'est que personne ne peut le lire.
        </p>
        <p className="mt-3 font-semibold text-[var(--ds-text)]">
          Ce n'est pas un problème de talent. C'est un problème de méthode.
        </p>
      </div>
    </section>
  );
}
