

## Audit final — ce qui bloque encore

Apres verification complete du code, de la securite et de la base de donnees, voici les problemes restants classes par priorite.

---

### CRITIQUE — Securite (3 problemes)

| # | Probleme | Impact |
|---|----------|--------|
| 1 | **Subscribers INSERT ouvert a tous** | La policy `Service role can insert subscriptions` est sur le role `public` avec `WITH CHECK (true)`. N'importe qui peut s'auto-inscrire en tant qu'abonne premium via l'API. Faille d'elevation de privileges. |
| 2 | **Donnees sensibles en Realtime** | Les tables `subscribers` et `payment_confirmations` sont publiees en Realtime sans protection. Tout utilisateur authentifie peut ecouter les changements et voir les emails, codes d'acces et donnees de paiement des autres. |
| 3 | **Fonction `has_role(text, app_role)` cassee** | L'overload email de `has_role` cherche une colonne `email` qui n'existe pas dans `user_roles`. Si invoquee, elle crashera. Risque de faille si utilisee dans une future policy. |

### MAJEUR — Securite residuelle (3 problemes)

| # | Probleme | Impact |
|---|----------|--------|
| 4 | **Email admin en dur dans `AdminDirectPage.tsx`** | `ADMIN_EMAIL = 'boubetgeorges@gmail.com'` est encore visible dans le code. De plus, ce fichier remet `sessionStorage.setItem('is_admin', 'true')` — exactement la faille corrigee dans App.tsx mais toujours presente ici. |
| 5 | **Policy INSERT `payment_confirmations` ouverte** | `Anyone can submit payment confirmation` avec `WITH CHECK (true)` sur role `public`. Un attaquant peut injecter de faux paiements. |
| 6 | **Policy INSERT `forum_notifications` ouverte** | `Service can create notifications` avec `WITH CHECK (true)` sur `authenticated`. Un utilisateur peut spammer les notifications de n'importe qui. |

### MOYEN — Nettoyage code (2 problemes)

| # | Probleme | Impact |
|---|----------|--------|
| 7 | **~50 routes encore actives** | Beaucoup de pages marketing/SEO/vente encore routees alors que la commercialisation est suspendue. Augmente le bundle et la surface d'attaque. |
| 8 | **Bucket `audiobooks` sans policy UPDATE** | Les fichiers audio ne peuvent pas etre mis a jour par leurs proprietaires. |

---

### Plan de correction

**Etape 1 — Securite critique (migration SQL)**
- Changer la policy INSERT de `subscribers` pour `service_role` uniquement
- Retirer `subscribers` et `payment_confirmations` de la publication Realtime
- Supprimer l'overload cassee `has_role(text, app_role)`
- Restreindre INSERT `payment_confirmations` aux utilisateurs authentifies avec `WITH CHECK (auth.uid() IS NOT NULL)`
- Restreindre INSERT `forum_notifications` avec `WITH CHECK (auth.uid() = user_id)`

**Etape 2 — AdminDirectPage.tsx**
- Supprimer l'email admin en dur
- Supprimer les `sessionStorage.setItem('is_admin', 'true')` — utiliser uniquement la verification serveur comme dans App.tsx

**Etape 3 — Storage**
- Ajouter une policy UPDATE sur le bucket `audiobooks` pour les proprietaires

**Etape 4 — Nettoyage optionnel des routes**
- Commenter ou supprimer les routes de vente/marketing si vous confirmez la suspension

---

### Sections techniques

Fichiers modifies :
- 1 migration SQL (policies RLS + Realtime + fonction)
- `src/pages/AdminDirectPage.tsx` (suppression email hardcode + sessionStorage)
- Pas besoin de toucher a `App.tsx` (deja corrige)

