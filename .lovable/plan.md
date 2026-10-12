# Module « EbookStudio AI Team » — 10 robots KDP

## 1. Gestion des accès et branchement
Aujourd'hui :
- Les options achetées sont enregistrées dans une table de droits (`module_entitlements`) par le système de paiement, uniquement après un paiement confirmé par Stripe.
- Une seule vérification d'accès (`useModuleAccess`) dit : admin → oui ; forfait complet → oui (sauf modules « achat seul ») ; sinon → oui seulement si l'option a été achetée.
- L'Édition 497 € est accordée par le système de paiement (plans `edition247_*`).

Branchement d'AI Team :
- Nouvelle option `ai-team` à 47 € (paiement unique), vendue comme les autres options (mêmes tunnel et page d'achat).
- Auteur 97 € : verrouillé, avec le bouton « Ajouter pour 47 € ».
- Édition 497 € : AI Team ajouté automatiquement au moment du paiement confirmé, et aussi pour les clients Édition déjà inscrits.
- Ajout aux listes de la page « Nos offres » : dans les « Options disponibles » de l'offre Auteur, et dans « Pack Édition Pro inclus » de l'offre Édition.
- Les anciens clients (47 € à vie, V2, abonnements) gardent tout ce qu'ils ont. Pour eux, AI Team est une option payante, sauf décision contraire de votre part.

## 2. Emplacement
- `/v3/ai-team` : le tableau de bord avec la « Mission globale », les 10 robots et les fiches livres. Lien ajouté au menu et à « Raccourci rapide ».
- `/v3/ai-team/:robotId` : le chat d'un robot, avec son historique.
- `/ai-team-essai` : la page publique avec le Robot 01 gratuit. Le visiteur donne son email, a droit à 3 essais, puis voit un message vers les offres.
- `/admin/ai-team-leads` : la liste des emails, avec un export.

## 3. Appels IA et coût pour vous
- Robots abonnés : chaque client utilise sa propre clé Gemini ou OpenAI, depuis le panneau « Clés API » déjà existant. L'appel part du navigateur du client avec sa clé, comme pour les moteurs en deux temps actuels. Ces appels ne vous coûtent rien.
- Sans clé : un message « Ajoutez votre clé » s'affiche avec un lien vers le panneau. Pas de moteur gratuit de secours, pour protéger vos crédits.
- Robot gratuit de la page publique : il passe par le serveur avec l'IA Lovable. Les 3 essais sont comptés sur le serveur, par email et par appareil, avec en plus une limite globale de 300 essais par jour. Coût estimé : quelques centimes par essai, soit environ 5 à 15 € pour 1 000 visiteurs, prélevés sur vos crédits Lovable.
- Le texte est toujours rendu en texte brut : la consigne est donnée à l'IA, puis tout reste de HTML ou de Markdown est nettoyé avant l'affichage.

## 4. Ce que vous devez faire
- Valider ce plan, puis le prix de 47 € et le montant de la limite gratuite (3 essais et 300 par jour).
- Me dire si les anciens clients doivent payer l'option ou la recevoir gratuitement.
- Après mes tests en mode test, autoriser la mise en vente réelle de l'option et la publication.
- Ajouter le bouton 47 € dans le tunnel Landaa si vous voulez le proposer là-bas (je vous donnerai le lien).
- Aucun email ne partira vers les inscrits du robot gratuit sans votre accord.

## Détails techniques
- Données : tables `ai_team_projects` (fiche livre), `ai_team_messages` (robot_id, project_id, contenu, mission_id) et `ai_team_leads` (email, essais, empreinte). Elles sont protégées par utilisateur, et les leads sont lisibles seulement par l'admin.
- Mission : enchaînement des robots 01 à 10 côté navigateur. Chaque robot reçoit la fiche du livre et les résultats des robots précédents. Un bouton permet d'arrêter et un autre d'effacer la mission.
- Actions sous chaque réponse : copier, sauvegarder dans le livre, envoyer à un autre robot, supprimer. Le livre s'exporte en .txt.
- Le thème sombre cyber est limité au module, avec ses propres couleurs. Les 10 avatars sont des têtes de robots SVG, chacune avec son accessoire.
- Le robot gratuit tourne dans une fonction serveur qui utilise le modèle IA par défaut, avec un compteur côté serveur et un refus au-delà de 3 essais.
- Paiement : un pack `ai_team` est ajouté au tunnel d'options existant. Le droit est accordé à l'achat et dans l'attribution Édition. Des tests sont ajoutés pour le prix de 47 €, l'inclusion dans Édition et la limite de 3 essais.
