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

## Les étapes
1. **Phase 1 — Décisions (vous)** : valider les prix (47, 17, 97/67, 47, 27), le contenu de chaque pack et la date d'ouverture (proposée : 16 octobre).
2. **Phase 2 — Le parcours d'achat** : bon de commande avec la case à 17 €, 3 pages d'OTO avec « Oui, j'ajoute » et « Non merci », une page merci, et le déblocage automatique des droits.
3. **Phase 3 — Les espaces clients** : afficher les OTO non achetées dans l'espace du client, et retirer les abonnements de la page des forfaits. Ils restent actifs pour ceux qui les ont déjà.
4. **Phase 4 — Le suivi** : un tableau dans l'admin avec, pour chaque OTO, le nombre de pages vues, le taux d'acceptation et le panier moyen.
5. **Phase 5 — Les tests** : des achats en mode test pour chaque cas (tout accepter, tout refuser, version allégée), puis une vérification des droits. Aucune publication ni aucun email sans votre accord.

## Points à trancher
- Garder un petit abonnement facultatif, par exemple 9 €/mois pour les nouveautés et le support ? Je propose non au départ.
- Faut-il proposer le paiement en 2 ou 3 fois ? Votre règle actuelle l'interdit. Je la garde, sauf si vous changez d'avis.

## Détails techniques
- Nouveaux produits de paiement à paiement unique : `v3_front_47`, `v3_oto_edition_pro_97`, `v3_oto_specials_47`, `v3_oto_launch_27`. On réutilise les produits existants pour le Boost à 17 € et le Cover Pro à 67 €.
- OTO en un clic : la carte est enregistrée au premier paiement, puis débitée sur les pages d'OTO avec une confirmation côté serveur. Repli : un paiement intégré classique.
- Les droits sont donnés par `module_entitlements` (`edition_pro`, `specials_pack`, `launch_pack`). `hasCoverProRight` et `PRO_ONLY` reconnaissent aussi `edition_pro`.
- Routes : `/commander`, puis `/commander/oto-1`, `/oto-1b`, `/oto-2`, `/oto-3` et `/merci`. Le tunnel reste centralisé dans `LAUNCH_TUNNEL_URL`.
- Mises à jour : la mémoire des tarifs (fin des abonnements pour les nouveaux clients au profit du modèle 47 € + OTO), `v3Pricing.ts` et `AGENTS.md`.
