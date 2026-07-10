import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Sparkles, Bug, FileText, Feather, ShoppingCart,
  Check, ShieldCheck, Clock, Zap, FileCheck2, Crown, Star, RotateCcw,
} from 'lucide-react';
import StripeCheckoutButton from '@/components/StripeCheckoutButton';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const CREAM = '#FBF6EC';
const SERIF = "'Instrument Serif', Georgia, serif";

const FEATURES = [
  {
    icon: Bug,
    title: 'Traces d’IA & titres provisoires',
    desc: 'Détecte automatiquement les formulations robotiques, placeholders et titres « Chapitre X » oubliés avant publication.',
  },
  {
    icon: FileText,
    title: 'Orthographe & typographie française',
    desc: 'Corrige accords, ponctuation, espaces insécables et règles typographiques FR — bien au-delà du correcteur de Word.',
  },
  {
    icon: Feather,
    title: 'Style & répétitions',
    desc: 'Repère les lourdeurs, mots répétés et phrases à fluidifier — sans jamais écraser votre voix d’auteur.',
  },
  {
    icon: ShoppingCart,
    title: 'Contrôle Amazon KDP',
    desc: 'Vérifie la conformité (nombre de pages, structure, mentions) pour un manuscrit prêt à publier sans rejet.',
  },
  {
    icon: FileCheck2,
    title: 'Rapport final & scores',
    desc: '12 indicateurs de qualité (orthographe, style, cohérence, préparation KDP…) avec un verdict clair.',
  },
  {
    icon: FileText,
    title: 'Export Word corrigé',
    desc: 'Récupérez un .docx propre avec vos corrections validées appliquées — prêt pour Amazon KDP.',
  },
];

const STEPS = [
  { n: '1', t: 'Importez votre manuscrit', d: 'Glissez votre fichier Word (DOCX). BookPerfect découpe automatiquement vos chapitres.' },
  { n: '2', t: 'Analyse chapitre par chapitre', d: 'L’IA analyse chaque chapitre séparément, avec reprise automatique en cas d’interruption — même sur 400+ pages.' },
  { n: '3', t: 'Validez chaque correction', d: 'Rien n’est modifié sans vous. Vous acceptez ou ignorez chaque suggestion, une par une.' },
  { n: '4', t: 'Exportez pour KDP', d: 'Téléchargez votre Word corrigé, prêt à publier sur Amazon.' },
];

const BookPerfectSalesPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) { setEmail(user.email); return; }
      } catch { /* ignore */ }
      try {
        const e = localStorage.getItem('payment_email_backup') || localStorage.getItem('ebs_lead_email');
        if (e) setEmail(e);
      } catch { /* ignore */ }
    })();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: CREAM }}>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <button
          onClick={() => navigate('/hub-v3')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: AMBER_DEEP }}
        >
          <ArrowLeft className="h-4 w-4" /> Retour au Hub
        </button>

        {/* Hero */}
        <section className="rounded-3xl border p-6 sm:p-10" style={{ background: '#fff', borderColor: `${AMBER}33` }}>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
            <BookOpen className="h-3.5 w-3.5" /> Nouveau module premium
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-medium leading-[1.05]" style={{ fontFamily: SERIF, color: INK }}>
            BookPerfect AI
          </h1>
          <p className="mt-2 text-xl sm:text-2xl" style={{ fontFamily: SERIF, color: AMBER_DEEP }}>
            Votre directeur éditorial intelligent
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: '#6f5e47' }}>
            Ne publiez plus jamais un roman avec des fautes, des traces d’IA ou des lourdeurs.
            BookPerfect AI analyse votre manuscrit Word <strong>chapitre par chapitre</strong>,
            même sur 400+ pages, et vous rend un texte <strong>prêt pour Amazon KDP</strong> —
            sans jamais toucher à votre style ni à votre texte original.
          </p>

          {/* Prix + achat */}
          <div className="mt-8 rounded-2xl border p-5 sm:p-6" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44` }}>
            <div className="flex flex-wrap items-end gap-3">
              <span className="text-4xl font-black" style={{ color: INK }}>67&euro;</span>
              <span className="text-lg font-bold line-through" style={{ color: '#b9a888' }}>97&euro;</span>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-black text-white" style={{ background: AMBER }}>
                OFFRE DE LANCEMENT
              </span>
            </div>
            <p className="mt-1 text-sm" style={{ color: '#6f5e47' }}>
              Paiement unique · accès à vie · mises à jour incluses
            </p>

            <div className="mt-4 max-w-md">
              <label className="mb-1 block text-xs font-semibold" style={{ color: '#6f5e47' }}>
                Votre email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@email.com"
                className="mb-3 bg-white"
              />
              <StripeCheckoutButton
                email={email}
                planId="bookperfect_launch"
                successPath="/paiement-succes"
                cancelPath="/bookperfect"
              >
                Débloquer BookPerfect AI — 67&euro;
              </StripeCheckoutButton>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px]" style={{ color: '#6f5e47' }}>
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Paiement sécurisé</span>
              <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Accès immédiat</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Accès à vie</span>
            </div>

            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold" style={{ background: '#fff', color: AMBER_DEEP }}>
              <Crown className="h-3.5 w-3.5" /> Module premium indépendant · accès réservé aux acheteurs
            </p>

          </div>
        </section>

        {/* Pourquoi ce n'est pas Word */}
        <section className="mt-10">
          <h2 className="text-2xl sm:text-3xl font-medium" style={{ fontFamily: SERIF, color: INK }}>
            Pas un simple correcteur. Un directeur éditorial.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
            Word souligne quelques fautes. BookPerfect AI relit votre roman comme le ferait un
            professionnel de l’édition : cohérence, style, traces d’IA, conformité Amazon… et vous
            garde toujours aux commandes.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border p-5" style={{ background: '#fff', borderColor: `${AMBER}22` }}>
                <f.icon className="h-5 w-5" style={{ color: AMBER }} />
                <h3 className="mt-3 text-sm font-bold" style={{ color: INK }}>{f.title}</h3>
                <p className="mt-1 text-[13px] leading-snug" style={{ color: '#6f5e47' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="mt-10 rounded-3xl border p-6 sm:p-8" style={{ background: '#fff', borderColor: `${AMBER}22` }}>
          <h2 className="text-2xl sm:text-3xl font-medium" style={{ fontFamily: SERIF, color: INK }}>
            Comment ça marche
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white" style={{ background: AMBER }}>
                  {s.n}
                </div>
                <h3 className="mt-3 text-sm font-bold" style={{ color: INK }}>{s.t}</h3>
                <p className="mt-1 text-[13px] leading-snug" style={{ color: '#6f5e47' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Garanties / points clés */}
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, t: 'Zéro destruction', d: 'Votre texte original n’est jamais modifié. Chaque correction est validée par vous.' },
            { icon: RotateCcw, t: 'Conçu pour les romans longs', d: 'Analyse résiliente, reprise après coupure : 400 pages sans planter.' },
            { icon: Star, t: 'Spécial Amazon KDP', d: 'Pensé pour la publication : conformité, export Word propre, prêt à vendre.' },
          ].map((g) => (
            <div key={g.t} className="rounded-2xl border p-5" style={{ background: AMBER_SOFT, borderColor: `${AMBER}33` }}>
              <g.icon className="h-5 w-5" style={{ color: AMBER_DEEP }} />
              <h3 className="mt-2 text-sm font-bold" style={{ color: INK }}>{g.t}</h3>
              <p className="mt-1 text-[13px] leading-snug" style={{ color: '#6f5e47' }}>{g.d}</p>
            </div>
          ))}
        </section>

        {/* CTA final */}
        <section className="mt-10 rounded-3xl border p-6 sm:p-10 text-center" style={{ background: '#fff', borderColor: `${AMBER}33` }}>
          <Sparkles className="mx-auto h-6 w-6" style={{ color: AMBER }} />
          <h2 className="mt-3 text-2xl sm:text-3xl font-medium" style={{ fontFamily: SERIF, color: INK }}>
            Publiez un roman irréprochable
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
            Rejoignez les auteurs qui ne laissent plus une seule faute passer. Accès à vie, aujourd’hui à 67&euro; au lieu de 97&euro;.
          </p>
          <div className="mx-auto mt-5 max-w-md text-left">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@email.com"
              className="mb-3 bg-white"
            />
            <StripeCheckoutButton
              email={email}
              planId="bookperfect_launch"
              successPath="/paiement-succes"
              cancelPath="/bookperfect"
            >
              Débloquer maintenant — 67&euro;
            </StripeCheckoutButton>
          </div>
          <ul className="mx-auto mt-5 flex max-w-md flex-col gap-1.5 text-left text-[13px]" style={{ color: '#6f5e47' }}>
            {['Import DOCX & découpage automatique des chapitres', 'Traces IA, orthographe, style & KDP', 'Export Word corrigé prêt pour Amazon', 'Accès à vie + mises à jour'].map((li) => (
              <li key={li} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4" style={{ color: AMBER }} /> {li}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default BookPerfectSalesPage;
