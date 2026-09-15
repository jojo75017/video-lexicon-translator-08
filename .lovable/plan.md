# Plan — Mode « Je raconte mon livre à partir d’un sommaire »

## Objectif
Sur la page **Construire mon sommaire** (`/v3/create`), proposer un second chemin, inverse du chemin actuel : l’auteur part d’un **sommaire** et donne ses **indications de chapitre au fur et à mesure**. Le Génie en tient compte, propose les chapitres suivants, puis le livre se rédige à partir de ce sommaire.

Aujourd’hui, la page force « on écrit d’abord, le sommaire se déduit ». On ajoute l’inverse sans casser l’existant.

## État actuel vérifié
- `V3CreatePage.tsx` : 3 bureaux — ① J’écris → ② Mon sommaire → ③ Mon livre. Démarrage par défaut sur ①.
- `V3OutlineCoBuilder.tsx` : propose les chapitres 3 par 3, garde/reformule/retire, valide. `propose()` exige `sourceText || description || title`. L’UI pousse à « raconter d’abord ».
- Edge function `v3-genie-brief` mode `outline-step` : **déjà capable** de proposer sans récit (`sourceText` vide → utilise `bookDescription`, `sources` laissées vides).
- `V3CreateWizard` : rédige chaque chapitre à partir de l’`objectif` + titre + description ; fonctionne **sans** `sourceText`.
- `suggestChapterCount` renvoie le min (3) quand 0 mot : la cible repose sur `brief.chapters`.

→ Aucune nouvelle route, aucune base, aucune sécurité, aucun paiement, aucun crédit, aucun calcul KDP à toucher. Le backend existe déjà.

## Ce qu’on construit

### 1. Nouvelle entrée sur `/v3/create` (`V3CreatePage.tsx`)
- Dans le bloc d’accueil (à côté de « Je raconte un livre » / « Je raconte ma vie »), ajouter un bouton orange clair : **« Je raconte mon livre à partir d’un sommaire »**.
- Au clic :
  - persiste un drapeau `outlineFirst: true` dans le brief (champ optionnel ajouté à `BookBrief`) ;
  - bascule directement sur le bureau **② Mon sommaire** ;
  - si aucun titre/description n’existe, affiche une petite carte de sujet minimal (titre + 2–3 phrases de description + nombre de chapitres visé) avant d’activer les propositions.

### 2. Mode sommaire-d’abord dans `V3OutlineCoBuilder.tsx`
- Prop `outlineFirst?: boolean` (lue depuis le brief).
- Quand `outlineFirst` et **pas de récit** :
  - masquer les messages « Continuez à raconter à l’étape ① » et les blocs liés aux passages (déjà conditionnés) ;
  - afficher le guidage : *« Décrivez votre projet, puis donnez vos indications de chapitre au fur et à mesure. Le Génie les prend en compte pour proposer les chapitres suivants. »* ;
  - rendre le champ d’indication bien visible (anciennement `note`), renommé **« Mes indications pour les prochains chapitres »**.
- À chaque « Proposer les suivants » : on envoie l’indication comme `message` **et** on l’ajoute à `factMemory` (comme `answerGenie` le fait déjà), afin que les propositions suivantes en tiennent compte.
- Cible de chapitres = `brief.chapters` réglable (entrée existante conservée, 3–40).
- On garde le même enchaînement Garder / Reformuler / Retirer / **Terminer et valider le sommaire**.

### 3. Vers la rédaction
- La validation du sommaire passe sur le bureau **③ Mon livre** comme aujourd’hui (`outlineValidated: true`).
- Le wizard rédige à partir des objectifs + description (déjà possible sans récit). On vérifie simplement que, sans `sourceText`, le prompt de chapitre s’appuie sur l’`objectif` et la description — pas de réécriture structurelle prévue.

### 4. Réutilisabilité & retour
- Le drapeau `outlineFirst` est conservé dans le brouillon local et cloud (`saveBookDraftToCloud` transporte déjà tout le brief), donc reprendre un livre en mode sommaire-d’abord fonctionne après rechargement.
- Ajouter dans l’en-tête du bureau ② un petit rappel de chemin : *« Chemin sommaire-d’abord : vos indications → chapitres proposés → rédaction »*.

## Hors périmètre (inchangé)
Base de données, RLS, paiements, crédits IA, calculs KDP, edge function (déjà compatible), tarifs, V4, biographie. Aucune nouvelle route.

## Vérifications prévues
- `tsgo` (typecheck) sur les fichiers modifiés.
- Lecture du `V3CreatePage` et `V3OutlineCoBuilder` après édition.
- Test Playwright sur `/v3/create` : bouton présent → bascule sur ② → champ d’indication visible → proposition de chapitres sans récit (avec une clé Gemini de test) → validation → affichage du bureau ③.
