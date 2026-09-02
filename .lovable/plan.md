# Studio BD : réparer les images des cases (4 par page)

## Ce qui se passe réellement

Les logs de la fonction d'images le montrent clairement : votre clé **Gemini** (`AIzaSy…`) est envoyée à **OpenAI**, qui la refuse.

```text
OpenAI error (final): 401 — "Incorrect API key provided: AIzaSyAJ***…"
OpenAI image generation failed, falling back
Placeholder image detected, skipping storage upload
```

Résultat : chaque case retombe sur une image « placeholder » (ou une URL vide), et le générateur BD avale l'erreur en silence (`catch` → `imageUrl: ''`). Le scénario est bien créé avec 8 cases par page, mais aucune illustration n'arrive. Vous ne voyez donc ni image ni message d'erreur.

## Corrections prévues

1. **Router la clé selon son type** (`supabase/functions/generate-chapter-images/index.ts`)
   - Une clé commençant par `AIza` part vers Gemini direct (fonction déjà présente dans le fichier), jamais vers OpenAI.
   - Une clé `sk-…` part vers OpenAI comme aujourd'hui.
   - Si aucune clé valide : génération via Lovable AI (crédits inclus).

2. **Chaîne de secours réelle**
   - Ordre : clé de l'abonné (bon fournisseur) → Lovable AI → et seulement en dernier recours un placeholder.
   - Le placeholder ne sera plus renvoyé silencieusement : la réponse portera un indicateur `fallback` + le motif.

3. **Rendre les échecs visibles dans le Studio BD** (`src/components/ebook/EbookComicBookGenerator.tsx`)
   - Compter les cases échouées et afficher un toast explicite (« 6 cases sur 8 non générées — clé Gemini refusée »).
   - Sur chaque case sans image : encart « Image non générée » + bouton **Régénérer cette case**.

4. **Vérification**
   - Test direct de la fonction avec une clé `AIza` puis sans clé, et lecture des logs pour confirmer qu'une vraie image (et non un placeholder) est renvoyée.

## Détails techniques

- Le générateur envoie aujourd'hui `useOpenAI: true` + `openaiApiKey: <clé Gemini>` : ce couple sera remplacé par `userGeminiApiKey` / `openaiApiKey` selon le préfixe détecté côté client, et la fonction fera aussi la détection défensivement côté serveur.
- Aucun changement de tarif, de prompt de style, ni de mise en page des planches. Nombre de cases par page inchangé (réglage `panelLayout`).
- Pas de `npm run build` — uniquement l'aperçu de développement.
