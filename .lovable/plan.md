# Ebookstudio V3 — Inscription en Roadmap

On **ne construit pas les pages maintenant**. On prépare tout dans la **Roadmap V3** : la page de vente longue haute conversion (structure type « Hypnova »), la page de commande avec order bump, et les bonus associés — pour Ebookstudio **V3**.

## Ce qui est ajouté (données roadmap uniquement)

Dans `src/data/roadmapV3.ts`, ajout de modules roadmap (statut `todo`) qui apparaîtront dans l'onglet **Roadmap** du Hub V3 :

1. **Page de vente V3 haute conversion** — page commerciale longue (hero, preuves chiffrées marché ebook/KDP réelles, storytelling, démonstration, valeur, garantie 7 j, FAQ, compte à rebours).
2. **Page de commande V3 + order bump** — tunnel de paiement avec case order bump optionnelle, Stripe + PayPal.
3. **Bonus de lancement V3** — les bonus offerts mis en avant dans l'offre.

## Règle VALEUR (corrigée)

Le bloc « Voici ce que tu obtiens » doit présenter :

```text
Base 197€   OU   Pack Pro 347€
```

→ **« OU »** (deux choix d'offre), et **non plus « + »** (pas d'addition des deux). À noter dans la description du module roadmap pour qu'on s'en souvienne lors de la construction.

## Détails techniques

- Modification limitée à `src/data/roadmapV3.ts` : ajout d'entrées `V3Module` (id, title, pillar, status `todo`, description).
- Aucune nouvelle page, route ni logique de paiement créée à ce stade.
- Les chiffres marché resteront réels/sourcés lors de la future construction (règle « pas de fake data »).

## À confirmer plus tard (au moment de construire)
- Prix de lancement V3 affiché et intitulé/prix de l'order bump.
- Les bonus précis à mettre en avant.
