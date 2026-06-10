import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { V3_PILLAR_META, V3_PRICE, type V3Module } from '@/data/roadmapV3';

import ScoutAnalysis from '@/components/admin/ScoutAnalysis';
import SagaArchitect from '@/components/admin/SagaArchitect';
import LumenReadability from '@/components/admin/LumenReadability';
import EchoAuthorVoice from '@/components/admin/EchoAuthorVoice';
import OracleManuscript from '@/components/admin/OracleManuscript';
import DuelBlurb from '@/components/admin/DuelBlurb';
import VigieTrends from '@/components/admin/VigieTrends';
import NicheIntelligence from '@/components/admin/NicheIntelligence';
import ListingOptimizer from '@/components/admin/ListingOptimizer';
import BookCreationStudio from '@/components/admin/BookCreationStudio';
import LibraryModule from '@/components/admin/LibraryModule';
import CoverPdfExact from '@/components/admin/CoverPdfExact';
import CoverStudioPro from '@/components/admin/CoverStudioPro';
import AuditPilotModule from '@/components/admin/AuditPilotModule';
import KdpPackExport from '@/components/admin/KdpPackExport';
import MultiFormatExport from '@/components/admin/MultiFormatExport';
import PrepubChecklist from '@/components/admin/PrepubChecklist';
import KindlePreviewer from '@/components/admin/KindlePreviewer';
import IsbnMetadataManager from '@/components/admin/IsbnMetadataManager';
import CategoriesManager10 from '@/components/admin/CategoriesManager10';
import PrintProofChecker from '@/components/admin/PrintProofChecker';
import BackMatterBuilder from '@/components/admin/BackMatterBuilder';
import CoverVariantsThumbnail from '@/components/admin/CoverVariantsThumbnail';
import TranslationMarkets from '@/components/admin/TranslationMarkets';
import SalesTrackerKdp from '@/components/admin/SalesTrackerKdp';
import RoyaltiesDashboard from '@/components/admin/RoyaltiesDashboard';
import SalesDescription from '@/components/admin/SalesDescription';
import AplusGenerator from '@/components/admin/AplusGenerator';
import AutoPricingAI from '@/components/admin/AutoPricingAI';
import BundlesBoxsets from '@/components/admin/BundlesBoxsets';
import LeadMagnetBuilder from '@/components/admin/LeadMagnetBuilder';
import BackCatalogFunnel from '@/components/admin/BackCatalogFunnel';
import KdpSelectPlanner from '@/components/admin/KdpSelectPlanner';
import LaunchSequenceJ7 from '@/components/admin/LaunchSequenceJ7';
import AmazonAdsGenerator from '@/components/admin/AmazonAdsGenerator';
import PinterestAutoPins from '@/components/admin/PinterestAutoPins';
import BookTrailerAI from '@/components/admin/BookTrailerAI';
import ReviewsBooster from '@/components/admin/ReviewsBooster';
import TiktokHooks from '@/components/admin/TiktokHooks';
import AuthorNewsletter from '@/components/admin/AuthorNewsletter';
import AuthorPageOptimizer from '@/components/admin/AuthorPageOptimizer';
import BookBubAdBuilder from '@/components/admin/BookBubAdBuilder';
import ArcTeamBuilder from '@/components/admin/ArcTeamBuilder';
import ManuscriptConverter from '@/components/admin/ManuscriptConverter';
import ContentComplianceChecker from '@/components/admin/ContentComplianceChecker';
import CopyrightPageGenerator from '@/components/admin/CopyrightPageGenerator';
import EbookAntiPlagiat from '@/components/admin/EbookAntiPlagiat';
import RoyaltiesSimulator from '@/components/admin/RoyaltiesSimulator';
import KuNicheDetector from '@/components/admin/KuNicheDetector';
import LaunchPricingStrategy from '@/components/admin/LaunchPricingStrategy';
import SocialCalendar30 from '@/components/admin/SocialCalendar30';
import QuoteVisualsGenerator from '@/components/admin/QuoteVisualsGenerator';
import MediaKitAuthor from '@/components/admin/MediaKitAuthor';
import GoodreadsOptimizer from '@/components/admin/GoodreadsOptimizer';
import UniverseBibleCheck from '@/components/admin/UniverseBibleCheck';
import ClicheDetector from '@/components/admin/ClicheDetector';
import ToneAdapter from '@/components/admin/ToneAdapter';
import CommercialScore from '@/components/admin/CommercialScore';
import InfluencerKit from '@/components/admin/InfluencerKit';
import LookInsideOptimizer from '@/components/admin/LookInsideOptimizer';
import EditorialReviews from '@/components/admin/EditorialReviews';
import CommunityKdpHub from '@/components/admin/CommunityKdpHub';
import CommunityAiUnblock from '@/components/admin/CommunityAiUnblock';

/** Modules dont le dialog s'affiche en largeur réduite (max-w-2xl). */
export const NARROW_MODULE_IDS: string[] = [
  'p16-competitive', 'p17-series', 'p18-readability', 'p19-author-voice',
  'p20-chat-manuscript', 'p21-blurb-ab-tester', 'p22-trend-radar',
];

