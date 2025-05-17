
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import InternalLinkingPage from './pages/InternalLinkingPage';
import KeywordGeneratorPage from './pages/KeywordGeneratorPage';
import PinterestPage from './pages/PinterestPage';
import SignaturePage from './pages/SignaturePage';
import KeywordMetaPage from './pages/KeywordMetaPage';
import SeoPage from './pages/SeoPage'; 
import OutilsSeo from './pages/OutilsSeo';
import './App.css';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Routes principales */}
        <Route path="/" element={<Index />} />
        <Route path="/hierarchy" element={<Index />} />
        <Route path="/internal-linking" element={<InternalLinkingPage />} />
        <Route path="/keyword-generator" element={<KeywordGeneratorPage />} />
        <Route path="/pinterest" element={<PinterestPage />} />
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/keyword-meta" element={<KeywordMetaPage />} />
        <Route path="/seo" element={<SeoPage />} />
        <Route path="/outils-seo" element={<OutilsSeo />} />
        
        {/* Routes secondaires */}
        <Route path="/performance" element={<SeoPage />} />
        <Route path="/analytics" element={<Index />} />
        <Route path="/tracking" element={<Index />} />
        <Route path="/wordcount" element={<Index />} />
        <Route path="/suggestions" element={<Index />} />
        <Route path="/structure" element={<Index />} />
        <Route path="/backlinks" element={<Index />} />
        <Route path="/metrics" element={<Index />} />
        <Route path="/quora" element={<Index />} />
        
        {/* Routes localisées (français) */}
        <Route path="/hierarchie" element={<Index />} />
        <Route path="/nombre-mots" element={<Index />} />
        <Route path="/liens-internes" element={<InternalLinkingPage />} />
        <Route path="/metriques" element={<SeoPage />} />
      </Routes>
    </Router>
  );
};

export default App;
