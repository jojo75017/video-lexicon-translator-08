# Fiche complète du livre (parcours « J'ai déjà mon sommaire »)

Objectif : quand vous arrivez avec un livre déjà pensé, vous remplissez une vraie fiche complète — comme le document que vous m'avez envoyé — et le Génie s'appuie dessus sans rien réécrire.

## Ce que vous verrez

Sur `/v3/create`, après avoir cliqué sur « J'ai déjà mon sommaire », une fiche en sections repliables :

1. **Identité du livre** : titre, sous-titre, genre, catégorie, format visé, nombre de pages / mots visés, nombre de chapitres, langue.
2. **Auteur** : nom d'auteur (nom de plume), traducteur, mentions légales courtes.
3. **Accroche & synopsis** : accroche commerciale (4e de couverture) + synopsis long.
4. **Personnages** : fiches ajoutables (nom, âge, rôle, personnalité, enjeu) — comme Hélène, Maxime, Charles, Victoria.
5. **Sommaire** : la zone de collage existante, améliorée pour garder les actes en titres de partie, les chapitres numérotés et l'épilogue tels que vous les avez écrits.
6. **Épilogue** : champ dédié (repris automatiquement s'il est dans le sommaire collé).
7. **Pages de fin** : les 3 pages auteur (à propos de l'auteur, autres livres, contact / newsletter), les remerciements, et la note « laissez un avis » avec un QR code.
8. **QR code avis** : vous collez le lien (page auteur Amazon ou lien du livre), le QR code s'affiche et se télécharge en PNG haute définition, prêt pour l'intérieur du livre.

Un bouton **« Coller ma fiche complète »** permet aussi de déposer d'un coup un document comme celui que vous m'avez envoyé : titre, sous-titre, genre, accroche, personnages, chapitres et épilogue sont répartis automatiquement dans les bons champs, et vous corrigez ce que vous voulez.

En bas : « Enregistrer ma fiche » puis « Valider mon sommaire ». Tout est mémorisé pour la rédaction des chapitres, la couverture et l'export.

## Détails techniques

- `src/lib/v3/bookBrief.ts` : ajout de champs optionnels — `genre`, `format`, `targetPages`, `targetWords`, `hook`, `synopsis`, `translator`, `epilogue`, `authorPages` (3 blocs), `acknowledgements`, `reviewNote`, `reviewQrUrl`. Les personnages réutilisent le tableau `characters` existant, enrichi de `age`.
- Nouveau parseur `parseBookSheet(text)` : découpe un document collé (📖 fiche, 🎭 personnages, 🗺️ plan en actes) et renvoie les champs + chapitres. Il réutilise `parseTocText` pour les chapitres, ignore les lignes d'actes comme intitulés de chapitre mais les conserve comme parties, et garde l'épilogue.
- Nouveau composant `src/components/v3public/V3BookSheetForm.tsx` (sections repliables, auto-sauvegarde locale via `writeBookBrief`), monté dans le pupitre ② de `V3CreatePage.tsx` uniquement pour `creationPath === 'existing-outline'`.
- QR code : ajout de la dépendance `qrcode` (génération locale en canvas, aucun appel réseau, aucun crédit IA), téléchargement PNG côté navigateur.
- Le sommaire importé reste verrouillé : aucun bouton de génération IA sur ce parcours, le Génie valide et commente seulement.
- Aucune modification de la base, de la sécurité, des paiements, des crédits, des calculs KDP ni du module V4.
- Vérifications : TypeScript, tests existants, et contrôle navigateur sur `/v3/create` (fiche visible, collage du document d'exemple, 16 chapitres + épilogue intacts, QR code affiché).
