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
  'Tu donnes ton idée, le plan est construit avec toi',
  'Les chapitres sont rédigés dans ton style, sous tes yeux',
  'La correction éditoriale passe en 4 relectures',
  'Aucun prestataire : tout est dans l\u2019atelier',
  'Une couverture au format KDP exact, prête à téléverser',
  'Titre, description et mots-clés pensés pour être trouvés',
  'Ton livre est en ligne. Il travaille pour toi.',
];

/** Bloc « L'ancienne méthode » vs « La nouvelle voie », deux colonnes au même rythme. */
export default function MethodeAvantApres() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-14">
      <h2 className="v3-serif text-center text-2xl font-bold text-[#2A2118] md:text-3xl">
        Deux façons d'écrire un livre. Une seule finit publiée.
      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9b3d3d]">L'ancienne méthode</p>
          <ul className="mt-5 space-y-3">
            {ANCIENNE.map((t) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed text-[#5B5245]">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-[#9b3d3d]" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-[#0F2E1F] p-6 shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "#D4AF37" }}>
            La nouvelle voie : l'atelier EbookStudio
          </p>
          <ul className="mt-5 space-y-3">
            {NOUVELLE.map((t) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.92)" }}>
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                <span style={{ color: 'rgba(255,255,255,0.92)' }}>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
