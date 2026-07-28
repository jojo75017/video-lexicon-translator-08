## État des lieux — Pages V3 (aucune modification effectuée)

Voici l'inventaire complet des pages sous `/v3` et leur statut d'utilisation réel dans la navigation. **Rien n'est supprimé** — c'est un audit pour décider ensemble.

---

### 1. Pages actives et visibles dans la nav (à garder)

Liées depuis `V3Sidebar`, `V3Header`, `V3Footer`, `V3MainTabs` :

| Route | Fichier | Où c'est linké |
|---|---|---|
| `/v3` | `V3HomePage` | Header, Sidebar, Footer |
| `/v3/auth` | `V3AuthPage` | Header, Footer |
| `/v3/create` | `V3CreatePage` | Sidebar, Header, Footer |
| `/v3/create/illustre` | `V3KidsBookCreatePage` | Sidebar (badge Nouveau) |
| `/v3/library` | `V3LibraryPage` | Sidebar, Header, Footer |
| `/v3/mes-livres` | `V3BookManagerPage` | Sidebar, Footer |
| `/v3/hub` (+ `?tab=`) | `V3HubPage` | Sidebar (Brouillons, En attente) |
| `/v3/outils` | `V3ToolsIndexPage` | Sidebar, MainTabs |
| `/v3/compte` | `V3ComptePage` | Sidebar |
| `/v3/forfaits` | `V3ForfaitsPage` | Sidebar |
| `/v3/auteur` | `V3GuestAuthorPage` | Sidebar |
| `/v3/parametres` | `V3AuthorSettingsPage` | Sidebar, Footer |
| `/v3/gallery` | `V3GalleryPage` | Footer uniquement |

---

### 2. Pages routées mais absentes de toute nav (candidates à trier)

Aucun `Link`/`navigate` ne pointe dessus depuis la sidebar/header/footer :

| Route | Fichier | Statut probable | Reco |
|---|---|---|---|
| `/v3/book/:id` | `V3BookPage` | Détail livre — sûrement ouvert depuis Library/Gallery en dynamique | **Garder** (à vérifier usage dynamique) |
| `/v3/u/:slug` | `V3AuthorProfilePage` | Profil auteur public — SEO / partage | **Garder** (lien externe possible) |
| `/v3/livres/:type` | `V3SpecialBookPage` | Livres spéciaux — orphelin apparent | À **archiver** si plus au menu |
| `/v3/offres` | `V3OffresPage` | Ancienne page offres (avant Forfaits V3) | **Doublon** avec `/v3/forfaits` → à archiver |
| `/v3/offres/merci` | `V3OffresMerciPage` | Confirmation post-achat offres | Garder tant que `/v3/offres` existe, sinon archiver |
| `/v3/outils/sommaire-ultime` | `V3TocUltimatePage` | Outil accessible depuis `/v3/outils` | **Garder** (lien via ToolsIndex) |
| `/v3/outils/traduction` | `V3TranslatorPage` | Outil accessible depuis `/v3/outils` | **Garder** (lien via ToolsIndex) |

---

### 3. Pages V3 hors `v3public/` (routes séparées à revoir)

| Route | Fichier | Reco |
|---|---|---|
| `/v3-paiement` | `V3PaiementPage` | Legacy — vérifier si Stripe l'utilise encore |
| `/v3-offre` → redirect `/offres` | — | OK (redirect) |
| `/hub-v3` → redirect `/v3/hub` | — | OK (redirect) |
| `/tableau-de-bord` → redirect `/v3/hub` | — | OK (redirect) |
| `SalesPageV3Launch.tsx` | (pas trouvé de route active) | Vérifier si toujours routée |
| `V3CommandePage.tsx` | (pas trouvé de route active) | Vérifier |

---

### 4. Résumé propositions (à valider avant toute action)

**À archiver sans risque (aucun lien entrant + doublon fonctionnel) :**
- `V3OffresPage` + `V3OffresMerciPage` → remplacées par `/v3/forfaits`
- `V3SpecialBookPage` → plus dans le menu
- `V3PaiementPage` (si non utilisée par Stripe checkout)
- `SalesPageV3Launch`, `V3CommandePage` (à confirmer)

**À garder (utilisées en dynamique ou SEO) :**
- `V3BookPage` (`:id`), `V3AuthorProfilePage` (`:slug`), `V3GalleryPage`
- Toutes les pages du bloc 1

---

### Étapes à suivre (une fois en build mode, sur ton feu vert)

1. Vérifier que `V3BookPage` et `V3AuthorProfilePage` sont bien ouverts dynamiquement (grep sur les IDs/slug).
2. Vérifier si `V3PaiementPage`, `SalesPageV3Launch`, `V3CommandePage` sont référencées dans Stripe/emails.
3. Pour chaque page confirmée obsolète : **remplacer sa route par un `<Navigate>`** vers la remplaçante (au lieu de supprimer le fichier) — ainsi anciens liens/emails/SEO ne cassent pas.
4. Déplacer les fichiers archivés dans `src/pages/_archive/` (comme déjà fait pour V2) sans les supprimer.
5. Test Playwright sur toutes les routes de nav pour confirmer 0 régression.

---

### Question pour toi

Veux-tu que je :
- **(A)** archive uniquement le bloc "sans risque" (offres V3 + livres spéciaux) avec redirects,
- **(B)** fais d'abord une vérif complète des usages Stripe/emails avant de toucher `V3PaiementPage` etc.,
- **(C)** ou un audit encore plus profond (composants admin V3 orphelins aussi) ?