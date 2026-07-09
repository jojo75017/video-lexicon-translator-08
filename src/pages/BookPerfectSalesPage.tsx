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
    title: 'Traces d\u2019IA & titres provisoires',
    desc: 'D\u00e9tecte automatiquement les formulations robotiques, placeholders et titres « Chapitre X » oubli\u00e9s avant publication.',
  },
  {
    icon: FileText,
    title: 'Orthographe & typographie fran\u00e7aise',
    desc: 'Corrige accords, ponctuation, espaces ins\u00e9cables et r\u00e8gles typographiques FR \u2014 bien au-del\u00e0 du correcteur de Word.',
  },
  {
    icon: Feather,
    title: 'Style & r\u00e9p\u00e9titions',
    desc: 'Rep\u00e8re les lourdeurs, mots r\u00e9p\u00e9t\u00e9s et phrases \u00e0 fluidifier \u2014 sans jamais \u00e9craser votre voix d\u2019auteur.',
  },
  {
    icon: ShoppingCart,
    title: 'Contr\u00f4le Amazon KDP',
    desc: 'V\u00e9rifie la conformit\u00e9 (nombre de pages, structure, mentions) pour un manuscrit pr\u00eat \u00e0 publier sans rejet.',
  },
  {
    icon: FileCheck2,
    title: 'Rapport final & scores',
    desc: '12 indicateurs de qualit\u00e9 (orthographe, style, coh\u00e9rence, pr\u00e9paration KDP\u2026) avec un verdict clair.',
  },
  {
    icon: FileText,
    title: 'Export Word corrig\u00e9',
    desc: 'R\u00e9cup\u00e9rez un .docx propre avec vos corrections valid\u00e9es appliqu\u00e9es \u2014 pr\u00eat pour Amazon KDP.',
  },
];

const STEPS = [
  { n: '1', t: 'Importez votre manuscrit', d: 'Glissez votre fichier Word (DOCX). BookPerfect d\u00e9coupe automatiquement vos chapitres.' },
  { n: '2', t: 'Analyse chapitre par chapitre', d: 'L\u2019IA analyse chaque chapitre s\u00e9par\u00e9ment, avec reprise automatique en cas d\u2019interruption \u2014 m\u00eame sur 400+ pages.' },
  { n: '3', t: 'Validez chaque correction', d: 'Rien n\u2019est modifi\u00e9 sans vous. Vous acceptez ou ignorez chaque suggestion, une par une.' },
  { n: '4', t: 'Exportez pour KDP', d: 'T\u00e9l\u00e9chargez votre Word corrig\u00e9, pr\u00eat \u00e0 publier sur Amazon.' },
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
            Votre directeur \u00e9ditorial intelligent
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: '#6f5e47' }}>
            Ne publiez plus jamais un roman avec des fautes, des traces d\u2019IA ou des lourdeurs.
            BookPerfect AI analyse votre manuscrit Word <strong>chapitre par chapitre</strong>,
            m\u00eame sur 400+ pages, et vous rend un texte <strong>pr\u00eat pour Amazon KDP</strong> \u2014
            sans jamais toucher \u00e0 votre style ni \u00e0 votre texte original.
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
              Paiement unique \u00b7 acc\u00e8s \u00e0 vie \u00b7 mises \u00e0 jour incluses
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
                D\u00e9bloquer BookPerfect AI \u2014 67&euro;
              </StripeCheckoutButton>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px]" style={{ color: '#6f5e47' }}>
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Paiement s\u00e9curis\u00e9</span>
              <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Acc\u00e8s imm\u00e9diat</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Acc\u00e8s \u00e0 vie</span>
            </div>

            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold" style={{ background: '#fff', color: AMBER_DEEP }}>
              <Crown className="h-3.5 w-3.5" /> Module premium ind\u00e9pendant \u00b7 acc\u00e8s r\u00e9serv\u00e9 aux acheteurs
            </p>

          </div>
        </section>

        {/* Pourquoi ce n'est pas Word */}
        <section className="mt-10">
          <h2 className="text-2xl sm:text-3xl font-medium" style={{ fontFamily: SERIF, color: INK }}>
            Pas un simple correcteur. Un directeur \u00e9ditorial.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
            Word souligne quelques fautes. BookPerfect AI relit votre roman comme le ferait un
            professionnel de l\u2019\u00e9dition : coh\u00e9rence, style, traces d\u2019IA, conformit\u00e9 Amazon\u2026 et vous
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
            Comment \u00e7a marche
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

        {/* Garanties / points cl\u00e9s */}
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, t: 'Z\u00e9ro destruction', d: 'Votre texte original n\u2019est jamais modifi\u00e9. Chaque correction est valid\u00e9e par vous.' },
            { icon: RotateCcw, t: 'Con\u00e7u pour les romans longs', d: 'Analyse r\u00e9siliente, reprise apr\u00e8s coupure : 400 pages sans planter.' },
            { icon: Star, t: 'Sp\u00e9cial Amazon KDP', d: 'Pens\u00e9 pour la publication : conformit\u00e9, export Word propre, prêt \u00e0 vendre.' },
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
            Publiez un roman irr\u00e9prochable
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
            Rejoignez les auteurs qui ne laissent plus une seule faute passer. Acc\u00e8s \u00e0 vie, aujourd\u2019hui \u00e0 67&euro; au lieu de 97&euro;.
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
              D\u00e9bloquer maintenant \u2014 67&euro;
            </StripeCheckoutButton>
          </div>
          <ul className="mx-auto mt-5 flex max-w-md flex-col gap-1.5 text-left text-[13px]" style={{ color: '#6f5e47' }}>
            {['Import DOCX & d\u00e9coupage automatique des chapitres', 'Traces IA, orthographe, style & KDP', 'Export Word corrig\u00e9 pr\u00eat pour Amazon', 'Acc\u00e8s \u00e0 vie + mises \u00e0 jour'].map((li) => (
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
