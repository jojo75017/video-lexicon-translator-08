import { Link } from 'react-router-dom';
import { BarChart3, MessagesSquare, Sparkles } from 'lucide-react';

type Props = {
  variant?: 'full' | 'compact' | 'discreet';
};

/**
 * Point de départ pour un auteur qui n'a pas encore d'idée :
 * discuter avec l'assistant IA, ou partir des niches déjà repérées.
 * Composant de présentation : aucune donnée, aucun appel réseau.
 */
export default function V3StartIdeaCTA({ variant = 'full' }: Props) {
  if (variant === 'compact') {
    return (
      <section className="rounded-2xl border border-[#c9a84c]/50 bg-[#fdf6e3] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#064e3b]">
            Toujours pas d'idée de livre ? Commencez ici.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/v3/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[#c9a84c] px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#e7cf8c]"
            >
              <Sparkles className="h-4 w-4" /> Parler avec l'IA
            </Link>
            <Link
              to="/niches"
              className="inline-flex items-center gap-2 rounded-xl border border-[#064e3b] px-5 py-2.5 text-sm font-semibold text-[#064e3b] transition hover:bg-[#064e3b]/5"
            >
              <BarChart3 className="h-4 w-4" /> Voir les niches
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#c9a84c]/50 bg-[#fdf6e3] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[#8a6f22]">Par où commencer</p>
      <h2 className="mt-2 font-serif text-2xl text-[#064e3b]">
        Vous n'avez pas encore d'idée de livre ?
      </h2>
      <p className="mt-2 text-sm text-[#3a3a3a]">
        Deux façons de commencer, choisissez la vôtre.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="flex h-full flex-col rounded-xl border border-[#c9a84c]/60 bg-white p-5">
          <h3 className="flex items-center gap-2 font-serif text-lg text-[#064e3b]">
            <MessagesSquare className="h-5 w-5 text-[#c9a84c]" /> Parler avec l'IA
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[#3a3a3a]">
            Elle vous pose des questions simples sur ce que vous aimez, ce que vous savez
            faire, à qui vous voulez parler — et vous repartez avec un sujet précis.
          </p>
          <Link
            to="/v3/create"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#c9a84c] px-6 py-3.5 text-base font-semibold text-[#1a1a1a] transition hover:bg-[#e7cf8c]"
          >
            <Sparkles className="h-5 w-5" /> Commencer la discussion
          </Link>
        </div>

        <div className="flex h-full flex-col rounded-xl border border-[#064e3b]/25 bg-white p-5">
          <h3 className="flex items-center gap-2 font-serif text-lg text-[#064e3b]">
            <BarChart3 className="h-5 w-5 text-[#064e3b]" /> Voir les niches proposées
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[#3a3a3a]">
            Des sujets qui se vendent déjà sur Amazon, classés par thème. Vous choisissez
            celui qui vous parle, et l'IA écrit avec vous ensuite.
          </p>
          <Link
            to="/niches"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-[#064e3b] px-6 py-3.5 text-base font-semibold text-[#064e3b] transition hover:bg-[#064e3b]/5"
          >
            Voir la liste des niches
          </Link>
        </div>
      </div>
    </section>
  );
}
