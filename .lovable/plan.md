# Corriger le son de la longue vidéo de présentation

## Ce que j'ai constaté

La vidéo longue actuellement en ligne sur la page de présentation contient bien une piste sonore, mais son niveau est identique du début à la fin (environ -19 dB partout) : le morceau de piano n'est jamais audible et il reste un souffle continu, hérité de l'ancien fond sonore fabriqué artificiellement. Résultat : on entend un bruit de fond, pas de la musique.

## Ce que je vais faire

1. Supprimer complètement l'ancien fond sonore artificiel (c'est lui, le souffle).
2. Refaire la narration française (même voix féminine que celle validée pour la vidéo de vente), sans changer une ligne du script ni les images.
3. Utiliser uniquement votre morceau `Ardie Son - Venture` comme musique de fond, en boucle douce, avec un léger fondu au début et à la fin.
4. Régler l'équilibre : la voix reste au premier plan, la musique clairement audible entre les phrases et pendant les silences, sans jamais couvrir la voix.
5. Remonter cette nouvelle bande-son sur la vidéo existante : aucune image, aucun texte, aucun sous-titre n'est modifié, donc pas de long re-rendu.
6. Vérifier le résultat (niveaux mesurés, écoute de plusieurs passages : début, milieu, fin) avant de le publier.
7. Publier la nouvelle version sur la page de présentation et vous fournir le fichier à télécharger.

## Précisions

- La courte vidéo de bienvenue n'est pas touchée ; si vous entendez le même défaut dessus, je l'applique ensuite de la même manière.
- Seule la narration nécessite de l'IA (voix de synthèse). Le reste (musique, mixage, montage) se fait localement, sans crédits.
- Aucun autre module, page, paiement ou réglage du site n'est modifié.

## Détails techniques

- Narration régénérée segment par segment via l'AI Gateway (`openai/gpt-4o-mini-tts`), en respectant les durées déjà définies dans `remotion/src/voiceTiming.ts` pour garder la synchronisation avec les sous-titres.
- Mixage ffmpeg : `aloop` sur la musique, `sidechaincompress` calibré (ratio modéré, release plus long) piloté par la narration, puis `loudnorm` cible -16 LUFS et vérification `volumedetect` sur plusieurs fenêtres.
- Remux sans réencodage vidéo (`-c:v copy`, audio AAC), nouvel artefact versionné dans `/mnt/documents`, puis mise à jour du pointeur `src/assets/v3-presentation.mp4.asset.json`.
