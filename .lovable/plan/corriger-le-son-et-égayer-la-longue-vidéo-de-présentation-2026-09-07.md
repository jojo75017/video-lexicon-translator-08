# Corriger le son et égayer la longue vidéo de présentation

## Ce que j'ai constaté

La vidéo longue actuellement en ligne contient bien une piste sonore, mais son niveau reste identique du début à la fin (environ -19 dB partout) : le morceau de piano n'est jamais audible et il subsiste un souffle continu, hérité de l'ancien fond sonore fabriqué artificiellement. Résultat : on entend un bruit de fond, pas de la musique.

## Le son

1. Supprimer complètement l'ancien fond sonore artificiel (c'est lui, le souffle).
2. Refaire la narration avec **la même voix que la vidéo réservée aux abonnés** (voix masculine médium déjà validée), pour une cohérence d'ensemble. Le script reste inchangé.
3. Utiliser uniquement votre morceau `Ardie Son - Venture` comme musique de fond, en boucle douce, avec fondu au début et à la fin.
4. Régler l'équilibre : la voix au premier plan, la musique clairement audible entre les phrases et pendant les silences, sans jamais couvrir la voix.
5. Recaler les sous-titres sur la nouvelle narration.

## Les images

Aujourd'hui la vidéo n'affiche que des textes et des aplats de couleur, d'où l'impression de fadeur. J'ajoute, sans changer le script ni la durée :

- des captures réelles de l'outil (bibliothèque de couvertures, éditeur, plan de livre, export) affichées en médaillon éditorial pendant les passages qui les évoquent ;
- 3 à 4 visuels de couvertures de livres finalisées, en présentation façon vitrine de maison d'édition ;
- des transitions douces (fondus, léger mouvement lent) et un filet doré discret pour rester dans l'identité émeraude et or ;
- les prix restent strictement 27 € et 47 € (mensuel) et 270 € / 470 € (annuel).

## Précisions

- La courte vidéo de bienvenue reste telle quelle.
- Seule la narration utilise l'IA. Musique, mixage, montage et captures d'écran se font localement.
- Aucune page, aucun paiement, aucun réglage du site n'est modifié : seul le fichier vidéo de présentation change.
- Je vous fournis d'abord un extrait court (voix + musique + un visuel) pour validation avant le rendu complet.

## Détails techniques

- Narration régénérée segment par segment via l'AI Gateway (`openai/gpt-4o-mini-tts`), voix identique à celle de la vidéo bienvenue, durées reportées dans `remotion/src/voiceTiming.ts`.
- Nouvelles scènes visuelles dans `remotion/src/scenes`, images captées via Playwright sur le preview local puis placées dans les assets Remotion ; rendu Remotion complet nécessaire pour cette partie.
- Mixage ffmpeg : `aloop` sur la musique, `sidechaincompress` calibré (release long) piloté par la narration, `loudnorm` cible -16 LUFS, vérification `volumedetect` sur plusieurs fenêtres.
- Nouvel artefact versionné dans `/mnt/documents`, puis mise à jour du pointeur `src/assets/v3-presentation.mp4.asset.json`.
