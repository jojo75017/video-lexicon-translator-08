

## Diagnostic

L'utilisateur veut améliorer la page `/offres` par rapport à kdp-rocket.fr sur 2 points précis :
1. **Images d'ebooks pas visibles** — KDP Rocket montre des mockups/captures d'écran de chaque outil, on ne le fait pas (ou mal)
2. **Titres et descriptions des onglets/outils peu clairs** — l'utilisateur ne voit pas facilement les 15 agents et leur fonction

Je dois inspecter ce qui existe déjà pour comprendre l'écart visuel.

## Inspection rapide nécessaire

- `AgentsShowcase.tsx` (créé récemment) — voir s'il a vraiment des images ou juste du texte
- `BonusStack.tsx` — vérifier la présentation visuelle
- Structure actuelle de `SalesPage.tsx` après refonte
- Voir s'il existe des screenshots/mockups dans `/public` qu'on pourrait réutiliser

Sans relancer l'inspection complète (le code a beaucoup bougé), je propose un plan ciblé sur les 2 manques identifiés.

## Plan d'amélioration — Visibilité maximale des outils et résultats

### 1. Refonte `AgentsShowcase.tsx` — Format "vitrine produit"

**Avant** : grille de cartes avec icônes Lucide + texte
**Après** : grille de cartes avec **mockup screenshot réel** de chaque agent

Pour chaque agent (P1 → P15) :
- 📸 **Screenshot mockup** (capture de l'interface réelle) en haut de carte
- 🏷️ Badge numéro (P1, P2…)
- 📝 Titre court : "Agent Briefing", "Agent Plan Détaillé", etc.
- 💡 1 phrase de bénéfice concret (ex : "Génère 10 angles de marché en 30s")
- ⏱️ Temps d'exécution (ex : "30s")

Génération des mockups via IA (nano-banana) ou capture des vraies interfaces.

### 2. Nouveau composant `EbookGallery.tsx` — Vitrine des résultats

Section dédiée **avant** AgentsShowcase pour montrer **ce que ça produit** :
- 🖼️ Galerie de **6 à 9 couvertures d'ebooks** générées par la plateforme (effet "Avant/Après" ou wall of books)
- 📚 Chaque cover cliquable → modal avec titre, description KDP, mots-clés générés, score qualité
- 💰 Stats sous chaque ebook : "BSR #2 847 — 89€/mois passifs"

Cela répond directement à "on ne sait pas où elles se trouvent" : on **MONTRE** les ebooks réels avec leurs métadonnées.

### 3. Nouvelle navigation visuelle `ToolsNavigationBar.tsx`

Barre horizontale sticky **sous le hero** avec les 5 piliers :
```
[ ✍️ Écrire ] [ 🎨 Visuels ] [ 🎙️ Audio ] [ 📊 KDP ] [ 🚀 Marketing ]
```
- Cliquables → scroll vers la section correspondante de AgentsShowcase
- Indique visuellement la richesse de l'outil

### 4. Section "Anatomie d'un ebook généré" — `EbookAnatomy.tsx`

Composant visuel type "infographie" qui montre **toutes les sorties** d'un projet :
- 📖 Manuscrit complet (200 pages)
- 🎨 Couverture pro (front + back + tranche)
- 🔊 Audiobook (5h)
- 📝 Description KDP optimisée
- 🏷️ 7 mots-clés backend
- 📊 3 catégories niches
- 📧 Email de lancement
- 🎯 Calendrier social media

Avec icônes + petits screenshots pour chaque livrable.

### 5. Mise à jour des titres pour clarté maximale

Tous les titres de sections à reformuler en mode **bénéfice direct** :
- "AgentsShowcase" → **"Les 15 agents IA qui rédigent votre ebook"**
- "EbookGallery" → **"Voyez les ebooks créés par nos auteurs"**
- "BonusStack" → **"Tout ce que vous obtenez pour 67€"**
- "PriceComparison" → **"67€ une fois vs 39€/mois chez KDP Rocket"**

## Questions clarifiantes

Avant d'exécuter, 2 décisions importantes :

1. **Pour les mockups d'agents** : 
   - Option A — Génération IA de mockups stylisés (rapide, joli, pas 100% fidèle)
   - Option B — Vraies captures d'écran à fournir par vous (fidèle mais demande votre travail)
   - Option C — Les deux (mockups IA pour les écrans + vos vraies captures pour 3-4 agents phares)

2. **Pour la galerie d'ebooks** :
   - Option A — Couvertures générées par IA (3 styles : roman, business, développement perso)
   - Option B — Vrais ebooks publiés (avez-vous des ASIN/captures Amazon à montrer ?)

## Livrables prévus

- **Refonte** : `src/components/sales/AgentsShowcase.tsx` (cartes avec mockups)
- **Nouveau** : `src/components/sales/EbookGallery.tsx` (galerie de résultats)
- **Nouveau** : `src/components/sales/ToolsNavigationBar.tsx` (barre piliers)
- **Nouveau** : `src/components/sales/EbookAnatomy.tsx` (infographie livrables)
- **Modifié** : `src/pages/SalesPage.tsx` (intégration + titres clarifiés)
- **Generated** : ~9 images mockups via nano-banana si Option A choisie

## Estimation
2-3h selon options choisies. Résultat : page **ultra-visuelle** où le visiteur **voit** chaque outil et chaque résultat, sans avoir à lire.

