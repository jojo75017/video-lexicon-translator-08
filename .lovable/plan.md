# Améliorer la V3 + vidéo explicative sous-titrée

## Réponse sur la vidéo de 7 minutes

Oui, c'est faisable, mais pas en une seule pièce générée par IA : les clips IA font 5 à 10 secondes maximum. Une vidéo de 7 minutes se construit en montage animé (motion design programmé), rendu par segments.

Ce que je peux livrer :

- Une vidéo **animée avec sous-titres français incrustés**, découpée en 8 chapitres correspondant aux 8 séquences du script déjà écrit (`docs/video-v3-script.md`, ~1 000 mots ≈ 7 min de lecture).
- Rendu en segments de 45 à 60 secondes (limite technique de rendu), puis assemblés en un seul MP4 final.
- Sans voix : le texte défile en sous-titres synchronisés, avec captures/visuels animés. La voix-off reste à enregistrer par vous (ou une voix IA plus tard) et se pose par-dessus.
- Identité V3 : fond clair, or/émeraude, une seule police d'affichage, rythme posé.

Alternative plus rapide si vous préférez : **3 vidéos courtes de 60 à 90 secondes** (Le problème / Le studio / Les formules), plus efficaces en publicité qu'un format long.

## Idées d'amélioration V3 (par priorité)

### 1. Finir le parcours abonné (priorité haute)
- Un fil unique visible en permanence : Idée → Sommaire → Écriture → Correction → Couverture → KDP → Export, avec l'étape en cours surlignée et la reprise en un clic.
- Un vrai « Mes livres » : liste des projets avec avancement, dernière modification, bouton Reprendre.
- Suppression des impasses : chaque page V3 doit avoir une action suivante évidente.

### 2. Fiabilité de la génération
- Reprise automatique après échec d'un chapitre (au lieu d'un arrêt sec).
- Journal visible par livre : quel agent a fait quoi, quand, avec quel modèle.
- Contrôle qualité automatique avant export : chapitres trop courts, doublons, fins de chapitre incomplètes, mots étrangers.

### 3. Clés API et coûts
- Page d'état des clés : clé valide / invalide / quota atteint, testée en direct.
- Estimation du coût avant lancement d'un livre, et coût réel après.

### 4. Onboarding
- Premier livre guidé en 5 minutes avec un exemple pré-rempli, pour que l'essai gratuit produise un résultat visible tout de suite.
- Une page « Par où commencer » unique, remplaçant les entrées dispersées.

### 5. Vitrine et conversion
- Galerie de livres réellement produits (couverture + extrait), preuve la plus forte de la page de vente.
- Comparatif avant/après déjà en place sur l'accueil : le décliner en visuel partageable.

## Détails techniques

- Vidéo : projet Remotion dans `remotion/`, 1920x1080, 30 fps, sous-titres depuis le script `docs/video-v3-script.md` converti en pistes de captions ; rendu par segments puis concaténation ffmpeg, MP4 final dans `/mnt/documents/`.
- Aucun changement de tarif, de schéma de base de données ni de tunnel de paiement dans ce lot.
- Les améliorations V3 sont listées ici comme feuille de route : je n'en implémente que celles que vous choisissez, une par lot, pour rester dans la phase de stabilisation.

## Ce que je vous demande de choisir

1. Vidéo longue 7 min sous-titrée, ou 3 vidéos courtes ?
2. Quelle amélioration V3 attaque-t-on en premier (1 à 5) ?
