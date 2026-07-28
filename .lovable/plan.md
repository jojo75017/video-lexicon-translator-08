# Mode "Livre illustré maternelle" — Studio & Éditeur uniquement

Ajouter un nouveau parcours de création de livres jeunesse illustrés (type "28 histoires pour la maternelle") réservé aux forfaits **Studio (12,99 €)** et **Éditeur (59 €)**. Le forfait **Auteur (9,99 €)** ne l'a pas.

## 1. Preset "Livre illustré enfant" dans le wizard

Dans `src/components/v3public/V3CreateWizard.tsx`, ajouter un nouveau type de projet :

- **Nom d'auteur** : champ obligatoire, repris tel quel sur la couverture et la page de titre (ex: "Juliette K.Louzou"). Pré-rempli avec le nom d'auteur du profil V3 mais éditable par livre.
- **Format** : recueil d'histoires courtes (10 à 30 histoires de 1-2 pages)
- **Âge cible** : 3-6 ans (maternelle)
- **Ton** : phrases simples, dialogues, morale douce
- **Structure** : 1 illustration pleine page + 1 page de texte par histoire
- **Dimensions KDP** : 21,59 × 21,59 cm (album carré standard)

Si l'utilisateur est sur le forfait Auteur, afficher un lock avec CTA "Passer à Studio pour débloquer".

## 2. Bible du personnage (cohérence visuelle)

Étendre l'étape "Personnages" du wizard pour capturer :
- Nom, âge, description physique détaillée (cheveux, yeux, morphologie)
- Vêtements signatures (ex: t-shirt vert, short bleu)
- Style d'illustration global (Pixar 3D / aquarelle / crayonné)

Cette bible est injectée dans **chaque prompt d'image** pour garantir que le personnage reste identique d'une page à l'autre.

## 3. Nouvel agent P31 "Illustrateur cohérent"

Créer `supabase/functions/agent-illustrator/index.ts` :
- Reçoit : bible du personnage + résumé du chapitre + style
- Génère une image par chapitre via `google/gemini-3-pro-image` (qualité) ou `google/gemini-3.1-flash-image` (rapide)
- Sauvegarde dans le bucket `ebook-images` (existant, public)
- Retourne l'URL pour insertion dans l'export

Activé uniquement si `projectType === 'illustrated_kids'`.

## 4. Export "Album jeunesse"

Adapter `src/lib/export/pdfExporter.ts` :
- Nouveau template "album-carre-21x21"
- **Page de titre** : titre du livre + **nom de l'auteur saisi à l'étape 1**
- **Couverture** : titre + nom d'auteur en bas (comme sur les albums KDP)
- Alternance image pleine page / texte gros caractères (police 18-22 pt, interligne 1.5)
- Marges enfant (2 cm)
- Format carré compatible KDP

## 5. Gating par forfait

Dans `src/config/v3ToolPlans.ts` :
```ts
illustrated_kids_book: {
  tiers: ['studio', 'editeur'],  // pas 'auteur'
  imageQuotaPerBook: 30,
}
```

Quotas d'images inclus :
- **Studio** : 30 images/livre × 20 livres = 600 images/mois
- **Éditeur** : illimité (fair-use ~2000/mois)

## 6. UI forfaits

Dans `src/pages/v3public/V3ForfaitsPage.tsx`, ajouter la ligne feature :
- Auteur : ❌ Non inclus
- Studio : ✅ Jusqu'à 30 illustrations/livre
- Éditeur : ✅ Illustrations illimitées

## Détails techniques

- Modèle image par défaut : `google/gemini-3.1-flash-image` (~0,02 €/image)
- Modèle premium (Éditeur) : `google/gemini-3-pro-image` pour rendu photoréaliste
- Stockage : bucket existant `ebook-images` (public)
- Le prompt inclut systématiquement : `[CHARACTER BIBLE] + [SCENE] + [STYLE] + "consistent character, same face, same outfit across all images"`
- Le champ `author_name` existe déjà sur `ebook_projects` — on le réutilise et on l'injecte dans la couverture + page de titre + métadonnées KDP.

## Ordre de livraison

1. Config forfaits + gating
2. Preset wizard (avec champ auteur obligatoire) + bible personnage
3. Agent illustrateur + upload bucket
4. Export album carré avec couverture + page de titre auteur
5. UI badges "Nouveau · Studio+" sur les forfaits

Je livre les 5 étapes d'un coup si tu valides.
