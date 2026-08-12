# Assistant IA universel + retour des onglets illustrés

Objectif : un vrai assistant qui répond à toutes les questions des abonnés et des visiteurs, et qui **renvoie directement au bon onglet / outil** avec des boutons cliquables. En parallèle, on remet en évidence les onglets illustrés (galerie des outils + parcours du livre) que l'on ne retrouve plus.

## 1. Le bot « Ebookstudio Assistant »

Un seul moteur, trois points d'entrée :

- **Bouton flottant** présent sur toutes les pages V3 abonné (remplace l'actuel bouton Ebookbot).
- **Page dédiée** `/v3/assistant` : plein écran, historique de conversation, questions fréquentes en un clic.
- **Page publique** `/assistant` pour les visiteurs : mêmes réponses, avec invitation à créer un compte / tester la démo après 3 échanges (capture de lead).

Comportement des réponses :

1. Réponse courte et actionnable en français (3 à 6 lignes).
2. **1 à 3 boutons d'action** sous chaque réponse, qui ouvrent l'onglet ou l'outil concerné (ex. « Ouvrir Corriger mon livre », « Ouvrir le Studio Couverture », « Voir les forfaits »).
3. Si la question est floue : une seule question de clarification, plus 3 suggestions cliquables.
4. Si la question sort du périmètre : redirection vers la page Contact / FAQ.

Le bot connaît la totalité du catalogue : les 60+ outils du registre, les onglets du parcours (Plan, Écrire, Habiller, Publier, Vendre), les forfaits, la correction de livre, l'import de manuscrit, les guides et la formation. Il sait aussi répondre aux questions récurrentes : erreur d'authentification du workflow, limite de chapitres, clé Gemini/OpenRouter, export Word/PDF, sommaire, paiement PayPal, migration V2 → V3.

## 2. Retour des onglets illustrés

- **Galerie des outils** : page « Tous les outils » remise en avant avec les cartes illustrées par catégorie (Écriture & Idées, Visuel & Couverture, Audio & Vidéo, Amazon KDP, Analyse & Audit, Marketing & Vente, Business & Pro, Mon espace, Formation), recherche par mots-clés et filtres par catégorie. Accès direct depuis le hub et le menu.
- **Onglets du parcours** : Plan / Écrire / Habiller / Publier / Vendre reçoivent chacun une vignette illustrée et une description courte, sous forme de cartes cliquables en haut du hub.
- Chaque bouton d'action du bot pointe vers une de ces destinations, donc plus de cul-de-sac.

## 3. Détails techniques

- Nouvelle Edge Function `assistant-chat` (streaming) : prompt système enrichi + catalogue d'outils injecté, et une sortie structurée `{ reply, actions: [{ label, route }] }` où chaque `route` est validée contre le registre côté client (les routes inconnues sont ignorées, jamais de lien mort).
- Modèle : Lovable AI par défaut (aucune clé demandée à l'abonné), repli automatique si quota atteint, comme dans `complete-book-workflow`.
- Source de vérité des destinations : `src/data/v2ToolsRegistry.ts` (complété si des outils manquent) + `src/data/v3HeaderMenu.ts`. Un module `src/data/assistantKnowledge.ts` regroupe les Q/R récurrentes et leur route cible.
- Nouveaux composants : `src/components/assistant/AssistantChat.tsx` (bulle + page), `AssistantActionButtons.tsx`, `AssistantFloatingButton.tsx`.
- Nouvelles pages : `src/pages/v3/V3AssistantPage.tsx` et `src/pages/AssistantPublicPage.tsx`, routes ajoutées dans `src/App.tsx`.
- L'ancien `EbookbotChat` reste utilisé par la page `/ebookbot` mais pointe vers le nouveau moteur pour ne pas maintenir deux prompts.
- Journalisation des questions posées (table `assistant_questions` : question, route suggérée, connecté ou non) avec RLS + GRANT, pour repérer les sujets sans réponse et les manques d'outils.

## 4. Ordre de réalisation

1. Registre + base de connaissances (catalogue complet, Q/R fréquentes).
2. Edge Function `assistant-chat` avec sortie structurée et test réel.
3. Composants de chat + boutons d'action, bouton flottant sur la V3.
4. Pages `/v3/assistant` et `/assistant` public.
5. Galerie d'outils illustrée + vignettes du parcours remises en évidence dans le hub.
6. Table de journalisation et vérification bout en bout (questions types, chaque bouton ouvre la bonne page).
