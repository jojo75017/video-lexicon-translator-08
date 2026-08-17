# Vos mots gardés, corrigés, et des chapitres de 2 500 mots

Aujourd'hui, quand vous racontez votre vie sur plusieurs lignes, le Génie transforme votre texte en résumé de 3 à 5 phrases et jette le reste. Ensuite la rédaction repart de ce résumé : vos souvenirs, vos noms, vos détails ont disparu, et les chapitres sont courts.

## Ce qui change

1. **Votre texte est conservé mot pour mot.** Tout ce que vous écrivez ou dictez est stocké comme « matière brute » du livre. Il s'accumule à chaque message, il n'est jamais raccourci ni remplacé. Le résumé court reste seulement l'étiquette affichée sur la fiche.
2. **Le Génie corrige, il ne réécrit pas.** Orthographe, grammaire, ponctuation, phrases bancales : oui. Couper, résumer, inventer des faits, changer les noms de lieux ou de personnes : non.
3. **Chapitres de 2 500 mots.** Pour un récit de vie, la longueur par défaut passe à 2 500 mots (réglable jusqu'à 3 500). La rédaction reçoit un plancher : jamais moins de ~2 300 mots.
4. **La rédaction part de vos souvenirs.** Chaque chapitre reçoit la matière brute correspondante : le moteur développe vos phrases (scènes, sensations, dialogues) au lieu de broder sur un résumé.
5. **Titre pré-rempli** : « Le Récit de ma vie (un enfant de Berck-sur-Mer) », modifiable.
6. **Zone « Vos souvenirs »** sous le dialogue : vous voyez tout ce que vous avez raconté, et vous pouvez continuer à coller de longs passages sans crainte qu'ils soient perdus.

## Détails techniques

- `src/lib/v3/bookBrief.ts` : nouveau champ `sourceText` (matière brute cumulée) persisté avec le brief ; `wordsPerChapter` par défaut 2500, borne haute 3500.
- `supabase/functions/v3-genie-brief/index.ts` : le message de l'auteur est ajouté à `sourceText` côté client et renvoyé dans le contexte ; le prompt interdit toute compression, demande une simple correction de langue, et fixe `wordsPerChapter` entre 1800 et 3500 (2500 par défaut dès qu'il s'agit d'un récit de vie / autobiographie). `description` reste un synopsis court, uniquement pour la fiche.
- `src/components/v3public/V3GenieDialog.tsx` : conserve et affiche `sourceText`, ne le remplace jamais par la réponse IA ; borne du champ « Mots par chapitre » portée à 3500 ; titre par défaut du récit de vie.
- `src/components/ebook/EbookCompleteWorkflow.tsx` : transmission de `sourceText` dans le contexte P3/P4, cible de mots par chapitre issue du brief (2500), plancher de 2 300 mots avec relance si le chapitre est trop court.
- `supabase/functions/book-chapter-write/index.ts` : nouveau bloc « MATIÈRE BRUTE DE L'AUTEUR (à développer, jamais à résumer) », `word_target` accepté jusqu'à 3500, consigne explicite de garder les mots, noms et lieux de l'auteur.
- Aucun changement de tarif, de quota ni de schéma base.
