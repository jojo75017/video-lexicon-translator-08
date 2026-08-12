# Correction du livre : un seul clic, et zéro latin garanti

## Ce qui se passe aujourd'hui

Deux points bloquants, vérifiés dans le code :

1. **Rien n'est appliqué automatiquement.** Après la correction, chaque chapitre est marqué comme « non validé » (`accepted: false` dans `V3CorrecteurPage.tsx`). L'auteur doit ouvrir chaque chapitre et cliquer « Accepter », sinon l'export ressort le texte **d'origine**, non corrigé. C'est le comportement que tu vois : on clique sur « Corriger », ça travaille, mais le livre exporté n'a pas bougé.
2. **Le latin dépend uniquement du bon vouloir de l'IA.** La consigne « remplace le latin / faux latin par du français » existe bien dans la fonction de correction, mais il n'y a **aucune vérification** après coup. Si le modèle en laisse passer, personne ne le détecte et le mot part à l'export.

## Ce qu'on met en place

### 1. Un seul bouton, correction appliquée d'office

- Le bouton devient **« Corriger tout le livre »** : import du document, un clic, et à la fin le manuscrit corrigé est **déjà retenu pour l'export** (Word, PDF) — plus aucune validation manuelle obligatoire.
- Une case **« Je veux relire chapitre par chapitre avant d'appliquer »** reste disponible pour ceux qui préfèrent l'ancien fonctionnement (relecture, diff, refus d'une correction précise). Décochée par défaut.
- Les outils de relecture (diff par correction, édition manuelle, refus ponctuel) ne disparaissent pas : ils restent accessibles après coup, sur un texte déjà corrigé.
- Le bandeau d'avertissement « X chapitres non validés seront exportés dans leur version d'origine » disparaît en mode automatique.

### 2. Chasse au latin, vérifiée et non plus « espérée »

- **Détecteur déterministe** : nouvelle liste de repérage (mots et tournures latines / pseudo-latines : *intra, inter, cruorem, matrimonium, cineres, sanguis, mortis, vendetta*-type, séquences de 2+ mots à terminaisons latines, etc.), avec liste blanche pour ce qui est légitime en français (*a priori, a fortiori, etc.*) et pour les noms propres.
- **Deuxième passe ciblée** : si le détecteur trouve encore du latin après la correction IA, le chapitre concerné repart automatiquement en correction avec une consigne unique — « remplace ces expressions précises par du français clair, sans rien changer d'autre ». Jusqu'à deux tentatives.
- **Compteur visible** : la fiche de résultat affiche « Expressions latines supprimées : N » et, si quelque chose résiste, la liste exacte des mots restants, avec le chapitre où ils se trouvent, pour intervention manuelle.
- La même vérification est branchée sur la correction automatique de fin de génération V3 (celle du wizard), pour que les livres créés dans l'outil sortent également sans latin.

### 3. Retour utilisateur clair

- Barre de progression avec le chapitre en cours, puis un récapitulatif : nombre de corrections par type, note d'orthographe, latin supprimé.
- En cas d'échec sur un chapitre : bouton de reprise, le reste du travail est conservé.

## Détails techniques

- `src/pages/v3public/V3CorrecteurPage.tsx` : `accepted: true` par défaut à la fin de chaque chapitre (auto), état `manualReview` piloté par la case à cocher, bouton principal renommé, bandeau conditionné à `manualReview`.
- Nouveau `src/utils/latinSweep.ts` : `detectLatin(text)` → liste d'expressions suspectes + `hasLatin(text)`, avec liste blanche.
- Service de correction (`aiWritingService` / `proofreadChapter`) : après réponse, si `hasLatin(corrected)`, relance ciblée via `strict-proofread` avec un mode `latin-fix` (nouvelles consignes minimales) et fusion du résultat.
- `supabase/functions/strict-proofread/index.ts` : ajout du mode `latin-fix` (prompt court : uniquement le remplacement des expressions listées, aucune autre modification) et renvoi des expressions traitées.
- `V3CreateWizard.tsx` : la passe de correction de fin de workflow appelle la même vérification latin avant sauvegarde.
- BYOK conservé : la correction utilise en priorité la clé Gemini / OpenAI / Claude / OpenRouter de l'abonné, crédits Lovable en dernier recours.
