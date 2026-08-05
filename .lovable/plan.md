# Réparer le lien de paiement des emails (page « Setting up… »)

## Ce qui se passe réellement

Ce n'est pas Stripe qui est cassé. Le lien de vos emails pointe vers
`https://www.ebookstudio.fr/commander`, mais **ce domaine n'est plus rattaché au projet**.

Domaines actuellement connectés au projet (vérifié) :
- `https://notify.ebookstudio.fr` ← seul domaine personnalisé actif
- `https://video-lexicon-translator-08.lovable.app` ← URL publiée

`www.ebookstudio.fr` n'y figure plus : c'est pour ça que le navigateur affiche
« Setting up www.ebookstudio.fr. This may take a few minutes. » au lieu de la page de
commande. Le tunnel Stripe lui-même n'est jamais atteint.

## Correction en deux temps

### 1. Débloquer les acheteurs tout de suite (côté code)

Faire pointer tous les liens de commande des emails vers une URL qui répond
aujourd'hui, `https://notify.ebookstudio.fr/commander`, dans :

- `src/data/externalLinks.ts`
- `src/data/canonicalEmailCampaign.ts`
- `supabase/functions/send-sales-email/index.ts`
- `supabase/functions/send-welcome-email/index.ts`
- `supabase/functions/track-email-click/index.ts`
- `src/components/admin/AbKitPanel.tsx`

Puis redéployer les fonctions concernées. Aucun envoi de campagne dans cette étape.

Pour éviter que ça se reproduise, l'URL de commande sera lue depuis une seule
constante partagée au lieu d'être répétée dans chaque fichier.

### 2. Remettre `www.ebookstudio.fr` en ligne (côté vous)

Dans Lovable : **Settings → Domains → Connect domain**, ajouter `www.ebookstudio.fr`
(et `ebookstudio.fr` en redirection), puis appliquer chez Hostinger les enregistrements
DNS que Lovable affiche. Une fois le domaine vérifié (vert), on rebasculera les liens
sur `www.ebookstudio.fr` si vous le souhaitez.

## Ce que je ne touche pas

- Le code de paiement Stripe (`create-promo-checkout`, `v3-pack-checkout`) : inchangé.
- Le prix 47 € et le contenu des emails : inchangés.
- Aucun envoi de masse déclenché.
