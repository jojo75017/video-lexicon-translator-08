# Livre audio professionnel + couverture retrouvée

## Le problème

Sur `/v3/outils/audiobook`, il n'y a aujourd'hui qu'une zone de texte et 4 voix : rien à voir avec l'outil complet déjà en service en V2 (celui utilisé pour les ebooks du loup). Et la couverture enregistrée dans « Mes couvertures » n'est nulle part visible dans le livre audio.

## Ce qui change

### 1. Le vrai studio audio (celui de la V2)

La page `/v3/outils/audiobook` affiche désormais exactement l'outil professionnel existant :

- voix premium par univers (enfants, thriller, romance, spiritualité, business, histoire, saga…) ;
- découpage automatique en sections (préface, chapitres, sous-chapitres, conclusion, épilogue) ;
- intro parlée « Titre, par Auteur » ;
- lecture, pause, chapitre suivant/précédent, marque-pages, vitesse ;
- fusion en un seul MP3 ou fichiers par chapitre, ZIP, et exports texte associés.

Le livre à lire vient soit d'un manuscrit collé/importé, soit du titre et de l'auteur saisis en haut de page.

### 2. La couverture du livre audio

Un encadré « Couverture du livre audio » en haut de la page :

- liste vos couvertures déjà enregistrées ;
- affiche la miniature choisie (lien privé temporaire, rien de public) ;
- la couverture choisie est reprise dans la fiche du livre audio et proposée au téléchargement avec les fichiers audio ;
- lien direct vers « Mes couvertures » si la liste est vide.

## Détails techniques

- `src/pages/v3public/V3AudiobookPage.tsx` réécrite : en-tête (titre, auteur, préface/conclusion facultatives), sélecteur de couverture, puis `<EbookAudioGenerator />` (`src/components/ebook/EbookAaudioGenerator.tsx`, inchangé) alimenté par les chapitres issus du manuscrit collé/importé via `manuscriptParser`.
- Nouveau petit composant `src/components/v3public/AudiobookCoverPicker.tsx` s'appuyant sur `listCoverProjects()` + `getSignedCoverUrl()` de `src/lib/coverProjects.ts` (bucket privé `covers`, URL signées uniquement).
- Aucun changement : base de données, RLS, stockage, crédits, paiements, calculs KDP, fonctions edge (`azure-speech-tts`, ElevenLabs, `send-audiobook-delivery`), ni l'outil V2 lui-même.
- Vérification : typecheck, puis contrôle navigateur de la page (sélection couverture visible, sections générées, boutons d'export présents).
