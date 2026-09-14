# Transformer les visiteurs déjà là en abonnés

Direction retenue : ne pas chercher plus de trafic pour l'instant, mais convaincre les visiteurs français qui arrivent déjà.

## Ce que montrent les chiffres (30 derniers jours)

- 1 095 visiteurs, dont 494 depuis les États‑Unis en « direct » (majoritairement des robots) et 136 depuis la France.
- Page la plus vue : `/commander` (262 vues), puis `/essai` (64) et `/10-niches-offertes` (63).
- 9 emails laissés, 6 essais gratuits démarrés, 0 commande payée.
- 3 témoignages approuvés seulement.

Conclusion : très peu de visiteurs réellement humains et français, et ceux qui arrivent sur la commande ne vont pas jusqu'au paiement. Le travail utile est donc : voir précisément où ils s'arrêtent, puis enlever ce qui les arrête.

## 1. Voir où les visiteurs s'arrêtent

Un tableau simple dans votre espace admin, alimenté par le suivi déjà en place :

```text
Vus la page  →  Email laissé  →  Chapitre lu  →  Commande ouverte  →  Paiement lancé  →  Payé
```

Chiffres réels par jour et par provenance, avec les visites hors France séparées pour ne plus être trompé par les robots. Aucune donnée inventée : uniquement ce qui est déjà enregistré.

## 2. Relier l'essai gratuit à la commande

Aujourd'hui le visiteur lit son chapitre 1 gratuit et… rien ne l'emmène plus loin. On ajoute, juste après le chapitre :

- un bloc « Votre livre complet » avec l'offre 47 € et un seul bouton vers la commande, son email déjà rempli ;
- un rappel de la fin de l'offre le 30 septembre ;
- un lien discret vers la démo pour ceux qui hésitent.

## 3. Simplifier la page de commande

- Un seul bouton principal en haut, visible sans faire défiler, et le paiement qui s'ouvre dès le clic.
- PayPal annoncé à côté de la carte bancaire (il existe déjà mais ne se voit pas).
- La garantie 30 jours et « accès immédiat après paiement » directement sous le bouton.
- Les questions/réponses déplacées plus bas pour ne pas noyer le bouton.
- La vidéo de présentation courte placée au-dessus des questions.

## 4. De la vraie preuve

Trois témoignages, c'est trop peu pour un achat à 47 €. Je prépare :

- un email court prêt à envoyer à vos 14 abonnés actifs, avec le lien du formulaire de témoignage existant ;
- l'affichage automatique des nouveaux témoignages approuvés sur la commande et l'essai.

Vous restez maître de l'envoi : rien ne part automatiquement.

## 5. Réutiliser vos 10 shorts

Vos 10 shorts YouTube/TikTok ne servent à rien s'ils ne mènent nulle part. Je prépare :

- une page courte d'arrivée pour les réseaux, avec le même chapitre gratuit et un seul bouton ;
- les liens suivis à mettre en bio et en description, pour savoir enfin quelle vidéo amène des visiteurs.

## 6. Relancer les 15 personnes déjà intéressées

9 emails laissés + 6 essais démarrés : ce sont les contacts les plus chauds que vous avez. Un email personnel, court, prêt à copier, qui demande simplement où ils en sont dans leur livre.

## Détails techniques

- Nouveau panneau admin lisant `capture_events`, `funnel_leads`, `free_trials`, `funnel_orders` en lecture seule.
- Ajout d'évènements de suivi manquants entre `/essai` et `/commander` (mêmes surfaces existantes, aucun nouveau schéma).
- Modifications limitées à `src/pages/launch/EssaiPage.tsx`, `src/pages/v3public/V3CommanderPage.tsx`, une nouvelle page réseaux et un nouveau panneau admin.
- Aucun changement de prix, de paiement, de base, de sécurité, de calcul KDP ni de crédits IA. Aucun envoi d'email de masse.
