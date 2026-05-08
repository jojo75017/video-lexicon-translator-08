

# Refonte page /offres — version "joviale"

Objectif : transformer la page actuelle (style KDP Rocket orange/sérieux) en une page **chaleureuse, joyeuse, motivante**, qui donne envie de cliquer sans pression agressive — tout en gardant la conversion (67€ à vie, garantie 30j, paiement manuel).

## 1. Nouvelle direction artistique

| Élément | Avant | Après (jovial) |
|---|---|---|
| Palette | Orange agressif #FF6B1A + crème | **Pêche #FFB088 + Jaune soleil #FFD86B + Menthe #7FE0B5 + Lavande #C9B8FF** sur fond crème doux #FFF8F0 |
| Ton | "URGENT", "FLASH", compte à rebours | "Bienvenue 👋", "On va kiffer ensemble", emojis chaleureux |
| Typo | Bold extreme uppercase | Titres ronds (Fraunces / Quicksand), corps friendly |
| Formes | Rectangles tranchants | Blobs SVG, coins arrondis 2xl/3xl, stickers tilt |
| Illustrations | Mockups outils | Petits doodles, badges colorés, confettis, mascotte "Ebookie" plus présente |
| Animations | Statique + countdown | Float, wiggle, scale au hover, confettis au clic CTA |

## 2. Nouvelle structure de la page

```text
┌─ JoyfulBanner          ← bandeau pastel rotatif "Hey 👋 +200 auteurs déjà à bord !"
├─ Header sticky simplifié
├─ HeroJoyful            ← mascotte Ebookie qui salue + titre rond + 2 CTAs colorés
│                          "Et si écrire ton livre devenait... fun ? 🎉"
├─ TrustStrip            ← logos / "Ils en parlent" doux
├─ HeroVideoTeaser       ← (gardée, encadrée d'un blob pêche)
├─ JoyfulPromise         ← 3 cartes pastel "Tu vas adorer parce que..."
│                          (Gain de temps 🕒 / Zéro stress 😌 / Fierté 🏆)
├─ AgentsShowcaseFun     ← refresh visuel de AgentsShowcase : cards arrondies, couleurs pastel, sticker "fun" sur chaque agent
├─ EbookieAssistant      ← (gardée, mise en avant)
├─ JoyfulJourney         ← timeline illustrée "Jour 1 → Jour 7" avec doodles
├─ BonusStack            ← refresh : style "cadeaux empilés" colorés (rubans, étoiles)
├─ PriceComparisonSoft   ← refresh : tableau plus doux, ligne EbookStudio surlignée jaune
├─ KdpRoiCalculator      ← (gardé)
├─ TestimonialsCarousel  ← cartes pastel rotatives + avatars colorés
├─ OffreUnique67         ← refonte de OffresKdpRocket :
│                          carte centrale pêche/jaune, ruban "Notre cadeau",
│                          score → smiley 😍 99/100, CTA gros bouton vert menthe
├─ GuaranteeSectionFun   ← médaille dessinée + texte rassurant "Pas de stress"
├─ JoyfulFAQ             ← accordéons colorés (1 couleur par question)
├─ FinalCTA              ← scène finale : mascotte + confettis + bouton géant
└─ Footer
```

Sections **supprimées** (réduction du bruit) : `UrgencyBanner` agressif, `ExclusiveFlashBanner`, `StickyCtaBar` clignotant, `KdpRocketParityTable` (remplacé par PriceComparisonSoft).

Sections **gardées telles quelles** : `HeroVideoTeaser`, `EbookieAssistant`, `KdpRoiCalculator`, `GuaranteeSection` (léger restyle).

## 3. Nouveaux composants à créer

1. `src/components/sales/joyful/JoyfulBanner.tsx` — bandeau pastel doux (remplace UrgencyBanner)
2. `src/components/sales/joyful/HeroJoyful.tsx` — hero rond avec mascotte
3. `src/components/sales/joyful/JoyfulPromise.tsx` — 3 cartes promesses
4. `src/components/sales/joyful/JoyfulJourney.tsx` — timeline 7 jours
5. `src/components/sales/joyful/OffreUnique67.tsx` — carte offre joyeuse
6. `src/components/sales/joyful/JoyfulFAQ.tsx` — FAQ colorée
7. `src/components/sales/joyful/FinalCtaJoyful.tsx` — CTA final festif
8. `src/components/sales/joyful/Blob.tsx` — utilitaire SVG blob décoratif
9. `src/components/sales/joyful/AgentsShowcaseFun.tsx` — refresh d'AgentsShowcase

Composants **modifiés** : `BonusStack.tsx`, `PriceComparison.tsx` (variante "soft"), `EbookieAssistant.tsx` (ajustements), `SalesPage.tsx` (réassemblage complet).

## 4. Tokens design ajoutés

Dans `src/index.css` (variables HSL) et `tailwind.config.ts` :
```
--joy-peach:    25 100% 78%
--joy-sun:      45 100% 71%
--joy-mint:    155 60% 70%
--joy-lavender:255 60% 86%
--joy-cream:    35 100% 97%
--joy-ink:     220 25% 22%
```
+ shadows douces `--shadow-joy: 0 12px 32px -12px hsl(var(--joy-peach) / 0.45)`
+ keyframes `wiggle`, `float-slow`, `pop-in`.

## 5. Ce qui ne change PAS

- Tunnel paiement (`/paiement-manuel?offer=founder-lifetime&price=67`) inchangé
- Prix 67€, garantie 30j, deadline 15 sept (mais formulée joyeusement)
- Routes, SEO meta (titres adaptés), tracking
- Aucune modif backend, aucune migration DB

## 6. Livraison & validation

- Implémenté en une seule passe, rebranchement dans `SalesPage.tsx`
- QA visuelle via preview après build
- Mobile-first : toutes les sections testées 375px / 1024px / 1519px

---

**Questions optionnelles avant implémentation** (sinon je pars sur les choix ci-dessus) :
- Garder la mascotte "Ebookie" actuelle ou en générer une nouvelle illustrée plus joyeuse ?
- Ok pour supprimer le countdown global (remplacé par une simple mention "jusqu'au 15 sept") ?
