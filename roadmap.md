# Roadmap

- [x] Audit V3 du 7 novembre : harmoniser les textes confirmés (clés personnelles, tutoriels, langues et KDP), tester tarifs/droits et vérifier les pages depuis le compte connecté sur ordinateur/mobile.
- [x] Audit sécurité du 7 novembre : protéger 15 services IA contre les appels anonymes, préserver les clients dans les essais/paiements, ne plus renvoyer les codes, retirer le rôle modifiable et protéger les téléchargements d’images ; tests sans email ni paiement.
- [ ] Diffusion large : nouveau scan approfondi après enregistrement des corrections ; validation requise pour remplacer les anciens codes bêta courts et adapter l’email de démo public. Aucun nouvel envoi ni publication du site autorisé.
- [x] Dépendances : Fabric, googleapis et Firecrawl SDK inutilisés retirés ; Axios, Word, Excel et navigation mis à jour ; contrôles des imports conservés.
- [ ] Dépendances restantes : correctifs amont indisponibles ou mises à jour nécessitant migration et tests dédiés (PDF, composants graphiques et dépendances transitives).

- [x] Page Clés API V3 : guide illustré détaillé Gemini/OpenAI/OpenRouter et accès avant « Commence ici », vérifications ordinateur/mobile sans paiement ni publication.

- [x] Sécurité : 49 failles graves corrigées (outils payants, emails, admin, accès payants, données)
- [ ] Sécurité restante : anciens codes abonnés à 6 caractères, essai gratuit par email, vérification paiement au retour, imports d'URL, lien de désinscription, 62 avertissements
- [ ] Clé de signature Resend (RESEND_WEBHOOK_SECRET) à fournir par Georges pour réactiver le suivi des emails
- [ ] Publier les liens mensuels /paiement-mensuel (attente accord de Georges)
