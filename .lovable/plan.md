# ContentStudio Engine — module V3 dédié

Nouveau module `/v3/contentstudio` : on crée un livre conforme KDP, puis on le décline en un seul clic en formation vidéo (scripts, slides, voix off, sous-titres). Aucune clé API à fournir : tout passe par l'IA déjà intégrée à Ebookstudio.

## Ce que l'abonné voit

1. **Tableau de bord ContentStudio** (`/v3/contentstudio`)
   - Liste de ses projets ContentStudio (titre, sous-titre, avancement chapitres, badge « Vidéo débloquée »).
   - Bouton « Nouveau projet » → formulaire court : titre, sous-titre, public cible, ton (professionnel / inspirant / informatif / narratif), langue.

2. **Projet** (`/v3/contentstudio/:id`)
   - Onglet **Ebook** : plan de chapitres généré, puis rédaction chapitre par chapitre (statut brouillon / en cours / terminé), encadrés « À retenir », description KDP + 7 mots-clés + catégories, couverture générée.
   - Boutons d'export : EPUB, PDF, métadonnées KDP.
   - **Encart Upsell vidéo** en bas : « Transformez ce livre en formation vidéo » avec un bouton unique « Débloquer la version vidéo ».

3. **Onglet Formation vidéo** (après déblocage)
   - Pour chaque chapitre : titre vidéo, script en 3 blocs (accroche / cœur / passage à l'action), slides (titre, puces, visuel), voix off MP3, sous-titres SRT/VTT, durée estimée.
   - Export : pack ZIP par leçon (script .txt, slides .json, audio .mp3, sous-titres .srt).

L'entrée « 🎬 ContentStudio Engine » est ajoutée dans la barre latérale V3 (section outils) et sur « Commence ici ».

## Détails techniques

**Base de données** — 3 tables préfixées pour ne pas entrer en conflit avec les tables livres existantes :
- `cs_projects` (user_id, title, subtitle, target_audience, tone, language_code, kdp_description, kdp_keywords[], kdp_categories[], cover_image_url, video_unlocked bool)
- `cs_chapters` (project_id, chapter_number, title, content_markdown, key_takeaways[], status)
- `cs_video_lessons` (chapter_id, video_title, script_hook, script_core, script_action, slides_json, audio_url, subtitle_vtt_url, duration_seconds)

RLS stricte `auth.uid() = user_id` sur les trois (les enfants via jointure au projet), avec les GRANT requis pour `authenticated` et `service_role`.

**Storage** : bucket privé `contentstudio` (couvertures, MP3, sous-titres) servi par URLs signées.

**Edge functions** (toutes via la passerelle Lovable AI, secret `LOVABLE_API_KEY` déjà en place — pas d'`OPENAI_API_KEY` ni ElevenLabs) :
- `cs-generate-outline` : plan de chapitres depuis le brief.
- `cs-write-chapter` : rédaction Markdown d'un chapitre avec contexte du chapitre précédent (équivalent de votre fonction fournie, modèle `google/gemini-3.7-flash`).
- `cs-generate-kdp-meta` : description, mots-clés, catégories.
- `cs-generate-cover` : couverture, recadrée au format KDP exact par la normalisation déjà en place.
- `cs-video-lesson` : script 3 blocs + slides JSON pour un chapitre.
- `cs-video-voice` : voix off MP3 + sous-titres, stockés dans le bucket.

**Front** : `src/pages/v3public/ContentStudio*.tsx`, composants sous `src/components/v3/contentstudio/`, types dans `src/types/contentStudio.ts` (les interfaces `Project`, `Chapter`, `Slide`, `VideoLesson` que vous avez fournies).

**Contraintes respectées** : textes 100 % en français (règle `LANGUE_RULE`), aucune donnée simulée, chapitres plafonnés à 40, thème V3 existant.

## Ordre de réalisation

1. Migration base + bucket storage.
2. Tableau de bord + création de projet.
3. Plan + rédaction des chapitres + métadonnées KDP + couverture.
4. Exports EPUB / PDF / métadonnées.
5. Encart Upsell + onglet Formation vidéo (scripts, slides).
6. Voix off, sous-titres, export ZIP.
