

## État du projet pour le lancement du 1er mai

### ✅ Ce qui est prêt
- **Sidebar opérationnelle** : header projet + recherche + favoris + accordéon exclusif + badges "EN COURS" + indicateurs (style proche KDP Rocket)
- **Guide des outils** (`/guide-outils`) : parcours en 5 étapes, FAQ "Je veux faire X", piliers expliqués → un abonné ne se noie plus
- **Workflow IA P1-P15** stable (BYOK Gemini, timeout 90s, fallbacks)
- **Studio Couverture, Export KDP, Audio Express** fonctionnels
- **Admin** : accès subscribers réparé (`/admin-direct` → `/admin`), cache 5min, raccourci sidebar "👥 Mes Abonnés"
- **Backend** : RLS strictes, 67€/an, essai 7 jours manuel, BYOK Gemini

### ⚠️ Ce qui reste à boucler avant le 1er mai

#### Priorité 1 — Bloquants (à faire absolument)
1. **Test parcours abonné de bout en bout** : inscription → email bienvenue → connexion → /ebook-planner → générer un ebook → exporter
2. **Onglets KDP Description + Mots-clés** : vérifier que les corrections d'erreur (BYOK + messages clairs) fonctionnent vraiment côté abonné (pas juste admin)
3. **Bandeau d'accueil "Première visite ?"** sur `/ebook-planner` qui redirige vers `/guide-outils` (prévu mais pas implémenté)

#### Priorité 2 — Confort lancement
4. **Page d'accueil après login** : aujourd'hui un nouvel abonné arrive directement dans le générateur → forcer la 1ère visite sur `/guide-outils`
5. **Tooltip "Astuce du jour"** sur les outils essentiels pour guider sans intrusion
6. **Compteur de quota visible en permanence** dans la sidebar (déjà présent, vérifier visibilité)
7. **Email de bienvenue** : ajouter lien direct vers `/guide-outils`

#### Priorité 3 — Marketing lancement (idées)
8. **Page "/lancement-1-mai"** : compte à rebours + offre early-bird (-20% premiers 50 abonnés ?)
9. **Vidéo de démo 2 min** intégrée sur `/offres` montrant le workflow P1→P15
10. **FAQ visible** sur la page de vente (objections classiques : "C'est de l'IA ?", "Combien de temps ?", "Garantie ?")

### 🎯 Sidebar "façon KDP Rocket" — état actuel vs cible

| Critère KDP Rocket | État actuel | Action |
|---|---|---|
| Recherche live tools | ✅ Fait | — |
| Favoris épinglés | ✅ Fait | — |
| Hiérarchie essentiel/avancé | ✅ Fait | — |
| Accordéon exclusif | ✅ Fait | — |
| Indicateurs d'état | ✅ Fait (badge "EN COURS") | — |
| **Tutoriel intégré au survol** | ❌ Manquant | À ajouter (tooltip explicatif sur chaque outil) |
| **Onboarding guidé 1ère visite** | ⚠️ Page existe mais pas forcée | Forcer redirect 1er login |

### Plan d'action recommandé (3 chantiers ciblés, ~2h de dev)

**Chantier A — Onboarding forcé**
- `EbookPlannerPage.tsx` : si premier login (flag `localStorage`), bandeau jaune "👋 Bienvenue ! Découvre le guide en 2 min →" cliquable
- Email de bienvenue : ajouter CTA "Voir le guide des outils"

**Chantier B — Tooltips KDP Rocket**
- `ModernSidebar.tsx` : ajouter `TooltipContent` avec description courte (1 phrase) sur chaque outil
- Ex : survol "P4 · Alia — Rédaction" → "Génère le contenu complet des chapitres avec ton style éditorial"

**Chantier C — Test bout-en-bout + correction bugs détectés**
- Créer un abonné test avec un email réel
- Parcourir : login → guide → planner → workflow → export
- Lister les blocages restants → corriger

### Ce que je NE recommande PAS pour le 1er mai
- Pas d'ajout de nouvelles fonctionnalités (gel des features)
- Pas de refonte design (charte KDP figée)
- Pas de migration DB (on garde le schéma actuel)

### Verdict
Le projet est **techniquement à 85%** prêt. Les 15% restants = onboarding + tests. Si tu valides les 3 chantiers (A, B, C) je peux les enchaîner pour que tu sois prêt le 1er mai sans surprise.

