# 📚 Documentation Studio AI — Spécification V1 officielle (prête au développement)

Plateforme IA de documentation produit, intégrée à EbookStudio Publisher Suite mais **commercialisable indépendamment**. Un seul brief → toute la documentation, le marketing et la communication d'un produit numérique.

**Positionnement commercial (figé)** : Pack Premium indépendant à **197 €** + **démo gratuite** (1 génération courte). Cible : SaaS, plugins WordPress, apps mobiles, outils IA, API, extensions, CRM/ERP, e-learning, produits numériques. Périmètre gelé (nouveautés → V2).

## Emplacement dans l'app & commercialisation

- **Onglet dédié « Documentation Studio »** ajouté dans `HUB_TABS` de `V3HubPage.tsx` (après *Outils*, icône `Sparkles`/`FileText`), ouvrant le module en pleine largeur.
- Enregistré dans `v3ModuleRegistry.tsx` sous l'id `documentation-studio` → aussi visible dans la grille *Outils* et la *Roadmap*.
- **Vente** : nouveau pack Premium **197 €** dans `V3_UPSELL_PACKS` (`roadmapV3.ts`), affiché dans l'onglet **Offres & Packs** et le tunnel de commande V3 existant ; paiement via le système de paiement Lovable intégré.
- **Accès** : gating via `useV3Entitlement` (onglet + edge functions côté serveur). **Démo gratuite** = 1 génération courte (quota contrôlé serveur) avec CTA « Débloquer à 197 € ».

## Parcours utilisateur

**Étape 0 — Type de produit** : SaaS · Plugin WordPress · App mobile · Outil IA · Extension Chrome · API · Shopify · CRM/ERP · Plateforme e-learning · Produit numérique · Autre. Adapte questions & modèles.

1. **Projet** — nom, version, entreprise, site, slogan, langue, logo
2. **Positionnement** — vision, mission, valeurs, public cible, problème résolu, promesse, avantages
3. **Identité visuelle** — logo, couleurs, typographies, style + **Templates** : Apple · Figma · Notion · Stripe · Startup Tech · Corporate · Minimaliste · Documentation API
4. **Modules** — ajout/modif/suppression/réorg ; par module : nom, description, fonction, public, capture, icône
5. **Fonctionnalités** — nom, description, exemple, astuce, capture
6. **Agents IA** — nom, mission, personnalité, compétences, workflow, prompt système, cas d'usage
7. **Exports** (3 groupes ci-dessous)

## Livrables (étape 7)

**Documentation** : Brand Book · Manuel utilisateur · Documentation technique · FAQ · Centre d'aide
**Formats** : Word · PDF Premium · HTML · Markdown · PowerPoint
**Marketing** : Landing Page · One Page · Kit Média · Kit Affiliés · Kit Partenaires · Product Hunt · AppSumo · Présentation commerciale · Pitch investisseur · Emails de lancement
**Communication** : Scripts vidéo · Publications LinkedIn · Facebook · X

Structure Brand Book : Couverture → Copyright → Préface → Lettre du fondateur → Sommaire → Vision → Mission → Valeurs → Positionnement → Produit → Modules → Fonctionnalités → Agents IA → Design System → UX/UI → Product Blueprint → Roadmap → Glossaire → À propos.

## Fonctionnalités Premium

- **✨ Génération intelligente** : description en langage naturel → l'IA remplit toutes les sections → l'utilisateur valide/modifie.
- **🤖 Documentation Copilot** : assistant flottant tout le wizard (améliorer, compléter, proposer, enrichir) sans remplacer le contrôle utilisateur.
- **📊 Score de complétude** (style SEO) : progression, qualité, recommandations en temps réel.
- **⏱️ Estimation** avant génération : temps, pages, mots, nombre de livrables.
- **📁 Bibliothèque de projets** : projets, versions, score, exports ; actions Ouvrir · Dupliquer · Exporter · Archiver · Supprimer.
- **🔄 Mise à jour intelligente** : un élément change (ex. nouveau module) → seuls les documents concernés sont régénérés.

## Architecture technique

- Dossier dédié `src/components/documentation-studio/`, composants organisés par fonctionnalité, même architecture que les autres modules V3.
- Réutilise exporteurs **DOCX** (`ebookDocxExporter`) et **PDF** (`ebookPdfExporter`) ; ajout **PowerPoint** (`pptxgenjs`).
- Edge functions : `documentation-studio-assist` (génération intelligente + Copilot) et `documentation-studio-generate` (rédaction des livrables) via Lovable AI Gateway (`google/gemini-3-flash-preview`), auth `supabase.auth.getUser()`, gating entitlement + quota démo.
- Table `documentation_projects` (RLS `auth.uid()`, GRANT authenticated/service_role) pour bibliothèque et mise à jour intelligente.
- UX Premium, simple, responsive, palette **Clair Ambre**, respect des Design Tokens (aucune couleur en dur). Aucune donnée simulée.

## Ordre de développement (V1)

1. **Fondations UI** : onglet Hub + pack 197€ + registre, Étape 0 + wizard 7 étapes, templates, score de complétude, estimation, persistance locale. → 100 % testable.
2. **Intelligence** : edge function `documentation-studio-assist` → Génération intelligente + Copilot flottant.
3. **Génération & exports** : edge function `documentation-studio-generate` → livrables doc + marketing + communication ; assemblage Word/PDF/HTML/Markdown/PowerPoint ; page Résultats (aperçu + téléchargements + Régénérer + Modifier).
4. **Bibliothèque de projets + Mise à jour intelligente** : table `documentation_projects`, page « Mes documentations », duplication/archivage, régénération ciblée.

Je démarre par l'étape 1 dès validation, puis j'enchaîne dans cet ordre.