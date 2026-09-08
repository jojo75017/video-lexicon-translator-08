# Studio de couvertures premium : rendre le module vraiment professionnel

Le module concerné est celui affiché dans le parcours V3 (« Cover Studio Pro — Couvertures Premium IA »). Aujourd'hui il génère de belles illustrations, mais le titre, le sous-titre et le nom de l'auteur n'apparaissent nulle part sur l'image, les catégories sont trop peu nombreuses, il n'y a aucun choix de style de dessin, et les moteurs d'images sont présentés de façon confuse.

## 1. Titre, sous-titre et nom d'auteur enfin visibles

Un choix clair, en haut du module, avec deux positions :

- **Texte posé par l'app (recommandé, par défaut)** — l'IA produit l'illustration seule, puis l'application écrit le titre, le sous-titre et le nom de l'auteur en typographie parfaitement nette par-dessus. Les lettres ne sont jamais déformées.
- **Texte dessiné par l'IA** — comme aujourd'hui : c'est le moteur qui dessine le texte. Un avertissement honnête précise que les lettres sont souvent tordues, sauf avec une clé Ideogram.

En mode « texte posé par l'app » :

- aperçu immédiat de chaque variation avec les textes en place ;
- trois mises en place au choix : titre en haut, titre centré, titre en bas ;
- bouton « Télécharger la couverture » (image finale avec textes) et bouton « Télécharger l'illustration seule » ;
- test miniature Amazon conservé, mais sur l'image avec les textes, ce qui rend le test enfin utile.

La composition des textes réutilise le moteur de composition déjà en place dans l'éditeur de couverture (mêmes polices, même rendu net) : rien de nouveau à inventer, et aucun appel IA supplémentaire.

## 2. Quelques catégories en plus

Aux 9 catégories actuelles s'ajoutent celles qui manquaient vraiment :

- Jeunesse / album enfants
- Développement personnel
- Policier / Enquête
- Historique
- Santé / Sport

Chacune arrive avec sa propre direction artistique écrite, au même niveau de soin que les catégories existantes.

## 3. Une « sorte d'image » à choisir, en plus de la catégorie

Deuxième ligne de choix, indépendante de la catégorie, avec 7 sortes :

photo réaliste · illustration peinte · aquarelle jeunesse · minimaliste graphique · rendu 3D · dessin BD / ligne claire · vintage rétro.

La catégorie décrit l'univers du livre, la sorte d'image décrit le style de dessin, et les deux se combinent dans la demande envoyée au moteur. La direction artistique retenue reste affichée sous les images, comme aujourd'hui.

## 4. Les moteurs d'images remis au propre

Un seul encadré « Moteurs d'images », qui remplace les deux encadrés actuels, avec **une clé par moteur** et l'ordre de priorité écrit noir sur blanc :

1. **Ideogram** — le seul qui écrit un titre net dans l'image (utile uniquement en mode « texte dessiné par l'IA »). Champ de clé, voyant vert quand la clé est acceptée, coût indicatif.
2. **OpenRouter** — le plus économique. Champ de clé, bouton « Tester » avec crédits restants (déjà en place), et liste de modèles d'images remise à jour : les modèles d'images Gemini actuels remplacent les entrées périmées, dont une qui ne génère pas d'images du tout.
3. **Moteur inclus** — sans aucune clé, la génération continue de fonctionner avec le moteur inclus dans l'abonnement.

Chaque moteur affiche : nom, à quoi il sert, si une clé est enregistrée, et l'état de la clé. Le moteur réellement utilisé lors de la dernière génération reste affiché. La clé OpenRouter déjà saisie ailleurs dans l'application est reprise automatiquement, pour ne pas la retaper.

## Ce qui ne change pas

Base de données, sécurité, calculs KDP, paiements et crédits : aucune modification. Les clés restent enregistrées sur l'appareil de l'abonné et ne sont jamais partagées.

## Détails techniques

- `src/components/admin/CoverStudioPro.tsx` : refonte de l'interface (choix du mode texte, catégories, sortes d'images, encadré moteurs unique, aperçu composé, téléchargements).
- Composition des textes via `src/lib/cover-editor/frontComposition.ts` + `coverTemplates.ts` / `coverFonts.ts`, export local via `coverExports.ts` (aucun appel réseau, aucun crédit).
- Les nouvelles catégories et les 7 sortes d'images sont ajoutées côté client et transmises dans `registrePrompt` / `customPrompt` de la fonction `generate-premium-cover` : le contrat de la fonction reste inchangé.
- Le mode « texte posé par l'app » envoie `noText: true` ; le mode « texte dessiné par l'IA » envoie `noText: false` avec titre, sous-titre et auteur, comme aujourd'hui.
- Clés : `getIdeogramKey` / `setIdeogramKey` et `getOpenRouterImageKey` / `setOpenRouterImageKey` conservés, avec reprise de la clé OpenRouter de `aiWritingService` si elle existe.
- Vérification : typecheck complet, puis génération réelle d'une couverture en mode « texte posé par l'app » avec titre, sous-titre et auteur pour contrôler le rendu et le téléchargement.
