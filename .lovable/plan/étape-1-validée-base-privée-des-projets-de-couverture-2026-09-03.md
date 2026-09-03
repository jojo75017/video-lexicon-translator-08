# Étape 1 validée — Base privée des projets de couverture

Périmètre strict : base de données + bucket privé + petite couche d'accès. **Aucune interface, aucun éditeur, aucun ancien module, aucune fonction IA, aucun crédit Lovable.**

## 1. Table `cover_projects`

Colonnes créées :

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `user_id` | uuid NOT NULL | propriétaire, défaut `auth.uid()` |
| `project_name` | text NOT NULL | nom du projet |
| `book_title` | text | titre du livre |
| `cover_type` | text NOT NULL | `ebook` / `paperback` / `hardcover` |
| `format_id` | text NOT NULL | ex. `ebook-kindle`, `broche-wrap`, `hardcover` |
| `page_count` | integer | nullable (imprimé uniquement) |
| `fabric_json` | jsonb | calques complets de l'éditeur |
| `illustration_path` | text | chemin bucket, jamais une URL |
| `thumbnail_path` | text | chemin bucket, jamais une URL |
| `schema_version` | integer NOT NULL défaut 1 | migration future |
| `created_at` / `updated_at` | timestamptz | `updated_at` via trigger existant `update_updated_at_column` |

Index sur `(user_id, updated_at desc)`. **Aucun champ ISBN.**

## 2. RLS stricte

- `ENABLE ROW LEVEL SECURITY`
- 4 politiques `to authenticated` : SELECT / INSERT / UPDATE / DELETE, toutes avec `user_id = auth.uid()` (et `WITH CHECK` identique sur INSERT/UPDATE).
- GRANT `SELECT, INSERT, UPDATE, DELETE` à `authenticated`, `ALL` à `service_role`. **Aucun GRANT à `anon`** → un visiteur non connecté ne voit rien, même avec l'`id` exact.

## 3. Bucket privé `covers`

- Créé via l'outil storage en `public: false`, limite de taille par fichier 25 Mo.
- 4 politiques sur `storage.objects` limitées à `bucket_id = 'covers'` et `(storage.foldername(name))[1] = auth.uid()::text`.
- `ebook-images` n'est **pas** touché (ni ses politiques, ni son caractère public) : les images des ebooks existants continuent de fonctionner.

## 4. Couche d'accès `src/lib/coverProjects.ts` (nouveau fichier isolé)

- CRUD sur `cover_projects` (liste, lecture, création, mise à jour, suppression).
- Upload illustration/miniature dans `covers/<user_id>/<project_id>/…`.
- **Refus propre si aucune session** : erreur explicite, jamais de repli sur l'email.
- Ne renvoie que des **URL signées temporaires** (durée courte, ~1 h) générées à la demande ; aucune URL permanente n'est enregistrée.
- Ce fichier n'est importé par aucun composant à cette étape.

## 5. Tests réalisés (avant de vous rendre la main)

Sessions réelles côté navigateur avec deux comptes distincts + un visiteur :
- A crée / lit / modifie / supprime ses projets → OK attendu.
- B fait de même sur les siens → OK attendu.
- A tente de lire, modifier et supprimer un projet de B par son `id` → 0 ligne / refus.
- B tente d'ouvrir un fichier du dossier de A → refus storage.
- Visiteur non connecté : `select` sur `cover_projects` → 0 ligne, upload refusé.
- URL signée expirée : ouverture refusée après expiration.

## 6. Livrables de fin d'étape

Schéma exact, politiques RLS, politiques du bucket, résultats de tests détaillés, liste des fichiers modifiés (un seul nouveau fichier + une migration), confirmation qu'aucun ancien module n'est touché, confirmation qu'aucun crédit Lovable n'est consommé (aucun appel IA dans cette étape).

Puis arrêt, et j'attends votre validation avant de brancher l'interface.

---

## Rappel — étapes suivantes (non lancées)

2. Onglet « Couverture Pro » unique (Kindle / Broché / Relié) + liste de projets.
3. Fond IA sans texte, BYOK uniquement, jamais de crédits Lovable.
4. Calques texte pro (titre / sous-titre / auteur).
5. Géométrie imprimée exacte + import du gabarit officiel KDP.
6. Exports JPEG (Kindle) et PDF print-ready (broché / relié), sans ISBN.
7. Nettoyage des anciens modules en doublon.
