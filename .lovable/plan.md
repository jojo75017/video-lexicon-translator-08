# Plan — Transformer `/methode` en page de vente à haute conversion

## Objectif
Remplacer l'ancienne page `/commander` directe par une page long format `/methode` qui convertit les visiteurs déjà intéressés en clients à 47 €, sans distraction ni popup.

## Étapes

| # | Action | Détails | État |
|---|--------|---------|------|
| 1 | Thème sombre premium | Fond bleu nuit `#0B1326`, accents doré `#D4AF37`, bouton orange `#FF6B1A`. Police sans-serif. | Fait |
| 2 | Hero section | Un titre choc, mockup 3D premium, **un seul CTA** vers `/commander?src=methode`. | Fait |
| 3 | Psychologie de vente honnête | Bloc « Ce que le système fait / ne fait pas », avant/après, 4 étapes du workflow. | Fait |
| 4 | Zéro distraction | Masquer le bandeau global V3 sur `/methode`, `/commander`, `/commande`, `/fiche/*`, etc. Aucune popup sur le checkout. | Fait |
| 5 | Tracking propre | Surface `methode` dans `capture_events`, migration SQL pour autoriser `surface='methode'`. | Fait |
| 6 | Vérification visuelle | Rendu testé, contrastes corrigés, titres sans-serif. | Fait |
| 7 | Email d'envoi | Rédiger un email unique-promesse qui pointe vers `/methode` (pas `/commander` directement). | À faire |
| 8 | Lancer & suivre | Envoyer la vague, mesurer clics sur `/methode`, visites `/commander`, commandes. | À faire |

## Règles de la page
- Un seul bouton d'achat répété 3 fois maximum.
- Pas de lien externe dans le corps de page.
- Mentions légales uniquement en pied de page.
- Ton honnête : on promet la méthode, pas des revenus garantis.

## Prochaine décision
Valider le ton de l'email d'envoi (curiosité + une seule promesse) avant de lancer la vague.
