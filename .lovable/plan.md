

# État des lieux — Améliorations réelles possibles

## Ce qui fonctionne (acquis solides)
- Générateur d'ebooks complet avec chapitres, templates, drag & drop
- Export PDF/DOCX/EPUB fonctionnel
- Couvertures, 4e de couverture, Calibre EPUB
- Formats KDP : Atlas, Encyclopédie, Coloriage, Documentaire
- Traduction multi-langues, personnages, séries
- Workflow IA éditorial complet
- Authentification, projets sauvegardés en base
- Audio, checklist pré-publication KDP

## Points critiques à améliorer (VRAIS problèmes, pas du factice)

### 1. Données factices dans les modules SEO/Analyse
Plusieurs utilitaires retournent des **`Math.random()`** au lieu de vraies données :
- `contentAnalyzer.ts` : qualité du contenu (grammaire, orthographe, unicité) = **100% aléatoire**
- `mobileAnalyzer.ts` : score mobile = **aléatoire**
- `keywordAnalyzer.ts` / `keywordExtractor.ts` : volumes de recherche, difficulté, CPC = **inventés**
- `openaiService.ts` : score SEO, densité mots-clés = **aléatoire**
- `analyticsAnalyzer.ts` : visiteurs, pages vues = **simulées**
- `healthUtils.ts` : métriques santé = **valeurs fixes codées en dur**

**Action** : Soit supprimer ces modules SEO non utilisés par le générateur d'ebooks, soit les connecter à Lovable AI pour de vraies analyses.

### 2. Fallbacks simulés dans les composants ebook
- `EbookABTesting.tsx` : quand l'IA échoue, les scores sont **aléatoires**
- `EbookArcManager.tsx` : analyse de titre en fallback = **score random**
- `EbookAmazonAdsSimulator.tsx` : mots-clés générés par **simulation avec délai artificiel**

**Action** : Remplacer les fallbacks random par des appels Lovable AI (Gemini/GPT) qui donneront de vraies analyses.

### 3. UX du fichier EbookPlannerPage.tsx
Le fichier fait **3149 lignes** — c'est un monolithe difficile à maintenir. Risque de bugs et lenteur.

**Action** : Découper en sous-composants (header, section plan, section chapitres, etc.)

### 4. Exports — Qualité professionnelle
L'export PDF/DOCX existe mais pourrait être amélioré :
- Typographie française automatique (guillemets «», espaces insécables avant : ; ! ?)
- Table des matières cliquable dans le PDF
- Numérotation de pages cohérente

### 5. Sauvegarde automatique
Vérifier que l'auto-save fonctionne sans perte de données, surtout sur les gros projets.

### 6. Pages orphelines dans App.tsx
~60 pages sont importées dont beaucoup ne servent pas au générateur d'ebooks (SEO, CRM, Pinterest, Dashboard, etc.). Elles alourdissent le bundle même avec le lazy loading.

**Action** : Nettoyer les routes inutilisées pour alléger l'application.

---

## Recommandation prioritaire (stabilisation)

Conformément à votre stratégie de stabilisation :

1. **Supprimer les modules SEO factices** — ne garder que ce qui sert vraiment au générateur
2. **Remplacer les 3 fallbacks random** des outils ebook par Lovable AI
3. **Nettoyer les routes orphelines** de App.tsx
4. **Refactorer EbookPlannerPage.tsx** en sous-composants

Aucune de ces actions n'ajoute de fausse fonctionnalité — elles consolident ce qui existe.

