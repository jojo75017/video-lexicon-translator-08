# Communauté EbookStudio V3 — Forum pré-rempli

## État actuel (vérifié)

- Backend forum **déjà en place** : tables `forum_categories` (10 rubriques), `forum_posts` (11), `forum_replies` (3), `forum_likes`, `forum_notifications` — RLS + triggers de comptage OK.
- Hook `useForum.ts` prêt (posts, replies, likes, notifications, realtime).
- Composant `CommunityKdpHub.tsx` prêt (lanceur depuis le hub V3).
- **Problème** : la route `/communaute` dans `src/App.tsx` ligne 357 redirige vers `/offres` → la communauté n'est **pas accessible** aujourd'hui.
- Seulement 11 posts existants → contenu insuffisant pour donner l'impression d'une communauté active.

## Objectif

Livrer une communauté visible et vivante dès l'ouverture, avec **220+ questions déjà posées** (et une majorité déjà répondues) couvrant l'ensemble des modules V3, façon forum officiel Amazon KDP.

## Plan

### 1. Réactiver la route `/communaute`
- Remplacer la redirection par une vraie page `V3CommunautePage.tsx` (liste des rubriques + fil des dernières discussions + bouton "Nouvelle discussion").
- Route `/communaute/:slug` pour la rubrique, `/communaute/post/:id` pour le fil.
- Lecture publique (SEO, `robots` OK), écriture réservée aux abonnés connectés (garde via `SubscriberGate` existant sur les actions).

### 2. Ajuster les rubriques (compléter les 10 existantes si besoin)
Rubriques cibles alignées sur les modules V3 :
1. Créer un livre (Assistant V3, sommaire, personnages, import)
2. Écrire (Planner 22 agents, Parcours 30 agents, BookPerfect, Ebookbot)
3. Couvertures & visuels (Cover Studio KDP, Cover Studio Pro V3, illustrations)
4. Livres illustrés & enfants (3-7 ans, histoires du soir)
5. Livres spéciaux (Cuisine, Voyage, Atlas, Documentaire, Univers multi-volumes, BD)
6. Publier sur Amazon KDP (Audit Pilot, catégories, mots-clés, ISBN, conformité)
7. Vendre & marketing (AMS Keywords, Espion Concurrents, tunnels, emails, affiliation)
8. Traductions & international (10 langues, KDP Étranger)
9. Compte, forfaits & paiements (Débutant/Studio/Éditeur, PayPal, upsells 17 €)
10. Clés API & tokens (Gemini BYOK, OpenRouter, quotas)

### 3. Générer 220+ questions + réponses de référence

Répartition indicative (≈ 20-25 par rubrique) :

```text
Rubrique                              Posts   Réponses épinglées
Créer un livre                          25          25
Écrire                                  25          25
Couvertures & visuels                   22          22
Livres illustrés enfants                20          20
Livres spéciaux                         22          22
Publier KDP                             25          25
Vendre & marketing                      22          22
Traductions                             18          18
Compte, forfaits, paiements             22          22
Clés API & tokens                       20          20
TOTAL                                   221         221
```

- Chaque post = **une vraie question d'abonné** (formulation naturelle, tags pertinents).
- Chaque post reçoit **au moins une réponse "solution"** signée `Équipe EbookStudio`, épinglée (`is_pinned = true` sur la question type FAQ).
- ~30 % des posts reçoivent une **2ᵉ réponse** d'un "membre" pour l'aspect communautaire.
- Auteurs : compte système `equipe@ebookstudio.fr` + une dizaine de pseudos d'abonnés fictifs cohérents (aucun vrai email).
- Dates étalées sur les 4 derniers mois (pas toutes le même jour).
- Compteurs `likes_count` / `replies_count` cohérents.

### 4. Intégration UI

- Lien **Communauté** visible dans `V3Sidebar` (haut) + item dans le mega-menu header (rubrique "Vendre" ou nouvelle entrée dédiée).
- Sur le hub V3, `CommunityKdpHub.tsx` pointe déjà vers `/communaute` — rien à changer.
- Page rubrique : solutions épinglées en tête, puis discussions par activité récente.
- Recherche simple (input + filtre client-side sur titre/tags) — pas de full-text serveur pour cette itération.

### 5. Écriture réservée aux abonnés

- Boutons "Nouvelle discussion" / "Répondre" masqués si non-connecté → CTA vers `/auth`.
- Utilisateur connecté non-abonné : message doux "Réservé aux abonnés Débutant / Studio / Éditeur" + lien `/v3/forfaits`.
- Admins : accès édition/épinglage/suppression (gate via `has_role`).

### 6. SEO

- `<title>` et meta description par rubrique et par post.
- URLs propres `/communaute/publier-kdp/pourquoi-mon-livre-est-il-bloque`.
- JSON-LD `QAPage` sur chaque post (Question + acceptedAnswer).
- Sitemap : ajout d'un `sitemap-communaute.xml` généré à partir des posts publics.

## Détails techniques

- Seed en une seule migration `insert` (données, pas de schéma) : ~220 INSERT dans `forum_posts` + ~300 dans `forum_replies`, avec `user_id` = uuid système fixe (ex. `00000000-0000-0000-0000-00000000c0de`).
- Pas de nouveau schéma requis — RLS actuel autorise déjà `select` public sur `forum_posts`/`forum_replies` (à vérifier au moment du seed ; sinon ajuster policy en même migration).
- Nouveaux fichiers :
  - `src/pages/v3public/V3CommunautePage.tsx` (index rubriques + derniers posts)
  - `src/pages/v3public/V3CommunauteCategoryPage.tsx`
  - `src/pages/v3public/V3CommunautePostPage.tsx`
  - `src/data/forumSeed.ts` (source des Q/R, utilisé par le script de seed)
  - `supabase/migrations/xxxx_forum_seed.sql` (INSERT bulk)
- Routes à ajouter dans `App.tsx` (remplace la redirection actuelle).
- Composant `ForumPostCard`, `ForumReplyItem`, `PinnedSolutionBadge`.
- Realtime déjà géré par `useForumPosts` / `useForumReplies`.

## Livrables

1. Route `/communaute` fonctionnelle (index + rubrique + post).
2. 220+ questions et 300+ réponses seedées, réparties sur toutes les rubriques V3.
3. Lien sidebar + header.
4. Écriture protégée par auth + statut abonné.
5. SEO (meta + JSON-LD QAPage) et sitemap communauté.

## Hors périmètre (à faire plus tard)

- Notifications email des réponses (déjà en table `forum_notifications`, il reste juste l'envoi Brevo/Resend).
- Modération avancée (signalement, banissement).
- Recherche full-text serveur (`tsvector`).
- Badges de réputation membres.
