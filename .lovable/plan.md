# Détails du livre : listes déroulantes + remplissage automatique

Aujourd'hui, à l'étape 1 de la couverture (`/v3/couverture-express`), les champs « Lecteurs visés », « Époque », « Lieu principal », « Personnage ou objet central », « Émotion recherchée », « Éléments obligatoires » et « Éléments interdits » sont des cases vides : rien n'indique quoi écrire, et le titre et le synopsis déjà saisis ne servent à rien pour les remplir.

## 1. Chaque champ propose une liste de choix

Les sept champs deviennent des champs à liste déroulante :

- on clique, on voit une liste d'exemples concrets adaptés au genre choisi (roman, thriller, romance, jeunesse, biographie, guide…) ;
- la liste défile si elle est longue ;
- on peut toujours écrire son propre texte à la place d'un choix proposé (rien n'est imposé).

Exemples de propositions :

- Lecteurs visés : adultes, jeunes adultes, enfants 3-7 ans, enfants 8-12 ans, adolescents, familles, lecteurs professionnels…
- Époque : aujourd'hui, années 1940, années 1980, XIXe siècle, Moyen Âge, futur proche, intemporel…
- Lieu principal : Paris, village de campagne, bord de mer, montagne, forêt, grande ville la nuit, maison de famille, bureau moderne…
- Personnage ou objet central : une femme de dos, un homme face à l'horizon, un enfant et son animal, une clé ancienne, une lettre, une porte entrouverte, un objet symbolique seul…
- Émotion recherchée : curiosité, tension, nostalgie, espoir, tendresse, mystère, confiance…
- Éléments obligatoires / interdits : suggestions courantes (aucun visage reconnaissable, pas de texte dans l'image, pas de violence, pas d'arme…).

## 2. Un bouton qui devine tout à partir du titre et du synopsis

Sous le synopsis, un bouton orange bien visible : **« Remplir automatiquement à partir de mon titre et de mon synopsis »**.

- Il lit le titre, le sous-titre, le synopsis et le genre, puis remplit les sept champs avec ce qu'il en déduit (public, époque, lieu, sujet central, émotion, à inclure, à éviter).
- Aucune image n'est créée à ce moment-là : c'est de la lecture de texte, donc aucune image incluse n'est consommée.
- Chaque champ rempli reste modifiable ; un lien « Tout effacer » remet les sept champs à vide.
- Le bouton n'est actif qu'à partir d'un synopsis d'environ 20 caractères, avec un message clair sinon.
- Si l'analyse échoue, un message simple s'affiche et la saisie manuelle continue normalement.

## 3. Ce qui ne change pas

Le synopsis reste un champ libre, la suite du parcours (direction artistique, confirmation avant génération, éditeur, exports Kindle et broché) est inchangée, ainsi que les prix, les paiements, la base, la sécurité, les calculs KDP et le module V4.

## Détails techniques

- Nouveau fichier `src/data/coverDetailSuggestions.ts` : listes de suggestions par champ, avec variantes selon le genre `EXPRESS_GENRES`.
- Nouveau composant `src/components/cover-editor/SuggestInput.tsx` : champ texte + liste déroulante scrollable (base shadcn `Popover` + `Command`), valeur libre autorisée.
- `src/pages/v3/CouvertureExpressPage.tsx` : les sept `Input` deviennent des `SuggestInput` ; ajout du bouton de remplissage automatique et du lien de remise à zéro.
- Nouvelle fonction edge `cover-book-details` (analyse texte uniquement, `supabase.auth.getUser()`, modèle texte de la passerelle IA, réponse JSON avec les sept clés), sur le même modèle que `cover-brief` : aucun débit de `cover_pro_credits`, aucune écriture en base.
- Réutilisation du chemin existant `cover-visual-prompt` inchangée : les champs remplis alimentent déjà la direction artistique.

## Vérification

Typecheck, tests existants, puis test navigateur authentifié sur `/v3/couverture-express` : saisie d'un titre et d'un synopsis, remplissage automatique des sept champs, ouverture d'une liste déroulante, saisie libre, puis passage à l'étape 2 sans génération d'image.
