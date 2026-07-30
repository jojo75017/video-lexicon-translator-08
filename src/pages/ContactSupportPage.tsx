import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Send, ArrowLeft, MessageCircle, HelpCircle, Bug, Lightbulb, CreditCard, Video, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import SeoHead from '@/components/funnel/SeoHead';

interface Props {
  subscriberEmail: string;
}

const CATEGORIES = [
  { id: 'question', label: 'Question générale', icon: HelpCircle },
  { id: 'bug', label: 'Problème technique / Bug', icon: Bug },
  { id: 'suggestion', label: 'Suggestion / Idée V3', icon: Lightbulb },
  { id: 'facturation', label: 'Facturation / Accès', icon: CreditCard },
  { id: 'autre', label: 'Autre', icon: MessageCircle },
];

export default function ContactSupportPage({ subscriberEmail }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(subscriberEmail || '');
  const [category, setCategory] = useState('question');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const isV3 = useLocation().pathname.startsWith('/v3');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message.trim()) {
      toast.error('Merci de remplir au moins votre email et votre message.');
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-subscriber-contact', {
        body: {
          email,
          name,
          subject,
          category: CATEGORIES.find((c) => c.id === category)?.label || category,
          message,
        },
      });
      if (error) throw error;
      toast.success('Message envoyé ! Réponse personnelle sous 48h ouvrées.');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      toast.error("Impossible d'envoyer le message. Réessayez ou écrivez à boubetgeorges@gmail.com");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#232F3E]">
      <SeoHead
        title="Contact Support Abonnés — Ebookstudio"
        description="Posez votre question, signalez un bug ou suggérez une amélioration. Réponse sous 48h."
        canonical="/contact-support"
        noindex
      />

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          {isV3 ? (
            <button
              type="button"
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/v3'))}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#008296]"
            >
              <ArrowLeft className="w-4 h-4" /> Retour à la V3
            </button>
          ) : (
            <Link to="/espace" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#008296]">
              <ArrowLeft className="w-4 h-4" /> Retour à mon espace
            </Link>
          )}
          <div className="text-sm text-gray-500">Support abonnés</div>
        </div>
      </header>



      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#008296]/10 text-[#008296] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <MessageCircle className="w-4 h-4" /> CONTACT DIRECT
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Une question ? Écrivez-moi.</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Je réponds personnellement à chaque message d'abonné sous <strong>48h ouvrées</strong>. Bugs, idées
            pour la V3, questions sur l'outil — tout passe ici.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-xs uppercase tracking-wide text-gray-500">
                  Nom
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs uppercase tracking-wide text-gray-500">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wide text-gray-500 mb-2 block">
                Catégorie *
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  const active = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition ${
                        active
                          ? 'border-[#008296] bg-[#008296]/5 text-[#008296]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-center leading-tight">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="subject" className="text-xs uppercase tracking-wide text-gray-500">
                Sujet
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex : Problème export PDF chapitre 5"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-xs uppercase tracking-wide text-gray-500">
                Votre message *
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={8}
                placeholder="Décrivez votre question, votre bug ou votre idée en détail..."
                className="mt-1 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{message.length} caractères</p>
            </div>

            <Button
              type="submit"
              disabled={sending}
              className="w-full bg-[#232F3E] hover:bg-[#008296] text-white rounded-full py-6 text-base font-semibold transition"
            >
              {sending ? (
                'Envoi en cours...'
              ) : (
                <>
                  Envoyer mon message <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <aside className="space-y-4">
            <div className="bg-gradient-to-br from-[#008296] to-[#006d7e] text-white rounded-2xl p-5 shadow-lg">
              <div className="text-xs uppercase tracking-wide text-white/80 font-bold mb-2 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Rendez-vous Zoom / Google Meet
              </div>
              <p className="text-sm text-white/90 mb-3">
                Préférez un échange en visio ? Réservez un créneau gratuit avec moi (Georges).
              </p>
              <a
                href="https://calendly.com/boubetgeorges/nouvelle-reunion"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#008296] font-semibold px-4 py-2 rounded-full text-sm hover:bg-[#FF9E2D] hover:text-white transition w-full justify-center"
              >
                <Calendar className="w-4 h-4" /> Réserver un créneau
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Email direct</div>
              <div className="flex items-center gap-2 text-[#008296] font-semibold">
                <Mail className="w-4 h-4" />
                <a href="mailto:boubetgeorges@gmail.com" className="hover:underline">
                  boubetgeorges@gmail.com
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-2">Réponse personnelle sous 48h ouvrées.</p>
            </div>

            <div className="bg-gradient-to-br from-[#FF9E2D]/10 to-[#FF9E2D]/5 border border-[#FF9E2D]/30 rounded-2xl p-5">
              <div className="text-xs uppercase tracking-wide text-[#FF9E2D] font-bold mb-2">💡 Idée V3 ?</div>
              <p className="text-sm text-gray-700">
                Choisissez la catégorie <strong>« Suggestion / Idée V3 »</strong>. Toutes les idées d'abonnés
                sont étudiées pour la version d'octobre 2026.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">⚡ Urgence ?</div>
              <p className="text-sm text-gray-600">
                Précisez « URGENT » dans le sujet pour un traitement prioritaire (accès bloqué, paiement…).
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
