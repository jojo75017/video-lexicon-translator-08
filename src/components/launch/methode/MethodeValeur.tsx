import { Rocket } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { trackCaptureEvent } from '@/lib/captureTracking';

interface Item {
  title: string;
  value: string;
  text: string;
}

const ITEMS: Item[] = [
  {
    title: 'Les 15 agents d\u2019écriture (le workflow complet)',
    value: '197 €',
    text:
      'Du plan stratégique à la fiche Amazon : chaque agent prend une étape en charge et vous rend un livrable fini. C\u2019est le cœur de l\u2019atelier.',
  },
  {
    title: 'Le Sommaire IA guidé (mode Copilot)',
    value: '97 €',
    text:
      'Vous donnez vos idées en vrac, elles vous reviennent structurées, chapitre par chapitre. Vous validez avant qu\u2019une seule ligne ne soit écrite.',
  },
  {
    title: 'La correction éditoriale en 4 relectures',
    value: '97 €',
    text:
      'Réparation de la dictée, orthographe, style, fins de chapitre : le manuscrit ressort propre, en français, sans mots inventés.',
  },
  {
    title: 'Cover Studio Pro',
    value: '97 €',
    text:
      'Couverture avant, dos et quatrième de couverture au format KDP exact, calculé selon votre nombre de pages. Prête à téléverser.',
  },
  {
    title: 'Les données KDP de votre livre',
    value: '67 €',
    text:
      'Titre, sous-titre, description formatée, 7 mots-clés et catégories : tout ce que le formulaire Amazon vous demande, prêt à copier.',
  },
  {
    title: 'Version audio de votre livre',
    value: '67 €',
    text: 'Votre manuscrit lu en voix naturelle, exportable pour en faire un livre audio ou un bonus pour vos lecteurs.',
  },
  {
    title: 'Traduction en 10 langues',
    value: '67 €',
    text: 'Le même livre publié sur les autres marchés Amazon, sans repayer un traducteur.',
  },
];

const TOTAL = '689 €';

function ValeurCta() {
  const [params] = useSearchParams();
  const qs = new URLSearchParams();
  qs.set('src', params.get('src') || 'methode');
  const email = params.get('email');
  if (email) qs.set('email', email);
  return (
    <Link
      to={`/commander?${qs.toString()}`}
      onClick={() => trackCaptureEvent('methode', 'click')}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-lg transition hover:brightness-110 sm:w-auto"
      style={{ background: 'linear-gradient(135deg, var(--ds-orange) 0%, var(--ds-orange-deep) 100%)' }}
    >
      <Rocket className="h-5 w-5" /> Je prends l’accès à vie à 47 €
    </Link>
  );
}

/** Bloc « CE QUE VOUS RECEVEZ » : valeur détaillée ligne par ligne, puis le prix réel. */
export default function MethodeValeur() {
  return (
    <section className="ds-section mx-auto max-w-4xl px-5">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--ds-gold)]">Ce que vous recevez</p>
      <h2 className="mt-3 text-2xl font-bold md:text-3xl">Tout l'atelier, module par module.</h2>

      <div className="mt-8 space-y-4">
        {ITEMS.map((i) => (
          <div key={i.title} className="ds-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-lg font-bold">{i.title}</h3>
              <span
                className="rounded-full px-3 py-1 text-sm font-bold"
                style={{ background: 'var(--ds-orange-soft)', color: 'var(--ds-orange)' }}
              >
                {i.value}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ds-text-muted)]">{i.text}</p>
          </div>
        ))}
      </div>

      <div
        className="mt-8 rounded-2xl border-2 p-6 shadow-lg"
        style={{ background: 'var(--ds-surface)', borderColor: 'var(--ds-gold)' }}
      >
        <div className="flex items-baseline justify-between border-b border-[var(--ds-border)] pb-4">
          <span className="font-semibold text-[var(--ds-text-muted)]">Valeur totale</span>
          <span className="text-xl font-bold text-[var(--ds-text-muted)] line-through">{TOTAL}</span>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 pt-4">
          <span className="font-bold text-[var(--ds-text)]">Votre accès aujourd'hui</span>
          <span className="flex items-baseline gap-3">
            <span className="text-4xl font-black" style={{ color: 'var(--ds-gold)' }}>
              47 €
            </span>
            <span className="text-lg text-[var(--ds-text-muted)] line-through">59 €</span>
          </span>
        </div>
        <div className="mt-6 text-center">
          <ValeurCta />
        </div>
        <p className="mt-3 text-center text-xs text-[var(--ds-text-muted)]">
          Paiement unique · pas d'abonnement · accès conservé · V3 incluse
        </p>
      </div>
    </section>
  );
}
