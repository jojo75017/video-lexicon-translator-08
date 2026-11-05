import heroImg from '@/assets/livres-audio-hero.jpg';
import { Link } from 'react-router-dom';
import { ArrowRight, Headphones, Mic, GraduationCap, ListMusic } from 'lucide-react';
import V3UpsellPromoCard from '@/components/v3public/V3UpsellPromoCard';
import { V3_ADDON_LIST } from '@/data/v3Pricing';

const HOW = [
  'Choisissez un livre de votre bibliothèque ou importez votre manuscrit',
  'Sélectionnez la voix et écoutez un extrait avant de lancer',
  'Téléchargez vos fichiers audio, chapitre par chapitre, prêts à publier',
];

const STUDIOS = [
  { title: 'Studio Audiobook', text: 'Transformez votre livre en audiolivre complet avec une voix naturelle et un chapitrage.', to: '/v3/outils/audiobook', icon: Headphones, color: '#EA580C' },
  { title: "Version audio d'un livre", text: 'Un livre converti en MP3, à écouter et télécharger tout de suite.', to: '/v3/version-audio', icon: Mic, color: '#2563EB' },
  { title: 'Formation audio', text: 'Apprenez à produire et publier vos livres audio pas à pas.', to: '/formation-audio', icon: GraduationCap, color: '#059669' },
  { title: 'Formation séries audio', text: 'Créez des séries audio en plusieurs épisodes à partir de vos histoires.', to: '/formation-series-audio', icon: ListMusic, color: '#7C3AED' },
];

const AUDIO_ADDONS = V3_ADDON_LIST.filter((a) => a.key === 'audio_premium' || a.key === 'audio_single');

export default function V3LivresAudioPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 space-y-12 text-[#f5f5f5]">
      <img src={heroImg} alt="Livre ouvert avec casque audio et micro" width={1600} height={640} className="w-full rounded-2xl object-cover" />
      <header>
        <p className="text-[12px] font-bold uppercase tracking-[0.24em]" style={{ color: '#F97316' }}>Livres audio</p>
        <h1 className="v3-serif text-4xl md:text-5xl font-bold mt-2" style={{ color: '#F97316' }}>Création de livres audio</h1>
        <p className="text-2xl font-bold mt-1" style={{ color: '#f5f5f5' }}>Donnez une voix à votre livre</p>
      </header>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#f5f5f5' }}>Comment ça marche</h2>
        <ol className="space-y-2">
          {HOW.map((h, i) => (
            <li key={i} className="flex gap-3 items-center rounded-lg border p-4" style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.12)', color: '#f5f5f5' }}>
              <span className="h-7 w-7 shrink-0 rounded-full border grid place-items-center text-sm font-bold" style={{ borderColor: '#F97316', color: '#F97316' }}>{i + 1}</span>
              {h}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="v3-serif text-2xl font-bold mb-4" style={{ color: '#f5f5f5' }}>Les outils audio</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIOS.map((s) => (
            <Link key={s.to} to={s.to} className="rounded-xl border p-5 transition hover:-translate-y-0.5" style={{ background: '#151d2c', borderColor: `${s.color}66` }}>
              <s.icon className="h-6 w-6" style={{ color: s.color }} />
              <h3 className="mt-3 font-bold" style={{ color: '#f5f5f5' }}>{s.title}</h3>
              <p className="mt-1 text-sm" style={{ color: '#c4cad6' }}>{s.text}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: s.color }}>Ouvrir <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="v3-upsells-dark">
        <h2 className="v3-serif text-2xl font-bold mb-4">Options audio</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {AUDIO_ADDONS.map((a) => (
            <V3UpsellPromoCard key={a.key} figureId={a.key} title={a.title} price={a.price} description={a.description} to={a.to} priceId={a.priceId} />
          ))}
        </div>
      </section>
    </div>
  );
}
