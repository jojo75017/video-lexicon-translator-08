# Script VSL + vidéo IA pour /bd-offre (17 €)

## Objectif
Un script de vente de 2 à 3 minutes pour la vidéo en haut de la page `/bd-offre`, puis une vidéo IA courte servant d'accroche visuelle dans cette même zone.

## 1. Le script (livré en texte, prêt à enregistrer)
Structure minutée, en français, ton direct, sans jargon :

```text
[0:00-0:15] Accroche : "Vous avez une idée de BD ou de livre illustré... mais vous ne savez pas dessiner."
[0:15-0:40] Le problème : outils dispersés, personnages qui changent de visage, des heures perdues.
[0:40-1:20] La solution : BD Studio — personnages cohérents, planches générées, histoires jeunesse, export prêt à publier.
[1:20-1:50] Démonstration parlée : 4 étapes (personnage → scénario → planches → export KDP).
[1:50-2:15] Pour qui : parents, créateurs, auteurs KDP, enseignants.
[2:15-2:35] Offre : 17 € accès complet + bonus, garantie.
[2:35-2:50] Appel à l'action : "Cliquez sous la vidéo et créez votre première BD aujourd'hui."
```

Le script sera fourni en deux versions dans le même fichier :
- version voix-off mot pour mot (à lire au micro),
- version storyboard (ce qu'on montre à l'écran à chaque séquence).

## 2. La vidéo IA
- Génération d'un clip court (accroche visuelle, style planche de BD animée, sans dialogue) via l'outil vidéo, placé dans la zone VSL de `/bd-offre`.
- Le clip sert d'accroche/boucle : la version parlée complète de 2-3 min reste à enregistrer avec votre voix (ou une voix-off) par-dessus le script fourni.
- Format 16:9, adapté à l'encart `aspect-video` déjà en place.

## 3. Intégration dans l'app
- Nouveau fichier `src/data/bdVslScript.ts` contenant le script (voix-off + storyboard), source unique.
- Le clip généré est enregistré dans `src/assets` et branché sur `BD_COMIC_OFFER.vslUrl` (lecture auto, muet, boucle, avec possibilité de remplacer plus tard par votre vidéo finale).
- Un onglet admin léger (dans le panneau BD existant) permettant de copier le script en un clic.

## Notes techniques
- Aucune modification du tunnel de paiement ni des prix (17 € / upsell 47 €).
- La génération vidéo consomme des crédits : un seul clip, pas de multiples essais automatiques.
- Aucun `npm run build` : uniquement la prévisualisation dev.
