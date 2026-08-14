import { Link } from 'react-router-dom';
import {
  Sparkles, BookOpen, Library, ArrowRight,
} from 'lucide-react';

import V3BriefRecap from '@/components/v3public/V3BriefRecap';
import V3CapabilitiesPanel from '@/components/v3public/V3CapabilitiesPanel';
import V3StartBookBar from '@/components/v3public/V3StartBookBar';
import V3PaletteModule from '@/components/v3public/V3PaletteModule';
import KdpPilotPromoBanner from '@/components/ebook/KdpPilotPromoBanner';
import { V3EngineStrip, V3EngineGrid } from '@/components/v3public/V3EngineBanner';
import V3HeroBanner from '@/components/v3public/V3HeroBanner';
import V3MarketProofPanel from '@/components/v3public/V3MarketProofPanel';
import V3BeforeAfterPanel from '@/components/v3public/V3BeforeAfterPanel';
import V3AudiencePanel from '@/components/v3public/V3AudiencePanel';
import V3GuaranteePanel from '@/components/v3public/V3GuaranteePanel';
import V3CommercialLicensePanel from '@/components/v3public/V3CommercialLicensePanel';
import V3ClosingRecallPanel from '@/components/v3public/V3ClosingRecallPanel';





const FEATURED_TOOLS = [
  { emoji: '📘', title: 'Assistant V3', desc: 'Créez votre livre en 4 étapes guidées.', to: '/v3/create', badge: 'V3' },
  { emoji: '🎨', title: 'Cover Studio Pro', desc: 'Couverture haut de gamme, direction artistique IA.', to: '/v3/hub?tab=cover-pro', badge: 'Pro' },
  { emoji: '🚀', title: 'KDP Pilot', desc: 'Audit complet avant publication Amazon.', to: '/audit-pilot', badge: 'Populaire' },
  { emoji: '📖', title: 'Sommaire Ultime', desc: 'Table des matières éditable et exportable.', to: '/v3/outils/sommaire-ultime', badge: 'Nouveau' },
];

const AUTHOR_AMAZON_URL = 'https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7';
const AUTHOR_BOOKS: Array<{ asin: string; title: string }> = [
  { asin: 'B0GXB3V5DJ', title: "L'Ancien Locataire" },
  { asin: 'B0GG7QCFTZ', title: "Axel Kiev — L'Origine du Code" },
  { asin: 'B0GY5K8GCS', title: 'Signal Zéro — Intégrale' },
  { asin: 'B0GX2SVHY4', title: 'Le Loup en Vacances' },
  { asin: 'B0GQQB7V1F', title: "Dans l'Ombre de la Villa" },
  { asin: 'B0GN34WYMK', title: 'La Bible du Voyage' },
];
const coverUrl = (asin: string) => `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
const fallbackCoverUrl = (asin: string) => `https://m.media-amazon.com/images/P/${asin}.jpg`;
const amazonBookUrl = (asin: string) => `https://www.amazon.fr/dp/${asin}/`;

