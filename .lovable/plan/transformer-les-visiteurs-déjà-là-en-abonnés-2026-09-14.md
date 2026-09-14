# Transformer les visiteurs déjà là en abonnés

Direction retenue : ne pas chercher plus de trafic pour l'instant, mais convaincre les visiteurs français qui arrivent déjà.

## Ce que montrent les chiffres (30 derniers jours)

- 1 095 visiteurs, dont 494 depuis les États‑Unis en « direct » (majoritairement des robots) et 136 depuis la France.
- Page la plus vue : `/commander` (262 vues), puis `/essai` (64) et `/10-niches-offertes` (63).
- 9 emails laissés, 6 essais gratuits démarrés, 0 commande payée.
- 3 témoignages approuvés seulement.

Conclusion : très peu de visiteurs réellement humains et français, et ceux qui arrivent sur la commande ne vont pas jusqu'au paiement. Le travail utile est donc : voir précisément où ils s'arrêtent, puis enlever ce qui les arrête.

## 1. Francophone uniquement

Vous ne vendez qu'en français : les visites américaines n'ont donc aucune valeur ici.

- Les chiffres de suivi n'affichent que les visites francophones (France, Belgique, Suisse, Canada, Luxembourg, Maroc, Afrique francophone) ; le reste est mis à part, sans être compté comme prospect.
- Les emails collectés hors francophonie sont marqués « hors cible » et exclus des envois.
- Les pages publiques déclarent clairement le français comme langue, pour que Google les propose aux lecteurs francophones.

## 2. Voir où les visiteurs s'arrêtent

Un tableau simple dans votre espace admin, alimenté par le suivi déjà en place, uniquement sur les visites francophones :

```text
Vus la page  →  Email laissé  →  Chapitre lu  →  Commande ouverte  →  Paiement lancé  →  Payé
```

Chiffres réels par jour et par provenance. Aucune donnée inventée : uniquement ce qui est déjà enregistré.

## 3. Relier l'essai gratuit à la commande

Aujourd'hui le visiteur lit son chapitre 1 gratuit et… rien ne l'emmène plus loin. On ajoute, juste après le chapitre :

- un bloc « Votre livre complet » avec l'offre 47 € et un seul bouton vers la commande, son email déjà rempli ;
- un rappel de la fin de l'offre le 30 septembre ;
- un lien discret vers la démo pour ceux qui hésitent.

## 4. Simplifier la page de commande

- Un seul bouton principal en haut, visible sans faire défiler, et le paiement qui s'ouvre dès le clic.
- PayPal annoncé à côté de la carte bancaire (il existe déjà mais ne se voit pas).
- La garantie 30 jours et « accès immédiat après paiement » directement sous le bouton.
- Les questions/réponses déplacées plus bas pour ne pas noyer le bouton.
- La vidéo de présentation courte placée au-dessus des questions.

## 5. De la vraie preuve

Trois témoignages, c'est trop peu pour un achat à 47 €. Je prépare :

- un email court prêt à envoyer à vos 14 abonnés actifs, avec le lien du formulaire de témoignage existant ;
- l'affichage automatique des nouveaux témoignages approuvés sur la commande et l'essai.

Vous restez maître de l'envoi : rien ne part automatiquement.

## 6. Corriger la destination de vos 10 shorts

Vos 10 shorts mènent tous directement vers `/commander` : c'est demander 47 € à quelqu'un qui vous découvre depuis 30 secondes. C'est une cause probable du « rien de concluant ».

- Nouvelle page courte d'arrivée pour les réseaux (`/decouverte`), qui offre le chapitre gratuit avant de parler du prix, avec un seul bouton vers `/essai` puis l'offre.
- Liens suivis par vidéo (`ebookstudio.fr/r/short1` … `short10`) à mettre en bio et en description, pour savoir enfin quelle vidéo amène des visiteurs réels.
- Rien à refaire côté vidéos : vous changez juste le lien dans les descriptions et bios.

## 7. Relancer les 15 personnes déjà intéressées

9 emails laissés + 6 essais démarrés : ce sont les contacts les plus chauds que vous avez. Un email personnel, court, prêt à copier, qui demande simplement où ils en sont dans leur livre.

## Détails techniques

- Nouveau panneau admin lisant `capture_events`, `funnel_leads`, `free_trials`, `funnel_orders` en lecture seule.
- Ajout d'évènements de suivi manquants entre `/essai` et `/commander` (mêmes surfaces existantes, aucun nouveau schéma).
- Modifications limitées à `src/pages/launch/EssaiPage.tsx`, `src/pages/v3public/V3CommanderPage.tsx`, une nouvelle page réseaux et un nouveau panneau admin.
- Filtre francophone déduit du pays et de la langue déjà enregistrés dans le suivi, sans nouveau schéma.
- Aucun changement de prix, de paiement, de base, de sécurité, de calcul KDP ni de crédits IA. Aucun envoi d'email de masse.
