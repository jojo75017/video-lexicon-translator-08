# Améliorations Business Center + Code d'accès à l'écran

## 1. Alertes fiables (seuil de volume)
Aujourd'hui, l'alerte « Taux de rebond élevé (92 %) » s'affiche même avec 1 seul email de test → trompeur.

**Correctif** (`src/pages/BusinessCenterPage.tsx`) : n'afficher les diagnostics basés sur des taux que si le volume est significatif.
- Alertes rebond / ouverture / clic : seulement si `emailsSent >= 50`.
- En dessous du seuil, afficher un message neutre : *« 📊 Volume encore trop faible pour des statistiques fiables (X emails envoyés). Les alertes s'activeront à partir de 50 envois. »*
- Le taux de rebond affiché dans la grille KPI reste visible, mais sans déclencher d'alerte rouge tant que le seuil n'est pas atteint.

## 2. KPI essentiels en haut
Ajouter deux cartes mises en avant, juste sous la section « Aujourd'hui » :
- 💰 **Revenu généré aujourd'hui** : somme des `funnel_orders` payées avec `paid_at >= aujourd'hui` (nouveau calcul `todayRevenue`).
- 📈 **Taux Essai → Achat** : `paidSubscribers / (paidSubscribers + activeTrials + expired)` — déjà calculé (`conversionRate`), mais remonté en carte majeure et renommé pour être explicite.

Ces deux cartes seront plus grandes et colorées (emerald / amber) pour marquer leur importance.

## 3. Section « Aujourd'hui » plus vivante
La section existe déjà (essais, emails, ouverts, clics, ventes). Améliorations :
- Ajouter le **revenu du jour** dans la rangée.
- Ajouter une **ligne de synthèse dynamique** avec note étoilée selon la santé :
  - Bonne activité + au moins 1 vente → *« ⭐⭐⭐⭐⭐ Tunnel en bonne santé »*
  - Beaucoup d'essais mais peu d'ouvertures → conseil objet email
  - Beaucoup d'ouvertures mais peu de clics → conseil call-to-action
  - Aucune activité aujourd'hui → message neutre d'attente

## 4. Afficher le code d'accès à l'écran (option choisie)
Aujourd'hui le code `EBK-XXXXXX` n'est envoyé que par email. On l'affichera aussi immédiatement après l'inscription.

**Backend** (`supabase/functions/trial-signup/index.ts`) :
- Ajouter `access_code` et `trial_ends_at` dans la réponse JSON de succès.

**Frontend** (`src/pages/TrialSignupPage.tsx`) :
- Stocker le code renvoyé et l'afficher dans l'écran de confirmation, dans un encadré bien visible (même style que l'email : grand, monospace, couleur teal).
- Texte : *« Votre code d'accès (notez-le) »* + le code + bouton « Copier ».
- Conserver le message expliquant que l'email contient aussi le code + le bonus PDF + le lien de connexion.
- Garder le bouton « Me connecter maintenant » vers `/subscription`.

## Détails techniques
- Fichiers modifiés : `src/pages/BusinessCenterPage.tsx`, `src/pages/TrialSignupPage.tsx`, `supabase/functions/trial-signup/index.ts`.
- Aucun changement de schéma de base de données.
- La fonction edge sera redéployée après modification.
- Le code d'accès est déjà généré côté serveur (aucune donnée sensible supplémentaire exposée : le visiteur reçoit uniquement son propre code).
