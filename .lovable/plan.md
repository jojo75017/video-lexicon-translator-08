Je vois le problème : la description générée est beaucoup trop courte (une simple accroche), et les mots-clés restent fragiles car l’outil dépend encore trop d’une réponse JSON parfaite de Gemini.

Plan de correction ciblé, sans toucher au reste :

1. Renforcer la description KDP
- Modifier le prompt de `generateKDPDescription` pour demander une vraie fiche Amazon complète, pas seulement un hook.
- Viser explicitement environ 1 500 à 1 900 caractères, avec un minimum de sécurité autour de 1 200 caractères.
- Garder la limite KDP correcte et la structure attendue : hook, promesse, bénéfices, aperçu du contenu, appel à l’action.
- Ajouter une validation après génération : si Gemini renvoie moins de ~900 caractères ou seulement une accroche, relancer automatiquement une seconde fois avec une consigne plus stricte.
- Si la réponse reste courte, afficher une erreur claire au lieu de laisser croire que la description est exploitable.

2. Fiabiliser les mots-clés KDP
- Ne plus dépendre uniquement du format tableau JSON enrichi avec objets `{ keyword, chars, relevance, tip }`.
- Ajouter une stratégie de secours : si le JSON objet échoue ou retourne vide, relancer Gemini avec un format ultra-simple `string[]`.
- Ajouter un parseur de dernier recours capable d’extraire des mots-clés depuis une réponse texte, même si Gemini ajoute du texte parasite.
- Normaliser le résultat pour toujours essayer d’obtenir 7 mots-clés exploitables.
- Filtrer les entrées vides, les doublons et les mots-clés trop longs, avec recalcul automatique du nombre de caractères.

3. Corriger le mode JSON Gemini
- Adapter `callGeminiJSON` pour accepter un retry automatique strict quand le parsing échoue.
- Ajouter une option de fallback texte afin que les outils KDP puissent récupérer quelque chose d’utilisable au lieu d’échouer sur “Impossible de parser la réponse JSON de Gemini”.
- Garder `responseMimeType: application/json`, mais ne plus considérer cela comme suffisant.

4. Corriger le contenu A+ si nécessaire
- Remplacer son parsing JSON manuel par `callGeminiJSON`, déjà plus robuste.
- Ajouter une validation minimale pour éviter les réponses incomplètes.

5. Ne pas toucher au reste
- Pas de modification de base de données.
- Pas de modification de sidebar, exports, dashboard, audio, pipeline P1-P15 ou authentification.
- Changements limités à `src/services/geminiService.ts` et `src/hooks/useSubscriptionGeneration.ts`.

Résultat attendu après correction :
- La description KDP doit être une vraie description longue et vendable, pas une phrase d’accroche.
- Les mots-clés doivent apparaître même si Gemini répond avec un JSON imparfait.
- L’erreur “Impossible de parser la réponse JSON de Gemini” ne doit plus bloquer l’outil mots-clés dans les cas courants.