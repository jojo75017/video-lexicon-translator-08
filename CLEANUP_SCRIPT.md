# 🧹 Script de Nettoyage - Générateur Ebook Standalone

## Fichiers à SUPPRIMER (modules inutiles)

### Pages inutiles à supprimer
```
src/pages/AnalyticsPage.tsx
src/pages/CompetitorAnalysisPage.tsx
src/pages/CrawlerPage.tsx
src/pages/Dashboard.tsx
src/pages/EmailMarketingPage.tsx
src/pages/HierarchyPage.tsx
src/pages/KeywordGeneratorPage.tsx
src/pages/PinterestPage.tsx
src/pages/ProductGeneratorPage.tsx
src/pages/PromptsCapturePage.tsx
src/pages/PromptsGeneratorPage.tsx
src/pages/QuoraPage.tsx
src/pages/RobotsTxtPage.tsx
src/pages/SeoGeneratorPage.tsx
src/pages/SeoPage.tsx
src/pages/SerpGenerator.tsx
src/pages/SignaturePage.tsx
src/pages/SiteClonerPage.tsx
src/pages/SuggestionsPage.tsx
src/pages/TitleGeneratorPage.tsx
src/pages/WordCountPage.tsx
```

### Services inutiles à supprimer
```
src/services/contentQualityService.ts
src/services/dataForSeoService.ts
src/services/emailGeneratorService.ts
src/services/imageGeneratorService.ts
src/services/imageService.ts
src/services/modulesDiagnosticService.ts
src/services/perplexityService.ts
src/services/realCompetitorAnalysisService.ts
src/services/serpApiService.ts
src/services/simpleScraper.ts
src/services/titleGeneratorService.ts
```

### Hooks inutiles à supprimer
```
src/hooks/useCheckDomainAvailability.ts
src/hooks/useDomainSuggestions.ts
src/hooks/useIndexabilityAnalysis.ts
src/hooks/useKeywordGenerator.ts
src/hooks/useKeywordGenerator.tsx
src/hooks/useOpenAIConfig.ts
src/hooks/usePerplexityKeywords.ts
src/hooks/usePin.ts
src/hooks/usePinHistory.ts
src/hooks/usePinterestGenerator.ts
src/hooks/useProductGeneration.ts
src/hooks/useSiteAnalyzer.ts
src/hooks/useSiteAnalyzer.tsx
src/hooks/useSocialContent.ts
src/hooks/useTabNavigation.tsx
```

### Composants inutiles à supprimer
```
src/components/AdvancedKeywordTable.tsx
src/components/landing/
src/components/shared/OpenAIConfigPanel.tsx
```

### Utilitaires inutiles à supprimer
```
src/utils/ (tout sauf peut-être navigationHelpers.ts)
src/services/openai/ (sauf si utilisé par ebook)
src/types/ (sauf ceux utilisés par ebook)
```

## Fichiers à GARDER (essentiels ebook)

### Pages essentielles
```
✅ src/pages/EbookPlannerPage.tsx
✅ src/pages/EbookIdeasPage.tsx
✅ src/pages/ProductLandingPage.tsx (optionnel)
```

### Composants essentiels
```
✅ src/components/ebook/ (tous)
✅ src/components/ui/ (tous)
```

### Hooks essentiels
```
✅ src/hooks/useEbookGeneration.ts
✅ src/hooks/use-mobile.tsx (si utilisé)
```

### Données essentielles
```
✅ src/data/ebookTemplates.ts
✅ src/data/pinterestImages.ts (si utilisé par ebook)
✅ src/data/socialContentTemplates.ts (si utilisé par ebook)
```

### Assets essentiels
```
✅ src/assets/template-*.jpg
✅ src/assets/icons/ebook-ai.png
```

### Configuration essentielle
```
✅ src/index.css
✅ src/lib/utils.ts
✅ src/main.tsx
✅ tailwind.config.ts
✅ vite.config.ts
```