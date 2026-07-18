
# Ebookstudio V3 — Refonte publique façon Pluméo + fix lancement + garanties clés & sidebar

Objectif : livrer une expérience publique complète sur `/v3` (header 2 lignes + 10 pages) inspirée de Pluméo, aux couleurs Ebookstudio (orange + noir + serif). Le Hub V3 admin (`/hub-v3`) reste intact avec **sa sidebar et son bouton clés API existants**. En parallèle, corriger le clic « Lancer » du Parcours V3 et sécuriser la propagation des **clés BYOK** dans le nouveau parcours.

---

## 1. Design system V3 public

Tokens dédiés (n'écrasent pas le thème KDP admin) :
- Titres : `Playfair Display` serif. Corps : `Inter`.
- Orange `#F97316`, noir `#0A0A0A`, blanc, gris `#F5F5F5`. Halos radiaux orange en fond de hero.
- Boutons : pill orange plein / contour noir fin. Chips arrondies (genres, tons).

Fichier : `src/styles/v3-public.css` importé uniquement dans le layout `/v3`.

---

## 2. Header global V3 (2 lignes, sticky, blanc translucide `bg-white/70 backdrop-blur`)

Composant `src/components/v3public/V3Header.tsx` monté sur toutes les pages `/v3/*`.

**Ligne 1** — Logo Ebookstudio V3 · nav centre (Accueil · Galerie · Auteur · Comment ça marche) · droite (Connexion / S'inscrire orange OU Ma bibliothèque / Déconnexion).

**Ligne 2** — Onglets « Livres spéciaux » à plat : Roman · Cuisine · Voyage · Coloriage · BD · Documentaire · Atlas · Encyclopédie · Agenda · Journal · Scolaire · Aquariophilie · Fiches oiseaux · Saga multi-tomes. Chaque onglet → `/v3/livres/:type`.

Mobile : ligne 1 = hamburger, ligne 2 = scroll horizontal.

---

## 3. Attention aux onglets latéraux (Hub admin)

**Rien ne change côté sidebar admin.** La `MagazineSidebar` / `SimpleSidebar` reste sur `/hub-v3` et les routes V2, avec ses sections 1️⃣ Préparer → ⚙️ Mon Compte (`modernSidebarSections.ts`). Le nouveau layout `/v3/*` n'utilise **pas** de sidebar : uniquement le header 2 lignes + contenu pleine largeur, pour rester fidèle au style Pluméo. Aucun changement des `WORKFLOW_AGENT_IDS`, `ESSENTIAL_TOOL_IDS`, `SIDEBAR_SUBSECTIONS`.

Le lien vers `/v3` sera simplement ajouté dans la sidebar admin (nouvelle entrée « Site public V3 ») pour permettre à l'admin d'y basculer.

---

## 4. Attention aux clés BYOK (fil rouge de tout le parcours public)

Le parcours public `/v3/create` doit fonctionner avec les **mêmes clés BYOK** que le Hub admin (Gemini / OpenAI / Claude / OpenRouter) via `getProvider()` + `getProviderKey()` (`src/services/aiWritingService.ts`, `useOpenAIConfig.ts`, `testAIProviderKey.ts`).

Règles appliquées partout :
1. Avant tout appel IA côté client, on lit `getProviderKey(getProvider())`. Si absent → **modale « Configurer votre clé IA »** intégrée à `/v3` (même composant que `ApiKeysFloatingButton`, reskiné orange/noir), avec sélecteur de provider + champ clé + bouton **Valider** (`testAIProviderKey`).
2. Bouton flottant « 🔑 Clé IA » visible dans le header V3 (à droite) sur toutes les pages `/v3/*`, avec pastille verte si clé valide / rouge sinon.
3. Toute edge function appelée depuis `/v3` reçoit la clé et le provider en **header explicite** (`x-user-api-key`, `x-user-provider`) — pas de dépendance à `localStorage` côté serveur.
4. La bascule V4/V3 payant reste inchangée (uniquement gate d'accès aux modules premium, pas de gate sur les clés).
5. Persistance : mêmes clés `localStorage` que l'admin (`openai_api_key`, `ai_provider`, `openrouter_api_key`, `claude_api_key`, `openai_model`) → **une seule saisie** partout.

---

## 5. Pages publiques `/v3/*` (10 pages)

Toutes sous `V3PublicLayout` (Header 2 lignes + Footer noir).

| Route | Composant | Contenu |
|---|---|---|
| `/v3` | `V3HomePage` | Hero orange serif, exemples idées, avatars + « 1 247 auteurs », section Auteur invité noir + carrousel couvertures, Top 10 grille, 3 étapes, 4 features, 12 chips genres, CTA final |
| `/v3/auth` | `V3AuthPage` | Halos orange, connexion/inscription, indicateur force mot de passe |
| `/v3/create` | `V3CreatePage` | Assistant 4 étapes (Idée → Style → Personnages → Titre & récap) + garde-fou clé IA |
| `/v3/book/:id` | `V3BookPage` | Loading plume pulsante ou lecture serif |
| `/v3/library` | `V3LibraryPage` | En cours / Terminés + bloc page auteur |
| `/v3/gallery` | `V3GalleryPage` | Recherche + filtres genre |
| `/v3/auteur` | `V3GuestAuthorPage` | Hero noir Mr Georges Boubet, catalogue |
| `/v3/u/:slug` | `V3AuthorProfilePage` | Page auteur publique dynamique |
| `/v3/mes-livres` | `V3BookManagerPage` | CRUD livres publiés |
| `/v3/parametres` | `V3AuthorSettingsPage` | Nom, slug, bio, avatar, lien Amazon, checkbox public |
| `/v3/livres/:type` | `V3SpecialBookPage` | Page-liste par type spécial → `/v3/create?type=xxx` |

Composants partagés : `BookCard`, `GenreChip`, `AuthorAvatar`, `FloatingBookDecor`, `PulsingFeather`, `LoadingSteps`, `V3ApiKeyButton` (reskin de `ApiKeysFloatingButton`).

---

## 6. Fix du bug « Lancer » sur `/hub-v3?tab=parcours`

Cause probable (à confirmer) : `BookCreationStudio.generate({ silent: true })` en auto-run avale les erreurs → spinner infini quand la clé BYOK manque ou que le titre est vide.

Correctifs :
1. Retirer `silent: true` de l'auto-run → toasts visibles.
2. Garde-fou clé : si `getProviderKey(getProvider())` absent → toast + `dispatchEvent('open-api-keys')` + `setStep(1)`.
3. Garde-fou titre : si `!title.trim()` → toast + `setStep(1)`.
4. Timeout de sécurité 90 s → auto-reset + toast.
5. Bouton **Annuler** visible pendant `loading`.
6. `ApiKeysFloatingButton` écoute l'event `open-api-keys` pour ouvrir le dialog.
7. Vérifier que la clé + provider sont bien envoyés en header à l'edge function ciblée par l'agent lancé.

Fichiers : `BookCreationStudio.tsx`, `ApiKeysFloatingButton.tsx`, `EditionWorkflow.tsx`, edge function concernée.

---

## 7. Routing

- Nouvelles routes `/v3/*` ajoutées dans `src/App.tsx`.
- `/hub-v3` inchangé.
- Pages protégées `/v3` (library, mes-livres, parametres) → redirect `/v3/auth` si pas de session.

---

## 8. Ordre d'exécution

1. Design system V3 + `V3PublicLayout` + Header 2 lignes + Footer + `V3ApiKeyButton`.
2. `V3HomePage` (le plus visible).
3. Fix « Lancer » Parcours V3 (bloquant produit).
4. `V3CreatePage` branché sur la vraie génération corrigée avec garde-fou clé.
5. `V3AuthPage`, `V3BookPage`, `V3LibraryPage`.
6. `V3GalleryPage`, `V3GuestAuthorPage`, `V3AuthorProfilePage`.
7. `V3BookManagerPage`, `V3AuthorSettingsPage`, `V3SpecialBookPage`.

## Détails techniques

- Zéro donnée fictive : Top 10 et Galerie lisent `ebook_projects` publics ; état vide sinon.
- Auteur invité : `src/data/authorBooks.ts` (statique éditable).
- Slug auteur : `[a-z0-9-]`, auto-généré, unique par `profiles.slug`.
- Migration DB séparée si `profiles` n'a pas `slug/bio/avatar_url/amazon_link/public_page` (à vérifier avant d'écrire quoi que ce soit).
- Aucune modification des edge functions existantes hors de celles appelées par le fix « Lancer » et le nouveau `V3CreatePage`.
- La sidebar admin gagne une entrée « Site public V3 » pointant `/v3`, rien de plus.
