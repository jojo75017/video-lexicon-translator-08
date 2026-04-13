

## Migration vers le thème Amazon KDP (Option C)

Palette choisie :
- **Fond** : `#FAFAFA` (blanc cassé) / `#FFFFFF` (cartes)
- **Accent** : `#008296` (teal Amazon)
- **Texte** : `#232F3E` (gris Amazon foncé)
- **Texte secondaire** : `#565959` (gris Amazon)
- **Bordures** : `#D5D9D9` (gris Amazon clair)

---

### Fichiers modifiés

**1. `src/index.css`** — Variables CSS `:root` et `.dark`
- Remplacer le fond sombre `#0d0820` par `#FAFAFA`, les cartes par `#FFFFFF`
- Accent `#3B9EFF` → `#008296` (teal), accent deep `#0052CC` → `#005F73`
- Texte blanc → `#232F3E`, muted → `#565959`
- Bordures → `#D5D9D9`
- Mettre à jour tous les gradients, shadows et variables charter
- Bloc `.dark` : même palette (thème unique clair)

**2. `src/App.css`** — Classes utilitaires
- `.gradient-text`, `.animated-gradient`, `.elegant-button`, `.elegant-button-v2`, `.quora-gradient-button` : remplacer `#3B9EFF`/`#0052CC` par `#008296`/`#005F73`
- `.modern-nav` : fond clair `rgba(250,250,250,0.95)`, bordure `#D5D9D9`
- `.feature-card`, `.glass-card` : adapter pour fond clair (backgrounds blancs, bordures grises)

**3. `tailwind.config.ts`** — Couleurs et gradients
- `gradient-magazine-hero` : utiliser le teal au lieu du bleu

**4. `src/components/ebook/KdpAmazonResearch.tsx`** — Tab active color
- Remplacer `bg-[#3B9EFF]` par la classe `bg-primary`

**5. `src/pages/EbookPlannerPage.tsx`** — Couleurs hardcodées
- Remplacer les `#3B9EFF` et `#0052CC` dans les stats et le welcome banner par les variables CSS/classes Tailwind

**6. Migration SQL** — Policies restantes
- Changer les 8 policies `published_books`, `series_bibles`, `book_tracking_history`, `ebook_projects`, `ebook_project_versions` de `public` à `authenticated`
- Restreindre upload audiobooks par dossier utilisateur

---

### Résultat attendu

L'application passera d'un thème sombre bleu électrique agressif à un thème clair, reposant, inspiré d'Amazon/KDP : fond blanc cassé, accent teal professionnel, texte gris foncé lisible. Toutes les pages hériteront automatiquement via les variables CSS.

