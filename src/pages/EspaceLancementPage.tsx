import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Gift, Calendar, Copy, Check, Share2, Sparkles, Heart } from 'lucide-react';
import { toast } from 'sonner';

const TEAL = '#008296';
const ORANGE = '#FF9E2D';
const INK = '#232F3E';
const PROMO_CODE = 'MERCIVIP30';
const CALENDLY_URL = 'https://calendly.com/boubetgeorges/nouvelle-reunion';
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://ebookstudio.fr';

export default function EspaceLancementPage() {
  const navigate = useNavigate();
  const [refCode, setRefCode] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate('/auth'); return; }
      setFirstName(session.user.email?.split('@')[0] || '');

      // Récupère ou crée le code parrainage
      const { data: existing } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', session.user.id)
        .maybeSingle();

      let myCode = existing?.code;
      if (!myCode) {
        const generated = (session.user.email?.split('@')[0] || 'aff')
          .replace(/[^a-zA-Z0-9]/g, '')
          .slice(0, 8)
          .toUpperCase() + Math.floor(Math.random() * 1000);
        const { data: ins } = await supabase
          .from('referral_codes')
          .insert({ user_id: session.user.id, code: generated })
          .select('code')
          .single();
        myCode = ins?.code;
      }
      setRefCode(myCode || null);
    })();
  }, [navigate]);

  const refLink = useMemo(
    () => (refCode ? `${ORIGIN}/promo/decouverte?ref=${refCode}` : ''),
    [refCode]
  );

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      toast.success('Copié !');
      setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error('Impossible de copier');
    }
  };

  const shareTemplates = useMemo(() => {
    if (!refLink) return [];
    return [
      {
        label: '📱 WhatsApp / SMS',
        text: `Hello ! Je teste depuis quelques mois ebookstudio.fr pour créer mes ebooks Kindle avec l'IA et franchement, c'est bluffant. Si tu veux jeter un œil avec mon lien : ${refLink}`,
      },
      {
        label: '👥 Facebook / LinkedIn',
        text: `J'ai trouvé une pépite pour celles et ceux qui veulent publier sur Amazon KDP : ebookstudio.fr. L'IA fait le plus gros (plan, chapitres, couverture, pub KDP), toi tu gardes la touche perso. C'est en lancement public — accès à vie : ${refLink}`,
      },
      {
        label: '✉️ Email à un proche',
        text: `Salut,\n\nJe sais que tu cherches une activité complémentaire. Je te recommande EbookStudio (ebookstudio.fr) : c'est l'outil que j'utilise pour publier mes livres sur Amazon Kindle. Tout est guidé par IA, et c'est un paiement unique à vie.\n\nMon lien : ${refLink}\n\nDis-moi ce que tu en penses 😉`,
      },
    ];
  }, [refLink]);

  return (
    <main
      className="min-h-screen pb-16"
      style={{ backgroundColor: '#FAFAFA', color: INK }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(250,250,250,0.9)',
          borderBottom: '1px solid hsl(var(--joy-ink) / 0.08)',
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            to="/espace"
            className="flex items-center gap-1.5 text-sm font-semibold text-joy-ink rounded-full px-3 py-1.5 hover:bg-joy-ink/5"
          >
            <ArrowLeft className="h-4 w-4" style={{ color: TEAL }} />
            Mon espace
          </Link>
          <span
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${ORANGE}22`, color: ORANGE }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Cadeau VIP abonné
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-10 pb-8 text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5"
          style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
        >
          <Heart className="h-3.5 w-3.5" />
          Merci d'être abonné depuis le début
        </div>
        <h1
          className="text-3xl sm:text-5xl font-bold tracking-tight mb-4"
          style={{ color: INK, fontFamily: 'Georgia, serif' }}
        >
          Pour toi, avant tout le monde :<br />
          <span style={{ color: TEAL }}>2 cadeaux de lancement</span>
        </h1>
        <p className="text-lg text-joy-ink/70 max-w-2xl mx-auto leading-relaxed">
          Le lancement public d'<strong>ebookstudio.fr</strong> démarre le{' '}
          <strong style={{ color: TEAL }}>1<sup>er</sup> juillet 2026</strong>. Avant que les
          nouveaux arrivent, voici ce que je t'offre — parce que c'est grâce à toi que tout ça existe.
        </p>
      </section>

      {/* Cadeau 1 — Coaching Zoom */}
      <section className="mx-auto max-w-5xl px-4 mb-10">
        <Card className="overflow-hidden border-2" style={{ borderColor: `${TEAL}33` }}>
          <CardContent className="p-0">
            <div className="grid md:grid-cols-[1fr_1.3fr]">
              <div
                className="p-8 flex flex-col justify-center"
                style={{ background: `linear-gradient(135deg, ${TEAL}10, ${TEAL}05)` }}
              >
                <div
                  className="inline-flex items-center justify-center rounded-2xl w-14 h-14 mb-4"
                  style={{ backgroundColor: TEAL, color: 'white' }}
                >
                  <Calendar className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: INK }}>
                  🎯 30 min en visio avec moi
                </h2>
                <p className="text-sm text-joy-ink/70 mb-4 leading-relaxed">
                  On bloque ensemble ton plan d'attaque KDP : niche, premier livre, mots-clés,
                  prochaine étape. <strong>1 séance offerte</strong> — réservée aux abonnés actuels.
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02] w-fit"
                  style={{ backgroundColor: TEAL }}
                >
                  Réserver mon créneau →
                </a>
              </div>
              <div className="border-l border-joy-ink/8 bg-white">
                <iframe
                  src={`${CALENDLY_URL}?embed_domain=${typeof window !== 'undefined' ? window.location.host : 'ebookstudio.fr'}&embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1`}
                  width="100%"
                  height="500"
                  frameBorder={0}
                  title="Réservation Calendly"
                  style={{ minHeight: 500 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cadeau 2 — Code -30% */}
      <section className="mx-auto max-w-5xl px-4 mb-10">
        <Card className="overflow-hidden border-2" style={{ borderColor: `${ORANGE}44` }}>
          <CardContent
            className="p-8 sm:p-10"
            style={{ background: `linear-gradient(135deg, ${ORANGE}10, #FAFAFA)` }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div
                  className="inline-flex items-center justify-center rounded-2xl w-14 h-14 mb-4"
                  style={{ backgroundColor: ORANGE, color: 'white' }}
                >
                  <Gift className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: INK }}>
                  💸 −30 % à vie sur tous mes packs
                </h2>
                <p className="text-sm text-joy-ink/70 leading-relaxed mb-4">
                  Ton code abonné s'applique sur la formation complète, le coaching VIP,
                  les packs de prompts et les futurs upsells. <strong>Sans date limite.</strong>
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div
                  className="rounded-2xl px-8 py-5 border-2 border-dashed font-mono text-2xl sm:text-3xl font-bold tracking-widest bg-white"
                  style={{ borderColor: ORANGE, color: INK }}
                >
                  {PROMO_CODE}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copy(PROMO_CODE, 'promo')}
                  className="rounded-full"
                  style={{ borderColor: ORANGE, color: ORANGE }}
                >
                  {copied === 'promo' ? (
                    <><Check className="h-3.5 w-3.5 mr-1.5" /> Copié</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5 mr-1.5" /> Copier le code</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cadeau bonus — Kit ambassadeur */}
      <section className="mx-auto max-w-5xl px-4 mb-10">
        <Card className="overflow-hidden border-2" style={{ borderColor: `${TEAL}22` }}>
          <CardContent className="p-8 sm:p-10">
            <div className="flex items-start gap-3 mb-5">
              <div
                className="inline-flex items-center justify-center rounded-2xl w-12 h-12 flex-shrink-0"
                style={{ backgroundColor: `${TEAL}15`, color: TEAL }}
              >
                <Share2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ color: INK }}>
                  🤝 Ton kit ambassadeur
                </h2>
                <p className="text-sm text-joy-ink/70">
                  Recommande ebookstudio à un ami → il bénéficie du tarif lancement,
                  toi tu touches <strong>30 % de commission</strong>.
                </p>
              </div>
            </div>

            {refLink ? (
              <>
                <div className="mb-5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-joy-ink/55 mb-2 block">
                    Ton lien parrainage personnel
                  </label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={refLink}
                      className="flex-1 rounded-xl border border-joy-ink/15 bg-white px-4 py-3 text-sm font-mono"
                    />
                    <Button
                      onClick={() => copy(refLink, 'link')}
                      className="rounded-xl"
                      style={{ backgroundColor: TEAL }}
                    >
                      {copied === 'link' ? (
                        <><Check className="h-4 w-4 mr-1.5" /> Copié</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-1.5" /> Copier</>
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-joy-ink/55 mb-3">
                    Messages prêts à coller (avec ton lien dedans)
                  </p>
                  <div className="grid gap-3">
                    {shareTemplates.map((tpl, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-joy-ink/10 bg-joy-cream/30 p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-joy-ink/70">
                            {tpl.label}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copy(tpl.text, `tpl-${i}`)}
                            className="h-7 rounded-full text-xs"
                            style={{ color: ORANGE }}
                          >
                            {copied === `tpl-${i}` ? (
                              <><Check className="h-3 w-3 mr-1" /> Copié</>
                            ) : (
                              <><Copy className="h-3 w-3 mr-1" /> Copier</>
                            )}
                          </Button>
                        </div>
                        <Textarea
                          readOnly
                          value={tpl.text}
                          className="bg-white border-joy-ink/10 text-sm resize-none"
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 text-center">
                  <Link
                    to="/parrainage"
                    className="text-sm font-semibold underline-offset-4 hover:underline"
                    style={{ color: TEAL }}
                  >
                    Voir mes statistiques de parrainage →
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm text-joy-ink/55 text-center py-6">
                Génération de ton lien parrainage...
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <p className="text-center text-xs text-joy-ink/45 max-w-md mx-auto px-4">
        Ces cadeaux te sont offerts en remerciement de ta confiance.
        — Georges
      </p>
    </main>
  );
}
