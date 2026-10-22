# Achats des nouvelles formules
- [x] Ajouter le bandeau KDP Pilot pour Starter sur les deux pages d’offres ; lien partenaire ouvert et rendu vérifiés. Aucun paiement KDP Pilot interne : abonnement indépendant, paiement final chez le partenaire non testé.
- [ ] Publier les offres Starter/Auteur/Édition et le bandeau KDP Pilot après contrôle de sécurité.
- [x] Brancher les boutons, proposer 1/2/3 fois pour Auteur et Édition et supprimer le 6 fois des nouvelles ventes.
- [x] Préserver les abonnements historiques (marqueur des nouveaux achats), 28 tests réussis et formulaires Stripe Auteur 2× / Édition 3× affichés en mode test, sans débit ni email. Site non publié ; encaissement et activation après achat non testés pour éviter un achat et un email.

# Correction scénario BD
- [x] Transmettre la clé et le moteur de rédaction sélectionnés dans les deux parcours BD.
- [x] Afficher la cause réelle et arrêter les appels répétés après un refus ou un quota atteint.
- [x] Déployer la correction et passer 13 tests ; appel connecté réel sans clé : message explicite 400, aucune IA appelée.
- [ ] Générer un scénario réel à l'écran : clé personnelle indisponible dans le navigateur de test, aperçu redirigé vers la connexion.

# Correction guides pratiques
- [x] Retirer les consignes romanesques des titres et de la rédaction non-fiction.
- [x] Masquer personnages/univers et conserver le sommaire validé.
- [x] Empêcher la reprise d'un roman pour un guide de même titre.
- [x] Tester les règles (10 tests) et un chapitre réel potager (764 mots, étapes et checklist, sans intrigue). Fonction de rédaction déployée ; site non publié.
- [ ] Vérifier le parcours complet à l'écran : session renouvelée toujours redirigée vers la connexion, vérification bloquée par l'authentification de l'aperçu.

# VC Books
- [x] Créer l’atelier `/v3/vc-books/images` : couvertures couleur, intérieurs noir et blanc, texte de couverture optionnel, téléchargement et lien dans Habiller ; 16 tests réussis, compilation OK, paiements et autres studios inchangés.
- [ ] Vérifier une illustration réelle dans l’atelier : aperçu redirigé vers la connexion malgré la session renouvelée ; création et téléchargement à l’écran non vérifiés.
- [x] Ajouter le robot VC Books sur l’accueil V3, sans modifier les paiements ni les droits ; image chargée et lien vers les formules vérifiés à l’écran.
- [x] Enregistrer les exigences du futur studio : 80–150 pages, édition spéciale plus longue, correction automatique, texte justifié, demi-lettre ou poche 5 × 8 pouces, marges 1,9 cm ; référence originale analysée et réutilisations étudiées. Le générateur et ses exports ne sont pas encore construits.