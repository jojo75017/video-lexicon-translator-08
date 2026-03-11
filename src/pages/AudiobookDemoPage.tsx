import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, Volume2, Headphones, Code, Copy, Check, 
  SkipBack, SkipForward, BookOpen, Clock, Star, Users, Download, 
  ChevronDown, ChevronUp, Mic2, Sparkles, Link2, Calendar, Globe, 
  FileAudio, Building2, Tag, ShoppingCart, CreditCard, Shield, HelpCircle, Library,
  Zap, Lock, RefreshCw, MessageCircle, Timer, Heart, Award, CheckCircle2,
  Layers, BookHeart, Wand2, AudioLines
} from 'lucide-react';
import { toast } from 'sonner';
import { getRandomReviews } from '@/utils/reviewPool';
import { motion } from 'framer-motion';

const DEMO_DATA = {
  title: "Le Cow-Boy le Plus Rapide",
  subtitle: "Une aventure de Far West drôle, rythmée et pleine de rebondissements",
  author_name: "EbookStudio",
  voice_name: "Brigitte (IA Premium)",
  description: "Plongez dans une aventure hilarante au cœur du Far West ! Billy le cow-boy rêve de devenir le plus rapide de l'Ouest, mais entre ses bottes trop grandes, son cheval têtu et un bandit pas si méchant que ça, rien ne se passe comme prévu. Une histoire drôle, rythmée et pleine de rebondissements qui captivera les jeunes lecteurs et les fera rire du début à la fin. Idéal pour les trajets en voiture ou le rituel du coucher !",
  cover_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
  play_count: 342,
  duration_seconds: 1500,
  price: 4.99,
  paypal_link: "https://paypal.me/example",
  stripe_link: "https://buy.stripe.com/example",
  created_at: "2026-03-01T10:00:00Z",
  slug: "cow-boy-le-plus-rapide",
  genre: "Aventure Western Humoristique",
  target_audience: "Enfants de 6 à 10 ans",
  chapters: 8,
};

const CHAPTERS = [
  { num: 1, title: "L'Arrivée à Cactus Valley", duration: "3:12" },
  { num: 2, title: "Tornado, le Poney Rebelle", duration: "2:58" },
  { num: 3, title: "Le Défi du Grand Cactus", duration: "3:45" },
  { num: 4, title: "L'Embuscade du Bandit Gentil", duration: "4:01" },
  { num: 5, title: "La Course au Trésor", duration: "3:33" },
  { num: 6, title: "Tempête de Sable et Ruse", duration: "3:20" },
  { num: 7, title: "Le Duel au Soleil Couchant", duration: "4:15" },
  { num: 8, title: "Billy le Héros de Cactus Valley", duration: "3:06" },
];

const MetaRow = ({ icon, label, value, dark = false }: { icon: React.ReactNode; label: string; value: string; dark?: boolean }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className={`text-[11px] uppercase tracking-wider mb-0.5 ${dark ? 'text-gray-400' : 'text-white/35'}`}>{label}</p>
      <p className={`text-sm font-medium ${dark ? 'text-gray-700' : 'text-white/80'}`}>{value}</p>
    </div>
  </div>
);

const AudiobookDemoPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(47);
  const [showEmbed, setShowEmbed] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1);

  const audiobook = DEMO_DATA;
  const duration = 180;

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = Math.floor(s % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}` : `${m}:${sec.toString().padStart(2, '0')}`;
  };
  const formatDuration = (s: number | null) => {
    if (!s) return 'Durée inconnue';
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h} h et ${m} min` : `${m} min`;
  };

  const descriptionShort = audiobook.description?.slice(0, 300);
  const hasLongDesc = audiobook.description && audiobook.description.length > 300;
  const createdDate = new Date(audiobook.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const embedCode = `<iframe src="${window.location.origin}/audiobook-embed/${audiobook.slug}" width="100%" height="200" frameborder="0" allow="autoplay" style="border-radius: 16px;"></iframe>`;
  const copyEmbed = () => { navigator.clipboard.writeText(embedCode); setCopied(true); toast.success('Code embed copié !'); setTimeout(() => setCopied(false), 2000); };
  const shareUrl = () => { navigator.clipboard.writeText(window.location.href); toast.success('Lien copié !'); };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) { setIsPlaying(false); return prev; }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const [urgencyEnd] = useState(() => Date.now() + 2.5 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 30, s: 0 });
  useEffect(() => {
    const tick = setInterval(() => {
      const diff = Math.max(0, urgencyEnd - Date.now());
      setTimeLeft({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
      if (diff <= 0) clearInterval(tick);
    }, 1000);
    return () => clearInterval(tick);
  }, [urgencyEnd]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      
      {/* Demo banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-black text-center py-2.5 text-sm font-bold tracking-wide">
        🎯 PAGE DÉMO — Voici à quoi ressemble la fiche produit de vos audiobooks
      </div>

      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-red-900/80 via-red-700/80 to-red-900/80 border-b border-red-500/20 text-white text-center py-3 px-4">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Timer className="w-5 h-5 animate-pulse text-red-300" />
          <span className="font-semibold text-sm">🔥 Offre de lancement — Prix réduit pendant encore</span>
          <div className="flex gap-1.5">
            {[String(timeLeft.h).padStart(2, '0'), String(timeLeft.m).padStart(2, '0'), String(timeLeft.s).padStart(2, '0')].map((v, i) => (
              <div key={i} className="flex gap-1.5 items-center">
                {i > 0 && <span className="font-bold text-lg text-red-300">:</span>}
                <span className="bg-black/40 px-2.5 py-1 rounded-lg font-mono font-bold text-base min-w-[2.5rem] text-center text-white">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] via-[#0d1117] to-[#0a1628]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-14">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
            
            {/* LEFT */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1 min-w-0">
              {/* Category badge */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 mb-4 px-4 py-1.5 text-xs font-semibold tracking-wide">
                  <AudioLines className="w-3.5 h-3.5 mr-1.5" />
                  LIVRE AUDIO PREMIUM
                </Badge>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 leading-[1.1] tracking-tight bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent"
              >
                {audiobook.title}
              </motion.h1>
              
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/40 text-lg md:text-xl italic mb-5 max-w-lg">
                {audiobook.subtitle}
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center gap-4 justify-center lg:justify-start mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-white/50 text-sm">De</span>
                  <span className="text-amber-400 font-semibold">{audiobook.author_name}</span>
                </div>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/50 text-sm">Lu par</span>
                  <span className="text-amber-400 font-semibold">{audiobook.voice_name}</span>
                </div>
              </motion.div>

              {/* Rating */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex items-center gap-3 justify-center lg:justify-start mb-7">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-amber-400/40 fill-amber-400/40'}`} />
                  ))}
                </div>
                <span className="text-white font-bold text-lg">4.7</span>
                <span className="text-white/30">|</span>
                <span className="text-white/50 text-sm">{audiobook.play_count} écoutes</span>
                <span className="text-white/30">|</span>
                <span className="text-white/50 text-sm">{audiobook.chapters} chapitres</span>
              </motion.div>

              {/* Excerpt player */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm rounded-2xl p-5 md:p-6 mb-7"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Headphones className="w-5 h-5 text-amber-400" />
                  <h3 className="text-white/90 font-semibold text-base">Écouter l'extrait gratuit</h3>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] ml-auto">GRATUIT</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
                  >
                    {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 ml-0.5 text-white" />}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <Slider value={[currentTime]} max={duration} step={1} onValueChange={(v) => setCurrentTime(v[0])} className="cursor-pointer" />
                    <div className="flex justify-between text-[11px] text-white/30 mt-1.5 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-white/25 text-xs mt-3 italic">♫ « Le soleil tapait fort sur la petite ville de Cactus Valley... »</p>
              </motion.div>

              {/* Price */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-baseline gap-3 justify-center lg:justify-start mb-5">
                <span className="text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{audiobook.price.toFixed(2)} €</span>
                <span className="text-white/30 text-lg line-through">{(audiobook.price * 1.5).toFixed(2)} €</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-bold">-33%</Badge>
              </motion.div>

              {/* CTA */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-5">
                <Button 
                  onClick={() => toast.info('Démo : redirection vers Stripe...')}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 px-8 h-13 rounded-full shadow-xl shadow-amber-500/25 text-base transition-all hover:scale-[1.02]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Acheter maintenant — {audiobook.price.toFixed(2)} €
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => toast.info('Démo : redirection vers PayPal...')}
                  className="gap-2 border-blue-400/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 rounded-full h-13 font-semibold"
                >
                  <CreditCard className="h-4 w-4" />
                  Payer via PayPal
                </Button>
              </motion.div>

              {/* Trust row */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {[
                  { icon: Lock, text: "Paiement sécurisé SSL", color: "text-emerald-400" },
                  { icon: Zap, text: "Téléchargement immédiat", color: "text-amber-400" },
                  { icon: RefreshCw, text: "Remboursé sous 30 jours", color: "text-blue-400" },
                  { icon: MessageCircle, text: "Support réactif 7j/7", color: "text-purple-400" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5">
                    <t.icon className={`w-4 h-4 ${t.color} shrink-0`} />
                    <span className="text-[11px] text-white/50 font-medium">{t.text}</span>
                  </div>
                ))}
              </div>

              {/* Share */}
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <button onClick={shareUrl} className="text-white/25 hover:text-white/60 transition-colors"><Link2 className="w-5 h-5" /></button>
                <button onClick={() => setShowEmbed(!showEmbed)} className="text-white/25 hover:text-white/60 transition-colors"><Code className="w-5 h-5" /></button>
                <button onClick={() => toast.success('Démo: HTML téléchargé !')} className="text-white/25 hover:text-white/60 transition-colors"><Download className="w-5 h-5" /></button>
              </div>

              {showEmbed && (
                <div className="mt-4 bg-black/40 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-2 font-medium">Code d'intégration :</p>
                  <div className="relative">
                    <pre className="bg-black/50 rounded-lg p-3 text-xs text-white/30 overflow-x-auto font-mono">{embedCode}</pre>
                    <Button size="sm" onClick={copyEmbed} className="absolute top-1.5 right-1.5 gap-1.5 bg-amber-500/80 hover:bg-amber-500 text-white rounded-lg text-xs">
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copié' : 'Copier'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Cover */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="shrink-0 order-1 lg:order-2 flex justify-center lg:justify-end"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 transition-transform group-hover:scale-[1.02]">
                  <img src={audiobook.cover_url} alt={audiobook.title} className="w-full h-full object-cover" />
                  <button onClick={() => setIsPlaying(!isPlaying)} className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all">
                    <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl backdrop-blur-sm">
                      {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 ml-1 text-white" />}
                    </div>
                  </button>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg rotate-[-3deg]">
                  EbookStudio
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===== WHAT YOU GET ===== */}
      <div className="bg-gradient-to-b from-[#0d1117] to-[#0f1923] border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
            Ce que vous obtenez
          </h2>
          <p className="text-white/40 text-center mb-10 max-w-xl mx-auto">
            Un livre audio complet, produit avec une technologie vocale de pointe, prêt à écouter sur tous vos appareils.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: AudioLines, title: "Audio HD Premium", desc: "Qualité studio 320kbps, voix IA ultra-naturelle", color: "from-amber-500 to-orange-500" },
              { icon: BookOpen, title: `${audiobook.chapters} Chapitres`, desc: "Histoire complète structurée et captivante", color: "from-blue-500 to-cyan-500" },
              { icon: Clock, title: formatDuration(audiobook.duration_seconds), desc: "Durée idéale pour les trajets ou le coucher", color: "from-purple-500 to-pink-500" },
              { icon: Download, title: "Téléchargement", desc: "MP3 disponible immédiatement après achat", color: "from-emerald-500 to-teal-500" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center hover:bg-white/[0.05] transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white/90 text-sm mb-1">{item.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CONTENT AREA ===== */}
      <div className="bg-[#0A0A0F]">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="flex flex-col lg:flex-row gap-10">
            
            <div className="flex-1 min-w-0 space-y-10">
              
              {/* Synopsis */}
              <div>
                <h2 className="text-2xl font-bold text-white/90 mb-4 flex items-center gap-2">
                  <BookHeart className="w-6 h-6 text-amber-400" />
                  À propos de cette histoire
                </h2>
                <p className="text-white/50 leading-relaxed text-[15px]">
                  {showFullDesc ? audiobook.description : descriptionShort}
                  {hasLongDesc && !showFullDesc && '...'}
                </p>
                {hasLongDesc && (
                  <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-amber-400 text-sm mt-3 flex items-center gap-1 hover:text-amber-300 transition-colors font-medium">
                    {showFullDesc ? <><ChevronUp className="w-4 h-4" /> Afficher moins</> : <><ChevronDown className="w-4 h-4" /> Lire la suite</>}
                  </button>
                )}
                
                {/* Long description/pitch */}
                <div className="mt-6 space-y-4 text-white/45 text-sm leading-relaxed">
                  <p>
                    <strong className="text-white/70">Billy a 10 ans</strong> et un rêve aussi grand que le ciel du Texas : devenir le cow-boy le plus rapide de tout l'Ouest sauvage. 
                    Armé d'un chapeau trois fois trop grand et d'une paire de bottes qui font « flouich-flouich » à chaque pas, il est prêt à conquérir Cactus Valley.
                  </p>
                  <p>
                    Mais voilà : son fidèle destrier <strong className="text-white/70">Tornado</strong> préfère les siestes aux galopades, le bandit du coin est en réalité 
                    un ancien professeur de piano, et le shérif local a tellement la flemme qu'il dort sur son rocking-chair à longueur de journée.
                  </p>
                  <p>
                    À travers <strong className="text-white/70">8 chapitres truffés de gags</strong>, de rebondissements et de moments tendres, cette aventure 
                    emmène les jeunes auditeurs dans un Far West décalé où le courage, l'amitié et la persévérance triomphent toujours — même quand tout part de travers.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {['📖 Livre Audio', `🤠 ${audiobook.genre}`, '🎙️ Audio IA Premium', `🗣️ ${audiobook.voice_name}`, '👶 6-10 ans', '⭐ Best-seller'].map((tag, i) => (
                  <Badge key={i} variant="outline" className="border-white/10 text-white/50 bg-white/[0.03] hover:bg-white/[0.06] rounded-full px-4 py-1.5 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Chapter list */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white/90 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  Table des chapitres
                </h3>
                <div className="space-y-1">
                  {CHAPTERS.map(ch => (
                    <button 
                      key={ch.num}
                      onClick={() => { setActiveChapter(ch.num); toast.info(`Démo : lecture du chapitre ${ch.num}`); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeChapter === ch.num 
                          ? 'bg-amber-500/10 border border-amber-500/20' 
                          : 'hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                      <span className={`text-xs font-mono w-6 text-center ${activeChapter === ch.num ? 'text-amber-400' : 'text-white/25'}`}>
                        {ch.num}
                      </span>
                      <span className={`flex-1 text-sm font-medium ${activeChapter === ch.num ? 'text-amber-300' : 'text-white/60'}`}>
                        {ch.title}
                      </span>
                      <span className="text-xs text-white/25 font-mono">{ch.duration}</span>
                      {activeChapter === ch.num && <AudioLines className="w-4 h-4 text-amber-400 animate-pulse" />}
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/30">
                  <span>Durée totale estimée</span>
                  <span className="font-mono font-semibold text-white/50">{formatDuration(audiobook.duration_seconds)}</span>
                </div>
              </div>

              {/* Target audience */}
              <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Pour qui est ce livre audio ?
                </h3>
                <ul className="space-y-3 text-white/50 text-sm">
                  {[
                    `${audiobook.target_audience} — curieux, rêveurs et amateurs de westerns rigolos`,
                    "Parents cherchant des histoires captivantes pour le coucher ou les longs trajets en voiture",
                    "Enseignants souhaitant des supports audio ludiques et éducatifs pour la classe",
                    "Amateurs d'aventures western drôles, tendres et familiales",
                    "Toute personne qui veut offrir un moment d'évasion audio à un enfant"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Player */}
              {showFullPlayer && (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                  <h3 className="text-white/90 font-semibold text-lg mb-5 flex items-center gap-2">
                    <FileAudio className="w-5 h-5 text-amber-400" />
                    Lecteur complet
                  </h3>
                  <div className="mb-6">
                    <Slider value={[currentTime]} max={duration} step={1} onValueChange={(v) => setCurrentTime(v[0])} className="cursor-pointer" />
                    <div className="flex justify-between text-xs text-white/30 mt-2 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <Button variant="ghost" size="icon" className="text-white/30 hover:text-white/70 hover:bg-white/5 h-12 w-12 rounded-full">
                      <div className="relative"><SkipBack className="h-5 w-5" /><span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px]">15s</span></div>
                    </Button>
                    <Button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95">
                      {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 ml-0.5 text-white" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white/30 hover:text-white/70 hover:bg-white/5 h-12 w-12 rounded-full">
                      <div className="relative"><SkipForward className="h-5 w-5" /><span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px]">30s</span></div>
                    </Button>
                  </div>
                </div>
              )}
              {!showFullPlayer && (
                <Button variant="outline" onClick={() => setShowFullPlayer(true)} className="gap-2 border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 rounded-full">
                  <Headphones className="w-4 h-4" />
                  Ouvrir le lecteur complet
                </Button>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-5 sticky top-6">
                <h3 className="text-white/80 font-semibold text-base border-b border-white/[0.06] pb-3 flex items-center gap-2">
                  📋 Informations produit
                </h3>
                <MetaRow icon={<CreditCard className="w-4 h-4 text-emerald-400" />} label="Prix" value={`${audiobook.price.toFixed(2)} €`} />
                <MetaRow icon={<FileAudio className="w-4 h-4 text-amber-400" />} label="Format" value="Livre audio MP3 HD" />
                <MetaRow icon={<Tag className="w-4 h-4 text-orange-400" />} label="Genre" value={audiobook.genre} />
                <MetaRow icon={<Users className="w-4 h-4 text-pink-400" />} label="Public" value={audiobook.target_audience} />
                <MetaRow icon={<Globe className="w-4 h-4 text-green-400" />} label="Langue" value="Français" />
                <MetaRow icon={<Clock className="w-4 h-4 text-cyan-400" />} label="Durée estimée" value={formatDuration(audiobook.duration_seconds)} />
                <MetaRow icon={<BookOpen className="w-4 h-4 text-blue-400" />} label="Chapitres" value={`${audiobook.chapters}`} />
                <MetaRow icon={<Download className="w-4 h-4 text-emerald-400" />} label="Accès" value="Téléchargement immédiat" />
                <MetaRow icon={<Mic2 className="w-4 h-4 text-purple-400" />} label="Narrateur" value={audiobook.voice_name} />
                <MetaRow icon={<Calendar className="w-4 h-4 text-blue-400" />} label="Publication" value={createdDate} />
                <MetaRow icon={<Building2 className="w-4 h-4 text-pink-400" />} label="Éditeur" value="EbookStudio" />
                <MetaRow icon={<Headphones className="w-4 h-4 text-amber-400" />} label="Écoutes" value={`${audiobook.play_count}`} />
                
                {/* Mini CTA in sidebar */}
                <div className="pt-3 border-t border-white/[0.06]">
                  <Button 
                    onClick={() => toast.info('Démo : redirection vers Stripe...')}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 h-11 rounded-xl shadow-lg shadow-amber-500/20"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Acheter — {audiobook.price.toFixed(2)} €
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== TEXT EXCERPT ===== */}
          <div className="mt-14 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7">
            <h2 className="text-xl font-bold text-white/90 mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Extrait du Chapitre 1
            </h2>
            <blockquote className="text-white/40 text-[15px] leading-[1.8] italic border-l-2 border-amber-500/40 pl-6 space-y-4">
              <p>« Le soleil tapait fort sur la petite ville de Cactus Valley. Tellement fort que même les cactus avaient l'air de transpirer. Au milieu de la rue principale — qui était aussi la seule rue — un garçon de dix ans se tenait debout, les pouces glissés dans les passants de sa ceinture, un chapeau de cow-boy beaucoup trop grand sur la tête. »</p>
              <p>« — Je suis Billy le Kid… enfin, Billy tout court, marmonna-t-il en plissant les yeux comme il avait vu faire dans les films. Et aujourd'hui, je deviens le cow-boy le plus rapide de tout l'Ouest ! »</p>
              <p>« Son cheval, Tornado — qui était en réalité un poney assez grassouillet — leva à peine la tête de son seau d'avoine et souffla un bruit qui ressemblait beaucoup à un rire. Billy fronça les sourcils. »</p>
              <p>« — On ne rigole pas, Tornado. C'est du sérieux. Aujourd'hui, c'est le grand jour. Le jour où tout change. »</p>
              <p>« Tornado replongea le museau dans l'avoine. Visiblement, le poney n'était pas du même avis. »</p>
            </blockquote>
            <p className="text-amber-400/50 text-xs mt-5 font-medium">— Extrait du Chapitre 1 : « L'Arrivée à Cactus Valley »</p>
          </div>

          {/* ===== HOW IT'S MADE ===== */}
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              Comment est créé ce livre audio ?
            </h2>
            <p className="text-white/35 text-center mb-10 max-w-lg mx-auto text-sm">
              Une production 100% automatisée grâce à la technologie EbookStudio
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Wand2, title: "1. Rédaction IA", desc: "Le scénario et les dialogues sont générés par notre moteur d'écriture créative Gemini 3 Flash, calibré pour le jeune public.", color: "from-violet-500 to-purple-500" },
                { icon: Mic2, title: "2. Narration vocale", desc: "La voix de Brigitte, synthétisée par Azure Neural Speech, donne vie au texte avec des intonations naturelles et expressives.", color: "from-amber-500 to-orange-500" },
                { icon: Sparkles, title: "3. Production finale", desc: "Mastering audio automatique, chapitrage, métadonnées et couverture — prêt à vendre sur toutes les plateformes.", color: "from-emerald-500 to-teal-500" },
              ].map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-white/80 mb-2">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ===== REVIEWS ===== */}
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-white/90 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              Avis des auditeurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getRandomReviews(audiobook.slug || audiobook.title).map((review, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
                      {review.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white/80">{review.name}</p>
                      <p className="text-[11px] text-white/30">A écouté ce titre</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= review.stars ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
                    ))}
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">{review.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ===== GUARANTEE ===== */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-14 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/15 rounded-2xl p-7 flex flex-col sm:flex-row items-center gap-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-emerald-300 mb-2">Garantie Satisfait ou Remboursé — 30 jours</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Vous n'êtes pas satisfait ? Nous vous remboursons intégralement, sans conditions et sans questions. 
                Pas de formulaire compliqué, pas de justification — un simple email suffit. Votre satisfaction est notre priorité absolue.
              </p>
            </div>
          </motion.div>

          {/* ===== FAQ ===== */}
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-white/90 mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-400" />
              Questions fréquentes
            </h2>
            <div className="space-y-2">
              {[
                { q: "Dans quel format est le livre audio ?", a: "Le livre audio est au format MP3 haute définition (320kbps), compatible avec tous les appareils : smartphone, tablette, ordinateur, enceinte connectée, lecteur MP3. Pas besoin d'application spéciale." },
                { q: "Comment accéder à mon achat ?", a: "Après le paiement, vous recevrez un lien de téléchargement par email dans les 2 minutes. Vous pourrez écouter votre livre audio immédiatement sur n'importe quel appareil. Le fichier est à vous pour toujours." },
                { q: "La voix est-elle naturelle ?", a: "Absolument. Nous utilisons Azure Neural Speech, la technologie de synthèse vocale la plus avancée au monde. La narration est fluide, expressive, avec des intonations naturelles qui font oublier qu'il s'agit d'une voix de synthèse." },
                { q: "Puis-je être remboursé ?", a: "Oui, vous bénéficiez d'une garantie satisfait ou remboursé de 30 jours. Un simple email à notre support et vous êtes remboursé sous 48h, sans aucune condition." },
                { q: "Ce livre est-il adapté aux enfants ?", a: "Oui ! L'histoire est spécialement conçue pour les enfants de 6 à 10 ans. Le vocabulaire est adapté, l'humour est bienveillant et les valeurs véhiculées (courage, amitié, persévérance) sont positives." },
                { q: "Comment ce livre audio a-t-il été créé ?", a: "Le texte a été rédigé par notre moteur d'écriture créative IA (Gemini 3 Flash) puis narré par une voix de synthèse premium (Azure Neural Speech). Le résultat est un livre audio de qualité professionnelle produit en quelques heures." },
              ].map((faq, i) => (
                <FaqItem key={i} question={faq.q} answer={faq.a} defaultOpen={i === 0} />
              ))}
            </div>
          </div>

          {/* ===== SIMILAR ===== */}
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-white/90 mb-6 flex items-center gap-2">
              <Library className="w-6 h-6 text-amber-400" />
              Vous aimerez aussi
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[
                { title: "Copywriting Avancé", price: "9.99", genre: "Business" },
                { title: "Mindset Entrepreneur", price: "11.99", genre: "Dev. Perso" },
                { title: "SEO Masterclass", price: "14.99", genre: "Marketing" },
                { title: "Réseaux Sociaux Pro", price: "8.99", genre: "Digital" },
              ].map((book, i) => (
                <div key={i} className="shrink-0 w-44 bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:-translate-y-1 transition-transform cursor-pointer group">
                  <div className="w-44 h-44 bg-gradient-to-br from-white/[0.02] to-white/[0.05] flex items-center justify-center">
                    <Headphones className="w-10 h-10 text-white/10 group-hover:text-amber-400/40 transition-colors" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-white/70 truncate">{book.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs font-bold text-amber-400">{book.price} €</p>
                      <Badge className="text-[9px] bg-white/5 text-white/30 border-white/10">{book.genre}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== CTA FINAL ===== */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-14 text-center bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/15 rounded-2xl p-10"
          >
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              Prêt à embarquer Billy dans cette aventure ?
            </h3>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
              Téléchargez l'audiobook dès maintenant et offrez un moment magique à un enfant. 
              Satisfait ou remboursé sous 30 jours.
            </p>
            <Button 
              onClick={() => toast.info('Démo : redirection vers Stripe...')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 px-10 h-13 rounded-full shadow-xl shadow-amber-500/25 text-base transition-all hover:scale-[1.02]"
            >
              <ShoppingCart className="h-5 w-5" />
              Acheter maintenant — {audiobook.price.toFixed(2)} €
            </Button>
          </motion.div>

          {/* Ebook link */}
          <div className="mt-14 text-center bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
            <h3 className="text-white/80 text-lg font-bold mb-2">📚 Découvrez aussi nos ebooks</h3>
            <p className="text-white/35 text-sm mb-4">Retrouvez toute notre collection de livres numériques sur notre boutique</p>
            <a href="https://ebookcluster.com" target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-amber-500/20 transition-all hover:scale-105">
              <Globe className="w-5 h-5" />
              Visiter ebookcluster.com
            </a>
          </div>
        </div>
      </div>

      <div className="text-center pb-10 pt-6 border-t border-white/[0.04]">
        <p className="text-xs text-white/20">Propulsé par EbookStudio Pro 2026 • Audio IA Premium</p>
      </div>
    </div>
  );
};

const FaqItem = ({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`border border-white/[0.06] rounded-xl overflow-hidden transition-colors ${open ? 'bg-white/[0.02]' : 'bg-transparent'}`}>
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-sm text-white/70 hover:bg-white/[0.02] transition-colors"
      >
        {question}
        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-white/40 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export default AudiobookDemoPage;
