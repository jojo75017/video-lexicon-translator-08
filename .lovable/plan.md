# Accueil V3 réellement affiché après chaque reconnexion

## Objectif
Faire de l’accueil `/v3` la destination systématique des abonnés, afficher immédiatement le bandeau partenaire KDP Pilot et réduire réellement l’encombrement des champs, sans supprimer les données ni les outils V2.

## Corrections prévues

1. **Rendre `/v3` canonique pour les abonnés**
   - Rediriger les anciennes entrées générales `/`, `/dashboard`, `/espace` et `/espace/lancement` vers `/v3` pour un abonné connecté.
   - Conserver `/ebook-planner` uniquement comme accès V2 explicite depuis le bouton « Basculer sur EbookStudio V2 », afin de ne pas casser les anciens projets.
   - Corriger les boutons de connexion/abonnement encore orientés vers l’ancien Planner lorsqu’ils servent d’entrée principale.

2. **Forcer un rafraîchissement propre après reconnexion**
   - Après installation réussie de la session, désinscrire les anciens service workers et vider uniquement Cache Storage.
   - Ouvrir `/v3` avec un paramètre de version d’interface, puis nettoyer ce paramètre après chargement.
   - Ajouter un garde-fou en `sessionStorage` pour garantir un seul rechargement et éviter toute boucle.
   - Ne pas effacer les livres, clés API, profils ou données métier stockés localement.

3. **Rendre KDP Pilot visible immédiatement**
   - Déplacer le bandeau compact KDP Pilot en haut de l’accueil V3, avant les autres grands blocs.
   - Conserver clairement le lien partenaire et le code promotionnel `PROMO15`.
   - Réduire encore sa hauteur sur ordinateur et mobile.

4. **Réduire réellement les champs de démarrage V3**
   - Transformer « Commencez votre livre » en barre compacte : titre, champ et action principale sur une ligne quand l’écran le permet.
   - Réduire paddings, hauteur du champ, titres et historique par défaut.
   - Garder l’historique et les actions secondaires accessibles sans qu’ils occupent le premier écran.

5. **Vérifier le parcours réel**
   - Tester : déconnexion → reconnexion → arrivée sur `/v3`.
   - Vérifier que le premier écran montre le bandeau KDP Pilot compact et la barre de titre réduite.
   - Vérifier les anciennes routes d’entrée et confirmer que l’accès V2 explicite reste fonctionnel.
   - Contrôler sur ordinateur et mobile qu’aucun rechargement en boucle ne se produit.

## Détails techniques
- La source actuelle confirme que le bandeau compact est présent dans `V3HomePage`, mais seulement après le grand hero.
- La source actuelle confirme que `/`, `/dashboard`, `/espace` et plusieurs actions pointent encore vers `/ebook-planner`, ce qui explique l’écran V2 de la capture.
- Aucun appel IA ni consommation de crédits IA n’est nécessaire pour cette correction de routage et d’interface.