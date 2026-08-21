import { FicheCta } from '@/components/launch/FicheShell';

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
      'Du plan stratégique à la fiche Amazon : chaque agent prend une étape en charge et te rend un livrable fini. C\u2019est le cœur de l\u2019atelier.',
  },
  {
    title: 'Le Sommaire IA guidé (mode Copilot)',
    value: '97 €',
    text:
      'Tu donnes tes idées en vrac, elles te reviennent structurées, chapitre par chapitre. Tu valides avant qu\u2019une seule ligne ne soit écrite.',
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
      'Couverture avant, dos et quatrième de couverture au format KDP exact, calculé selon ton nombre de pages. Prête à téléverser.',
  },
  {
    title: 'Les données KDP de ton livre',
    value: '67 €',
    text:
      'Titre, sous-titre, description formatée, 7 mots-clés et catégories : tout ce que le formulaire Amazon te demande, prêt à copier.',
  },
  {
    title: 'Version audio de ton livre',
    value: '67 €',
    text: 'Ton manuscrit lu en voix naturelle, exportable pour en faire un livre audio ou un bonus pour tes lecteurs.',
  },
  {
    title: 'Traduction en 10 langues',
    value: '67 €',
    text: 'Le même livre publié sur les autres marchés Amazon, sans repayer un traducteur.',
  },
];

const TOTAL = '689 €';

/** Bloc « CE QUE TU REÇOIS » : valeur détaillée ligne par ligne, puis le prix réel. */
export default function MethodeValeur() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a6d1f]">Ce que tu reçois</p>
      <h2 className="v3-serif mt-3 text-2xl font-bold text-[#2A2118] md:text-3xl">
        Tout l'atelier, module par module.
      </h2>

      <div className="mt-8 space-y-4">
        {ITEMS.map((i) => (
          <div key={i.title} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="v3-serif text-lg font-bold text-[#2A2118]">{i.title}</h3>
              <span className="rounded-full bg-[#0F2E1F]/5 px-3 py-1 text-sm font-bold text-[#0F2E1F]">
                {i.value}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#5B5245]">{i.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border-2 border-[#D4AF37]/40 bg-white p-6 shadow-sm">
        <div className="flex items-baseline justify-between border-b border-black/10 pb-4">
          <span className="font-semibold text-[#5B5245]">Valeur totale</span>
          <span className="text-xl font-bold text-[#5B5245] line-through">{TOTAL}</span>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 pt-4">
          <span className="font-bold text-[#2A2118]">Ton accès aujourd'hui</span>
          <span className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-[#0F2E1F]">47 €</span>
            <span className="text-lg text-[#5B5245] line-through">59 €</span>
          </span>
        </div>
        <FicheCta label="Je prends l’accès à vie à 47 €" />
      </div>
    </section>
  );
}
