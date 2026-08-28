import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, Video } from 'lucide-react';
import { toast } from 'sonner';
import { BackButton } from "@/components/v3/BackButton";

const SECTIONS: { title: string; duration: string; body: string }[] = [
  {
    title: '1. Ouverture — Qui je suis (0:00 → 0:40)',
    duration: '~40 s',
    body: `Bonjour et bienvenue ! Je suis Georges, le fondateur d'EbookStudio.
Depuis plusieurs années, j'accompagne des auteurs, des formateurs et des entrepreneurs qui veulent publier leurs livres sur Amazon KDP sans y passer des mois et sans se ruiner en outils.

Aujourd'hui, je vais vous faire visiter, de A à Z, la version 3 d'EbookStudio — pensée non pas comme un logiciel, mais comme une véritable maison d'édition en ligne.`,
  },
  {
    title: '2. Avant de commencer — Votre clé Gemini gratuite (0:40 → 1:30)',
    duration: '~50 s',
    body: `Un point très important avant tout : pour utiliser la V3 sans limite, vous devez brancher votre propre clé Gemini gratuite. C'est gratuit, ça prend 60 secondes, et cela vous appartient.

Rendez-vous sur aistudio.google.com/apikey, connectez-vous avec votre compte Google, cliquez sur "Create API Key", copiez la clé qui commence par "AIza", puis collez-la dans EbookStudio depuis l'onglet "Ma clé Gemini". Si le lien est bloqué par votre navigateur ou par un aperçu intégré, copiez-le simplement et collez-le dans un nouvel onglet. C'est tout.

Pourquoi ? Parce que Google offre un quota généreux sur Gemini — largement suffisant pour écrire des livres entiers gratuitement — et parce que vos crédits vous appartiennent, personne ne peut les épuiser à votre place. Sans cette clé, la V3 fonctionne en mode découverte ; avec la clé, elle se déverrouille intégralement.`,
  },
  {
    title: '3. Recherche KDP — KDP Pilot & Espion ASIN (1:30 → 2:15)',
    duration: '~45 s',
    body: `Avant même d'écrire une ligne, la V3 vous fait passer par la recherche KDP.
KDP Pilot audite votre projet, votre fiche produit, vos mots-clés, vos catégories, et vos concurrents. L'Espion ASIN décortique n'importe quel livre Amazon pour comprendre ce qui fait sa force.

Résultat : vous publiez un livre pensé pour Amazon, pas contre Amazon.`,
  },
  {
    title: '4. Onglet PLAN — Structurer jusqu\'à 60 chapitres (2:15 → 3:00)',
    duration: '~45 s',
    body: `Tout commence dans l'onglet Plan.
Titre, sous-titre, auteur, synopsis, public cible, style — la V3 construit un sommaire cohérent jusqu'à 60 chapitres. Vous éditez, réorganisez, et les pages "À propos de l'auteur", "Remerciements" et "Note pour avis" sont intégrées automatiquement.`,
  },
  {
    title: '5. Onglet ÉCRIRE — 30 agents IA & Bible d\'univers (3:00 → 3:50)',
    duration: '~50 s',
    body: `Une fois le plan validé, place à l'écriture.
Trente agents IA travaillent en cascade : plan, rédaction, cohérence, relecture typographique française, marketing… La "Bible de l'univers" et "l'Arbre narratif" gardent en mémoire personnages, lieux et événements, chapitre après chapitre.

Vous pausez, reprenez, régénérez, et tout est sauvegardé dans le cloud, dans "Mes livres".`,
  },
  {
    title: '6. Livres enfants — Maternelle & Histoires du soir (3:50 → 4:40)',
    duration: '~50 s',
    body: `Deux modules dédiés aux livres illustrés jeunesse.
"Album maternelle 3-6 ans" : vous donnez un titre, un synopsis, le nombre d'histoires et de mots — la V3 génère histoires, illustrations photoréalistes, couverture et 4e de couverture, au format carré 21,59 × 21,59 cm exigé par Amazon KDP.

"Histoires du soir 3-7 ans" : ton apaisant, aquarelles, rythme adapté au coucher. Mentions légales, copyright, dédicace, remerciements : tout est intégré.`,
  },
  {
    title: '7. Cover Studio Pro & BD Studio (4:40 → 5:30)',
    duration: '~50 s',
    body: `Cover Studio Pro génère première de couverture, quatrième, et calcule le dos automatiquement en fonction du nombre de pages. Export PNG haute qualité, aux gabarits Amazon exacts, sans bandes ni marges parasites.

Et pour les bandes dessinées, BD Studio Pro — inclus dans le forfait Édition — propose un mode professionnel avec cases, bulles, et rendu print prêt pour KDP.`,
  },
  {
    title: '8. Livres spéciaux — Documentaires, Atlas, Cuisine, Voyage, Sagas (5:30 → 6:20)',
    duration: '~50 s',
    body: `La V3 sait aussi produire des livres à structure complexe.
Documentaires, atlas, livres de cuisine, guides de voyage — chaque format a son gabarit et ses agents dédiés.

Et pour les sagas, le module "Univers multi-volumes" génère 3 à 5 tomes cohérents en mode Standard, jusqu'à 10 tomes en Éditeur, avec Bible partagée entre les volumes.`,
  },
  {
    title: '9. Onglet PUBLIER — Fiche Amazon KDP (6:20 → 7:00)',
    duration: '~40 s',
    body: `Publier, ce n'est pas juste envoyer un fichier.
La V3 génère titre optimisé, sous-titre, description vendeuse, 7 mots-clés Amazon et 3 catégories, à partir du contenu réel de votre livre. Vous recevez un fichier .txt prêt à copier-coller dans KDP.`,
  },
  {
    title: '10. Onglet VENDRE — Marketing & outils offerts (7:00 → 7:50)',
    duration: '~50 s',
    body: `Un livre publié, c'est bien. Un livre qui se vend, c'est mieux.
La V3 embarque un module marketing complet : séquences email, posts réseaux sociaux, pages de vente, challenge 7 jours.

Et surtout, quatre outils offerts à TOUS les forfaits : AMS Keyword Booster (200+ mots-clés Amazon Ads), Espion Concurrents, Analyseur de catégories KDP (19 000 catégories), et KDP Keywords façon KDSpy. Rendez-vous dans /v3/outils/offerts.`,
  },
  {
    title: '11. Traductions 10 langues (7:50 → 8:20)',
    duration: '~30 s',
    body: `Votre livre mérite d'être lu partout.
Le module Traduction transforme votre manuscrit en 10 langues — anglais, espagnol, italien, allemand, portugais, néerlandais, et plus — en gardant ton, style et cohérence. Vos revenus KDP se multiplient sans réécrire une ligne.`,
  },
  {
    title: '12. Communauté — 220+ discussions actives (8:20 → 8:50)',
    duration: '~30 s',
    body: `Vous n'êtes pas seul.
La communauté EbookStudio, accessible depuis /communaute, réunit déjà plus de 220 discussions et près de 300 réponses sur tout ce qui touche à l'écriture, à la publication KDP, au marketing et aux outils de la V3. Posez vos questions, partagez vos réussites, apprenez des autres auteurs.`,
  },
  {
    title: '13. Les 2 forfaits — mensuel & annuel (8:50 → 9:35)',
    duration: '~45 s',
    body: `Parlons tarifs — c'est clair, c'est transparent.

DÉBUTANT — 9,99 € par mois (ou en annuel avec une économie affichée).
10 livres par mois, 18 agents IA, tout le workflow de base.

EXPERT — 12,99 € par mois. Notre forfait le plus recommandé.
20 livres par mois, 22 agents IA, modules illustrés maternelle et histoires du soir, Cover Studio Pro, fiche KDP auto.

AUTEUR — 59 € par mois.
Livres illimités, 30 agents IA, traductions 10 langues, KDP Pilot, BD Studio Pro, univers multi-volumes, priorité de génération.

Paiement par carte, ou par PayPal — y compris en 3 fois sans frais sur les 2 forfaits.`,
  },
  {
    title: '14. Sécurité, sauvegarde & vos données (9:35 → 9:50)',
    duration: '~15 s',
    body: `Tout est sauvegardé dans le cloud, chiffré, avec RLS. Vous seul accédez à vos livres, à vos clés API, à vos brouillons. Vous restez maître de tout.`,
  },
  {
    title: '15. Conclusion — Bienvenue chez EbookStudio (9:50 → 10:00)',
    duration: '~10 s',
    body: `Voilà, vous avez fait le tour.
Si vous nous rejoignez aujourd'hui, sachez que vous êtes chez vous : notre équipe est disponible, notre communauté est bienveillante, et nous sommes là pour vous accompagner à chaque étape.

Merci de votre confiance, prenez soin de vous, et à très vite dans EbookStudio Pro V3.
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
      <div className="max-w-6xl mx-auto px-4 pt-4"><BackButton /></div>
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Video className="h-6 w-6 text-[#008296]" />
              <h1 className="text-3xl font-bold text-[#232F3E]">Script vidéo HeyGen — V3 (10 min)</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Présentation complète de la V3 mise à jour : clé Gemini gratuite obligatoire, KDP Pilot, 30 agents, livres jeunesse, BD Studio Pro, univers multi-volumes, communauté 220+, PayPal 3×, 2 forfaits mensuels & annuels.
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
              <li>15 scènes = 15 sections ci-dessus. Ajoutez une capture d'écran de la V3 par scène.</li>
              <li>Scène 2 (clé Gemini) : montrer aistudio.google.com/apikey + copier/coller dans EbookStudio.</li>
              <li>Sous-titres FR activés — 80 % des vues se font sans son.</li>
              <li>Vignette : votre visage + "EbookStudio V3 en 10 minutes".</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
