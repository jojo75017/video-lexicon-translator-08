import heroImg from '@/assets/ebook-illustre-hero.jpg';
import pagesImg from '@/assets/ebook-illustre-pages.jpg';
import foxStart from '@/assets/renard-depart.jpg';
import foxStream from '@/assets/renard-ruisseau.jpg';
import foxHill from '@/assets/renard-colline.jpg';
import foxHome from '@/assets/renard-retour.jpg';
import tutoVideo from '@/assets/tutoriel-livre-illustre.mp4.asset.json';
import IllustratedFlipbook from '@/components/flipbook/IllustratedFlipbook';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Baby, BookImage, GraduationCap, Layers, Image, Smile } from 'lucide-react';

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

const SAMPLE = [
  {
    imageUrl: foxStart,
    title: '1. Le premier petit pas',
    text: `Au pied d’un vieux chêne, un petit renard roux vivait dans un terrier bien chaud. Chaque matin, il sortait le museau entre les racines et regardait la colline qui se dressait au loin. Derrière les arbres, le soleil dessinait un chemin doré. Que pouvait-il y avoir de l’autre côté ?

Le petit renard connaissait chaque fougère autour de sa maison, mais il n’avait jamais suivi le sentier jusqu’au sommet. Quand le vent faisait craquer les branches, ses oreilles se dressaient et il rentrait vite se blottir contre sa maman.

Ce matin-là, pourtant, son envie de découvrir le monde était plus grande que sa peur. Sa maman frotta doucement son museau contre le sien. « Avance tranquillement, regarde où tu poses tes pattes et reviens avant la nuit. »

Il respira l’odeur des feuilles, regarda une dernière fois le terrier et fit un pas. Puis un deuxième. Son aventure venait de commencer.`,
  },
  {
    imageUrl: foxStream,
    title: '2. Le ruisseau qui chantait',
    text: `Le sentier descendait entre les fougères. Bientôt, le petit renard entendit un murmure, puis un clapotis joyeux. Un ruisseau traversait le chemin. L’eau claire glissait entre les pierres et faisait danser de petits éclats de lumière.

Il s’arrêta sur la berge. De l’autre côté, le sentier continuait vers la colline, mais il fallait traverser. Le petit renard posa une patte sur une pierre plate. Elle était humide. Il la retira aussitôt, le cœur battant.

Alors, il se souvint des paroles de sa maman : regarder où poser ses pattes. Il observa le ruisseau sans se presser. Trois grosses pierres dépassaient de l’eau. La première était proche, la deuxième assez large et la dernière touchait presque l’autre rive.

Une patte après l’autre, il avança. Une goutte lui chatouilla le nez ; il secoua les oreilles et continua. Lorsqu’il atteignit la berge, il se retourna, étonné. Le ruisseau n’avait pas changé, mais lui se sentait déjà un peu plus courageux.`,
  },
  {
    imageUrl: foxHill,
    title: '3. Le monde derrière la colline',
    text: `La montée était plus longue que le petit renard ne l’avait imaginé. Il passa sous les branches basses, contourna une racine et s’arrêta à l’ombre d’un sapin. Ses pattes étaient fatiguées. Pendant un instant, il pensa faire demi-tour.

Puis une brise apporta une odeur nouvelle, un mélange d’herbe fraîche et de fleurs. Il leva le museau. Encore quelques pas, juste jusqu’au prochain arbre. Là, le sentier s’ouvrit soudain et le petit renard découvrit toute la vallée.

Des prés fleuris descendaient jusqu’à un ruban d’eau argentée. Les arbres semblaient minuscules au loin. Un papillon blanc passa devant son nez, et les oiseaux chantaient comme si la forêt entière lui souhaitait la bienvenue.

Il resta longtemps à regarder. Il n’avait pas vaincu un monstre ni accompli un grand exploit. Il avait simplement continué, doucement, malgré ses hésitations. Et grâce à tous ces petits pas, un paysage qu’il ne connaissait pas encore s’offrait à lui. Il avait maintenant une merveilleuse histoire à raconter.`,
  },
  {
    imageUrl: foxHome,
    title: '4. Une aventure à partager',
    text: `Quand la lumière devint plus douce, le petit renard reprit le chemin de la maison. Cette fois, il reconnut le sapin, la grande racine et les pierres du ruisseau. Il traversa avec précaution, fier de retrouver seul les repères de son voyage.

Près du vieux chêne, sa maman l’attendait. Il courut vers elle et leurs museaux se touchèrent. Puis les mots se bousculèrent : le ruisseau qui chantait, les fleurs de la vallée, le papillon blanc et le sentier qui semblait ne jamais finir.

« Tu n’as donc pas eu peur ? » demanda sa maman. Le petit renard réfléchit. « Si, un peu. Mais j’ai regardé, j’ai respiré et j’ai avancé petit à petit. » Elle sourit et l’invita à se reposer contre elle.

Bien au chaud dans le terrier, il ferma les yeux. Il savait maintenant qu’être courageux ne voulait pas dire ne jamais avoir peur. C’était prendre le temps d’essayer, savoir rentrer chez soi et partager ses découvertes avec ceux qu’on aime. Demain, la forêt serait encore là. Pour ce soir, son aventure était complète.`,
  },
];

