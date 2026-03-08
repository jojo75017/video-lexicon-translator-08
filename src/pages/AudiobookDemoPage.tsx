import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, Volume2, VolumeX, Headphones, Code, Copy, Check, 
  SkipBack, SkipForward, BookOpen, Clock, Star, Users, Download, 
  ChevronDown, ChevronUp, Mic2, Sparkles, Link2, Calendar, Globe, 
  FileAudio, Building2, Tag, ShoppingCart, CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

const DEMO_DATA = {
  title: "Les Secrets du Marketing Digital",
  author_name: "Marie Dupont",
  voice_name: "Éloise (IA Premium)",
  description: "Découvrez les stratégies les plus efficaces du marketing digital dans ce guide audio complet. De la création de contenu viral aux techniques de conversion avancées, ce livre audio vous accompagne pas à pas vers la maîtrise du marketing en ligne. Apprenez à construire une audience fidèle, à optimiser vos campagnes publicitaires et à transformer vos visiteurs en clients fidèles. Un must-have pour tout entrepreneur souhaitant développer sa présence en ligne et maximiser son retour sur investissement. Ce guide couvre également les dernières tendances en matière de SEO, de réseaux sociaux et d'email marketing.",
  cover_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
  play_count: 1247,
  duration_seconds: 14400,
  price: 12.99,
  paypal_link: "https://paypal.me/example",
  created_at: "2026-03-01T10:00:00Z",
  slug: "secrets-marketing-digital"
};

const MetaRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-white/35 mb-0.5">{label}</p>
      <p className="text-sm text-white/80 font-medium">{value}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3a4a5c] via-[#1e2a38] to-[#0f1319] text-white">
      
      {/* Demo banner */}
      <div className="bg-amber-500/90 text-black text-center py-2 text-sm font-semibold">
        🎯 PAGE DÉMO — Voici à quoi ressemble la fiche produit de vos audiobooks
      </div>

      {/* ===== HERO HEADER ===== */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4a5568]/60 via-[#2d3748]/80 to-[#1a202c] z-0" />
        <div className="absolute inset-0 z-0">
          <img src={audiobook.cover_url} alt="" className="w-full h-full object-cover scale-125 blur-[80px] opacity-15" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* LEFT */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1 min-w-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight tracking-tight">
                {audiobook.title}
              </h1>

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

      {/* ===== CONTENT ===== */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 min-w-0 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">À propos de ce contenu audio</h2>
              <p className="text-white/70 leading-relaxed text-[15px]">
                {showFullDesc ? audiobook.description : descriptionShort}
                {hasLongDesc && !showFullDesc && '...'}
              </p>
              {hasLongDesc && (
                <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-amber-400 text-sm mt-2 flex items-center gap-1 hover:text-amber-300 transition-colors font-medium">
                  {showFullDesc ? <><ChevronUp className="w-4 h-4" /> Afficher moins</> : <><ChevronDown className="w-4 h-4" /> Afficher plus</>}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/20 text-white/70 bg-white/5 hover:bg-white/10 rounded-full px-4 py-1.5">Livre Audio</Badge>
              <Badge variant="outline" className="border-white/20 text-white/70 bg-white/5 hover:bg-white/10 rounded-full px-4 py-1.5">Marketing Digital</Badge>
              <Badge variant="outline" className="border-white/20 text-white/70 bg-white/5 hover:bg-white/10 rounded-full px-4 py-1.5">Audio IA</Badge>
              <Badge variant="outline" className="border-white/20 text-white/70 bg-white/5 hover:bg-white/10 rounded-full px-4 py-1.5">{audiobook.voice_name}</Badge>
            </div>

            {/* Full Player */}
            {showFullPlayer && (
              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
                  <FileAudio className="w-5 h-5 text-amber-400" />
                  Lecteur complet
                </h3>
                <div className="mb-6">
                  <Slider value={[currentTime]} max={duration} step={1} onValueChange={(v) => setCurrentTime(v[0])} className="cursor-pointer" />
                  <div className="flex justify-between text-xs text-white/40 mt-2 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-full">
                    <div className="relative"><SkipBack className="h-5 w-5" /><span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-white/40">15s</span></div>
                  </Button>
                  <Button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95">
                    {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 ml-0.5 text-white" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-full">
                    <div className="relative"><SkipForward className="h-5 w-5" /><span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-white/40">30s</span></div>
                  </Button>
                </div>
              </div>
            )}
            {!showFullPlayer && (
              <Button variant="outline" onClick={() => setShowFullPlayer(true)} className="gap-2 border-white/15 text-white/70 hover:bg-white/10 hover:text-white rounded-full">
                <Headphones className="w-4 h-4" />
                Ouvrir le lecteur complet
              </Button>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-5 sticky top-6">
              <h3 className="text-white font-semibold text-base border-b border-white/10 pb-3">Détails du produit</h3>
              <MetaRow icon={<CreditCard className="w-4 h-4 text-emerald-400/70" />} label="Prix" value={`${audiobook.price.toFixed(2)} €`} />
              <MetaRow icon={<Users className="w-4 h-4 text-amber-400/70" />} label="Auteur" value={audiobook.author_name} />
              <MetaRow icon={<Mic2 className="w-4 h-4 text-purple-400/70" />} label="Narrateur" value={audiobook.voice_name} />
              <MetaRow icon={<Calendar className="w-4 h-4 text-blue-400/70" />} label="Date de publication" value={createdDate} />
              <MetaRow icon={<Globe className="w-4 h-4 text-green-400/70" />} label="Langue" value="Français" />
              <MetaRow icon={<FileAudio className="w-4 h-4 text-cyan-400/70" />} label="Format" value="Version intégrale · MP3" />
              <MetaRow icon={<Clock className="w-4 h-4 text-orange-400/70" />} label="Durée" value={formatDuration(audiobook.duration_seconds)} />
              <MetaRow icon={<Building2 className="w-4 h-4 text-pink-400/70" />} label="Éditeur" value="EbookStudio" />
              <MetaRow icon={<Tag className="w-4 h-4 text-amber-400/70" />} label="Catégories" value="Marketing · Business" />
              <MetaRow icon={<Headphones className="w-4 h-4 text-emerald-400/70" />} label="Écoutes" value={`${audiobook.play_count}`} />
              <MetaRow icon={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />} label="Qualité" value="HD 192 kbps" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pb-10 pt-4 border-t border-white/5">
        <p className="text-xs text-white/20">Propulsé par EbookStudio Pro • Audio IA Premium</p>
      </div>
    </div>
  );
};

export default AudiobookDemoPage;
