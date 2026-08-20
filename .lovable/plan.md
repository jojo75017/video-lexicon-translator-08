# Rendre le lancement visible + derniers rappels « 47 € jusqu'au 31 août »

## Où en est le lancement aujourd'hui

Tout est déjà construit, mais sans aucun lien visible depuis vos pages :

- `/essai` — chapitre 1 gratuit
- `/essai/inscription` — création de compte + forfait avec 1er mois offert
- `/v3/attente` — salon des membres fondateurs (compte à rebours, 3 cadeaux)
- `/admin/lancement` — tableau de bord admin (essais, conversions, interrupteurs)

C'est pour cela que vous « ne voyez rien » : les pages existent, rien ne les met en avant.

## 1. Mettre le lancement en évidence

- Bandeau haut de page (accueil V3 + page `/commander`) : « 47 € à vie jusqu'au 31 août — V3 le 1er octobre, 1er mois offert » avec 2 boutons : *Essayer le chapitre 1 gratuit* et *Réserver ma place*.
- Barre latérale V3 : nouvelle section « Lancement » → Essai gratuit, Salon d'attente, Données du lancement (admin uniquement).
- Accès rapide admin : bouton « Lancement V3 » dans la barre d'accès rapide admin, en plus de l'onglet existant.
- Compte à rebours réel jusqu'au 31 août 23h59 (Paris) sur le bandeau et sur `/commander`.

## 2. Derniers emails de rappel (fin du 47 € le 31 août)

Nous sommes le 20 août : la séquence actuelle de 5 jours est calée sur un départ immédiat, elle finirait trop tôt. Nouveau calendrier de rappels, un envoi par étape déclenché depuis l'admin :

| Envoi | Date | Angle |
|---|---|---|
| R1 | 21 août | « Plus que 10 jours : 47 € à vie, puis abonnement » |
| R2 | 24 août | La vidéo démo (votre vidéo) : un livre complet du sommaire au fichier Amazon |
| R3 | 27 août | Objections : « je n'écris pas bien », « c'est trop technique » |
| R4 | 29 août | Ce qui change le 1er octobre + inscription dès le 1er septembre, 1er mois offert |
| R5 | 31 août | Dernier jour, ce soir minuit |

- Chaque email : bloc vidéo (vignette cliquable vers votre lien YouTube), un seul bouton vers `/commander`, mention « inscriptions V3 dès le 1er septembre, 1er mois offert ».
- Segment : les 627 contacts actifs, désinscrits exclus, suivi envoyé / en attente / erreur par destinataire comme aujourd'hui.
- Une relance des ouvreurs non-cliqueurs le 30 août, en un clic.

## 3. Emplacement de la vidéo

Un champ « Lien de la vidéo de lancement » dans `/admin/lancement` : dès que vous collez l'URL, elle apparaît dans les emails, sur `/essai`, `/commander` et `/v3/attente`. Si le champ est vide, le bloc vidéo est simplement masqué.

## Détails techniques

- Bandeau : nouveau composant `V3LaunchBanner.tsx` intégré dans l'accueil V3 et `V3CommanderPage.tsx`, dates lues depuis `launch_settings`.
- Liens barre latérale : ajout dans le composant de navigation V3 existant, entrée admin conditionnée par `useIsAdmin`.
- Emails : réécriture des 5 étapes de `supabase/functions/send-sales-email/index.ts` (templates `rappel-47-1` à `-5`) et mise à jour de `src/data/canonicalEmailCampaign.ts` + `CampaignSequencePanel.tsx` avec les nouvelles dates.
- Vidéo : colonne `launch_video_url` dans `launch_settings` (migration + GRANT), lecture via `useLaunchSettings.ts`.
