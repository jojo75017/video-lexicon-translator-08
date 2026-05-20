# Test du fix « 1 seul chapitre généré »

## Objectif
Vérifier que le workflow P1 → P15 génère bien **tous les chapitres demandés** (et plus seulement 1), suite au fix de `normalizeP3Structure` dans `EbookCompleteWorkflow.tsx`.

## Procédure de test (5 min)

1. **Préparer un mini-projet** sur `/ebook-planner` :
   - Titre : « Test workflow 5 chapitres »
   - Genre : Développement personnel
   - Nombre de chapitres : **5** (volontairement petit pour tester vite)
   - Longueur : Court (~1000 mots/chapitre)

2. **Lancer le workflow complet** (bouton « Lancer les 15 agents »).

3. **Observer en direct dans la console navigateur (F12)** :
   - Logs P3 : `📚 Structure normalisée : 5 chapitres détectés` (au lieu de 1)
   - Logs P4 : `✍️ Rédaction chapitre 1/5`, `2/5`, `3/5`, `4/5`, `5/5`

4. **Vérification finale après P4** :
   - Onglet « Manuscrit » → doit afficher **5 chapitres** avec contenu réel
   - Aucun chapitre vide ou intitulé `Chapitre N` sans contenu

## Critères de réussite
- ✅ 5/5 chapitres rédigés (pas 1/5)
- ✅ Chaque chapitre ≥ 800 mots
- ✅ P5–P15 s'enchaînent sans erreur

## Si ça échoue
- Capturer les logs console P3 + P4
- Vérifier la réponse réseau de `complete-book-workflow` (onglet Network) → champ `chapters[]` du résultat P3

## Note
Je ne peux pas cliquer dans le preview à ta place en mode plan. Lance le test côté UI, et reviens avec :
- soit ✅ « ça marche, 5 chapitres OK » → on passe à ta vidéo n°4
- soit ❌ + un screenshot des logs console → je corrige immédiatement
