# Plan : Reconnecter ebookstudio.fr et réactiver les emails

## Objectif
Remettre `ebookstudio.fr` (et `www.ebookstudio.fr`) comme domaine principal du projet, garder `notify.ebookstudio.fr` comme domaine d’envoi email, et s’assurer que les liens des emails de la campagne 47 € pointent vers la bonne URL.

## État actuel confirmé
- Projet publié, visibilité publique.
- Seul `notify.ebookstudio.fr` est connecté comme domaine personnalisé.
- Aucun domaine d’envoi d’email n’est configuré.
- `ebookstudio.fr` / `www.ebookstudio.fr` ne sont pas rattachés au projet.

## Étapes du plan

### 1. Reconnecter le domaine principal
Aller dans **Project Settings → Project → Domains** et cliquer **Connect Domain** pour ajouter :
- `ebookstudio.fr` (root)
- `www.ebookstudio.fr` (www)

Pointer les enregistrements A sur `185.158.133.1` chez Hostinger (ou le registrar DNS), puis attendre la propagation DNS (jusqu’à 72 h, souvent 5–30 min).

### 2. Choisir le domaine d’envoi email
Utiliser **notify.ebookstudio.fr** déjà connecté comme domaine d’envoi email, car il est opérationnel et évite les conflits avec les emails existants d’ebookstudio.fr.

Dans le panneau email, cliquer sur **Configurer le domaine** et sélectionner `notify.ebookstudio.fr`.

### 3. Définir le domaine principal par défaut
Une fois `ebookstudio.fr` vérifié, le définir comme **Primary Domain** dans les paramètres de domaine pour que les liens internes utilisent `https://ebookstudio.fr/commander` plutôt que l’URL Lovable par défaut.

### 4. Mettre à jour les liens de la campagne
Vérifier et corriger les constantes de lien dans le code :
- `src/data/externalLinks.ts`
- `src/data/canonicalEmailCampaign.ts`
- `src/components/admin/AbKitPanel.tsx`
- `supabase/functions/send-sales-email/index.ts`
- `supabase/functions/send-welcome-email/index.ts`
- `supabase/functions/track-email-click/index.ts`

Tous doivent pointer vers `https://ebookstudio.fr/commander` (ou `www.ebookstudio.fr/commander`) et non vers l’ancienne URL `notify.ebookstudio.fr` ni vers `www.ebookstudio.fr` si celui-ci n’est pas encore propagé.

### 5. Déployer et tester
- Déployer les edge functions modifiées.
- Envoyer un email de test à `boubetgeorges@gmail.com`.
- Vérifier que le lien de paiement ouvre bien `ebookstudio.fr/commander` et que Stripe répond correctement.

## Critères de succès
- `ebookstudio.fr` et `www.ebookstudio.fr` apparaissent dans **Settings → Domains** avec le statut **Active**.
- Un email de test arrive dans la boîte de réception avec le lien `https://ebookstudio.fr/commander`.
- Le paiement s’affiche sans erreur sur le domaine principal.

## Risques / points d’attention
- Durant la propagation DNS, il est normal que le site soit temporairement injoignable sur le domaine en cours de configuration.
- Si Hostinger ne permet pas les enregistrements NS (déjà rencontré), on restera sur `notify.ebookstudio.fr` pour l’email et on pointera `ebookstudio.fr` uniquement pour le site web.
- On ne renverra pas la campagne 47 € tant que le lien n’a pas été testé avec succès, pour éviter les nouvelles pertes de conversion.
