
# Refonte "Importer un manuscrit" — V3 Premium

Objectif : rendre la page `/v3/create?import=1` réellement utilisable et premium, avec **tous les formats d'entrée** attendus et un visuel éditorial fort.

---

## 1. Multi-formats d'import (au lieu de .docx/.md/.txt seuls)

Refonte de `src/components/bookperfect/BookPerfectDashboard.tsx` (ou création d'un `V3ImportStudio.tsx` dédié pour ne pas casser BookPerfect V2) avec **5 sources d'entrée** en cartes cliquables :

| Source | Formats | Traitement |
|---|---|---|
| 📄 **Document texte** | .docx, .md, .txt, .rtf | pipeline existant `importManuscript` (mammoth + parser) |
| 📕 **PDF** | .pdf | extraction via `pdfjs-dist` (déjà utilisé côté KDP), fallback OCR si scanné via edge `parse-pdf` |
| 🌐 **Article / URL** | lien web (blog, Medium, Substack…) | edge function `import-from-url` → fetch + readability → markdown |
| 🎬 **Vidéo / Audio** | .mp4, .mov, .mp3, .wav, .m4a, ou URL YouTube | edge function `import-from-media` → transcription Whisper/Gemini → chapitres |
| ✍️ **Coller du texte** | textarea | direct, découpé par titres |

Chaque carte affiche icône or, titre sérif, exemples de formats, et ouvre soit un file-picker soit un champ URL/textarea.

Après import, on retombe sur le même flux (`onImported` → wizard V3), donc **zéro changement** en aval.

---

## 2. Style premium (cohérent Émeraude Prestige)

- Fond `--v3-paper`, filet or décoratif en haut.
- Titre sérif Cormorant "Donnez une seconde vie à vos contenus" + sous-titre Inter.
- Grille 2 colonnes desktop, 1 colonne mobile : à gauche les 5 cartes d'import, à droite un **visuel héros**.
- Cartes : bord `--v3-line`, hover = fond `--v3-gold-soft` + halo or + élévation douce.
- Bandeau conseil en bas : "Formats acceptés · Confidentialité · Limite 50 Mo".

---

## 3. Visuel héros

Génération d'une image premium via `imagegen` (preset standard, style éditorial photoréaliste, conforme mémoire "photorealism strict") :

> "Un auteur élégant assis à son bureau en bois, écrivant sur un ordinateur portable, une pile de livres reliés à côté, lumière chaude de fin d'après-midi, ambiance librairie premium, palette émeraude profond et touches dorées, photographie éditoriale."

Sauvegardé en `src/assets/v3/import-hero.jpg`, importé en ES6 dans la nouvelle page.

Placement : colonne droite desktop (sticky), en haut mobile. Overlay dégradé émeraude→transparent bas, filet or 1px.

---

## 4. Edge functions à créer

- `supabase/functions/import-from-url/index.ts` — fetch HTML → Readability → markdown → renvoie `{ title, content }`.
- `supabase/functions/import-from-media/index.ts` — reçoit un fichier ou URL YouTube, appelle Lovable AI Gateway (Gemini multimodal) pour transcription, renvoie texte structuré.

Les deux réutilisent l'auth pattern existant (`supabase.auth.getUser()`) et l'AI Gateway déjà en place.

---

## 5. Fichiers touchés

- `src/components/v3public/V3ImportStudio.tsx` — **nouveau** (composant multi-source)
- `src/pages/v3public/V3CreatePage.tsx` — branche `V3ImportStudio` quand `?import=1`
- `src/lib/bookperfect/importManuscript.ts` — accepte PDF (étend `extractText`)
- `src/lib/import/importFromUrl.ts` — **nouveau** (client → edge)
- `src/lib/import/importFromMedia.ts` — **nouveau** (client → edge)
- `supabase/functions/import-from-url/index.ts` — **nouveau**
- `supabase/functions/import-from-media/index.ts` — **nouveau**
- `src/assets/v3/import-hero.jpg` — **nouveau** (imagegen)

Aucune modif du wizard aval ni du workflow 15 agents.

---

## 6. Validation

- Playwright : `/v3/create?import=1` → 5 cartes visibles + hero image chargée, viewport 1440.
- Test manuel de chaque format (docx, pdf, URL Medium, mp3 court, coller texte) → wizard V3 reçoit bien un `Manuscript` valide.
- Build + typecheck OK.
