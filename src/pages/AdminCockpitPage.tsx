import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Shield, Trash2, Calendar as CalendarIcon, Sparkles, Rocket, KeyRound, Copy, Send } from 'lucide-react';
import { EbookSettingsPanel } from '@/components/ebook/EbookSettingsPanel';
import { V3_MODULES, V3_PILLAR_META, V3_PILLAR_COLORS, V3_PRICE, V2_PRICE, type V3Pillar, type V3Module } from '@/data/roadmapV3';
import { useV3Mode } from '@/hooks/useV3Mode';
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
import { toast } from 'sonner';
import {
  addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth,
  parseISO, startOfMonth, startOfWeek, isAfter, differenceInCalendarDays,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import formationSlidesPdf from '@/assets/formation-v2-slides.pdf';



const TEAL = '#008296';
const ORANGE = '#FF9E2D';
const INK = '#232F3E';

type Launch = {
  id: string;
  user_id: string;
  title: string;
  launch_date: string; // YYYY-MM-DD
  status: 'planned' | 'in_progress' | 'done';
  notes: string | null;
  color: string | null;
};

type TunnelTile = {
  emoji: string;
  label: string;
  caption: string;
  path: string;
};

const TUNNEL_GROUPS: { name: string; tint: string; tiles: TunnelTile[] }[] = [
  {
    name: 'Tunnel principal',
    tint: 'bg-joy-cream',
    tiles: [
      { emoji: '🎯', label: 'Capture',     caption: 'Étape 1 — email opt-in',         path: '/promo' },
      { emoji: '🎁', label: 'Bonus',       caption: 'Étape 2 — cadeau immédiat',      path: '/promo/bonus' },
      { emoji: '🔍', label: 'Découverte',  caption: 'Étape 3 — page de découverte',   path: '/promo/decouverte' },
      { emoji: '🛒', label: 'Commande',    caption: 'Étape 4 — récap commande',       path: '/promo/commande' },
      { emoji: '💳', label: 'Paiement',    caption: 'Étape 5 — checkout',             path: '/promo/paiement' },
      { emoji: '🙏', label: 'Merci',       caption: 'Étape 6 — confirmation',         path: '/promo/merci' },
      { emoji: '🚀', label: 'Espace promo',caption: 'Étape 7 — onboarding',           path: '/promo/espace' },
      { emoji: '🤝', label: 'Affilié',     caption: 'Étape 8 — programme partenaire', path: '/promo/affilie' },
    ],
  },
  {
    name: 'Vente & upsells',
    tint: 'bg-joy-peach/30',
    tiles: [
      { emoji: '💛', label: 'Page de vente',  caption: 'Offre principale',     path: '/offres' },
      { emoji: '⭐', label: 'Upsell',         caption: 'Offre additionnelle',  path: '/upsell' },
      { emoji: '💎', label: 'Upsell paiement',caption: 'Checkout upsell',      path: '/upsell-paiement' },
      { emoji: '🧾', label: 'Paiement manuel',caption: 'Backup virement',      path: '/paiement-manuel' },
      { emoji: '✅', label: 'Paiement réussi',caption: 'Page de succès',       path: '/paiement-succes' },
    ],
  },
  {
    name: 'Outils admin',
    tint: 'bg-joy-mint/30',
    tiles: [
      { emoji: '⚡', label: 'Admin direct',     caption: 'Accès rapide admin',  path: '/admin-direct' },
      { emoji: '📊', label: 'Dashboard mkt',    caption: 'KPIs marketing',      path: '/dashboard-marketing' },
      { emoji: '👥', label: 'CRM',              caption: 'Contacts & leads',    path: '/crm' },
      { emoji: '📣', label: 'Campagne vente',   caption: 'Séquences email',     path: '/campagne-vente' },
      { emoji: '✉️', label: 'Aperçu emails',    caption: 'Preview templates',   path: '/apercu-emails' },
      { emoji: '📝', label: 'Posts sociaux',    caption: 'Générateur posts',    path: '/generateur-posts' },
      { emoji: '🎯', label: 'Prospects',        caption: 'Gestion prospects',   path: '/gestion-prospects' },
      { emoji: '📢', label: 'Influenceurs',     caption: 'Recrutement ambassadeurs', path: '/influenceurs' },
      { emoji: '📘', label: 'Guide Ebook',      caption: 'PDF pour les curieux', path: '/guide-ebook' },
    ],
  },
];

const STATUS_OPTIONS: { value: Launch['status']; label: string }[] = [
  { value: 'planned',     label: '📅 Prévu' },
  { value: 'in_progress', label: '🚧 En cours' },
  { value: 'done',        label: '✅ Lancé' },
];

const COLOR_PRESETS = ['#008296', '#FF9E2D', '#E94E77', '#7C3AED', '#10B981', '#3B82F6'];

const emptyDraft = (date: Date | null = null): Partial<Launch> => ({
  title: '',
  launch_date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
  status: 'planned',
  notes: '',
  color: TEAL,
});

const AdminCockpitPage: React.FC = () => {
  const navigate = useNavigate();
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<Date>(new Date());
  const [editing, setEditing] = useState<Launch | null>(null);
  const [draft, setDraft] = useState<Partial<Launch> | null>(null);
  const [showFormation, setShowFormation] = useState(false);
  const { isAdmin, v3Mode, setV3Mode } = useV3Mode();
  const [selectedModule, setSelectedModule] = useState<V3Module | null>(null);

  // Thème conditionnel : V2 (KDP clair) par défaut, V3 (Midnight Indigo) quand v3Mode est actif.
  const skin = isAdmin && v3Mode;
  const teal = skin ? '#4f46e5' : TEAL;
  const accent = skin ? '#6366f1' : ORANGE;
  const ink = skin ? '#1e2240' : INK;
  const pillarColor = (p: V3Pillar) => (skin ? V3_PILLAR_COLORS[p] : V3_PILLAR_META[p].color);

  const v3Counts = useMemo(() => ({
    todo: V3_MODULES.filter((m) => m.status === 'todo').length,
    in_progress: V3_MODULES.filter((m) => m.status === 'in_progress').length,
    done: V3_MODULES.filter((m) => m.status === 'done').length,
  }), []);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_launches')
      .select('*')
      .order('launch_date', { ascending: true });
    if (error) {
      toast.error('Impossible de charger les lancements');
      console.error(error);
    } else {
      setLaunches((data || []) as Launch[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = useMemo(() => {
    const out: Date[] = [];
    let d = gridStart;
    while (d <= gridEnd) {
      out.push(d);
      d = new Date(d.getTime() + 24 * 60 * 60 * 1000);
    }
    return out;
  }, [gridStart, gridEnd]);

  const launchesByDay = useMemo(() => {
    const map: Record<string, Launch[]> = {};
    launches.forEach((l) => {
      (map[l.launch_date] ||= []).push(l);
    });
    return map;
  }, [launches]);

  const upcoming = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return launches
      .filter((l) => !isAfter(today, parseISO(l.launch_date)))
      .slice(0, 5);
  }, [launches]);

  const openCreate = (date: Date | null = null) => {
    setEditing(null);
    setDraft(emptyDraft(date));
  };

  const openEdit = (l: Launch) => {
    setEditing(l);
    setDraft({ ...l });
  };

  const save = async () => {
    if (!draft?.title || !draft.launch_date) {
      toast.error('Titre et date requis');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Session expirée'); return; }

    if (editing) {
      const { error } = await supabase
        .from('admin_launches')
        .update({
          title: draft.title,
          launch_date: draft.launch_date,
          status: draft.status,
          notes: draft.notes || null,
          color: draft.color || TEAL,
        })
        .eq('id', editing.id);
      if (error) { toast.error('Erreur enregistrement'); return; }
      toast.success('Lancement mis à jour');
    } else {
      const { error } = await supabase
        .from('admin_launches')
        .insert({
          user_id: user.id,
          title: draft.title,
          launch_date: draft.launch_date,
          status: draft.status || 'planned',
          notes: draft.notes || null,
          color: draft.color || TEAL,
        });
      if (error) { toast.error('Erreur création'); return; }
      toast.success('Lancement ajouté');
    }
    setDraft(null);
    setEditing(null);
    load();
  };

  const remove = async () => {
    if (!editing) return;
    if (!confirm('Supprimer ce lancement ?')) return;
    const { error } = await supabase.from('admin_launches').delete().eq('id', editing.id);
    if (error) { toast.error('Erreur suppression'); return; }
    toast.success('Lancement supprimé');
    setDraft(null); setEditing(null);
    load();
  };

  return (
    <div className={`min-h-screen ${skin ? 'v3-skin' : 'bg-[#FAFAFA]'}`} style={{ color: ink }}>
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 border-b border-joy-ink/8">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/espace')} className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à l'espace</span>
          </button>
          <div className="flex items-center gap-2 font-semibold">
            <Shield className="h-5 w-5" style={{ color: teal }} />
            <span>{skin ? 'Cockpit V3 — Publication Assistée Pro' : 'Cockpit admin'}</span>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setV3Mode(!v3Mode)}
                className="inline-flex items-center gap-3 rounded-full border-2 px-4 py-2 text-sm font-black shadow-lg transition-all hover:scale-[1.03]"
                style={{
                  borderColor: v3Mode ? '#c9a84c' : ORANGE,
                  background: v3Mode ? 'linear-gradient(135deg, #0d0d0d, #161616)' : ORANGE,
                  color: v3Mode ? '#f0d78c' : '#ffffff',
                  boxShadow: v3Mode ? '0 0 0 4px #c9a84c22' : '0 0 0 4px #FF9E2D33',
                }}
                title="Bascule V2 / V3 — réservée admin"
              >
                <span className={!v3Mode ? 'font-black' : 'opacity-60'}>V2</span>
                <span
                  className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors"
                  style={{ background: v3Mode ? '#c9a84c' : '#ffffff' }}
                >
                  <span
                    className="inline-block h-4 w-4 rounded-full transition-transform"
                    style={{ transform: v3Mode ? 'translateX(22px)' : 'translateX(2px)', background: v3Mode ? '#111111' : ORANGE }}
                  />
                </span>
                <span className={v3Mode ? 'font-black' : 'opacity-80'}>V3</span>
              </button>
            )}
            <Button
              size="sm"
              onClick={() => navigate('/hub-v3')}
              className="rounded-full px-4 gap-1.5 hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(90deg, #c9a84c, #f0d78c)', color: '#1a1a1a' }}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Hub V3 ✨</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/tableau-de-bord')}
              className="rounded-full px-4 gap-1.5 hover:opacity-90 transition-all"
              style={{ borderColor: accent, color: accent }}
            >
              <Rocket className="h-4 w-4" />
              <span className="hidden sm:inline">Tableau de bord V3</span>
            </Button>
            <Button
              size="sm"
              onClick={() => openCreate()}
              className="rounded-full px-4 gap-1.5 hover:opacity-90 transition-all"
              style={{ background: teal, color: 'white' }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nouveau lancement</span>
            </Button>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-8">
        {/* Configuration IA — clés & modèles (Gemini / Claude / ChatGPT / OpenRouter) */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <KeyRound className="h-5 w-5" style={{ color: accent }} />
            <h2 className="text-lg font-bold">Configuration IA — clés &amp; modèles</h2>
            <span className="text-xs text-joy-ink/50">Gemini · Claude · ChatGPT · OpenRouter</span>
          </div>
          <EbookSettingsPanel />
        </section>

        {/* Formation V2 — slides */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5" style={{ color: accent }} />
            <h2 className="text-lg font-bold">Formation V2 — présentation en slides</h2>
            <span className="text-xs text-joy-ink/50">30 slides · script mot-à-mot · teaser V3</span>
          </div>
          <Card className="border border-joy-ink/8">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="font-semibold mb-1">🎬 EbookStudio Pro V2 — Formation Vidéo</div>
                <div className="text-sm text-joy-ink/60 leading-snug">
                  Présentation événementielle complète (24 slides V2 + 6 slides teaser V3
                  pour le lancement du 1er octobre), avec le script mot-à-mot prêt à présenter.
                  Format PDF 16:9, couleurs de la marque.
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => setShowFormation(true)}
                  className="rounded-full px-4 gap-1.5"
                  style={{ background: teal, color: 'white' }}
                >
                  <Sparkles className="h-4 w-4" />
                  Ouvrir les slides
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="rounded-full px-4"
                  style={{ borderColor: accent, color: accent }}
                >
                  <a href={formationSlidesPdf} download="Formation-EbookStudio-V2-Slides.pdf">
                    Télécharger
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Dialog open={showFormation} onOpenChange={setShowFormation}>
            <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col">
              <DialogHeader className="px-4 py-3 border-b">
                <DialogTitle className="flex items-center justify-between gap-3">
                  <span>🎬 Formation EbookStudio Pro V2 + teaser V3 — 30 slides</span>
                  <a
                    href={formationSlidesPdf}
                    download="Formation-EbookStudio-V2-Slides.pdf"
                    className="text-sm font-semibold underline"
                    style={{ color: accent }}
                  >
                    Télécharger le PDF
                  </a>
                </DialogTitle>
              </DialogHeader>
              <iframe
                src={formationSlidesPdf}
                title="Formation EbookStudio Pro V2"
                className="w-full flex-1 border-0"
              />
            </DialogContent>
          </Dialog>

        </section>

        {/* Tunnel */}
        <section>

          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5" style={{ color: accent }} />
            <h2 className="text-lg font-bold">Tunnel de lancement</h2>
            <span className="text-xs text-joy-ink/50">accès rapide à toutes les pages</span>
          </div>

          <div className="space-y-4">
            {TUNNEL_GROUPS.map((group) => (
              <div key={group.name}>
                <div className="text-xs uppercase tracking-wider text-joy-ink/50 mb-2 px-1">{group.name}</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                  {group.tiles.map((t) => (
                    <button
                      key={t.path}
                      onClick={() => navigate(t.path)}
                      className={`group text-left rounded-2xl p-3 ${group.tint} border border-joy-ink/5 hover:border-joy-teal/40 hover:scale-[1.02] hover:shadow-md transition-all`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{t.emoji}</span>
                        <span className="font-semibold text-sm group-hover:text-[#FF9E2D] transition-colors">{t.label}</span>
                      </div>
                      <div className="text-[11px] text-joy-ink/60 leading-snug">{t.caption}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap V3 */}
        <section>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Rocket className="h-5 w-5" style={{ color: accent }} />
            <h2 className="text-lg font-bold">Roadmap V3 — Publication Assistée Pro</h2>
            <span
              className="text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5"
              style={{ background: accent, color: 'white' }}
            >
              {V3_PRICE}€ à vie
            </span>
            <span className="text-xs text-joy-ink/50">
              (V2 actuelle : {V2_PRICE}€) · {V3_MODULES.length} modules · éditable dans <code>src/data/roadmapV3.ts</code>
            </span>

            {/* Bascule V2 / V3 — admin uniquement */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setV3Mode(!v3Mode)}
                className="ml-auto inline-flex items-center gap-3 rounded-full border-2 px-4 py-2 text-sm font-black shadow-lg transition-all hover:scale-[1.03]"
                style={{
                  borderColor: v3Mode ? '#c9a84c' : ORANGE,
                  background: v3Mode ? 'linear-gradient(135deg, #0d0d0d, #161616)' : ORANGE,
                  color: v3Mode ? '#f0d78c' : '#ffffff',
                  boxShadow: v3Mode ? '0 0 0 4px #c9a84c22' : '0 0 0 4px #FF9E2D33',
                }}
                title="Bascule réservée admin — préparation du lancement V3"
              >
                <span className={!v3Mode ? 'font-black' : 'opacity-60'}>V2</span>
                <span
                  className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors"
                  style={{ background: v3Mode ? '#c9a84c' : '#ffffff' }}
                >
                  <span
                    className="inline-block h-4 w-4 rounded-full transition-transform"
                    style={{ transform: v3Mode ? 'translateX(22px)' : 'translateX(2px)', background: v3Mode ? '#111111' : ORANGE }}
                  />
                </span>
                <span className={v3Mode ? 'font-black' : 'opacity-80'}>V3</span>
              </button>
            )}
          </div>

          {/* Bannière mode V3 actif (admin) */}
          {isAdmin && v3Mode && (
            <div
              className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border px-3 py-2 text-xs"
              style={{ borderColor: `${accent}55`, background: `${accent}12` }}
            >
              <Sparkles className="h-4 w-4" style={{ color: accent }} />
              <span className="font-bold" style={{ color: accent }}>Mode V3 actif (préparation)</span>
              <span className="text-joy-ink/60">Clique un module pour voir son détail. Visible par toi seul (admin).</span>
              <span className="ml-auto flex items-center gap-2">
                <span className="rounded px-1.5 py-0.5" style={{ background: '#ffffff1a', color: ink }}>todo {v3Counts.todo}</span>
                <span className="rounded px-1.5 py-0.5" style={{ background: `${accent}22`, color: accent }}>en cours {v3Counts.in_progress}</span>
                <span className="rounded px-1.5 py-0.5" style={{ background: '#10B98122', color: '#3ddc97' }}>fait {v3Counts.done}</span>
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {(Object.keys(V3_PILLAR_META) as V3Pillar[]).map((pillar) => {
              const meta = V3_PILLAR_META[pillar];
              const pc = pillarColor(pillar);
              const items = V3_MODULES.filter((m) => m.pillar === pillar);
              return (
                <div
                  key={pillar}
                  className="rounded-2xl border bg-white p-3"
                  style={{ borderColor: `${pc}33` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{meta.emoji}</span>
                    <span className="font-bold text-sm" style={{ color: pc }}>{meta.label}</span>
                    <span className="ml-auto text-[11px] text-joy-ink/40">{items.length}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {items.map((m) => {
                      const clickable = (isAdmin && v3Mode) || ['p16-competitive', 'p17-series', 'p18-readability', 'p19-author-voice', 'p20-chat-manuscript', 'p21-blurb-ab-tester', 'p22-trend-radar', 'niche-intelligence', 'listing-optimizer', 'book-creation-studio', 'library', 'cover-pdf-exact', 'cockpit-audit-pilot', 'kdp-pack-zip', 'multi-format-express', 'prepub-checklist', 'kindle-previewer', 'isbn-metadata', 'categories-manager-10', 'print-proof-checker', 'back-matter-builder', 'cover-variants-thumbnail', 'translation-markets', 'sales-tracker', 'royalties-dashboard', 'sales-description', 'aplus-generator', 'auto-pricing', 'bundles-boxsets', 'lead-magnet', 'back-catalog-funnel', 'kdp-select-planner', 'launch-sequence-j7', 'amazon-ads', 'pinterest-pins', 'book-trailer', 'reviews-booster', 'tiktok-hooks', 'author-newsletter', 'author-page-optimizer', 'bookbub-ad-builder', 'arc-team-builder', 'manuscript-converter', 'content-compliance', 'copyright-page', 'royalties-simulator', 'ku-niche-detector', 'launch-pricing', 'social-calendar-30', 'quote-visuals', 'media-kit', 'goodreads-optimizer', 'p23-universe-bible', 'p24-cliche-detector', 'p25-tone-adapter', 'p26-commercial-score', 'ebook-anti-plagiat'].includes(m.id);
                      const statusColor = m.status === 'done' ? '#10B981' : m.status === 'in_progress' ? '#FF9E2D' : '#94A3B8';
                      const statusBg = m.status === 'done' ? '#10B98114' : m.status === 'in_progress' ? '#FF9E2D14' : '#F1F5F9';
                      const statusLabel = m.status === 'done' ? '✓ Fait' : m.status === 'in_progress' ? '… En cours' : 'À faire';
                      return (
                      <li
                        key={m.id}
                        onClick={clickable ? () => setSelectedModule(m) : undefined}
                        className={`rounded-lg p-2 transition-colors ${clickable ? 'cursor-pointer hover:brightness-95' : ''}`}
                        style={{ background: statusBg, borderLeft: `4px solid ${statusColor}` }}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5 mt-0.5 whitespace-nowrap"
                            style={{ background: statusColor, color: 'white' }}
                          >
                            {statusLabel}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold leading-tight">{m.title}</div>
                            <div className="text-[11px] text-joy-ink/60 leading-snug mt-0.5">{m.description}</div>
                          </div>
                        </div>
                      </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Détail module V3 (mode V3 admin) */}
        <Dialog open={!!selectedModule} onOpenChange={(o) => !o && setSelectedModule(null)}>
          <DialogContent className={['p16-competitive', 'p17-series', 'p18-readability', 'p19-author-voice', 'p20-chat-manuscript', 'p21-blurb-ab-tester', 'p22-trend-radar'].includes(selectedModule?.id ?? '') ? 'max-w-2xl max-h-[85vh] overflow-y-auto' : ['niche-intelligence', 'listing-optimizer', 'book-creation-studio', 'library', 'cover-pdf-exact', 'cockpit-audit-pilot', 'kdp-pack-zip', 'multi-format-express', 'prepub-checklist', 'kindle-previewer', 'isbn-metadata', 'categories-manager-10', 'print-proof-checker', 'back-matter-builder', 'cover-variants-thumbnail', 'translation-markets', 'sales-tracker', 'royalties-dashboard', 'sales-description', 'aplus-generator', 'auto-pricing', 'bundles-boxsets', 'lead-magnet', 'back-catalog-funnel', 'kdp-select-planner', 'launch-sequence-j7', 'amazon-ads', 'pinterest-pins', 'book-trailer', 'reviews-booster', 'tiktok-hooks', 'author-newsletter', 'author-page-optimizer', 'bookbub-ad-builder', 'arc-team-builder', 'manuscript-converter', 'content-compliance', 'copyright-page', 'royalties-simulator', 'ku-niche-detector', 'launch-pricing', 'social-calendar-30', 'quote-visuals', 'media-kit', 'goodreads-optimizer', 'p23-universe-bible', 'p24-cliche-detector', 'p25-tone-adapter', 'p26-commercial-score', 'ebook-anti-plagiat'].includes(selectedModule?.id ?? '') ? 'max-w-6xl max-h-[88vh] overflow-y-auto' : undefined}>
            {selectedModule && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span>{V3_PILLAR_META[selectedModule.pillar].emoji}</span>
                    {selectedModule.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                      style={{ background: `${pillarColor(selectedModule.pillar)}22`, color: pillarColor(selectedModule.pillar) }}
                    >
                      {V3_PILLAR_META[selectedModule.pillar].label}
                    </span>
                    <span
                      className="rounded px-2 py-0.5 text-[11px] uppercase tracking-wider"
                      style={{
                        background: selectedModule.status === 'done' ? '#10B98122' : selectedModule.status === 'in_progress' ? '#FF9E2D22' : '#23232322',
                        color:      selectedModule.status === 'done' ? '#10B981'   : selectedModule.status === 'in_progress' ? '#FF9E2D'   : '#666',
                      }}
                    >
                      {selectedModule.status === 'done' ? 'Fait' : selectedModule.status === 'in_progress' ? 'En cours' : 'En attente'}
                    </span>
                    <code className="text-[11px] text-joy-ink/40">{selectedModule.id}</code>
                  </div>
                  <p className="text-joy-ink/70 leading-relaxed">{selectedModule.description}</p>

                  {selectedModule.id === 'p16-competitive' ? (
                    <div className="border-t pt-3">
                      <ScoutAnalysis />
                    </div>
                  ) : selectedModule.id === 'p17-series' ? (
                    <div className="border-t pt-3">
                      <SagaArchitect />
                    </div>
                  ) : selectedModule.id === 'p18-readability' ? (
                    <div className="border-t pt-3">
                      <LumenReadability />
                    </div>
                  ) : selectedModule.id === 'p19-author-voice' ? (
                    <div className="border-t pt-3">
                      <EchoAuthorVoice />
                    </div>
                  ) : selectedModule.id === 'p20-chat-manuscript' ? (
                    <div className="border-t pt-3">
                      <OracleManuscript />
                    </div>
                  ) : selectedModule.id === 'p21-blurb-ab-tester' ? (
                    <div className="border-t pt-3">
                      <DuelBlurb />
                    </div>
                  ) : selectedModule.id === 'p22-trend-radar' ? (
                    <div className="border-t pt-3">
                      <VigieTrends />
                    </div>
                  ) : selectedModule.id === 'niche-intelligence' ? (
                    <NicheIntelligence />
                  ) : selectedModule.id === 'listing-optimizer' ? (
                    <ListingOptimizer />
                  ) : selectedModule.id === 'book-creation-studio' ? (
                    <BookCreationStudio />
                  ) : selectedModule.id === 'library' ? (
                    <LibraryModule />
                  ) : selectedModule.id === 'cover-pdf-exact' ? (
                    <CoverPdfExact />
                  ) : selectedModule.id === 'cockpit-audit-pilot' ? (
                    <AuditPilotModule />
                  ) : selectedModule.id === 'kdp-pack-zip' ? (
                    <KdpPackExport />
                  ) : selectedModule.id === 'multi-format-express' ? (
                    <MultiFormatExport />
                  ) : selectedModule.id === 'prepub-checklist' ? (
                    <PrepubChecklist />
                  ) : selectedModule.id === 'kindle-previewer' ? (
                    <KindlePreviewer />
                  ) : selectedModule.id === 'isbn-metadata' ? (
                    <IsbnMetadataManager />
                  ) : selectedModule.id === 'categories-manager-10' ? (
                    <CategoriesManager10 />
                  ) : selectedModule.id === 'print-proof-checker' ? (
                    <PrintProofChecker />
                  ) : selectedModule.id === 'back-matter-builder' ? (
                    <BackMatterBuilder />
                  ) : selectedModule.id === 'cover-variants-thumbnail' ? (
                    <CoverVariantsThumbnail />
                  ) : selectedModule.id === 'translation-markets' ? (
                    <TranslationMarkets />
                  ) : selectedModule.id === 'sales-tracker' ? (
                    <SalesTrackerKdp />
                  ) : selectedModule.id === 'royalties-dashboard' ? (
                    <RoyaltiesDashboard />
                  ) : selectedModule.id === 'sales-description' ? (
                    <SalesDescription />
                  ) : selectedModule.id === 'aplus-generator' ? (
                    <AplusGenerator />
                  ) : selectedModule.id === 'auto-pricing' ? (
                    <AutoPricingAI />
                  ) : selectedModule.id === 'bundles-boxsets' ? (
                    <BundlesBoxsets />
                  ) : selectedModule.id === 'lead-magnet' ? (
                    <LeadMagnetBuilder />
                  ) : selectedModule.id === 'back-catalog-funnel' ? (
                    <BackCatalogFunnel />
                  ) : selectedModule.id === 'kdp-select-planner' ? (
                    <KdpSelectPlanner />
                  ) : selectedModule.id === 'launch-sequence-j7' ? (
                    <LaunchSequenceJ7 />
                  ) : selectedModule.id === 'amazon-ads' ? (
                    <AmazonAdsGenerator />
                  ) : selectedModule.id === 'pinterest-pins' ? (
                    <PinterestAutoPins />
                  ) : selectedModule.id === 'book-trailer' ? (
                    <BookTrailerAI />
                  ) : selectedModule.id === 'reviews-booster' ? (
                    <ReviewsBooster />
                  ) : selectedModule.id === 'tiktok-hooks' ? (
                    <TiktokHooks />
                  ) : selectedModule.id === 'author-newsletter' ? (
                    <AuthorNewsletter />
                  ) : selectedModule.id === 'author-page-optimizer' ? (
                    <AuthorPageOptimizer />
                  ) : selectedModule.id === 'bookbub-ad-builder' ? (
                    <BookBubAdBuilder />
                  ) : selectedModule.id === 'arc-team-builder' ? (
                    <ArcTeamBuilder />
                  ) : selectedModule.id === 'manuscript-converter' ? (
                    <ManuscriptConverter />
                  ) : selectedModule.id === 'content-compliance' ? (
                    <ContentComplianceChecker />
                  ) : selectedModule.id === 'copyright-page' ? (
                    <CopyrightPageGenerator />
                  ) : selectedModule.id === 'royalties-simulator' ? (
                    <RoyaltiesSimulator />
                  ) : selectedModule.id === 'ku-niche-detector' ? (
                    <KuNicheDetector />
                  ) : selectedModule.id === 'launch-pricing' ? (
                    <LaunchPricingStrategy />
                  ) : selectedModule.id === 'social-calendar-30' ? (
                    <SocialCalendar30 />
                  ) : selectedModule.id === 'quote-visuals' ? (
                    <QuoteVisualsGenerator />
                  ) : selectedModule.id === 'media-kit' ? (
                    <MediaKitAuthor />
                  ) : selectedModule.id === 'goodreads-optimizer' ? (
                    <GoodreadsOptimizer />
                  ) : selectedModule.id === 'p23-universe-bible' ? (
                    <UniverseBibleCheck />
                  ) : selectedModule.id === 'p24-cliche-detector' ? (
                    <ClicheDetector />
                  ) : selectedModule.id === 'p25-tone-adapter' ? (
                    <ToneAdapter />
                  ) : selectedModule.id === 'p26-commercial-score' ? (
                    <CommercialScore />
                  ) : selectedModule.id === 'ebook-anti-plagiat' ? (
                    <EbookAntiPlagiat />
                  ) : (
                    <p className="text-[11px] text-joy-ink/40">
                      Module en préparation pour la V3 ({V3_PRICE}€ à vie). Visible uniquement par l'admin.
                    </p>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>


        {/* Calendar + Upcoming */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <Card className="rounded-2xl border-joy-ink/10">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" style={{ color: teal }} />
                  <h2 className="text-lg font-bold capitalize">
                    {format(cursor, 'MMMM yyyy', { locale: fr })}
                  </h2>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setCursor(addMonths(cursor, -1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full text-xs" onClick={() => setCursor(new Date())}>
                    Aujourd'hui
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setCursor(addMonths(cursor, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
                  <div key={d} className="text-[11px] uppercase font-semibold text-joy-ink/50 text-center py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const key = format(day, 'yyyy-MM-dd');
                  const items = launchesByDay[key] || [];
                  const inMonth = isSameMonth(day, cursor);
                  const isToday = isSameDay(day, new Date());
                  return (
                    <button
                      key={key}
                      onClick={() => items.length === 0 ? openCreate(day) : openEdit(items[0])}
                      className={`min-h-[78px] rounded-xl p-1.5 text-left border transition-all hover:scale-[1.02] ${
                        inMonth ? 'bg-white border-joy-ink/8' : 'bg-joy-ink/[0.02] border-transparent text-joy-ink/30'
                      } ${isToday ? 'ring-2 ring-offset-1' : ''}`}
                      style={isToday ? { boxShadow: `inset 0 0 0 2px ${accent}` } : undefined}
                    >
                      <div className="text-[11px] font-semibold mb-1">{format(day, 'd')}</div>
                      <div className="space-y-0.5">
                        {items.slice(0, 3).map((l) => (
                          <div
                            key={l.id}
                            onClick={(e) => { e.stopPropagation(); openEdit(l); }}
                            className="text-[10px] leading-tight rounded px-1 py-0.5 truncate text-white font-medium cursor-pointer hover:opacity-90"
                            style={{ background: l.color || TEAL }}
                            title={l.title}
                          >
                            {l.title}
                          </div>
                        ))}
                        {items.length > 3 && (
                          <div className="text-[10px] text-joy-ink/50">+{items.length - 3}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming list */}
          <Card className="rounded-2xl border-joy-ink/10 h-fit">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Prochains lancements</h3>
                <span className="text-xs text-joy-ink/50">{upcoming.length}</span>
              </div>
              {loading ? (
                <div className="text-xs text-joy-ink/50 py-4 text-center">Chargement…</div>
              ) : upcoming.length === 0 ? (
                <div className="text-xs text-joy-ink/50 py-6 text-center">
                  Aucun lancement prévu.
                  <br />
                  <button onClick={() => openCreate()} className="mt-2 text-[#008296] hover:text-[#FF9E2D] font-medium">
                    + Créer le premier
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcoming.map((l) => {
                    const days = differenceInCalendarDays(parseISO(l.launch_date), new Date());
                    return (
                      <button
                        key={l.id}
                        onClick={() => openEdit(l)}
                        className="w-full text-left rounded-xl p-2.5 bg-joy-cream/50 hover:bg-joy-cream border border-transparent hover:border-joy-teal/30 transition-all"
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className="mt-1 inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                            style={{ background: l.color || TEAL }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm truncate">{l.title}</div>
                            <div className="text-[11px] text-joy-ink/60">
                              {format(parseISO(l.launch_date), 'EEE d MMM', { locale: fr })}
                              {' · '}
                              {days === 0 ? "aujourd'hui" : days === 1 ? 'demain' : `J-${days}`}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Modal */}
      <Dialog open={!!draft} onOpenChange={(o) => { if (!o) { setDraft(null); setEditing(null); } }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Modifier le lancement' : 'Nouveau lancement'}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-joy-ink/70 mb-1 block">Titre</label>
                <Input
                  value={draft.title || ''}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="Lancement KDP, formation, série…"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-joy-ink/70 mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={draft.launch_date || ''}
                    onChange={(e) => setDraft({ ...draft, launch_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-joy-ink/70 mb-1 block">Statut</label>
                  <Select
                    value={draft.status || 'planned'}
                    onValueChange={(v) => setDraft({ ...draft, status: v as Launch['status'] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-joy-ink/70 mb-1 block">Couleur</label>
                <div className="flex gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setDraft({ ...draft, color: c })}
                      className={`h-7 w-7 rounded-full transition-transform ${draft.color === c ? 'scale-110 ring-2 ring-offset-2 ring-joy-ink/30' : 'hover:scale-110'}`}
                      style={{ background: c }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-joy-ink/70 mb-1 block">Notes</label>
                <Textarea
                  value={draft.notes || ''}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  placeholder="Détails, checklist, liens…"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:justify-between">
            {editing ? (
              <Button variant="ghost" size="sm" onClick={remove} className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5">
                <Trash2 className="h-4 w-4" /> Supprimer
              </Button>
            ) : <span />}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setDraft(null); setEditing(null); }}>Annuler</Button>
              <Button size="sm" onClick={save} style={{ background: TEAL, color: 'white' }} className="hover:opacity-90">
                Enregistrer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCockpitPage;
