# Deux scripts vidéo corrigés : vente (visiteurs) et bienvenue (clients)

Le script actuel (`docs/video-v3-script.md`) annonce trois formules, dont une à 97 €, et se termine en offrant « 10 niches + kit de démarrage » — alors que la grille de référence ne comporte que **Plume 27 €/mois (270 €/an)** et **Édition 47 €/mois (470 €/an)**, et que les cadeaux sont déjà proposés sur la page d'accueil.

Étape 1 : je livre les deux textes. Aucune voix, aucun montage, aucun crédit tant que vous n'avez pas validé.

## 1. Script « vente » — visiteurs (7 min)

Reprise du script existant, séquences 1 à 6 conservées telles quelles (elles sont justes), avec deux corrections :

- **Séquence 7 — les formules** réécrite avec deux offres seulement :
  - Plume, 27 €/mois : 30 livres par mois, 40 chapitres, tous les onglets du studio, 10 langues, couverture complète, audiolivre, correction professionnelle.
  - Édition, 47 €/mois : livres illimités, 60 chapitres, Cover Studio Pro, recherche approfondie, outils Amazon, pack KDP prêt à publier.
  - En annuel : 2 mois offerts. Ouverture le 1er octobre.
  - Plus aucune mention de 97 €, ni de « Studio Pro », ni de « tout inclus, plus rien à acheter ».
- **Séquence 8 — conclusion** sans redite des cadeaux : on rappelle simplement que le pack de bienvenue est déjà visible sur la page d'accueil, et on invite à essayer un premier chapitre. Fin sobre, sans nouvelle promesse.

## 2. Script « bienvenue » — après achat (2 min 30)

Nouveau texte, ton maison d'édition, cinq séquences :

```text
[0:00-0:20] Merci d'avoir rejoint EbookStudio + « vos cadeaux sont déjà dans votre espace »
[0:20-0:50] Par où commencer : le sommaire, en discutant
[0:50-1:30] L'écriture chapitre par chapitre et la mémoire du livre
[1:30-2:00] La correction en 4 passes, la couverture, l'export KDP
[2:00-2:30] Ce que couvre votre formule + où poser une question
```

Aucune vente, aucun prix, aucun rappel d'offre : uniquement l'accueil et la prise en main.

## Livrables

- `docs/video-v3-script.md` : version vente corrigée (2 formules, fin sans redite des cadeaux).
- `docs/video-v3-bienvenue-script.md` : nouveau script bienvenue minuté.

## Détails techniques

- Les prix cités sont ceux de `src/data/v3Pricing.ts` (27 / 270 et 47 / 470) — source unique, aucune modification de ce fichier.
- Pas de modification du montage Remotion, de `voiceTiming.ts` ni des fichiers audio à cette étape : les durées de séquences ne changent qu'après validation des textes, dans un second passage.
- Aucun paiement, aucune base, aucune fonction backend touchés.
