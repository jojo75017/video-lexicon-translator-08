# Clôture des bêta-testeurs + email + script vidéo « Octobre »

## Contexte (vérifié en base)
- Les **bêta-testeurs = 7 abonnés** dont l'email correspond à un `beta_promo_codes.status = 'used'` (`subscribers` : `status='active'`, `plan_type='lifetime'`, `license_type='commercial'`).
- L'accès est autorisé uniquement si `subscribers.status` vaut `active` ou `trialing` (voir `subscriber-auth`). Passer le statut à `expired` coupe donc proprement l'accès sans supprimer le compte.
- Offre actuelle = **67€ à vie** (V2). La **V3 à 197€ / 347€ arrive en octobre** (ne pas mentionner 197€ comme prix actuel).

## Objectif
Un **bouton admin** (page Codes Bêta) qui, en un clic :
1. coupe l'accès de **tous** les bêta-testeurs ;
2. leur envoie un **email** de clôture (remerciement + info : offre toujours à 67€ maintenant, V3 en octobre) ;
Et en parallèle, préparer un **grand script écrit** pour ta vidéo « ce qui arrive en octobre ».

## Changements

### 1. Nouvelle edge function `revoke-beta-access`
`supabase/functions/revoke-beta-access/index.ts` (service role, `verify_jwt=false` par défaut) :
- Récupère les emails distincts depuis `beta_promo_codes` où `status='used'` (via `used_by_email`).
- Pour chaque email trouvé dans `subscribers` : `UPDATE subscribers SET status='expired', updated_at=now()` (couper l'accès à **tous**, sans exclusion).
- Envoie à chacun l'email de clôture via Resend (`from: EbookStudio <noreply@ebookstudio.fr>`) — sujet et contenu ci-dessous.
- Journalise chaque envoi dans `email_send_log` (`template_name='beta-closure'`, `status` sent/error).
- Renvoie `{ revoked, sent, errors, results }`.
- Idempotent : ne traite que les statuts encore `active`/`trialing` pour éviter double envoi si recliqué.

**Contenu de l'email de clôture** (HTML, charte teal #008296 / accent #FF9E2D) :
- Remerciement chaleureux pour la participation bêta.
- Annonce que la **phase bêta est terminée** et que l'accès gratuit prend fin.
- Info clé : **EbookStudio est toujours disponible à 67€ à vie aujourd'hui** ; en **octobre**, la nouvelle version (Publication Assistée Pro, 197€ / 347€) sortira à un tarif plus élevé — c'est donc le bon moment pour rester à 67€.
- CTA vers la page d'offre (67€).
- Signé Georges.

### 2. Bouton admin dans `src/pages/admin/AdminBetaCodesPage.tsx`
- Ajouter une carte « Zone de clôture bêta » avec un bouton **« Couper l'accès + envoyer l'email de clôture »**.
- Dialog de confirmation (action irréversible, X bêta-testeurs concernés).
- À la confirmation : `supabase.functions.invoke('revoke-beta-access')`, toast avec `revoked` / `sent`, puis `fetchCodes()`.
- État de chargement dédié (`revoking`).

### 3. `supabase/config.toml`
- Ajouter le bloc de la fonction `revoke-beta-access` si nécessaire (déploiement auto).

### 4. Grand script vidéo « Octobre »
Nouveau fichier `SCRIPT_VIDEO_OCTOBRE_V3.md` à la racine (comme les autres scripts existants) :
- Script long et structuré, prêt à lire face caméra : accroche, contexte (fin de la bêta, remerciements), ce qui arrive en octobre (V3 Publication Assistée Pro, paliers 197€ / 347€, principales nouveautés issues de `roadmapV3.ts`), pourquoi le prix actuel reste à 67€ aujourd'hui, appel à l'action / urgence douce.
- Ton aligné sur la persona Georges Boubet (fondateur).

## Vérification
- `revoke-beta-access` déployée ; test à blanc : confirmer qu'après clic, les 7 abonnés passent en `status='expired'` et que `email_send_log` contient les lignes `beta-closure`.
- `npx tsgo --noEmit` sans erreur.
- Contrôle visuel du bouton + dialog dans l'admin.

## Hors périmètre
- Pas de suppression de comptes (statut `expired` seulement, réversible).
- Pas de changement de prix ni de tunnel V3.
- Pas de refonte du système de codes bêta.
