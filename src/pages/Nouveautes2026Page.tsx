import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Brain, Mic, BookOpen, Palette, Target, TrendingUp,
  Layers, Shield, PenTool, BarChart3, Globe, Music, Sparkles,
  ChevronRight, Star, Rocket, Award, CheckCircle2, ArrowRight, Play,
  BookMarked, Users, Search, FileText, Volume2, Wand2, Bot,
  Image, ShoppingCart, MessageSquare, Lightbulb, Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' }
  })
};

const categories = [
  {
    id: 'ai-engine',
    title: 'Moteur IA Gemini 3 Flash',
    subtitle: '21 fonctions migrées vers le modèle le plus rapide de Google',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-600',
    badge: 'RÉVOLUTION',
    features: [
      { icon: Zap, title: 'Directeur Éditorial P1', desc: '5 suggestions de titres avec scores KDP, analyse du marché et promesse centrale' },
      { icon: Target, title: 'Analyse de Marché P2', desc: 'Mots-clés, concurrence, pricing optimal et positionnement stratégique' },
      { icon: Layers, title: 'Architecte de Contenu P3', desc: 'Structure intelligente, création de personnages et plan détaillé' },
      { icon: PenTool, title: 'Rédaction Experte P4', desc: 'Génération de contenu professionnel avec style adapté au genre' },
      { icon: Wand2, title: 'Réécriture Naturelle P5', desc: 'Humanisation anti-détection IA pour un texte 100% naturel' },
      { icon: Shield, title: 'Qualité Éditoriale P6', desc: 'Contrôle qualité du manuscrit et corrections automatiques' },
      { icon: BookMarked, title: 'Packaging Éditorial P7', desc: 'Titre final, description marketing, biographie auteur' },
      { icon: Award, title: 'Diagnostic Final P8', desc: 'Score global de qualité et axes d\'amélioration' },
    ]
  },
  {
    id: 'ai-v2',
    title: 'Moteur IA V2 — Modules P9 à P14',
    subtitle: 'Intelligence éditoriale avancée pour une qualité premium',
    icon: Sparkles,
    gradient: 'from-amber-500 to-orange-600',
    badge: 'PREMIUM',
    features: [
      { icon: Brain, title: 'Mémoire Éditoriale P9', desc: 'Contexte persistant entre les chapitres pour une cohérence parfaite' },
      { icon: Layers, title: 'Cohérence Chapitres P10', desc: 'Alignement narratif automatique entre tous les chapitres' },
      { icon: Bot, title: 'Auto-Critique IA P11', desc: 'L\'IA évalue et améliore son propre travail' },
      { icon: TrendingUp, title: 'Boucle Itérative P12', desc: 'Amélioration multi-passes pour un texte toujours meilleur' },
      { icon: PenTool, title: 'Signature Stylistique P13', desc: 'Création d\'une voix unique et reconnaissable' },
      { icon: Star, title: 'Verdict Ultime P14', desc: 'Évaluation finale et validation avant publication' },
    ]
  },
  {
    id: 'audiobooks',
    title: 'Livres Audio Professionnels',
    subtitle: 'Studio audio complet avec voix neurales Azure',
    icon: Mic,
    gradient: 'from-cyan-500 to-blue-600',
    badge: 'NOUVEAU',
    features: [
      { icon: Volume2, title: 'Voix Neurales Azure', desc: 'Denise, Henri, Celeste — des voix françaises naturelles et expressives' },
      { icon: Music, title: 'Jingles Automatiques', desc: 'Introduction avec cloche cristalline et transitions entre chapitres' },
      { icon: FileText, title: 'Découpage Intelligent', desc: 'Chunking au niveau des phrases pour un audio sans coupures' },
      { icon: Sparkles, title: 'Nettoyage Audio', desc: 'Conversion des abréviations, suppression emojis, ponctuation optimisée' },
      { icon: Clock, title: 'Export MP3 & ZIP', desc: 'Export complet ou chapitré pour toutes les plateformes' },
    ]
  },
  {
    id: 'generators',
    title: 'Générateurs Spécialisés',
    subtitle: '7 nouveaux types de livres en un clic',
    icon: BookOpen,
    gradient: 'from-emerald-500 to-green-600',
    badge: 'x7',
    features: [
      { icon: BookOpen, title: 'Livre Complet IA', desc: 'Workflow 14 étapes du titre à l\'export' },
      { icon: Palette, title: 'Bandes Dessinées', desc: 'Scénario, dialogues et descriptions de planches' },
      { icon: Image, title: 'Livres de Coloriage', desc: 'Génération de pages à colorier par thème' },
      { icon: Globe, title: 'Documentaires', desc: 'Recherche, structure et rédaction factuelle' },
      { icon: FileText, title: 'Planners & Journaux', desc: 'Agendas, trackers et journaux thématiques' },
      { icon: Lightbulb, title: 'Encyclopédies', desc: 'Organisation et rédaction encyclopédique' },
      { icon: Globe, title: 'Atlas', desc: 'Création d\'atlas géographiques et thématiques' },
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing & KDP Intégrés',
    subtitle: 'Outils de vente et référencement Amazon',
    icon: TrendingUp,
    gradient: 'from-rose-500 to-pink-600',
    badge: 'BUSINESS',
    features: [
      { icon: Search, title: 'Recherche KDP', desc: 'Analyse de niches, mots-clés et opportunités Amazon' },
      { icon: ShoppingCart, title: 'Simulateur Amazon', desc: 'Prévisualisation de votre fiche produit' },
      { icon: BarChart3, title: 'Amazon Ads', desc: 'Planification de campagnes publicitaires' },
      { icon: FileText, title: 'Générateur SEO', desc: 'Articles optimisés pour le trafic organique' },
      { icon: MessageSquare, title: 'Posts Réseaux Sociaux', desc: 'Contenu marketing multi-plateforme' },
      { icon: Shield, title: 'Anti-Plagiat', desc: 'Vérification d\'originalité du contenu' },
    ]
  },
  {
    id: 'tech',
    title: 'Améliorations Techniques',
    subtitle: 'Robustesse, performance et nouvelles capacités',
    icon: Rocket,
    gradient: 'from-slate-500 to-gray-600',
    badge: 'TECH',
    features: [
      { icon: Layers, title: 'Séries Multi-Tomes', desc: 'Bible de série, personnages persistants et cohérence narrative' },
      { icon: Users, title: 'CRM Intégré', desc: 'Gestion des contacts et suivi des prospects' },
      { icon: FileText, title: 'Import Word/URL', desc: 'Convertissez vos documents existants en ebooks' },
      { icon: Image, title: 'Couvertures Imagen 3', desc: 'Génération de couvertures IA de qualité professionnelle' },
      { icon: Globe, title: 'BlogCluster.com', desc: 'Nouveau site vitrine avec articles et ressources KDP (en construction)' },
    ]
  },
];

const stats = [
  { value: '21', label: 'Fonctions IA Gemini' },
  { value: '7', label: 'Générateurs Spécialisés' },
  { value: '14', label: 'Modules Workflow Pro' },
  { value: '0,30€', label: 'Coût par ebook' },
];

export default function Nouveautes2026Page() {
  return (
    <>
      <Helmet>
        <title>Nouveautés 2026 — EbookStudio Pro | Toutes les fonctionnalités</title>
        <meta name="description" content="Découvrez toutes les nouveautés 2026 d'EbookStudio Pro : moteur IA Gemini 3 Flash, livres audio professionnels, 7 générateurs spécialisés et outils marketing KDP intégrés." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <Link to="/offres" className="text-lg font-bold text-primary">
              ← EbookStudio Pro
            </Link>
            <Badge variant="outline" className="border-primary/50 text-primary">
              <Sparkles className="w-3 h-3 mr-1" /> Mise à jour 2026
            </Badge>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.15) 0%, transparent 50%)' }} />
          
          <div className="relative mx-auto max-w-5xl px-4 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 text-sm px-4 py-1.5">
                <Rocket className="w-4 h-4 mr-2" /> Version 2026 — La plus grosse mise à jour
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                Toutes les{' '}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Nouveautés 2026
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                Moteur IA Gemini 3 Flash, livres audio professionnels, 7 générateurs spécialisés, 
                outils marketing KDP et bien plus. La machine éditoriale la plus complète du marché.
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="rounded-xl border border-border/50 bg-card/50 backdrop-blur p-4"
                >
                  <div className="text-3xl md:text-4xl font-black text-primary">{s.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Video */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 max-w-4xl mx-auto"
            >
              <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/50 shadow-xl shadow-primary/5">
                <video
                  controls
                  preload="metadata"
                  poster=""
                  className="w-full aspect-video"
                >
                  <source src="/videos/nouveautes-2026.mp4" type="video/mp4" />
                </video>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                <Play className="w-4 h-4 inline mr-1" /> Toutes les nouveautés EbookStudio Pro 2026 en vidéo
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 pb-20 space-y-16">
          {categories.map((cat, catIdx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-lg`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl md:text-3xl font-bold">{cat.title}</h2>
                    <Badge variant="secondary" className="text-xs">{cat.badge}</Badge>
                  </div>
                  <p className="text-muted-foreground mt-1">{cat.subtitle}</p>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 p-5 h-full">
                      <div className="flex gap-4">
                        <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} text-white/90 group-hover:scale-110 transition-transform`}>
                          <f.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </section>

        {/* BlogCluster CTA */}
        <section className="border-t border-border/40 bg-card/30">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/30">
                <Globe className="w-3 h-3 mr-1" /> En construction
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                BlogCluster.com — Le Hub des Auteurs KDP
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Un nouveau site qui retracera tous nos livres (ou presque), avec de nombreux articles, 
                des ressources KDP exclusives et des guides pratiques pour maximiser vos ventes sur Amazon.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/offres">
                    Découvrir EbookStudio Pro <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link to="/demo">
                    Voir la démo gratuite <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing reminder */}
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center">
            <h2 className="text-2xl font-bold mb-3">Tout cet arsenal — Accès à vie</h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-muted-foreground line-through text-lg">247€</span>
              <span className="text-5xl font-black text-primary">67€</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">ou 3×23€ · ou 5×14€</p>
            <p className="text-sm text-muted-foreground mb-8">
              <CheckCircle2 className="w-4 h-4 inline mr-1 text-accent" />
              30 jours satisfait ou remboursé · Clé Gemini gratuite · ~0,30€ par ebook
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/offres">
                Accéder maintenant <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} EbookStudio Pro — Tous droits réservés</p>
        </footer>
      </div>
    </>
  );
}
