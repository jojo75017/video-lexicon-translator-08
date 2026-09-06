# Deux nouvelles voix + musique bien audible

Aujourd'hui les deux vidéos utilisent la même voix synthétique très grave (elle sonne artificielle) et la musique est mixée trop bas pour s'entendre. On corrige les deux points, sans toucher au texte des scripts ni aux images des vidéos.

## Ce qui change

1. **Deux voix distinctes, plus naturelles**
   - Vidéo de vente (page d'accueil) : voix féminine française posée, chaleureuse, ton directrice de collection.
   - Vidéo de bienvenue (espace abonné) : voix masculine française en registre médium — plus claire, moins caverneuse que l'actuelle.
   - Débit calme mais vivant, articulation nette, aucun ton commercial.

2. **Musique nettement plus présente**
   - Niveau doublé par rapport au mixage actuel : la musique s'entend clairement sous la voix, tout en restant douce.
   - Toujours piano feutré et nappe légère : aucune percussion, aucun rythme, aucune montée.
   - Fondu d'entrée 3 s, fondu de sortie 4 s.

3. **Sous-titres recalés**
   - Les nouvelles voix n'ont pas la même durée : je remesure chaque séquence et je réaligne les sous-titres avant de re-rendre les vidéos.

## Étape 1 : un extrait avant tout rendu (pour économiser les crédits)

Je vous livre d'abord un seul fichier audio de démonstration (~30 s) contenant :
- 15 s de la voix féminine sur les premières phrases du script de vente,
- 15 s de la voix masculine sur les premières phrases du script de bienvenue,
- la musique au nouveau niveau, dessous.

Aucun rendu vidéo, aucun remontage à cette étape. Vous écoutez, vous me dites « ok » ou « change la voix » — et seulement ensuite je passe à l'étape 2.

## Étape 2 (après votre accord)

- Génération des 8 séquences de la vidéo de vente et des 5 de la bienvenue avec les voix validées.
- Remesure des durées, réalignement des sous-titres, re-rendu des deux vidéos, remixage voix + musique.
- Remplacement des deux fichiers utilisés par le site (page d'accueil et « Commence ici »).

## Détails techniques

- Voix : passerelle IA intégrée (`openai/gpt-4o-mini-tts`) — deux voix différentes, une par vidéo. Pas d'ElevenLabs (quota gratuit épuisé, voix premium payante).
- Musique : piste douce existante, pondération relevée dans le filtre `amix` de `ffmpeg` (volume musique ×2), sortie AAC 192 k.
- Minutage : `remotion/src/voiceTiming.ts` et `voiceTimingBienvenue.ts` mis à jour d'après `ffprobe`, puis re-rendu Remotion des deux compositions.
- Extrait de contrôle livré dans `/mnt/documents`.

## Ce que je ne touche pas

Texte des scripts, visuels des vidéos, tarifs, base de données, paiements, sécurité, modules V4.
