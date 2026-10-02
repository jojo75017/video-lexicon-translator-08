import { Check, X } from 'lucide-react';

const ROWS: Array<{ point: string; others: string; v3: string }> = [
  {
    point: 'Le plan du livre',
    others: 'Le texte part sans plan validé : doublons, chapitres qui se répètent.',
    v3: 'Sommaire construit et validé avec vous avant la première ligne.',
  },
  {
    point: 'La longueur des chapitres',
    others: '600 à 1 000 mots, il faut relancer sans arrêt.',
    v3: '2 500 à 3 500 mots par chapitre, jusqu’à 40 chapitres.',
  },
  {
    point: 'La cohérence du récit',
    others: 'L’outil oublie les personnages et les lieux d’un chapitre à l’autre.',
    v3: 'Mémoire de l’univers : personnages, lieux et ton transmis à chaque chapitre.',
  },
  {
    point: 'La correction',
    others: 'Une passe de relecture générique, mots latins et phrases coupées restent.',
    v3: 'Correction en plusieurs passes, phrases réparées, latin supprimé, relecture validée par vous.',
  },
  {
    point: 'La couverture',
    others: 'Une image générée, titre déformé, format non conforme.',
    v3: 'Formats KDP exacts, titre net, export PDF print-ready avec bleed 3 mm.',
  },
  {
    point: 'La publication',
    others: 'À vous de deviner description, mots-clés et catégories.',
    v3: 'Données KDP préparées : description, 7 mots-clés, catégories BISAC, dossier d’export.',
  },
  {
    point: 'Le moteur IA',
    others: 'Un seul modèle, et une facture qui grimpe sans prévenir.',
    v3: 'Multimodèle (Gemini architecte, ChatGPT plume) avec vos propres clés : pas de surcoût caché.',
  },
];

export default function V3DifferenceTable() {
  return (
    <section id="v3-difference" className="scroll-mt-24" style={{ background: 'var(--v3-joy-cream)' }}>
      <div className="v3-shell py-10">
        <div className="max-w-3xl">
          <span
            className="v3-chip"
            style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)', borderColor: 'transparent' }}
          >
            La différence
          </span>
          <h2 className="v3-serif mt-4 text-3xl font-semibold md:text-4xl" style={{ color: 'var(--v3-joy-ink)' }}>
            Pourquoi c’est différent des autres outils
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--v3-joy-muted)' }}>
            Les autres outils s’arrêtent au texte. La V3 va jusqu’au fichier accepté par Amazon —
            c’est là que tout se joue.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white" style={{ border: '1px solid var(--v3-joy-orange-soft)' }}>
          <div
            className="hidden md:grid md:grid-cols-[1fr_1.2fr_1.4fr] gap-0 text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ background: 'var(--v3-joy-orange-soft)' }}
          >
            <div className="px-5 py-3" style={{ color: 'var(--v3-joy-muted)' }}>Sur ce point</div>
            <div className="px-5 py-3" style={{ color: 'var(--v3-joy-muted)' }}>Outils IA classiques</div>
            <div className="px-5 py-3" style={{ color: 'var(--v3-joy-orange-600)' }}>Ebookstudio V3</div>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={r.point}
              className="grid gap-2 px-5 py-4 md:grid-cols-[1fr_1.2fr_1.4fr] md:gap-0 md:px-0 md:py-0"
              style={{
                background: i % 2 ? 'var(--v3-joy-cream)' : 'transparent',
                borderTop: '1px solid var(--v3-joy-orange-soft)',
              }}
            >
              <div className="text-[13.5px] font-semibold md:px-5 md:py-4" style={{ color: 'var(--v3-joy-ink)' }}>{r.point}</div>
              <div className="flex items-start gap-2 text-[13px] md:px-5 md:py-4" style={{ color: 'var(--v3-joy-muted)' }}>
                <X className="mt-[3px] h-3.5 w-3.5 shrink-0 opacity-40" />
                <span>{r.others}</span>
              </div>
              <div className="flex items-start gap-2 text-[13px] font-medium md:px-5 md:py-4" style={{ color: 'var(--v3-joy-ink)' }}>
                <Check className="mt-[3px] h-3.5 w-3.5 shrink-0" style={{ color: 'var(--v3-joy-orange-600)' }} />
                <span>{r.v3}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
