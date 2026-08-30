# Ne garder qu'une seule campagne

Les anciens fichiers de données ont bien été supprimés, mais il reste **trois panneaux d'envoi** dans Gestion Prospects et **quatre anciens modèles d'email** dans le site. C'est ce qui donne l'impression que rien n'a été viré.

## Ce qui reste aujourd'hui

| Endroit | Rôle actuel | Décision |
|---|---|---|
| `/admin/sequence-email` | La campagne unique (5 emails) | **Garder** — devient `/admin/campagnes` |
| Panneau « Séquence » (Gestion Prospects) | Envoie une séquence via `send-sales-email` | Supprimer |
| Panneau « Tunnel email » | Autre séquence d'envoi | Supprimer |
| Panneau « Campagne de clôture » | Encore une autre campagne | Supprimer |
| 4 fichiers HTML dans `public/email-templates/` | Anciens emails GetResponse / Systeme.io | Supprimer |

## Ce qui reste après nettoyage

```text
   UNE SEULE PAGE        →   /admin/campagnes
   5 emails à copier         (campagneUnique.ts)
          │
          ▼
   Systeme.io — tag PROSPECT-EBS
          │
          ▼
   /cadeau (5 niches) → inscription → /bonus → /commander 47 €
```

Gestion Prospects garde uniquement : la liste des contacts, la santé d'envoi, et les statistiques (ouvertures / clics). Plus aucun bouton d'envoi de campagne : un seul encart « La campagne se copie dans Campagnes » qui renvoie vers la page unique.

## Détails techniques

- Fichiers supprimés : `src/components/admin/CampaignSequencePanel.tsx`, `EmailFunnelPanel.tsx`, `ClosingCampaignPanel.tsx`, et `public/email-templates/*.html` (4 fichiers).
- `src/pages/ProspectManagerPage.tsx` : retrait des imports et des 3 rendus, retrait de l'appel direct `send-sales-email` (ligne ~290), remplacement par un lien vers `/admin/campagnes`.
- `CampaignPerformanceDashboard.tsx` et `TemplatePerformancePanel.tsx` restent (lecture seule) et lisent déjà `campagneUnique.ts`.
- `src/App.tsx` : route `/admin/campagnes` vers `AdminSequenceEmailPage`, ancienne route `/admin/sequence-email` redirigée pour ne pas casser les liens.
- Edge function `send-sales-email` conservée mais plus appelée depuis l'UI (aucune suppression backend, sans risque). `generate-launch-email-campaign` et `relance-panier-abandonne` ne sont pas des campagnes prospects : laissés en place.
