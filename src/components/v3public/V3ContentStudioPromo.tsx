import { Link } from 'react-router-dom';
import { Film, ArrowRight, Sparkles } from 'lucide-react';

/**
 * Encart premium ContentStudio Engine — mis en avant sur l'accueil V3.
 * Produit à forte valeur : un livre conforme KDP décliné en formation vidéo
 * (scripts, slides, voix off, sous-titres, MP4 monté). Tarif annoncé : 67 €+.
 */
export default function V3ContentStudioPromo() {
  return (
    <section
      className="relative overflow-hidden rounded-[24px] border p-5 md:p-6"
      style={{
        borderColor: 'rgba(201,168,76,0.55)',
        background:
          'linear-gradient(120deg, rgba(35,28,10,0.96), rgba(60,46,12,0.94) 55%, rgba(13,60,48,0.95))',
        boxShadow: '0 18px 40px -18px rgba(201,168,76,0.45)',
      }}
    >
      {/* halo doré discret */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.35), transparent 70%)' }}
      />

      <div className="relative flex flex-wrap items-center gap-5">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
          style={{ background: 'linear-gradient(135deg,#c9a84c,#8a6d1f)', color: '#1c1505' }}
        >
          <Film className="h-7 w-7" />
        </span>

        <div className="min-w-[260px] flex-1">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: '#e7cf8f' }}
          >
            Module premium — ça vaut de l'or
          </p>
          <h3 className="v3-serif mt-1 text-xl font-bold text-white md:text-2xl">
            🎬 ContentStudio Engine : votre livre devient une formation vidéo
          </h3>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed" style={{ color: 'rgba(255,246,222,0.85)' }}>
            Écrivez votre livre conforme KDP, puis déclinez-le en un clic en formation vidéo :
            scripts en 3 blocs, slides, voix off MP3, sous-titres SRT/VTT et MP4 monté par leçon.
            Aucune clé API à fournir — tout passe par l'IA intégrée.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="rounded-full px-2.5 py-1" style={{ background: 'rgba(201,168,76,0.22)', color: '#f1dfa8' }}>
              Livre KDP complet
            </span>
            <span className="rounded-full px-2.5 py-1" style={{ background: 'rgba(201,168,76,0.22)', color: '#f1dfa8' }}>
              Scripts + slides par leçon
            </span>
            <span className="rounded-full px-2.5 py-1" style={{ background: 'rgba(201,168,76,0.22)', color: '#f1dfa8' }}>
              Voix off + sous-titres
            </span>
            <span className="rounded-full px-2.5 py-1" style={{ background: 'rgba(201,168,76,0.22)', color: '#f1dfa8' }}>
              MP4 monté
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{ background: '#c9a84c', color: '#1c1505' }}
          >
            <Sparkles className="h-3.5 w-3.5" /> Option 67&nbsp;€
          </span>
          <Link
            to="/v3/contentstudio"
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
            style={{ background: '#0d7a5f' }}
          >
            Ouvrir ContentStudio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