export default function V3HomePage() {


  return (
    <>
      {/* BANNIÈRE — Migration V2 vers V3 (3 modules offerts) */}
      <section
        style={{
          background: 'linear-gradient(90deg,#c9a84c 0%,#e6c66b 50%,#c9a84c 100%)',
          borderBottom: '2px solid #a3831f',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-3 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="flex items-center gap-3" style={{ color: '#1a1408' }}>
            <span className="text-2xl">🎁</span>
            <p className="text-[13.5px] leading-snug font-semibold">
              <strong>Abonnés V2 : votre V3 arrive avec 3 modules offerts.</strong>{' '}
              <span className="font-normal">Génie, Correcteur et Export Premium — et -20 % à vie sur les nouveaux forfaits Plume / Édition.</span>
            </p>
          </div>
          <Link
            to="/v3/migration"
            className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-bold text-[13px] whitespace-nowrap"
            style={{ background: '#064e3b', color: '#c9a84c', border: '1px solid #1a1408' }}
          >
            Voir ma migration V3 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* BANNIÈRE — Clé Gemini obligatoire */}

      <section
        className="relative"
        style={{
          background: 'linear-gradient(90deg, #064e3b 0%, #0a5a45 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.4)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-3 flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
          <div className="flex items-start md:items-center gap-3 text-white">
            <span
              className="grid place-items-center w-8 h-8 rounded-full shrink-0"
              style={{ background: 'var(--v3-gold)', color: '#1a1408', fontWeight: 700 }}
            >
              🔑
            </span>
            <div className="text-[13.5px] leading-snug text-white">
              <strong style={{ color: '#fff4c7' }}>Avant de commencer :</strong> branchez votre <strong className="text-white">clé Gemini gratuite</strong> (60 s, quota généreux offert par Google) pour déverrouiller la V3 sans limite.
              <span className="hidden md:inline ml-1 text-white/95">Si le lien est bloqué par votre navigateur, copiez-le et ouvrez-le dans un nouvel onglet.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={async () => {
                const url = 'https://aistudio.google.com/app/apikey';
                try {
                  await navigator.clipboard.writeText(url);
                  const { toast } = await import('sonner');
                  toast.success('Lien copié. Collez-le dans un nouvel onglet si le clic ne fonctionne pas.', { duration: 7000 });
                } catch {}
                const win = window.open(url, '_blank', 'noopener,noreferrer');
                if (!win || win.closed || typeof win.closed === 'undefined') {
                  const { toast } = await import('sonner');
                  toast.info('Le nouvel onglet a été bloqué. Le lien est déjà copié : collez-le manuellement.', { duration: 9000 });
                }
              }}
              className="v3-btn v3-btn-gold text-[12.5px] whitespace-nowrap cursor-pointer"
              title="Copier le lien Google AI Studio et l'ouvrir dans un nouvel onglet"
            >
              Obtenir ma clé gratuite
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('v3-open-keys'))}
              className="v3-btn v3-btn-on-dark text-[12.5px] whitespace-nowrap"
            >
              Coller ma clé
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 md:px-8 pb-3 -mt-1 md:hidden">
          <p className="text-[12px] text-white/80 leading-snug">
            Si le bouton ne s'ouvre pas, copiez ce lien : <code className="text-[11px] bg-white/15 px-1.5 py-0.5 rounded">https://aistudio.google.com/app/apikey</code>
          </p>
        </div>
      </section>

      {/* MOTEUR MULTI-MODÈLES — juste sous le bandeau d'accroche */}
      <V3EngineStrip />
      <V3EngineGrid />

      {/* KDP Pilot — outil partenaire payant + code abonnés (compact, avant les champs) */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-2">
        <KdpPilotPromoBanner variant="light" compact />
      </section>

      {/* Démarrage : titre du livre → fiche (champs réduits) */}
      <V3StartBookBar />

      <V3BriefRecap />

      {/* Ce que l'outil produit (le paramétrage des clés vit dans « Fonctionnalités ») */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-5">
        <V3CapabilitiesPanel />
      </div>

      {/* SECTIONS DE CONVICTION — sous le module des livres */}
      <V3MarketProofPanel />
      <V3BeforeAfterPanel />
      <V3AudiencePanel />
      <V3GuaranteePanel />
      <V3CommercialLicensePanel />





      {/* BANDE BLOG — mise en évidence */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-10">
        <a
          href="https://ebookstudio.blog/#accueil"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-3xl transition-all"
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #053e2f 60%, #0a5a45 100%)',
            border: '1px solid rgba(201,168,76,0.45)',
            boxShadow: '0 30px 60px -30px rgba(6,78,59,0.5)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, var(--v3-gold), transparent)' }} />
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-6 px-6 md:px-10 py-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--v3-gold)' }}>
                  Nouveau · Blog refait
                </span>
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
                  style={{ background: '#C97A14', color: '#fff' }}
                >
                  À lire
                </span>
              </div>
              <h2 className="v3-serif text-2xl md:text-3xl font-semibold text-white leading-tight">
                Le Blog EbookStudio — la méthode, en clair
              </h2>
              <p className="mt-2 text-[14px] text-white/75 max-w-2xl">
                Articles, guides pratiques et retours d'expérience pour écrire, illustrer et publier
                votre livre. Nouvelle édition entièrement repensée.
              </p>
            </div>
            <div className="flex md:justify-end">
              <span
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[15px] whitespace-nowrap"
                style={{
                  background: 'var(--v3-gold)',
                  color: '#1a1408',
                  boxShadow: '0 10px 30px -10px rgba(201,168,76,0.7)',
                }}
              >
                Ouvrir le blog
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </a>
      </section>

      {/* Les six univers vivent désormais dans « Fonctionnalités » (12 modules) */}


      {/* MOTEUR MULTI-MODÈLES */}
      <V3EngineStrip />
      <V3EngineGrid />

      {/* OUTILS VEDETTES */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-16">
        <div className="rounded-3xl p-10" style={{ background: 'var(--v3-cream)', border: '1px solid var(--v3-line)' }}>
          <div className="text-center mb-8">
            <div className="text-[10px] uppercase tracking-[0.24em] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
              Les incontournables
            </div>
            <h2 className="v3-serif mt-2 text-3xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
              Quatre outils au cœur du studio
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_TOOLS.map((t) => (
              <Link
                key={t.title}
                to={t.to}
                className="group block rounded-2xl bg-white p-5 transition-all"
                style={{ border: '1px solid var(--v3-line)' }}
                onMouseOver={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(201,168,76,0.5)';
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = 'var(--v3-shadow-card)';
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--v3-line)';
                  el.style.transform = '';
                  el.style.boxShadow = '';
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="v3-badge">{t.badge}</span>
                </div>
                <div className="v3-serif text-[18px] font-semibold mt-3" style={{ color: 'var(--v3-emerald)' }}>
                  {t.title}
                </div>
                <p className="text-[12.5px] mt-1 leading-snug" style={{ color: 'var(--v3-muted)' }}>{t.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-[12px] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
                  Ouvrir <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AUTEUR INVITÉ (émeraude nuit) */}
      <section className="v3-section-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <span
                className="v3-chip"
                style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--v3-gold)', borderColor: 'transparent' }}
              >
                ✨ Auteur invité
              </span>
              <h2 className="v3-serif mt-4 text-3xl md:text-4xl font-semibold text-white">Mr Georges Boubet</h2>
              <p className="mt-2 text-white/60 max-w-xl text-sm">
                71 livres publiés. Thrillers, sagas, jeunesse — le catalogue d'un auteur passionné.
              </p>
            </div>
            <a href={AUTHOR_AMAZON_URL} target="_blank" rel="noopener noreferrer" className="v3-btn v3-btn-gold">
              Voir sur Amazon <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {AUTHOR_BOOKS.map((b) => (
              <a
                key={b.asin}
                href={amazonBookUrl(b.asin)}
                target="_blank" rel="noopener noreferrer"
                className="group block"
                title={b.title}
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-black/40 shadow-lg ring-1 ring-white/10 transition-transform group-hover:-translate-y-1 group-hover:shadow-2xl">
                  <img
                    src={coverUrl(b.asin)}
                    alt={`Couverture ${b.title}`}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src !== fallbackCoverUrl(b.asin)) img.src = fallbackCoverUrl(b.asin);
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 text-[11px] text-white/70 line-clamp-2 leading-tight">{b.title}</div>
              </a>
            ))}
          </div>
        </div>
      </section>


      {/* CTA final */}

      <section className="max-w-5xl mx-auto px-5 md:px-8 py-20 text-center">
        <div className="v3-card">
          <div className="w-12 h-12 rounded-xl grid place-items-center mx-auto" style={{ background: 'var(--v3-gold-soft)' }}>
            <Library className="w-6 h-6" style={{ color: 'var(--v3-emerald)' }} />
          </div>
          <h2 className="v3-serif mt-4 text-3xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
            Vos sauvegardes vous attendent
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
            Retrouvez tous les livres que vous avez créés, mis en favori ou en cours de rédaction.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/v3/library" className="v3-btn v3-btn-primary">
              <BookOpen className="w-4 h-4" /> Ma bibliothèque
            </Link>
            <Link to="/v3/create" className="v3-btn v3-btn-gold">
              <Sparkles className="w-4 h-4" /> Ebookstudio-Génie — créer mon livre
            </Link>


          </div>
        </div>
      </section>

      {/* Palette officielle V3 */}
      <V3PaletteModule />
    </>

  );
}
