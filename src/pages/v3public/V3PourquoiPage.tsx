import { Link } from 'react-router-dom';
import {
import { BackButton } from "@/components/v3/BackButton";
  Sparkles, ShieldCheck, Brain, PenTool, Palette, Rocket, BookOpen,
  Languages, Users, Clock, Gem, CheckCircle2, ArrowRight, Star, Zap,
  FileText, Layers, Wand2, Target, Award,
} from 'lucide-react';

/**
 * Page éditoriale — "Pourquoi EbookStudio Pro V3".
 * Ton sérieux, informatif, teaser avant lancement Octobre 2026.
 * 100% original — parle uniquement d'EbookStudio, aucun concurrent nommé.
 */
export default function V3PourquoiPage() {
  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA', color: '#232F3E' }}>
      <div className="max-w-6xl mx-auto px-4 pt-4"><BackButton /></div>
      {/* Bandeau lancement */}
      <div
        className="text-center py-2.5 px-4 text-sm font-semibold"
        style={{ background: '#064E3B', color: '#F5E6C8' }}
      >
        <Clock className="w-4 h-4 inline-block mr-2 -mt-0.5" />
        Lancement officiel de la V3 — <strong style={{ color: '#C9A84C' }}>Octobre 2026</strong>. Cette page évolue chaque semaine.
      </div>

      {/* Hero */}
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#C9A84C' }}>
          Dossier · Édition assistée par IA
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          EbookStudio Pro V3 : la maison d'édition personnelle des auteurs indépendants
        </h1>
        <p className="text-lg text-[#4B5563] leading-relaxed">
          Écrire un livre du premier mot jusqu'au fichier prêt pour Amazon KDP, sans jamais quitter la même
          interface. C'est la promesse d'EbookStudio Pro V3 — la refonte complète de notre plateforme, pensée
          pour les auteurs francophones qui veulent publier <strong>vite, bien et sans dépendre de dix outils
          différents</strong>.
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          <Badge>100% en français</Badge>
          <Badge>Optimisé Amazon KDP</Badge>
          <Badge>30 agents IA spécialisés</Badge>
          <Badge>Sans plagiat</Badge>
        </div>
      </header>

      {/* Sommaire */}
      <section className="max-w-4xl mx-auto px-6 py-6">
        <div
          className="rounded-lg p-5"
          style={{ background: '#fff', border: '1px solid #E5E7EB' }}
        >
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#064E3B' }}>
            Dans ce dossier
          </div>
          <ol className="grid md:grid-cols-2 gap-y-1.5 gap-x-4 text-sm list-decimal list-inside">
            <li><a href="#promesse" className="hover:underline">La promesse EbookStudio</a></li>
            <li><a href="#agents" className="hover:underline">Les 30 agents IA du workflow</a></li>
            <li><a href="#kids" className="hover:underline">Le mode Livre illustré maternelle</a></li>
            <li><a href="#couvertures" className="hover:underline">Cover Studio Pro : couverture + dos + 4e</a></li>
            <li><a href="#kdp" className="hover:underline">Conformité KDP native</a></li>
            <li><a href="#traduction" className="hover:underline">Traduction 10 langues</a></li>
            <li><a href="#pour-qui" className="hover:underline">Pour qui c'est fait</a></li>
            <li><a href="#tarifs" className="hover:underline">Nos forfaits</a></li>
          </ol>
        </div>
      </section>

      {/* Promesse */}
      <Section id="promesse" icon={<Sparkles />} title="La promesse EbookStudio Pro V3">
        <p>
          Depuis 2023, EbookStudio accompagne les auteurs indépendants dans leur passage du brouillon à la
          publication. Avec la V3, nous avons entièrement repensé l'outil autour d'une seule idée :
          <strong> l'auteur reste maître de son livre, l'IA fait le travail répétitif</strong>. Vous décidez
          du sujet, du ton, du public visé — nos agents IA se chargent du plan, de la rédaction chapitre par
          chapitre, de la relecture typographique française, de la couverture, de la mise en page KDP et de
          l'export final.
        </p>
        <p className="mt-3">
          Aucune promesse magique : un livre demande votre attention. Mais là où il fallait autrefois assembler
          un traitement de texte, un générateur d'images, un correcteur, un outil de mise en page et un studio
          de couverture, la V3 réunit tout dans un même parcours. <strong>Vous gagnez des semaines de travail
          technique</strong> et vous consacrez ce temps à ce qui compte : votre voix d'auteur.
        </p>
      </Section>

      {/* 30 agents */}
      <Section id="agents" icon={<Brain />} title="Un workflow piloté par 30 agents IA spécialisés">
        <p>
          Le cœur d'EbookStudio Pro V3, c'est une chaîne de trente agents IA qui se passent le relais dans un
          ordre précis. Chaque agent a une mission unique et un prompt calibré par nos soins pour éviter les
          textes génériques, les répétitions et les hallucinations courantes des IA généralistes.
        </p>
        <div className="grid md:grid-cols-3 gap-3 mt-5">
          <MiniCard icon={<Target />} title="Phase Plan (P1 → P6)" text="Idée, positionnement, public cible, promesse unique, plan détaillé, sommaire final." />
          <MiniCard icon={<PenTool />} title="Phase Écriture (P7 → P18)" text="Rédaction chapitre par chapitre avec continuité narrative, ton constant et zéro remplissage." />
          <MiniCard icon={<ShieldCheck />} title="Phase Relecture (P19 → P24)" text="Typographie française, cohérence, anti-répétition, fluidité, fact-checking léger." />
          <MiniCard icon={<Palette />} title="Phase Habillage (P25 → P28)" text="Couverture, dos, quatrième de couverture, images intérieures, mise en page KDP." />
          <MiniCard icon={<Rocket />} title="Phase Publication (P29 → P30)" text="Fichiers .docx et .pdf conformes KDP, description Amazon, mots-clés, catégories." />
          <MiniCard icon={<Layers />} title="Reprise en cas d'erreur" text="Système de checkpoint local : si un agent échoue, le travail déjà fait est conservé et on relance." />
        </div>
        <Callout>
          Aucun chapitre n'est écrit "en une passe". Chaque bloc est rédigé, relu, réajusté et vérifié — comme
          le ferait une petite équipe éditoriale.
        </Callout>
      </Section>

      {/* Livre illustré */}
      <Section id="kids" icon={<Wand2 />} title="Mode Livre illustré maternelle — 100% automatique">
        <p>
          Nouveauté majeure de la V3 : un mode dédié aux <strong>albums jeunesse 21,59 × 21,59 cm</strong>
          (format KDP carré). Vous donnez un titre, un sous-titre, un synopsis, le nombre d'histoires et le
          nombre de mots — l'outil se charge du reste :
        </p>
        <ul className="mt-3 space-y-2">
          <Bullet>Génération de N histoires distinctes à partir d'un seul pitch, avec un fil rouge éditorial.</Bullet>
          <Bullet>Illustrations pleine page cohérentes (bible de personnages, style d'album unifié).</Bullet>
          <Bullet>Pages obligatoires incluses : Remerciements, Mot de l'auteur, Note pour avis lecteur.</Bullet>
          <Bullet>Export .docx et .pdf au format exact demandé par KDP pour l'impression.</Bullet>
        </ul>
        <Callout>
          Le mode maternelle 3-6 ans est disponible dès l'ouverture de la V3. La déclinaison
          <strong> 3-7 ans "Histoires du soir"</strong> avec mascottes récurrentes est planifiée pour Octobre 2026.
        </Callout>
      </Section>

      {/* Cover Studio */}
      <Section id="couvertures" icon={<Palette />} title="Cover Studio Pro : couverture, dos et 4ᵉ de couverture">
        <p>
          Une couverture d'ebook n'a pas les mêmes contraintes qu'une couverture broché. La V3 traite les deux
          cas et calcule automatiquement <strong>la largeur du dos en fonction du nombre de pages</strong>
          (formule officielle KDP, en mm, cm et pouces). Vous obtenez :
        </p>
        <div className="grid md:grid-cols-3 gap-3 mt-4">
          <MiniCard icon={<BookOpen />} title="Couverture avant" text="Composition premium adaptée à votre genre : romance, thriller, développement personnel, jeunesse…" />
          <MiniCard icon={<FileText />} title="Quatrième de couverture" text="Résumé accrocheur, extrait d'avis, bio auteur, code-barres ISBN à la bonne position." />
          <MiniCard icon={<Layers />} title="Dos calculé" text="Épaisseur exacte selon le nombre de pages et le type de papier — prêt pour l'impression KDP." />
        </div>
      </Section>

      {/* KDP */}
      <Section id="kdp" icon={<ShieldCheck />} title="Conformité KDP native, dès le premier export">
        <p>
          Amazon KDP rejette régulièrement des manuscrits pour des raisons purement techniques : marges,
          typographie, table des matières cassée, images non intégrées, format de page approximatif.
          EbookStudio Pro V3 corrige ces points en amont :
        </p>
        <ul className="mt-3 space-y-2">
          <Bullet>Marges, gouttière et pieds de page conformes aux formats KDP standards.</Bullet>
          <Bullet>Table des matières cliquable et propre — <strong>aucun artefact JSON</strong> hérité de l'IA.</Bullet>
          <Bullet>Typographie française respectée (espaces insécables, guillemets, tirets cadratins).</Bullet>
          <Bullet>Fichier .docx directement uploadable sur KDP, sans repasse manuelle.</Bullet>
        </ul>
      </Section>

      {/* Traduction */}
      <Section id="traduction" icon={<Languages />} title="Traduction en 10 langues (forfait Studio)">
        <p>
          Publier en français, c'est bien. Toucher les marchés anglophone, hispanophone, germanophone ou
          italien depuis le même livre, c'est un multiplicateur de revenus. Le module de traduction Studio
          couvre <strong>anglais, espagnol, allemand, italien, portugais, néerlandais, polonais, suédois,
          japonais et arabe</strong>, avec relecture de la typographie propre à chaque langue.
        </p>
      </Section>

      {/* Pour qui */}
      <Section id="pour-qui" icon={<Users />} title="Pour qui EbookStudio Pro V3 est-il fait ?">
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <UseCase title="L'auteur débutant" text="Vous n'avez jamais publié de livre. La V3 vous guide pas à pas, de l'idée au fichier KDP, sans jargon technique." />
          <UseCase title="L'auteur régulier" text="Vous publiez déjà. Vous voulez sortir 4 à 6 titres par an sans y passer vos week-ends. Le workflow accélère chaque étape." />
          <UseCase title="Le formateur / expert" text="Vous transformez votre expertise en livres pratiques. Les agents Plan et Écriture structurent votre savoir en chapitres actionnables." />
          <UseCase title="Le parent créatif" text="Vous voulez offrir un livre illustré à votre enfant, ou lancer une collection jeunesse. Le mode maternelle est fait pour vous." />
        </div>
      </Section>

      {/* Tarifs */}
      <Section id="tarifs" icon={<Gem />} title="Nos forfaits à l'ouverture (Octobre 2026)">
        <div className="grid md:grid-cols-3 gap-4 mt-2">
          <PlanCard
            name="Débutant"
            price="9,99 €"
            per="/ mois"
            highlights={['10 livres / mois', '18 agents IA', 'Exports KDP', 'Support standard']}
          />
          <PlanCard
            name="Studio"
            recommended
            price="12,99 €"
            per="/ mois"
            highlights={['20 livres / mois', '22 agents IA', 'Traduction 10 langues', 'Cover Studio Pro']}
          />
          <PlanCard
            name="Auteur"
            price="59,00 €"
            per="/ mois"
            highlights={['Livres illimités', '30 agents IA', 'Priorité workflow', 'Support prioritaire']}
          />
        </div>
        <p className="text-xs text-[#6B7280] mt-4">
          Tarifs annuels également disponibles avec économie affichée. Les modules Pro (couvertures haut de
          gamme, KDP Pilot) sont proposés en upsells depuis l'espace auteur.
        </p>
      </Section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="rounded-xl p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #0B6E52 100%)',
            color: '#F5E6C8',
          }}
        >
          <Award className="w-10 h-10 mx-auto mb-3" style={{ color: '#C9A84C' }} />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Soyez prévenu du lancement officiel
          </h2>
          <p className="text-sm mb-5 opacity-90 max-w-xl mx-auto">
            La V3 ouvre en Octobre 2026 avec un tarif préférentiel pour les premiers inscrits.
            Réservez votre place dès maintenant.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/v3/forfaits"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold"
              style={{ background: '#C9A84C', color: '#064E3B' }}
            >
              Voir les forfaits <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/v3/create"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(245,230,200,0.4)' }}
            >
              Découvrir le générateur
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-[#6B7280] mt-4">
          Contenu 100% rédigé par l'équipe EbookStudio · Aucun outil concurrent n'est mentionné ni copié.
        </p>
      </section>
    </div>
  );
}

