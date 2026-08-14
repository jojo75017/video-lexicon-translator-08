# Rétablir la V2 et remonter l’encart de démarrage

## Objectif
Corriger uniquement les deux problèmes signalés, sans modifier les contenus ni les autres parcours.

## 1. Accès fiable à EbookStudio V2
- Conserver la route directe `/ebook-planner` et son écran V2 complet.
- Faire de `/dashboard` un alias explicite vers `/ebook-planner` pour retrouver l’ancien parcours de travail.
- Garder le bouton **Basculer V2** visible dans l’en-tête V3 sur ordinateur et mobile.
- Vérifier que l’administrateur connecté peut ouvrir la V2 sans être renvoyé vers `/admin`, `/v3` ou la page de vente.
- Ne pas changer la destination générale de connexion : l’admin reste dirigé vers `/admin` après connexion, puis choisit librement **Basculer V2**.

## 2. Position de l’encart de démarrage
Ordre corrigé en haut de l’accueil `/v3` :

```text
1. Bandeau principal EbookStudio V3
2. Les moteurs IA de la V3 (bandeau + grille)
3. Encart de démarrage
   « Cette page vous montre tout ce que contient l’outil »
4. Migration V2 / clé Gemini / KDP Pilot
5. Champs réduits de création
6. Reste de la page
```

- Déplacer l’encart existant sans le dupliquer.
- Le supprimer de sa position actuelle tout en bas.
- Conserver ses liens vers les 12 modules, tous les outils et le support.

## 3. Validation réelle
- Tester avec une session administrateur : `/dashboard`, `/ebook-planner`, puis le bouton **Basculer V2**.
- Confirmer que les trois accès affichent bien la page V2.
- Vérifier visuellement `/v3` : moteurs IA en deuxième, encart de démarrage immédiatement après, aucun doublon en bas.
