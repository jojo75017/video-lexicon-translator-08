/**
 * Panneau d'information (non cliquable) : ce que l'abonné peut produire avec Ebookstudio V3.
 * Remplace l'ancien module de paramétrage des clés sur l'accueil (déplacé dans « Fonctionnalités »).
 */
const CAPABILITIES: string[] = [
  'Des livres numériques Kindle',
  'Des manuscrits prêts pour l’impression (broché)',
  'Des manuscrits prêts pour l’impression (relié)',
  'Des ébauches de livres audio',
  'Des couvertures de livres',
  'Des descriptions de livres',
  'Des métadonnées KDP',
  'Des idées de mots-clés',
  'Des idées de catégories',
  'Des rapports d’analyse de niche',
  'Des plans de chapitres',
  'Des manuscrits complets',
  'Des versions traduites',
  'Des fichiers prêts à la publication',
  'Des éléments d’image de marque pour l’auteur',
  'Des idées de séries et de sagas multi-tomes',
];

export default function V3CapabilitiesPanel() {
  return (
    <section
      className="rounded-2xl bg-white p-6 md:p-8"
      style={{ border: '1px solid var(--v3-line)', boxShadow: '0 8px 24px rgba(6,78,59,0.06)' }}
      aria-label="Ce que vous pouvez créer avec Ebookstudio V3"
    >
      <p
        className="text-[10.5px] font-bold uppercase tracking-[0.22em]"
        style={{ color: 'var(--v3-gold-600)' }}
      >
        Ce que vous pouvez produire
      </p>
      <h2 className="mt-1 text-2xl font-bold md:text-3xl" style={{ color: 'var(--v3-ink)' }}>
        Ebookstudio V3 vous aide à créer :
      </h2>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-[13.5px] leading-snug"
            style={{
              border: '1px solid var(--v3-line)',
              background: 'var(--v3-emerald-50)',
              color: 'var(--v3-ink)',
            }}
          >
            <span
              className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: 'var(--v3-gold)' }}
            />
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-5 max-w-3xl text-[14px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
        Au lieu d’utiliser cinq outils différents et de consacrer des semaines à un travail manuel,
        vous utilisez un seul agent d’IA.
      </p>
    </section>
  );
}
