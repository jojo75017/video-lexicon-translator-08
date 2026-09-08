# Tous les agents en 2 temps : Gemini analyse, ChatGPT produit

Règle unique à appliquer partout : chaque module travaille en deux temps visibles.

```text
Temps 1 — Gemini (l'architecte)      Temps 2 — ChatGPT (la plume / la production)
analyse, recherche, brief,     →     rédige, illustre, narre, optimise
mémoire du livre, cohérence          à partir du brief du temps 1
```

Les clés restent celles de l'abonné : Gemini (`AIza…`) pour le temps 1, OpenRouter (`sk-or-…`) pour le temps 2. Si une clé manque, le module le dit clairement et propose de la renseigner ; aucun module ne tourne en silence sur un seul moteur.

## Étape 1 — Rendre les 2 temps visibles (immédiat)

- Une source unique décrit, pour chaque module, son temps 1 et son temps 2 (rôle, moteur, ce qu'il produit).
- La section « Les moteurs IA de la V3 » sur `/v3` n'affiche plus un moteur par carte mais les deux temps de chaque module, dans le même style émeraude et or.
- Chaque module concerné affiche en haut le même petit repère : « Temps 1 · Gemini analyse → Temps 2 · ChatGPT produit », avec l'état des deux clés.
- Correction au passage : la carte « Couverture & mise en page » pointe vers le studio de couverture actuel, plus vers l'ancien onglet.

## Étape 2 — Un moteur 2 temps partagé (fondation)

Un seul mécanisme réutilisé par tous les modules, plutôt qu'un bricolage par page :

- Temps 1 : Gemini produit un brief structuré (analyse, contraintes, plan, mémoire, points de cohérence).
- Temps 2 : ChatGPT via OpenRouter produit le livrable en s'appuyant sur ce brief.
- Le brief du temps 1 est conservé et affiché à l'abonné : il peut le relire, le corriger, puis relancer le temps 2 sans refaire le temps 1.
- Suivi de coût et plafond conservés, règle « 100 % français » conservée, messages d'erreur clairs (clé manquante, quota, service saturé).

## Étape 3 — Migration module par module (avec vérification entre chaque)

Ordre retenu, du plus utile au plus accessoire :

1. Manuscrit et chapitres (Studio, Version Longue) — déjà proche du modèle, à aligner
2. Correction du livre
3. Métadonnées Amazon (titre, sous-titre, 7 mots-clés, catégories)
4. Traduction 10 langues
5. Recherche et niche (espion concurrents, analyse de niche)
6. Visuels de couverture : temps 1 = direction artistique écrite par Gemini, temps 2 = génération de l'image
7. Livre audio : temps 1 = préparation du texte à lire (découpe, ponctuation, prononciation), temps 2 = voix

Chaque module est livré seul, vérifié à l'écran, avant de passer au suivant.

## Ce qui n'est pas touché

Base de données, sécurité, calculs KDP, paiements, tarifs, et le studio de couverture tout juste unifié. Aucune fausse promesse : un module n'affiche « 2 temps » que lorsque les deux temps tournent vraiment.

## Détails techniques

- Nouveau `src/data/v3TwoStepEngines.ts` : source unique `{ id, module, route, temps1: { moteur:'gemini', role, output }, temps2: { moteur:'chatgpt', role, output } }`.
- `V3EngineBanner.tsx` réécrit pour consommer cette source (deux lignes par carte). Nouveau `V3TwoStepBadge.tsx` réutilisable en tête de module, branché sur l'état des clés existant (BYOK).
- Nouveau `supabase/functions/_shared/two-step.ts` : `runTwoStep({ analysisPrompt, productionPrompt, geminiKey, openRouterKey })` → `{ brief, output, usage }`. Réutilise `LANGUE_RULE`, le retry borné et la gestion 402/429 de `_shared/cs-ai.ts` ; erreurs typées `MISSING_GEMINI_KEY`, `MISSING_OPENROUTER_KEY`, `CREDITS_EXHAUSTED`.
- Nouveau hook `src/hooks/useTwoStepAgent.ts` : états `analyzing | briefReady | producing | done`, brief éditable, relance du temps 2 seul, `trackAIUsage` conservé.
- Migration : chaque fonction concernée (`cs-write-chapter`, `strict-proofread`/`proofreadBook`, `agent-ams-keywords`, `translate-content`, `agent-competitor-spy`/`analyze-niche`, `cover-pro-generate` côté brief, TTS) passe par `runTwoStep` sans changer son contrat d'entrée/sortie côté client.
- Aucune migration SQL, aucune modification de `cover_projects`, des crédits ni des webhooks de paiement.
