# Page cadeau : l'email d'abord, les niches ensuite

## Le problème constaté

Sur `/cadeau`, les 5 niches sont affichées en entier tout en haut de la page. Le formulaire d'email arrive seulement après deux longues sections. Résultat : le visiteur lit ses 5 niches, obtient ce qu'il venait chercher et repart — sans laisser son email et sans regarder l'offre.

## La correction

```text
AVANT :  5 niches complètes  →  bla-bla  →  formulaire  →  offre 47 €
APRÈS :  1 niche offerte  →  formulaire (juste dessous)  →  4 niches + bonus débloqués  →  offre 47 €
```

1. **Une seule niche en libre accès**, complète, pour prouver la qualité. Les 4 autres restent visibles mais floutées, avec leur titre de catégorie et un cadenas : « Débloquez les 4 niches restantes ».
2. **Le formulaire remonte juste sous cette première niche**, sans avoir à faire défiler : prénom, email, bouton « Voir mes 5 niches et mes bonus ». Il reste aussi présent plus bas, au niveau des bonus.
3. **Après l'email** : les 4 niches s'affichent en clair, les 5 bonus s'ouvrent, et un message clair enchaîne sur l'étape suivante.
4. **Enchaînement vers l'offre** : dès que les niches sont débloquées, un bloc apparaît immédiatement sous elles — « Vous avez la niche. Voici comment écrire le livre » — avec le seul bouton payant vers la commande, le compte à rebours et la garantie 30 jours. L'offre n'est plus reléguée en bas de page.
5. **La section « Ce que vous pouvez en faire ce soir »** passe après le formulaire : elle sert d'argument, pas de barrage.

Celui qui a déjà laissé son email (mémorisé dans le navigateur) ou qui arrive depuis un email avec son adresse dans le lien voit tout de suite les 5 niches, sans re-saisie.

## Ce qui ne change pas

Le cadeau reste gratuit et sans carte bancaire. Aucun changement de tarif, de paiement, de base de données, de sécurité, ni de calcul KDP. Le suivi des visites, des emails laissés et des clics reste identique.

## Détails techniques

- Modification limitée à `src/pages/CadeauPage.tsx` : réordonnancement des sections, floutage conditionnel (`unlocked`) des niches d'index 1 à 4, formulaire dupliqué en position haute, bloc offre affiché après déblocage.
- Réutilisation de l'état `unlocked` existant (`readNiches5Email` / `rememberNiches5Email`) et de `funnel-capture-lead` — aucune nouvelle fonction ni nouveau schéma.
- Évènements de suivi existants conservés (`trackLeadFormClick`, `trackFormSubmit`, `trackSignUp`, `trackLeadMagnetDownload`).

## Vérification

Contrôle navigateur : visiteur inconnu → une seule niche lisible, formulaire visible sans défilement ; après saisie d'un email de test → 4 niches en clair, bonus ouverts, bouton de commande juste dessous.
