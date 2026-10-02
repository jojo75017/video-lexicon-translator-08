# Bannière « EbookStudio écrit et publie pour vous » (style BookPilot, en français)

## Objectif
Sur l'accueil V3 connecté (`/v3`, abonnés uniquement), améliorer la section « EbookStudio change tout : » en ajoutant, en tête de cette section, une grande bannière sombre inspirée de la capture BookPilot : titre en très grand, rangée de couvertures de livres, bandeau de badges — sans bandeau rouge, sans dollars, en euros et en français parfait.

## Le texte (exact, en HTML — jamais généré dans l'image)
- Titre principal : **« EbookStudio écrit et publie pour vous des livres KDP complets et rentables »**
- Bandeau dans le titre (comme « In Under 60 Seconds! » dans la référence) : **« en moins de 30 minutes ! »**
- Badges du bas (4) : « Écrit en quelques minutes », « Couverture professionnelle », « 100 % optimisé KDP », « Prêt à publier sur Amazon »

Pourquoi le texte en HTML : l'IA d'images fait régulièrement des fautes sur les accents français (é, è, ç). Le texte réel reste net sur mobile, lisible au zoom et exact à 100 %.

## Image générée (sans texte lisible)
- Une image photoréaliste premium : 5 couvertures de livres debout en éventail sur fond bleu nuit profond, thèmes variés (revenus/passif, développement personnel, finance, productivité, business en ligne), lumière dorée, reflets — dans les couleurs EbookStudio (bleu nuit + orange), **aucun mot lisible sur les couvertures** (titres suggérés par des blocs abstraits), aucune marque.
- Taille : large (paysage ~1600×900), tier `premium`, contraste suffisant pour poser le texte par-dessus avec un léger voile sombre en haut.
- Fichier : `src/assets/v3-kdp-hero-books.jpg`, import direct (pas de lovable-assets).

## Intégration
1. Nouveau composant `src/components/v3public/V3KdpHeroBanner.tsx` :
   - Carte sombre arrondie (bleu nuit `--v3-joy-ink`), padding généreux, ombre douce — même langage visuel que le reste de la page.
   - Titre serif blanc avec « en moins de 30 minutes ! » en orange/doré dans un bandeau arrondi, comme la référence.
   - Image des couvertures en pleine largeur sous le titre.
   - Rangée de 4 badges (icônes lucide + libellés) dans un bandeau bas, style cohérent.
   - Responsive : titre réduit, badges en 2×2 sur mobile.
2. Dans `V3HomePage.tsx` : rendre `V3KdpHeroBanner` en tête de la section « EbookStudio change tout » (au-dessus de la carte orange actuelle), toujours sous `{user && …}` — les visiteurs ne la voient jamais.
3. Le reste de la section (puces, calcul en euros) reste inchangé.

## Vérifications
- Build vérifié.
- Vérification navigateur avec la session abonné (desktop 1280 px + mobile 390 px) : bannière visible, texte français exact, aucune faute, mobile lisible ; visiteur non connecté : bannière absente.
- Contrôle visuel de l'image générée (pas de texte parasite lisible, pas d'artefacts) avant intégration.

## Hors périmètre
- Rien publié. Aucun changement de prix, de tunnel ni de contenu visiteur.
