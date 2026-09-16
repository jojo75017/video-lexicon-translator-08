# Plan — Présenter clairement les 3 offres V3

## Objectif
Afficher une offre simple à comprendre sur l’accueil et une comparaison complète sur `/v3/forfaits`, sans mélanger les abonnés actuels, le forfait Plume et le forfait Édition.

## Les trois offres

### 1. Déjà abonné EbookStudio
- Conserver l’accès V2 déjà acquis.
- Donner accès à la V3 essentielle avec **5 modules inclus** :
  1. Génie et travail du sommaire,
  2. Correcteur du livre,
  3. Export PDF, DOCX et EPUB,
  4. Discussion avec l’IA avec sa propre clé,
  5. Kit de démarrage et recherche d’idée.
- Présenter cette offre comme un avantage fidélité, sans bouton de nouvel achat obligatoire.
- Conserver la remise fidélité de **20 % à vie** si l’abonné choisit ensuite Plume ou Édition.

### 2. Plume — 27 €/mois ou 270 €/an
- Passer clairement à **50 livres par mois**.
- Donner plus de valeur visible au forfait : création guidée, sommaire existant ou construit avec le Génie, rédaction chapitre par chapitre, correction, import de manuscrit, mise en page, exports Kindle/KDP, couverture standard, audiolivre standard et 10 langues.
- Afficher des limites simples et lisibles : 40 chapitres, 5 000 mots par chapitre, 8 personnages.
- Ajouter un bloc « Idéal pour » destiné aux auteurs qui publient régulièrement sans avoir besoin des studios professionnels.
- Ne pas inclure les gros compléments premium vendus séparément.

### 3. Édition — 47 €/mois ou 470 €/an
- Afficher **livres illimités**.
- Inclure tout Plume, avec les capacités professionnelles : 60 chapitres, 8 000 mots par chapitre, personnages illimités, recherche approfondie, séries multi-tomes, Cover Studio Pro, BD Studio Pro, Amazon Spy et outils KDP avancés.
- Remplacer la promesse actuelle « absolument tout inclus » par une formulation honnête : **tous les modules professionnels V3 inclus, hors gros compléments premium**.
- Lister séparément les compléments restant payants afin d’éviter toute mauvaise surprise : direction éditoriale approfondie, traduction relue, audiolivre premium, sélection de maisons d’édition et accompagnement individuel.

## Présentation sur l’accueil
- Ajouter une bande éditoriale discrète sous la présentation principale.
- Montrer trois colonnes équilibrées : « Déjà abonné », « Plume 27 € », « Édition 47 € ».
- Limiter chaque colonne aux différences essentielles, avec un bouton vers le détail des forfaits.
- Mettre Plume davantage en valeur qu’aujourd’hui, sans écraser Édition ni alourdir la page.
- Reprendre la palette douce actuelle de la maison d’édition : papier, encre, émeraude et or.

## Page `/v3/forfaits`
- Transformer la comparaison actuelle à deux offres en une vraie grille à trois offres.
- Garder le choix mensuel/annuel avec deux mois offerts.
- Pour un abonné V2 connecté, afficher directement son offre fidélité et ses prix remisés :
  - Plume : **21,60 €/mois** ou **216 €/an** ;
  - Édition : **37,60 €/mois** ou **376 €/an**.
- Ajouter un tableau comparatif lisible par familles : écrire, corriger, habiller, publier, vendre, studios professionnels et compléments premium.
- Conserver les parcours Stripe et PayPal existants ; ne modifier que ce qui est nécessaire pour refléter les nouveaux droits validés.

## Cohérence des droits
- Faire de `src/data/v3Pricing.ts` la source unique des prix, quotas, modules inclus et exclusions affichées.
- Porter Plume de 30 à 50 livres par mois partout où ce quota est contrôlé ou présenté.
- Aligner les verrous des modules sur les trois offres pour que l’écran et l’accès réel disent exactement la même chose.
- Conserver les données historiques des anciens paiements et les valeurs d’administration existantes.
- Ne modifier ni les calculs KDP, ni les crédits IA, ni la sécurité des comptes.

## Vérifications
- Vérifier les trois cartes sur ordinateur et téléphone.
- Tester un visiteur, un ancien abonné V2, un abonné Plume et un abonné Édition.
- Vérifier les prix mensuels, annuels et fidélité dans Stripe et PayPal sans créer de paiement réel.
- Vérifier que les gros compléments restent clairement séparés et verrouillés quand ils ne sont pas achetés.
- Lancer les contrôles TypeScript, les tests existants et un parcours visuel de l’accueil et de `/v3/forfaits`.
