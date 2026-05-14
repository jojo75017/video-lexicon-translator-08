# Plan — Améliorations 2026 pour fidéliser les abonnés

Objectif : ajouter de la valeur perçue **sans casser** l'existant (BYOK multi-IA, 15 agents P1-P15, Audio Express, KDP Pro, presets typo). Aucune modification métier — uniquement des ajouts ciblés.

---

## 🎯 Top 8 améliorations priorisées

### 1. ⭐ Comparateur de modèles IA en 1 clic (HIGH)
**Pourquoi** : l'abonné a 9 modèles OpenRouter + Gemini/Claude/GPT — il ne sait pas lequel choisir.
**Quoi** : un bouton "Tester ce prompt sur 3 modèles" sur l'agent P3 (rédaction). Affiche les 3 sorties côte-à-côte + coût estimé en € + temps de génération. L'abonné garde celui qu'il préfère.
**Effort** : ~2h. Zéro impact métier (lecture seule sur le résultat).
**Fichiers** : nouveau `ModelComparePanel.tsx` + bouton dans le Kanban P3.

---

### 2. 💰 Compteur de coût en temps réel (HIGH)
**Pourquoi** : argument BYOK = "tu paies au prix réel". Le rendre visible.
**Quoi** : badge persistant en bas du dashboard "Ce livre t'a coûté 0,23€ d'IA · 14 200 tokens". Persisté en `localStorage` par projet. Capture les usages depuis `aiWritingService`.
**Effort** : ~1h30. Pure UI + un wrapper dans `callAIWriting`.

---

### 3. 📊 Tableau de bord "Mes livres" (MEDIUM)
**Pourquoi** : aujourd'hui un projet = un onglet, pas de vue d'ensemble multi-livres.
**Quoi** : page `/mes-livres` listant tous les projets `ebook_*` du localStorage + Supabase, avec : titre, % d'avancement P1→P15, nb de chapitres, dernière modif, boutons "Reprendre / Exporter / Dupliquer / Supprimer".
**Effort** : ~3h. Lecture seule sur les stockages existants.

---

### 4. 🎨 3 nouveaux presets typographiques (LOW, quick win)
**Pourquoi** : les 4 presets actuels (`lecture-confort`, `kdp-pro`, `roman-classique`, `compact`) couvrent peu de niches.
**Quoi** : ajouter dans `ebookExportOptions.ts` :
- 🧒 **Jeunesse** — Comic Sans-like, gros titres, marges larges
- 💼 **Business clean** — Helvetica, teal sobre, interligne aéré
- ✨ **Luxe éditorial** — Garamond italique pour citations, headings #c9a84c (or)
**Effort** : ~20 min. Aucun risque.

---

### 5. 🎙️ Bibliothèque de voix audio favorites (MEDIUM)
**Pourquoi** : l'abonné re-cherche sa voix OpenAI préférée à chaque livre.
**Quoi** : section "Mes voix" dans Audio Express — sauvegarde voix + vitesse + ton préféré par genre (romance/thriller/non-fiction). 1 clic pour appliquer.
**Effort** : ~1h30. localStorage uniquement.

---

### 6. 📤 Export "Pack KDP complet" en ZIP (HIGH)
**Pourquoi** : aujourd'hui l'abonné télécharge PDF, couverture, mots-clés, description séparément.
**Quoi** : bouton "Télécharger mon pack KDP" qui zip :
- `manuscrit-kdp.pdf` (déjà conforme)
- `couverture-front.jpg` + `couverture-full-spine.jpg`
- `metadata-kdp.txt` (titre, sous-titre, description, 7 mots-clés, 2 catégories)
- `audio/` (si Audio Express généré)
- `README.txt` avec checklist publication
**Effort** : ~2h. Utilise JSZip déjà présent.

---

### 7. 🤝 Mode "Partage lecture bêta" (MEDIUM)
**Pourquoi** : avant publication KDP, l'auteur veut faire relire par 3-5 bêta-lecteurs.
**Quoi** : bouton "Générer un lien de relecture" → uploade le manuscrit en HTML lisible sur Supabase Storage avec slug aléatoire, pas d'auth, expire 14 jours. Le lecteur peut surligner et laisser des commentaires anonymes (Supabase table `beta_comments`).
**Effort** : ~4h. Nouvelle table + edge function + page publique `/relire/:slug`.

---

### 8. 🆘 Bouton "SOS — explique-moi cette erreur IA" (LOW)
**Pourquoi** : quand un agent P1-P15 échoue (clé invalide, quota, timeout), le message est technique.
**Quoi** : intercepter les erreurs `callAIWriting` → afficher une modale humaine : "Ta clé Claude est expirée — voici comment la renouveler en 2 min" + lien direct vers la console Anthropic/OpenAI/OpenRouter selon le provider courant.
**Effort** : ~1h. Wrapper sur les `catch` existants.

---

## 📋 Ordre d'implémentation suggéré

```text
Phase 1 (quick wins, ~4h)        Phase 2 (valeur perçue, ~5h)     Phase 3 (engagement, ~7h)
────────────────────────────     ─────────────────────────────    ─────────────────────────
4. 3 nouveaux presets typo  →    1. Comparateur modèles IA    →   3. Tableau "Mes livres"
8. SOS erreurs IA                2. Compteur coût temps réel      7. Mode bêta-lecteurs
                                 6. Pack KDP ZIP                  5. Bibliothèque voix
```

---

## 🚫 Hors périmètre (volontairement écartés)
- Refonte du Planner monolithique (mémoire technique = interdit)
- Système de paiement / facturation (déjà 67€ lifetime stable)
- Traduction EN de l'app (marché FR prioritaire)
- IA vidéo (Sora/Runway) — hors promesse "auteur indé"
- Co-écriture temps réel multi-utilisateurs (trop coûteux à maintenir)

---

## ✅ Garanties de non-régression
- Aucune modification de `aiWritingService.ts` sauf wrappers additifs (logs/coût)
- Aucune migration de schéma sauf #7 (table isolée `beta_comments`)
- Tous les ajouts respectent la charte : `#FAFAFA` / `#008296` / `#FF9E2D` / `#232F3E`
- Tous les nouveaux presets/voix/coûts persistés en `localStorage` (pas de breaking change Supabase)

---

## ❓ À valider avant implémentation
Quelles phases veux-tu que je lance en premier ?
- **Phase 1 seule** (quick wins, ~4h, zéro risque) — recommandé pour ce soir
- **Phases 1 + 2** (~9h, gros impact perçu)
- **Tout** (~16h, sur 2-3 sessions)
- **Cherry-pick** : tu me dis "fais les n°4, 6 et 8" par exemple
