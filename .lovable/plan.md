

## Refonte visuelle "Black Pack" — Page /offres

Inspirée de [kdp-blackpack.amazon-kdp.fr](https://kdp-blackpack.amazon-kdp.fr), on transforme le **HERO** et la **section pricing** en style sombre premium avec urgence renforcée — sans toucher aux 20+ sections existantes (FAQ, gallery, comparateurs, outils, etc.).

### 1. Nouveau composant `BlackPackHero.tsx`

Un hero plein-écran qui **remplace** l'actuel (lignes ~401-580 de `SalesPage.tsx`) :

```text
┌────────────────────────────────────────────────┐
│            ✨ ÉDITION LIMITÉE ✨               │  ← badge doré pill
│                                                │
│        ┌──┐ ┌──┐ ┌──┐ ┌──┐                   │
│        │01│ │10│ │18│ │22│  ← Compteur géant │
│        └──┘ └──┘ └──┘ └──┘     bordure dorée  │
│         J    H    M    S                       │
│                                                │
│         Ton Ebook Mérite                      │
│         AMAZON KDP        ← jaune doré        │
│         (en moins d'1h)                       │
│                                                │
│         [Image suite outils centrale]         │
│                                                │
│   15 agents IA qui rédigent, illustrent...    │
│                                                │
│  [🚀 Générer des revenus passifs (67€)]      │
│                                                │
│   ⚡ Offre expire dans 1j 10h                │
│  ┌────────────────────────────────────────┐   │
│  │ -54%  €147 → €67  🔥 +5000 auteurs    │   │
│  └────────────────────────────────────────┘   │
└────────────────────────────────────────────────┘
       Fond noir #0a0a0a + halos dorés
```

**Caractéristiques :**
- Fond `#0a0a0a` avec halo radial doré (`hsl(38 92% 50% / 0.15)`)
- Compteur géant : 4 cases sombres bordées doré, chiffres tabulaires 60px
- Titre H1 en blanc + mot-clé "AMAZON KDP" en jaune doré (`#FFB020`)
- CTA orange/doré avec ombre dorée
- Bandeau "−54% €147 → €67" sous le CTA

### 2. Nouveau composant `BlackPackPricing.tsx`

Remplace le bloc pricing actuel par une comparaison **prix barré 147€ vs 67€** style Black Pack :

```text
   ╔════ NE PAIE PAS 147€ ════╗
   
   ┌─────────────┐    ┌──────────────┐
   │ Prix Normal │ VS │ ⭐ MEILLEUR  │
   │             │    │              │
   │ Outils  87€ │    │   −54%       │
   │ Forma.  47€ │    │              │
   │ Bonus  +13€ │    │   €67        │
   │ ─────────── │    │   à vie      │
   │ Total  147€ │    │              │
   └─────────────┘    └──────────────┘
                       ✓ Tous outils
                       ✓ Toutes formations
                       ✓ Tous bonus
                       ✓ Communauté
   
   [🚀 Je veux générer des revenus (67€)]
   
       🛡️ Garantie 30 jours · Paiement sécurisé
```

### 3. Bandeaux haut de page conservés

- **Bandeau extension Chrome** (orange→teal) : ✅ gardé tel quel
- **Top bar countdown teal** : ✅ gardé tel quel
- **UrgencyBanner rotatif** : ✅ gardé tel quel
- **Header sticky** : ✅ gardé tel quel

### 4. Sections conservées (aucune modif)

Toutes les sections après le hero restent intactes :
- HeroVideoTeaser, AgentsShowcase, EbookieAssistant
- BonusStack, KdpRoiCalculator, EbookGallery, EbookAnatomy
- ToolsCounterBanner, KdpRocketParityTable, KdpAdsTeaser
- AuthorShowcase, PriceComparison, GuaranteeSection, SalesFaq

### 5. Détails techniques

**Fichiers créés :**
- `src/components/sales/BlackPackHero.tsx` — hero sombre avec compteur géant
- `src/components/sales/BlackPackPricing.tsx` — bloc comparaison prix

**Fichiers modifiés :**
- `src/pages/SalesPage.tsx` :
  - Import des 2 nouveaux composants
  - Remplacement du hero existant (lignes ~401-580) par `<BlackPackHero />`
  - Insertion de `<BlackPackPricing />` juste avant la section `#pricing` actuelle (ou la remplace)

**Palette utilisée (cohérente avec la charte KDP existante) :**
- Fond noir : `#0a0a0a` (sections Black Pack uniquement, le reste garde `#FAFAFA`)
- Doré accent : `#FFB020` (≈ Amazon KDP orange `#FF9E2D` saturé)
- Texte blanc : `#FFFFFF` + gris clair `#D4D4D4`
- Tous les styles via **inline styles** pour bypasser les overrides CSS globaux (leçon des bandeaux précédents)

**QA visuelle après implémentation :**
- Screenshot `/offres` à 1920×1080 → vérifier hero noir + compteur lisibles
- Screenshot mobile 390×844 → vérifier le compteur reste sur 1 ligne
- Vérifier transition fluide entre section noire (hero) et fond clair (sections suivantes) via un dégradé `#0a0a0a → #FAFAFA`

### Résultat attendu

Une page `/offres` qui démarre par un **bloc hero sombre premium** type Black Pack (compteur géant, prix barré, urgence) puis enchaîne sur tout le contenu actuel inchangé. Le visiteur perçoit immédiatement l'urgence et la valeur, sans qu'on ait cassé une seule section existante.

