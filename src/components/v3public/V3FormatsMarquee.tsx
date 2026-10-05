const BOOK_FORMATS: string[][] = [
  ['Roman policier', 'Thriller psychologique', 'Polar noir', 'Cozy mystery', 'Romance contemporaine', 'Comédie romantique', 'Dark romance', 'Science-fiction', 'Space opera', 'Dystopie', 'Fantasy urbaine', 'Heroic fantasy', 'Roman historique', 'Thriller médical', 'Micro-série en épisodes', 'Recueil de nouvelles', "Roman d'aventure", 'Conte philosophique', 'Drame familial', 'Roman feel-good', 'Récit de voyage initiatique', 'Épopée mythologique', 'Roman fantastique', 'Roman épistolaire', 'Saga familiale'],
  ['Album illustré 3–6 ans', 'Contes du soir', 'Histoire avec morale', 'Bande dessinée', 'Webtoon', 'Fable animalière', 'Premières lectures 7–9 ans', 'Aventure 9–12 ans', 'Livre des émotions', 'Roman ado', 'Biographie', 'Récit de vie', 'Livre de transmission familiale', 'Roman témoignage', 'Journal intime romancé', 'Album de souvenirs', 'Mythologie pour enfants', 'Lecture parents-enfants', 'Comptines & poèmes', 'Parentalité bienveillante', 'Album nature & animaux', 'Roman graphique', 'Mémoires de famille', 'Livre hommage', 'Histoire personnalisée'],
  ['Guide pratique pas-à-pas', 'Livre de cuisine', 'Nutrition & équilibre', 'Développement personnel', 'Gestion du stress', 'Sommeil réparateur', 'Productivité', 'Finances personnelles', 'Investissement & immobilier', 'Guide du freelance', 'Management & leadership', 'Prise de parole', 'Reconversion professionnelle', 'Vente & persuasion', 'Marketing digital', 'Philosophie pratique', 'Guide de voyage', 'Écologie du quotidien', 'Bricolage', 'Sport & bien-être', 'Santé naturelle', 'Méditation', 'Psychologie positive', 'Guide métier', 'Essai & manifeste'],
  ['Carnet de gratitude', 'Suivi d’habitudes', 'Journal guidé', "Cahier d'exercices", 'Jeux & énigmes', 'Escape game papier', "Cahier d'activités", 'Carnet de projet', 'Journal de lecture', 'Carnet de recettes', 'Planificateur 90 jours', 'Citations inspirantes', 'Poésie contemporaine', 'Jardinage & potager', 'Herboristerie', 'Livre audio MP3', 'Couverture rigide KDP', 'Couverture brochée KDP', 'Ebook Kindle', 'Grand format illustré', 'Export Word', 'Export EPUB', 'Export PDF', 'Traduction du livre', 'Audit KDP Pilot'],
];

const bookFormats = BOOK_FORMATS.flat();
const allPossibilities = Array.from(new Set(bookFormats));
const ROW_COUNT = 6;
const ROWS = Array.from({ length: ROW_COUNT }, (_, rowIndex) =>
  allPossibilities.filter((_, itemIndex) => itemIndex % ROW_COUNT === rowIndex),
);

const SPEEDS = ['120s', '135s', '125s', '145s', '130s', '150s'];

/** Pastilles aux couleurs des robots (mêmes teintes que le menu V3). */
const ROBOT_COLORS = ['#0F766E', '#1D4ED8', '#EC4899', '#4D7C5B', '#0891B2', '#CA8A04', '#9333EA', '#D97706'];
const pillStyle = (index: number) => ({
  background: ROBOT_COLORS[index % ROBOT_COLORS.length],
  color: '#ffffff',
  border: `2px solid ${ROBOT_COLORS[index % ROBOT_COLORS.length]}`,
});

export default function V3FormatsMarquee() {
  return (
    <section className="v3-shell py-10">
      <style>{`
        @keyframes v3mq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .v3mq-track { display:flex; width:max-content; gap:.6rem; animation: v3mq var(--d) linear infinite; }
        .v3mq-row:hover .v3mq-track { animation-play-state: paused; }
        .v3mq-rev { animation-direction: reverse; }
        @media (prefers-reduced-motion: reduce) { .v3mq-track { animation: none; flex-wrap: wrap; width:auto; } }
      `}</style>
      <div className="text-center">
        <div
          className="inline-block rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em]"
          style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
        >
          Formats, outils et accompagnements EbookStudio V3
        </div>
        <h2 className="v3-serif mt-3 text-2xl font-semibold md:text-3xl" style={{ color: 'var(--v3-joy-ink)' }}>
          EbookStudio V3 vous permet de{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, var(--v3-joy-orange), var(--v3-joy-yellow))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            tout créer, écrire et publier
          </span>{' '}
          au même endroit…
        </h2>
      </div>
      <div className="mt-6 space-y-3 overflow-hidden" style={{ maskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)' }}>
        {ROWS.map((row, i) => (
          <div key={i} className="v3mq-row overflow-hidden">
            <div className={`v3mq-track ${i % 2 ? 'v3mq-rev' : ''}`} style={{ ['--d' as string]: SPEEDS[i] }}>
              {[...row, ...row].map((t, j) => (
                <span
                  key={j}
                  className="whitespace-nowrap rounded-3xl bg-white px-5 py-2.5 text-sm font-bold shadow-sm"
                  style={pillStyle(j)}
                  aria-hidden={j >= row.length}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <span
          className="v3-chip"
          style={{ background: 'var(--v3-joy-yellow-soft)', color: 'var(--v3-joy-yellow-600)', borderColor: 'transparent' }}
        >
          Tous les formats, outils et accompagnements réunis…
        </span>
        <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: 'var(--v3-joy-muted)' }}>
          De l’idée au livre complet, relu, mis en page et prêt à publier — vos spécialistes IA vous accompagnent, vous gardez la décision finale.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs font-bold" style={{ color: 'var(--v3-joy-orange-600)' }}>
          <span>✓ Aucune compétence en écriture</span>
          <span>✓ Aucun logiciel de mise en page</span>
          <span>✓ Couvertures aux normes Amazon KDP</span>
          <span>✓ Export Word, EPUB et PDF</span>
        </div>
      </div>
    </section>
  );
}
