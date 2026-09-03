import { Link } from 'react-router-dom';
import { ImageIcon, ArrowRight, Ruler, Layers, Lock } from 'lucide-react';

/**
 * Bannière d'accès au nouvel éditeur de couverture complète KDP.
 * Purement présentationnelle : aucun appel IA, aucun crédit consommé.
 */
export default function V3MesCouverturesBanner() {
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-6">
      <div
        className="relative overflow-hidden rounded-3xl p-6 md:p-9"
        style={{
          background: 'linear-gradient(135deg, #06372c 0%, #064e3b 55%, #0b6350 100%)',
          border: '1px solid rgba(201,168,76,0.5)',
          boxShadow: '0 30px 70px -35px rgba(6,78,59,0.65)',
        }}
      >
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-7">
          <div className="flex-1">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide"
              style={{ background: 'rgba(201,168,76,0.18)', color: '#EBCB7A', border: '1px solid rgba(201,168,76,0.5)' }}
            >
              NOUVEAU · SEPTEMBRE 2026
            </span>

            <h2
              className="mt-3 text-2xl md:text-4xl font-black leading-tight"
              style={{ color: '#F7F3E8' }}
            >
              Vos couvertures comme un pro !
            </h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base" style={{ color: 'rgba(247,243,232,0.82)' }}>
              Première de couverture, dos calculé au millimètre et quatrième de couverture :
              vous composez le fichier complet de votre livre broché, avec les repères de
              fond perdu, de sécurité et de code-barres exigés par Amazon KDP.
            </p>

            <ul className="mt-5 grid sm:grid-cols-3 gap-3">
              {[
                { icon: Ruler, t: 'Dos calculé', d: 'Selon pages, papier et encre' },
                { icon: Layers, t: '3 zones éditables', d: 'Quatrième · dos · première' },
                { icon: Lock, t: '100 % privé', d: 'Vos visuels restent protégés' },
              ].map(({ icon: Icon, t, d }) => (
                <li
                  key={t}
                  className="rounded-2xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#EBCB7A' }} />
                  <div className="mt-2 text-sm font-bold" style={{ color: '#F7F3E8' }}>{t}</div>
                  <div className="text-xs" style={{ color: 'rgba(247,243,232,0.7)' }}>{d}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-72 shrink-0 flex flex-col gap-3">
            <Link
              to="/v3/mes-couvertures"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-black transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #E7C05A 0%, #C9A84C 100%)', color: '#06372c' }}
            >
              <ImageIcon className="w-5 h-5" />
              Ouvrir mes couvertures
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/v3/cover-studio-pro"
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#F7F3E8', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Générer une illustration IA
            </Link>
            <p className="text-center text-[11px]" style={{ color: 'rgba(247,243,232,0.6)' }}>
              L'éditeur est gratuit : aucun crédit consommé.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
