import { useEffect } from 'react';
import { BookOpen, PenLine, Palette, Rocket, ShieldCheck, Quote } from 'lucide-react';
import { FicheCountdown, FicheCta } from '@/components/launch/FicheShell';
import MethodeProbleme from '@/components/launch/methode/MethodeProbleme';
import MethodeAvantApres from '@/components/launch/methode/MethodeAvantApres';
import MethodeValeur from '@/components/launch/methode/MethodeValeur';
import MethodeFaq, { faqJsonLd } from '@/components/launch/methode/MethodeFaq';

const ETAPES = [
  {
    icon: BookOpen,
    title: 'Plan',
    text: "Tu donnes ton idée. Le sommaire se construit avec toi, chapitre par chapitre. Tu valides avant d'écrire une ligne.",
  },
  {
    icon: PenLine,
    title: 'Écrire',
    text: 'Les chapitres sont rédigés dans ton style, puis relus quatre fois : dictée réparée, orthographe, style, fins de chapitre.',
  },
  {
    icon: Palette,
    title: 'Habiller',
    text: 'Couverture avant, dos et quatrième au format KDP exact, calculé selon ton nombre de pages.',
  },
  {
    icon: Rocket,
    title: 'Publier',
    text: 'Manuscrit, couverture, description, 7 mots-clés et catégories : tu remplis le formulaire Amazon et tu publies.',
  },
];

const LIVRABLES = [
  'Le manuscrit complet, corrigé, avec sa table des matières mise en page',
  'Les fichiers Word et PDF prêts pour KDP',
  'La couverture complète au bon format, dos calculé',
  'Le titre, le sous-titre et la description formatée pour Amazon',
  'Les 7 mots-clés et les catégories de la fiche',
  'La version audio du livre',
  'Les traductions dans 10 langues',
];

/** Page de vente long format « la nouvelle voie » : problème, ancienne méthode
 *  vs atelier, étapes, valeur détaillée, garantie, FAQ. Un seul bouton : /commander. */
