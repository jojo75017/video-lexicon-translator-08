# Refonte page /offres — Version Premium Conversion

## Diagnostic actuel

La page `/offres` (rendue par `src/pages/SalesPage.tsx`) utilise le style **"Joyful"** (couleurs pastel, blobs animés, ton enfantin "🌈", "mode chill", emojis partout). C'est sympa mais :

- Positionnement perçu = **outil ludique** au lieu de **machine à revenus**
- Hero = "Et si écrire ton livre devenait vraiment fun" → focus *expérience*, pas *résultat*
- Aucun bénéfice $/temps en hero, pas de preuve sociale forte au-dessus de la ligne de flottaison
- 13 sections empilées dont plusieurs redondantes (2 blocs garantie, 3 CTAs intermédiaires)
- Aucune section "Avant / Après", "Pourquoi les gens échouent", "Objections"
- Trop de texte compact, pas de mockups produit, pas de démo visuelle du workflow
- Palette pastel (`joy-cream`, `joy-peach`, `joy-mint`, `joy-bubblegum`) = perçue *cute* et non *premium*

## Nouveau positionnement

> **"Créez et monétisez vos eBooks rapidement grâce à l'IA"**
> 15 agents IA qui transforment une idée en livre publié sur Amazon KDP — et en revenus passifs — en quelques jours.

Ton : confiant, premium, orienté résultat. Plus de "fun/chill/joyeux".

## Nouvelle structure (15 sections, ordre conversion)

```text
1.  Top bar confiance (note ⭐, badges presse, "+200 auteurs")
2.  HERO premium
    ├─ H1 résultat : "Publiez votre premier eBook rentable en 7 jours grâce à 15 agents IA"
    ├─ Sous-titre émotionnel (transformation, pas features)
    ├─ Double CTA (primaire "Démarrer pour 67€ à vie" + secondaire "Voir la démo 2 min")
    ├─ Trust row sous CTA (Garantie 30j · Paiement unique · +200 auteurs · Note 4.9/5)
    └─ Visuel droite : mockup macOS du générateur en action (screenshot réel app)
3.  Logos / preuve sociale (Amazon KDP, presse, mentions)
4.  "Pourquoi 9 auteurs sur 10 échouent" — 4 douleurs (page blanche, temps, mise en page KDP, marketing)
5.  "La solution : 1 workflow, 15 agents IA" — bento grid des piliers (Écriture · Couverture · Audio · KDP · Marketing)
6.  AVANT / APRÈS — tableau comparatif visuel (méthode classique 6 mois vs EbookStudio 7 jours)
7.  Démo workflow en 4 étapes — visuels animés : Idée → Manuscrit → Couverture → Publié
8.  Mockups produit — galerie d'eBooks réellement créés (couvertures + titres) + capture KDP rentable
9.  Bénéfices clés (6 cards) — gain de temps, ROI, qualité pro, multi-langues, audiobook, support
10. Témoignages premium (3 verticales : carte + photo + résultat chiffré "+1200€/mois")
11. Calculateur ROI KDP (gardé : `KdpRoiCalculator`)
12. OFFRE unique 67€ à vie — card premium, ancres, comparaison vs 197€, urgence deadline
13. Garantie 30 jours (un seul bloc, signature visuelle)
14. Objections / FAQ conversion (8-10 Q ciblées achat : "Je n'ai pas d'idée", "Je n'écris pas bien", "Et si Amazon refuse ?", "Combien de temps réel ?", "Remboursement ?")
15. CTA final plein écran + sticky mobile
```