/** Mapping id de module -> composant outil. */
export const V3_MODULE_COMPONENTS: Record<string, React.ComponentType> = {
  'p16-competitive': ScoutAnalysis,
  'p17-series': SagaArchitect,
  'p18-readability': LumenReadability,
  'p19-author-voice': EchoAuthorVoice,
  'p20-chat-manuscript': OracleManuscript,
  'p21-blurb-ab-tester': DuelBlurb,
  'p22-trend-radar': VigieTrends,
  'niche-intelligence': NicheIntelligence,
  'listing-optimizer': ListingOptimizer,
  'book-creation-studio': BookCreationStudio,
  'library': LibraryModule,
  'cover-pdf-exact': CoverPdfExact,
  'cover-studio-pro': CoverStudioPro,
  'cockpit-audit-pilot': AuditPilotModule,
  'kdp-pack-zip': KdpPackExport,
  'multi-format-express': MultiFormatExport,
  'prepub-checklist': PrepubChecklist,
  'kindle-previewer': KindlePreviewer,
  'isbn-metadata': IsbnMetadataManager,
  'categories-manager-10': CategoriesManager10,
  'print-proof-checker': PrintProofChecker,
  'back-matter-builder': BackMatterBuilder,
  'cover-variants-thumbnail': CoverVariantsThumbnail,
  'translation-markets': TranslationMarkets,
  'sales-tracker': SalesTrackerKdp,
  'royalties-dashboard': RoyaltiesDashboard,
  'sales-description': SalesDescription,
  'aplus-generator': AplusGenerator,
  'auto-pricing': AutoPricingAI,
  'bundles-boxsets': BundlesBoxsets,
  'lead-magnet': LeadMagnetBuilder,
  'back-catalog-funnel': BackCatalogFunnel,
  'kdp-select-planner': KdpSelectPlanner,
  'launch-sequence-j7': LaunchSequenceJ7,
  'amazon-ads': AmazonAdsGenerator,
  'pinterest-pins': PinterestAutoPins,
  'book-trailer': BookTrailerAI,
  'reviews-booster': ReviewsBooster,
  'tiktok-hooks': TiktokHooks,
  'author-newsletter': AuthorNewsletter,
  'author-page-optimizer': AuthorPageOptimizer,
  'bookbub-ad-builder': BookBubAdBuilder,
  'arc-team-builder': ArcTeamBuilder,
  'manuscript-converter': ManuscriptConverter,
  'content-compliance': ContentComplianceChecker,
  'copyright-page': CopyrightPageGenerator,
  'ebook-anti-plagiat': EbookAntiPlagiat,
  'royalties-simulator': RoyaltiesSimulator,
  'ku-niche-detector': KuNicheDetector,
  'launch-pricing': LaunchPricingStrategy,
  'social-calendar-30': SocialCalendar30,
  'quote-visuals': QuoteVisualsGenerator,
  'media-kit': MediaKitAuthor,
  'goodreads-optimizer': GoodreadsOptimizer,
  'p23-universe-bible': UniverseBibleCheck,
  'p24-cliche-detector': ClicheDetector,
  'p25-tone-adapter': ToneAdapter,
  'p26-commercial-score': CommercialScore,
  'influencer-kit': InfluencerKit,
  'look-inside-optimizer': LookInsideOptimizer,
  'editorial-reviews': EditorialReviews,
  'community-kdp-hub': CommunityKdpHub,
  'community-pinned-solutions': CommunityKdpHub,
  'community-tool-deeplinks': CommunityKdpHub,
  'community-ai-unblock': CommunityAiUnblock,
};

/** Tous les modules ouvrables (mode hors V3 / cockpit standard). */
export const CLICKABLE_MODULE_IDS: string[] = Object.keys(V3_MODULE_COMPONENTS);

export function isModuleClickable(id: string): boolean {
  return id in V3_MODULE_COMPONENTS;
}

/**
 * Dialog partagé qui rend l'outil d'un module V3.
 * Utilisé par le cockpit admin et par le Hub V3.
 */
export function V3ModuleDialog({
  module,
  onClose,
  toolProps,
}: {
  module: V3Module | null;
  onClose: () => void;
  toolProps?: Record<string, unknown>;
}) {
  const id = module?.id ?? '';
  const Tool = V3_MODULE_COMPONENTS[id] as React.ComponentType<Record<string, unknown>> | undefined;
  const widthClass = NARROW_MODULE_IDS.includes(id)
    ? 'max-w-2xl max-h-[85vh] overflow-y-auto'
    : Tool
      ? 'max-w-6xl max-h-[88vh] overflow-y-auto'
      : undefined;

  return (
    <Dialog open={!!module} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={widthClass}>
        {module && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>{V3_PILLAR_META[module.pillar].emoji}</span>
                {module.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground leading-relaxed">{module.description}</p>
              {Tool ? (
                <div className="border-t pt-3">
                  <Tool {...(toolProps ?? {})} />
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground/60">
                  Module en préparation pour la V3 ({V3_PRICE}€ à vie).
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default V3ModuleDialog;
