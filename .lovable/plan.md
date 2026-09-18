# Ma bibliothèque de livres (ASIN) dans l'espace KDP

## Ce que vous aurez

Une nouvelle page **« Ma bibliothèque — vos livres par ASIN »** dans l'onglet KDP, placée en première position.

- Ajouter un livre en collant son ASIN (10 caractères) : le titre, l'auteur, la couverture, le prix, la note et le rang sont récupérés automatiquement sur Amazon.
- Chaque livre apparaît en carte : miniature de couverture, titre, auteur, ASIN, marché (fr, com, de…), et une étiquette libre (ex. « série Polar », « à relancer »).
- Boutons toujours visibles sur chaque carte : **Actualiser les données**, **Renommer / étiqueter**, **Copier l'ASIN**, **Supprimer**.
- Un livre peut être marqué **« livre en cours »** : c'est celui qui sera proposé par défaut dans les autres pages KDP.
- Recherche par titre ou ASIN, tri par ajout récent.

## Réutiliser un livre dans les autres pages

Sur les quatre pages qui partent d'un ASIN — **Fiche Audit**, **Plan de lancement**, **Mots-clés**, **Publicité** — un encart « **Choisir un livre de ma bibliothèque** » apparaît au-dessus du champ ASIN :

- liste déroulante des livres enregistrés ;
- un clic remplit l'ASIN, le marché, le titre, le genre et la description, sans nouvel appel Amazon ;
- un bouton « Ajouter ce livre à ma bibliothèque » quand on vient de saisir un ASIN inconnu.

Sur la page Publicité, la bibliothèque sert aussi à choisir les **ASIN concurrents** à cibler, en cochant des livres enregistrés comme concurrents.

## Le robot BIBLIO

Un troisième conseiller rejoint Hector et Margaux sur la page « Parler avec l'IA », et il est aussi accessible directement depuis la bibliothèque :

- **Biblio**, « gardien de votre catalogue » — avatar robot dédié (tons bleu/ivoire), ton posé et organisé.
- Il connaît la liste de vos livres enregistrés et répond sur votre catalogue : quel livre relancer, quel titre manque de mots-clés, dans quel ordre travailler, quelles incohérences entre vos fiches.
- Il ne dit jamais de chiffres de ventes ou de volumes qu'il n'a pas : il raisonne sur ce que la bibliothèque contient.
- Bouton « Demander à Biblio » sur chaque carte de livre : la conversation démarre avec ce livre en contexte.

## Détails techniques

- Nouvelle page `src/pages/v3public/kdp/V3KdpBibliothequePage.tsx`, route paresseuse dans `src/App.tsx` sous `V3LockedGate`, entrée en tête de `src/data/kdpTabPages.ts` (badge « Nouveau », `maison: true`).
- Stockage **localStorage** uniquement, comme les autres pages KDP : clé `v3:kdp:bibliotheque:livres` (tableau de `{ id, asin, marketplace, titre, auteur, couvertureUrl, prix, note, avis, bsr, etiquette, statut, ajouteLe, majLe }`). Aucune nouvelle table, aucune fonction serveur. Un bouton d'export/import JSON permet de transférer la bibliothèque sur un autre appareil.
- Nouveau module partagé `src/lib/kdp/bibliotheque.ts` : lecture/écriture, `listerLivres()`, `ajouterParAsin()` (via `fetchAmazonBook` existant), `majLivre()`, `supprimerLivre()`, `livreEnCours()`.
- Nouveau composant `src/components/kdp/SelecteurLivreBiblio.tsx` inséré dans les quatre pages ASIN ; aucune modification de leur logique IA existante.
- Robot Biblio : ajout d'un troisième agent dans `V3KdpAgentsPage.tsx` (prompt système en français, ≤ 250 mots, jamais de données inventées) avec la liste des livres injectée en contexte, plus un avatar généré `src/assets/agent-kdp-biblio.png`.
- Interface 100 % française, boutons orange texte blanc, aucun changement de paiements, crédits ou base de données.
