## Problèmes identifiés

**1. Description KDP trop courte**
- `maxTokens: 1500` côté Gemini — mais le prompt demande "max 1900 caractères"
- En français, 1900 caractères ≈ 600-800 tokens normalement, MAIS Gemini 2.5 Flash consomme beaucoup de tokens en "thinking" interne avant de produire le texte
- Résultat : la description est tronquée avant d'atteindre la longueur attendue

**2. Mots-clés "Impossible de parser la réponse JSON de Gemini"**
- `callGeminiJSON` tente `JSON.parse` puis cherche `{...}` ou `[...]`. Si la réponse est tronquée (max tokens atteint), le `]` final manque → parse échoue
- Le service Gemini ne demande pas explicitement `responseMimeType: 'application/json'` à l'API → Gemini renvoie parfois du texte mêlé de markdown, voire du commentaire avant le tableau
- Pas de réparation automatique (suppression virgules trailing, troncature, etc.)

## Plan de correction (2 fichiers, sans casser le reste)

### A. `src/services/geminiService.ts`
1. Augmenter `maxOutputTokens` par défaut à **8192** (au lieu de 2000)
2. Ajouter un paramètre `jsonMode` à `callGemini` qui, quand activé, ajoute `responseMimeType: 'application/json'` dans `generationConfig` → Gemini renvoie alors du JSON pur garanti
3. Faire en sorte que `callGeminiJSON` active automatiquement `jsonMode: true`
4. Logger `finishReason` quand la réponse est vide ou tronquée pour debug futur
5. Améliorer l'extracteur JSON dans `callGeminiJSON` :
   - Strip markdown ` ```json `
   - Trouver bornes `{...}` ou `[...]`
   - Réparer virgules trailing (`,}` / `,]`)
   - Nettoyer caractères de contrôle
   - En dernier recours, si la réponse est tronquée à mi-chemin dans un tableau, fermer proprement avant de parser

### B. `src/hooks/useSubscriptionGeneration.ts`
1. **Description KDP** : passer `maxTokens` de 1500 → **4000** pour laisser de la marge au "thinking" interne de Gemini 2.5 Flash
2. **Mots-clés KDP** : passer `maxTokens` de 1200 → **3000**
3. **Catégories KDP** : passer `maxTokens` de 1200 → **3000**
4. **A+ Content** : passer `maxTokens` de 4000 → **8000**
5. Si `callGeminiJSON` échoue toujours sur les keywords/categories, faire un **second essai automatique** en demandant à Gemini "réponds UNIQUEMENT en JSON valide commençant par `[` et terminant par `]`, rien d'autre"

## Pas touché
- Sidebar
- Pages, routes, navigation
- Dashboard
- Edge functions (la migration est déjà côté client via `geminiService`)
- Workflow P1-P15
- Schéma DB
- Aucune nouvelle table, aucun nouveau secret

## Fichiers modifiés
- `src/services/geminiService.ts`
- `src/hooks/useSubscriptionGeneration.ts`

Après validation, j'applique ces corrections directement.