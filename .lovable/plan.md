
Do I know what the issue is? Oui.

Problème exact :
- Le crash ne vient plus seulement de `elevenlabs-tts`.
- Les logs montrent maintenant que `supabase/functions/azure-speech-tts/index.ts` dépasse la mémoire sur des requêtes de ~4600–4800 caractères (`Memory limit exceeded`).
- Le frontend envoie encore de trop gros chunks vers cette fonction dans :
  - `src/components/ebook/AudioExpressWorkflow.tsx`
  - `src/components/ebook/EbookAudioGenerator.tsx`
  - `src/components/ebook/EbookFormationSeriesAudio.tsx`
- Il y a aussi un composant incohérent : `src/components/ebook/EbookStatisticsTools.tsx` attend encore l’ancien format JSON/base64, alors que la fonction TTS renvoie maintenant de l’audio binaire.

Plan de correction :
1. Durcir la fonction TTS backend
- Fichier : `supabase/functions/azure-speech-tts/index.ts`
- Ajouter une validation stricte des entrées.
- Réduire la taille maximale réellement acceptée par requête à une valeur sûre.
- Baisser le format audio Azure pour réduire la mémoire.
- Garder une seule forme de réponse : binaire `audio/mpeg`.
- Retourner une erreur claire si le texte est trop long au lieu de laisser planter le worker.

2. Réduire fortement le chunking côté client
- Fichier : `src/utils/ttsChunker.ts`
- Passer d’un découpage à `4800` caractères à une taille bien plus petite et stable.
- Garder le découpage par phrases/paragraphes, mais avec une limite orientée fiabilité.

3. Uniformiser tous les appels audio
- Fichiers :
  - `src/components/ebook/AudioExpressWorkflow.tsx`
  - `src/components/ebook/EbookAudioGenerator.tsx`
  - `src/components/ebook/EbookFormationSeriesAudio.tsx`
- Utiliser partout le même flux `fetch -> response.blob()`.
- Vérifier `response.ok`, `content-type` et `blob.size`.
- Stopper proprement la génération si trop de segments échouent, sans casser l’écran.

4. Corriger le module resté sur l’ancien contrat
- Fichier : `src/components/ebook/EbookStatisticsTools.tsx`
- Remplacer la logique `data.audioContent` base64 par le même traitement binaire que les autres écrans.
- Si ce module n’est pas prioritaire, le désactiver temporairement pour supprimer une source de crash.

5. Bloquer la popup globale côté UI
- Dans les écrans audio, encapsuler les appels lourds avec une gestion d’erreur défensive.
- Ne jamais laisser remonter une exception non gérée.
- Afficher un toast métier et conserver la page interactive, même si un chunk échoue.

6. Vérification ciblée
- Tester un texte court.
- Tester un chapitre moyen.
- Tester un export complet depuis `audio-express`.
- Vérifier qu’en cas d’échec partiel, on obtient un message utilisateur et non plus l’écran blanc avec popup.

Résultat attendu :
- Plus de popup récurrente.
- Plus de `WORKER_LIMIT` sur les exports audio courants.
- Un seul comportement audio cohérent dans tout le projet.
- Une génération audio plus lente mais stable, ce qui est le bon compromis ici.
