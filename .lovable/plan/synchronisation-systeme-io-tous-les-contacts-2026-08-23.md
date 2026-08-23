# Synchronisation Systeme.io — tous les contacts

## Objectif

Envoyer tous vos contacts dans Systeme.io pour pouvoir y faire vos campagnes marketing, tout en gardant Resend pour les envois depuis l'application. Le nettoyage (doublons, adresses mortes) se fera ensuite directement dans Systeme.io.

**C'est facile** : la brique technique existe déjà (`SYSTEMEIO_API_KEY` en place, fonction d'envoi vers Systeme.io déjà écrite). Il manque juste la synchro en masse.

## Périmètre (chiffres réels de la base)

| Segment | Nombre | Action |
|---|---|---|
| Prospects actifs | 1 440 | Synchronisés, tag `prospect` |
| Prospects en pause (jamais engagés) | 541 | Synchronisés, tag `prospect-froid` |
| Leads de tunnel (quiz, pages cadeau) | 24 | Synchronisés, tag `lead-tunnel` |
| Clients payants | 1 | Synchronisé, tag `client` (pour l'exclure des promos) |
| **Désabonnés** | **39** | **Jamais envoyés** (règle absolue, sinon plaintes et blacklistage) |

Total à pousser : **environ 2 006 contacts**.

## Étape 1 — Test de la connexion (1 contact)

- Envoi d'un seul contact test (votre adresse `boubetgeorges@gmail.com`) vers Systeme.io avec un tag `test`.
- Vérification dans votre compte Systeme.io que le contact et le tag apparaissent bien.
- Si le système de tags répond mal, création des tags côté Systeme.io d'abord, puis nouvel essai.

## Étape 2 — Fonction de synchro en masse

- Nouvelle fonction d'administration `sync-systemeio-contacts` (réservée admin) :
  - lit les contacts par lots de 50, avec pause entre chaque lot (Systeme.io limite à ~120 requêtes/minute : 1 création + 1 tag par contact) ;
  - marque chaque contact synchronisé (nouvelle colonne `systemeio_synced_at`) → si un lot échoue, on reprend là où on s'était arrêté, **sans doublon** ;
  - tags appliqués : `ebookstudio-prospect` pour tous + tag de segment (`prospect-froid`, `lead-tunnel`, `client`) ;
  - journal des succès/échecs visible dans le panneau admin.
- Migration : ajout de la colonne `systemeio_synced_at` sur `sales_prospects` et `funnel_leads`.

## Étape 3 — Exécution

1. `dry_run` : affiche les compteurs par segment sans rien envoyer.
2. Envoi réel par lots de 50 (~40 lots, lancés depuis le panneau admin, reprise automatique).
3. Rapport final : synchronisés / échecs (adresses refusées par Systeme.io).

Durée estimée : 20-40 minutes au total, sans action de votre part entre les lots.

## Étape 4 — Après la synchro

- Réactivation du push automatique vers Systeme.io pour les **nouveaux** contacts (quiz, pages de capture) : votre liste Systeme.io reste à jour toute seule. (Désactivé précédemment à votre demande — remis en route avec votre accord.)
- Bouton « Re-synchroniser » dans le panneau admin pour renvoyer uniquement les contacts jamais synchronisés.

## Comment comparer Resend vs Systeme.io ensuite

Quand vous enverrez une campagne depuis Systeme.io, utilisez des liens avec `?src=systemeio` (comme le modèle copier-coller déjà livré) : les visites et ventes venant de Systeme.io seront visibles séparément dans le suivi. Nettoyage des contacts (suppression des froids, segmentation) : directement dans l'interface Systeme.io, comme prévu.

## Détails techniques

- Helper existant : `supabase/functions/_shared/systemeio.ts` (`pushToSystemeIo` : crée le contact s'il n'existe pas, sinon récupère l'existant — aucun risque de doublon côté Systeme.io).
- Secret `SYSTEMEIO_API_KEY` déjà en place, aucune clé à fournir.
- Exclusions codées en dur : `unsubscribed = true` jamais poussés.
- Aucun changement côté Resend : les envois applicatifs (commandes, relances paniers) restent sur Resend.

## Ordre d'exécution

1. Migration colonne `systemeio_synced_at` + création de la fonction `sync-systemeio-contacts`.
2. Test 1 contact → vérification dans votre compte Systeme.io.
3. `dry_run` → validation des compteurs ensemble.
4. Lancement des lots jusqu'aux ~2 006 contacts.
5. Réactivation du push automatique des nouveaux leads + bouton admin.
