# Plan — 3 correctifs Ebookstudio Pro V2

## 1. Réparer le bouton "Biographie Auteur" (Outils KDP)

**Fichier** : `src/components/ebook/EbookKdpTools.tsx`

Problème : `handleGenerateAuthorBio` (ligne 132) ne valide rien et n'affiche aucun toast. Si `authorName` est vide (cas fréquent quand l'utilisateur arrive directement sur l'onglet), le prompt se génère avec "l'auteur" générique mais aucune confirmation visuelle → l'utilisateur croit que ça ne marche pas. De plus aucune gestion d'erreur.

Correctifs :
- Ajouter validation `if (!authorName) { toast.error('Renseigne le nom de l'auteur dans la fiche projet'); return; }`
- Wrapper dans `try/catch` avec `toast.success('Biographie générée !')` et `toast.error` sur échec
- Pré-remplir `authorName`/`genre` depuis le projet courant si la prop n'est pas passée (lecture `localStorage.ebook_current_project` comme le fait déjà `KdpPackButton` dans `EspaceHeader`)

## 2. Renommer "EbookStudio" → "Ebookstudio Pro V2" partout dans l'UI

Inventaire : ~401 occurrences dans `src/`. Pour éviter de casser variables, classes CSS, noms de fichiers ou IDs techniques, on cible **uniquement les chaînes affichées** (JSX, titres, descriptions, contenus marketing).

Méthode :
- Mise à jour de la source unique : `src/hooks/useBrandTitle.ts` → `BRAND_SUFFIX = 'Ebookstudio Pro V2'` (affecte tous les `<title>` du site)
- Script `sed` ciblé sur les fichiers de contenu visible :
  - `src/pages/**/*.tsx` (textes JSX, headings, hero)
  - `src/components/**/*.tsx` (titres de cards, labels)
  - `src/data/*.ts` (templates emails, articles blog, modules formation)
  - `index.html` (balise `<title>` par défaut)
- Patterns remplacés : `EbookStudio V2`, `EbookStudio Pro`, `EbookStudio` (dans cet ordre, le plus spécifique d'abord) → `Ebookstudio Pro V2`. Variante `ebookstudio` (minuscule) **non** touchée (domaines, slugs, IDs).
- **Exclusions** : `src/integrations/`, `src/lib/utils.ts`, fichiers `.test.ts`, identifiants comme `EbookStudioPro` accolés (camelCase de noms de composants)
- Vérification post-rename : `rg "EbookStudio[^P]"` doit renvoyer 0 (hors composants).

## 3. Titre flashy centré dans le header Ebook Planner

**Fichier** : `src/components/layout/EspaceHeader.tsx` (lignes 307-340)

Le header actuel : `[Mon espace › 📖 Projet]  ............ [Token | Pack KDP | Cockpit | ⚙ | ↪]`

Ajout d'un bloc central absolument positionné (pour rester vraiment centré indépendamment des éléments de gauche/droite) :

```
<div class="absolute left-1/2 -translate-x-1/2 pointer-events-none">
  <span class="px-4 py-1 rounded-full font-extrabold text-sm tracking-wide
               bg-gradient-to-r from-[#008296] via-[#00A8B5] to-[#FF9E2D]
               text-white shadow-md shadow-[#FF9E2D]/30
               animate-[pulse_2.4s_ease-in-out_infinite]">
    ✨ Ebookstudio Pro V2
  </span>
</div>
```

- Pulse Tailwind déjà disponible (animation native)
- Dégradé teal → orange (palette KDP, validée)
- `pointer-events-none` pour ne pas bloquer le clic sur les boutons en dessous si chevauchement
- Caché en `< md` (responsive) pour ne pas écraser le titre du projet sur mobile : ajouter `hidden md:inline-flex`

## Détails techniques

- Pas de modification du backend ni des edge functions
- Pas de migration DB
- `useBrandTitle` est déjà importé globalement → un seul changement de constante suffit pour tous les onglets navigateur
- Le script de rename sera exécuté via `code--exec` avec `sed -i` après dry-run `rg` de contrôle
- Aucun composant/route renommé (uniquement texte visible)

## Hors scope

- Pas de refonte du dashboard
- Pas de changement de logique des autres outils KDP (Description, Mots-clés, etc.) — seul le Bio est défaillant d'après l'utilisateur
