## Plan de correction

Je vais rendre la configuration IA impossible à manquer dans le Hub V3.

## 1. Bloc visible « Clés API & Modèles » dans le Parcours

Dans `src/components/admin/EditionWorkflow.tsx`, remplacer la simple carte actuelle par un bloc visible et clair qui affiche directement :

- Le fournisseur actif : Gemini, Claude, OpenAI ou OpenRouter.
- Le champ de clé API en accès direct, sans devoir chercher dans un popup.
- Le bouton **Tester / Valider la clé** visible à côté du champ.
- Le statut : clé manquante, format invalide, clé valide, test en cours, test échoué.
- Si OpenRouter est choisi : le sélecteur de modèle OpenRouter visible sous la clé.

## 2. Garder le deuxième emplacement demandé

Conserver aussi :

- Le popup actuel avec `EbookSettingsPanel` pour les réglages complets.
- Le bouton flottant global `Choisir mon IA · Clés API`, déjà présent sur `/hub-v3`.

Donc il y aura bien deux accès :

```text
Parcours Hub V3
├─ Bloc visible : fournisseur + clé + modèle + test
└─ Popup complet : tous les réglages avancés
```

## 3. Factoriser pour éviter les doublons cassés

Créer un petit composant réutilisable côté frontend, par exemple `ApiProviderQuickSettings`, qui reprend la logique déjà présente dans `EbookSettingsPanel` :

- `getProvider`, `setProvider`
- `getProviderKey`, `setProviderKey`
- `validateKeyFormat`, `sanitizeKey`
- `OPENROUTER_MODELS`, `getOpenRouterModel`, `setOpenRouterModel`
- test réel des clés API, avec les mêmes endpoints déjà utilisés dans `EbookSettingsPanel`

Ce composant sera utilisé dans `EditionWorkflow.tsx`, sans modifier la logique backend ni les secrets.

## 4. Curseur chapitres + mots

Dans la section **Structure du livre**, ajouter le vrai contrôle demandé :

- Curseur du nombre de chapitres de 3 à 40.
- Valeur du nombre de chapitres visible et éditable.
- Champ **mots / chapitre** juste à côté.
- Total calculé automatiquement : `chapitres × mots/chapitre`.
- Estimation de pages basée sur ce total.

Cela rendra clair où régler le nombre de chapitres et où mettre le nombre de mots.

## 5. Validation

Après implémentation :

- Vérifier que le bloc clés/modèles apparaît directement dans `/hub-v3?tab=parcours`.
- Vérifier qu’on peut sélectionner OpenRouter et voir le choix du modèle.
- Vérifier que le bouton de test/validation est visible à côté de la clé.
- Vérifier que le curseur chapitres et le champ mots/chapitre sont côte à côte et modifient le total visé.

## Hors périmètre

- Pas de changement de prix V3/V4.
- Pas de modification des agents.
- Pas de stockage serveur des clés : on garde le fonctionnement BYOK actuel côté utilisateur.
- Pas de nouvelle donnée fictive.