import BackButton from '@/components/v3/BackButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp, AlertTriangle, Target, Sparkles, Rocket } from 'lucide-react';

/**
 * "La réalité KDP" — article éditorial signé Nanakia / EbookStudio.
 * Contenu 100% reformulé (aucun plagiat) à partir de la note interne fournie.
 */
export default function V3RealiteKdpPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <BackButton to="/v3" />

        <header className="mb-8">
          <Badge className="bg-[#008296] mb-3">📖 Guide</Badge>

          <h1 className="text-3xl md:text-4xl font-bold text-[#232F3E] leading-tight">
            La vraie vie des auteurs Amazon KDP&nbsp;: combien on gagne réellement,
            et pourquoi la plupart se plantent
          </h1>
          <p className="text-slate-500 mt-3 text-sm">
            Par <strong className="text-[#232F3E]">Nanakia — Équipe EbookStudio</strong> ·
            Mis à jour 2026 · Lecture 8 min
          </p>
        </header>

        <article className="prose prose-slate max-w-none prose-headings:text-[#232F3E] prose-a:text-[#008296]">
          <p className="lead text-lg">
            On voit passer partout les captures d’écran de dashboards KDP à 10&nbsp;000&nbsp;€
            par mois. Ce que personne ne montre, ce sont les milliers d’auteurs qui
            touchent moins de 20&nbsp;€ par mois. Voici la photo honnête du marché
            en 2026, sans hype et sans faux espoir.
          </p>

          <Card className="p-5 my-6 border-l-4 border-[#008296] bg-white">
            <h2 className="flex items-center gap-2 mt-0"><TrendingUp className="h-5 w-5 text-[#008296]" /> Ce que gagnent vraiment les auteurs KDP</h2>
            <p>
              Les études indépendantes sont convergentes&nbsp;: près d’un auteur sur
              deux publié sur Amazon KDP encaisse moins de 500&nbsp;$ par an. Le
              revenu médian d’un auteur auto-édité qui en fait son activité
              principale se situe autour de 12&nbsp;000 à 15&nbsp;000&nbsp;$ annuels
              — un vrai complément, rarement un salaire complet.
            </p>
            <p>
              À l’autre bout, quelques auteurs indépendants passent la barre des
              100&nbsp;000&nbsp;$ par an, et une poignée dépasse le million.
              Ils existent. Ils sont rares. Et ils ont presque tous un point
              commun&nbsp;: la taille du catalogue.
            </p>
          </Card>

          <h2>La donnée la plus importante&nbsp;: le nombre de titres</h2>
          <ul>
            <li><strong>1 à 3 livres</strong>&nbsp;: revenus quasi nuls. C’est la phase d’apprentissage, pas la phase business.</li>
            <li><strong>5 à 9 livres</strong>&nbsp;: premières royalties significatives, quelques centaines d’euros mensuels.</li>
            <li><strong>10 à 24 livres</strong>&nbsp;: bascule. Les lecteurs achètent plusieurs de vos titres, l’algorithme vous prend au sérieux.</li>
            <li><strong>25 titres et +</strong>&nbsp;: profil professionnel, revenus stables souvent au-dessus de 2&nbsp;000&nbsp;$ par mois.</li>
          </ul>
          <p>
            Publier un seul livre et espérer en vivre&nbsp;? Statistiquement, c’est
            perdu d’avance — sauf si ce livre sert de porte d’entrée vers autre
            chose (formation, service, communauté). On y revient plus bas.
          </p>

          <h2>Fiction ou non-fiction&nbsp;: deux jeux différents</h2>
          <p>
            En fiction, la <strong>romance</strong> et ses variantes (romantasy,
            contemporain) écrasent le marché&nbsp;: lecteurs fidèles, séries dévorées,
            modèle Kindle Unlimited très rentable. En non-fiction, le volume à
            l’unité est plus faible mais les marges sont meilleures, avec des
            niches très porteuses en 2026&nbsp;: santé mentale, parascolaire,
            cahiers d’activités seniors, guides pratiques ultra-ciblés.
          </p>

          <Card className="p-5 my-6 border-l-4 border-amber-500 bg-amber-50">
            <h2 className="flex items-center gap-2 mt-0 text-[#232F3E]"><Target className="h-5 w-5 text-amber-600" /> Les 3 modèles économiques KDP</h2>
            <p><strong>1. Le vendeur de livres.</strong> Il vit des royalties, publie beaucoup, réinvestit 20 à 40&nbsp;% en Amazon Ads. Ça marche… si vous acceptez de construire 10 à 50 titres et de le traiter comme un vrai e-commerce.</p>
            <p><strong>2. L’éditeur indépendant.</strong> Portfolio de 50 à 200 titres, parfois avec des ghostwriters. Vrai métier d’éditeur&nbsp;: qualité, couvertures, marketing sur chaque livre.</p>
            <p><strong>3. L’entrepreneur (le modèle que personne ne vous vend).</strong> Le livre n’est pas le produit&nbsp;: c’est <em>l’outil</em>. Il sert à trois choses — établir votre autorité, capter des lecteurs qualifiés via Amazon, et pré-éduquer vos futurs clients.</p>
          </Card>

          <h2>Le calcul qui change tout</h2>
          <p>
            Un livre à 9,99&nbsp;€ qui se vend 5 fois par jour&nbsp;: environ
            6&nbsp;000&nbsp;€ de royalties par an. Correct, sans plus. Mais ces
            <strong> 1&nbsp;800 lecteurs annuels</strong>, s’ils entrent dans votre
            écosystème et que 5&nbsp;% achètent une offre à 249&nbsp;€ derrière&nbsp;? Ça
            fait <strong>22&nbsp;000&nbsp;€ de chiffre en backend</strong> — avec un
            seul livre. Ce n’est pas magique, c’est arithmétique. Amazon paie la
            prospection, votre livre vend votre expertise, vous vendez vos
            services.
          </p>

          <Card className="p-5 my-6 border-l-4 border-red-500 bg-white">
            <h2 className="flex items-center gap-2 mt-0"><AlertTriangle className="h-5 w-5 text-red-600" /> Les 5 erreurs qui plombent les débutants</h2>
            <ol>
              <li><strong>Écrire pour «&nbsp;tout le monde&nbsp;».</strong> L’algorithme d’Amazon a besoin de savoir à qui proposer votre livre. Pas de niche = pas de ventes.</li>
              <li><strong>Publier du contenu 100&nbsp;% IA brut.</strong> Avis 1 étoile, retours, mort algorithmique, et depuis peu&nbsp;: déclaration obligatoire côté KDP. Le sujet n’est pas d’utiliser l’IA — c’est de la laisser écrire à votre place sans y mettre votre expertise.</li>
              <li><strong>Oublier le tunnel derrière le livre.</strong> Pas de QR code, pas de lead magnet, pas de capture d’email&nbsp;: vous laissez repartir chaque lecteur qualifié sans rien.</li>
              <li><strong>Fixer un prix au feeling.</strong> Depuis la réforme des royalties brochés de 2025, un prix «&nbsp;psychologique&nbsp;» trop bas peut devenir déficitaire. Calculez toujours la marge nette, jamais le prix seul.</li>
              <li><strong>Ignorer Amazon Ads.</strong> C’est une régie où l’intention d’achat est maximale et le CPC souvent plus bas que Meta. Et le trafic externe est même bonifié par l’algorithme A10.</li>
            </ol>
          </Card>

          <h2 className="flex items-center gap-2"><Rocket className="h-5 w-5 text-[#008296]" /> Le plan d’action concret</h2>
          <ol>
            <li><strong>Partez de votre expertise.</strong> Ne cherchez pas «&nbsp;la niche rentable&nbsp;». Partez de ce que vous connaissez mieux que 95&nbsp;% des gens.</li>
            <li><strong>Centralisez votre matière première.</strong> Vidéos, articles, transcriptions, formations, cas clients — tout est déjà là.</li>
            <li><strong>Structurez un livre utile qui renvoie vers votre écosystème.</strong> Chaque chapitre = une passerelle naturelle.</li>
            <li><strong>Écrivez avec méthode.</strong> Pas de page blanche&nbsp;: un système de rédaction assisté par IA (comme celui d’EbookStudio) qui transforme votre base documentaire en manuscrit structuré et gardé à votre voix.</li>
            <li><strong>Construisez le mini-funnel.</strong> Version courte gratuite en lead magnet, version complète sur KDP, Amazon Ads pour le trafic, séquence email pour convertir.</li>
          </ol>

          <h2 className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#008296]" /> Les 3 tendances à surveiller en 2026</h2>
          <p>
            <strong>L’audio explose.</strong> Avec la voix de synthèse Virtual
            Voice désormais disponible en français, un audiobook se produit
            gratuitement. Les auteurs qui prennent la place maintenant partent
            avec plusieurs longueurs d’avance.
          </p>
          <p>
            <strong>Le trafic externe est récompensé.</strong> L’algorithme A10
            pousse les livres qui amènent des visiteurs depuis l’extérieur, et
            Amazon reverse même un bonus (Brand Referral Bonus) sur les ventes
            générées via vos liens trackés.
          </p>
          <p>
            <strong>L’IA ne change pas le jeu, elle change les règles.</strong>
            Contenu IA brut = pénalisé. IA utilisée comme outil de productivité
            pour structurer et accélérer un livre de qualité = avantage
            compétitif énorme. Amazon distingue officiellement «&nbsp;AI-generated&nbsp;»
            (à déclarer) et «&nbsp;AI-assisted&nbsp;» (édition, brainstorming — pas de
            déclaration).
          </p>

          <Card className="p-6 my-8 bg-gradient-to-br from-[#008296] to-emerald-700 text-white border-0">
            <h2 className="flex items-center gap-2 mt-0 text-white"><BookOpen className="h-5 w-5" /> Le mot de la fin</h2>
            <p className="text-white/95">
              Amazon KDP n’est ni mort ni magique. C’est un marché de
              28&nbsp;milliards de dollars où plus d’un million d’auteurs se
              battent pour l’attention de centaines de millions de lecteurs.
              La vraie question n’est pas «&nbsp;dois-je publier un livre&nbsp;?&nbsp;» mais
              «&nbsp;combien de temps encore vais-je laisser mon expertise dormir
              dans des Google Docs que personne ne lit&nbsp;?&nbsp;»
            </p>
            <p className="text-white/95 mb-0">
              Vous avez la matière. Vous avez l’expertise. Il vous manque la
              méthode&nbsp;: c’est exactement ce qu’EbookStudio a été conçu pour
              vous donner.
            </p>
          </Card>

          <p className="text-xs text-slate-500 text-center">
            Article éditorial signé Nanakia — Équipe EbookStudio. Reproduction
            interdite sans autorisation.
          </p>
        </article>
      </div>
    </div>
  );
}