export default function MethodePage() {
  useEffect(() => {
    document.title = 'Publie ton livre sur Amazon sans savoir écrire | EbookStudio';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        "La méthode complète pour transformer ton savoir en livre publié sur Amazon : plan, rédaction, correction, couverture et fiche KDP. Accès à vie 47 €.",
      );
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--v3-cream, #FBF8F3)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <span className="v3-serif text-lg font-bold text-[#2A2118]">EbookStudio</span>
          <FicheCountdown />
        </div>
      </header>

      {/* 1 — Cible + promesse */}
      <section className="mx-auto max-w-3xl px-5 pb-4 pt-12 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a6d1f]">
          Auteurs · Coachs · Formateurs · Experts
        </p>
        <h1 className="v3-serif mt-4 text-3xl font-bold leading-tight text-[#2A2118] md:text-[42px]">
          Transforme ton savoir en livre publié sur Amazon. Sans savoir écrire.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[#5B5245]">
          Tu donnes ton idée. Tu ressors avec un manuscrit corrigé, une couverture au bon format et
          la fiche Amazon complète.
        </p>
        <div className="mt-6 space-y-1 text-[#5B5245]">
          <p>Sans agence ni prestataire à payer.</p>
          <p>Sans formation de 600 pages à avaler.</p>
          <p>Sans y passer six mois.</p>
        </div>

        {/* 2 — Prix ancré */}
        <div className="mt-8 rounded-2xl border-2 border-[#D4AF37]/40 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-center gap-3">
            <span className="text-4xl font-black text-[#0F2E1F]">47 €</span>
            <span className="text-lg text-[#5B5245] line-through">59 €</span>
            <span className="rounded-full bg-[#D4AF37]/20 px-3 py-1 text-sm font-bold text-[#8a6d1f]">-20 %</span>
          </div>
          <FicheCta label="Accès immédiat pour 47 €" />
          <p className="mt-3 text-xs text-[#5B5245]">
            Satisfait ou remboursé sous 30 jours, sans justification.
          </p>
        </div>
      </section>

      {/* 3 — Le problème */}
      <MethodeProbleme />

      {/* 4 — Ancienne méthode vs nouvelle voie */}
      <MethodeAvantApres />

      {/* 5 — Ce que ça donne en pratique */}
      <section className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a6d1f]">
          Ce que ça donne en pratique
        </p>
        <h2 className="v3-serif mt-3 text-2xl font-bold text-[#2A2118] md:text-3xl">
          Tu ouvres l'atelier avec une idée. Tu le quittes avec un livre.
        </h2>
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="leading-relaxed text-[#5B5245]">
            Tu écris une phrase : « un guide pour les grands-parents qui gardent leurs
            petits-enfants ». Le sommaire arrive, tu le corriges, tu le valides. Les chapitres
            s'écrivent sous tes yeux, tu les relis, tu changes ce que tu veux. La correction passe
            derrière. La couverture se fabrique au format exact de ton nombre de pages. Et la fiche
            Amazon t'attend, prête à copier.
          </p>
          <p className="mt-4 font-semibold text-[#2A2118]">
            Voici précisément ce que tu récupères à la fin :
          </p>
          <ul className="mt-4 space-y-2">
            {LIVRABLES.map((l) => (
              <li key={l} className="flex gap-3 text-sm leading-relaxed text-[#5B5245]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6 — Les 4 étapes */}
      <section className="mx-auto max-w-4xl px-5 py-14">
        <h2 className="v3-serif text-center text-2xl font-bold text-[#2A2118] md:text-3xl">
          Comment ton savoir devient un livre que les gens achètent
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {ETAPES.map((e, i) => (
            <div key={e.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#008296]/10 text-sm font-black text-[#008296]">
                  {i + 1}
                </span>
                <e.icon className="h-5 w-5 text-[#008296]" />
                <h3 className="v3-serif text-lg font-bold text-[#2A2118]">{e.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#5B5245]">{e.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7 — Ce que tu reçois */}
      <MethodeValeur />

      {/* 9 — Qui est derrière ça */}
      <section className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a6d1f]">Qui est derrière ça</p>
        <h2 className="v3-serif mt-3 text-2xl font-bold text-[#2A2118] md:text-3xl">
          Georges Boubet, fondateur d'EbookStudio
        </h2>
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="leading-relaxed text-[#5B5245]">
            Auteur indépendant et créateur de contenus digitaux depuis plus de dix ans. J'ai écrit et
            auto-édité un large catalogue de livres — du thriller à la romance, en passant par la
            littérature jeunesse — distribués notamment sur Amazon KDP.
          </p>
          <p className="mt-4 leading-relaxed text-[#5B5245]">
            EbookStudio est né de cette expérience de terrain : un écosystème d'outils pensé par un
            auteur, pour les auteurs. Mon objectif est simple — démocratiser la création, la mise en
            page et la publication numérique grâce aux technologies modernes et à l'intelligence
            artificielle.
          </p>
          <blockquote className="mt-6 flex gap-3 rounded-xl bg-[#0F2E1F]/5 p-5">
            <Quote className="h-5 w-5 shrink-0 text-[#D4AF37]" />
            <p className="v3-serif text-[17px] leading-relaxed text-[#2A2118]">
              « Mon but avec EbookStudio est d'offrir à chaque auteur les moyens de transformer ses
              idées en ouvrages professionnels, sans se perdre dans la complexité technique. »
            </p>
          </blockquote>
        </div>
      </section>

      {/* 10 — Garantie */}
      <section className="mx-auto max-w-3xl px-5 pb-4">
        <div className="flex gap-4 rounded-2xl border-2 border-emerald-600/30 bg-white p-6 shadow-sm">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10">
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
          </span>
          <p className="text-sm leading-relaxed text-[#5B5245]">
            <strong className="text-[#2A2118]">30 jours satisfait ou remboursé.</strong> Si l'atelier
            ne correspond pas à ce que tu attendais, un simple email suffit : remboursement intégral,
            sans justification. À 47 €, la vraie question n'est pas le risque financier. C'est :
            est-ce que tu veux enfin voir ton livre en ligne ?
          </p>
        </div>
      </section>

      {/* 11 — FAQ */}
      <MethodeFaq />

      {/* 12 — Rappel final */}
      <section className="bg-[#0F2E1F] py-14">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="v3-serif text-2xl font-bold md:text-3xl" style={{ color: "#ffffff" }}>
            Ton livre t'attend.
          </h2>
          <p className="mt-4" style={{ color: "rgba(255,255,255,0.88)" }}>
            Dans quelques soirées, il peut être en ligne. Ou rester une idée de plus.
          </p>
          <div className="mt-6 flex flex-wrap items-baseline justify-center gap-3">
            <span className="text-4xl font-black text-[#D4AF37]">47 €</span>
            <span className="text-lg text-white/60 line-through">59 €</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-[#D4AF37]">-20 %</span>
          </div>
          <div className="mt-6 flex justify-center">
            <FicheCountdown dark />
          </div>
          <FicheCta label="Je prends l’accès à vie à 47 €" />
        </div>
      </section>
    </div>
  );
}
