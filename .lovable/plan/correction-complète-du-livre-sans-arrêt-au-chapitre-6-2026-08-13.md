# Correction complète du livre sans arrêt au chapitre 6

## Le problème observé
La correction s'interrompt vers le chapitre 6 au lieu de traiter tout le manuscrit d'un coup.

Ce que le code fait aujourd'hui (vérifié) :
- `src/lib/correcteur/proofreadBook.ts` : la boucle `proofreadChapters` **s'arrête net et sort de la série** dès qu'un chapitre renvoie une erreur contenant « 402 » ou « crédit ». Les chapitres suivants ne sont même pas tentés.
- Chaque chapitre n'a que **3 tentatives** et des attentes courtes (4 s, 8 s) en cas de limite de débit ; au-delà, le chapitre est marqué « échoué » et rien ne le reprend automatiquement.
- Chaque chapitre déclenche jusqu'à 3 appels IA (correction + 2 passes anti-latin), donc au 6e chapitre on est déjà à ~15 appels : c'est exactement là que les quotas gratuits Gemini / les limites de débit tombent.
- `supabase/functions/strict-proofread/index.ts` : si la clé de l'abonné est refusée ou en quota dépassé (401/402/429), la fonction renvoie l'erreur telle quelle, **sans repli** sur le moteur de secours.

Le diagnostic exact (quota de clé personnelle vs limite de débit) sera confirmé par le message d'erreur désormais affiché par chapitre, mais dans tous ces cas le comportement « ça s'arrête au milieu » vient du code ci-dessus.

## Ce qui va changer

1. **Plus jamais d'arrêt au milieu du livre**
   - La série ne s'interrompt plus sur une erreur de crédits ou de quota : on continue les chapitres suivants et on note l'erreur sur le chapitre concerné.
   - Seul le bouton « Interrompre » arrête la correction.

2. **Reprise automatique des chapitres en échec**
   - Après le premier passage, 2 tours de reprise automatiques sur les seuls chapitres échoués, avec pause progressive (10 s, 30 s) pour laisser retomber les limites de débit.
   - Tentatives par chapitre portées de 3 à 5, avec attente croissante (5 s, 15 s, 30 s, 60 s).

3. **Moteur de secours côté serveur**
   - Dans `strict-proofread`, si la clé de l'abonné répond 401 / 402 / 429 (quota Gemini épuisé, clé refusée), on relance immédiatement la même requête sur le moteur de secours de la plateforme au lieu de renvoyer une erreur. La réponse indique quel moteur a servi.

4. **Passes anti-latin plus économes**
   - Les passes « latin-fix » ne sont déclenchées que si le balayage local détecte réellement des expressions, et limitées à 1 passe supplémentaire par chapitre : moins d'appels, donc moins de risque de quota.

5. **Progression et diagnostic clairs**
   - Affichage « Chapitre 7 / 40 · nouvelle tentative dans 15 s » pendant les attentes.
   - En fin de course, si des chapitres restent en échec : bandeau explicite avec la raison (quota clé, limite de débit) et bouton **« Reprendre les chapitres en échec »** qui ne retraite que ceux-là.

## Détails techniques
- `src/lib/correcteur/proofreadBook.ts` : retirer le `return` sur `/402|crédit/`, passer `callProofread` à 5 tentatives avec backoff, ajouter un callback d'attente pour l'UI, ajouter `retryFailedChapters()` appelé 2 fois en fin de série.
- `supabase/functions/strict-proofread/index.ts` : extraire la construction requête/parse dans une fonction réutilisable, puis rejouer via le moteur de secours quand le moteur BYOK renvoie 401/402/429 ; conserver le champ `engine` dans la réponse.
- `src/pages/v3public/V3CorrecteurPage.tsx` : afficher l'attente en cours, le bandeau des chapitres en échec et le bouton de reprise ciblée ; l'enregistrement automatique dans « Livres corrigés » reste déclenché en fin de série.
- Aucun changement de schéma base de données.
