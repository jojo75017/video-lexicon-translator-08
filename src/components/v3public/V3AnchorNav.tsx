const LINKS = [
  { id: 'v3-quoi', label: "Qu'est-ce que la V3" },
  { id: 'v3-etapes', label: 'Comment ça marche' },
  { id: 'v3-benefices', label: 'Ce que ça vous apporte' },
  { id: 'v3-difference', label: 'Pourquoi c’est différent' },
];

/** Sommaire ancré : permet de naviguer dans la page longue de présentation. */
export default function V3AnchorNav() {
  return (
    <nav aria-label="Découvrir la V3" className="max-w-7xl mx-auto px-5 md:px-8 pt-6">
      <div
        className="rounded-2xl px-5 py-4 flex flex-wrap items-center gap-3"
        style={{ background: 'var(--v3-cream)', border: '1px solid var(--v3-line)' }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{ color: 'var(--v3-gold-600)' }}
        >
          Découvrir la V3
        </span>
        <div className="flex flex-wrap gap-2">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition hover:opacity-80"
              style={{ background: '#fff', border: '1px solid var(--v3-line)', color: 'var(--v3-emerald)' }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
