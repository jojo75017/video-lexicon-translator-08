# Ajouter une musique douce à la vidéo V3 (7 min)

## État actuel confirmé
- Vidéo de présentation V3 : `ebookstudio-v3-presentation-v2.mp4`, **407 s (6 min 47 s)**, H264, **sans aucune piste audio** (confirmé par `ffprobe`).
- Vidéo rendue par Remotion (muette par construction) et hébergée comme asset du projet, lue par `<video>` sur `/v3`.
- `ffmpeg` disponible ; clé `ELEVENLABS_API_KEY` déjà configurée (génération musicale possible sans frais IA image/crédit abonné).

## La méthode (comment mettre le son)
Approche 100 % locale, post-traitement sur le fichier existant — aucun re-rendu Remotion, aucun appel IA image, aucun débit de crédit abonné :

1. **Produire une musique douce** (voir choix ci-dessous) — un lit instrumental ~60-90 s, en boucle.
2. **Étendre** le lit à la durée exacte (407 s) par bouclage avec fondu entrecroisé (`ffmpeg` `aloop` / concaténation crossfade) pour éviter la coupure.
3. **Mixage** sur la vidéo :
   - Volume musique très bas : ~0,22 (≈ -13 dB), pour rester un « tapis » discret sous les sous-titres.
   - Fondu entrée 3 s / sortie 4 s (`afade`).
   - Encodage AAC 192 k, H264 vidéo recopié (`-c:v copy`), MP4 final.
4. **Remplacer l'asset** et vérifier la lecture (le lecteur `<video>` a `controls` : le son démarre au clic utilisateur, pas d'autoplay → aucune restriction navigateur).

## La musique proposée (quoi mettre)
Direction : **ambiance éditoriale « maison d'édition », neutre, rassurante**. Pas d'influence émotionnelle forte, pas de manipulation.

Cahier des charges du morceau (règles strictes) :
- **Instrumental uniquement** — aucune voix, aucun effet dramatique.
- **Piano doux seul + nappe ambiante très légère** ; rien d'autre.
- **Aucune percussion, aucun rythme, aucune pulsation** : ni batterie, ni caisse, ni shaker, ni basse rythmique, ni arpège rapide. Notes tenues et espacées.
- **Très lent** (~55-65 BPM ressenti), aucun crescendo, aucune montée.
- **Ton chaud et plat**, volume mixé bas : la musique reste sous les sous-titres.
- Bouclable sans couture audible.

Prompt de génération (version douce, sans percussions) :
> « Extremely gentle ambient piano, sparse sustained notes, soft felt piano with a faint warm string pad underneath, very slow and still, absolutely no percussion, no drums, no beat, no rhythm, no bass line, no arpeggios, no vocals, no build-up, no crescendo, calm library atmosphere, seamless and loopable, quiet background music. »

## Contrôle qualité de la musique avant mixage
Le morceau généré est vérifié avant d'être posé sur la vidéo :
- Écoute et analyse du fichier (détection d'attaques rythmiques / transitoires régulières).
- Si une percussion ou une pulsation est détectée, le morceau est **rejeté et régénéré** avec un prompt encore plus restrictif ; au bout de 2 échecs, je vous propose la solution piste fournie.
- Aucun mixage n'est fait sur un morceau rythmé.

## Choix à valider
**Recommandé : génération IA (ElevenLabs Music)** avec le prompt ci-dessus + contrôle qualité.

Alternative : vous fournissez une piste libre de droits (piano/cordes, calme, sans percussions) et je la mixe directement sans génération.

## Livrables et vérification
- Nouveau MP4 : `/mnt/documents/ebookstudio-v3-presentation-musique.mp4` (6 min 47, vidéo identique + 1 piste audio).
- `ffprobe` : 1 flux audio AAC, durée 407 s.
- Test lecture dans le navigateur sur `/v3` : son audible au clic, fondus propres, pas de coupure à la boucle.
- Asset du projet mis à jour pour pointer vers la version musicée.

## Ce que je ne touche pas
- Rien côté base de données, sécurité, paiements, crédits, calculs KDP, tarifs, ni le module V4.
- Le script/sous-titres Remotion inchangés. La voix-off reste à part (non incluse ici).
