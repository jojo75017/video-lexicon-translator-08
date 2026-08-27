# Réparer la génération de couverture IA

## Ce qui se passe

Le bug n'a rien à voir avec la clé OpenRouter. C'est pour cela qu'ajouter la clé n'a rien changé : **les deux chemins (avec et sans OpenRouter) appellent un modèle d'image qui n'existe pas.**

Dans `supabase/functions/generate-ai-cover/index.ts` (lignes 62-63), le modèle demandé est :

```
google/gemini-3.1-flash-image-preview
```

Ce nom est faux dans les deux catalogues :

| Fournisseur | Identifiant envoyé | Identifiant réel |
|---|---|---|
| Lovable AI | `google/gemini-3.1-flash-image-preview` | `google/gemini-3.1-flash-image` (sans `-preview`) |
| OpenRouter | `google/gemini-3.1-flash-image-preview` | `google/gemini-2.5-flash-image-preview` |

Résultat : le fournisseur rejette la requête, la fonction renvoie une erreur, et le front affiche « Edge Function returned a non-2xx status code ». Le message est identique avec ou sans clé puisque le nom de modèle est erroné dans les deux cas.

## Ce qui va être corrigé

1. **Le nom du modèle par chemin** dans `generate-ai-cover` : `google/gemini-3.1-flash-image` pour Lovable AI, `google/gemini-2.5-flash-image-preview` pour OpenRouter (ce sont deux catalogues distincts, ils ne peuvent pas partager la même constante).
2. **Message d'erreur lisible pour l'abonné** : au lieu de « non-2xx status code », afficher la vraie cause renvoyée par le fournisseur (modèle refusé, crédits épuisés, clé invalide, limite atteinte), déjà présente dans la réponse mais aujourd'hui masquée côté front.
3. **Repli automatique** : si la clé OpenRouter de l'abonné échoue (modèle non accessible sur son compte, crédits à zéro), la génération repasse sur le moteur Lovable AI au lieu d'échouer sèchement — avec une mention claire dans l'interface.
4. **Même vérification sur les autres modules d'images**, car deux autres fonctions utilisent aussi un identifiant inexistant et échoueront de la même façon :
   - `short-stories-generate` → `google/gemini-3.6-flash-image` (n'existe pas)
   - `generate-chapter-images` → identifiants sans préfixe `google/`
   Ces deux-là sont alignés sur les identifiants réels du catalogue.

## Vérification avant de considérer le sujet clos

- Appel réel de `generate-ai-cover` sans clé OpenRouter → une image doit revenir.
- Appel réel avec une clé OpenRouter → une image doit revenir.
- Contrôle des logs de la fonction pour confirmer l'absence de rejet de modèle.
- Contrôle rapide de `short-stories-generate` et `generate-chapter-images`.

## Détails techniques

- `supabase/functions/generate-ai-cover/index.ts` : séparer `OPENROUTER_IMAGE_MODEL` et `LOVABLE_IMAGE_MODEL` avec les identifiants corrects, et ajouter le repli Lovable AI dans le bloc `if (!response.ok)` avant de renvoyer l'erreur.
- Côté front (composant Cover Studio qui appelle `generate-ai-cover` via `invokeImageFunction`) : lire le champ `error` / `details` du corps de la réponse plutôt que de n'afficher que le message générique de `supabase.functions.invoke`.
- `supabase/functions/short-stories-generate/index.ts` et `supabase/functions/generate-chapter-images/index.ts` : identifiants de modèle alignés sur le catalogue.
- Aucune modification de la logique de prompt, de format KDP ni de la clé BYOK : le paramétrage de l'abonné reste intact.

## Réponse à envoyer à l'abonné

Une fois vérifié, un court message expliquant que le problème venait d'un nom de moteur d'image incorrect de notre côté, que sa clé OpenRouter n'était pas en cause, et qu'il peut relancer la génération.
