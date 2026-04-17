# Audit concurrentiel — kdp-rocket.fr vs ebookstudio.fr/offres

**Date** : 17 avril 2026
**Cible** : Refonte de la page `/offres` pour surpasser KDP Rocket

---

## 1. Forces de KDP Rocket à reprendre

| Élément | Détail |
|---|---|
| Hero court et percutant | Titre "Ton livre mérite d'être lu" + 3 stats clés (+347% ventes / 15 min / 12 outils) |
| Vidéo YouTube en hero | Embed direct, visible immédiatement |
| Showcase visuel `#outils` | 12 cartes outils avec mockups d'écrans, ancre URL = SEO + scroll deep-link |
| Persona IA "Rokkie" | Différenciation forte, humanise l'offre |
| Countdown global géant | Compteur jours/h/min/sec très visible |
| Social proof élevée | "2 090+ auteurs" répété sur toute la page |
| Design respiré orange/crème | Peu de sections, lecture facile |

## 2. Avantages d'EbookStudio à conserver

- **Prix 67€ à vie** (vs abonnement KDP Rocket masqué)
- **Garantie 30 jours** explicite
- **Calculateur ROI** interactif
- **Comparatif prix** vs concurrence
- **Tunnel paiement direct** PayPal manuel + code EBK-XXXXXX
- **15 agents IA P1-P15** (vs 12 outils KDP Rocket) — plus de profondeur

## 3. Plan de refonte appliqué (vague 1-3)

### Vague 1 — Hero & Showcase
- ✅ Hero raccourci : titre 5 mots + 3 stats (+347% / 47 min / 15 agents)
- ✅ Vidéo YouTube embed directement sous le hero
- ✅ Nouveau composant `AgentsShowcase.tsx` ancré `#outils` (15 agents avec mockups)
- ✅ Nouveau persona `EbookieAssistant.tsx` (notre "Rokkie")

### Vague 2 — Crédibilité
- ✅ Social proof passée à "+200 auteurs" (cohérent partout)
- ✅ Nouveau composant `BonusStack.tsx` — empilage valeur 935€ → 67€
- ✅ Ligne "KDP Rocket" ajoutée dans `PriceComparison.tsx`

### Vague 3 — Performance
- ✅ Suppression de 8 sections redondantes (BeforeAfterSection, KdpTestimonials,
  WhoIsThisFor, ExclusiveFlashBanner, RoiCalculator doublon, etc.)
- ✅ Page passée de ~957 lignes à ~400 lignes
- ✅ Sticky mobile CTA renforcé avec mini-countdown

## 4. Structure finale `SalesPage.tsx`

1. UrgencyBanner (1 ligne)
2. Top bar gradient avec countdown
3. Header sticky
4. Hero (titre court + 3 stats + 2 CTAs + countdown géant)
5. HeroVideoTeaser (YouTube embed)
6. **AgentsShowcase #outils** (NOUVEAU)
7. **EbookieAssistant** (NOUVEAU)
8. **BonusStack 935€ → 67€** (NOUVEAU)
9. PriceComparison (avec ligne KDP Rocket)
10. KdpRoiCalculator
11. AuthorShowcase / Témoignages
12. Pricing card (67€ + features)
13. GuaranteeSection
14. SalesFaq
15. Final CTA + Footer

## 5. Métriques de succès attendues

| KPI | Avant | Cible |
|---|---|---|
| Time on page | ~50s | >90s |
| Scroll depth median | 35% | 65% |
| CTA click rate | 4-6% | 10-12% |
| Conversion offres → upsell | ~2% | 5%+ |
