# 📚 Guide de Scission du Générateur d'Ebook

## Vue d'ensemble

Le générateur d'ebook est un module complet qui peut être isolé du projet principal pour être vendu comme produit autonome. Voici la structure détaillée et les étapes pour créer cette version standalone.

## 🎯 Fichiers Essentiels à Extraire

### 📄 Pages Principales
```
src/pages/
├── EbookPlannerPage.tsx        # Page principale du générateur
├── EbookIdeasPage.tsx          # Page d'idées de titres
└── ProductLandingPage.tsx      # Page de capture/vente (optionnel)
```

### 🧩 Composants Ebook
```
src/components/ebook/
├── EbookAdvancedFeatures.tsx   # Fonctionnalités avancées
├── EbookChapter.tsx           # Gestion des chapitres
├── EbookExporter.tsx          # Export PDF/EPUB
├── EbookImageBank.tsx         # Banque d'images
├── EbookKdpTools.tsx          # Outils Amazon KDP
├── EbookMarketing.tsx         # Marketing et promotion
├── EbookMonetization.tsx      # Monétisation
├── EbookSettings.tsx          # Paramètres généraux
├── EbookTemplates.tsx         # Templates prédéfinis
└── EbookWriting.tsx           # Interface d'écriture
```

### 🎣 Hook Principal
```
src/hooks/
└── useEbookGeneration.ts      # Logic métier du générateur (648 lignes)
```

### 📊 Données et Templates
```
src/data/
└── ebookTemplates.ts          # Templates de base prédéfinis
```

### 🖼️ Assets Requis
```
src/assets/
├── template-business.jpg      # Image template business
├── template-fiction.jpg       # Image template fiction
├── template-guide.jpg         # Image template guide
└── template-memoir.jpg        # Image template mémoire
```

### 🎨 Composants UI (shadcn/ui)
```
src/components/ui/
├── button.tsx
├── card.tsx
├── input.tsx
├── textarea.tsx
├── tabs.tsx
├── label.tsx
├── progress.tsx
├── select.tsx
├── checkbox.tsx
└── tooltip.tsx
```

## 🏗️ Structure du Projet Standalone

### 1. Configuration Minimale
```
ebook-generator/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/            # Composants UI shadcn
│   │   └── ebook/         # Composants ebook
│   ├── hooks/
│   │   └── useEbookGeneration.ts
│   ├── data/
│   │   └── ebookTemplates.ts
│   ├── assets/
│   │   └── templates/     # Images des templates
│   ├── pages/
│   │   ├── EbookGenerator.tsx    # Page principale
│   │   └── EbookIdeas.tsx       # Page d'idées
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### 2. Dépendances Nécessaires
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-progress": "^1.1.7",
    "lucide-react": "^0.462.0",
    "sonner": "^1.5.0",
    "clsx": "^2.1.1",
    "class-variance-authority": "^0.7.1",
    "tailwind-merge": "^2.5.2",
    "jspdf": "^3.0.1",
    "html2canvas": "^1.4.1"
  }
}
```

## 🔧 Modifications Nécessaires

### 1. Simplifier la Navigation
```tsx
// Remplacer useNavigate par une navigation simple
const navigate = (path: string) => {
  window.location.hash = path;
};
```

### 2. Gestion des API Keys
```tsx
// Créer un composant de configuration API
const ApiKeyManager = () => {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('ebook_openai_key') || ''
  );
  
  return (
    <div className="mb-6 p-4 border rounded-lg">
      <Label>Clé API OpenAI</Label>
      <Input 
        type="password"
        value={apiKey}
        onChange={(e) => {
          setApiKey(e.target.value);
          localStorage.setItem('ebook_openai_key', e.target.value);
        }}
        placeholder="sk-..."
      />
    </div>
  );
};
```

### 3. Design System Simplifié
```css
/* index.css - Version allégée */
:root {
  --primary: 220 90% 56%;
  --secondary: 210 40% 98%;
  --accent: 210 40% 78%;
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --muted: 210 40% 96%;
  --border: 214 32% 91%;
  --card: 0 0% 100%;
}

.gradient-hero {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
}
```

## 💰 Fonctionnalités Commerciales à Ajouter

### 1. Système de Licensing
```tsx
const useLicense = () => {
  const [isLicensed, setIsLicensed] = useState(false);
  const [trialExpired, setTrialExpired] = useState(false);
  
  const checkLicense = () => {
    // Vérification de license
    const licenseKey = localStorage.getItem('ebook_license');
    // Logique de validation
  };
  
  return { isLicensed, trialExpired, checkLicense };
};
```

### 2. Limitations Version Trial
```tsx
const TRIAL_LIMITS = {
  maxChapters: 5,
  maxExports: 3,
  maxGenerations: 10
};
```

### 3. Page de Vente Intégrée
```tsx
const PricingModal = ({ onUpgrade }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Débloquez toutes les fonctionnalités</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold">€97</div>
          <div className="text-muted-foreground">Licence à vie</div>
        </div>
        <ul className="space-y-2 mb-6">
          <li>✅ Chapitres illimités</li>
          <li>✅ Export PDF/EPUB</li>
          <li>✅ Outils Amazon KDP</li>
          <li>✅ Templates premium</li>
          <li>✅ Support prioritaire</li>
        </ul>
        <Button onClick={onUpgrade} className="w-full">
          Acheter maintenant
        </Button>
      </CardContent>
    </Card>
  </div>
);
```

## 🚀 Étapes de Déploiement

### 1. Extraction du Code
1. Créer un nouveau projet Vite + React
2. Copier tous les fichiers listés ci-dessus
3. Adapter les imports et la navigation
4. Tester toutes les fonctionnalités

### 2. Configuration du Build
```typescript
// vite.config.ts
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-tabs', 'lucide-react']
        }
      }
    }
  }
});
```

### 3. Distribution
- **Version Desktop** : Electron wrapper
- **Version Web** : Hébergement sur Vercel/Netlify
- **Version SaaS** : Backend avec authentification

## 📈 Stratégie de Prix

### Version Basique (€47)
- 10 chapitres max
- 3 exports par mois
- Templates de base

### Version Pro (€97)
- Chapitres illimités
- Export illimité
- Outils KDP complets
- Templates premium

### Version Agency (€197)
- Licence commerciale
- White-label
- Support prioritaire
- Formations incluses

## 🎯 Points Clés pour la Vente

1. **Autonomie Complète** : Fonctionne sans serveur backend
2. **Facilité d'Installation** : Un seul téléchargement
3. **Données Locales** : Tout reste sur l'ordinateur de l'utilisateur
4. **API OpenAI** : L'utilisateur utilise sa propre clé
5. **Export Professionnel** : PDF et EPUB de qualité

## 📝 Documentation Utilisateur

Créer une documentation simple avec :
- Guide d'installation
- Configuration de l'API OpenAI
- Tutoriel pas à pas
- FAQ et support

Cette structure vous permet de créer un produit autonome et vendable tout en gardant les fonctionnalités essentielles du générateur d'ebook.