/* ---------- petits composants internes ---------- */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: 'rgba(6,78,59,0.08)', color: '#064E3B' }}
    >
      <CheckCircle2 className="w-3 h-3" /> {children}
    </span>
  );
}

function Section({
  id, icon, title, children,
}: { id: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="max-w-4xl mx-auto px-6 py-8 scroll-mt-16">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: '#064E3B', color: '#C9A84C' }}
        >
          <div className="w-5 h-5">{icon}</div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      </div>
      <div className="text-[15px] leading-relaxed text-[#374151] space-y-2">{children}</div>
    </section>
  );
}

function MiniCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-4 h-4" style={{ color: '#C9A84C' }}>{icon}</div>
        <div className="font-bold text-sm text-[#064E3B]">{title}</div>
      </div>
      <div className="text-[13px] text-[#4B5563] leading-snug">{text}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <Zap className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
      <span>{children}</span>
    </li>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-4 rounded-lg p-4 text-[14px]"
      style={{ background: 'rgba(201,168,76,0.10)', borderLeft: '3px solid #C9A84C', color: '#374151' }}
    >
      <Star className="w-4 h-4 inline-block mr-2 -mt-0.5" style={{ color: '#C9A84C' }} />
      {children}
    </div>
  );
}

function UseCase({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
      <div className="font-bold text-sm mb-1" style={{ color: '#064E3B' }}>{title}</div>
      <div className="text-[13px] text-[#4B5563] leading-snug">{text}</div>
    </div>
  );
}

function PlanCard({
  name, price, per, highlights, recommended,
}: { name: string; price: string; per: string; highlights: string[]; recommended?: boolean }) {
  return (
    <div
      className="rounded-lg p-5 relative"
      style={{
        background: '#fff',
        border: recommended ? '2px solid #C9A84C' : '1px solid #E5E7EB',
        boxShadow: recommended ? '0 8px 24px rgba(201,168,76,0.18)' : 'none',
      }}
    >
      {recommended && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{ background: '#C9A84C', color: '#064E3B' }}
        >
          Recommandé
        </div>
      )}
      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#064E3B' }}>{name}</div>
      <div className="mt-2 mb-3">
        <span className="text-3xl font-bold text-[#232F3E]">{price}</span>
        <span className="text-sm text-[#6B7280]"> {per}</span>
      </div>
      <ul className="space-y-1.5 text-sm">
        {highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#064E3B' }} />
            <span className="text-[#374151]">{h}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
