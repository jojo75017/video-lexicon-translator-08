import { Check, X } from 'lucide-react';

const ANCIENNE = [
  'Une formation de 600 pages jamais terminée',
  'Un manuscrit qui traîne depuis deux ans',
  'Des chapitres réécrits dix fois',
  'Un correcteur ou un prestataire à payer',
  'Une couverture bricolée qui fait amateur',
  'Une fiche Amazon vide, invisible dans les résultats',
  'Le livre jamais publié, et la frustration qui reste',
];

const NOUVELLE = [
  'Vous donnez votre idée, le plan est construit avec vous',
  'Les chapitres sont rédigés dans votre style, sous vos yeux',
  'La correction éditoriale passe en 4 relectures',
  'Aucun prestataire : tout est dans l\u2019atelier',
  'Une couverture au format KDP exact, prête à téléverser',
  'Titre, description et mots-clés pensés pour être trouvés',
  'Votre livre est en ligne. Il travaille pour vous.',
];

/** Bloc « L'ancienne méthode » vs « La nouvelle voie », deux colonnes au même rythme. */
export default function MethodeAvantApres() {
  return (
    <section className="ds-section mx-auto max-w-5xl px-5">
      <h2 className="text-center text-2xl font-bold md:text-3xl">
        Deux façons d'écrire un livre.{' '}
        <span style={{ color: 'var(--ds-gold)' }}>Une seule finit publiée.</span>
      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="ds-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-red-400">L'ancienne méthode</p>
          <ul className="mt-5 space-y-3">
            {ANCIENNE.map((t) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed text-[var(--ds-text-muted)]">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span className="text-[var(--ds-text)]">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-2xl p-6 shadow-lg"
          style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-gold)' }}
        >
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ds-gold)' }}>
            La nouvelle voie : l'atelier EbookStudio
          </p>
          <ul className="mt-5 space-y-3">
            {NOUVELLE.map((t) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'rgba(248,247,244,0.92)' }}>
                <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--ds-gold)' }} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
