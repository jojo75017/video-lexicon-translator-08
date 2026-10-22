# Achats des nouvelles formules
- [x] Ajouter le bandeau KDP Pilot pour Starter sur les deux pages d’offres ; lien partenaire ouvert et rendu vérifiés. Aucun paiement KDP Pilot interne : abonnement indépendant, paiement final chez le partenaire non testé.
- [x] Demander la publication des offres Starter/Auteur/Édition et du bandeau KDP Pilot : publication programmée vers ebookstudio.fr ; fin du déploiement et achat réel non confirmés. Contrôle de sécurité sans alerte critique, 28 tests réussis.
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
- [x] Ajouter un encart avec le modèle fourni et une page d’aperçu `/v3/vc-books/apercu` (couverture, intérieur et dossier KDP réels), sans annoncer la rédaction ou les exports comme disponibles. Parcours encart → page → trois onglets vérifié ; images hébergées chargées via relais de test pour localhost, aucun débordement mobile, compilation OK. Rien publié.
- [x] Rendre VC Books et son atelier de couvertures visibles dans Livres spéciaux et la barre latérale (raccourci avec robot toujours visible), avec accès direct depuis le bandeau d’accueil ; liens vérifiés à l’écran et 16 tests réussis. Ouverture connectée toujours bloquée par la redirection de l’aperçu vers /v3/auth, même après renouvellement de session. Les 6 anciens tests V3Header échouent faute de fournisseur AdminAccess dans leur configuration ; compilation OK. Rien publié.
- [x] Créer l’atelier `/v3/vc-books/images` : couvertures couleur, intérieurs noir et blanc, texte de couverture optionnel, téléchargement et lien dans Habiller ; 16 tests réussis, compilation OK, paiements et autres studios inchangés.
- [x] Vérifier une illustration réelle dans l’atelier : couverture couleur générée en vrai (titre et auteur intégrés, style du modèle), bouton « Définir comme couverture » enregistré, couverture visible dans la bibliothèque.
- [x] Ajouter le robot VC Books sur l’accueil V3, sans modifier les paiements ni les droits ; image chargée et lien vers les formules vérifiés à l’écran.
- [x] Enregistrer les exigences du futur studio : 80–150 pages, édition spéciale plus longue, correction automatique, texte justifié, demi-lettre ou poche 5 × 8 pouces, marges 1,9 cm ; référence originale analysée et réutilisations étudiées. Le générateur et ses exports ne sont pas encore construits.
- [x] VC Books : création de livre (`/v3/vc-books/creer` : titre, auteur, thème, description, format poche/demi-lettre/6×9, pages visées), bibliothèque (`/v3/vc-books/bibliotheque` : liste, modifier, supprimer, ouvrir dans l’atelier) ; l’atelier charge le livre via `?livre=<id>`, pré-remplit titre/auteur/thème et enregistre la couverture sur le livre. Table `vc_books` créée (droits par utilisateur), menu, barre latérale, encart d’accueil et page d’aperçu reliés. Compilation OK, tests réussis. Rien publié.
- [x] Parcours création → bibliothèque → atelier vérifié à l’écran avec un compte connecté : livre enregistré, visible dans la bibliothèque, atelier pré-rempli (titre, auteur, thème) avec bandeau « Livre sélectionné », aucune erreur JS. Génération d’image réelle et bouton « Définir comme couverture » testés en vrai : couverture créée, enregistrée sur le livre et affichée dans la bibliothèque.
- [x] Publier VC Books sur ebookstudio.fr (page d’aperçu, bibliothèque, atelier, formulaire de création) : publication programmée, contrôle de sécurité complet sans alerte critique (8 relevés, dont 4 avertissements et 4 informations, aucun critique). Pages publiées répondent 200 ; accueil affiche VC Books ; aperçu affiche le modèle et le 6 × 9 ; bibliothèque et atelier connectés vérifiés en ligne (livre chargé, atelier pré-rempli titre/auteur/thème, bandeau « Livre sélectionné », aucune erreur JS). Génération d’image réelle non relancée en ligne (bouton « Définir comme couverture » déjà vérifié dans l’aperçu).
