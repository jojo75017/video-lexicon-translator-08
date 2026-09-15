# Ouvrir un livre doit charger CE livre, et rien d'autre

## Ce qui se passe aujourd'hui

Quand vous ouvrez « Noces de Vendetta » depuis Mes livres, la page ne remplace pas le travail précédent : elle
le **mélange**. Le titre devient bien « Noces de Vendetta », mais tout ce qui restait du récit de votre vie
(passages écrits, corrections, informations retenues, conversation du Génie, et même la nature « biographie »)
reste en place et s'affiche en dessous.

Deuxième conséquence : la page reste ouverte sur l'étape 1 (« J'écris ») calculée d'après l'ancien livre, donc
vous ne voyez ni le sommaire ni les titres de chapitres — alors que « Noces de Vendetta » contient bien
**40 chapitres avec leurs vrais titres** enregistrés (« L'Ombre du Sang », « La première fissure »…). Le
brouillon enregistré de ce livre est vide, ce qui ne devrait rien changer : les chapitres suffisent.

## Ce qui sera corrigé

1. **Ouverture propre.** Ouvrir un livre efface d'abord le brouillon affiché à l'écran, puis charge uniquement
   ce livre : titre, auteur, description, catégorie, ton, chapitres, sommaire. Plus aucun passage, aucune
   correction, aucune information et aucune conversation d'un autre livre ne peut apparaître.
2. **Sécurité avant de changer de livre.** Si un récit non enregistré est en cours pour un autre livre, un
   message le signale et propose de l'enregistrer avant de basculer, pour ne rien perdre.
3. **Sommaire visible tout de suite.** Un livre qui a des chapitres s'ouvre directement sur « Mon sommaire »
   (ou « Mon livre » s'il est déjà validé), avec la liste numérotée des 40 titres réels.
4. **Nature du projet respectée.** Un livre classique ouvert depuis Mes livres ne repasse plus en mode
   biographie à cause du projet précédent.
5. **Bandeau « Livre ouvert »** enrichi : titre, nombre de chapitres chargés, et l'étape où vous reprenez.

## Détails techniques

- `src/pages/v3public/V3CreatePage.tsx`, effet `projectId` : remplacer la fusion `{ ...prev, ...restoredBrief }`
  par une fiche reconstruite depuis zéro (`clearBookBrief()` puis écriture), en ne conservant `prev` que si
  `prev.projectId === data.id`. Champs recréés : `projectId`, `title`, `author`, `description`, `category`,
  `tone`, `chapters`, `outline`, `outlineValidated`, `mode` déduit de la page (`book` / `biography`).
  `sourceText`, `polished`, `pendingPolishIndex`, `factMemory`, `biographySteps` ne sont repris que du
  `draft_state` du même projet, sinon vides.
- Fil du Génie : `writeLocalThread(restored?.messages || [])` pour ne plus laisser la conversation de l'autre
  livre (aujourd'hui écrite seulement si `messages.length`).
- Étape : si `restored.activeStep` absent, calculer depuis les données du projet —
  `outlineValidated ? 3 : outline.length ? 2 : 1` — au lieu de garder l'état initial issu de l'ancien brief.
  Forcer aussi `setBriefKey` (déjà présent) pour remonter les panneaux sommaire.
- Garde-fou : avant d'écraser, si `prev.projectId && prev.projectId !== data.id` et que `prev.sourceText` est
  non vide sans `cloudSavedAt` récent, afficher un `toast` avec action « Enregistrer l'autre livre »
  (`saveBookDraftToCloud(prev)`) puis poursuivre le chargement.
- Aucun changement de base, de sécurité, de calculs KDP, de paiements ni de crédits ; aucun appel IA ajouté.

## Vérification

- Ouvrir la biographie, écrire un passage, puis ouvrir « Noces de Vendetta » : plus aucun passage de la
  biographie à l'écran, sommaire de 40 chapitres affiché avec les vrais titres.
- Rouvrir la biographie ensuite : son récit est retrouvé intact depuis son propre brouillon.
