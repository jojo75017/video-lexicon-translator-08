import { Layers } from 'lucide-react';

/**
 * « Comment votre livre est écrit » — les passes réellement exécutées par l'outil,
 * dans l'ordre, avec le modèle utilisé à chaque étape. Aucune promesse ajoutée.
 */
const PASSES: Array<{ n: string; engine: string; title: string; detail: string }> = [
  {
    n: '1', engine: 'Gemini · architecte',
    title: 'Sommaire et structure',
    detail: 'Construction du sommaire avec vous, chapitre par chapitre, jusqu’à votre validation.',
  },
  {
    n: '2', engine: 'Gemini · architecte',
    title: 'Bible du livre + mémoire',
    detail: 'Personnages, lieux, chronologie, fils narratifs : la mémoire du livre est écrite avant la rédaction.',
  },
  {
    n: '3', engine: 'ChatGPT · plume',
    title: 'Rédaction chapitre par chapitre',
    detail: 'Chaque chapitre est rédigé séparément, en français, avec la mémoire des chapitres précédents.',
  },
  {
    n: '4', engine: 'Gemini · contrôle',
    title: 'Extraction mémoire + cohérence',
    detail: 'Après chaque chapitre : résumé, faits révélés, incohérences signalées avant de continuer.',
  },
  {
    n: '5', engine: 'Correction Pro · 4 passes',
    title: 'Relecture professionnelle',
    detail: 'Orthographe, style, mots parasites, fins de chapitre terminées par une phrase complète.',
  },
  {
    n: '6', engine: 'Agents P1-P15',
    title: 'Niche, KDP, couverture, audio',
    detail: 'Recherche de niche, métadonnées KDP, couverture haute qualité et version audio en option.',
  },
];

export default function V3PipelinePanel() {
  return (
    <div className="rounded-[22px] border p-4 md:p-5" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4" style={{ color: '#8a6d1f' }} />
        <h2 className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Comment votre livre est écrit</h2>
      </div>
      <p className="mt-1 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
        Votre livre n’est pas produit en un seul appel : plusieurs modèles travaillent en plusieurs passes.
      </p>

      <ol className="mt-3 grid gap-2 md:grid-cols-2">
        {PASSES.map((p) => (
          <li key={p.n} className="rounded-2xl border p-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold"
                style={{ background: 'rgba(201,168,76,0.18)', color: '#8a6d1f' }}>{p.n}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8a6d1f' }}>{p.engine}</span>
            </div>
            <div className="mt-1.5 text-[13px] font-semibold" style={{ color: 'var(--v3-ink)' }}>{p.title}</div>
            <div className="text-[12px] leading-snug" style={{ color: 'var(--v3-muted)' }}>{p.detail}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
