import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileSearch, Feather, Wand2, Image, Globe2, ChevronDown } from 'lucide-react';

const STEPS = [
  { n: 1, title: 'Choisissez ou importez votre livre', text: 'Ouvrez votre bibliothèque et sélectionnez un manuscrit, ou importez votre fichier Word, PDF ou texte.', to: '/v3/mes-livres', cta: 'Ouvrir ma bibliothèque', icon: BookOpen, color: '#2563EB' },
  { n: 2, title: 'Recevez le rapport éditorial', text: "Le correcteur analyse orthographe, grammaire, répétitions et cohérence, puis vous remet un rapport clair.", to: '/v3/corriger', cta: 'Corriger mon livre', icon: FileSearch, color: '#0EA5E9' },
  { n: 3, title: 'Polissez le style', text: "BookPerfect améliore la fluidité des phrases sans changer votre intrigue ni votre voix.", to: '/bookperfect', cta: 'Polir le style', icon: Feather, color: '#7C3AED' },
  { n: 4, title: 'Humanisez le texte', text: "HumanizeAI rend l'écriture plus naturelle et vérifie le style avant publication.", to: '/v3/outils/humanizer', cta: 'Humaniser', icon: Wand2, color: '#EA580C' },
  { n: 5, title: 'Préparez couverture et 4e', text: 'Créez la couverture, le dos et la quatrième de couverture de votre livre.', to: '/v3/studio-v4', cta: 'Studio couverture', icon: Image, color: '#059669' },
  { n: 6, title: 'Traduisez si vous le souhaitez', text: "Publiez votre livre corrigé dans d'autres langues pour de nouveaux marchés.", to: '/v3/outils/traduction', cta: 'Traduire mon livre', icon: Globe2, color: '#D97706' },
];

const TUTO = [
  { q: 'Étape 1 : préparer mon manuscrit', a: "Allez dans Bibliothèque / Mes livres. Si votre livre a été écrit dans EbookStudio, il est déjà là. Sinon, cliquez sur Importer et choisissez votre fichier (Word, PDF ou texte). Les chapitres sont repris automatiquement." },
  { q: 'Étape 2 : lancer la correction', a: "Ouvrez « Corriger mon livre », choisissez le livre, puis lancez l'analyse. Lisez le rapport : chaque remarque est expliquée. Acceptez ou refusez les corrections une par une, puis enregistrez." },
  { q: 'Étape 3 : améliorer le style', a: "Dans BookPerfect, sélectionnez le chapitre à retravailler. L'outil propose une version plus fluide : comparez avec l'original et gardez ce qui vous plaît. Votre histoire et votre ton restent les vôtres." },
  { q: 'Étape 4 : humaniser', a: "Collez ou chargez votre texte dans HumanizeAI. Lancez l'humanisation, puis l'audit de style pour vérifier que le texte sonne naturel." },
  { q: 'Étape 5 : couverture et quatrième', a: "Dans le Studio couverture, choisissez un modèle, ajoutez titre, auteur et résumé de quatrième. Exportez au format KDP." },
  { q: 'Étape 6 : récupérer mes fichiers', a: "Revenez dans votre bibliothèque : exportez le manuscrit corrigé en Word ou PDF, avec votre couverture. Votre livre est prêt à être publié." },
];

export default function V3RevisionEditorialePage() {
  return (
    <div style={{ background: '#0B0F17', color: '#E5E7EB', minHeight: '100vh' }} className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <span className="inline-block rounded-full px-4 py-1 text-xs font-bold tracking-widest" style={{ background: '#EA580C', color: '#fff' }}>
          INCLUS DANS VOTRE ESPACE
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-wide md:text-5xl" style={{ color: '#3B82F6' }}>RÉVISION / CORRECTION</h1>
        <p className="mt-2 text-2xl font-semibold uppercase md:text-3xl" style={{ color: '#F9FAFB' }}>
          Vous avez déjà une histoire et souhaitez l'améliorer ?
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-lg leading-relaxed" style={{ color: '#D1D5DB' }}>
              Votre manuscrit mérite de devenir une véritable œuvre. EbookStudio l'analyse, le corrige et le prépare
              pour la publication, sans dénaturer votre voix.
            </p>
            <Link to="/v3/corriger" className="v3-flat-btn mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-4 font-bold tracking-wide"
              style={{ background: '#3B82F6', color: '#fff' }}>
              JE LANCE L'ANALYSE DE MON LIVRE <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-black tracking-[0.2em]" style={{ color: '#F6BD2A' }}>COMMENT ÇA MARCHE</h2>
            <div className="space-y-2">
              {STEPS.slice(0, 4).map((s) => (
                <div key={s.n} className="flex items-center gap-3 rounded-md border px-4 py-3" style={{ background: '#111827', borderColor: '#1F2937' }}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold" style={{ borderColor: '#3B82F6', color: '#3B82F6' }}>{s.n}</span>
                  <span className="font-semibold">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="mt-14 mb-4 text-2xl font-bold" style={{ color: '#F6BD2A' }}>Les 6 étapes pour mettre votre livre au propre</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col rounded-xl border p-5" style={{ background: '#111827', borderColor: s.color }}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: s.color, color: '#fff' }}><s.icon className="h-5 w-5" /></span>
                <h3 className="font-bold">{s.n}. {s.title}</h3>
              </div>
              <p className="mt-3 flex-1 text-sm" style={{ color: '#9CA3AF' }}>{s.text}</p>
              <Link to={s.to} className="v3-flat-btn mt-4 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold" style={{ background: s.color, color: '#fff' }}>
                {s.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <h2 className="mt-14 mb-4 text-2xl font-bold" style={{ color: '#F6BD2A' }}>Tutoriel pas à pas</h2>
        <div className="space-y-2">
          {TUTO.map((t) => (
            <details key={t.q} className="group rounded-lg border px-5 py-4" style={{ background: '#111827', borderColor: '#1F2937' }}>
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {t.q} <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: '#D1D5DB' }}>{t.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
