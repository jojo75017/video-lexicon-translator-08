# Studio BD : réparer les images des cases (4 par page)

## Où est le problème exactement

Vous avez bien deux clés (Gemini et OpenAI), mais le Studio BD n'envoie **qu'une seule clé, dans le mauvais tuyau**.

Le générateur BD envoie toujours `useOpenAI: true` + `openaiApiKey = <la clé du provider actif>`. Or ce provider actif est votre clé **Gemini** (`AIzaSy…`). La fonction l'envoie donc à OpenAI, qui la rejette :

```text
OpenAI error (final): 401 — "Incorrect API key provided: AIzaSyAJ***…"
OpenAI image generation failed, falling back
Placeholder image detected, skipping storage upload
```

Ensuite le générateur avale l'erreur en silence (`catch` → `imageUrl: ''`) : le scénario est bien créé avec toutes les cases, mais aucune illustration n'arrive et aucun message ne vous prévient. Votre clé OpenAI, elle, n'est jamais utilisée par la BD ; et la clé **OpenRouter** (déjà présente dans l'app pour les images) n'est pas branchée sur la BD du tout.

## Corrections prévues

1. **Choisir le bon fournisseur selon la clé**
   - `AIza…` ou clé Google AI Studio → Gemini direct (déjà implémenté dans la fonction).
   - `sk-…` → OpenAI.
   - `sk-or-…` → OpenRouter (nouveau pour la BD, via le helper `invokeImageFunction` déjà utilisé ailleurs).
   - Détection côté client **et** côté serveur (sécurité : une clé mal typée ne partira plus chez le mauvais fournisseur).

2. **Ajouter OpenRouter dans le Studio BD**
   - Lecture de la clé OpenRouter images (`getOpenRouterImageKey`) et transmission à `generate-chapter-images`.
   - Petit sélecteur « Moteur d'images » dans les réglages avancés BD : Auto (recommandé) / Gemini / OpenAI / OpenRouter, avec indication des clés détectées.

3. **Vraie chaîne de secours**
   - Ordre : clé de l'abonné (bon fournisseur) → autre clé disponible → Lovable AI (crédits inclus) → placeholder en dernier recours seulement.
   - La réponse portera un indicateur explicite (`provider`, `fallback`, motif) au lieu d'un placeholder muet.

4. **Rendre les échecs visibles**
   - Comptage des cases échouées + toast explicite (« 6 cases sur 8 non générées — clé Gemini refusée par OpenAI »).
   - Sur chaque case vide : encart « Image non générée » + bouton **Régénérer cette case**.

5. **Vérification**
   - Test de la fonction avec une clé `AIza`, une clé `sk-or-`, puis sans clé, et lecture des logs pour confirmer qu'une vraie image (et non un placeholder) revient.

## Détails techniques

- Fichiers concernés : `supabase/functions/generate-chapter-images/index.ts` (routage par préfixe + branche OpenRouter + réponse enrichie) et `src/components/ebook/EbookComicBookGenerator.tsx` (envoi des bonnes clés, sélecteur de moteur, gestion d'erreurs, régénération unitaire).
- Aucun changement de tarif, de prompt de style, ni du nombre de cases par page (réglage `panelLayout` conservé).
- Pas de `npm run build` — uniquement l'aperçu de développement.
