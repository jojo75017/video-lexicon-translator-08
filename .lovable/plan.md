# Aplatir le header global (`EspaceHeader.tsx`) en style magazine éditorial

## Le vrai coupable

Les "gros boutons" que tu vois ne sont **pas** dans le hero (déjà refait), mais dans `src/components/layout/EspaceHeader.tsx` — la barre sticky en haut qui apparaît sur `/ebook-planner` et plusieurs autres pages.

Cette barre empile actuellement :
1. Bandeau promo "Lancement public" (dark)
2. Ligne breadcrumb + AI badge + Pack KDP orange + Cockpit admin + Settings + Logout
3. **Rangée de boutons piliers ronds colorés** : Plan (bleu) / Écrire (vert) / Habiller (violet) / Publier (orange) / Vendre (rose) + Audit ASIN (teal) + Communauté NEW (rose) + 600 Niches NEW (gradient) + Tous les outils
4. Sous-barre contextuelle (Tableau de bord IA / Plan du livre / Personnages / Modèles / …)

## Refonte (toujours direction "Magazine archive dense")

Toutes les **fonctions** sont préservées — seul le style change. Pas d'éléments retirés.

### 1. Bandeau promo (banner top)
Reste mais aplati : fond `#232F3E` uni (plus de gradient), pastille orange remplacée par un point, lien "Voir mes cadeaux" devient un bouton outline blanc petit caps `VOIR MES CADEAUX →`.

### 2. Ligne breadcrumb + actions
- Breadcrumb `Mon espace › Titre projet` reste en Instrument Serif italique pour le titre.
- AI badge, Pack KDP, Cockpit admin, Settings, Logout : tous repassés en **boutons outline hairline** (`border border-[#e8ecf1]`, fond transparent, texte uppercase 10px tracking large, hover → border teal `#008296`, hover bg `#e8ecf1/30`). Plus de gradients orange brillants ni d'icônes colorées géantes.

### 3. Rangée piliers (PLANNER_TABS) — le gros chantier visuel
Remplacer les pastilles colorées arrondies `rounded-2xl` + `hover:scale-[1.05]` par une **rangée d'onglets éditoriaux** :
- Style : `px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] border-b-2 border-transparent text-[#232F3E]/60 hover:text-[#008296]`
- Actif : `text-[#232F3E] border-b-2 border-[#FF9E2D]` (souligné orange éditorial, comme un sommaire de magazine)
- Emojis : conservés mais réduits à `text-sm opacity-60` (ou retirés si on veut full austère — je propose de les garder en monochrome subtil)
- Plus de fond coloré par pilier, plus de ring, plus de scale au hover

### 4. Boutons spéciaux (Audit ASIN / Communauté / 600 Niches)
Mêmes onglets que les piliers, mais avec un mini-tag NEW teal flat (`bg-[#008296] text-white text-[8px] uppercase tracking-widest px-1 ml-2`) au lieu des badges gradient animés rose/orange.

### 5. "Tous les outils"
Devient un simple lien texte uppercase à droite : `+ TOUS LES OUTILS` en `text-[#008296]`, ouvre toujours le même popover.

### 6. Sous-barre contextuelle (PLANNER_SUBTABS)
Aplatit : fond `#fafbfc`, séparateur hairline, onglets en `text-xs uppercase tracking-wider`, actif = texte teal + petit point teal devant. Plus de cartes blanches arrondies à scale.

## Tokens / polices
Déjà ajoutés (Instrument Serif + Work Sans chargés dans `index.html` au tour précédent). Le header utilisera `font-family: 'Work Sans'` partout, et Instrument Serif italique uniquement pour le titre du projet dans le breadcrumb.

## Hors scope
- Pas de suppression de boutons.
- Pas de refonte de la sidebar `SimpleSidebar` / `MagazineSidebar`.
- Pas de touche au workflow IA, aux 15 agents, aux exports.
- La page `/espace` (dashboard) garde son look actuel — ce header s'affiche aussi dessus, donc le changement se propagera proprement (cohérent avec le hero éditorial du planner).

## Vérification
Après l'édition : screenshot du preview sur `/ebook-planner` pour confirmer que la barre est devenue calme et éditoriale.

---

**Tu approuves cette refonte du header global ?**
