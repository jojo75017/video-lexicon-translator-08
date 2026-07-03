## Contexte

Deux besoins :
1. **Templates Voyage/Cuisine « introuvables »** dans l'onglet Modèles.
2. **Une image par chapitre** pour illustrer les ebooks.

## Constat après vérification

**1. Templates** — Voyage et Cuisine sont bien présents (« Guide de Voyage Ultime », « L'Art de la Cuisine Gastronomique »), mais **invisibles à l'œil** : les 19 modèles partagent seulement **4 images génériques** (guide/business/fiction/memoir). Le modèle Cuisine affiche l'image « Business Strategy », le modèle Voyage un cadre manuscrit → impossible de les reconnaître.

**2. Image par chapitre** — La fonctionnalité **existe déjà** : onglet Habiller → Images → « Générateur d'images » → « Générer toutes les images de chapitres » (1 image par chapitre, insertion dans le contenu, sauvegarde en bibliothèque). Elle fonctionne avec l'IA intégrée si aucune clé OpenAI n'est fournie. Elle est simplement **peu visible/mal expliquée**.

## Plan

### Partie A — Vignettes de templates dédiées (le vrai correctif visuel)

1. Générer une image photoréaliste par catégorie dans `src/assets/templates/` (priorité Voyage + Cuisine, puis les 17 autres), fidèle à chaque thème :

```text
voyage → valise/passeport/carte    cuisine → plats dressés/ingrédients
aquariophilie → aquarium planté     business → bureau moderne
enfants → univers illustré doux     roman → ambiance littéraire
devperso → lever de soleil          scifi → cosmos futuriste
sante → bien-être/yoga              finance → graphiques/investissement
parentalite → famille               marketing → écrans/croissance
fitness → sport                     romance → ambiance chaleureuse
thriller → atmosphère sombre        fantasy → paysage épique
photographie → appareil photo       jardinage → potager
spiritualite → méditation/lumière
```

2. Dans `src/data/ebookTemplates.ts` : importer chaque nouvelle image et remplacer le champ `image` de chaque template par sa vignette dédiée.
3. Vérifier le rendu de l'onglet Modèles (chaque carte distincte et reconnaissable).

### Partie B — Rendre « 1 image par chapitre » évident

1. Vérifier que « Générer toutes les images de chapitres » produit bien 1 image/chapitre et l'insère (fonction déjà en place, à contrôler en conditions réelles).
2. Améliorer la **découvrabilité** : texte d'intro clair dans le générateur (« 1 image générée automatiquement par chapitre, insérée dans le texte »), et rendre l'entrée de menu plus visible depuis le plan / l'onglet Habiller.
3. Confirmer le fonctionnement **sans clé OpenAI** (fallback IA intégrée) pour que tous les abonnés puissent l'utiliser.

## Détails techniques

- Images via l'outil de génération d'images, `.jpg`, importées en ES6 (pas d'externalisation), respect de la charte (photoréalisme strict, ambiance KDP).
- Partie A ne touche que les imports + champ `image` de `ebookTemplates.ts` ; `EbookTemplates.tsx` reste inchangé.
- Partie B est surtout de la vérification + ajustements d'UI/texte ; aucune refonte de la logique de génération.

## Hors-scope

- Pas de changement aux titres, chapitres, ni au menu Genre (déjà corrects).
- Option rapide possible : ne remplacer que les vignettes Voyage et Cuisine plutôt que les 19 — dites-le moi si vous préférez.
</content>
<summary>A) Créer des vignettes photoréalistes dédiées pour chaque template (priorité Voyage & Cuisine) et les câbler dans ebookTemplates.ts. B) Vérifier et rendre visible la génération existante « 1 image par chapitre » (déjà fonctionnelle, y compris sans clé OpenAI).</summary>
</invoke>
