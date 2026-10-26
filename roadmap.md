# Correction plan de lancement
- [x] Utiliser les informations du livre sélectionné et ne plus exiger un sujet principal ; deux tests réussis (préremplissage et changement de livre), compilation OK. Rien publié.
- [ ] Vérifier le plan complet à l’écran : aperçu redirigé vers la connexion malgré une session renouvelée ; génération réelle non vérifiée.

# Amazon Ads dans Ebookstudio KDP
- [x] Adapter la page Publicité au modèle : trois campagnes Sponsored Products, budget réparti, niveaux Débutant/Intermédiaire/Expert, copie et historique conservés, lien Ebookstudio KDP mis à jour.
- [x] Ajouter une simulation transparente à partir des hypothèses saisies ; six tests réussis, formulaire connecté et message de clé manquante vérifiés, aucun débordement mobile ni erreur JavaScript. Rien publié.
- [ ] Vérifier une génération réelle des trois campagnes et la lecture d’un ASIN jusqu’au résultat : clé IA personnelle absente de la session de test ; aucune campagne Amazon lancée.

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
- [x] Ajouter au formulaire de création les idées de titres prêtes à l’emploi (clic = titre + sous-titre), le champ sous-titre et les catégories KDP cliquables (10 catégories), enregistrés avec le livre ; migration base pour sous-titre et catégories. 20 tests réussis, compilation OK. Rien publié.
- [x] Ajouter dans l’atelier la fiche KDP modifiable (ISBN réel, titre, auteur, thème, prix 12,99 €), copie par champ et copie complète ; livre connecté pré-rempli, ISBN vide, prix et copies vérifiés à l’écran, 4 tests réussis. Publiée et vérifiée en ligne sur ebookstudio.fr (titre, auteur, thème pré-remplis, prix 12,99 €, ISBN vide à recopier depuis KDP).
- [x] Ajouter un encart avec le modèle fourni et une page d’aperçu `/v3/vc-books/apercu` (couverture, intérieur et dossier KDP réels), sans annoncer la rédaction ou les exports comme disponibles. Parcours encart → page → trois onglets vérifié ; images hébergées chargées via relais de test pour localhost, aucun débordement mobile, compilation OK. Rien publié.
- [x] Rendre VC Books et son atelier de couvertures visibles dans Livres spéciaux et la barre latérale (raccourci avec robot toujours visible), avec accès direct depuis le bandeau d’accueil ; liens vérifiés à l’écran et 16 tests réussis. Ouverture connectée toujours bloquée par la redirection de l’aperçu vers /v3/auth, même après renouvellement de session. Les 6 anciens tests V3Header échouent faute de fournisseur AdminAccess dans leur configuration ; compilation OK. Rien publié.
- [x] Créer l’atelier `/v3/vc-books/images` : couvertures couleur, intérieurs noir et blanc, texte de couverture optionnel, téléchargement et lien dans Habiller ; 16 tests réussis, compilation OK, paiements et autres studios inchangés.
- [x] Vérifier une illustration réelle dans l’atelier : couverture couleur générée en vrai (titre et auteur intégrés, style du modèle), bouton « Définir comme couverture » enregistré, couverture visible dans la bibliothèque.
- [x] Ajouter le robot VC Books sur l’accueil V3, sans modifier les paiements ni les droits ; image chargée et lien vers les formules vérifiés à l’écran.
- [x] Enregistrer les exigences du futur studio : 80–150 pages, édition spéciale plus longue, correction automatique, texte justifié, demi-lettre ou poche 5 × 8 pouces, marges 1,9 cm ; référence originale analysée et réutilisations étudiées. Le générateur et ses exports ne sont pas encore construits.
- [x] VC Books : création de livre (`/v3/vc-books/creer` : titre, auteur, thème, description, format poche/demi-lettre/6×9, pages visées), bibliothèque (`/v3/vc-books/bibliotheque` : liste, modifier, supprimer, ouvrir dans l’atelier) ; l’atelier charge le livre via `?livre=<id>`, pré-remplit titre/auteur/thème et enregistre la couverture sur le livre. Table `vc_books` créée (droits par utilisateur), menu, barre latérale, encart d’accueil et page d’aperçu reliés. Compilation OK, tests réussis. Rien publié.
- [x] Parcours création → bibliothèque → atelier vérifié à l’écran avec un compte connecté : livre enregistré, visible dans la bibliothèque, atelier pré-rempli (titre, auteur, thème) avec bandeau « Livre sélectionné », aucune erreur JS. Génération d’image réelle et bouton « Définir comme couverture » testés en vrai : couverture créée, enregistrée sur le livre et affichée dans la bibliothèque.
- [x] Publier VC Books sur ebookstudio.fr (page d’aperçu, bibliothèque, atelier, formulaire de création) : publication programmée, contrôle de sécurité complet sans alerte critique (8 relevés, dont 4 avertissements et 4 informations, aucun critique). Pages publiées répondent 200 ; accueil affiche VC Books ; aperçu affiche le modèle et le 6 × 9 ; bibliothèque et atelier connectés vérifiés en ligne (livre chargé, atelier pré-rempli titre/auteur/thème, bandeau « Livre sélectionné », aucune erreur JS). Génération d’image réelle non relancée en ligne (bouton « Définir comme couverture » déjà vérifié dans l’aperçu).
- [x] Remonter l’encart VC Books (Le Petit Cabinet) juste sous la barre des robots de l’accueil V3, puis republier : publication programmée et vérifiée en ligne — accueil affiche l’encart en premier bloc (y=341, sous la barre des robots) et la page d’aperçu affiche « Le prix, c’est KDP qui l’affiche » avec 12,99 € TTC et 5,21 € par exemplaire.
- [x] Faire qu’un clic sur une idée de livre remplisse toute la fiche VC Books (titre, sous-titre, thème, description, 2-3 catégories KDP) : idées enrichies dans `src/data/vcBooksIdeas.ts`, clic vérifié à l’écran (deux idées testées, champs et catégories changés), 5 tests réussis.
- [x] Rendre visibles les catégories choisies dans la fiche VC Books : la règle « tous les boutons en bleu » de `v3-public.css` masquait l’état sélectionné ; nouvelles puces `.v3-chip-toggle` (blanc au repos, couleur du thème quand choisies), vérifié à l’écran (3 puces orange, 7 blanches).
- [x] VC Books : robot d'écriture des pauses + exports Word et PDF
- [x] Publier la nouvelle mise en page des livres VC Books (rubriques de 10 pauses, question et réponse, « Comment profiter de ces N pauses ») et le bouton « Enregistrer et rédiger avec le robot » : publication programmée vers ebookstudio.fr, contrôle de sécurité frais sans alerte critique (8 relevés, 4 avertissements, 4 informations), pages 200 et nouveau format retrouvé dans les fichiers publiés. Rédaction réelle et exports non relancés en ligne : aucun livre n'a de pauses en base et la rédaction utilise la clé IA du client.
