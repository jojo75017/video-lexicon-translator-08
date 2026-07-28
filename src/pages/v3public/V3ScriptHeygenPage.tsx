import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, Video } from 'lucide-react';
import { toast } from 'sonner';

const SECTIONS: { title: string; duration: string; body: string }[] = [
  {
    title: '0. Ouverture — La recherche KDP avec EbookStudio & KDP Pilot (0:00 → 0:45)',
    duration: '~45 s',
    body: `Avant même d'écrire une seule ligne, il y a une étape que 90 % des auteurs négligent — et c'est exactement celle qui fait la différence entre un livre qui dort et un livre qui se vend : la recherche KDP.

Chez EbookStudio, nous avons intégré une véritable cellule de recherche Amazon KDP, pilotée par notre module KDP Pilot. Concrètement, avant de publier, vous savez déjà : quels mots-clés sont recherchés, quelles niches sont rentables, quels ASIN concurrents dominent, quelles catégories choisir, et quelle description convertit.

KDP Pilot analyse votre projet, audite votre fiche produit, et vous dit noir sur blanc ce qui fonctionne et ce qu'il faut corriger. C'est l'assurance de publier un livre pensé pour Amazon, pas contre Amazon.

Voilà pourquoi la V3 commence toujours par la recherche — et pourquoi nos auteurs vendent mieux, plus vite, et plus longtemps.`,
  },
  {
    title: '1. Intro — Présentation (0:00 → 0:45)',
    duration: '~45 s',
    body: `Bonjour et bienvenue ! Je suis Georges, le fondateur d'EbookStudio.
Depuis plusieurs années, j'accompagne des auteurs, des formateurs et des entrepreneurs qui veulent publier leurs livres sur Amazon KDP sans y passer des mois et sans se ruiner en outils.

Aujourd'hui, je suis très heureux de vous présenter la version 3 d'EbookStudio — non pas comme un simple logiciel, mais comme une véritable maison d'édition en ligne : une plateforme qui écrit, illustre, habille, traduit, prépare et vend vos livres sur Amazon KDP.

Prenez quelques minutes : je vais vous faire visiter, de A à Z, tout ce que la V3 peut faire pour vous.`,
  },
  {
    title: '2. La promesse de la V3 (0:45 → 1:30)',
    duration: '~45 s',
    body: `EbookStudio Pro V3, ce n'est pas un simple générateur de texte.
C'est une suite d'édition complète : plus de 30 agents IA spécialisés qui travaillent ensemble — un pour le plan, un pour l'écriture, un pour la cohérence, un pour la couverture, un pour la traduction, un pour le marketing…

Notre promesse est simple : vous donnez une idée, un titre, un public visé — la V3 vous rend un livre prêt à publier sur Amazon KDP, avec sa couverture, sa fiche produit, ses mots-clés et ses catégories.`,
  },
  {
    title: "3. De la V2 à la V3 : une maison d'édition en ligne (1:30 → 2:15)",
    duration: '~45 s',
    body: `Je tiens à être très clair : ce n'est pas une simple mise à jour.

EbookStudio V2 était un excellent outil pour écrire des livres. La V3 est autre chose. C'est un écosystème complet pensé comme une maison d'édition : on ne vous donne pas juste un texte, on vous donne un manuscrit structuré, une couverture professionnelle, une quatrième de couverture, une fiche Amazon optimisée, un plan marketing, et même des traductions dans 10 langues.

C'est le passage de l'écriture isolée à la publication professionnelle. Si vous vouliez quelque chose de grandiose, c'est exactement ce que nous avons construit.`,
  },
  {
    title: '4. Onglet PLAN — Structurer le livre (2:15 → 3:00)',
    duration: '~45 s',
    body: `Tout commence dans l'onglet Plan.
Vous entrez le titre, le sous-titre, l'auteur, le synopsis, le public cible et le style souhaité.
Ensuite, un agent IA construit un sommaire cohérent, chapitre par chapitre — jusqu'à 60 chapitres.
Vous pouvez éditer le sommaire, réorganiser, ajouter, supprimer, et même intégrer automatiquement une page "À propos de l'auteur", "Remerciements" et "Note pour avis".
C'est la fondation solide de votre livre.`,
  },
  {
    title: '5. Onglet ÉCRIRE — Le manuscrit (3:00 → 3:55)',
    duration: '~55 s',
    body: `Une fois le plan validé, on passe à l'écriture.
Les agents rédigent chaque chapitre en respectant le ton, le style et la cohérence globale.
Un module spécial "Bible de l'univers" et "Arbre narratif" garde en mémoire les personnages, les lieux et les événements, pour que votre livre reste parfaitement cohérent du début à la fin.

Vous pouvez pauser, reprendre, régénérer un chapitre, et même utiliser votre propre clé Gemini ou OpenRouter en mode BYOK pour ne jamais être bloqué par les crédits.
Chaque projet est automatiquement sauvegardé dans le cloud, dans "Mes livres".`,
  },
  {
    title: '6. Livre illustré maternelle & Histoires du soir (3:55 → 4:45)',
    duration: '~50 s',
    body: `La V3 va plus loin avec deux modules pensés pour les livres enfants.

Le premier : "Album maternelle 3-6 ans". Vous donnez un titre, un synopsis, le nombre d'histoires et de mots — l'outil génère les histoires, les illustrations photoréalistes, la couverture et la quatrième de couverture, au format carré 21,59 x 21,59 cm exactement comme Amazon KDP le demande.

Le second : "Histoires du soir 3-7 ans", avec un ton apaisant, des illustrations en aquarelle et un rythme adapté au coucher.

Dans les deux cas, les mentions légales KDP, la page de copyright, la dédicace, les remerciements et la note pour avis sont intégrées automatiquement.`,
  },
  {
    title: '7. Onglet HABILLER — Couvertures & mise en page (4:45 → 5:35)',
    duration: '~50 s',
    body: `Un livre, c'est aussi une couverture qui donne envie.
Le module Cover Studio Pro génère une première de couverture, une quatrième de couverture, et calcule automatiquement l'épaisseur du dos en fonction du nombre de pages, en millimètres, centimètres ou pouces.

Vous téléchargez chaque visuel en PNG haute qualité, prêt à être uploadé sur KDP. Les proportions respectent les gabarits Amazon, sans bandes orange, sans marges parasites.

Côté texte, les exports PDF et DOCX sont optimisés pour l'impression print-on-demand : marges intérieures, polices lisibles, sauts de page propres.`,
  },
  {
    title: '8. Onglet PUBLIER — La fiche Amazon KDP (5:35 → 6:25)',
    duration: '~50 s',
    body: `Publier sur Amazon, ce n'est pas juste envoyer un fichier.
Il faut un titre optimisé, un sous-titre, une description vendeuse, 7 mots-clés performants, et 3 catégories Amazon bien choisies.

La V3 génère tout cela pour vous, en un clic, à partir du contenu réel de votre livre.
Vous obtenez un fichier .txt prêt à copier-coller directement dans KDP — plus besoin de deviner, plus d'erreurs, plus de temps perdu.

Résultat : votre fiche produit est propre, optimisée pour le référencement Amazon, et alignée avec les meilleures pratiques 2026.`,
  },
  {
    title: '9. Onglet VENDRE — Marketing & lancement (6:25 → 7:05)',
    duration: '~40 s',
    body: `Un livre publié, c'est bien. Un livre qui se vend, c'est mieux.
La V3 embarque un module marketing complet : séquences email de lancement, posts réseaux sociaux, pages de vente, script de challenge 7 jours…

Vous pouvez aussi analyser vos concurrents avec "Audit ASIN", scanner 600 niches rentables, faire de la recherche de mots-clés Amazon avec KDSpy, et surveiller vos crédits Firecrawl en direct.`,
  },
  {
    title: '10. Traductions & rayonnement international (7:05 → 7:40)',
    duration: '~35 s',
    body: `Votre livre mérite d'être lu partout.
Le module Traduction transforme votre manuscrit en 10 langues — anglais, espagnol, italien, allemand, portugais, néerlandais, et plus encore — en gardant le ton, le style et la cohérence.

Vous multipliez vos revenus KDP sans réécrire une seule ligne.`,
  },
  {
    title: '11. Les 3 forfaits (7:40 → 8:55)',
    duration: '~75 s',
    body: `Parlons tarifs — c'est clair, c'est transparent, sans surprise.

Forfait DÉBUTANT — 9,99 € par mois.
Jusqu'à 10 livres par mois, 18 agents IA, tout le workflow de base pour écrire, habiller et publier. Idéal pour se lancer.

Forfait EXPERT — 12,99 € par mois. C'est notre forfait le plus recommandé.
Jusqu'à 20 livres par mois, 22 agents IA, accès aux modules illustrés maternelle et histoires du soir, Cover Studio Pro, et la fiche KDP automatique.

Forfait AUTEUR — 59 € par mois.
Livres illimités, 30 agents IA, traductions 10 langues, KDP Pilot, priorité de génération, et tous les modules premium. C'est le forfait des auteurs qui veulent industrialiser leur catalogue.

Et bien sûr, nous proposons aussi les forfaits annuels avec une économie affichée directement sur la page Forfaits.`,
  },
  {
    title: '12. Sécurité, sauvegarde & clés API (8:55 → 9:15)',
    duration: '~20 s',
    body: `Vos projets sont sauvegardés dans le cloud, chiffrés, avec RLS — vous seul y avez accès.
Vous pouvez à tout moment repartir d'un brouillon, réouvrir un livre depuis "Mes projets", ou repartir de zéro avec le bouton "Nouveau livre".
Vous restez maître de vos données, de vos clés API, et de vos livres.`,
  },
  {
    title: '13. Conclusion — Bienvenue chez EbookStudio (9:15 → 10:00)',
    duration: '~45 s',
    body: `Voilà, vous avez fait le tour de la V3.
De l'idée au livre imprimé, de la couverture à la fiche Amazon, du français à 10 langues — tout est là, dans une seule maison d'édition numérique, pensée pour vous faire gagner du temps, de la qualité et de la sérénité.

Si vous nous rejoignez aujourd'hui, sachez que vous êtes chez vous : notre équipe est disponible, notre communauté est bienveillante, et nous sommes là pour vous accompagner à chaque étape de votre aventure d'auteur.

Vous vouliez quelque chose de grandiose — nous l'avons construit. Merci de votre confiance, prenez soin de vous, et à très vite dans EbookStudio Pro V3.
— Georges, fondateur d'EbookStudio.`,
  },
];

