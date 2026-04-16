

# Audit de la page de vente — Ce qui cloche pour vendre le générateur

## Diagnostic

J'ai analysé en détail `SalesPage.tsx` (957 lignes), les 33 composants sales, et la charte graphique. Voici les problèmes classés par impact sur la conversion.

---

## 1. Problème visuel majeur — Couleurs hors charte (IMPACT ÉLEVÉ)

La charte définit : fond `#FAFAFA`, accent teal `#008296`, texte `#232F3E`, orange `#FF9E2D`.

Mais **134 occurrences** dans `SalesPage.tsx` et **694 dans les composants sales** utilisent des couleurs Tailwind brutes :
- `from-cyan-400 via-emerald-400 to-cyan-400` pour le titre hero
- `bg-violet-600 to-purple-700` dans PriceComparison (la carte EbookStudio)
- `text-emerald-400`, `text-amber-400`, `bg-cyan-500/10` partout
- `dark:` classes résiduelles (pas de dark mode dans la charte)
- `via-violet-300 dark:via-violet-700` dans les séparateurs

**Résultat** : La page paraît "noir et bleu" au lieu d'être claire, professionnelle et cohérente style Amazon.

### Correction
Remplacer systématiquement dans SalesPage.tsx + 28 composants sales :
- `cyan-*` → `primary`
- `emerald-*` → `primary` ou `accent`
- `violet-*` / `purple-*` → `primary` ou `accent`
- `amber-*` → `kdp-orange`
- Supprimer toutes les classes `dark:*`

---

## 2. Confusion de l'offre (IMPACT ÉLEVÉ)

La page mélange **3 messages contradictoires** :
- **"67€ à vie"** dans le header et le CTA hero
- **"Essai gratuit 7 jours"** dans le pricing et le trial banner
- **"0€"** en énorme dans la section pricing

Le visiteur ne sait pas s'il paie 67€, 0€, ou si c'est un abonnement. Le prix affiché en gros est "0€" alors que le vrai prix est 67€.

### Correction
- Afficher **67€** comme prix principal (barré 147€)
- L'essai gratuit doit être un **sous-texte** discret, pas le message dominant
- Un seul CTA clair : "Accéder pour 67€" avec mention "7 jours satisfait ou remboursé" en dessous

---

## 3. Surcharge d'éléments d'urgence (IMPACT MOYEN)

La page empile **7 mécanismes d'urgence** simultanés :
- `UrgencyBanner` (rotation de messages)
- `ExclusiveFlashBanner`
- `CountdownTimer`
- `SpotsCounter`
- `SocialProofToast` (notifications toast)
- `ExitIntentPopup`
- `ProgressEngagement`
- `FloatingMobileCta`
- `StickyCtaBar`

C'est perçu comme du spam. Les visiteurs expérimentés reconnaissent ces patterns et perdent confiance.

### Correction
Garder maximum 3 éléments : CountdownTimer, 1 bannière d'urgence, et le CTA sticky mobile. Supprimer ou commenter les autres.

---

## 4. URL non professionnelle (IMPACT MOYEN)

L'URL est `video-lexicon-translator-08.lovable.app`. Pour vendre un produit, il faut un domaine propre comme `ebookstudio.fr`.

### Correction
Connecter un domaine personnalisé via les paramètres Lovable.

---

## 5. Vidéo inexistante (IMPACT MOYEN)

La section vidéo pointe vers `/videos/ebookstudio-offre-fondatrice.mp4` avec un poster `/images/video-poster-offre.jpg`. Si ces fichiers n'existent pas, le visiteur voit un lecteur vide — très mauvais pour la confiance.

### Correction
Soit ajouter la vidéo réelle, soit retirer la section vidéo.

---

## 6. Social proof faible (IMPACT MOYEN)

- "47+ auteurs" est un petit nombre
- "35+ ebooks publiés" est modeste
- Les toasts de "Nicolas F. de Marseille" sont simulés (pas de données réelles)
- Le rating "4.8/5 (47 avis)" dans le JSON-LD et la page est le même nombre

### Correction
Soit augmenter les chiffres avec des données réelles, soit retirer la social proof simulée et garder uniquement les éléments vérifiables.

---

## Plan d'implémentation (par priorité)

### Étape 1 — Mise en conformité des couleurs
Corriger `SalesPage.tsx` et les 28 composants sales avec les couleurs de la charte. Supprimer les classes `dark:*`.

**Fichiers** : `src/pages/SalesPage.tsx` + 28 fichiers dans `src/components/sales/`

### Étape 2 — Clarifier l'offre pricing
Refondre la section `#pricing` pour mettre 67€ en avant comme prix principal, avec l'essai gratuit en mention secondaire.

**Fichier** : `src/pages/SalesPage.tsx` (section pricing lignes 660-785)

### Étape 3 — Réduire l'urgence
Commenter/supprimer `ExitIntentPopup`, `ProgressEngagement`, `SocialProofToast`, `SpotsCounter`, `FloatingMobileCta`. Garder `UrgencyBanner`, `CountdownTimer`, et le CTA mobile sticky.

**Fichier** : `src/pages/SalesPage.tsx` (lignes 894-897 + imports)

### Étape 4 — Nettoyer la vidéo
Vérifier si les fichiers vidéo existent. Si non, retirer la section.

### Étape 5 — Ajuster la social proof
Mettre des chiffres cohérents ou supprimer les notifications simulées.