Suppressions : `JoyfulBanner`, `JoyfulPromise`, `AgentsShowcaseFun` (style fun), `JoyfulJourney`, `JoyfulLiveDemo`, `JoyfulFAQ`, `FinalCtaJoyful`, second bloc garantie, `EbookieAssistant` (déplacé en floating widget plutôt qu'en section), `HeroVideoTeaser` (intégré dans hero), `Guide10NichesBlock` (déplacé en exit-intent ou footer secondaire).

Conservations : `KdpRoiCalculator`, `ResultatConcretBlock` (refondu), `CoachingVipBanner` (optionnel, en bas), `CountdownDeadline` (intégré dans offre 67€).

## Direction design "Startup IA premium"

| Élément | Avant (Joyful) | Après (Premium) |
|---|---|---|
| Fond | `joy-cream` crème pastel | Blanc pur + sections sombres alternées (dark navy `#0B1220` pour contraste premium) |
| Accent | `joy-sun` jaune + `joy-peach` rose | Orange KDP `#FF6B1A` (déjà utilisé `OffresKdpRocket`) + vert succès `#10B981` |
| Typo | Système | **Inter** body + **Instrument Serif** ou **Space Grotesk** headlines (déjà dispo via design system) |
| Cards | Rondes 3xl + ombres molles + blobs flottants | `rounded-2xl`, ombres subtiles, **glassmorphism** + bordures fines `border-white/10` sur sections sombres |
| Animations | Wiggle, float bouncy | `framer-motion` discret : fade-up au scroll, parallax léger sur mockups, gradient mesh animé hero |
| Espacement | Sections `py-12/16` | `py-24/32`, plus d'air, max-width 1200px |
| Emojis | Omniprésents 🎉🌈 | Supprimés sauf 1-2 endroits clés (garantie 🛡️) |
| Ton | "tu", "fun", "chill" | "vous", direct, orienté résultat, vocabulaire entrepreneur |

Tous les tokens passent par `index.css` (HSL) — pas de couleurs en dur dans les composants.

## Composants à créer

Dossier `src/components/sales/premium/` :

- `PremiumTopBar.tsx` — bandeau confiance ultra-fin
- `PremiumHero.tsx` — split 60/40, mockup à droite, double CTA, trust row
- `LogosStrip.tsx` — bandeau logos N&B
- `WhyAuthorsFailSection.tsx` — 4 douleurs en grid
- `SolutionBentoSection.tsx` — bento grid des 5 piliers IA
- `BeforeAfterSection.tsx` — tableau comparatif animé
- `WorkflowDemoSection.tsx` — 4 étapes avec captures animées
- `EbookGallerySection.tsx` — masonry des couvertures créées
- `BenefitsGridSection.tsx` — 6 cards bénéfices
- `PremiumTestimonialsSection.tsx` — 3 témoignages verticaux résultats chiffrés
- `PremiumOfferCard.tsx` — l'offre 67€ refondue (réutilise logique `OffresKdpRocket`)
- `PremiumGuaranteeBlock.tsx` — un seul bloc signature
- `ConversionFAQ.tsx` — 10 Q orientées objections achat
- `PremiumFinalCTA.tsx` — section sombre full-bleed
- `PremiumStickyMobileCTA.tsx`

Réutilisés : `KdpRoiCalculator`, `CountdownDeadline`, `CoachingVipBanner`.

## Modifs techniques

- `src/pages/SalesPage.tsx` : réécrit pour orchestrer les nouveaux composants. Le header sticky est conservé (admin/subscriber banners gardés) mais restylé premium.
- `src/index.css` : ajout tokens premium (`--premium-ink`, `--premium-bg-dark`, `--premium-accent`, `--premium-success`, gradient mesh) **sans toucher au reste**.
- Aucune logique backend modifiée : `handlePlanClick`, navigation, tracking analytics, `purgeLegacyOffresCache` intacts.
- SEO `<Helmet>` : nouveau titre + meta description orientés "créer et monétiser eBooks IA".
- Responsive mobile : grilles `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, hero stack vertical sous `md`, sticky CTA bas conservé.

## Priorité d'implémentation (si besoin de phaser)

1. Hero premium + topbar + logos + offre 67€ refondue + sticky CTA → impact conversion immédiat
2. Why-fail + Solution bento + Before/After → narration psychologique
3. Workflow demo + galerie eBooks + témoignages → preuves visuelles
4. FAQ conversion + garantie + final CTA → closing
5. Suppression des composants Joyful inutilisés (ne pas supprimer les fichiers, juste retirer les imports — réversible)

## Hors scope

- Pas de changement sur `/paiement-manuel`, `/upsell`, dashboard, Cloud, edge functions
- Pas de modif des prix (67€ à vie maintenu, V3 à 197€ reste roadmap)
- Pas de nouveau backend, pas de nouvelle table

Validation visuelle au préalable : après le hero + l'offre, je te montre un screenshot de la preview avant de finir les autres sections, pour qu'on ajuste la direction si besoin.
