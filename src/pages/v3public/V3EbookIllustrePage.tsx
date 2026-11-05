import { Link } from 'react-router-dom';
import { ArrowRight, Baby, BookImage, GraduationCap, Layers, Image, Smile } from 'lucide-react';

const HOW = [
  "Racontez votre idée et choisissez le genre de l'histoire",
  'Laissez écrire le texte, scène après scène, avec une illustration par page',
  'Récupérez votre ebook illustré complet, avec sa couverture, prêt à publier',
];

const STUDIOS = [
  { title: 'Livre illustré', text: "Une histoire illustrée page par page, pour enfants ou adultes, avec des images cohérentes d'une scène à l'autre.", to: '/v3/create/illustre', icon: BookImage, color: '#14B8A6' },
  { title: 'Album illustré 3–6 ans', text: "Une seule histoire jusqu'à 30 pages, avec un texte court et une grande image sur chaque page.", to: '/v3/create/album-illustre', icon: Baby, color: '#EA580C' },
  { title: 'Guide illustré', text: 'Un guide pratique pour adultes, avec photos ou images à chaque chapitre.', to: '/v3/guides-illustres', icon: GraduationCap, color: '#2563EB' },
  { title: 'Bande dessinée', text: 'Votre scénario découpé en cases et en planches, comme une vraie BD.', to: '/bd-studio', icon: Layers, color: '#7C3AED' },
  { title: 'VC Books', text: "Les livres d'humour illustrés à poser dans les toilettes.", to: '/v3/vc-books/apercu', icon: Smile, color: '#D97706' },
  { title: 'Couverture du livre', text: 'Habillez votre ebook illustré avec une couverture Kindle ou brochée.', to: '/v3/studio-v4', icon: Image, color: '#059669' },
];

const TUTO = [
  { q: 'Étape 1 : choisir le bon studio', a: "Pour une histoire d'enfant courte, prenez l'Album 3–6 ans. Pour une histoire plus longue, prenez le Livre illustré. Pour un livre pratique, le Guide illustré. Pour des cases et des bulles, la Bande dessinée." },
  { q: "Étape 2 : raconter mon idée", a: "Remplissez la fiche : titre, public, genre, héros et idée de départ en quelques phrases. Plus vous donnez de détails sur le héros (âge, vêtements, couleurs), plus les images se ressemblent d'une page à l'autre." },
  { q: 'Étape 3 : générer scène après scène', a: "L'outil écrit chaque page puis crée son illustration. Relisez au fur et à mesure : vous pouvez réécrire un texte ou refaire une image qui ne vous plaît pas." },
  { q: 'Étape 4 : la couverture', a: 'Ouvrez le Studio couverture, choisissez un modèle, ajoutez le titre et votre nom, puis exportez au format KDP.' },
  { q: 'Étape 5 : exporter et publier', a: "Téléchargez votre livre en PDF ou en Word au format de votre choix, puis publiez-le sur Amazon KDP." },
];

export default function V3EbookIllustrePage() {
  return (
    <div style={{ background: '#0B0F17', color: '#E5E7EB', minHeight: '100vh' }} className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <span className="inline-block rounded-full px-4 py-1 text-xs font-bold tracking-widest" style={{ background: '#EA580C', color: '#fff' }}>INCLUS DANS VOTRE ESPACE</span>
        <div className="mt-4 grid gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-black tracking-wide md:text-5xl" style={{ color: '#14B8A6' }}>CRÉATION D'EBOOK ILLUSTRÉ</h1>
            <p className="mt-2 text-2xl font-extrabold uppercase md:text-3xl" style={{ color: '#F9FAFB' }}>Votre histoire, scène après scène</p>
            <p className="mt-4 text-[15px]" style={{ color: '#D1D5DB' }}>Enfants, adultes, guide, BD ou humour : choisissez votre studio, racontez votre idée, et chaque page reçoit son texte et son illustration.</p>
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest" style={{ color: '#F9FAFB' }}>COMMENT ÇA MARCHE</h2>
            <div className="mt-3 space-y-2">
              {HOW.map((t, i) => (
                <div key={t} className="flex items-center gap-3 rounded-lg p-3" style={{ background: '#111827', border: '1px solid #1F2937' }}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: '#14B8A6', color: '#0B0F17' }}>{i + 1}</span>
                  <span className="text-[14px] font-semibold" style={{ color: '#F9FAFB' }}>{t}</span>
                </div>
              ))}
            </div>
            <a href="#studios" className="mt-4 flex items-center justify-center gap-2 rounded-lg py-3 font-black tracking-wide" style={{ background: '#14B8A6', color: '#0B0F17' }}>
              JE CRÉE MON EBOOK ILLUSTRÉ <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <h2 id="studios" className="mt-12 text-2xl font-bold" style={{ color: '#F9FAFB' }}>Choisissez votre studio</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIOS.map((s) => (
            <div key={s.title} className="flex flex-col rounded-xl p-5" style={{ background: '#111827', borderTop: `4px solid ${s.color}` }}>
              <s.icon className="h-7 w-7" style={{ color: s.color }} />
              <h3 className="mt-3 text-lg font-bold" style={{ color: '#F9FAFB' }}>{s.title}</h3>
              <p className="mt-1 flex-1 text-[14px]" style={{ color: '#D1D5DB' }}>{s.text}</p>
              <Link to={s.to} className="mt-4 inline-flex items-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-bold" style={{ background: s.color, color: '#fff' }}>
                Ouvrir <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold" style={{ color: '#F9FAFB' }}>Tutoriel pas à pas</h2>
        <div className="mt-4 space-y-2">
          {TUTO.map((t) => (
            <details key={t.q} className="rounded-lg p-4" style={{ background: '#111827', border: '1px solid #1F2937' }}>
              <summary className="cursor-pointer font-semibold" style={{ color: '#F9FAFB' }}>{t.q}</summary>
              <p className="mt-2 text-[14px]" style={{ color: '#D1D5DB' }}>{t.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
