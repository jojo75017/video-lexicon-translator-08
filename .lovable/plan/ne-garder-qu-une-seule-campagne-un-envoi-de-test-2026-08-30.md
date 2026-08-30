# Ne garder qu'une seule campagne + un envoi de test

Les anciens fichiers de données ont été supprimés, mais les **panneaux d'envoi** sont toujours affichés dans Gestion Prospects : c'est pour ça que vous les voyez encore après publication. On nettoie l'écran, pas seulement les données.

## Ce qui reste aujourd'hui

| Endroit | Rôle actuel | Décision |
|---|---|---|
| `/admin/sequence-email` | La campagne unique (5 emails) | **Garder** — devient `/admin/campagnes` |
| Panneau « Séquence » (Gestion Prospects) | Envoie une séquence | Supprimer |
| Panneau « Tunnel email » | Autre séquence d'envoi | Supprimer |
| Panneau « Campagne de clôture » | Encore une autre campagne | Supprimer |
| 4 fichiers HTML dans `public/email-templates/` | Anciens modèles GetResponse / Systeme.io | Supprimer |
| Fonction `send-closing-47` | Envoi de l'ancienne clôture | Retirée de l'interface |

## Ce qui reste après nettoyage

```text
   UNE SEULE PAGE        →   /admin/campagnes
   5 emails à copier         (campagneUnique.ts)
        │            │
        │            └── bouton « Envoyer un email de test »
        ▼
   Systeme.io — tag PROSPECT-EBS
        │
        ▼
   /cadeau (5 niches) → inscription → /bonus → /commander 47 €
```

Gestion Prospects ne garde que : la liste des contacts, la santé d'envoi, les statistiques (ouvertures / clics). Aucun bouton d'envoi de campagne — juste un encart « La campagne se copie dans Campagnes ».

## L'envoi de test

Sur `/admin/campagnes`, chaque email obtient un bouton **« M'envoyer ce test »** :

- un champ email (pré-rempli avec votre adresse admin) ;
- l'email part réellement, en HTML, exactement comme le prospect le recevra ;
- objet préfixé `[TEST]` pour ne pas polluer les statistiques ;
- réservé aux admins, jamais visible côté abonné.

## Détails techniques

- Fichiers supprimés : `src/components/admin/CampaignSequencePanel.tsx`, `EmailFunnelPanel.tsx`, `ClosingCampaignPanel.tsx`, et les 4 `public/email-templates/*.html`.
- `src/pages/ProspectManagerPage.tsx` : retrait des imports et des 3 rendus, suppression de l'appel direct `send-sales-email` (~ligne 290), remplacement par un lien vers `/admin/campagnes`.
- `CampaignPerformanceDashboard.tsx` et `TemplatePerformancePanel.tsx` restent en lecture seule (déjà branchés sur `campagneUnique.ts`).
- `src/App.tsx` : route `/admin/campagnes` → `AdminSequenceEmailPage`, ancienne route `/admin/sequence-email` redirigée.
- Nouvelle edge function `send-campaign-test` : vérifie le rôle admin via `supabase.auth.getUser()`, rend le HTML depuis `campagneUnique.ts` et envoie via Resend (`noreply@ebookstudio.fr`). Aucun log de campagne, aucun ajout à `sales_prospects`.
- Backend inchangé pour `send-sales-email` / `send-closing-47` : plus appelés depuis l'UI, donc sans risque.
