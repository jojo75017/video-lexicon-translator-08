# Voix-off « maison d'édition » + musique douce sur la vidéo V3

## État actuel confirmé
- Vidéo de présentation V3 : `ebookstudio-v3-presentation-v2.mp4`, **407 s (6 min 47 s)**, H264, **sans aucune piste audio** (confirmé par `ffprobe`).
- Le texte complet du script existe déjà, découpé en 8 séquences et en lignes de sous-titres (`remotion/src/script.ts`, source `docs/video-v3-script.md`).
- `ffmpeg` disponible ; clé ElevenLabs déjà configurée (voix + musique), aucun crédit abonné ni appel IA image.

## Le principe
Sans voix, 7 minutes de sous-titres sur musique douce endorment. On ajoute donc **une voix française posée** qui lit le script — le ton d'un directeur de collection qui présente un ouvrage — avec la musique **très en retrait dessous**.

Trois couches audio :
1. **Voix-off** (premier plan, claire, rythme calme mais vivant).
2. **Musique** (arrière-plan, ~15 % du volume de la voix, jamais concurrente).
3. **Silences respirés** entre les séquences (petites pauses, comme une page qui se tourne).

## La voix
- Voix **française naturelle**, grave et chaleureuse, débit posé, articulation nette — registre « maison d'édition », pas commercial, pas dynamique-marketing.
- Texte lu : exactement les lignes déjà écrites dans le script (aucune réécriture du contenu), avec une **phrase d'ouverture ajoutée** dans le même esprit, par exemple :
  > « Prenez sept minutes. Je vous montre comment un manuscrit devient un livre publié. »
- Génération séquence par séquence (8 fichiers) plutôt qu'un seul bloc : meilleure qualité, reprise facile si une séquence sonne mal.

### Moteur de voix (sans payer ElevenLabs à part)
ElevenLabs réclame un abonnement (~11 €) séparé. On évite donc le coût supplémentaire :
- **Par défaut : passerelle IA intégrée (Lovable AI Gateway)**, déjà câblée dans `supabase/functions/cs-video-voice` (`openai/gpt-4o-mini-tts`, voix `alloy`, instructions « formation professionnelle, chaleureuse, rythme posé, en français »). Aucun paiement ElevenLabs.
- Si vous activez/reprenez un compte ElevenLabs plus tard, on bascule automatiquement dessus (le code détecte une clé `sk_` valide) pour une voix plus naturelle, sans rien changer d'autre.

## La musique (rôle secondaire)
- Piano feutré + nappe chaude très légère, notes tenues et espacées.
- **Aucune percussion, aucun rythme, aucune pulsation, aucun arpège rapide, aucune montée.**
- Bouclée jusqu'à 407 s avec fondu entrecroisé, fondu d'entrée 3 s / de sortie 4 s.
- Prompt de génération :
  > « Extremely gentle ambient piano, sparse sustained notes, soft felt piano with a faint warm string pad underneath, very slow and still, absolutely no percussion, no drums, no beat, no rhythm, no bass line, no arpeggios, no vocals, no build-up, no crescendo, calm library atmosphere, seamless and loopable, quiet background music. »

## Synchronisation avec les sous-titres
Les sous-titres actuels sont minutés d'après le nombre de mots (~145 mots/minute). La voix générée ne tombera pas exactement dessus.
- Je mesure la durée réelle de chaque séquence parlée, puis **j'ajuste le minutage du script Remotion** (une constante de vitesse de lecture + les pauses entre séquences) et je **re-rends la vidéo** avec Remotion pour que sous-titres et voix soient alignés.
- Contrôle sur les 8 débuts de séquence : le sous-titre apparaît au plus tard au moment où la phrase est dite.

## Contrôle qualité avant livraison
- Voix : écoute des 8 séquences, vérification française (aucun mot mal prononcé, aucun anglicisme de lecture), aucune coupure de phrase.
- Musique : vérification qu'aucune attaque rythmique régulière n'est présente ; sinon régénération, et au bout de 2 échecs je vous propose de fournir votre propre piste.
- Mixage : voix intelligible partout, musique jamais devant, pas de saturation.
- `ffprobe` final : 1 flux vidéo + 1 flux audio AAC, durées identiques.

## Livrables
- `/mnt/documents/ebookstudio-v3-presentation-voix.mp4` — vidéo complète, voix-off + musique.
- L'asset du projet mis à jour pour que `/v3` lise cette version.

## Détails techniques
- Voix : passerelle IA intégrée (`openai/gpt-4o-mini-tts`) par défaut, sans paiement ElevenLabs ; 8 fichiers MP3 assemblés avec pauses par `ffmpeg`. Bascule auto vers ElevenLabs si une clé `sk_` valide est présente plus tard.
- Musique : ElevenLabs Music si la clé est valide, sinon piste douce que vous fournissez (ou je propose une alternative libre de droits).
- Mixage : `amix` avec pondération voix/musique, `afade`, sortie AAC 192 k, vidéo recopiée sans réencodage quand le re-rendu n'est pas nécessaire.
- Re-rendu Remotion uniquement pour recaler les sous-titres (script texte inchangé, seul le minutage bouge).

## Ce que je ne touche pas
- Base de données, sécurité, paiements, crédits, calculs KDP, tarifs, module V4 : aucun changement.
- Le contenu du script n'est pas réécrit, seulement lu (plus la phrase d'ouverture).
