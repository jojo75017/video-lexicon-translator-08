# Roadmap
- [x] Fils d’El Cuervo : fiche restaurée, 6 personnages et 32 parties conservés ; sauvegarde, validation et accès au bouton de rédaction vérifiés connecté, 4 tests réussis, sans génération ni publication.
- [ ] Corriger la couverture de Léo et le studio : scène continue, format carré jeunesse, aperçu et téléchargements vérifiés sans publication.
- [x] Ajouter « Voir votre Flipbook » aux deux bibliothèques : lecture depuis le compte de Georges vérifiée, affichage mobile contrôlé et trois tests réussis ; /essai et spécimen /v3/ebook-illustre ouverts à l’écran.
- [ ] Publication demandée le 10 novembre : confirmer la lecture vidéo sur le site public ; le fichier CDN est valide (52,33 secondes), mais localhost ne sert pas le CDN. Les anciennes alertes approfondies du 7 novembre restent à requalifier.

- [x] Audit V3 du 7 novembre : harmoniser les textes confirmés (clés personnelles, tutoriels, langues et KDP), tester tarifs/droits et vérifier les pages depuis le compte connecté sur ordinateur/mobile.
- [x] Audit sécurité du 7 novembre : protéger 15 services IA contre les appels anonymes, préserver les clients dans les essais/paiements, ne plus renvoyer les codes, retirer le rôle modifiable et protéger les téléchargements d’images ; tests sans email ni paiement.
- [ ] Diffusion large : nouveau scan approfondi requis après enregistrement de ces corrections ; validation de Georges requise pour remplacer les anciens codes bêta courts et adapter l’email de démo public. Aucun nouvel envoi ni publication du site autorisé.
- [x] Dépendances : Fabric, googleapis et Firecrawl SDK inutilisés retirés ; Axios, Word, Excel et navigation mis à jour ; contrôles des imports conservés.
- [ ] Dépendances restantes : correctifs amont indisponibles ou mises à jour nécessitant migration et tests dédiés (PDF, composants graphiques et dépendances transitives).

- [x] Page Clés API V3 : guide illustré détaillé Gemini/OpenAI/OpenRouter et accès avant « Commence ici », vérifications ordinateur/mobile sans paiement ni publication.

- [x] Sécurité : 49 failles graves corrigées (outils payants, emails, admin, accès payants, données)
- [ ] Sécurité restante : anciens codes abonnés/bêta à préserver jusqu’à décision, démo publique à sécuriser, 4 avertissements de données/stockage et dépendances encore signalées ; le prochain scan doit requalifier les alertes après corrections.
- [ ] Clé de signature Resend (RESEND_WEBHOOK_SECRET) à fournir par Georges pour réactiver le suivi des emails
- [x] Liens mensuels déjà publiés précédemment ; aucune nouvelle publication du site pour cet audit.

- [x] Rendre le suivi des essais immédiatement visible et accessible en orange, sans les réglages du lancement ; accès connecté, copie des emails et export CSV vérifiés.
