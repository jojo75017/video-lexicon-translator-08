# Tutoriels V3 : 21 modules mis à jour (vidéo + diaporama)

## Constat
Les tutoriels actuels datent de la V2 (clé Gemini, pipeline P1→P15, Audio Express…). Ils ne montrent ni « Commence ici », ni les spécialistes robots, ni Léonie, HumanizeAI, Micro-Séries, la correction éditoriale, les avatars lecteurs ou les 3 forfaits. Le script Loom V3 existe (14 chapitres) mais n'est pas découpé en tutoriels courts.

## Format proposé (sans que vous apparaissiez à l'image)
Chaque tutoriel existe en deux versions :
1. **Diaporama interactif** dans l'appli : 5 à 8 écrans (capture réelle + flèche + phrase courte), boutons Suivant/Précédent, barre de progression, bouton « Essayer maintenant » qui ouvre l'outil.
2. **Vidéo courte de 45 s à 2 min** en animation : captures réelles de l'outil, zooms, textes animés, aux couleurs vert sauge et pêche, voix off française optionnelle. Fichier MP4 réutilisable sur YouTube, dans les emails et les réseaux.

Le diaporama coûte peu et se met à jour en remplaçant une capture ; la vidéo est le support « vitrine ».

## Les 21 tutoriels
**Démarrer**
1. Bienvenue dans la V3 (tour de l'accueil)
2. « Commence ici » : choisir son spécialiste
3. Ajouter sa clé IA gratuite (Gemini / OpenRouter)
4. Les forfaits Plume, Édition, Maison d'Édition et les compléments

**Créer**
5. Créer mon livre (assistant /v3/create)
6. « Écrire maintenant » : 5 propositions puis sommaire
7. Choisir son avatar lecteur (30 profils)
8. Bouton vert « Nouveau livre (remettre à zéro) »
9. Histoires courtes (jusqu'à 20, bouton Compléter)
10. Je raconte ma vie (livre personnel, sans avatar)

**Écrire et corriger**
11. Rédiger chapitre par chapitre (Studio Pro)
12. Correction éditoriale (cohérence, typographie)
13. HumanizeAI : humaniser et auditer un texte
14. Mes livres : retrouver, reprendre, récupérer

**Habiller**
15. Couverture KDP (studio standard)
16. Cover Studio Pro (complément 67 €)
17. Léonie : album illustré 3–6 ans (complément Studio Jeunesse 47 €)

**Publier et vendre**
18. Fiche KDP : quoi mettre dans chaque champ
19. Exporter PDF intérieur et EPUB, checklist conformité
20. Plans de lancement et contenu A+
21. Studio Micro-Séries (précommande V4)

## Où on les trouve
- Page « Tutoriels V3 » dans la barre V3, classée par les 5 rubriques, badge « Mis à jour oct. 2026 ».
- Petit bouton « Voir le tuto » en haut de chaque outil concerné.
- Panneau admin (page Script vidéo actuelle) : script, textes à l'écran et voix off de chaque tutoriel prêts à copier.

## Étapes de réalisation
1. Écrire les 21 scripts courts (à partir du script Loom V3) et les relire avec vous.
2. Prendre les captures réelles de chaque outil dans l'aperçu.
3. Construire la page Tutoriels V3 + le diaporama + les boutons « Voir le tuto ».
4. Produire les vidéos par lots de 3 à 5 (tutoriels 1 à 5 en premier), validation après chaque lot.
5. Retirer les anciens tutoriels V2 de la vue V3 (gardés pour la V2 jusqu'au 31/12/2026).

## Détails techniques
- Nouvelle source unique `src/data/tutorielsV3.ts` (id, rubrique, titre, durée, étapes {capture, texte}, route outil, vidéo).
- Captures via Playwright sur l'aperçu, stockées dans les assets du projet.
- Vidéos rendues en motion design (Remotion), 1920×1080 et option 9:16 pour réseaux ; voix off française si validée.
- Aucune donnée inventée : seules les fonctions réellement présentes sont montrées.
