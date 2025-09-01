# 🚀 Script d'Extraction Rapide - Générateur d'Ebook

## Commandes de Copie des Fichiers

### 1. Créer la Structure
```bash
mkdir ebook-generator-standalone
cd ebook-generator-standalone
npm create vite@latest . -- --template react-ts
```

### 2. Fichiers à Copier depuis le Projet Source

#### Pages
```bash
cp src/pages/EbookPlannerPage.tsx ./src/pages/
cp src/pages/EbookIdeasPage.tsx ./src/pages/
```

#### Composants Ebook
```bash
mkdir -p src/components/ebook
cp src/components/ebook/*.tsx ./src/components/ebook/
```

#### Composants UI
```bash
mkdir -p src/components/ui  
cp src/components/ui/button.tsx ./src/components/ui/
cp src/components/ui/card.tsx ./src/components/ui/
cp src/components/ui/input.tsx ./src/components/ui/
cp src/components/ui/textarea.tsx ./src/components/ui/
cp src/components/ui/tabs.tsx ./src/components/ui/
cp src/components/ui/label.tsx ./src/components/ui/
cp src/components/ui/progress.tsx ./src/components/ui/
cp src/components/ui/select.tsx ./src/components/ui/
cp src/components/ui/checkbox.tsx ./src/components/ui/
cp src/components/ui/tooltip.tsx ./src/components/ui/
cp src/components/ui/sonner.tsx ./src/components/ui/
```

#### Hooks et Données
```bash
mkdir -p src/hooks src/data
cp src/hooks/useEbookGeneration.ts ./src/hooks/
cp src/data/ebookTemplates.ts ./src/data/
```

#### Assets
```bash
mkdir -p src/assets
cp src/assets/template-*.jpg ./src/assets/
```

#### Utilitaires
```bash
mkdir -p src/lib
cp src/lib/utils.ts ./src/lib/
```

### 3. Configuration Tailwind
```bash
cp tailwind.config.ts ./
cp src/index.css ./src/
```

## ⚡ App.tsx Minimal

```tsx
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EbookPlannerPage from './pages/EbookPlannerPage';
import EbookIdeasPage from './pages/EbookIdeasPage';
import { Toaster } from 'sonner';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/ebook-planner" replace />} />
          <Route path="/ebook-planner" element={<EbookPlannerPage />} />
          <Route path="/ebook-ideas" element={<EbookIdeasPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
```

## 📦 Package.json Minimal

```json
{
  "name": "ebook-generator-pro",
  "version": "1.0.0",
  "description": "Générateur d'Ebook IA Professionnel",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
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
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-slot": "^1.1.0",
    "lucide-react": "^0.462.0",
    "sonner": "^1.5.0",
    "clsx": "^2.1.1",
    "class-variance-authority": "^0.7.1",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "jspdf": "^3.0.1",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "~5.6.2",
    "vite": "^6.0.7"
  }
}
```

## 🔧 Modifications Nécessaires dans EbookPlannerPage.tsx

### Remplacer la navigation Dashboard
```tsx
// REMPLACER
<Button onClick={() => navigate('/dashboard')}>
  <ArrowLeft className="h-4 w-4 mr-2" />
  Retour
</Button>

// PAR
<Button onClick={() => navigate('/ebook-ideas')}>
  <ArrowLeft className="h-4 w-4 mr-2" />
  Idées d'Ebook
</Button>
```

### Simplifier les imports
```tsx
// SUPPRIMER les imports non nécessaires liés au dashboard
// GARDER uniquement les imports ebook
```

## 🎨 index.css Simplifié

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 220.9 39.3% 11%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 224 71.4% 4.1%;
    --radius: 0.5rem;
    
    /* Custom gradient colors */
    --vibrant-blue: 210 100% 60%;
    --vibrant-purple: 270 100% 70%;
    --vibrant-pink: 340 100% 65%;
    --vibrant-green: 140 100% 60%;
    --vibrant-cyan: 180 100% 60%;
  }
}

.gradient-hero {
  background: linear-gradient(135deg, hsl(var(--vibrant-blue)), hsl(var(--vibrant-purple)));
}

.gradient-card {
  background: linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%);
}

.glow-effect {
  box-shadow: 0 0 20px hsl(var(--primary) / 0.1);
}

.floating-animation {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

## ✅ Checklist Final

- [ ] Copier tous les fichiers listés
- [ ] Installer les dépendances
- [ ] Modifier la navigation dans EbookPlannerPage
- [ ] Tester la génération de chapitres
- [ ] Tester l'export PDF
- [ ] Vérifier les templates
- [ ] Tester avec une vraie clé OpenAI

## 🚀 Lancement

```bash
npm install
npm run dev
```

Le générateur sera accessible sur http://localhost:5173

## 💡 Améliorations Possibles

1. **Système de License** : Ajouter vérification de clé de licence
2. **Electron** : Créer version desktop
3. **Offline Mode** : Cache des templates et fonctionnalités
4. **Export Enhanced** : Plus de formats (DOCX, MOBI)
5. **Templates Premium** : Plus de catégories
6. **Analytics** : Tracking d'usage pour améliorer le produit

Cette structure vous donne un produit vendable immédiatement ! 🎯