
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil';
import HierarchyPage from './pages/HierarchyPage';
import MetricsPage from './pages/MetricsPage';
import PerformancePage from './pages/PerformancePage';
import SuggestionsPage from './pages/SuggestionsPage';
import WordCountPage from './pages/WordCountPage';
import StructurePage from './pages/StructurePage';
import AnalyticsPage from './pages/AnalyticsPage';
import OutilsSeo from './pages/OutilsSeo';
import TranslationPage from './pages/TranslationPage';
import PlanDuSite from './pages/PlanDuSite';
import BlogPage from './pages/BlogPage';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import CategorieBlogPage from './pages/CategorieBlogPage';
import ArticleBlogPage from './pages/ArticleBlogPage';
import LocalBusinessPage from './pages/LocalBusinessPage';
import PinterestPage from './pages/PinterestPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import PromptGeneratorPage from './components/image-generator/PromptGeneratorPage';
import QuoraPage from './pages/QuoraPage';
import SignaturePage from './pages/SignaturePage';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/hierarchie" element={<HierarchyPage />} />
        <Route path="/metriques" element={<MetricsPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/suggestions" element={<SuggestionsPage />} />
        <Route path="/nombre-mots" element={<WordCountPage />} />
        <Route path="/structure" element={<StructurePage />} />
        <Route path="/analytique" element={<AnalyticsPage />} />
        <Route path="/outils-seo" element={<OutilsSeo />} />
        <Route path="/traduction" element={<TranslationPage />} />
        <Route path="/plan-du-site" element={<PlanDuSite />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/blog/categorie/:categorie" element={<CategorieBlogPage />} />
        <Route path="/blog/:slug" element={<ArticleBlogPage />} />
        <Route path="/entreprises-locales" element={<LocalBusinessPage />} />
        <Route path="/pinterest" element={<PinterestPage />} />
        <Route path="/quora" element={<QuoraPage />} />
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/generateur-images" element={<ImageGeneratorPage />} />
        <Route path="/generateur-prompts" element={<PromptGeneratorPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
