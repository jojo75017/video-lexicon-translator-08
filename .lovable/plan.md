# Sommaire IA : le vrai atelier de plan de livre

Le sommaire IA sait aujourd'hui proposer 3 chapitres à la fois, les garder / reformuler / retirer, valider et enregistrer des versions. Ce projet en fait un véritable atelier de structure, sans changer les tarifs ni la base.

## 1. Manipuler le sommaire librement

- Glisser-déposer pour réordonner les chapitres (et flèches haut/bas conservées pour le clavier).
- Sur chaque chapitre : **Fusionner avec le précédent**, **Scinder en deux**, **Insérer un chapitre ici**, **Dupliquer**.
- Édition en ligne du titre et de l'objectif, sans quitter la colonne.
- **Annuler / Rétablir** (10 derniers gestes) : plus de peur de casser son plan.
- Sélection multiple : retirer ou déplacer plusieurs chapitres d'un coup.

## 2. Voir la qualité du plan d'un coup d'œil

Un bandeau « Santé du sommaire » au-dessus de la liste :

- nombre de chapitres vs objectif, mots visés au total (chapitres × 2 500-3 500) et pages KDP estimées ;
- doublons de titres détectés, titres trop génériques, titres trop longs ;
- **passages de votre récit non couverts** : « 4 passages sur 37 ne sont rattachés à aucun chapitre » + bouton « Créer les chapitres manquants » ;
- équilibre : chapitres qui portent trop de passages (trop lourds) ou aucun.

## 3. Trois façons de démarrer un sommaire

- **Avec le Génie** (existant, 3 par 3).
- **Depuis un modèle de structure** : méthode pas-à-pas, récit chronologique, problème/solution, 12 étapes du voyage du héros, guide pratique, recueil d'histoires. Le modèle pose les chapitres, le Génie les habille avec votre sujet.
- **Coller mon plan** (existant) enrichi : détection automatique de la numérotation et des sous-parties.

## 4. Sous-chapitres et notes de chapitre

- Chaque chapitre peut recevoir des **points à traiter** (3-6 puces) générés par le Génie ou écrits à la main.
- Une **note privée** par chapitre (« ne pas oublier l'anecdote de l'atelier ») : transmise au rédacteur, jamais imprimée.
- Ces points servent de consigne de rédaction : les chapitres écrits suivent le plan validé.

## 5. Variantes et comparaison

- Bouton **« Proposer une autre structure »** : le Génie génère une variante complète du plan, affichée côte à côte avec l'actuelle ; on garde l'une, l'autre, ou on récupère chapitre par chapitre.
- Historique des versions déjà présent, complété par un libellé (« avant recentrage sur mon récit ») et un diff simple (chapitres ajoutés / retirés / renommés).

## 6. Sortir du sommaire

- **Exporter le sommaire** en texte, Word ou PDF (avec l'habillage or déjà utilisé à l'export).
- **Copier pour Amazon KDP** : version courte du sommaire pour la description produit.
- **Verrou** : une fois validé, le sommaire est verrouillé pour la rédaction ; un clic sur « Déverrouiller » prévient que les chapitres déjà écrits garderont leur texte.

## Détails techniques

- `src/lib/v3/bookBrief.ts` : `BriefOutlineChapter` reçoit `points?: string[]`, `note?: string`, `locked?: boolean` ; helpers `mergeChapters`, `splitChapter`, `insertChapterAt`, `moveChapter`, `outlineHealth(outline, passages)` (doublons, génériques, passages non couverts, mots/pages estimés).
- Nouveau `src/lib/v3/outlineHistory.ts` : pile annuler/rétablir en mémoire (10 pas), branchée sur les mutations du sommaire.
- Nouveau `src/data/v3OutlineTemplates.ts` : les 6 structures type (titre, chapitres modèles, public visé).
- Nouveau `src/components/v3public/V3OutlineHealthBar.tsx` (bandeau santé) et `V3OutlineChapterRow.tsx` (ligne de chapitre : drag handle, actions, points, note).
- Nouveau `src/components/v3public/V3OutlineVariantCompare.tsx` : deux colonnes, adoption globale ou chapitre par chapitre.
- `V3OutlinePanel.tsx` et `V3OutlineCoBuilder.tsx` : réutilisent ces briques ; le glisser-déposer utilise HTML5 native (pas de nouvelle dépendance).
- `supabase/functions/v3-genie-brief/index.ts` : nouveaux modes `outline-points` (points d'un chapitre), `outline-variant` (structure alternative complète), `outline-fill-gaps` (chapitres pour les passages non couverts). Mêmes garde-fous : 100 % français, aucun titre générique, repli clé serveur puis Lovable AI.
- Export sommaire : réutilise le moteur DOCX/PDF existant (`docxExportEngine`), aucun nouveau moteur.
- `saveOutlineVersion` reçoit un `label` optionnel ; aucune nouvelle table, aucun changement de quota ni de tarif.
