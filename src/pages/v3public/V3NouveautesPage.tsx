import { Link } from 'react-router-dom';
import BackButton from '@/components/v3public/BackButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calculator, FileText, Image as ImageIcon, Wand2, Mic, Edit3,
  ShieldCheck, Sparkles, BookOpen, Video, Mail, Globe, Users,
  BarChart3, Award, Trophy, GraduationCap, PenTool, Bot,
  ScanSearch, Layers, Rocket, Palette
} from 'lucide-react';

type Access = 'offert' | 'debutant' | 'studio' | 'editeur';
type Status = 'live' | 'bientot';

interface Tool {
  title: string;
  desc: string;
  to?: string;
  icon: any;
  access: Access;
  status: Status;
  badge?: 'NEW' | 'OFFERT';
}

const ACCESS_META: Record<Access, { label: string; color: string }> = {
  offert:   { label: '🎁 Offert',      color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  debutant: { label: 'Débutant 9,99€', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  studio:   { label: 'Studio 12,99€',  color: 'bg-amber-50 text-amber-800 border-amber-200' },
  editeur:  { label: 'Éditeur 59€',    color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
};

const TOOLS: { section: string; items: Tool[] }[] = [
  {
    section: '🎁 Outils 100% gratuits (visiteurs & abonnés)',
    items: [
      { title: 'Calculateur royalties KDP', desc: 'Simulez vos gains ebook, broché et KU en 10 secondes.', to: '/v3/outils/royalties', icon: Calculator, access: 'offert', status: 'live', badge: 'OFFERT' },
      { title: 'Générateur description KDP', desc: 'Description HTML optimisée pour Amazon (3/jour gratuits).', to: '/v3/recherche?tab=desc', icon: FileText, access: 'offert', status: 'live', badge: 'OFFERT' },
      { title: 'Mockup 3D basique', desc: 'Prévisualisation 3D de votre couverture, 1 template gratuit.', to: '/v3/outils/mockup-3d', icon: ImageIcon, access: 'offert', status: 'live', badge: 'OFFERT' },
      { title: 'Vérif titre Amazon', desc: 'Le titre est-il déjà pris ? Analyse concurrentielle instantanée.', to: '/kdp-keywords?tab=spy', icon: ScanSearch, access: 'offert', status: 'live', badge: 'OFFERT' },
      { title: 'Communauté Q&R', desc: '220+ réponses libre d\'accès. Lecture gratuite.', to: '/communaute', icon: Users, access: 'offert', status: 'live', badge: 'OFFERT' },
    ],
  },
  {
    section: '🥉 Débutant 9,99€/mois',
    items: [
      { title: 'Correcteur ortho & style IA', desc: 'Corrige 10 chapitres/mois, style clair et fluide.', to: '/v3/outils/correcteur', icon: PenTool, access: 'debutant', status: 'live', badge: 'NEW' },
      { title: 'Éditeur WYSIWYG', desc: 'Retouchez chapitre par chapitre sans quitter EbookStudio.', to: '/v3/outils/editeur', icon: Edit3, access: 'debutant', status: 'live', badge: 'NEW' },
      { title: '3 mockups 3D / mois', desc: 'Livre en main, sur étagère, sur iPad.', to: '/v3/outils/mockup-3d', icon: ImageIcon, access: 'debutant', status: 'live', badge: 'NEW' },
      { title: 'Export EPUB', desc: 'Format universel liseuses (Kobo, Apple Books, etc.).', to: '/v3/outils/epub', icon: BookOpen, access: 'debutant', status: 'bientot', badge: 'NEW' },
    ],
  },
  {
    section: '🥈 Studio 12,99€/mois — Le plus recommandé',
    items: [
      { title: 'Humaniseur IA', desc: 'Rend vos textes 100% indétectables (GPTZero, Originality).', to: '/v3/outils/humanizer', icon: Wand2, access: 'studio', status: 'live', badge: 'NEW' },
      { title: 'Détecteur d\'IA', desc: 'Score de détection avant publication Amazon.', to: '/v3/outils/detection-ia', icon: ShieldCheck, access: 'studio', status: 'live', badge: 'NEW' },
      { title: 'Anti-plagiat', desc: 'Scan croisé de vos chapitres avant publication.', to: '/v3/outils/anti-plagiat', icon: ScanSearch, access: 'studio', status: 'bientot', badge: 'NEW' },
      { title: 'Audiobook TTS standard', desc: 'Voix FR naturelle, export MP3 chapitré.', to: '/v3/outils/audiobook', icon: Mic, access: 'studio', status: 'live', badge: 'NEW' },
      { title: 'Bannières A+ Content', desc: '7 modules image+texte pour votre fiche Amazon.', to: '/v3/recherche?tab=aplus', icon: Layers, access: 'studio', status: 'live', badge: 'NEW' },
      { title: 'Landing page auteur', desc: 'Site vitrine 1 page hébergé pour vendre vos livres.', to: '/v3/outils/landing-auteur', icon: Globe, access: 'studio', status: 'bientot', badge: 'NEW' },
      { title: '7 séquences email de lancement', desc: 'Prêtes à envoyer à votre mailing list.', to: '/v3/outils/sequences-emails', icon: Mail, access: 'studio', status: 'bientot', badge: 'NEW' },
      { title: 'Mockups 3D illimités', desc: 'Tous les templates, tous les formats.', to: '/v3/outils/mockup-3d', icon: ImageIcon, access: 'studio', status: 'live', badge: 'NEW' },
    ],
  },
  {
    section: '🥇 Éditeur 59€/mois — Maison d\'édition complète',
    items: [
      { title: 'Audiobook voix premium', desc: 'ElevenLabs qualité pro + export chapitré MP3.', to: '/v3/outils/audiobook?tier=premium', icon: Mic, access: 'editeur', status: 'live', badge: 'NEW' },
      { title: 'Book trailer vidéo', desc: '30-60s pour réseaux sociaux, IA générative.', to: '/v3/outils/book-trailer', icon: Video, access: 'editeur', status: 'live', badge: 'NEW' },
      { title: 'Reels/Shorts auto', desc: 'Extraits vidéo à partir de vos chapitres.', to: '/v3/outils/reels', icon: Video, access: 'editeur', status: 'bientot', badge: 'NEW' },
      { title: 'Suivi ventes KDP', desc: 'Importez le CSV Amazon → dashboard de royalties réelles.', to: '/v3/outils/suivi-ventes', icon: BarChart3, access: 'editeur', status: 'bientot', badge: 'NEW' },
      { title: 'ARC / Street team', desc: 'Recrutez vos lecteurs bêta et gérez les avis.', to: '/v3/outils/arc', icon: Trophy, access: 'editeur', status: 'bientot', badge: 'NEW' },
      { title: 'Cohérence personnages', desc: 'Agent IA qui vérifie descriptions & dialogues.', to: '/v3/outils/coherence-personnages', icon: Bot, access: 'editeur', status: 'live', badge: 'NEW' },
      { title: 'Logo auteur + carte de visite', desc: 'Identité visuelle pro pour vos livres.', to: '/v3/outils/logo-auteur', icon: Palette, access: 'editeur', status: 'bientot', badge: 'NEW' },
      { title: 'Académie vidéo complète', desc: '10-20 tutos + coaching live mensuel.', to: '/formation', icon: GraduationCap, access: 'editeur', status: 'live', badge: 'NEW' },
      { title: 'Export KDP Print-Ready', desc: 'PDF avec bleeds + gabarit auto selon nb pages.', to: '/v3/outils/print-ready', icon: Rocket, access: 'editeur', status: 'bientot', badge: 'NEW' },
    ],
  },
];

export default function V3NouveautesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <BackButton to="/v3" />

        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" /> Nouveautés & feuille de route V3
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#232F3E] mb-3">
            Tous les nouveaux outils EbookStudio V3
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ce que vous obtenez maintenant, plan par plan. Les <Badge className="mx-1 bg-emerald-600">OFFERT</Badge>
            sont accessibles à tous, les <Badge className="mx-1 bg-amber-500">NEW</Badge> sont inclus dans votre forfait.
          </p>
        </header>

        {TOOLS.map((section) => (
          <section key={section.section} className="mb-10">
            <h2 className="text-2xl font-bold text-[#232F3E] mb-4">{section.section}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((tool) => {
                const Icon = tool.icon;
                const meta = ACCESS_META[tool.access];
                const isBientot = tool.status === 'bientot';
                const CardBody = (
                  <Card className={`p-5 h-full transition-all border ${isBientot ? 'opacity-70' : 'hover:shadow-lg hover:-translate-y-0.5'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl bg-[#008296]/10 flex items-center justify-center text-[#008296]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {tool.badge && (
                          <Badge className={tool.badge === 'OFFERT' ? 'bg-emerald-600 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-500'}>
                            {tool.badge}
                          </Badge>
                        )}
                        {isBientot && <Badge variant="outline" className="text-xs">Bientôt</Badge>}
                      </div>
                    </div>
                    <h3 className="font-semibold text-[#232F3E] mb-1">{tool.title}</h3>
                    <p className="text-sm text-slate-600 mb-3">{tool.desc}</p>
                    <div className={`inline-block text-xs px-2 py-1 rounded border ${meta.color}`}>
                      {meta.label}
                    </div>
                  </Card>
                );
                return tool.to && !isBientot ? (
                  <Link key={tool.title} to={tool.to}>{CardBody}</Link>
                ) : (
                  <div key={tool.title}>{CardBody}</div>
                );
              })}
            </div>
          </section>
        ))}

        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-[#008296] to-emerald-700 text-white text-center">
          <Award className="h-8 w-8 mx-auto mb-3" />
          <h3 className="text-2xl font-bold mb-2">Vous n'avez pas encore le bon plan ?</h3>
          <p className="mb-4 opacity-90">Débloquez tout avec le forfait Éditeur 59€/mois — livres illimités, 30 agents IA, tous les outils Pro.</p>
          <Link to="/v3/forfaits" className="inline-block px-6 py-3 rounded-full bg-white text-[#008296] font-semibold hover:bg-yellow-100 transition">
            Voir les forfaits
          </Link>
        </div>
      </div>
    </div>
  );
}
