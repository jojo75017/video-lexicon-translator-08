# Générer l'illustration directement dans l'éditeur de couverture

## Le problème constaté

Dans l'éditeur (`/v3/mes-couvertures/:id`), le bouton « Générer une illustration » renvoie vers `/v3/cover-studio-pro`, une ancienne page de présentation — pas vers le module de génération qui se trouve en réalité sur `/v3/cover-pro`. Résultat : on tourne en rond, aucune image n'arrive jamais dans le canevas, et l'abonné doit tout saisir à la main.

La génération elle-même existe et fonctionne côté serveur (`cover-pro-generate`, OpenAI `gpt-image-2` en 1024×1536, image privée rattachée au projet), mais elle n'est atteignable que depuis une page séparée où il faut re-choisir son projet et remplir cinq champs.

## Ce qui va changer

1. **Un panneau « Illustration IA » directement dans l'éditeur**, au-dessus des outils de texte, sans quitter la page :
   - un bouton principal « Générer l'illustration » qui marche en un clic ;
   - le brief est pré-rempli automatiquement à partir du projet (titre du livre, genre, ambiance) ; l'abonné peut l'ajuster mais n'est jamais obligé de le faire ;
   - un choix de moteur visible : **OpenAI** (3 générations incluses puis clé perso) ou **Gemini / Nano Banana** (clé perso, moins cher) ;
   - pendant la génération : bouton en attente + message clair ; à la fin, l'image apparaît immédiatement en fond du canevas, sans rechargement ;
   - messages d'erreur explicites : accès non débloqué, plus de générations incluses, clé manquante, refus du fournisseur.

2. **Lien cassé corrigé** : plus aucun renvoi vers `/v3/cover-studio-pro` depuis l'éditeur.

3. **Regénérer / remplacer** : si une illustration existe déjà, le bouton devient « Régénérer une autre illustration » (l'ancienne reste remplacée par la nouvelle sur le projet).

4. **Accès** : la génération reste réservée à Cover Studio KDP Pro (67 €). Sans achat, le panneau affiche un encart clair avec le bouton de déblocage — mais les outils de texte restent utilisables.

## Détails techniques

- `src/components/cover-editor/CoverFrontEditor.tsx` : nouveau bloc de génération (brief pliable, sélecteur de moteur, appel `supabase.functions.invoke('cover-pro-generate')`, rafraîchissement du chemin d'illustration et de l'URL signée en mémoire). Même bloc réutilisé dans `CoverWrapEditor.tsx` pour la première de couverture d'un broché.
- Nouveau composant partagé `src/components/cover-editor/IllustrationGeneratorPanel.tsx` pour éviter la duplication ; il lit l'accès et les crédits via `useCoverProAccess`.
- `supabase/functions/cover-pro-generate/index.ts` : ajout du paramètre `provider` (`openai` par défaut, `gemini` en option). Branche Gemini = appel direct à l'API Google avec la clé personnelle de l'abonné (aucun crédit Lovable, aucune passerelle). Les crédits inclus restent réservés à OpenAI, la logique de réservation/restitution de crédit est inchangée.
- `supabase/functions/cover-pro-key/index.ts` + `CoverProKeyVault.tsx` : la colonne `provider` existe déjà en base mais est figée sur `openai` ; on autorise l'enregistrement d'une clé `gemini` (validation du préfixe `AIza`), chiffrement AES-GCM identique.
- Base de données, RLS, calculs KDP et paiements : aucune modification.

## Vérification

Test navigateur complet : ouvrir un projet depuis la bibliothèque, cliquer « Générer l'illustration », vérifier que l'image s'affiche dans le canevas, ajouter un titre par-dessus, recharger la page et confirmer que l'illustration et les textes sont conservés. Captures d'écran fournies.
