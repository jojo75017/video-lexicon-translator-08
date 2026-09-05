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

Cahier des charges du morceau :
- **Instrumental uniquement** — aucun instrument à vent solo expressif, aucune voix, aucun effet dramatique.
- **Piano doux + nappe ambiante légère** (cordes très atténuées), éventuellement un peu de vibraphone/celesta discret.
- **Tempo lent** (~60-70 BPM), sans percussions marquées (aucune batterie/caisse claire).
- **Ton chaud mais plat** — montée nulle, pas de crescendo, pour ne pas suggérer « achetez ».
- **Volume mixé bas** : on doit pouvoir lire les sous-titres sans être entraîné par la musique.
- Bouclable sans couture audible.

Prompt de génération proposé (ElevenLabs Music) :
> « Calm minimalist instrumental, soft solo piano with very subtle ambient pad, slow tempo around 65 BPM, warm and understated, no percussion, no drums, no vocals, documentary editorial mood, neutral and unobtrusive, seamless and loopable, gentle, no crescendo. »

## Choix à valider
**Recommandé : génération IA (ElevenLabs Music)** — clé déjà en place, rapide, rights-cleared pour le projet, conforme au cahier des charges ci-dessus.

Alternative : vous fournissez une piste libre de droits (piano/cordes, calme) et je la mixe directement sans génération.

## Livrables et vérification
- Nouveau MP4 : `/mnt/documents/ebookstudio-v3-presentation-musique.mp4` (6 min 47, vidéo identique + 1 piste audio).
- `ffprobe` : 1 flux audio AAC, durée 407 s.
- Test lecture dans le navigateur sur `/v3` : son audible au clic, fondus propres, pas de coupure à la boucle.
- Asset du projet mis à jour pour pointer vers la version musicée.

## Ce que je ne touche pas
- Rien côté base de données, sécurité, paiements, crédits, calculs KDP, tarifs, ni le module V4.
- Le script/sous-titres Remotion inchangés. La voix-off reste à part (non incluse ici).
