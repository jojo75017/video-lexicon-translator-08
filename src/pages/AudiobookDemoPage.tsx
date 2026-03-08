import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, Volume2, VolumeX, Headphones, Code, Copy, Check, 
  SkipBack, SkipForward, BookOpen, Clock, Star, Users, Download, 
  ChevronDown, ChevronUp, Mic2, Sparkles, Link2, Calendar, Globe, 
  FileAudio, Building2, Tag, ShoppingCart, CreditCard, Shield, HelpCircle, Library,
  Zap, Lock, RefreshCw, MessageCircle, Timer
} from 'lucide-react';
import { toast } from 'sonner';
import { getRandomReviews } from '@/utils/reviewPool';

const DEMO_DATA = {
  title: "Le Cow-Boy le Plus Rapide",
  subtitle: "Une aventure de Far West drôle, rythmée et pleine de rebondissements",
  author_name: "EbookStudio",
  voice_name: "Brigitte (IA Premium)",
  description: "Plongez dans une aventure hilarante au cœur du Far West ! Billy le cow-boy rêve de devenir le plus rapide de l'Ouest, mais entre ses bottes trop grandes, son cheval têtu et un bandit pas si méchant que ça, rien ne se passe comme prévu. Une histoire drôle, rythmée et pleine de rebondissements qui captivera les jeunes lecteurs et les fera rire du début à la fin. Idéal pour les trajets en voiture ou le rituel du coucher !",
  cover_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
  play_count: 342,
  duration_seconds: 1500, // ~25 min
  price: 4.99,
  paypal_link: "https://paypal.me/example",
  stripe_link: "https://buy.stripe.com/example",
  created_at: "2026-03-01T10:00:00Z",
  slug: "cow-boy-le-plus-rapide",
  genre: "Aventure Western Humoristique",
  target_audience: "Enfants de 6 à 10 ans",
  chapters: 8,
};

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

  const audiobook = DEMO_DATA;
  const duration = 180; // demo excerpt duration
  const fullDuration = 14400;

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

  // Simulate playback
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

  // Urgency countdown (2h30 from page load)
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
    <div className="min-h-screen bg-[#F7F3EB] text-gray-900">
      
      {/* Demo banner */}
      <div className="bg-amber-500/90 text-black text-center py-2 text-sm font-semibold">
        🎯 PAGE DÉMO — Voici à quoi ressemble la fiche produit de vos audiobooks
      </div>

      {/* ===== URGENCY BANNER ===== */}
      <div className="bg-gradient-to-r from-red-600/90 via-orange-500/90 to-red-600/90 text-white text-center py-3 px-4">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Timer className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm">🔥 Offre de lancement — Prix réduit pendant encore</span>
          <div className="flex gap-1.5">
            <span className="bg-black/30 px-2.5 py-1 rounded-lg font-mono font-bold text-base min-w-[2.5rem] text-center">{String(timeLeft.h).padStart(2, '0')}</span>
            <span className="font-bold text-lg">:</span>
            <span className="bg-black/30 px-2.5 py-1 rounded-lg font-mono font-bold text-base min-w-[2.5rem] text-center">{String(timeLeft.m).padStart(2, '0')}</span>
            <span className="font-bold text-lg">:</span>
            <span className="bg-black/30 px-2.5 py-1 rounded-lg font-mono font-bold text-base min-w-[2.5rem] text-center">{String(timeLeft.s).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* ===== HERO HEADER ===== */}
      <div className="relative overflow-hidden bg-[#232F3E] text-white">
        <div className="absolute inset-0 z-0">
          <img src={audiobook.cover_url} alt="" className="w-full h-full object-cover scale-125 blur-[80px] opacity-10" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* LEFT */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1 min-w-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 leading-tight tracking-tight">
                {audiobook.title}
              </h1>
              {audiobook.subtitle && (
                <p className="text-white/50 text-base md:text-lg italic mb-2">{audiobook.subtitle}</p>
              )}

              <div className="space-y-1 mb-4">
                <p className="text-white/70 text-base">
                  <span className="text-white/40 text-sm uppercase tracking-wide mr-2">De</span>
                  <span className="text-amber-400 font-medium">{audiobook.author_name}</span>
                </p>
                <p className="text-white/70 text-base">
                  <span className="text-white/40 text-sm uppercase tracking-wide mr-2">Lu par</span>
                  <span className="text-amber-400 font-medium">{audiobook.voice_name}</span>
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-6">
                <span className="text-white font-semibold text-lg">4.7</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-amber-400/50 fill-amber-400/50'}`} />
                  ))}
                </div>
                <span className="text-amber-400/80 text-sm">{audiobook.play_count} écoutes</span>
              </div>

              {/* Excerpt player */}
              <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 md:p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Headphones className="w-5 h-5 text-amber-400" />
                  <h3 className="text-white font-semibold text-base">Aperçu</h3>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 ml-0.5 text-white" />}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <Slider value={[currentTime]} max={duration} step={1} onValueChange={(v) => setCurrentTime(v[0])} className="cursor-pointer" />
                    <div className="flex justify-between text-[11px] text-white/40 mt-1.5 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 justify-center lg:justify-start mb-4">
                <span className="text-4xl font-extrabold text-white">{audiobook.price.toFixed(2)} €</span>
                <span className="text-white/40 text-sm line-through">{(audiobook.price * 1.5).toFixed(2)} €</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">-33%</Badge>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-4">
                <Button 
                  onClick={() => toast.info('Démo : redirection vers Stripe...')}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 px-8 h-12 rounded-full shadow-lg shadow-amber-500/20 text-base"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Acheter maintenant — {audiobook.price.toFixed(2)} €
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => toast.info('Démo : redirection vers PayPal...')}
                  className="gap-2 border-blue-400/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 rounded-full h-12 font-semibold"
                >
                  <CreditCard className="h-4 w-4" />
                  Payer via PayPal
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-white/60 font-medium">Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] text-white/60 font-medium">Téléchargement immédiat</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5">
                  <RefreshCw className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-[11px] text-white/60 font-medium">Remboursé sous 30 jours</span>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5">
                  <MessageCircle className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-[11px] text-white/60 font-medium">Support réactif 7j/7</span>
                </div>
              </div>

              {/* Listen row */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                <Button 
                  variant="outline"
                  onClick={() => setShowFullPlayer(true)}
                  className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white rounded-full h-10 font-medium text-sm"
                >
                  <Headphones className="h-4 w-4" />
                  Écouter l'extrait
                </Button>
              </div>

              {/* Share icons */}
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <button onClick={shareUrl} className="text-white/40 hover:text-white/70 transition-colors" title="Copier le lien">
                  <Link2 className="w-5 h-5" />
                </button>
                <button onClick={() => setShowEmbed(!showEmbed)} className="text-white/40 hover:text-white/70 transition-colors" title="Code embed">
                  <Code className="w-5 h-5" />
                </button>
                <button onClick={() => toast.success('Démo: HTML téléchargé !')} className="text-white/40 hover:text-white/70 transition-colors" title="Télécharger HTML">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              {showEmbed && (
                <div className="mt-4 bg-black/30 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-white/50 mb-2 font-medium">Code d'intégration :</p>
                  <div className="relative">
                    <pre className="bg-black/40 rounded-lg p-3 text-xs text-white/40 overflow-x-auto font-mono">{embedCode}</pre>
                    <Button size="sm" onClick={copyEmbed} className="absolute top-1.5 right-1.5 gap-1.5 bg-amber-500/80 hover:bg-amber-500 text-white rounded-lg text-xs">
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copié' : 'Copier'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Cover */}
            <div className="shrink-0 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 transition-transform group-hover:scale-[1.02]">
                  <img src={audiobook.cover_url} alt={audiobook.title} className="w-full h-full object-cover" />
                  <button onClick={() => setIsPlaying(!isPlaying)} className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all">
                    <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl">
                      {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 ml-1 text-white" />}
                    </div>
                  </button>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg rotate-[-3deg]">
                  EbookStudio
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTENT (Light) ===== */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 min-w-0 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos de ce contenu audio</h2>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {showFullDesc ? audiobook.description : descriptionShort}
                {hasLongDesc && !showFullDesc && '...'}
              </p>
              {hasLongDesc && (
                <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-orange-600 text-sm mt-2 flex items-center gap-1 hover:text-orange-500 transition-colors font-medium">
                  {showFullDesc ? <><ChevronUp className="w-4 h-4" /> Afficher moins</> : <><ChevronDown className="w-4 h-4" /> Afficher plus</>}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50 rounded-full px-4 py-1.5">📖 Livre Audio</Badge>
              <Badge variant="outline" className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50 rounded-full px-4 py-1.5">🤠 {audiobook.genre}</Badge>
              <Badge variant="outline" className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50 rounded-full px-4 py-1.5">🎙️ Audio IA</Badge>
              <Badge variant="outline" className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50 rounded-full px-4 py-1.5">🗣️ {audiobook.voice_name}</Badge>
            </div>

            {/* Pour qui est ce livre ? */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-orange-600 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Pour qui est ce livre audio ?
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">✓</span> {audiobook.target_audience}</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">✓</span> Parents cherchant des histoires captivantes pour le coucher ou les trajets</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">✓</span> Enseignants souhaitant des supports audio ludiques</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">✓</span> Amateurs d'aventures western drôles et familiales</li>
              </ul>
            </div>

            {/* Full Player */}
            {showFullPlayer && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-gray-900 font-semibold text-lg mb-5 flex items-center gap-2">
                  <FileAudio className="w-5 h-5 text-orange-500" />
                  Lecteur complet
                </h3>
                <div className="mb-6">
                  <Slider value={[currentTime]} max={duration} step={1} onValueChange={(v) => setCurrentTime(v[0])} className="cursor-pointer" />
                  <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 h-12 w-12 rounded-full">
                    <div className="relative"><SkipBack className="h-5 w-5" /><span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-gray-400">15s</span></div>
                  </Button>
                  <Button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95">
                    {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 ml-0.5 text-white" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 h-12 w-12 rounded-full">
                    <div className="relative"><SkipForward className="h-5 w-5" /><span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-gray-400">30s</span></div>
                  </Button>
                </div>
              </div>
            )}
            {!showFullPlayer && (
              <Button variant="outline" onClick={() => setShowFullPlayer(true)} className="gap-2 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-full bg-white">
                <Headphones className="w-4 h-4" />
                Ouvrir le lecteur complet
              </Button>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 sticky top-6 shadow-sm">
              <h3 className="text-gray-900 font-semibold text-base border-b border-gray-200 pb-3">📋 Informations produit</h3>
              <MetaRow dark icon={<CreditCard className="w-4 h-4 text-emerald-600" />} label="Prix" value={`${audiobook.price.toFixed(2)} €`} />
              <MetaRow dark icon={<FileAudio className="w-4 h-4 text-orange-500" />} label="Format" value="Livre audio" />
              <MetaRow dark icon={<Tag className="w-4 h-4 text-orange-500" />} label="Genre" value={audiobook.genre} />
              <MetaRow dark icon={<Users className="w-4 h-4 text-pink-500" />} label="Public" value={audiobook.target_audience} />
              <MetaRow dark icon={<Globe className="w-4 h-4 text-green-600" />} label="Langue" value="Français" />
              <MetaRow dark icon={<Clock className="w-4 h-4 text-cyan-600" />} label="Durée estimée" value={formatDuration(audiobook.duration_seconds)} />
              <MetaRow dark icon={<BookOpen className="w-4 h-4 text-blue-600" />} label="Chapitres" value={`${audiobook.chapters}`} />
              <MetaRow dark icon={<FileAudio className="w-4 h-4 text-cyan-600" />} label="Format audio" value="MP3 · HD" />
              <MetaRow dark icon={<Download className="w-4 h-4 text-emerald-600" />} label="Accès" value="Téléchargement immédiat après achat" />
              <MetaRow dark icon={<Users className="w-4 h-4 text-orange-500" />} label="Auteur" value={audiobook.author_name} />
              <MetaRow dark icon={<Mic2 className="w-4 h-4 text-purple-500" />} label="Narrateur" value={audiobook.voice_name} />
              <MetaRow dark icon={<Calendar className="w-4 h-4 text-blue-600" />} label="Publication" value={createdDate} />
              <MetaRow dark icon={<Building2 className="w-4 h-4 text-pink-500" />} label="Éditeur" value="EbookStudio" />
              <MetaRow dark icon={<Headphones className="w-4 h-4 text-emerald-600" />} label="Écoutes" value={`${audiobook.play_count}`} />
            </div>
          </div>
        </div>

        {/* ===== TEXT EXCERPT ===== */}
        <div className="mt-12 bg-gradient-to-br from-amber-500/[0.06] to-transparent border border-amber-500/15 rounded-2xl p-7">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Extrait du livre
          </h2>
          <div className="relative">
            <blockquote className="text-white/60 text-[15px] leading-relaxed italic border-l-2 border-amber-500/40 pl-5 space-y-3">
              <p>« Le soleil tapait fort sur la petite ville de Cactus Valley. Tellement fort que même les cactus avaient l'air de transpirer. Au milieu de la rue principale — qui était aussi la seule rue — un garçon de dix ans se tenait debout, les pouces glissés dans les passants de sa ceinture, un chapeau de cow-boy beaucoup trop grand sur la tête. »</p>
              <p>« — Je suis Billy le Kid… enfin, Billy tout court, marmonna-t-il en plissant les yeux comme il avait vu faire dans les films. Et aujourd'hui, je deviens le cow-boy le plus rapide de tout l'Ouest ! »</p>
              <p>« Son cheval, Tornado — qui était en réalité un poney assez grassouillet — leva à peine la tête de son seau d'avoine et souffla un bruit qui ressemblait beaucoup à un rire... »</p>
            </blockquote>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f1319] to-transparent pointer-events-none" />
          </div>
          <p className="text-amber-400/70 text-xs mt-4 font-medium">— Extrait du Chapitre 1 : « L'Arrivée à Cactus Valley »</p>
        </div>

        {/* ===== REVIEWS ===== */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            Avis des auditeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getRandomReviews(audiobook.slug || audiobook.title).map((review, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
                    {review.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{review.name}</p>
                    <p className="text-[11px] text-white/35">A écouté ce titre</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.stars ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{review.text}</p>
                <div className="mt-3 inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  <Headphones className="w-3 h-3" /> Avis spontané
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== GUARANTEE ===== */}
        <div className="mt-12 bg-gradient-to-r from-emerald-500/[0.08] to-emerald-500/[0.02] border border-emerald-500/20 rounded-2xl p-7 flex flex-col sm:flex-row items-center gap-6">
          <Shield className="w-16 h-16 text-emerald-400 shrink-0" />
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-emerald-400 mb-2">Garantie Satisfait ou Remboursé — 30 jours</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Vous n'êtes pas satisfait ? Nous vous remboursons intégralement, sans conditions et sans questions. Votre satisfaction est notre priorité absolue.
            </p>
          </div>
        </div>

        {/* ===== FAQ ===== */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            Questions fréquentes
          </h2>
          <div className="space-y-2">
            {[
              { q: "Dans quel format est le livre audio ?", a: "Le livre audio est au format MP3 haute définition, compatible avec tous les appareils : smartphone, tablette, ordinateur, enceinte connectée." },
              { q: "Comment accéder à mon achat ?", a: "Après le paiement, vous recevrez un lien de téléchargement par email. Vous pourrez écouter votre livre audio immédiatement sur n'importe quel appareil." },
              { q: "La voix est-elle naturelle ?", a: "Oui ! Nous utilisons une technologie de synthèse vocale de dernière génération qui produit une narration fluide, expressive et très naturelle." },
              { q: "Puis-je être remboursé ?", a: "Absolument. Vous bénéficiez d'une garantie satisfait ou remboursé de 30 jours. Contactez-nous simplement par email." },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>

        {/* ===== SIMILAR BOOKS ===== */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Library className="w-6 h-6 text-amber-400" />
            Vous aimerez aussi
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { title: "Copywriting Avancé", price: "9.99" },
              { title: "Mindset Entrepreneur", price: "11.99" },
              { title: "SEO Masterclass", price: "14.99" },
              { title: "Réseaux Sociaux Pro", price: "8.99" },
            ].map((book, i) => (
              <div key={i} className="shrink-0 w-40 bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden hover:-translate-y-1 transition-transform cursor-pointer group">
                <div className="w-40 h-40 bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center">
                  <Headphones className="w-10 h-10 text-white/15 group-hover:text-amber-400/30 transition-colors" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-white truncate">{book.title}</p>
                  <p className="text-xs font-bold text-amber-400 mt-1">{book.price} €</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center pb-10 pt-4 border-t border-white/5">
        <p className="text-xs text-white/20">Propulsé par EbookStudio Pro • Audio IA Premium</p>
      </div>
    </div>
  );
};

const FaqItem = ({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`border border-white/[0.08] rounded-xl overflow-hidden transition-colors ${open ? 'bg-white/[0.03]' : ''}`}>
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-sm text-white hover:bg-white/[0.04] transition-colors"
      >
        {question}
        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-white/55 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export default AudiobookDemoPage;
