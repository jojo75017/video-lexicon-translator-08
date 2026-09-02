# Script VSL + vidéo IA pour /bd-offre (17 €)

## Objectif
Un script de vente de 2 à 3 minutes pour la vidéo en haut de la page `/bd-offre`, plus un clip vidéo IA court (accroche visuelle) que JE génère moi-même via l'outil vidéo et que j'intègre dans la zone VSL.

## 1. Le script (livré en texte, prêt à enregistrer)
Structure minutée, en français, ton direct, sans jargon :

```text
[0:00-0:15] Accroche : "Vous avez une idée de BD... mais vous ne savez pas dessiner."
[0:15-0:40] Le problème : outils dispersés, personnages incohérents, heures perdues.
[0:40-1:20] La solution : BD Studio — personnages cohérents, planches, histoires jeunesse, export KDP.
[1:20-1:50] Démonstration parlée : 4 étapes (personnage → scénario → planches → export).
[1:50-2:15] Pour qui : parents, créateurs, auteurs KDP, enseignants.
[2:15-2:35] Offre : 17 € accès complet + bonus, garantie.
[2:35-2:50] Appel à l'action : "Cliquez sous la vidéo et créez votre première BD aujourd'hui."
```

Deux versions dans le même fichier `src/data/bdVslScript.ts` :
- voix-off mot pour mot (à lire au micro / voix-off IA plus tard),
- storyboard (ce qu'on montre à l'écran à chaque séquence).

## 2. La vidéo IA — générée par moi
- Je génère UN clip court d'accroche (style planche de BD animée, ambiance, sans dialogue) via `videogen--generate_video`.
- Format 16:9, adapté à l'encart `aspect-video` déjà en place sur `/bd-offre`.
- Le clip sert de boucle visuelle d'accroche ; la version parlée complète de 2-3 min reste à produire avec votre voix ou une voix-off par-dessus le script fourni.
- Un seul clip, pas d'essais multiples automatiques (limitation des crédits).

## Coût crédits
- La génération vidéo se déduit du solde crédits unifié (même solde que les messages).
- Pas de tarif fixe que je puisse garantir — dépend du modèle/résolution/durée choisis par l'outil.
- Solde actuel : 72,56 crédits restants. Un clip court coûte bien plus qu'un message texte mais reste un achat ponctuel.

## 3. Intégration dans l'app
- Nouveau fichier `src/data/bdVslScript.ts` (script : voix-off + storyboard), source unique.
- Clip généré enregistré dans `src/assets` et branché sur `BD_COMIC_OFFER.vslUrl` (lecture, boucle muette), remplaçable plus tard par votre vidéo finale parlée.
- Petit onglet admin (panneau BD existant) pour copier le script en un clic.

## Notes techniques
- Aucune modification du tunnel de paiement ni des prix (17 € / upsell 47 €).
- Aucun `npm run build` : uniquement la prévisualisation dev.
