
# Plan — Studio Couverture : auto-pré-remplissage + PDF guide + V3

Trois livrables, séparés et indépendants.

---

## 1. ✅ Maintenant — Auto-remplissage depuis les paramètres du livre

**Problème** : aujourd'hui, dans l'onglet "Couverture IA", l'utilisateur doit re-saisir titre, sous-titre, auteur, genre et description alors que ces infos existent déjà dans le projet (Tableau de bord / Configuration du livre).

**Ce qu'on fait**
- Le composant `EbookAICoverStudio` reçoit déjà `ebookTitle`, `authorName` et `initialDescription`. On élargit ses props pour accepter aussi : `initialSubtitle`, `initialGenre`, `initialTargetAudience`, `initialBookDescription`.
- Les `useState` internes (`title`, `subtitle`, `author`, `genre`, `description`) sont initialisés avec ces valeurs au montage. L'utilisateur peut toujours les modifier librement (les champs restent éditables).
- `UnifiedCoverStudio` est élargi de la même manière pour faire transiter ces props.
- Dans `EbookPlannerPage.tsx`, les 4 appels à `<UnifiedCoverStudio … />` reçoivent `bookSubtitle`, `bookDescription`, `genre`, `targetAudience` depuis le state global du planner.
- Un petit badge "📘 Pré-rempli depuis votre projet" s'affiche en haut du formulaire pour rassurer (et matcher le discours vidéo).

**Impact** : zéro régression — c'est uniquement une valeur par défaut, pas un verrou.

---

## 2. 🎁 Maintenant — PDF guide "Studio Couverture IA" (très beau)

**Objectif** : un PDF de présentation/guide du Studio Couverture IA, livré dans `/mnt/documents/`, à utiliser comme support marketing/vidéo. Style éditorial premium, avec petits livres en illustration éparpillés (motif récurrent), palette KDP (Teal #008296 / Orange #FF9E2D / fond crème), typographie sérif moderne + sans-serif pour le corps.

**Contenu (~6-8 pages, format A4 portrait)**
1. Couverture : grande typo "Studio Couverture IA", baseline "De l'idée au best-seller Amazon KDP", petits livres en motif délicat, logo/marque
2. Le problème : "Une couverture amateur = 0 vente" (citations Amazon, statistiques visuelles)
3. La promesse : 3 modes (IA Express OpenRouter, Format KDP, 4ᵉ de couverture) — pictogrammes
4. Walkthrough en 3 étapes : Pré-rempli → Style/registre → Génération (mini-captures stylisées)
5. Conformité KDP : dimensions, tranche, marges, modulo 10 (schéma technique élégant)
6. Galerie de styles : 6 vignettes carrées (Cinématique, Premium-or, Fantasy, etc.)
7. Clé API : OpenRouter en BYOK (encart pédagogique)
8. Dos : motto + signature

**Approche technique** : ReportLab Platypus avec styles custom (sérif Cormorant ou Playfair pour titres, Inter pour corps), formes vectorielles dessinées au canvas pour les "petits livres" (rectangles + tranche colorée), palette HSL cohérente avec la charte KDP. QA visuelle obligatoire : conversion PDF → JPG, inspection de chaque page (overlaps, marges, contraste), itérations jusqu'à zéro défaut.

**Livraison** : `/mnt/documents/studio-couverture-ia-guide.pdf` + balise `<presentation-artifact>` pour téléchargement direct.

---

## 3. 🔮 V3 (à valider plus tard) — Export PDF couverture complète

**Vision** : un seul PDF KDP-ready contenant recto + tranche + verso en une seule planche, aux dimensions exactes Amazon (largeur = recto + tranche + verso, hauteur = format choisi + fonds perdus 3,2 mm).

**Pré-requis techniques à valider en V3**
- Calcul tranche : (nb pages / 444) pouces pour papier blanc 60 gsm (formule KDP officielle, déjà en partie dans `KdpCoverStudio`).
- Composition : recto IA (image générée) à droite, tranche centrale (titre + auteur verticaux), verso à gauche (texte 4ᵉ de couv + ISBN + code-barres + résumé éditeur).
- Génération PDF côté client : `pdf-lib` + `canvas` pour fusionner les 3 visuels en une planche unique 300 DPI CMJN-safe.
- Téléchargement direct prêt à uploader sur KDP.

**Décisions à prendre avant build V3**
- Code-barres ISBN : généré automatiquement ou laissé à KDP ?
- Format CMJN : conversion côté serveur (edge function ImageMagick) ou laisser RVB (KDP accepte) ?
- Templates de mise en page verso : combien de variantes ?

→ Plan V3 détaillé à produire quand la V2 sera stabilisée.

---

## Ordre d'exécution (à l'implémentation)

1. PDF guide (livrable immédiat pour la vidéo) — ~10 min
2. Auto-remplissage props (3 fichiers touchés : `EbookAICoverStudio.tsx`, `UnifiedCoverStudio.tsx`, `EbookPlannerPage.tsx`) — ~10 min
3. V3 : plan séparé sur demande

## Fichiers concernés (étape 1 code)

- `src/components/ebook/EbookAICoverStudio.tsx` — ajout props + init useState
- `src/components/ebook/UnifiedCoverStudio.tsx` — passe-plat de props
- `src/pages/EbookPlannerPage.tsx` — 4 instances à enrichir

## Hors scope explicite

- Pas de refonte UI du studio
- Pas de modification de l'edge function `generate-ai-cover`
- Pas de toucher au système BYOK OpenRouter (qui fonctionne)
