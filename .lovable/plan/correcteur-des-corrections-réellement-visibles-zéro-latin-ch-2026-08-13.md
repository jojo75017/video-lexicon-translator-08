# Correcteur : des corrections réellement visibles, zéro latin, chapitres qui se terminent par une vraie phrase

## Ce que tu constates

Tu importes le livre, tu cliques sur « Corriger tout le livre », le travail s'affiche… mais le texte ne bouge pas et la liste des corrections reste vide ou quasi vide.

## Ce que dit le code (vérifié)

Deux mécanismes peuvent aujourd'hui annuler silencieusement une correction :

1. **Le garde-fou anti-amputation** (`proofreadBook.ts`, `MIN_KEEP_RATIO = 0.9`) : si le texte revenu fait moins de 90 % de la longueur d'origine, on **rejette toute la réponse** et on remet le texte d'origine **avec une liste de corrections vide**. Résultat visible : « 0 correction », texte inchangé, aucun message expliquant pourquoi. Ce rejet peut se déclencher sur un simple nettoyage de blancs ou une réponse partiellement tronquée.
2. **Le nettoyage de la réponse** (`cleanCorrected`) : si le modèle renvoie autre chose que le JSON attendu, le parsing côté serveur retombe sur `texteCorrige = contenu brut` avec `corrections: []` — là aussi, aucune correction listée.

Je ne peux pas affirmer sans mesure laquelle des deux se déclenche sur ton livre : la première étape du plan est donc de le tracer.

Par ailleurs, **rien dans le code ne vérifie qu'un chapitre se termine par une phrase complète** : aucun contrôle de fin de chapitre n'existe aujourd'hui.

## Ce qu'on met en place

### 1. Diagnostic visible (fini le silence)

- Chaque chapitre affiche l'issue réelle de sa passe : *corrigé*, *réponse refusée (texte amputé)*, *réponse hors format*, *échec réseau*.
- Journalisation du ratio de longueur et du nombre de corrections par chapitre, pour identifier immédiatement le cas qui bloque ton livre.
- Si une réponse est refusée, le chapitre est **automatiquement relancé** (jusqu'à 2 fois) au lieu de rester silencieusement non corrigé.

### 2. Correction par tronçons : la vraie cause des textes amputés

Un chapitre long dépasse la limite de sortie du modèle (8 000 tokens) : il revient coupé, donc refusé, donc « 0 correction ».
- Découpage du chapitre en **blocs de paragraphes** (~1 200 mots max, coupe uniquement entre paragraphes), correction bloc par bloc, puis recollage dans l'ordre.
- Le garde-fou de longueur s'applique **par bloc** : une mauvaise réponse ne fait plus perdre le chapitre entier.
- Contrôle final : nombre de paragraphes conservé à l'identique.

### 3. Zéro latin, garanti par vérification

- Le balayage local (`latinSweep`) tourne avant et après correction ; toute expression restante déclenche une passe ciblée de francisation (bloc concerné uniquement).
- Si une expression résiste après deux passes, elle est **remplacée par une reformulation française demandée explicitement au modèle sur la seule phrase concernée**, et non laissée dans le livre.
- Le rapport final affiche : latin supprimé, latin restant (avec chapitre et phrase), pour vérification humaine.

### 4. Fins de chapitre propres

- Nouveau contrôle : un chapitre ne peut pas se terminer par un mot isolé, une phrase sans ponctuation finale, un tiret ou des points de suspension orphelins.
- Si la fin est incomplète, le dernier paragraphe est **complété par une phrase de clôture** écrite dans le style du chapitre (une à deux phrases maximum, sans introduire d'événement nouveau), terminée par un point.
- La liste des chapitres dont la fin a été complétée est affichée dans le rapport.

### 5. Rapport final clair

Nombre de corrections par type, note d'orthographe, latin supprimé/restant, fins de chapitre complétées, chapitres en échec avec bouton de reprise.

## Détails techniques

- `src/lib/correcteur/proofreadBook.ts` : découpage en blocs (`splitForProofread`), correction par bloc avec garde-fou local, recollage, relance ciblée par bloc, nouveaux champs `blockFailures`, `endingFixed`.
- Nouveau `src/utils/chapterEnding.ts` : `isIncompleteEnding(text)` (mot isolé, absence de `.` `!` `?` `…`, tiret final) + assemblage de la phrase de clôture.
- `supabase/functions/strict-proofread/index.ts` : nouveau mode `ending-fix` (prompt court : ajouter une à deux phrases de clôture en français, aucun autre changement) ; mode `latin-fix` renforcé sur une phrase unique ; renvoi d'un indicateur `formatOk` quand le JSON attendu n'a pas été produit.
- `src/pages/v3public/V3CorrecteurPage.tsx` : statut détaillé par chapitre, compteurs latin/fins complétées, bouton de reprise ciblée.
- BYOK inchangé : clé Gemini / OpenAI / Claude / OpenRouter de l'abonné en priorité, moteur de secours seulement si la clé échoue.
