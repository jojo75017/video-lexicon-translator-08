import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Accueil from '@/pages/Accueil';
import ContactPage from '@/pages/ContactPage';
import BlogPage from '@/pages/BlogPage';
import PolitiqueConfidentialite from '@/pages/PolitiqueConfidentialite';
import MentionsLegales from '@/pages/MentionsLegales';
import PlanDuSite from '@/pages/PlanDuSite';
import CategorieBlogPage from '@/pages/CategorieBlogPage';
import ArticleBlogPage from '@/pages/ArticleBlogPage';
import PinterestPage from '@/pages/PinterestPage';
import ImageGeneratorPage from '@/pages/ImageGeneratorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/plan-du-site" element={<PlanDuSite />} />
        <Route path="/blog/categorie/:categorieSlug" element={<CategorieBlogPage />} />
        <Route path="/blog/article/:articleSlug" element={<ArticleBlogPage />} />
        <Route path="/pinterest" element={<PinterestPage />} />
        <Route path="/image-generator" element={<ImageGeneratorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
