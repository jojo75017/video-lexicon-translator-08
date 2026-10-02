# Bloc « EbookStudio change tout » (en euros) sous le bloc KDP

## Objectif
Ajouter sur l'accueil /v3 des abonnés connectés, juste après le bloc « Amazon verse chaque mois des millions d'euros… » (V3KdpOpportunity), un bloc reprenant la structure de la capture BookPilot fournie : grande carte orange arrondie, visuel produit à gauche, liste de puces et calcul de revenus à droite. Aucun bandeau rouge promotionnel en haut.

## Contenu (reformulé positif, en euros)
- Titre : « EbookStudio change tout : »
- 5 puces positives (icônes de validation, jamais de croix rouges) :
  1. Écrivez un livre complet en quelques jours, à votre rythme.
  2. Créez une couverture professionnelle sans designer.
  3. Ciblez des niches vérifiées, avec des données réelles du marché.
  4. Mettez en page votre livre sans logiciel compliqué.
  5. Préparez et publiez sur Amazon KDP en quelques clics.
- Transition : « EbookStudio vous accompagne à chaque étape — intelligemment et en quelques minutes. »
- Sous-titre : « Réfléchissez-y un instant : »
- Calcul de revenus en euros :
  - « Si un seul de vos livres vous rapporte **5 € par jour** en droits d'auteur, cela représente **150 € par mois**. »
  - « Imaginez maintenant **10 livres**. Cela représente **1 500 € par mois**. »
  - « Imaginez maintenant **100 livres**. Cela représente **15 000 € par mois** — avec des outils qui vous font gagner un temps précieux. »
- Conclusion : « EbookStudio a été conçu pour vous aider à y parvenir — plus rapidement que vous ne l'auriez jamais imaginé. »
- Aucune formulation négative, aucun prix en dollars, aucun lien d'achat vers BookPilot.

## Visuel produit
Générer une image premium (photoréalisme strict, pas de texte lisible) : composition de livres publiés et d'un ordinateur portable dans les couleurs EbookStudio (bleu nuit + orange de la marque), ambiance édition premium. Fichier : `src/assets/v3-kdp-change-everything.jpg` (import direct, pas de lovable-assets).

## Modifications de fichiers
1. **Nouveau** `src/components/v3public/V3KdpChangeAll.tsx` — la section décrite ci-dessus, styles issus des tokens existants (`--v3-joy-orange`, `--v3-joy-ink`, etc.), responsive : visuel au-dessus, texte dessous sur mobile ; en vis-à-vis sur grand écran.
2. `src/pages/v3public/V3HomePage.tsx` — import du composant, rendu `{user && <V3KdpChangeAll />}` immédiatement après `{user && <V3KdpOpportunity />}` (ligne ~96).

## Règles
- Abonnés connectés uniquement (les visiteurs ne voient jamais le bloc).
- Pas de modification des prix, du tunnel, ni d'autres blocs.
- Ne pas publier.

## Vérifications
- Build OK.
- Rendu dans le navigateur avec la session utilisateur : bloc visible connecté sur /v3, absent déconnecté ; lisible à 1920 et 390 px.
