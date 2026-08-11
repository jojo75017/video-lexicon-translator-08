# Plan « 20 à 30 abonnés » — 14 jours avant la fin de l'offre 47 €

## Où on en est vraiment (chiffres lus en base aujourd'hui)

| Donnée | Valeur |
| --- | --- |
| Prospects actifs (non désinscrits) | 634 |
| Prospects arrivés à l'étape 4 de la séquence | 636 |
| Prospects ayant ouvert au moins un email | 467 |
| Prospects ayant cliqué au moins une fois | 40 |
| Leads inscrits par les formulaires du site | 23 |
| Leads venus de la démo Génie | 1 |
| Commandes payées enregistrées dans le tunnel | 0 |
| Abonnés actifs | 13 |

Lecture : l'audience existe (467 personnes lisent les emails), mais seulement 40 cliquent
et personne ne finit le paiement. Le problème n'est donc pas la taille de la liste,
c'est le passage clic → page → paiement, et le fait qu'aucune nouvelle source de trafic
n'alimente la liste (1 seul lead venu de la démo).

La page `/demo` et `/commander` affichent bien 47 € en ligne : ce point est réglé.

## Les 5 leviers, par ordre de rentabilité

### 1. Les 40 cliqueurs — traitement individuel (priorité absolue)
Ce sont les seules personnes déjà chaudes. Une relance de masse ne suffit pas.

- Un email personnel, écrit au singulier, envoyé un par un depuis l'admin : « vous avez
  regardé, qu'est-ce qui vous retient ? » + réponse aux 3 objections (prix, temps, technique).
- Proposition de paiement en 2 fois (23,50 € + 23,50 €) déjà disponible dans le tunnel.
- Offre d'un accompagnement de démarrage : « je crée votre premier sommaire avec vous ».
- Objectif réaliste : 8 à 12 abonnés sur ces 40.

### 2. Les 467 ouvreurs — séquence de clôture en 3 emails
Séquence courte, une idée par email, un seul lien, deadline réelle du 30/09.

| Jour | Angle |
| --- | --- |
| J0 | « Ce qui change le 1er octobre » : après le 30/09, plus d'accès à vie, uniquement 17 €/mois. Le calcul est fait pour eux : 47 € une fois contre 204 €/an. |
| J3 | Preuve : un livre entier créé devant eux (sommaire, chapitre, couverture, fichier KDP), captures réelles. |
| J6 | Dernier jour utile : ce qu'ils perdent, garantie 30 jours, paiement en 2 fois, réponse aux objections. |

Objectif : 6 à 10 abonnés.

### 3. La démo Génie — la rendre vraiment utilisable
1 lead en tout : la page demande l'email trop tôt et ne montre pas assez.

- Montrer le sommaire complet **gratuitement**, sans email.
- Demander l'email seulement pour recevoir le sommaire en PDF + le 1er chapitre rédigé.
- Ajouter en bas la preuve du résultat final (couverture + fichier exporté) et le bouton 47 €.
- Mettre le lien démo dans la signature de tous les emails et dans chaque post social.

### 4. Réseaux sociaux — 1 publication par jour pendant 14 jours
Le kit de publication existe déjà, il n'est simplement pas utilisé quotidiennement.

- Groupes Facebook KDP francophones : 1 post utile par jour (pas de vente directe), lien démo.
- Pinterest : 3 épingles par jour vers `/demo` (sommaire IA, couverture KDP, publier sur Amazon).
- 1 vidéo courte par semaine : « je crée un livre en 20 minutes » (écran enregistré).
- Chaque lien porte son UTM pour savoir ce qui rapporte.

Objectif : 150 à 300 visites démo, 30 à 60 nouveaux leads, 3 à 6 abonnés.

### 5. Les 13 abonnés actuels — preuve et parrainage
- Demander 3 témoignages écrits + 1 capture de livre publié, à afficher sur `/commander`.
- Rappeler le parrainage à 30 % (14 € par vente à 47 €) avec leur lien prêt à copier.
- Objectif : 2 à 4 abonnés.

## Calendrier

```text
J1-J2   Correction de la démo (sommaire gratuit) + page /commander (preuve, garantie, 2x)
J2      Envoi manuel aux 40 cliqueurs (par lots de 10)
J3      Email 1 aux 467 ouvreurs
J3-J14  1 post Facebook + 3 épingles Pinterest par jour
J6      Email 2 (preuve en images)
J9      Demande de témoignages aux 13 abonnés + relance parrainage
J12     Email 3 (dernier jour utile)
J14     Bilan : leads, clics /commander, ventes par canal
```

Total attendu : **19 à 32 abonnés**, dont l'essentiel vient des 40 cliqueurs et des 467 ouvreurs.

## Ce qui bloque encore la vente et sera corrigé d'abord

1. `/commander` : ajouter au-dessus du bouton la garantie 30 jours, le paiement en 2 fois,
   le rappel « PayPal accepté » et 3 témoignages avec prénom.
2. Démo : sommaire complet sans email, email seulement pour le PDF + 1er chapitre.
3. Un seul lien de vente partout : `ebookstudio.fr/commander` (déjà le cas, à ne plus dévier).
4. Tableau de suivi par canal dans `/gestion-prospects` : leads, clics vers `/commander`, ventes.

## Détails techniques

- Emails personnels aux cliqueurs : nouveau gabarit `cliqueurs-personnel` dans
  `src/data/canonicalEmailCampaign.ts`, envoi par lots via `send-sales-email`
  (segment `clickers`, liste construite depuis `email_clicks`).
- Séquence de clôture : 3 gabarits `cloture-47-1..3`, envoi par le panneau
  `CampaignSequencePanel.tsx`, segment « ouvreurs sans clic ».
- Démo : `src/pages/DemoGeniePage.tsx` — supprimer le verrou après 8 chapitres,
  déplacer la capture email vers l'envoi du PDF ; `demo-genie-capture` inchangée.
- Page de vente : `V3CommanderPage.tsx` — bloc réassurance + témoignages issus de
  `book_testimonials` (approuvés uniquement, sans email affiché).
- Suivi par canal : vue admin alimentée par `capture_events`, `email_clicks` et
  `funnel_orders`, groupée par `utm_source`.
- Aucun changement de tarif : 47 € à vie jusqu'au 30/09/2026, puis Plume 17 € / Édition 27 €.
