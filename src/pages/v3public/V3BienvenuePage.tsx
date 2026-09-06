import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { setSpaceChoice } from '@/lib/v3OpenState';
import { SUBSCRIBER_HOME_PATH } from '@/lib/authDestination';

/**
 * Écran de choix affiché à l'abonné après l'ouverture de la V3 :
 * il reste sur sa V2 ou découvre la V3. Aucun basculement forcé, le choix
 * est mémorisé et modifiable à tout moment.
 */
export default function V3BienvenuePage() {
  const navigate = useNavigate();

  const choose = (choice: 'v2' | 'v3') => {
    setSpaceChoice(choice);
    navigate(choice === 'v2' ? SUBSCRIBER_HOME_PATH : '/v3', { replace: true });
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-14">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--v3-gold, #c9a84c)' }}>
          Bienvenue
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Où souhaitez-vous travailler&nbsp;?</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base opacity-80">
          Votre espace habituel reste intact : vos livres, vos projets et vos exports ne bougent pas.
          La nouvelle version est un espace en plus — vous pouvez changer d'avis quand vous voulez.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => choose('v2')}
          className="group rounded-2xl border p-6 text-left transition hover:shadow-lg"
          style={{ borderColor: 'rgba(0,0,0,0.12)', background: '#fffdf8' }}
        >
          <BookOpen className="h-7 w-7" style={{ color: '#0f2e1f' }} />
          <h2 className="mt-4 text-xl font-semibold">Continuer sur mon espace habituel</h2>
          <p className="mt-2 text-sm opacity-75">
            Le générateur que vous connaissez, exactement comme avant. Rien ne change.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#0f2e1f' }}>
            Ouvrir mon espace <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => choose('v3')}
          className="group rounded-2xl border p-6 text-left transition hover:shadow-lg"
          style={{ borderColor: 'rgba(201,168,76,0.55)', background: 'linear-gradient(160deg,#0f2e1f 0%,#123a27 100%)', color: '#fffdf8' }}
        >
          <Sparkles className="h-7 w-7" style={{ color: '#c9a84c' }} />
          <h2 className="mt-4 text-xl font-semibold">Découvrir la nouvelle version</h2>
          <p className="mt-2 text-sm opacity-85">
            Trois nouveautés vous sont offertes à vie : l'assistant d'idée avec sommaire,
            le correcteur de livre et l'export premium. Le reste est visible, avec
            −20&nbsp;% à vie réservés aux anciens clients.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#c9a84c' }}>
            Entrer dans la nouvelle version <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </button>
      </div>

      <p className="mt-8 text-center text-xs opacity-60">
        Vous pourrez basculer d'un espace à l'autre à tout moment depuis le menu.
      </p>
    </main>
  );
}