export default function V3EbookIllustrePage() {
  const [flip, setFlip] = useState(false);
  return (
    <div style={{ background: '#0B0F17', color: '#E5E7EB', minHeight: '100vh' }} className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <img src={heroImg} alt="Livre illustré ouvert, un enfant et un renard dans la forêt" width={1600} height={640} className="mb-6 w-full rounded-2xl object-cover" style={{ maxHeight: 340, border: '1px solid #1F2937' }} />
        <section className="mb-8 rounded-2xl p-5" style={{ background: '#111827', border: '1px solid #1F2937' }}>
          <span className="inline-block rounded-full px-3 py-1 text-xs font-bold tracking-widest" style={{ background: '#14B8A6', color: '#0B0F17' }}>🎥 TUTORIEL RAPIDE · 52 SECONDES</span>
          <h2 className="mt-3 text-xl font-bold" style={{ color: '#F9FAFB' }}>Créer son premier livre illustré</h2>
          <video src={tutoVideo.url} controls preload="metadata" playsInline className="mt-4 w-full rounded-xl" style={{ maxHeight: 480, background: '#000' }} />
          <button type="button" onClick={() => setFlip((v) => !v)} className="v3-flat-btn mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-3 font-bold" style={{ background: '#EA580C', color: '#fff' }}>
            <BookOpen className="h-4 w-4" /> {flip ? "Fermer l'exemple" : 'Feuilleter un exemple d’album en direct'}
          </button>
          {flip && <div className="mt-4"><IllustratedFlipbook bookTitle="Le petit renard courageux (exemple)" pages={SAMPLE} onClose={() => setFlip(false)} /></div>}
        </section>
        <span className="inline-block rounded-full px-4 py-1 text-xs font-bold tracking-widest" style={{ background: '#EA580C', color: '#fff' }}>INCLUS DANS VOTRE ESPACE</span>
        <div className="mt-4 grid gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-black tracking-wide md:text-5xl" style={{ color: '#14B8A6' }}>CRÉATION D'EBOOK ILLUSTRÉ</h1>
            <p className="mt-2 text-2xl font-extrabold uppercase md:text-3xl" style={{ color: '#F9FAFB' }}>Votre histoire, scène après scène</p>
            <p className="mt-4 text-[15px]" style={{ color: '#D1D5DB' }}>Enfants, adultes, guide, BD ou humour : choisissez votre studio, racontez votre idée, et chaque page reçoit son texte et son illustration.</p>
            <img src={pagesImg} alt="Exemples de pages illustrées : dragon, baleine, forêt, ville" width={1024} height={768} loading="lazy" className="mt-5 w-full rounded-xl object-cover" style={{ maxHeight: 280, border: '1px solid #1F2937' }} />
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
