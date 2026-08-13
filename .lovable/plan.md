# Correction nickel + Humaniseur réparé (et réponse à l'abonné)

## Ce qui se passe réellement (vérifié)

1. **L'Humaniseur plante sur un livre entier.** La capture montre 18 401 mots collés (~110 000 caractères). Le module envoie tout en **un seul appel IA** avec une limite de sortie basse : la réponse est tronquée ou coupée par le délai, d'où « Edge Function returned a non-2xx status code ». Testé à l'instant avec un court texte : la fonction répond correctement (200). Le problème est donc la taille, pas la fonction.
2. **Le message d'erreur ne dit rien d'utile.** L'interface affiche le message technique brut au lieu de « texte trop long, traitez chapitre par chapitre ».
3. **La V2 n'a pas d'entrée « Corriger mon livre ».** L'abonné a cherché seul et a fini par détourner l'Humaniseur : c'est le vrai module de correction (`/v3/corriger`) qu'il aurait dû trouver, et il y a droit.
4. **Les cadratins parasites viennent de l'export, pas de l'IA.** La règle typographique appliquée à l'export transforme **toute ligne commençant par un tiret** en tiret cadratin de dialogue (`— `). Les listes à puces, énumérations et tirets de mise en forme deviennent donc de faux dialogues dans tout le livre.
5. **Les fautes restantes** s'expliquent par des blocs de correction trop gros (1 200 mots par appel), un modèle léger et une seule passe orthographe : sur un chapitre long, l'IA corrige le début et survole la fin.

## Ce qui va changer

### 1. Humaniseur IA qui ne plante plus
- Découpage automatique du texte en blocs (~1 200 mots), traités les uns après les autres avec une barre de progression « Bloc 3 / 14 », puis recollage.
- Reprise automatique d'un bloc en échec, sans perdre les blocs déjà humanisés.
- Messages clairs à la place de l'erreur technique : texte trop court, limite de débit atteinte, clé IA absente.
- L'humanisation utilise en priorité la clé IA de l'abonné (Gemini / OpenAI / OpenRouter), le moteur de la plateforme ne servant que de secours.
- Bandeau en tête du module : « Pour corriger fautes et cadratins, utilisez Corriger mon livre » avec le bouton direct.

### 2. « Corriger mon livre » visible dans la V2
- Ajout de l'entrée dans les outils V2 et dans le menu, pointant vers le correcteur, avec le mode d'emploi en 3 lignes (importer le DOCX → un clic → télécharger).

### 3. Fin des cadratins parasites
- Le tiret cadratin n'est plus appliqué qu'aux **vraies répliques de dialogue** (ligne suivie d'une phrase avec majuscule et verbe), jamais aux listes, énumérations ou titres.
- Les puces restent des puces à l'export Word et PDF.
- Nouvelle option d'export « Nettoyer les tirets » qui reconvertit en puces les faux dialogues des livres déjà générés.

### 4. Correction réellement propre
- Blocs de correction réduits (~700 mots) : l'IA garde le même niveau d'attention du début à la fin du chapitre.
- Deux passes ordonnées par chapitre : **orthographe / grammaire / accords** puis **ponctuation et typographie**, au lieu d'une passe unique qui laisse passer des fautes.
- Modèle de correction plus solide et température basse pour la passe fautes (moins d'inventions, plus de rigueur).
- Passe locale automatique en fin de course : espaces avant `; : ! ?`, apostrophes, doubles espaces, majuscules après point, tirets orphelins, fins de chapitre sans point.
- Rapport final honnête : nombre de fautes corrigées par chapitre et liste des chapitres non traités, avec bouton de reprise ciblée.

### 5. Réponse à l'abonné
- Email personnalisé : reconnaissance du signalement, explication en clair (l'Humaniseur n'est pas le correcteur, le livre entier ne passe pas en un bloc), lien direct vers « Corriger mon livre », mode d'emploi en 4 étapes, et confirmation des corrections livrées.

## Détails techniques
- `src/components/ebook/EbookHumanizer.tsx` : découpage par blocs (réutilisation de `splitForProofread`), boucle séquentielle avec progression, reprise des blocs échoués, messages d'erreur mappés, bandeau vers `/v3/corriger`.
- `supabase/functions/humanize-content/index.ts` : acceptation d'une clé BYOK (`userProvider` / `userApiKey`), garde de taille (refus explicite au-delà de ~4 000 mots par appel avec message dédié), `max_tokens` aligné sur la taille du bloc, repli plateforme, redéploiement.
- `src/utils/frenchTypography.ts` : `ln()` — le remplacement `^[-–]\s+` → `—\u00A0` devient conditionnel (exclusion des lignes de liste courtes, des lignes sans ponctuation finale et des titres) ; ajout d'un utilitaire `dashesToBullets()` pour l'option de nettoyage.
- `src/utils/docxExportEngine.ts` et `src/lib/bookperfect/exporters.ts` : branchement de l'option de nettoyage des tirets.
- `src/lib/correcteur/proofreadBook.ts` : `splitForProofread(text, 700)`, séquence deux passes par chapitre, passe typographique locale finale, rapport par chapitre.
- `supabase/functions/strict-proofread/index.ts` : modèle de secours plus solide et `temperature` basse en mode strict, redéploiement.
- Ajout de la tuile « Corriger mon livre » dans le registre d'outils V2 et le menu.
- Aucun changement de schéma base de données.
