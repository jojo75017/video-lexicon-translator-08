Je confirme le problème : les outils KDP actuels utilisent encore un ancien appel direct à OpenAI (`api.openai.com`) alors que le projet est configuré pour les clés Gemini abonné (`AIza...`). Résultat : description, mots-clés, catégories et A+ peuvent échouer ou ne rien afficher.

Plan de correction :

1. Remplacer le moteur IA de l’onglet KDP
   - Modifier les fonctions KDP dans `useSubscriptionGeneration` pour utiliser Gemini via le service existant `callGemini` / `callGeminiJSON`.
   - Supprimer la dépendance à l’ancien appel OpenAI pour ces outils.
   - Garder la logique BYOK : chaque abonné utilise sa clé Gemini déjà configurée dans EbookStudio.

2. Corriger les messages utilisateur
   - Remplacer “Clé API OpenAI requise” par “Clé API Gemini requise”.
   - Afficher une erreur claire si la clé est absente ou ne commence pas par `AIza`.
   - Ajouter des messages précis en cas de quota, clé invalide ou réponse IA mal formatée.

3. Fiabiliser la génération Description KDP
   - Générer une description Amazon propre, persuasive, limitée aux contraintes KDP.
   - Inclure titre, auteur, public cible, résumé/chapitres et bénéfices lecteur.
   - Retourner un texte directement copiable, sans JSON inutile.

4. Fiabiliser les 7 mots-clés KDP
   - Demander une réponse JSON stricte.
   - Normaliser le résultat même si Gemini renvoie une liste simple au lieu d’objets détaillés.
   - Garantir l’affichage des 7 champs dans l’interface avec copie facile.

5. Fiabiliser les catégories KDP
   - Demander une réponse JSON stricte avec catégorie, concurrence, estimation et recommandation.
   - Normaliser le résultat pour éviter que l’interface reste vide si la réponse est légèrement différente.

6. Fiabiliser le contenu A+
   - Utiliser Gemini avec un prompt plus strict.
   - Supprimer les faux témoignages présentés comme réels : les remplacer par des “modèles de témoignages à demander aux lecteurs”, pour rester crédible et éviter les contenus trompeurs.
   - Ajouter une validation minimale de la structure retournée pour éviter les crashes si une section manque.

7. Améliorer `EbookKdpTools.tsx`
   - Utiliser la clé Gemini issue de la configuration existante au lieu de dépendre uniquement de la prop `apiKey` si nécessaire.
   - Ajouter des états de chargement par bouton pour mieux voir que la génération travaille.
   - Ajouter un message visible si la clé Gemini n’est pas configurée.
   - Garder l’onglet et la sidebar inchangés pour ne pas casser ce qui vient d’être stabilisé.

Fichiers concernés :
- `src/hooks/useSubscriptionGeneration.ts`
- `src/components/ebook/EbookKdpTools.tsx`

Aucun changement prévu :
- Pas de nouvelle table.
- Pas d’envoi email.
- Pas de modification sidebar/dashboard.
- Pas de modification des fichiers auto-générés Lovable Cloud.

Après validation, je corrige directement ces deux fichiers.