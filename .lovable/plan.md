# Modèle « à l'américaine » : offre d'entrée 47 € + OTO (sans abonnement)

## Pourquoi ça tient la route
- **Vos clients utilisent leur propre clé IA** (Gemini, OpenRouter, Azure) : un client ne vous coûte presque rien chaque mois. Un paiement unique est donc rentable, et vous n'êtes pas obligé de facturer tous les mois.
- **Un seul achat, c'est plus simple à vendre** que 27 €/mois : moins d'hésitation, aucun désabonnement à gérer, aucun impayé.
- **Le chiffre d'affaires se fait sur les OTO** (offres proposées juste après l'achat) : en général, 20 à 35 % des acheteurs prennent au moins une OTO. Avec 3 OTO, le panier moyen passe de 47 € à environ 80–110 €. C'est une estimation : les vrais chiffres se mesurent sur vos ventes.
- **La limite à connaître** : sans abonnement, il faut sans cesse de nouveaux acheteurs. C'est pourquoi on garde des compléments à la carte et des nouveautés V4 vendues à part, pour faire revenir les clients.

## Le parcours d'achat

```text
Page de vente  ->  Bon de commande 47 €  (+ case à cocher 17 €)
                         |
                   OTO 1 : Pack Édition Pro 97 €
                     oui -> OTO 2        non -> version allégée : Cover Studio Pro 67 €
                         |
                   OTO 2 : Pack Livres spéciaux 47 €
                     oui / non -> OTO 3
                         |
                   OTO 3 : Pack Lancement Amazon 27 €
                         |
                   Page merci + accès immédiat
```

### Offre d'entrée — 47 € (accès à vie)
Le socle actuel « Plume » : Écrire un livre, Je raconte, correction, Studio V4 de couverture inclus (illustration V2, exports 300 DPI), outils KDP de base, HumanizeAI. Paiement unique par carte.

**Case à cocher sur le bon de commande — 17 €** : Pack Boost de Lancement (existe déjà à 17 €).

### OTO 1 — Pack Édition Pro 97 € (au lieu de 47 €/mois)
Cover Studio Pro, outils KDP avancés, BD Studio, BookPerfect, livres illimités : tout ce qui est réservé aujourd'hui au forfait Édition.
**Si le client refuse** → on lui propose seulement le Cover Studio Pro à 67 € (prix existant).

### OTO 2 — Pack Livres spéciaux 47 €
Studio Jeunesse, Album 3–6 ans, Jeux & Énigmes, Cherche & Trouve, Histoires courtes. Ensemble, ils valent plus de 120 € s'ils sont achetés un par un.

### OTO 3 — Pack Lancement Amazon 27 €
Étude de marché, mots-clés, posts réseaux et version audio d'un livre.

### Après l'achat : les ventes complémentaires
- La page « Compléments & options » reste, avec les prix actuels à 17, 27 et 47 €.
- La précommande V4 Micro-Séries reste à 67 €.
- La version audio d'un livre reste à 9,99 €.

## Ce qu'on garde pour ne léser personne
- **Abonnés actuels Plume et Édition** : ils gardent leur abonnement et leurs droits. Chacun peut, s'il le veut, passer en accès à vie.
- **Acheteurs à vie (47 € / 59 €)** : ils gardent tout. On leur propose les OTO 1 et 2 dans leur espace, au même prix.
- **Anciens clients V2** : la V2 reste incluse jusqu'au 31/12/2026, et la remise de −20 % s'applique aussi aux OTO.
- **Offre de lancement 15 places jusqu'au 15 octobre** : elle ne change pas. Le nouveau parcours ouvre ensuite.

## Version allégée recommandée (peu de travail)
On démarre petit, avec ce qui existe déjà. Le reste ne vient que si les ventes suivent.
1. **Étape 1** : le tunnel `/commander` à 47 € reste tel quel, avec la case à 17 € (le Boost existe déjà).
2. **Étape 2** : une seule page d'OTO après le paiement : « Pack Édition Pro 97 € », avec « Oui » et « Non merci ». Si le client répond non, on lui propose le Cover Studio Pro à 67 € (prix existant).
3. **Étape 3** : le client arrive dans son espace. Les autres packs restent sur la page « Compléments & options », qui existe déjà.

Ce qu'on ne fait pas tout de suite : le paiement en un clic, les OTO 2 et 3 et le tableau de suivi. On les ajoute plus tard si l'OTO 1 se vend bien.
Pour le travail : 1 nouveau prix de paiement, 1 page et 1 droit d'accès. Les abonnements des clients actuels ne bougent pas.

## Version complète (plus tard, si les ventes suivent)
1. Les OTO 2 et 3 dans le parcours.
2. Le paiement en un clic.
3. Le tableau de suivi dans l'admin.
4. Le retrait des abonnements de la page des forfaits pour les nouveaux clients.

## Points à trancher
- Garder un petit abonnement facultatif, par exemple 9 €/mois pour les nouveautés et le support ? Je propose non au départ.
- Faut-il proposer le paiement en 2 ou 3 fois ? Votre règle actuelle l'interdit. Je la garde, sauf si vous changez d'avis.

## Détails techniques
- Nouveaux produits de paiement à paiement unique : `v3_front_47`, `v3_oto_edition_pro_97`, `v3_oto_specials_47`, `v3_oto_launch_27`. On réutilise les produits existants pour le Boost à 17 € et le Cover Pro à 67 €.
- OTO en un clic : la carte est enregistrée au premier paiement, puis débitée sur les pages d'OTO avec une confirmation côté serveur. Repli : un paiement intégré classique.
- Les droits sont donnés par `module_entitlements` (`edition_pro`, `specials_pack`, `launch_pack`). `hasCoverProRight` et `PRO_ONLY` reconnaissent aussi `edition_pro`.
- Routes : `/commander`, puis `/commander/oto-1`, `/oto-1b`, `/oto-2`, `/oto-3` et `/merci`. Le tunnel reste centralisé dans `LAUNCH_TUNNEL_URL`.
- Mises à jour : la mémoire des tarifs (fin des abonnements pour les nouveaux clients au profit du modèle 47 € + OTO), `v3Pricing.ts` et `AGENTS.md`.
