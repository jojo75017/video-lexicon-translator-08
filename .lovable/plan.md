# Essai gratuit 7 jours + envoi automatique vers Systeme.io

Oui, j'ai bien compris. Voici le plan complet.

L'application possède déjà une brique d'essai (`trial-signup`) et un connecteur Systeme.io fonctionnel (création du contact + tags par ID numérique, clé `SYSTEMEIO_API_KEY` déjà en place). Ce qui manque : un vrai registre d'essais avec statut, l'anti-duplication stricte, l'expiration automatique à J+7, et une file de reprise si Systeme.io échoue.

## 1. Registre des essais

Nouvelle table `free_trials` (une ligne par email, unique) :

- prénom, email (unique, en minuscules)
- date de début d'essai, date de fin d'essai (début + 7 jours)
- statut : `actif` / `expire` / `converti`
- suivi Systeme.io : date de synchro, nombre de tentatives, dernière erreur, prochaine tentative

L'unicité de l'email est garantie par la base : une deuxième inscription est refusée, quoi qu'il arrive.

## 2. Formulaire d'inscription

Page publique `/essai-gratuit-7-jours` (et lien depuis la page d'essai existante) :

- Prénom + Email uniquement (+ champ piège anti-robot)
- Cas email déjà utilisé : aucun nouvel essai créé, message clair « Vous avez déjà utilisé votre essai gratuit » avec un bouton vers l'offre payante
- Cas nouvel email : essai créé pour 7 jours, écran de confirmation avec l'accès et la date de fin

## 3. Envoi automatique vers Systeme.io

À chaque nouvel essai, le contact est poussé immédiatement :

- prénom, email
- source = `lovable`
- tag = `ESSAI_EBOOKSTUDIO` (créé automatiquement s'il n'existe pas, puis assigné par ID — c'est ce que l'API exige)
- champs additionnels : date_debut_essai, date_fin_essai

Robustesse : l'inscription est enregistrée **avant** l'appel Systeme.io. Si l'appel échoue, l'essai reste valide, l'erreur est stockée sur la ligne et journalisée, et une tâche planifiée réessaie automatiquement (5 tentatives max, espacement progressif).

## 4. Ce qu'il peut faire pendant les 7 jours

Un essai n'est pas un accès complet. Le statut est reconnaissable partout : bandeau permanent « Essai gratuit — il vous reste X jours ».

Autorisé :

- 1 seul livre (projet unique), complet : sommaire IA, écriture des chapitres, correction professionnelle
- prévisualisation du livre, sauvegarde dans « Mes livres »
- export PDF / DOCX **filigrané** « Version d'essai — EbookStudio » (page de garde + mention en pied de page)

Bloqué (avec une invitation à passer à l'offre payante) :

- 2e livre, Cover Studio Pro, audio/audiobook, KDP Pilot, traductions 10 langues, livres de jeux / histoires courtes
- export sans filigrane et données KDP prêtes à publier

## 5. Expiration automatique à J+7

Tâche planifiée quotidienne :

- tout essai dont la date de fin est dépassée passe en `expire`, l'accès est désactivé côté abonnés
- l'utilisateur garde son livre en **lecture seule** (rien n'est perdu, c'est le meilleur argument de vente) : il peut relire ses chapitres
- toute action (générer, corriger, exporter) ouvre l'écran « Votre essai est terminé » avec le bouton d'achat vers l'offre payante
- s'il achète, l'essai passe en `converti` et son livre redevient pleinement modifiable, sans filigrane

C'est le compromis que je recommande : ni redirection brutale (qui fait fuir), ni accès prolongé (qui tue la conversion).

## 6. Panneau admin


## 5. Panneau admin

Un onglet dans l'admin liste les essais : prénom, email, dates, statut, état de la synchro Systeme.io, avec un bouton « Réessayer l'envoi » par ligne.

## Détails techniques

- Table `public.free_trials` + GRANT (`service_role` complet, aucun accès direct anon/authenticated : tout passe par les fonctions serveur) + RLS avec lecture admin via `has_role`.
- Fonction serveur `trial-signup` réécrite : validation email, insertion atomique `on conflict do nothing` pour l'anti-duplication, désactivation du chemin « réactivation d'essai ».
- Réutilisation de `_shared/systemeio.ts` (`pushToSystemeIo`) avec le tag `ESSAI_EBOOKSTUDIO` et les champs personnalisés.
- Nouvelle fonction `trials-maintenance` : passe les essais échus en `expire`, met à jour `subscribers.status`, et rejoue les synchros Systeme.io en échec. Planifiée via pg_cron (quotidien pour l'expiration, toutes les 15 min pour les reprises), protégée par un secret de cron.
- Aucun email marketing envoyé depuis l'application : Systeme.io déclenche la campagne sur le tag.

## Ce que je vous montrerai à la fin

1. Où se trouve la clé API Systeme.io (secret `SYSTEMEIO_API_KEY`, déjà renseigné) et comment la remplacer.
2. Comment tester une nouvelle inscription (formulaire + vérification en base).
3. Comment vérifier dans Systeme.io que le contact et le tag `ESSAI_EBOOKSTUDIO` sont arrivés.
4. Comment forcer l'expiration pour tester le J+7 (bouton admin de test + antidatage de la date de fin).
