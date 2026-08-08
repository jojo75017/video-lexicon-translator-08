import React from 'react';
import { BarChart3, TrendingUp, Target, ExternalLink, Tag } from 'lucide-react';
import { KDP_PILOT_URL, KDP_PILOT_PROMO_CODE } from '@/data/externalLinks';

/**
 * Bandeau KDP Pilot (outil payant, partenaire).
 * `variant="dark"` pour les sections sombres de la V3, `light` par défaut (V2).
 */
export const KdpPilotPromoBanner: React.FC<{ className?: string; variant?: 'light' | 'dark' }> = ({
  className = '',
  variant = 'light',
}) => {
  const dark = variant === 'dark';

  return (
    <div
      className={`rounded-xl border p-5 md:p-6 ${className} ${
        dark
          ? 'border-[rgba(201,168,76,0.35)] bg-[rgba(255,255,255,0.04)]'
          : 'border-amber-200/60 bg-gradient-to-r from-amber-50/60 via-background to-background'
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
              dark
                ? 'border-[rgba(201,168,76,0.45)] bg-[rgba(201,168,76,0.15)] text-[#e6c66b]'
                : 'border-amber-300/50 bg-amber-100/70 text-amber-800'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Données Amazon avancées — outil partenaire payant
          </div>
          <h3 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-foreground'}`}>
            Allez plus loin : suivez vos ventes réelles et la concurrence de votre niche
          </h3>
          <p className={`max-w-2xl text-sm leading-relaxed ${dark ? 'text-white/70' : 'text-muted-foreground'}`}>
            KDP Pilot est un abonnement indépendant d'EbookStudio (service payant). Il complète nos outils
            avec l'historique des positions, les ventes estimées et l'analyse de niche, mis à jour chaque jour.
          </p>
          <ul className={`flex flex-wrap gap-x-5 gap-y-1.5 pt-1 text-sm ${dark ? 'text-white/70' : 'text-muted-foreground'}`}>
            <li className="inline-flex items-center gap-1.5">
              <TrendingUp className={`h-4 w-4 ${dark ? 'text-[#e6c66b]' : 'text-amber-600'}`} /> Historique des ventes & BSR
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Target className={`h-4 w-4 ${dark ? 'text-[#e6c66b]' : 'text-amber-600'}`} /> Niches et concurrents suivis
            </li>
            <li className="inline-flex items-center gap-1.5">
              <BarChart3 className={`h-4 w-4 ${dark ? 'text-[#e6c66b]' : 'text-amber-600'}`} /> Ajustez votre livre au bon moment
            </li>
          </ul>
          <div
            className={`mt-2 inline-flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-[12.5px] ${
              dark
                ? 'border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.1)] text-white/85'
                : 'border-amber-300/60 bg-amber-50 text-amber-900'
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>
              Code abonnés EbookStudio :{' '}
              <strong className="font-bold tracking-wide">{KDP_PILOT_PROMO_CODE}</strong> — 15 % de réduction sur le
              premier mois ou la première année, à saisir dans le champ « code promo » au moment du paiement.
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <a
            href={KDP_PILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
              dark ? 'bg-[#e6c66b] text-[#1a1408]' : 'bg-amber-600 text-white'
            }`}
          >
            Découvrir KDP Pilot <ExternalLink className="h-4 w-4" />
          </a>

          <p className={`mt-2 text-center text-[11px] md:text-right ${dark ? 'text-white/50' : 'text-muted-foreground'}`}>
            Abonnement payant — code {KDP_PILOT_PROMO_CODE} au paiement
          </p>
        </div>
      </div>
    </div>
  );
};

export default KdpPilotPromoBanner;
