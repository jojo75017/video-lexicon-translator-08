# Précommande V4 — Studio Micro‑Séries IA

## Objectif
Ajouter un nouvel upsell **Studio Micro‑Séries IA** à **67 € en paiement unique**, clairement annoncé comme un module V4 bientôt disponible. L’achat est encaissé maintenant et enregistré pour ouvrir automatiquement l’accès à la sortie.

## Ce qui sera construit
- Une page publique dédiée `/v3/offre-micro-series` qui présente le futur parcours : choix d’un livre, série de 3/5/10 épisodes, scripts et storyboards verticaux, puis exports PDF, texte, SRT et CSV.
- Une démonstration visuelle statique du parcours, sans génération vidéo ni consommation coûteuse de crédits.
- Un bouton de précommande à 67 € avec paiement par carte intégré dans la page.
- Une mention explicite avant paiement : **précommande V4**, module bientôt disponible, mise à jour et accès à vie inclus dès la sortie.
- Une carte visible sur la page `/v3/upsells`, avec badge **Bientôt V4**, qui ouvre la page de présentation.

## Paiement et accès
- Ajouter le produit au catalogue serveur avec un montant verrouillé à 67 €.
- Enregistrer après paiement le droit `micro-series` dans les achats de modules.
- Exclure ce module de tous les forfaits : il reste un achat séparé, y compris pour Édition et Maison d’Édition.
- Tant que le studio n’est pas sorti, un acheteur verra son accès confirmé et l’état **Précommandé — disponible avec la V4**.

## Vérifications
- Contrôler la page sur ordinateur et mobile.
- Vérifier que le bouton ouvre le paiement intégré au bon montant en mode test.
- Vérifier la visibilité de la carte sur la page des upsells.
- Vérifier que la précommande n’exécute aucune génération IA ou vidéo.

## Détails techniques
- Réutiliser le checkout embarqué et le webhook d’upsells existants.
- Ajouter une clé stable `micro_series` côté paiement et `micro-series` côté droit d’accès.
- Ajouter le module aux achats uniquement, sans l’intégrer aux droits des forfaits.
