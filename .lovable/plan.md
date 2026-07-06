
# Rédaction de livres — OpenRouter multi-modèles (BYOK)

## Objectif
Dans **l'outil de rédaction de livres** (pipeline P1–P15, edge function `complete-book-workflow`), permettre d'écrire avec **OpenRouter** et **tous les modèles** déjà listés dans la V2 : Claude, Gemini, DeepSeek, ChatGPT/OpenAI, Mistral, Llama, Grok, Qwen (+ modèles gratuits). Clé **BYOK OpenRouter** (l'abonné saisit sa propre clé `sk-or-...`). **Tous les modèles accessibles à tous** (pas de réservation au 347€).

## Constat technique
- La liste des modèles existe déjà : `OPENROUTER_MODELS` dans `src/services/aiWritingService.ts` (c'est « la liste de Rachel »). Le routage multi-provider existe déjà **côté client** (`callAIWriting` / `callGemini` → Claude/OpenAI/OpenRouter).
- **MAIS** l'outil livre passe par l'edge function `complete-book-workflow`, qui :
  - n'accepte qu'une clé Gemini (`cleanedApiKey.startsWith('AIza')`),
  - appelle en dur `gemini-2.5-flash` (`callGeminiDirect`) ou le fallback Lovable AI.
  → Le choix de modèle OpenRouter n'atteint jamais le moteur du livre.

## Changements

### 1. Réglages : sélection provider + modèle OpenRouter (front)
- S'appuyer sur l'existant : `getProvider()/setProvider()`, `getOpenRouterModel()/setOpenRouterModel()`, `OPENROUTER_MODELS` (aucun nouveau stockage à inventer).
- Vérifier/compléter le panneau de configuration des clés (`OpenAIConfigPanel` / onglet Paramètres du planner) pour qu'il propose : choix du provider (Gemini / Claude / OpenAI / **OpenRouter**), saisie de la clé correspondante, et — quand OpenRouter est choisi — un **menu déroulant de modèles** alimenté par `OPENROUTER_MODELS` (label + tag + prix indicatif), avec recherche/champ libre pour coller un slug OpenRouter arbitraire.

### 2. Transmettre provider + clé + modèle au workflow (front)
Dans `src/components/ebook/EbookCompleteWorkflow.tsx`, aux deux appels `supabase.functions.invoke('complete-book-workflow', …)`, ajouter au `body` :
```
provider: getProvider(),                 // 'gemini' | 'claude' | 'openai' | 'openrouter'
openrouterModel: getOpenRouterModel(),   // slug ex. anthropic/claude-sonnet-4.5
userApiKey: getActiveAIKey(...)          // clé du provider actif (sk-or-... pour OpenRouter)
```
Adapter la logique `hasUsableApiKey` / `isAIConfigured()` pour valider selon le provider (une clé `sk-or-...` valide doit être « utilisable », pas seulement `AIza`).

### 3. Brancher OpenRouter dans l'edge function (serveur)
Dans `supabase/functions/complete-book-workflow/index.ts` :
- Lire `provider`, `openrouterModel` dans le payload.
- Ajouter `callOpenRouter(systemPrompt, userPrompt, maxTokens, apiKey, model)` :
  - POST `https://openrouter.ai/api/v1/chat/completions`, header `Authorization: Bearer <clé sk-or->`, `HTTP-Referer` + `X-Title`.
  - messages `[system, user]`, `max_tokens`, `temperature`, retries 429/402/5xx alignés sur l'existant.
- Ajouter `callProviderDirect` pour Claude (`api.anthropic.com`) et OpenAI (`api.openai.com`) afin que le choix de provider soit complet, comme côté client.
- Modifier le dispatcher `callAI` :
  - si `provider === 'openrouter'` et clé `sk-or-` valide → `callOpenRouter(..., openrouterModel)`,
  - si `provider === 'claude'|'openai'` avec clé valide → provider direct,
  - sinon Gemini (`AIza`) comme aujourd'hui,
  - **fallback Lovable AI** conservé dans tous les cas en cas d'échec/absence de clé.
- Assouplir la validation de clé (ne plus rejeter une clé non-`AIza` quand le provider n'est pas Gemini).

### 4. UI de progression
Afficher discrètement le provider + modèle actifs pendant la génération (ex. « Rédaction via OpenRouter · anthropic/claude-sonnet-4.5 ») pour que l'utilisateur voie quel moteur écrit.

## Fichiers concernés
- `src/services/aiWritingService.ts` (déjà OK — source des modèles ; ajustements mineurs éventuels).
- `src/components/shared/OpenAIConfigPanel.tsx` (+ onglet Paramètres) — UI provider + sélecteur de modèles OpenRouter.
- `src/components/ebook/EbookCompleteWorkflow.tsx` — passage de `provider`/`openrouterModel`/clé, validation multi-provider, affichage moteur actif.
- `supabase/functions/complete-book-workflow/index.ts` — branches OpenRouter/Claude/OpenAI + dispatcher + validation.

## Notes
- BYOK : aucune clé serveur partagée pour OpenRouter ; les coûts sont à la charge de l'abonné via sa clé `sk-or-...`.
- Les modèles `:free` d'OpenRouter restent proposés mais avec l'avertissement existant (limites de débit strictes).
- Hors périmètre : monétisation par palier, tunnel de paiement, autres outils que la rédaction de livres.
