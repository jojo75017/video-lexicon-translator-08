# Lancement septembre : cadeaux, tarifs justes, vidéo V3

Trois chantiers : un cadeau gratuit qui donne envie, une grille tarifaire unique et cohérente partout, et la vidéo V3 de 7-8 minutes (HeyGen) prête à enregistrer et à diffuser.

## 1. Le cadeau gratuit (sans carte bancaire)

Une seule page cadeau, `/cadeau`, avec inscription email simple :

- **10 niches à fort potentiel** (PDF prêt à télécharger)
- **Kit de démarrage V3** (le contenu de `/v3/kit-demarrage`, accessible aussi en PDF)
- Aperçu du produit : captures + liste des livrables (pas la vidéo)

La **vidéo V3 reste réservée aux abonnés** : elle vit sur l'espace V3 et sur la page de vente derrière la mention « réservée aux membres ».

Après téléchargement, l'écran de remerciement propose la suite logique : « Écrire votre premier chapitre gratuitement » (`/essai`), puis l'offre.

Tous les emails de la séquence pointent vers `/cadeau` (liens suivis via `/r`), avec le cadeau comme unique bouton principal.

## 2. Tarifs : une seule grille, partout

Grille de référence retenue :

```text
Plume            27 €/mois   —   270 €/an  (2 mois offerts)
Édition          47 €/mois   —   470 €/an
Maison d'Édition 97 €/mois   —   970 €/an
```

Travail à faire :

- `src/data/v3Pricing.ts` devient la **source unique** (déjà à 27/47/97) ; toute page ou email qui affiche un autre prix est corrigé pour lire ce fichier.
- Balayage complet des anciens prix encore présents (17 €, 29 €, 49 €, 59 €, 197 €, 347 €, 547 €, offre 47 € à vie) sur : accueil V3, forfaits, offre, commander, migration V2, pages SEO, panneau admin plans, emails de vente.
- L'offre « accès à vie 47 € » se termine le 31 août : après cette date, plus aucune mention d'achat à vie, uniquement les abonnements + 1er mois offert au lancement du 1er octobre.
- Réduction ancien client V2 : -20 % à vie appliquée sur la grille ci-dessus (21,60 € / 37,60 € / 77,60 €), affichée sur `/v3/migration`.
- Mise à jour des prix côté paiement (Stripe/PayPal) pour coller à cette grille.

## 3. Vidéo V3 — 7-8 minutes (HeyGen)

Livré maintenant :

- **Script complet minuté** (~1 100 mots, 8 séquences) écrit dans `docs/video-v3-script.md`, prêt à coller dans HeyGen :
  1. 0:00 Accroche : pourquoi les outils KDP décrochent au moment de publier
  2. 0:45 Le vrai problème : le livre fini, pas l'idée
  3. 1:30 Démo Sommaire IA / Copilot (on construit le plan ensemble)
  4. 3:00 Rédaction chapitre par chapitre + mémoire du livre
  5. 4:15 Correction professionnelle 4 passes (avant / après)
  6. 5:15 Couverture, gabarit, audio, données KDP
  7. 6:30 Les 3 formules + 1er mois offert au 1er octobre
  8. 7:20 Conclusion + cadeau (10 niches + kit)
- **Emplacements prêts à recevoir la vidéo** : un composant lecteur réutilisable placé sur l'accueil V3, la page de vente, la page d'attente du lancement et la page abonné — avec vignette d'attente tant que le fichier n'est pas fourni, et comptage des vues (visible dans le tunnel email admin).
- Vous déposez ensuite l'URL de la vidéo HeyGen dans un réglage unique ; elle s'affiche partout automatiquement.

## Détails techniques

- Nouvelle page `/cadeau` + route ; réutilisation de `funnel_leads` (`lead_magnet = 'niches10_kit'`) et de `capture_events` pour la mesure.
- Composant `V3VideoPlayer` alimenté par une clé dans `launch_settings` (`v3_video_url`), donc modifiable sans redéploiement.
- `send-sales-email` : bloc cadeau en tête, CTA unique vers `/cadeau` via `/r`, prix lus depuis la grille unique.
- Aucun envoi de masse déclenché par ce plan : uniquement une préparation + un email de test à vous.
