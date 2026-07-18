
# Audiobook unlock — 9,99 € par livre (BYOK TTS)

## Objectif
Après génération d'un livre sur `/v3`, l'utilisateur peut payer **9,99 € une fois** pour ce livre précis, puis générer la version audio (MP3 unique) en utilisant **sa propre clé** Azure Speech, ElevenLabs, ou OpenAI TTS. Le coût de synthèse est à sa charge (BYOK), on n'utilise jamais nos propres clés serveur pour ce flux.

## Produit Stripe
- Nouveau produit `audiobook_unlock` — prix `audiobook_unlock_one` — 999 cents EUR, one-shot.
- Créé via `payments--create_product` (test → sync auto en live).

## Base de données
Nouvelle table `audiobook_unlocks` :
```
id, user_id, book_id (text), stripe_session_id, environment,
paid_at, audio_url (nullable), provider_used, created_at
```
RLS : user lit les siens, service_role écrit. Grants explicites `authenticated` + `service_role`.

## Edge functions
1. **`create-audiobook-checkout`** (`verify_jwt=false`)
   - Input : `book_id`, `user_id`, `returnUrl`, `environment`.
   - Stripe Checkout embedded, `mode: payment`, metadata `{ userId, bookId, kind: "audiobook_unlock" }`.
   - Renvoie `clientSecret`.

2. **`payments-webhook`** (existant, à étendre)
   - Sur `checkout.session.completed` avec `metadata.kind === "audiobook_unlock"` → insert dans `audiobook_unlocks`.

3. **`generate-audiobook-byok`** (verify_jwt actif)
   - Input : `book_id`, `provider` (`azure` | `elevenlabs` | `openai`), credentials (clé + région Azure, voix), texte du manuscrit.
   - Vérifie qu'il existe un `audiobook_unlocks` payé pour ce user + book.
   - Découpe le texte (~4500 car / chunk pour Azure, ~2500 pour ElevenLabs, ~4000 pour OpenAI).
   - Appelle le provider avec la **clé de l'utilisateur** (jamais stockée).
   - Concatène les MP3, upload dans le bucket `audiobooks` (déjà existant) sous `user_id/book_id.mp3`.
   - Met à jour `audio_url` + `provider_used`.
   - Renvoie l'URL publique.

## Interface (front)
- **`src/components/audiobook/AudiobookUnlockCard.tsx`** : bandeau dans le récap final du wizard et dans la fiche livre bibliothèque. Deux états :
  - Non payé → bouton « Convertir en audiobook — 9,99 € » → ouvre Stripe Embedded Checkout.
  - Payé → formulaire BYOK (choix provider, clé collée, voix, vitesse), bouton « Générer l'audio », barre de progression, lecteur MP3 + téléchargement.
- Intégré dans `V3CreatePage.tsx` (fin du wizard) et `V3LibraryPage.tsx` (par livre).
- Clés BYOK TTS stockées dans `localStorage` chiffré (même utilitaire que Gemini/OpenRouter), jamais envoyées ailleurs qu'à l'edge de génération pour le run en cours.

## Sécurité
- Vérification unlock côté serveur avant chaque génération (retour 402 sinon).
- Clés TTS jamais loggées, jamais persistées côté serveur, effacées de la mémoire après le run.
- Rate-limit simple : 1 génération en cours par user (verrou en table).

## Ce qui n'est PAS inclus (à confirmer plus tard)
- Découpage par chapitres / ZIP → volontairement écarté (tu as choisi MP3 unique).
- Publication ACX/Audible → hors scope.
- Bundles multi-livres → hors scope.

## Livrables
- 1 migration SQL (table + RLS + grants).
- 1 produit Stripe (`audiobook_unlock` / 9,99 €).
- 3 edge functions (create-checkout, webhook étendu, generate-audiobook-byok).
- 1 composant React `AudiobookUnlockCard` + intégration 2 pages.
- Bouton visible sur le récap fin de génération et sur chaque tuile de la bibliothèque.

Confirme-moi que je lance et je le construis d'un bloc.