export default function V3ScriptHeygenPage() {
  const fullText = useMemo(
    () =>
      SECTIONS.map((s) => `${s.title}\n(${s.duration})\n\n${s.body}`).join('\n\n---\n\n'),
    [],
  );

  const copyAll = async () => {
    await navigator.clipboard.writeText(fullText);
    toast.success('Script copié dans le presse-papiers');
  };

  const download = () => {
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script-heygen-ebookstudio-v3.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Video className="h-6 w-6 text-[#008296]" />
              <h1 className="text-3xl font-bold text-[#232F3E]">Script vidéo HeyGen — V3 (10 min)</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Présentation complète d'EbookStudio Pro V3 : intro personnelle, tour complet des onglets, 3 forfaits, et mot d'accueil final. Prêt à coller dans HeyGen.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={copyAll} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" /> Copier
            </Button>
            <Button onClick={download} className="gap-2 bg-[#008296] hover:bg-[#006d7e]">
              <Download className="h-4 w-4" /> Télécharger .txt
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Durée cible : 10 minutes</Badge>
          <Badge variant="secondary">Ton : chaleureux, professionnel</Badge>
          <Badge variant="secondary">Voix : Georges — fondateur</Badge>
          <Badge variant="secondary">Format HeyGen : avatar + slides</Badge>
        </div>

        {SECTIONS.map((s, i) => (
          <Card key={i} className="border-l-4 border-l-[#008296]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{s.title}</span>
                <Badge variant="outline">{s.duration}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-[#232F3E] leading-relaxed">{s.body}</p>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-[#FFF7E6] border-[#FF9E2D]">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-[#232F3E] mb-2">💡 Conseils tournage HeyGen</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-[#232F3E]">
              <li>Sélectionnez un avatar réaliste + voix française naturelle (ex : Antoine, Julien).</li>
              <li>Divisez le script en 13 scènes correspondant aux 13 sections ci-dessus.</li>
              <li>Ajoutez des captures d'écran de la V3 en B-roll (Plan, Écrire, Habiller, Publier).</li>
              <li>Sous-titres FR activés — 80 % des vues se font sans son.</li>
              <li>Vignette : votre visage + le titre "EbookStudio V3 en 10 minutes".</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
