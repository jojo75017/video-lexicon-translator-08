## Plan : Livres Pédagogiques avec Schémas et Graphiques

### 1. Architecture Pédagogique (Phase Éditoriale)
- **Structure recommandée** : Introduction → Concept théorique → Schéma explicatif → Exemple concret → Exercice pratique → Synthèse visuelle.
- **Règle des 3 niveaux** : Chaque chapitre doit avoir (a) un schéma de synthèse global, (b) 2-4 graphiques de détail, (c) une infographie récapitulative finale.
- **Contrôle de volume** : ~250 mots par page pour que les schémas ne noient pas le texte.

### 2. Types de Visuels à Générer
| Type | Usage | Format |
|------|-------|--------|
| Schéma conceptuel | Vue d'ensemble du chapitre | PNG, largeur 1200px |
| Graphique de processus | Étapes, workflows, chronologies | PNG ou SVG |
| Tableau comparatif | Comparaisons, avant/après | PNG |
| Infographie récap | Page de fin de chapitre | PNG, carré ou vertical |
| Mind map | Vision globale du livre | PNG |

### 3. Pipeline de Création Proposé

**Étape 1 — Génération du manuscrit**
- Utiliser le pipeline P1-P15 existant avec une contrainte supplémentaire : chaque section doit être annotée avec un tag `[VISUEL: type-schéma]` là où un graphique est nécessaire.

**Étape 2 — Extraction des briefs visuels**
- Un agent dédié lit le manuscrit et génère pour chaque tag un brief technique : sujet, éléments clés, style (minimaliste, couleurs), dimensions.

**Étape 3 — Génération des visuels**
- Utiliser l'Imagen 3 existant (KDP Cover AI) avec des prompts structurés : "Diagramme éducatif minimaliste montrant X en 3 étapes, fond blanc, couleurs teal et orange, style flat design..."

**Étape 4 — Assemblage**
- Insérer les images générées dans le flux du texte au niveau des tags.
- Exporter en PDF KDP-compliant (marge respectée, image haute résolution 300 DPI).

### 4. Implémentation Technique Possible

**Option A — Léger (recommandé pour commencer)**
- Ajouter un champ "Type de visuel" dans le générateur de chapitres (badge schéma/graphique/tableau).
- Générer les visuels manuellement via l'outil Cover AI existant, puis upload dans l'éditeur de chapitre.

**Option B — Automatisé**
- Nouveau module "Pédagogie Visuelle" avec :
  - Détection automatique des concepts complexes dans le texte (via Gemini).
  - Génération automatique du brief visuel.
  - Génération par lot des images (jusqu'à 20 par livre).
  - Prévisualisation WYSIWYG du livre avec images positionnées.

### 5. Contrôle Qualité
- Vérifier que chaque schéma a une légende explicite.
- Vérifier la lisibilité en noir et blanc (impression KDP) — éviter les dégradés subtils.
- Respecter la règle : 1 visuel toutes les 2-3 pages maximum pour ne pas surcharger.

### 6. Livrables
- Manuscrit textuel enrichi de tags visuels.
- Bibliothèque d'images générées (bucket `ebook-images`).
- PDF final prêt KDP avec images intégrées à 300 DPI.

---

**Recommandation de démarrage** : Commencer par l'Option A sur un chapitre test pour valider la qualité des schémas générés avant d'automatiser.
