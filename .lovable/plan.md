# Masterclass EbookStudio Pro V2 — Page publique + accès cockpit

Page publique `/masterclass` de type Netflix/Masterclass (Dark Mode), accessible à tous. Formation de 5h en 5 modules vidéo YouTube. **Module 1 gratuit (public), Modules 2-5 débloqués après saisie email** → génère des inscrits. Accès visible (non caché) depuis le cockpit et le dashboard.

## Vidéos & CTA

| Module | Titre | YouTube ID | Accès |
|--------|-------|-----------|-------|
| 1 | Fondations & Vision | `NF7H9wUyi9o` | 🟢 Public |
| 2 | Génération de Contenu | `4h_ex9Amdus` | 🔒 Email |
| 3 | Design & Mise en Page | `jV-40dkxQvw` | 🔒 Email |
| 4 | Métadonnées & SEO Amazon KDP | `gtJPR_w3r7c` | 🔒 Email |
| 5 | Automatisation & Stratégie Marketing | `k91fCwp2XZc` | 🔒 Email |

CTA final → `https://ebookstudio.fr/offres`

## Mécanique email gate

- Module 1 lisible librement, sans inscription.
- Au clic sur un module verrouillé (non inscrit) : le lecteur est remplacé par un **écran de déblocage** (titre + champ email + bouton « Débloquer les 4 modules »).
- Soumission → edge function existante `funnel-capture-lead` avec source `masterclass` (mêmes UTM / ref code / tracking) → déverrouillage immédiat des 5 modules.
- État mémorisé en `localStorage` (`masterclass-unlocked`) → plus de mur ensuite.
- Le lead remonte automatiquement dans le CRM / onglet Inscrits (segment `masterclass`).

## Structure de la page

```text
┌──────────────────────────────────────────────────────┐
│  SIDEBAR 25%          │   ZONE CONTENU 75%             │
│  Logo EbookStudio     │   ┌──────────────────────┐    │
│  Progression          │   │ Lecteur YouTube 16:9 │    │
│  ▓▓░░░░ 0/5 - 0%      │   │  OU écran déblocage   │    │
│  🟢 Module 1          │   └──────────────────────┘    │
│  🔒 Module 2          │   [Notes][Ressources][FAQ]    │
│  🔒 Module 3          │   contenu onglet actif         │
│  🔒 Module 4          │   ┌──────────────────────┐    │
│  🔒 Module 5          │   │ 🔥 Offre Spéciale CTA │    │
└──────────────────────────────────────────────────────┘
```

## Comportement

- **Lecteur** : iframe YouTube embed (`/embed/<id>`), 16:9, change selon module.
- **Sidebar** : logo, barre de progression animée (`x/5 - %`), liste des 5 modules avec état (gratuit / verrouillé / terminé / en cours).
- **Onglets** : *Notes du Module*, *Ressources & Outils* (liens Cover Studio, KDP Keywords…), *FAQ* (accordéon).
- **Carte CTA persistante** : bouton dégradé orange→rouge (pulsation) → `/offres`.
- **Pop-up de fin** : à la complétion du Module 5 — confettis, offre flash + compte à rebours 15 min, bouton vers `/offres`.
- **Progression** : `localStorage` (`masterclass-progress`).

## Accès visible (cockpit + dashboard)

- **Cockpit** (`AdminCockpitPage`) : nouvelle entrée `🎓 Masterclass` (caption « Formation 5h publique ») dans le groupe acquisition/marketing → `path: '/masterclass'`.
- **Dashboard principal** (`DashboardPage`) : nouvelle carte d'action rapide `🎓 Masterclass` (« Formation 5h + capture email ») → `navigate('/masterclass')`.

## Responsive

- Mobile : sidebar en `Sheet` shadcn, lecteur + onglets pleine largeur, CTA empilé.

## Détails techniques

- `src/pages/MasterclassPage.tsx` + composants `src/components/masterclass/` (`MasterclassSidebar`, `MasterclassPlayer`, `MasterclassUnlockGate`, `MasterclassTabs`, `MasterclassOfferPopup`).
- Données dans `src/data/masterclassModules.ts` (id, titre, durée, youtubeId, isFree, résumé, ressources[], faq[]).
- Route `/masterclass` ajoutée dans `App.tsx` en lazy import, **hors `SubscriberGate`** (public).
- Réutilisation de `funnel-capture-lead` + `captureTracking` + `utmTracking` + `useReferralTracking` (aucun backend, aucune migration).
- Couleurs via tokens du thème (Dark Mode, accent teal/orange KDP) — aucune couleur codée en dur.
- SEO : `<title>` < 60 car., meta description, H1 unique.

## Hors périmètre

- Pas de modification des pages formation existantes.
- Pas de changement base de données, paiement ou webinaire live.