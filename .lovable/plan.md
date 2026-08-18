# Campagne V3 en masse — 3 cadeaux pour faire cliquer

## Ce que disent les données (vérifié)

- 647 prospects en base, 683 adresses déjà contactées, 476 ouvreurs, seulement 45 cliqueurs.
- 4 224 envois sur les 3 derniers jours : le moteur d'envoi fonctionne, c'est le **clic** qui manque.
- Conclusion : ne pas ajouter des envois, changer la raison de cliquer. Un cadeau immédiat, sans achat, avant toute offre.

## Les 3 cadeaux (livrés tout de suite, sans paiement)

1. **10 niches Amazon rentables 2026** — page cadeau déjà en place, accès immédiat dans l'application.
2. **Le guide « Publier son premier livre sur KDP »** (PDF déjà disponible) — envoyé en lien direct, pas en pièce jointe.
3. **Un chapitre écrit gratuitement par l'IA** à partir du sujet du prospect — le cadeau qui fait vraiment cliquer : il essaie l'outil avant d'acheter, page dédiée limitée à 1 chapitre par adresse.

Un seul bouton par email vers **une page cadeaux unique** qui présente les 3 et les débloque après saisie de l'email. L'offre payante apparaît seulement en dessous, jamais en concurrence avec le cadeau.

## La séquence (5 lettres, un objectif par lettre)

- **V1 — l'annonce des 3 cadeaux** : objet court, sans prix, sans emoji, ton personnel. Promesse dès la première ligne, bouton unique vers la page cadeaux.
- **V2 — la preuve** : pages réelles d'un livre produit, couverture, fichier prêt pour Amazon. Rappel du cadeau.
- **V3 — le chapitre offert** : « dites-moi votre sujet, je vous écris le premier chapitre ». Lettre la plus courte des cinq.
- **V4 — l'objection** : « je n'ai pas le temps / je n'écris pas bien » traitées en trois lignes chacune.
- **V5 — l'échéance** : dernier rappel de l'offre, cadeaux toujours accessibles.

Segments : jamais ouverts, ouverts sans clic, cliqueurs. Les cliqueurs sautent V1 et reçoivent une lettre personnelle plus l'offre.

## Envoi en masse, propre

- Envoi par lots automatiques dans la limite quotidienne du fournisseur, arrêt propre, reprise le lendemain sans doublon.
- Exclusion des désabonnés, des adresses en rebond, des clients existants et de toute adresse ayant déjà reçu la même lettre.
- Test vers votre adresse avant chaque vague, marquage `[TEST]`.

## Mesure, lettre par lettre

Colonnes dans le panneau d'administration : envoyés, ouverts, cliqués, cadeau réclamé, chapitre demandé, commande créée, commande payée. Chaque lien porte la source de la lettre, donc chaque vente est attribuée au message qui l'a produite.

## Détails techniques

- Nouvelle page publique `/v3/cadeaux` (3 cartes Émeraude & Or, capture email, déblocage immédiat), réutilisation de `/10-niches-offertes` et du PDF existant dans `public/lead-magnets/`.
- Cadeau chapitre : page `/v3/chapitre-offert` appuyée sur la fonction d'écriture existante (`book-chapter-write`), 1 chapitre par adresse, garde-fou anti-abus.
- Lettres `v3-cadeaux-1..5` ajoutées dans `send-closing-47` et déclarées dans `src/data/canonicalEmailCampaign.ts` ; segments calculés depuis `sales_prospects`, `email_opens`, `email_clicks`, déduplication via `email_send_log`.
- Colonnes de résultat ajoutées au panneau de campagne ; suivi des clics via `track-email-click`, source `?src=v3-cadeaux-N`.
- Aucun changement de tarif.

## Ordre d'exécution

1. Page cadeaux + cadeau chapitre offert.
2. Les 5 lettres et les segments.
3. Colonnes de résultat, puis envoi test, puis première vague en masse.
