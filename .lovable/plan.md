# Plan : Finaliser ebookstudio.fr et réactiver les emails

## Objectif
S'assurer que `ebookstudio.fr` est bien le domaine principal du projet, configurer le domaine d'envoi email, et mettre à jour les liens de la campagne 47 € pour qu'ils pointent vers la bonne URL.

## État actuel confirmé
- Projet publié, visibilité publique.
- `ebookstudio.fr` est maintenant connecté ✅
- `notify.ebookstudio.fr` est aussi connecté ✅
- Aucun domaine d'envoi d'email n'est encore configuré ❌

## Étapes du plan

### 1. Définir ebookstudio.fr comme domaine principal (à vérifier)
Aller dans **Project Settings → Project → Domains** et vérifier que `ebookstudio.fr` est bien marqué comme **Primary Domain**. Si ce n'est pas le cas, le définir comme primaire. Cela garantit que les liens internes et la canonical URL utilisent `https://ebookstudio.fr`.

### 2. Configurer le domaine d'envoi email
Utiliser **notify.ebookstudio.fr** comme domaine d'envoi email, car il est déjà connecté et isolé du domaine principal. Cela évite les conflits DNS avec les emails existants d'ebookstudio.fr.

Dans le panneau email, cliquer sur **Configurer le domaine** et sélectionner `notify.ebookstudio.fr`.

### 3. Mettre à jour les liens de la campagne 47 €
Vérifier et corriger les constantes de lien dans le code pour qu'elles pointent vers `https://ebookstudio.fr/commander` :
- `src/data/externalLinks.ts`
- `src/data/canonicalEmailCampaign.ts`
- `src/components/admin/AbKitPanel.tsx`
- `supabase/functions/send-sales-email/index.ts`
- `supabase/functions/send-welcome-email/index.ts`
- `supabase/functions/track-email-click/index.ts`

### 4. Déployer et tester
- Déployer les edge functions modifiées.
- Envoyer un email de test à `boubetgeorges@gmail.com`.
- Vérifier que le lien dans l'email ouvre `https://ebookstudio.fr/commander` et que le paiement Stripe s'affiche correctement.

## Critères de succès
- `ebookstudio.fr` est défini comme Primary Domain dans Settings → Domains.
- Un domaine d'envoi email est configuré (`notify.ebookstudio.fr`).
- Un email de test arrive avec le lien `https://ebookstudio.fr/commander`.
- Le paiement s'affiche sans erreur sur le domaine principal.

## Risques / points d'attention
- Durant la propagation DNS, il est normal que le site soit temporairement injoignable sur le domaine en cours de configuration.
- On ne renverra pas la campagne 47 € tant que le lien n'a pas été testé avec succès, pour éviter les nouvelles pertes de conversion.
- Si `ebookstudio.fr` est utilisé comme domaine d'envoi email, il ne doit pas avoir de conflits DNS avec `notify.ebookstudio.fr` ; d'où le choix de `notify` pour l'email.
