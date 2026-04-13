import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Download, Headphones, Mail, ArrowLeft, Sparkles, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AudiobookThankYouPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [audiobook, setAudiobook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');

  useEffect(() => {
    if (slug) fetchAudiobook();
  }, [slug]);

  const fetchAudiobook = async () => {
    try {
      const { data, error } = await supabase
        .from('audiobooks')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single();
      if (error) throw error;
      setAudiobook(data);
    } catch {
      setAudiobook(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!audiobook?.audio_url) {
      toast.error("Fichier audio non disponible");
      return;
    }
    const a = document.createElement('a');
    a.href = audiobook.audio_url;
    a.download = `${audiobook.slug || 'audiobook'}.mp3`;
    a.target = '_blank';
    a.click();
    toast.success('Téléchargement lancé !');
  };

  const handleSendEmail = async () => {
    if (!buyerEmail || !buyerEmail.includes('@')) {
      toast.error("Veuillez entrer un email valide");
      return;
    }
    setSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke('send-audiobook-delivery', {
        body: {
          email: buyerEmail,
          bookTitle: audiobook.title,
          bookAuthor: audiobook.author_name || 'EbookStudio',
          downloadUrl: audiobook.audio_url,
          coverUrl: audiobook.cover_url,
        },
      });
      if (error) throw error;
      setEmailSent(true);
      toast.success('Email de livraison envoyé !');
    } catch (e: any) {
      toast.error(e?.message || "Erreur lors de l'envoi de l'email");
    } finally {
      setSendingEmail(false);
    }
  };

  const formatDuration = (s: number | null) => {
    if (!s) return '';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m} min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-amber-400 flex flex-col items-center gap-3">
          <Headphones className="w-14 h-14 animate-bounce" />
          <p className="text-foreground/80 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!audiobook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <Headphones className="w-20 h-20 mx-auto mb-4 text-foreground/20" />
          <h1 className="text-3xl font-bold mb-2">Livre audio introuvable</h1>
          <p className="text-foreground/50">Ce lien n'est plus valide ou le livre audio n'existe pas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Merci pour votre achat ! 🎉
          </h1>
          <p className="text-foreground/60 text-lg">
            Votre livre audio est prêt à être téléchargé
          </p>
        </motion.div>

        {/* Book card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="flex gap-5 mb-6">
            {audiobook.cover_url ? (
              <img
                src={audiobook.cover_url}
                alt={audiobook.title}
                className="w-24 h-24 rounded-xl object-cover border border-white/10 shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                <Headphones className="w-10 h-10 text-amber-400/50" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-xl font-bold mb-1">{audiobook.title}</h2>
              <p className="text-amber-400/80 text-sm mb-1">
                Par {audiobook.author_name || 'EbookStudio'}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-amber-500/10 text-amber-400/70 border-amber-500/20 text-xs">
                  🎧 MP3 HD
                </Badge>
                {audiobook.duration_seconds && (
                  <Badge className="bg-white/[0.06] text-foreground/50 border-white/10 text-xs">
                    ⏱ {formatDuration(audiobook.duration_seconds)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Download button */}
          {audiobook.audio_url && (
            <Button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-foreground font-bold gap-3 h-14 rounded-xl shadow-xl shadow-emerald-500/20 text-base transition-all hover:scale-[1.01]"
            >
              <Download className="w-5 h-5" />
              Télécharger mon livre audio (MP3)
            </Button>
          )}
        </motion.div>

        {/* Email delivery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-lg">Recevoir par email</h3>
          </div>
          <p className="text-foreground/50 text-sm mb-4">
            Entrez votre email pour recevoir le lien de téléchargement. Vous pourrez le re-télécharger à tout moment.
          </p>
          {emailSent ? (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-emerald-300 text-sm font-medium">
                Email envoyé à <span className="font-bold">{buyerEmail}</span> ! Vérifiez votre boîte de réception.
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
              <Button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                className="bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 rounded-xl px-5 font-semibold"
              >
                {sendingEmail ? '...' : 'Envoyer'}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-emerald-500/[0.05] border border-emerald-500/15 rounded-2xl p-6 flex items-start gap-4 mb-8"
        >
          <Shield className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-emerald-300 mb-1">Garantie 30 jours</h3>
            <p className="text-foreground/50 text-sm leading-relaxed">
              Si vous n'êtes pas satisfait, contactez-nous pour un remboursement intégral. Votre satisfaction est notre priorité.
            </p>
          </div>
        </motion.div>

        {/* Back link */}
        <div className="text-center">
          <Link
            to={`/audiobook/${audiobook.slug}`}
            className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground/60 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la fiche produit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AudiobookThankYouPage;
